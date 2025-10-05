import axios from 'axios';

// Prefer explicit env var. In production on Vercel, set REACT_APP_API_URL to your API base (e.g., https://your-api.example.com/api)
const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000/api');

const ApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
ApiClient.interceptors.request.use(
  (Config) => {
    const Token = localStorage.getItem('Token');
    if (Token) {
      Config.headers.Authorization = `Bearer ${Token}`;
    }
    return Config;
  },
  (Error) => {
    return Promise.reject(Error);
  }
);

// Response interceptor to handle errors
ApiClient.interceptors.response.use(
  (Response) => Response,
  (Error) => {
    if (Error.response?.status === 401) {
      localStorage.removeItem('Token');
      localStorage.removeItem('User');
      window.location.href = '/login';
    }
    return Promise.reject(Error);
  }
);

const ApiService = {
  // Authentication
  Register: async (UserData) => {
    const Response = await ApiClient.post('/auth/register', UserData);
    return Response.data;
  },

  Login: async (Credentials) => {
    const Response = await ApiClient.post('/auth/login', Credentials);
    return Response.data;
  },

  Logout: async () => {
    const Response = await ApiClient.post('/auth/logout');
    return Response.data;
  },

  GetCurrentUser: async () => {
    const Response = await ApiClient.get('/auth/me');
    return Response.data;
  },

  // Cash Requests
  GetCashRequests: async () => {
    const Response = await ApiClient.get('/cash-requests');
    return Response.data;
  },

  GetCashRequestById: async (Id) => {
    const Response = await ApiClient.get(`/cash-requests/${Id}`);
    return Response.data;
  },

  CreateCashRequest: async (CashRequestData) => {
    const Response = await ApiClient.post('/cash-requests', CashRequestData);
    return Response.data;
  },

  UpdateCashRequest: async (Id, CashRequestData) => {
    const Response = await ApiClient.put(`/cash-requests/${Id}`, CashRequestData);
    return Response.data;
  },

  DeleteCashRequest: async (Id) => {
    const Response = await ApiClient.delete(`/cash-requests/${Id}`);
    return Response.data;
  },

  GetAllCashRequests: async () => {
    const Response = await ApiClient.get('/cash-requests/all');
    return Response.data;
  },

  // Expenses
  GetExpenses: async () => {
    const Response = await ApiClient.get('/expenses');
    return Response.data;
  },

  GetExpenseById: async (Id) => {
    const Response = await ApiClient.get(`/expenses/${Id}`);
    return Response.data;
  },

  CreateExpense: async (ExpenseData) => {
    const Response = await ApiClient.post('/expenses', ExpenseData);
    return Response.data;
  },

  UpdateExpense: async (Id, ExpenseData) => {
    const Response = await ApiClient.put(`/expenses/${Id}`, ExpenseData);
    return Response.data;
  },

  DeleteExpense: async (Id) => {
    const Response = await ApiClient.delete(`/expenses/${Id}`);
    return Response.data;
  },

  GetAllExpenses: async () => {
    const Response = await ApiClient.get('/expenses/all');
    return Response.data;
  },
};

export default ApiService;