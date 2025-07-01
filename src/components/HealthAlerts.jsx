import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, TrendingUp, Users, Thermometer, Wind } from 'lucide-react';
import axios from 'axios';

const HealthAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const alertTypes = ['Outbreak', 'Pollution', 'Weather', 'Epidemic', 'Advisory'];

  useEffect(() => {
    fetchHealthAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, selectedType]);

  const fetchHealthAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/health-alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching health alerts:', error);
      // Mock data for demo
      setAlerts([
        {
          id: 1,
          title: 'Flu Outbreak Alert - Downtown Area',
          description: 'Increased flu cases reported in downtown hospitals. Practice good hygiene and consider flu vaccination.',
          alert_type: 'Outbreak',
          location: 'Downtown District',
          severity: 'medium',
          created_at: '2024-01-15T08:00:00'
        },
        {
          id: 2,
          title: 'High Air Pollution Warning',
          description: 'Air quality index exceeds unhealthy levels. Sensitive individuals should limit outdoor activities.',
          alert_type: 'Pollution',
          location: 'City-wide',
          severity: 'high',
          created_at: '2024-01-15T06:30:00'
        },
        {
          id: 3,
          title: 'Cold Weather Health Advisory',
          description: 'Extreme cold temperatures expected. Watch for signs of hypothermia and frostbite.',
          alert_type: 'Weather',
          location: 'Metropolitan Area',
          severity: 'medium',
          created_at: '2024-01-14T18:00:00'
        },
        {
          id: 4,
          title: 'COVID-19 Variant Detected',
          description: 'New COVID-19 variant cases confirmed in the region. Continue following safety protocols.',
          alert_type: 'Epidemic',
          location: 'Regional',
          severity: 'high',
          created_at: '2024-01-14T12:00:00'
        },
        {
          id: 5,
          title: 'Mental Health Awareness Week',
          description: 'Free mental health screenings available at community centers. Support resources provided.',
          alert_type: 'Advisory',
          location: 'Community Centers',
          severity: 'low',
          created_at: '2024-01-13T09:00:00'
        },
        {
          id: 6,
          title: 'Water Quality Notice',
          description: 'Temporary water quality issues in select neighborhoods. Boil water before consumption.',
          alert_type: 'Advisory',
          location: 'East Side Neighborhoods',
          severity: 'medium',
          created_at: '2024-01-12T15:30:00'
        }
      ]);
    }
    setLoading(false);
  };

  const filterAlerts = () => {
    if (selectedType) {
      setFilteredAlerts(alerts.filter(alert => alert.alert_type === selectedType));
    } else {
      setFilteredAlerts(alerts);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'low': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSeverityIcon = (type) => {
    switch (type) {
      case 'Outbreak': return AlertTriangle;
      case 'Epidemic': return Users;
      case 'Pollution': return Wind;
      case 'Weather': return Thermometer;
      case 'Advisory': return TrendingUp;
      default: return AlertTriangle;
    }
  };

  const getTimeAgo = (dateStr) => {
    const now = new Date();
    const alertDate = new Date(dateStr);
    const diffInHours = Math.floor((now - alertDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (loading) {
    return React.createElement(
      'div',
      { className: 'flex items-center justify-center min-h-screen' },
      React.createElement(
        'div',
        { className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600' }
      )
    );
  }

  const AlertCard = ({ alert }) => {
    const IconComponent = getSeverityIcon(alert.alert_type);
    
    return React.createElement(
      'div',
      { className: 'bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300' },
      React.createElement(
        'div',
        { className: 'flex items-start justify-between mb-4' },
        React.createElement(
          'div',
          { className: 'flex items-center space-x-3' },
          React.createElement(
            'div',
            { className: `p-2 rounded-lg bg-gradient-to-r ${getSeverityColor(alert.severity)}` },
            React.createElement(IconComponent, { className: 'h-5 w-5 text-white' })
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'h3',
              { className: 'text-lg font-bold text-gray-900' },
              alert.title
            ),
            React.createElement(
              'div',
              { className: 'flex items-center space-x-4 text-sm text-gray-500 mt-1' },
              React.createElement(
                'div',
                { className: 'flex items-center' },
                React.createElement(MapPin, { className: 'h-4 w-4 mr-1' }),
                React.createElement('span', null, alert.location)
              ),
              React.createElement(
                'div',
                { className: 'flex items-center' },
                React.createElement(Clock, { className: 'h-4 w-4 mr-1' }),
                React.createElement('span', null, getTimeAgo(alert.created_at))
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'flex items-center space-x-2' },
          React.createElement(
            'span',
            { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              alert.severity === 'high' ? 'bg-red-100 text-red-800' :
              alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }` },
            alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)
          ),
          React.createElement(
            'span',
            { className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800' },
            alert.alert_type
          )
        )
      ),
      React.createElement(
        'p',
        { className: 'text-gray-600 mb-4' },
        alert.description
      ),
      React.createElement(
        'div',
        { className: 'flex items-center justify-between pt-4 border-t border-gray-200' },
        React.createElement(
          'button',
          { className: 'text-blue-600 hover:text-blue-700 text-sm font-medium' },
          'View Details'
        ),
        React.createElement(
          'button',
          { className: 'text-gray-500 hover:text-gray-700 text-sm' },
          'Share Alert'
        )
      )
    );
  };

  return React.createElement(
    'div',
    { className: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8' },
    React.createElement(
      'div',
      { className: 'mb-8' },
      React.createElement(
        'h1',
        { className: 'text-3xl font-bold text-gray-900 mb-2 flex items-center' },
        React.createElement(AlertTriangle, { className: 'h-8 w-8 text-red-600 mr-3' }),
        'Health Alerts & Notifications'
      ),
      React.createElement(
        'p',
        { className: 'text-gray-600' },
        'Stay informed about health risks, outbreaks, and safety advisories in your area'
      )
    ),

    // Alert Stats
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-8' },
      React.createElement(
        'div',
        { className: 'bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white' },
        React.createElement(
          'div',
          { className: 'text-2xl font-bold' },
          filteredAlerts.filter(a => a.severity === 'high').length
        ),
        React.createElement(
          'div',
          { className: 'text-sm opacity-90' },
          'High Priority'
        )
      ),
      React.createElement(
        'div',
        { className: 'bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white' },
        React.createElement(
          'div',
          { className: 'text-2xl font-bold' },
          filteredAlerts.filter(a => a.severity === 'medium').length
        ),
        React.createElement(
          'div',
          { className: 'text-sm opacity-90' },
          'Medium Priority'
        )
      ),
      React.createElement(
        'div',
        { className: 'bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white' },
        React.createElement(
          'div',
          { className: 'text-2xl font-bold' },
          filteredAlerts.filter(a => a.alert_type === 'Outbreak').length
        ),
        React.createElement(
          'div',
          { className: 'text-sm opacity-90' },
          'Active Outbreaks'
        )
      ),
      React.createElement(
        'div',
        { className: 'bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white' },
        React.createElement(
          'div',
          { className: 'text-2xl font-bold' },
          filteredAlerts.length
        ),
        React.createElement(
          'div',
          { className: 'text-sm opacity-90' },
          'Total Alerts'
        )
      )
    ),

    // Filter Section
    React.createElement(
      'div',
      { className: 'bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100 mb-8' },
      React.createElement(
        'div',
        { className: 'flex items-center space-x-4' },
        React.createElement(
          'span',
          { className: 'text-sm font-medium text-gray-700' },
          'Filter by type:'
        ),
        React.createElement(
          'select',
          {
            value: selectedType,
            onChange: (e) => setSelectedType(e.target.value),
            className: 'px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          },
          React.createElement('option', { value: '' }, 'All Types'),
          alertTypes.map(type =>
            React.createElement('option', { key: type, value: type }, type)
          )
        ),
        React.createElement(
          'span',
          { className: 'text-sm text-gray-600' },
          `${filteredAlerts.length} alerts found`
        )
      )
    ),

    // Alerts Grid
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8' },
      filteredAlerts.map(alert =>
        React.createElement(AlertCard, { key: alert.id, alert })
      )
    ),

    // Emergency Contacts
    React.createElement(
      'div',
      { className: 'bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white' },
      React.createElement(
        'h2',
        { className: 'text-xl font-bold mb-4' },
        '🚨 Emergency Contacts'
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
        React.createElement(
          'div',
          { className: 'bg-white/20 rounded-lg p-4' },
          React.createElement(
            'div',
            { className: 'font-bold text-lg' },
            'Emergency Services'
          ),
          React.createElement(
            'div',
            { className: 'text-sm opacity-90 mb-2' },
            'Life-threatening emergencies'
          ),
          React.createElement(
            'button',
            {
              onClick: () => window.open('tel:911', '_self'),
              className: 'bg-white text-purple-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors'
            },
            'Call 911'
          )
        ),
        React.createElement(
          'div',
          { className: 'bg-white/20 rounded-lg p-4' },
          React.createElement(
            'div',
            { className: 'font-bold text-lg' },
            'Poison Control'
          ),
          React.createElement(
            'div',
            { className: 'text-sm opacity-90 mb-2' },
            'Poisoning emergencies'
          ),
          React.createElement(
            'button',
            {
              onClick: () => window.open('tel:1-800-222-1222', '_self'),
              className: 'bg-white text-purple-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors'
            },
            'Call 1-800-222-1222'
          )
        ),
        React.createElement(
          'div',
          { className: 'bg-white/20 rounded-lg p-4' },
          React.createElement(
            'div',
            { className: 'font-bold text-lg' },
            'Crisis Helpline'
          ),
          React.createElement(
            'div',
            { className: 'text-sm opacity-90 mb-2' },
            'Mental health support'
          ),
          React.createElement(
            'button',
            {
              onClick: () => window.open('tel:988', '_self'),
              className: 'bg-white text-purple-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors'
            },
            'Call 988'
          )
        )
      )
    )
  );
};

export default HealthAlerts;