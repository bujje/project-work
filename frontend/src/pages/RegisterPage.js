import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UseAuth } from '../utils/AuthContext';

const RegisterPage = () => {
  const [FormData, SetFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    FullName: '',
    Department: '',
  });
  const [Error, SetError] = useState('');
  const [IsLoading, SetIsLoading] = useState(false);

  const { RegisterUser } = UseAuth();
  const Navigate = useNavigate();

  const HandleChange = (Event) => {
    SetFormData({
      ...FormData,
      [Event.target.name]: Event.target.value,
    });
  };

  const HandleSubmit = async (Event) => {
    Event.preventDefault();
    SetError('');

    // Validate passwords match
    if (FormData.Password !== FormData.ConfirmPassword) {
      SetError('Passwords do not match');
      return;
    }

    // Validate password length
    if (FormData.Password.length < 6) {
      SetError('Password must be at least 6 characters long');
      return;
    }

    SetIsLoading(true);

    const { ConfirmPassword, ...RegistrationData } = FormData;
    const Result = await RegisterUser(RegistrationData);

    if (Result.Success) {
      Navigate('/dashboard');
    } else {
      SetError(Result.Message || 'Registration failed. Please try again.');
    }

    SetIsLoading(false);
  };

  return (
    <div className="Container">
      <div className="FormContainer">
        <h2 className="FormTitle">Register</h2>
        
        {Error && (
          <div className="Alert AlertError">
            {Error}
          </div>
        )}

        <form onSubmit={HandleSubmit}>
          <div className="FormGroup">
            <label className="FormLabel">Username</label>
            <input
              type="text"
              name="Username"
              className="FormInput"
              value={FormData.Username}
              onChange={HandleChange}
              required
              placeholder="Choose a username"
            />
          </div>

          <div className="FormGroup">
            <label className="FormLabel">Full Name</label>
            <input
              type="text"
              name="FullName"
              className="FormInput"
              value={FormData.FullName}
              onChange={HandleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="FormGroup">
            <label className="FormLabel">Email</label>
            <input
              type="email"
              name="Email"
              className="FormInput"
              value={FormData.Email}
              onChange={HandleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="FormGroup">
            <label className="FormLabel">Department</label>
            <input
              type="text"
              name="Department"
              className="FormInput"
              value={FormData.Department}
              onChange={HandleChange}
              placeholder="Enter your department"
            />
          </div>

          <div className="FormGroup">
            <label className="FormLabel">Password</label>
            <input
              type="password"
              name="Password"
              className="FormInput"
              value={FormData.Password}
              onChange={HandleChange}
              required
              placeholder="Create a password"
            />
          </div>

          <div className="FormGroup">
            <label className="FormLabel">Confirm Password</label>
            <input
              type="password"
              name="ConfirmPassword"
              className="FormInput"
              value={FormData.ConfirmPassword}
              onChange={HandleChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="FormButton"
            disabled={IsLoading}
          >
            {IsLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="FormLink">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;