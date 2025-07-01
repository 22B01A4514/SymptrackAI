import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Star, Navigation, Search, Filter, Clock, Globe, Users } from 'lucide-react';
import axios from 'axios';

const HospitalFinder = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10);

  const specialties = [
    'Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
    'Oncology', 'Surgery', 'Internal Medicine', 'Family Medicine', 'ICU',
    'Dermatology', 'Psychiatry', 'Radiology', 'Pathology', 'Anesthesiology'
  ];

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation && !loading) {
      fetchHospitals();
    }
  }, [userLocation, searchRadius, selectedSpecialty]);

  useEffect(() => {
    filterHospitals();
  }, [hospitals, searchTerm]);

  const getUserLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to New York City if location access denied
          setUserLocation({
            latitude: 40.7128,
            longitude: -74.0060
          });
        }
      );
    } else {
      // Default location if geolocation not supported
      setUserLocation({
        latitude: 40.7128,
        longitude: -74.0060
      });
    }
  };

  const fetchHospitals = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/hospitals', {
        params: {
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          radius: searchRadius,
          specialty: selectedSpecialty
        }
      });
      
      setHospitals(response.data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      
      // Fallback to mock data if API fails
      const mockHospitals = [
        {
          id: 1,
          name: 'NewYork-Presbyterian Hospital',
          address: '525 E 68th St, New York, NY 10065',
          phone: '+1-212-746-5454',
          rating: 4.2,
          latitude: 40.7648,
          longitude: -73.9540,
          types: 'hospital, health, establishment',
          website: 'https://www.nyp.org',
          distance: 2.3,
          opening_hours: ['Monday: 24 hours', 'Tuesday: 24 hours', 'Wednesday: 24 hours', 'Thursday: 24 hours', 'Friday: 24 hours', 'Saturday: 24 hours', 'Sunday: 24 hours']
        },
        {
          id: 2,
          name: 'Mount Sinai Hospital',
          address: '1 Gustave L. Levy Pl, New York, NY 10029',
          phone: '+1-212-241-6500',
          rating: 4.1,
          latitude: 40.7903,
          longitude: -73.9527,
          types: 'hospital, health, establishment',
          website: 'https://www.mountsinai.org',
          distance: 3.1,
          opening_hours: ['Monday: 24 hours', 'Tuesday: 24 hours', 'Wednesday: 24 hours', 'Thursday: 24 hours', 'Friday: 24 hours', 'Saturday: 24 hours', 'Sunday: 24 hours']
        },
        {
          id: 3,
          name: 'NYU Langone Health',
          address: '550 1st Ave, New York, NY 10016',
          phone: '+1-212-263-7300',
          rating: 4.3,
          latitude: 40.7424,
          longitude: -73.9731,
          types: 'hospital, health, establishment',
          website: 'https://nyulangone.org',
          distance: 1.8,
          opening_hours: ['Monday: 24 hours', 'Tuesday: 24 hours', 'Wednesday: 24 hours', 'Thursday: 24 hours', 'Friday: 24 hours', 'Saturday: 24 hours', 'Sunday: 24 hours']
        },
        {
          id: 4,
          name: 'Memorial Sloan Kettering Cancer Center',
          address: '1275 York Ave, New York, NY 10065',
          phone: '+1-212-639-2000',
          rating: 4.5,
          latitude: 40.7648,
          longitude: -73.9540,
          types: 'hospital, health, establishment',
          website: 'https://www.mskcc.org',
          distance: 2.7,
          opening_hours: ['Monday: 8:00 AM – 6:00 PM', 'Tuesday: 8:00 AM – 6:00 PM', 'Wednesday: 8:00 AM – 6:00 PM', 'Thursday: 8:00 AM – 6:00 PM', 'Friday: 8:00 AM – 6:00 PM', 'Saturday: Closed', 'Sunday: Closed']
        }
      ];
      
      setHospitals(mockHospitals);
    }
    setLoading(false);
  };

  const filterHospitals = () => {
    let filtered = hospitals;

    if (searchTerm) {
      filtered = filtered.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hospital.types && hospital.types.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort by rating and distance
    filtered.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return (a.distance || 0) - (b.distance || 0);
    });

    setFilteredHospitals(filtered);
  };

  const searchHospitalsByQuery = async () => {
    if (!searchTerm.trim() || !userLocation) return;
    
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/hospitals/search', {
        params: {
          q: searchTerm,
          lat: userLocation.latitude,
          lng: userLocation.longitude
        }
      });
      
      setHospitals(response.data);
    } catch (error) {
      console.error('Error searching hospitals:', error);
    }
    setLoading(false);
  };

  const getDirections = (hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;
    window.open(url, '_blank');
  };

  const callHospital = (phone) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const visitWebsite = (website) => {
    if (website) {
      window.open(website, '_blank');
    }
  };

  const HospitalCard = ({ hospital }) => {
    const isOpen = hospital.opening_hours && hospital.opening_hours.some(hour => 
      hour.includes('24 hours') || hour.includes('Open')
    );

    return React.createElement(
      'div',
      { className: 'bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300' },
      React.createElement(
        'div',
        { className: 'flex items-start justify-between mb-4' },
        React.createElement(
          'div',
          { className: 'flex-1' },
          React.createElement(
            'h3',
            { className: 'text-xl font-bold text-gray-900 mb-2' },
            hospital.name
          ),
          React.createElement(
            'div',
            { className: 'flex items-center text-gray-600 mb-2' },
            React.createElement(MapPin, { className: 'h-4 w-4 mr-2 flex-shrink-0' }),
            React.createElement('span', { className: 'text-sm' }, hospital.address)
          ),
          hospital.distance && React.createElement(
            'div',
            { className: 'flex items-center text-gray-600 mb-2' },
            React.createElement(Navigation, { className: 'h-4 w-4 mr-2' }),
            React.createElement('span', { className: 'text-sm' }, `${hospital.distance} miles away`)
          ),
          React.createElement(
            'div',
            { className: 'flex items-center text-gray-600 mb-2' },
            React.createElement(Clock, { className: 'h-4 w-4 mr-2' }),
            React.createElement(
              'span',
              { className: `text-sm ${isOpen ? 'text-green-600' : 'text-red-600'}` },
              isOpen ? 'Open 24/7' : 'Check hours'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'flex flex-col items-end space-y-2' },
          React.createElement(
            'div',
            { className: 'flex items-center bg-yellow-100 px-2 py-1 rounded-lg' },
            React.createElement(Star, { className: 'h-4 w-4 text-yellow-500 mr-1' }),
            React.createElement('span', { className: 'text-sm font-medium text-yellow-700' }, hospital.rating || 'N/A')
          ),
          hospital.reviews_count && React.createElement(
            'div',
            { className: 'flex items-center text-gray-500' },
            React.createElement(Users, { className: 'h-4 w-4 mr-1' }),
            React.createElement('span', { className: 'text-xs' }, `${hospital.reviews_count} reviews`)
          )
        )
      ),
      
      // Services/Types
      hospital.types && React.createElement(
        'div',
        { className: 'mb-4' },
        React.createElement(
          'div',
          { className: 'flex flex-wrap gap-2' },
          hospital.types.split(', ').slice(0, 3).map(type =>
            React.createElement(
              'span',
              {
                key: type,
                className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
              },
              type.charAt(0).toUpperCase() + type.slice(1)
            )
          )
        )
      ),

      // Contact Information
      React.createElement(
        'div',
        { className: 'flex items-center justify-between pt-4 border-t border-gray-200' },
        React.createElement(
          'div',
          { className: 'flex items-center text-gray-600' },
          React.createElement(Phone, { className: 'h-4 w-4 mr-2' }),
          React.createElement('span', { className: 'text-sm' }, hospital.phone || 'No phone listed')
        ),
        React.createElement(
          'div',
          { className: 'flex space-x-2' },
          hospital.phone && React.createElement(
            'button',
            {
              onClick: () => callHospital(hospital.phone),
              className: 'px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm'
            },
            'Call'
          ),
          hospital.website && React.createElement(
            'button',
            {
              onClick: () => visitWebsite(hospital.website),
              className: 'px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center space-x-1'
            },
            React.createElement(Globe, { className: 'h-4 w-4' }),
            React.createElement('span', null, 'Website')
          ),
          React.createElement(
            'button',
            {
              onClick: () => getDirections(hospital),
              className: 'px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1'
            },
            React.createElement(Navigation, { className: 'h-4 w-4' }),
            React.createElement('span', null, 'Directions')
          )
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
        React.createElement(MapPin, { className: 'h-8 w-8 text-blue-600 mr-3' }),
        'Find Hospitals & Medical Centers'
      ),
      React.createElement(
        'p',
        { className: 'text-gray-600' },
        'Discover nearby healthcare facilities with real-time data, ratings, and contact information'
      )
    ),

    // Search and Filters
    React.createElement(
      'div',
      { className: 'bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 mb-8' },
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-4' },
        React.createElement(
          'div',
          { className: 'relative' },
          React.createElement(Search, { className: 'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' }),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Search hospitals, specialties...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            onKeyPress: (e) => e.key === 'Enter' && searchHospitalsByQuery(),
            className: 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          })
        ),
        React.createElement(
          'div',
          { className: 'relative' },
          React.createElement(Filter, { className: 'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' }),
          React.createElement(
            'select',
            {
              value: selectedSpecialty,
              onChange: (e) => setSelectedSpecialty(e.target.value),
              className: 'w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none'
            },
            React.createElement('option', { value: '' }, 'All Specialties'),
            specialties.map(specialty =>
              React.createElement('option', { key: specialty, value: specialty }, specialty)
            )
          )
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { className: 'block text-sm font-medium text-gray-700 mb-1' },
            `Radius: ${searchRadius} miles`
          ),
          React.createElement('input', {
            type: 'range',
            min: '1',
            max: '50',
            value: searchRadius,
            onChange: (e) => setSearchRadius(parseInt(e.target.value)),
            className: 'w-full'
          })
        ),
        React.createElement(
          'button',
          {
            onClick: searchHospitalsByQuery,
            disabled: loading,
            className: 'w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all duration-200'
          },
          loading ? 'Searching...' : 'Search'
        )
      ),
      React.createElement(
        'div',
        { className: 'flex items-center justify-center' },
        React.createElement(
          'span',
          { className: 'text-sm text-gray-600 font-medium' },
          `${filteredHospitals.length} facilities found`
        )
      )
    ),

    // Quick Stats
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-8' },
      React.createElement(
        'div',
        { className: 'bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white' },
        React.createElement(
          'div',
          { className: 'text-2xl font-bold' },
          filteredHospitals.length
        ),
        React.createElement(
          'div',
          { className: 'text-sm opacity-90' },
          'Total Facilities'
        )
      ),
      React.createElement(
        'div',
        { className: 'bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white' },
        React.createElement(
          'div',
          { className: 'text-2xl font-bold' },
          filteredHospitals.filter(h => h.rating >= 4.0).length
        ),
        React.createElement(
          'div',
          { className: 'text-sm opacity-90' },
          'Top Rated (4.0+)'
        )
      ),
      React.createElement(
        'div',
        { className: 'bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white' },
        React.createElement(
          'div',
          { className: 'text-2xl font-bold' },
          filteredHospitals.filter(h => h.opening_hours && h.opening_hours.some(hour => hour.includes('24 hours'))).length
        ),
        React.createElement(
          'div',
          { className: 'text-sm opacity-90' },
          '24/7 Available'
        )
      ),
      React.createElement(
        'div',
        { className: 'bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white' },
        React.createElement(
          'div',
          { className: 'text-2xl font-bold' },
          Math.round(filteredHospitals.reduce((acc, h) => acc + (h.distance || 0), 0) / filteredHospitals.length * 10) / 10 || 0
        ),
        React.createElement(
          'div',
          { className: 'text-sm opacity-90' },
          'Avg Distance (mi)'
        )
      )
    ),

    // Loading State
    loading && React.createElement(
      'div',
      { className: 'flex items-center justify-center py-12' },
      React.createElement(
        'div',
        { className: 'animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600' }
      )
    ),

    // Hospitals Grid
    !loading && React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
      filteredHospitals.map(hospital =>
        React.createElement(HospitalCard, { key: hospital.id || hospital.place_id, hospital })
      )
    ),

    // Emergency Banner
    React.createElement(
      'div',
      { className: 'mt-8 bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between' },
        React.createElement(
          'div',
          null,
          React.createElement(
            'h3',
            { className: 'text-xl font-bold mb-2' },
            '🚨 Emergency Services'
          ),
          React.createElement(
            'p',
            { className: 'opacity-90' },
            'For life-threatening emergencies, call 911 immediately or visit the nearest emergency room.'
          )
        ),
        React.createElement(
          'button',
          {
            onClick: () => window.open('tel:911', '_self'),
            className: 'bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors'
          },
          'Call 911'
        )
      )
    )
  );
};

export default HospitalFinder;