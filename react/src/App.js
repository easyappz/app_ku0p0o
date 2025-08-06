import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import UploadPhoto from './pages/UploadPhoto';
import RatePhotos from './pages/RatePhotos';

const App = () => {
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to='/login' />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path='/register'
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path='/login'
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <Layout>
              <ForgotPassword />
            </Layout>
          }
        />
        <Route
          path='/reset-password'
          element={
            <Layout>
              <ResetPassword />
            </Layout>
          }
        />
        <Route
          path='/profile'
          element={
            <Layout>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path='/upload'
          element={
            <Layout>
              <ProtectedRoute>
                <UploadPhoto />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path='/rate'
          element={
            <Layout>
              <ProtectedRoute>
                <RatePhotos />
              </ProtectedRoute>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;