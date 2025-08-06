const Photo = require('@src/models/Photo');
const User = require('@src/models/User');

// Upload photo
exports.uploadPhoto = async (req, res) => {
  try {
    const { imageData, gender, age } = req.body;
    const userId = req.user.userId; // From JWT middleware

    // Validate image size (1MB limit for base64)
    if (Buffer.from(imageData, 'base64').length > 1 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image size exceeds 1MB limit' });
    }

    const photo = new Photo({ userId, imageData, gender, age });
    await photo.save();
    res.status(201).json({ message: 'Photo uploaded successfully', photoId: photo._id });
  } catch (error) {
    res.status(500).json({ error: 'Photo upload failed: ' + error.message });
  }
};

// Rate photo
exports.ratePhoto = async (req, res) => {
  try {
    const { photoId, score } = req.body;
    const userId = req.user.userId; // From JWT middleware

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Check if user already rated this photo
    if (photo.ratings.some(rating => rating.userId.toString() === userId)) {
      return res.status(400).json({ error: 'You have already rated this photo' });
    }

    // Check if user is rating their own photo
    if (photo.userId.toString() === userId) {
      return res.status(400).json({ error: 'You cannot rate your own photo' });
    }

    // Add rating
    photo.ratings.push({ userId, score });
    photo.averageScore = photo.ratings.reduce((sum, rating) => sum + rating.score, 0) / photo.ratings.length;
    await photo.save();

    // Update user points (1 point per rating given)
    await User.findByIdAndUpdate(userId, { $inc: { points: 1 } });

    // Decrease points of photo owner (1 point per rating received)
    await User.findByIdAndUpdate(photo.userId, { $inc: { points: -1 } });

    res.json({ message: 'Rating added', averageScore: photo.averageScore });
  } catch (error) {
    res.status(500).json({ error: 'Rating failed: ' + error.message });
  }
};

// Get next photo for rating with filters
exports.getNextPhoto = async (req, res) => {
  try {
    const { gender, minAge, maxAge } = req.query;
    const userId = req.user.userId; // From JWT middleware

    const query = {
      isActive: true,
      userId: { $ne: userId }, // Exclude user's own photos
      ratings: { $not: { $elemMatch: { userId } } }, // Exclude photos already rated by user
    };

    if (gender) query.gender = gender;
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }

    const photo = await Photo.findOne(query).populate('userId', 'username');
    if (!photo) {
      return res.status(404).json({ error: 'No photos available for rating with the specified filters' });
    }

    res.json({
      id: photo._id,
      userId: photo.userId._id,
      username: photo.userId.username,
      imageData: photo.imageData,
      gender: photo.gender,
      age: photo.age,
      averageScore: photo.averageScore,
      uploadDate: photo.uploadDate,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch next photo: ' + error.message });
  }
};

// Get photos with filters (for general listing)
exports.getPhotos = async (req, res) => {
  try {
    const { gender, minAge, maxAge } = req.query;
    const query = {};

    if (gender) query.gender = gender;
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }

    const photos = await Photo.find(query).populate('userId', 'username');
    res.json(photos.map(photo => ({
      id: photo._id,
      userId: photo.userId._id,
      username: photo.userId.username,
      imageData: photo.imageData,
      gender: photo.gender,
      age: photo.age,
      averageScore: photo.averageScore,
      uploadDate: photo.uploadDate,
      isActive: photo.isActive,
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photos: ' + error.message });
  }
};

// Toggle photo active status for rating
exports.togglePhotoStatus = async (req, res) => {
  try {
    const { photoId, isActive } = req.body;
    const userId = req.user.userId; // From JWT middleware

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (photo.userId.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to modify this photo' });
    }

    // Check user points if trying to activate the photo
    if (isActive) {
      const user = await User.findById(userId);
      if (user.points <= 0) {
        return res.status(400).json({ error: 'You do not have enough points to activate this photo for rating' });
      }
    }

    photo.isActive = isActive;
    await photo.save();

    res.json({ message: `Photo status updated to ${isActive ? 'active' : 'inactive'}`, photoId: photo._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update photo status: ' + error.message });
  }
};

// Get rating statistics for a user
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT middleware
    const photos = await Photo.find({ userId });
    const totalPhotos = photos.length;
    const totalRatings = photos.reduce((sum, photo) => sum + photo.ratings.length, 0);
    const averageScore = totalPhotos > 0 
      ? photos.reduce((sum, photo) => sum + photo.averageScore, 0) / totalPhotos 
      : 0;

    res.json({ totalPhotos, totalRatings, averageScore });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats: ' + error.message });
  }
};
