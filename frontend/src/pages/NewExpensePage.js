import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';

const NewExpensePage = () => {
  const [FormData, SetFormData] = useState({
    Amount: '',
    Department: '',
    DateConsumed: '',
    Description: '',
    ExpenseType: 'Miscellaneous',
    LinkedCashRequestId: '',
  });
  const [CashRequests, SetCashRequests] = useState([]);
  const [Error, SetError] = useState('');
  const [IsLoading, SetIsLoading] = useState(false);

  const Navigate = useNavigate();

  useEffect(() => {
    LoadCashRequests();
  }, []);

  const LoadCashRequests = async () => {
    try {
      const Response = await ApiService.GetCashRequests();
      SetCashRequests(Response.Data?.CashRequests || []);
    } catch (Error) {
      console.error('Error loading cash requests:', Error);
    }
  };

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
      const SubmitData = { ...FormData };
      if (!SubmitData.LinkedCashRequestId) {
        delete SubmitData.LinkedCashRequestId;
      }

      const Response = await ApiService.CreateExpense(SubmitData);
      if (Response.Success) {
        // Navigate to expenses page with a refresh parameter
        Navigate('/expenses?refresh=true');
      } else {
        SetError(Response.Message || 'Failed to create expense');
      }
    } catch (Error) {
      SetError(Error.response?.data?.Message || 'Failed to create expense');
      console.error('Error creating expense:', Error);
    } finally {
      SetIsLoading(false);
    }
  };

  return (
    <div className="Container">
      <div className="FormContainer">
        <h2 className="FormTitle">New Expense</h2>
        
        {Error && (
          <div className="Alert AlertError">
            {Error}
          </div>
        )}

        <form onSubmit={HandleSubmit}>
          <div className="FormGroup">
            <label className="FormLabel">Amount</label>
            <input
              type="number"
              name="Amount"
              className="FormInput"
              value={FormData.Amount}
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
            <label className="FormLabel">Date Consumed</label>
            <input
              type="date"
              name="DateConsumed"
              className="FormInput"
              value={FormData.DateConsumed}
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
            <label className="FormLabel">Linked Cash Request (Optional)</label>
            <select
              name="LinkedCashRequestId"
              className="FormSelect"
              value={FormData.LinkedCashRequestId}
              onChange={HandleChange}
            >
              <option key="none" value="">None</option>
              {CashRequests.map((Request, Index) => {
                const CashRequestId = Request.CashRequestId ?? Request.cashrequestid ?? Request.Id ?? Request.id ?? Index;
                const Description = Request.Description ?? Request.description;
                return (
                <option key={CashRequestId} value={CashRequestId}>
                  #{CashRequestId} - {Description ? Description.substring(0, 50) : ''}
                </option>
              );})}
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
              placeholder="Describe this expense"
            />
          </div>

          <button
            type="submit"
            className="FormButton"
            disabled={IsLoading}
          >
            {IsLoading ? 'Creating...' : 'Create Expense'}
          </button>

          <button
            type="button"
            className="FormButton"
            style={{ background: '#6c757d', marginTop: '1rem' }}
            onClick={() => Navigate('/expenses')}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewExpensePage;