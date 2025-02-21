import React, { useEffect, useState } from 'react';
import './profilePage.scss';
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/slices/authSlice";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    email: 'user@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true); // New state to track loading

  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser())
        .finally(() => setLoading(false));
    }
  }, [dispatch, token]);
  console.log(user)

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!token) {
    return <p>You are not logged in. <a href="/login">Login here</a></p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (userInfo.newPassword !== userInfo.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    // Handle password change logic here (backend integration later)
    alert('Password changed successfully!');
    setUserInfo({ ...userInfo, currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="profile-page">
      <h1 className="page-title">My Profile</h1>

      {/* User Information Section */}
      <div className="profile-section">
        <h2 className="section-title">Account Information</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={user.email}
            disabled
          />
        </div>
      </div>

      {/* Change Password Section */}
      <div className="profile-section">
        <h2 className="section-title">Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={userInfo.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={userInfo.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={userInfo.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
