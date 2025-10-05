import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UseAuth } from '../utils/AuthContext';

const Navigation = () => {
  const { IsAuthenticated, User, LogoutUser } = UseAuth();
  const Navigate = useNavigate();

  const HandleLogout = async () => {
    await LogoutUser();
    Navigate('/login');
  };

  return (
    <nav className="Navigation">
      <div className="NavContent">
        <div className="NavBrand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Cash & Expense Manager
          </Link>
        </div>
        <div className="NavLinks">
          {IsAuthenticated ? (
            <>
              <Link to="/dashboard" className="NavLink">
                Dashboard
              </Link>
              <Link to="/cash-requests" className="NavLink">
                Cash Requests
              </Link>
              <Link to="/expenses" className="NavLink">
                Expenses
              </Link>
              <span className="NavLink" style={{ color: '#667eea' }}>
                {User?.FullName}
              </span>
              <button onClick={HandleLogout} className="NavButton">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="NavLink">
                Login
              </Link>
              <Link to="/register" className="NavButton" style={{ textDecoration: 'none' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;