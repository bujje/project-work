import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UseAuth } from '../utils/AuthContext';
import ApiService from '../services/ApiService';

const DashboardPage = () => {
  const { User } = UseAuth();
  const [Stats, SetStats] = useState({
    TotalCashRequests: 0,
    TotalExpenses: 0,
    PendingRequests: 0,
  });
  const [IsLoading, SetIsLoading] = useState(true);

  useEffect(() => {
    LoadDashboardData();
  }, []);

  const LoadDashboardData = async () => {
    try {
      const [CashRequestsResponse, ExpensesResponse] = await Promise.all([
        ApiService.GetCashRequests(),
        ApiService.GetExpenses(),
      ]);

      const CashRequests = CashRequestsResponse.Data?.CashRequests || [];
      const Expenses = ExpensesResponse.Data?.Expenses || [];

      const PendingCount = CashRequests.filter(
        (Request) => Request.Status === 'Pending'
      ).length;

      SetStats({
        TotalCashRequests: CashRequests.length,
        TotalExpenses: Expenses.length,
        PendingRequests: PendingCount,
      });
    } catch (Error) {
      console.error('Error loading dashboard data:', Error);
    } finally {
      SetIsLoading(false);
    }
  };

  if (IsLoading) {
    return (
      <div className="Container">
        <div className="Loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="Container">
      <h1 style={{ color: 'white', marginBottom: '2rem', textAlign: 'center' }}>
        Welcome, {User?.FullName}!
      </h1>

      <div className="Dashboard">
        <div className="DashboardCard">
          <h3>{Stats.TotalCashRequests}</h3>
          <p>Total Cash Requests</p>
          <Link to="/cash-requests" className="Button ButtonPrimary" style={{ marginTop: '1rem' }}>
            View All
          </Link>
        </div>

        <div className="DashboardCard">
          <h3>{Stats.TotalExpenses}</h3>
          <p>Total Expenses</p>
          <Link to="/expenses" className="Button ButtonPrimary" style={{ marginTop: '1rem' }}>
            View All
          </Link>
        </div>

        <div className="DashboardCard">
          <h3>{Stats.PendingRequests}</h3>
          <p>Pending Requests</p>
          <Link to="/cash-requests" className="Button ButtonPrimary" style={{ marginTop: '1rem' }}>
            Review
          </Link>
        </div>
      </div>

      <div className="Card">
        <div className="CardHeader">
          <h2 className="CardTitle">Quick Actions</h2>
        </div>
        <div className="CardBody">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/cash-requests/new" className="Button ButtonSuccess">
              + New Cash Request
            </Link>
            <Link to="/expenses/new" className="Button ButtonSuccess">
              + New Expense
            </Link>
          </div>
        </div>
      </div>

      <div className="Card">
        <div className="CardHeader">
          <h2 className="CardTitle">User Information</h2>
        </div>
        <div className="CardBody">
          <p><strong>Name:</strong> {User?.FullName}</p>
          <p><strong>Email:</strong> {User?.Email}</p>
          <p><strong>Username:</strong> {User?.Username}</p>
          <p><strong>Department:</strong> {User?.Department || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;