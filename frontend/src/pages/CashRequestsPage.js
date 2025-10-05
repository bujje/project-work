import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ApiService from '../services/ApiService';

const CashRequestsPage = () => {
  const [CashRequests, SetCashRequests] = useState([]);
  const [IsLoading, SetIsLoading] = useState(true);
  const [Error, SetError] = useState('');
  const [Success, SetSuccess] = useState('');

  const Location = useLocation();

  useEffect(() => {
    LoadCashRequests();
  }, []);

  useEffect(() => {
    // Check if we came from a creation page with refresh parameter
    if (Location.search.includes('refresh=true')) {
      LoadCashRequests();
      SetSuccess('Cash request created successfully!');
      setTimeout(() => SetSuccess(''), 3000);
      // Clear the URL parameter
      window.history.replaceState({}, document.title, '/cash-requests');
    }
  }, [Location.search]);

  const LoadCashRequests = async () => {
    try {
      const Response = await ApiService.GetCashRequests();
      SetCashRequests(Response.Data?.CashRequests || []);
    } catch (Error) {
      SetError('Failed to load cash requests');
      console.error('Error loading cash requests:', Error);
    } finally {
      SetIsLoading(false);
    }
  };

  const HandleDelete = async (Id) => {
    if (!window.confirm('Are you sure you want to delete this cash request?')) {
      return;
    }

    try {
      await ApiService.DeleteCashRequest(Id);
      SetSuccess('Cash request deleted successfully');
      LoadCashRequests();
      setTimeout(() => SetSuccess(''), 3000);
    } catch (Error) {
      SetError('Failed to delete cash request');
      console.error('Error deleting cash request:', Error);
    }
  };

  const GetStatusBadgeClass = (Status) => {
    const StatusMap = {
      Pending: 'BadgePending',
      Approved: 'BadgeApproved',
      Rejected: 'BadgeRejected',
      Completed: 'BadgeCompleted',
    };
    return `Badge ${StatusMap[Status] || 'BadgePending'}`;
  };

  const FormatDate = (DateString) => {
    if (!DateString) return 'N/A';
    const date = new Date(DateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const FormatCurrency = (Amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Amount);
  };

  if (IsLoading) {
    return (
      <div className="Container">
        <div className="Loading">Loading cash requests...</div>
      </div>
    );
  }

  return (
    <div className="Container">
      <div className="Card">
        <div className="CardHeader">
          <h2 className="CardTitle">Cash Requests</h2>
          <Link to="/cash-requests/new" className="Button ButtonSuccess">
            + New Request
          </Link>
        </div>

        {Error && (
          <div className="Alert AlertError">
            {Error}
          </div>
        )}

        {Success && (
          <div className="Alert AlertSuccess">
            {Success}
          </div>
        )}

        {CashRequests.length === 0 ? (
          <div className="CardBody">
            <p style={{ textAlign: 'center', color: '#666' }}>
              No cash requests found. Create your first request!
            </p>
          </div>
        ) : (
          <div className="Table">
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Department</th>
                  <th>Date Needed</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {CashRequests.map((Request, Index) => {
                  const CashRequestId = Request.CashRequestId ?? Request.cashrequestid ?? Request.Id ?? Request.id ?? Index;
                  const AmountUsed = Request.AmountUsed ?? Request.amountused ?? 0;
                  const Department = Request.Department ?? Request.department;
                  const DateOfNeeded = Request.DateOfNeeded ?? Request.dateofneeded;
                  const ExpenseType = Request.ExpenseType ?? Request.expensetype;
                  const Status = Request.Status ?? Request.status ?? 'Pending';
                  const Description = Request.Description ?? Request.description;
                  return (
                  <tr key={CashRequestId}>
                    <td>{FormatCurrency(AmountUsed)}</td>
                    <td>{Department}</td>
                    <td>{FormatDate(DateOfNeeded)}</td>
                    <td>{ExpenseType}</td>
                    <td>
                      <span className={GetStatusBadgeClass(Status)}>
                        {Status}
                      </span>
                    </td>
                    <td>{Description ? Description.substring(0, 50) + '...' : ''}</td>
                    <td>
                      <button
                        onClick={() => HandleDelete(CashRequestId)}
                        className="Button ButtonDanger"
                        style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashRequestsPage;