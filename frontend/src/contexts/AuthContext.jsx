import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api.jsx';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true, error: null };
    case 'AUTH_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false, user: null };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token with the backend
          const { data } = await authAPI.verifyToken();
          dispatch({ type: 'AUTH_SUCCESS', payload: data.data });
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'AUTH_REQUEST' });
    try {
      console.log('Attempting login with:', { 
        email: credentials.email, 
        passwordLength: credentials.password?.length 
      });
      
      const response = await authAPI.login(credentials);
      const data = response.data;
      
      console.log('Login response:', data);
      
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
        return data;
      } else {
        throw new Error(data.message || 'Login failed - no token received');
      }
    } catch (error) {
      console.error('Login error in context:', error);
      let errorMessage = 'Login failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const signup = async (userData) => {
    dispatch({ type: 'AUTH_REQUEST' });
    try {
      console.log('Attempting signup with:', { 
        name: userData.name, 
        email: userData.email, 
        passwordLength: userData.password?.length 
      });
      
      const response = await authAPI.signup(userData);
      const data = response.data;
      
      console.log('Signup response:', data);
      
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
        return data;
      } else {
        throw new Error(data.message || 'Signup failed - no token received');
      }
    } catch (error) {
      console.error('Signup error in context:', error);
      let errorMessage = 'Signup failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};