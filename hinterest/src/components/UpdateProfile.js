import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

export default function UpdateProfile() {
  const { currentUser } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add profile update logic here
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" defaultValue={currentUser?.email} /><br /><br />
          <input type="password" placeholder="New Password" /><br /><br />
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
}