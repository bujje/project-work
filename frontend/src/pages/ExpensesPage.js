import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ApiService from '../services/ApiService';

const ExpensesPage = () => {
  const [Expenses, SetExpenses] = useState([]);
  const [IsLoading, SetIsLoading] = useState(true);
  const [Error, SetError] = useState('');
  const [Success, SetSuccess] = useState('');

  const Location = useLocation();

  useEffect(() => {
    LoadExpenses();
  }, []);

  useEffect(() => {
    // Check if we came from a creation page with refresh parameter
    if (Location.search.includes('refresh=true')) {
      LoadExpenses();
      SetSuccess('Expense created successfully!');
      setTimeout(() => SetSuccess(''), 3000);
      // Clear the URL parameter
      window.history.replaceState({}, document.title, '/expenses');
    }
  }, [Location.search]);

  const LoadExpenses = async () => {
    try {
      const Response = await ApiService.GetExpenses();
      SetExpenses(Response.Data?.Expenses || []);
    } catch (Error) {
      SetError('Failed to load expenses');
      console.error('Error loading expenses:', Error);
    } finally {
      SetIsLoading(false);
    }
  };

  const HandleDelete = async (Id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await ApiService.DeleteExpense(Id);
      SetSuccess('Expense deleted successfully');
      LoadExpenses();
      setTimeout(() => SetSuccess(''), 3000);
    } catch (Error) {
      SetError('Failed to delete expense');
      console.error('Error deleting expense:', Error);
    }
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
        <div className="Loading">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="Container">
      <div className="Card">
        <div className="CardHeader">
          <h2 className="CardTitle">Expenses</h2>
          <Link to="/expenses/new" className="Button ButtonSuccess">
            + New Expense
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

        {Expenses.length === 0 ? (
          <div className="CardBody">
            <p style={{ textAlign: 'center', color: '#666' }}>
              No expenses found. Create your first expense!
            </p>
          </div>
        ) : (
          <div className="Table">
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Department</th>
                  <th>Date Consumed</th>
                  <th>Type</th>
                  <th>Linked Request</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Expenses.map((Expense, Index) => {
                  const ExpenseId = Expense.ExpenseId ?? Expense.expenseid ?? Expense.Id ?? Expense.id ?? Index;
                  const Department = Expense.Department ?? Expense.department;
                  const DateConsumed = Expense.DateConsumed ?? Expense.dateconsumed;
                  const ExpenseType = Expense.ExpenseType ?? Expense.expensetype;
                  const LinkedCashRequestId = Expense.LinkedCashRequestId ?? Expense.linkedcashrequestid;
                  const Description = Expense.Description ?? Expense.description;
                  const Amount = Expense.Amount ?? Expense.amount ?? (typeof Expense.AmountEncrypted === 'number' ? Expense.AmountEncrypted : Expense.Amount);
                  return (
                  <tr key={ExpenseId}>
                    <td>{FormatCurrency(Amount || 0)}</td>
                    <td>{Department}</td>
                    <td>{FormatDate(DateConsumed)}</td>
                    <td>{ExpenseType}</td>
                    <td>
                      {LinkedCashRequestId ? (
                        <span className="Badge BadgeCompleted">
                          #{LinkedCashRequestId}
                        </span>
                      ) : (
                        <span style={{ color: '#999' }}>None</span>
                      )}
                    </td>
                    <td>{Description ? Description.substring(0, 50) + '...' : ''}</td>
                    <td>
                      <button
                        onClick={() => HandleDelete(ExpenseId)}
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

export default ExpensesPage;