import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="workspace-header">
      <div className="logo">Hinterest</div>
      <nav className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/workspace">Workspace</Link>
        <Link to="/account">Account</Link>
      </nav>
    </header>
  );
}