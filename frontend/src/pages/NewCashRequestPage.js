import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';

const NewCashRequestPage = () => {
  const [FormData, SetFormData] = useState({
    AmountUsed: '',
    Department: '',
    DateOfNeeded: '',
    Description: '',
    ExpenseType: 'Miscellaneous',
  });
  const [Error, SetError] = useState('');
  const [IsLoading, SetIsLoading] = useState(false);

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
    SetIsLoading(true);

    try {
      const Response = await ApiService.CreateCashRequest(FormData);
      if (Response.Success) {
        // Navigate to cash requests page with a refresh parameter
        Navigate('/cash-requests?refresh=true');
      } else {
        SetError(Response.Message || 'Failed to create cash request');
      }
    } catch (Error) {
      SetError(Error.response?.data?.Message || 'Failed to create cash request');
      console.error('Error creating cash request:', Error);
    } finally {
      SetIsLoading(false);
    }
  };

  return (
    <div className="Container">
      <div className="FormContainer">
        <h2 className="FormTitle">New Cash Request</h2>
        
        {Error && (
          <div className="Alert AlertError">
            {Error}
          </div>
        )}

        <form onSubmit={HandleSubmit}>
          <div className="FormGroup">
            <label className="FormLabel">Amount Needed</label>
            <input
              type="number"
              name="AmountUsed"
              className="FormInput"
              value={FormData.AmountUsed}
              onChange={HandleChange}
              required
              min="0"
              step="0.01"
              placeholder="Enter amount"
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
              required
              placeholder="Enter department"
            />
          </div>

          <div className="FormGroup">
            <label className="FormLabel">Date Needed</label>
            <input
              type="date"
              name="DateOfNeeded"
              className="FormInput"
              value={FormData.DateOfNeeded}
              onChange={HandleChange}
              required
            />
          </div>

          <div className="FormGroup">
            <label className="FormLabel">Expense Type</label>
            <select
              name="ExpenseType"
              className="FormSelect"
              value={FormData.ExpenseType}
              onChange={HandleChange}
              required
            >
              <option key="Travel" value="Travel">Travel</option>
              <option key="Supplies" value="Supplies">Supplies</option>
              <option key="Miscellaneous" value="Miscellaneous">Miscellaneous</option>
              <option key="Equipment" value="Equipment">Equipment</option>
              <option key="Training" value="Training">Training</option>
              <option key="Other" value="Other">Other</option>
            </select>
          </div>

          <div className="FormGroup">
            <label className="FormLabel">Description</label>
            <textarea
              name="Description"
              className="FormTextarea"
              value={FormData.Description}
              onChange={HandleChange}
              required
              placeholder="Describe the purpose of this cash request"
            />
          </div>

          <button
            type="submit"
            className="FormButton"
            disabled={IsLoading}
          >
            {IsLoading ? 'Creating...' : 'Create Cash Request'}
          </button>

          <button
            type="button"
            className="FormButton"
            style={{ background: '#6c757d', marginTop: '1rem' }}
            onClick={() => Navigate('/cash-requests')}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewCashRequestPage;