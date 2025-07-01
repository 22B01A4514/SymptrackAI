import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Brain, Video, MapPin, AlertTriangle, TrendingUp, User, LogOut, LogIn } from 'lucide-react';

const Navigation = ({ currentUser, onLogin, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: currentUser ? '/' : '/public', icon: Activity, label: 'Dashboard' },
    { path: '/symptoms', icon: Brain, label: 'Symptom Checker', requiresAuth: true },
    { path: '/vlogs', icon: Video, label: 'Patient Stories' },
    { path: '/hospitals', icon: MapPin, label: 'Find Hospitals' },
    { path: '/alerts', icon: AlertTriangle, label: 'Health Alerts' },
    { path: '/risk', icon: TrendingUp, label: 'Risk Analysis', requiresAuth: true },
  ];

  return React.createElement(
    'nav',
    { className: 'bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40' },
    React.createElement(
      'div',
      { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      React.createElement(
        'div',
        { className: 'flex justify-between items-center h-16' },
        React.createElement(
          Link,
          { to: currentUser ? '/' : '/public', className: 'flex items-center space-x-3 group' },
          React.createElement(
            'div',
            { className: 'p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-200' },
            React.createElement(Activity, { className: 'h-6 w-6 text-white' })
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'span',
              { className: 'text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent' },
              'SympTrack AI'
            ),
            React.createElement(
              'div',
              { className: 'text-xs text-gray-300 font-medium' },
              'Predict, Connect & Heal'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'hidden md:flex space-x-1' },
          navItems.map(item => {
            if (item.requiresAuth && !currentUser) return null;
            
            return React.createElement(
              Link,
              {
                key: item.path,
                to: item.path,
                className: `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              },
              React.createElement(item.icon, { className: 'h-4 w-4' }),
              React.createElement('span', null, item.label)
            );
          })
        ),
        React.createElement(
          'div',
          { className: 'flex items-center space-x-4' },
          currentUser ? React.createElement(
            'div',
            { className: 'flex items-center space-x-3' },
            React.createElement(
              'div',
              { className: 'flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg backdrop-blur-sm' },
              React.createElement(
                'div',
                { className: 'w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center' },
                React.createElement(User, { className: 'h-4 w-4 text-white' })
              ),
              React.createElement(
                'div',
                null,
                React.createElement(
                  'div',
                  { className: 'text-sm font-medium text-white' },
                  currentUser.first_name, ' ', currentUser.last_name
                ),
                React.createElement(
                  'div',
                  { className: 'text-xs text-gray-300' },
                  '@', currentUser.username
                )
              )
            ),
            React.createElement(
              'button',
              {
                onClick: onLogout,
                className: 'flex items-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg transition-all duration-200 backdrop-blur-sm'
              },
              React.createElement(LogOut, { className: 'h-4 w-4' }),
              React.createElement('span', { className: 'text-sm font-medium' }, 'Logout')
            )
          ) : React.createElement(
            'button',
            {
              onClick: onLogin,
              className: 'flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg'
            },
            React.createElement(LogIn, { className: 'h-4 w-4' }),
            React.createElement('span', null, 'Sign In')
          )
        )
      )
    )
  );
};

export default Navigation;