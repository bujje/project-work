import React from 'react';
import { Link } from 'react-router-dom';
import { UseAuth } from '../utils/AuthContext';

const HomePage = () => {
  const { IsAuthenticated } = UseAuth();

  return (
    <div className="Container">
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '10px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '2rem auto',
      }}>
        <h1 style={{ fontSize: '3rem', color: '#667eea', marginBottom: '1rem' }}>
          Cash & Expense Manager
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '2rem' }}>
          Manage your cash requests and expenses efficiently with our secure platform
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {IsAuthenticated ? (
            <>
              <Link to="/dashboard" className="Button ButtonPrimary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Go to Dashboard
              </Link>
              <Link to="/cash-requests" className="Button ButtonSecondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                View Cash Requests
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="Button ButtonPrimary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Get Started
              </Link>
              <Link to="/login" className="Button ButtonSecondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Login
              </Link>
            </>
          )}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'left' }}>
          <h2 style={{ color: '#333', marginBottom: '1rem' }}>Features</h2>
          <ul style={{ color: '#666', lineHeight: '2' }}>
            <li>✓ Secure user authentication with JWT</li>
            <li>✓ Create and manage cash requests</li>
            <li>✓ Track expenses linked to cash requests</li>
            <li>✓ AES-256 encryption for monetary values</li>
            <li>✓ Department-wise organization</li>
            <li>✓ Real-time dashboard statistics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;