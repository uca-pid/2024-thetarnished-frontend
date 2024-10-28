import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, User } from './AuthContext';
import {jwtDecode} from 'jwt-decode';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  const URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${URL}authentication/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    const data = await response.json();
    const info = jwtDecode<{
      id: Uint8Array;
      firstname: string;
      lastname: string;
      email: string;
      role: 'STUDENT' | 'TEACHER' | 'ADMIN';
      isActive: boolean;
      on_vacation: boolean;
    }>(data.token);
    
    const loggedInUser: User = {
      id: info.id,
      firstName: info.firstname,
      lastName: info.lastname,
      email: info.email,
      subjects: data.user_subjects,
      schedule: data.user_schedule,
      role: info.role,
      isActive: info.isActive,
      isOnVacation: info.on_vacation,
      token: data.token,
    };

    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setIsLoggedIn(true);

    // Redirección según el rol del usuario
    const roleRoutes: { [key: string]: string } = {
      STUDENT: '/student-home',
      TEACHER: '/teacher-home',
      ADMIN: '/admin-home',
    };

    const route = roleRoutes[info.role];
    navigate(route);
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  const updateUser = (newUserData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...newUserData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
