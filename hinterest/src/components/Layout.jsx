import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Layout.css';
import DarkModeToggle from './DarkModeToggle';

export default function Layout() {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };
    return (
        <div className="layout-container">
            <header className="workspace-header">
                <div className="logo">Hinterest</div>
                <nav className="nav-links">
                    <Link to="/home">Home</Link>
                    <Link to="/workspace">Workspace</Link>
                    <Link to="/calendar">Calendar</Link>
                    <Link to="/chatbox">ChatBox</Link> {/* Added ChatBox link */}
                    <DarkModeToggle />
                    <div className="dropdown nav-link-style">
                        <span className="dropbtn">Account</span>
                        <div className="dropdown-content">
                            <Link to="/account/profile">Profile</Link>
                            <Link to="/account/settings">Settings</Link>
                            <Link to="/" onClick={handleLogout}>Logout</Link>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="layout-main">
                <Outlet />
            </main>
        </div>
    );
}