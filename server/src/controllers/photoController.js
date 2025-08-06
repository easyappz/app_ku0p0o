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

    // Add rating
    photo.ratings.push({ userId, score });
    photo.averageScore = photo.ratings.reduce((sum, rating) => sum + rating.score, 0) / photo.ratings.length;
    await photo.save();

    // Update user points (1 point per rating)
    await User.findByIdAndUpdate(userId, { $inc: { points: 1 } });

    res.json({ message: 'Rating added', averageScore: photo.averageScore });
  } catch (error) {
    res.status(500).json({ error: 'Rating failed: ' + error.message });
  }
};

// Get photos with filters
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
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photos: ' + error.message });
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
