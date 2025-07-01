import React, { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, Calendar, Phone, MapPin } from 'lucide-react';
import { authService } from '../services/authService.js';

const AuthModal = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(loginData);
      onLogin(response.user, response.token);
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = registerData;
      const response = await authService.register(dataToSend);
      onLogin(response.user, response.token);
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, type = 'text', placeholder, value, onChange, required = false }) => {
    return React.createElement(
      'div',
      { className: 'relative' },
      React.createElement(Icon, { className: 'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' }),
      React.createElement('input', {
        type,
        placeholder,
        value,
        onChange,
        required,
        className: 'w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm'
      })
    );
  };

  const SelectField = ({ icon: Icon, options, value, onChange, placeholder, required = false }) => {
    return React.createElement(
      'div',
      { className: 'relative' },
      React.createElement(Icon, { className: 'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10' }),
      React.createElement(
        'select',
        {
          value,
          onChange,
          required,
          className: 'w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm appearance-none'
        },
        React.createElement('option', { value: '', className: 'bg-gray-800' }, placeholder),
        options.map(option =>
          React.createElement('option', { key: option.value, value: option.value, className: 'bg-gray-800' }, option.label)
        )
      )
    );
  };

  return React.createElement(
    'div',
    { className: 'fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50' },
    React.createElement(
      'div',
      { className: 'bg-gradient-to-br from-slate-800/90 to-blue-900/90 backdrop-blur-md rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between mb-6' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-bold text-white' },
          isLogin ? 'Welcome Back' : 'Join SympTrack AI'
        ),
        React.createElement(
          'button',
          {
            onClick: onClose,
            className: 'text-gray-400 hover:text-white transition-colors'
          },
          React.createElement(X, { className: 'h-6 w-6' })
        )
      ),

      error && React.createElement(
        'div',
        { className: 'mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm' },
        error
      ),

      isLogin ? React.createElement(
        'form',
        { onSubmit: handleLogin, className: 'space-y-4' },
        React.createElement(InputField, {
          icon: User,
          placeholder: 'Username or Email',
          value: loginData.username,
          onChange: (e) => setLoginData(prev => ({ ...prev, username: e.target.value })),
          required: true
        }),
        React.createElement(
          'div',
          { className: 'relative' },
          React.createElement(Lock, { className: 'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' }),
          React.createElement('input', {
            type: showPassword ? 'text' : 'password',
            placeholder: 'Password',
            value: loginData.password,
            onChange: (e) => setLoginData(prev => ({ ...prev, password: e.target.value })),
            required: true,
            className: 'w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm'
          }),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => setShowPassword(!showPassword),
              className: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'
            },
            React.createElement(showPassword ? EyeOff : Eye, { className: 'h-5 w-5' })
          )
        ),
        React.createElement(
          'button',
          {
            type: 'submit',
            disabled: loading,
            className: 'w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg'
          },
          loading ? 'Signing In...' : 'Sign In'
        )
      ) : React.createElement(
        'form',
        { onSubmit: handleRegister, className: 'space-y-4' },
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-4' },
          React.createElement(InputField, {
            icon: User,
            placeholder: 'First Name',
            value: registerData.first_name,
            onChange: (e) => setRegisterData(prev => ({ ...prev, first_name: e.target.value })),
            required: true
          }),
          React.createElement(InputField, {
            icon: User,
            placeholder: 'Last Name',
            value: registerData.last_name,
            onChange: (e) => setRegisterData(prev => ({ ...prev, last_name: e.target.value })),
            required: true
          })
        ),
        React.createElement(InputField, {
          icon: User,
          placeholder: 'Username',
          value: registerData.username,
          onChange: (e) => setRegisterData(prev => ({ ...prev, username: e.target.value })),
          required: true
        }),
        React.createElement(InputField, {
          icon: Mail,
          type: 'email',
          placeholder: 'Email Address',
          value: registerData.email,
          onChange: (e) => setRegisterData(prev => ({ ...prev, email: e.target.value })),
          required: true
        }),
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-4' },
          React.createElement(InputField, {
            icon: Calendar,
            type: 'date',
            placeholder: 'Date of Birth',
            value: registerData.date_of_birth,
            onChange: (e) => setRegisterData(prev => ({ ...prev, date_of_birth: e.target.value }))
          }),
          React.createElement(SelectField, {
            icon: User,
            options: [
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' }
            ],
            value: registerData.gender,
            onChange: (e) => setRegisterData(prev => ({ ...prev, gender: e.target.value })),
            placeholder: 'Gender'
          })
        ),
        React.createElement(InputField, {
          icon: Phone,
          type: 'tel',
          placeholder: 'Phone Number',
          value: registerData.phone,
          onChange: (e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))
        }),
        React.createElement(InputField, {
          icon: MapPin,
          placeholder: 'Address',
          value: registerData.address,
          onChange: (e) => setRegisterData(prev => ({ ...prev, address: e.target.value }))
        }),
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-4' },
          React.createElement(InputField, {
            icon: MapPin,
            placeholder: 'City',
            value: registerData.city,
            onChange: (e) => setRegisterData(prev => ({ ...prev, city: e.target.value }))
          }),
          React.createElement(InputField, {
            icon: MapPin,
            placeholder: 'State',
            value: registerData.state,
            onChange: (e) => setRegisterData(prev => ({ ...prev, state: e.target.value }))
          })
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-4' },
          React.createElement(InputField, {
            icon: MapPin,
            placeholder: 'Country',
            value: registerData.country,
            onChange: (e) => setRegisterData(prev => ({ ...prev, country: e.target.value }))
          }),
          React.createElement(InputField, {
            icon: MapPin,
            placeholder: 'Postal Code',
            value: registerData.postal_code,
            onChange: (e) => setRegisterData(prev => ({ ...prev, postal_code: e.target.value }))
          })
        ),
        React.createElement(
          'div',
          { className: 'relative' },
          React.createElement(Lock, { className: 'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' }),
          React.createElement('input', {
            type: showPassword ? 'text' : 'password',
            placeholder: 'Password',
            value: registerData.password,
            onChange: (e) => setRegisterData(prev => ({ ...prev, password: e.target.value })),
            required: true,
            className: 'w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm'
          }),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => setShowPassword(!showPassword),
              className: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'
            },
            React.createElement(showPassword ? EyeOff : Eye, { className: 'h-5 w-5' })
          )
        ),
        React.createElement(InputField, {
          icon: Lock,
          type: 'password',
          placeholder: 'Confirm Password',
          value: registerData.confirmPassword,
          onChange: (e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value })),
          required: true
        }),
        React.createElement(
          'button',
          {
            type: 'submit',
            disabled: loading,
            className: 'w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg'
          },
          loading ? 'Creating Account...' : 'Create Account'
        )
      ),

      React.createElement(
        'div',
        { className: 'mt-6 text-center' },
        React.createElement(
          'p',
          { className: 'text-gray-300' },
          isLogin ? "Don't have an account? " : "Already have an account? ",
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => {
                setIsLogin(!isLogin);
                setError('');
              },
              className: 'text-blue-400 hover:text-blue-300 font-semibold transition-colors'
            },
            isLogin ? 'Sign Up' : 'Sign In'
          )
        )
      )
    )
  );
};

export default AuthModal;