import React, { createContext, useState, useEffect, useContext } from 'react';
import ApiService from '../services/ApiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [User, SetUser] = useState(null);
  const [IsAuthenticated, SetIsAuthenticated] = useState(false);
  const [IsLoading, SetIsLoading] = useState(true);

  useEffect(() => {
    CheckAuthentication();
  }, []);

  const NormalizeUser = (RawUser) => {
    if (!RawUser) return null;
    return {
      UserId: RawUser.UserId ?? RawUser.userid ?? RawUser.id,
      Username: RawUser.Username ?? RawUser.username,
      Email: RawUser.Email ?? RawUser.email,
      FullName: RawUser.FullName ?? RawUser.fullname ?? RawUser.name,
      Department: RawUser.Department ?? RawUser.department,
    };
  };

  const CheckAuthentication = () => {
    const Token = localStorage.getItem('Token');
    const StoredUser = localStorage.getItem('User');

    if (Token && StoredUser) {
      const Parsed = JSON.parse(StoredUser);
      const Normalized = NormalizeUser(Parsed);
      SetUser(Normalized);
      SetIsAuthenticated(true);
      // If critical fields are missing, fetch fresh profile
      const NeedsRefresh = !Normalized?.Email || !Normalized?.Username || !Normalized?.FullName;
      if (NeedsRefresh) {
        ApiService.GetCurrentUser()
          .then((Response) => {
            const CurrentUser = Response?.Data?.User || Response?.data?.Data?.User;
            const Fresh = NormalizeUser(CurrentUser);
            if (Fresh) {
              localStorage.setItem('User', JSON.stringify(Fresh));
              SetUser(Fresh);
            }
          })
          .catch(() => {})
          .finally(() => SetIsLoading(false));
      } else {
        SetIsLoading(false);
      }
      return;
    }

    if (Token && !StoredUser) {
      // Attempt to fetch current user profile
      ApiService.GetCurrentUser()
        .then((Response) => {
          const CurrentUser = Response?.Data?.User || Response?.data?.Data?.User;
          const Normalized = NormalizeUser(CurrentUser);
          if (Normalized) {
            localStorage.setItem('User', JSON.stringify(Normalized));
            SetUser(Normalized);
            SetIsAuthenticated(true);
          } else {
            SetUser(null);
            SetIsAuthenticated(false);
          }
        })
        .catch(() => {
          SetUser(null);
          SetIsAuthenticated(false);
        })
        .finally(() => SetIsLoading(false));
      return;
    }

    SetIsLoading(false);
  };

  const LoginUser = async (Email, Password) => {
    try {
      const Response = await ApiService.Login({ Email, Password });
      
      if (Response.Success) {
        const { User: UserData, Token } = Response.Data;
        localStorage.setItem('Token', Token);
        const Normalized = NormalizeUser(UserData);
        localStorage.setItem('User', JSON.stringify(Normalized));
        SetUser(Normalized);
        SetIsAuthenticated(true);
        return { Success: true };
      }
      return { Success: false, Message: Response.Message };
    } catch (Error) {
      return {
        Success: false,
        Message: Error.response?.data?.Message || 'Login failed',
      };
    }
  };

  const RegisterUser = async (UserData) => {
    try {
      const Response = await ApiService.Register(UserData);
      
      if (Response.Success) {
        const { User: NewUser, Token } = Response.Data;
        localStorage.setItem('Token', Token);
        const Normalized = NormalizeUser(NewUser);
        localStorage.setItem('User', JSON.stringify(Normalized));
        SetUser(Normalized);
        SetIsAuthenticated(true);
        return { Success: true };
      }
      return { Success: false, Message: Response.Message };
    } catch (Error) {
      return {
        Success: false,
        Message: Error.response?.data?.Message || 'Registration failed',
      };
    }
  };

  const LogoutUser = async () => {
    try {
      await ApiService.Logout();
    } catch (Error) {
      console.error('Logout error:', Error);
    } finally {
      localStorage.removeItem('Token');
      localStorage.removeItem('User');
      SetUser(null);
      SetIsAuthenticated(false);
    }
  };

  const Value = {
    User,
    IsAuthenticated,
    IsLoading,
    LoginUser,
    RegisterUser,
    LogoutUser,
  };

  return <AuthContext.Provider value={Value}>{children}</AuthContext.Provider>;
};

export const UseAuth = () => {
  const Context = useContext(AuthContext);
  if (!Context) {
    throw new Error('UseAuth must be used within an AuthProvider');
  }
  return Context;
};

export default AuthContext;