import React, { useCallback, useEffect , useState} from 'react';
import './profilePage.scss';
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/slices/authSlice";

const ProfilePage = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePasswordChange = (e) => {
    
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!token || !user) {
    return <p>You are not logged in. <a href="/login">Login here</a></p>;
  }

  return (
    <div className="profile-page">
      <h1 className="page-title">My Profile</h1>

      <div className="profile-section">
        <h2 className="section-title">Account Information</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={user.email} disabled />
        </div>
      </div>

      <div className="profile-section">
        <h2 className="section-title">Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordForm.currentPassword}
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
              value={passwordForm.newPassword}
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
              value={passwordForm.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;