import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UseAuth } from '../utils/AuthContext';

const LoginPage = () => {
  const [Email, SetEmail] = useState('');
  const [Password, SetPassword] = useState('');
  const [Error, SetError] = useState('');
  const [IsLoading, SetIsLoading] = useState(false);

  const { LoginUser } = UseAuth();
  const Navigate = useNavigate();

  const HandleSubmit = async (Event) => {
    Event.preventDefault();
    SetError('');
    SetIsLoading(true);

    const Result = await LoginUser(Email, Password);

    if (Result.Success) {
      Navigate('/dashboard');
    } else {
      SetError(Result.Message || 'Login failed. Please try again.');
    }

    SetIsLoading(false);
  };

  return (
    <div className="Container">
      <div className="FormContainer">
        <h2 className="FormTitle">Login</h2>
        
        {Error && (
          <div className="Alert AlertError">
            {Error}
          </div>
        )}

        <form onSubmit={HandleSubmit}>
          <div className="FormGroup">
            <label className="FormLabel">Email</label>
            <input
              type="email"
              className="FormInput"
              value={Email}
              onChange={(E) => SetEmail(E.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="FormGroup">
            <label className="FormLabel">Password</label>
            <input
              type="password"
              className="FormInput"
              value={Password}
              onChange={(E) => SetPassword(E.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="FormButton"
            disabled={IsLoading}
          >
            {IsLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="FormLink">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;