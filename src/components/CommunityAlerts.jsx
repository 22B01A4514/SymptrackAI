import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, MapPin, Users, TrendingUp, Calendar, Filter, Bell, ExternalLink } from 'lucide-react';

function CommunityAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  const alertTypes = ['Disease Outbreak', 'Environmental', 'Hospital Updates', 'Public Health', 'Emergency'];
  const severityLevels = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    fetchAlerts();
    getUserLocation();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, selectedType, selectedSeverity]);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/api/alerts');
      setAlerts(response.data.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied');
        }
      );
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (selectedType) {
      filtered = filtered.filter(alert => alert.type === selectedType);
    }

    if (selectedSeverity) {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity);
    }

    setFilteredAlerts(filtered);
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-orange-200 rounded-full mx-auto mb-4"></div>
            <div className="text-gray-600">Loading community alerts...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Community Health Alerts
            </h1>
            <p className="text-gray-600">
              Stay informed about health trends and alerts in your area
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-orange-600">{alerts.length || 8}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Your Area</p>
                  <p className="text-2xl font-bold text-blue-600">Safe</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Users Nearby</p>
                  <p className="text-2xl font-bold text-green-600">1.2k</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Trend</p>
                  <p className="text-2xl font-bold text-teal-600">↓ Declining</p>
                </div>
                <div className="p-3 bg-teal-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alert Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">All Types</option>
                  {alertTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">All Levels</option>
                  {severityLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedType('');
                    setSelectedSeverity('');
                  }}
                  className="w-full px-3 py-2 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-6">
            {(filteredAlerts.length > 0 ? filteredAlerts : [
              {
                id: 1,
                type: 'Disease Outbreak',
                title: 'Flu Cases Rising in Downtown Area',
                description: 'Health officials report a 25% increase in flu cases in the downtown region over the past week. Vaccination recommended.',
                severity: 'Medium',
                location: 'Downtown District',
                distance: '2.3 km',
                timestamp: '2 hours ago',
                affected_count: 156,
                source: 'Health Department'
              },
              {
                id: 2,
                type: 'Environmental',
                title: 'Air Quality Alert - High Pollution Levels',
                description: 'Air quality index has reached unhealthy levels due to industrial activity. Residents with respiratory conditions advised to stay indoors.',
                severity: 'High',
                location: 'Industrial Zone',
                distance: '5.1 km',
                timestamp: '4 hours ago',
                affected_count: 3200,
                source: 'Environmental Agency'
              },
              {
                id: 3,
                type: 'Hospital Updates',
                title: 'Emergency Department Wait Times Extended',
                description: 'City General Hospital experiencing higher than normal patient volume. Estimated wait time: 3-4 hours for non-critical cases.',
                severity: 'Low',
                location: 'City General Hospital',
                distance: '1.8 km',
                timestamp: '6 hours ago',
                affected_count: null,
                source: 'Hospital Administration'
              },
              {
                id: 4,
                type: 'Public Health',
                title: 'Water Quality Advisory Lifted',
                description: 'The boil water advisory for Riverside neighborhood has been lifted. Water is now safe to consume.',
                severity: 'Low',
                location: 'Riverside Neighborhood',
                distance: '7.2 km',
                timestamp: '1 day ago',
                affected_count: 850,
                source: 'Water Department'
              },
              {
                id: 5,
                type: 'Emergency',
                title: 'Mobile Vaccination Unit Available',
                description: 'Free COVID-19 and flu vaccinations available at Central Park mobile unit today from 9 AM to 5 PM.',
                severity: 'Low',
                location: 'Central Park',
                distance: '3.7 km',
                timestamp: '1 day ago',
                affected_count: null,
                source: 'Public Health Service'
              }
            ]).map((alert) => (
              <div key={alert.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${getSeverityIcon(alert.severity) === 'text-red-600' ? 'bg-red-100' : 
                                                        getSeverityIcon(alert.severity) === 'text-orange-600' ? 'bg-orange-100' :
                                                        getSeverityIcon(alert.severity) === 'text-yellow-600' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                      <AlertTriangle className={`w-5 h-5 ${getSeverityIcon(alert.severity)}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {alert.type}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{alert.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{alert.location}</span>
                          <span className="text-gray-400">•</span>
                          <span>{alert.distance}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{alert.timestamp}</span>
                        </div>
                        
                        {alert.affected_count && (
                          <>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{alert.affected_count} affected</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                      <Bell className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Source: {alert.source}</span>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredAlerts.length === 0 && alerts.length > 0 && (
            <>
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more alerts</p>
              </div>
            </>
          )}

          {/* Emergency Contact */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800">Emergency Information</h3>
            </div>
            <p className="text-red-700 mb-4">
              If you're experiencing a medical emergency, don't wait for community alerts. Call emergency services immediately.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg border border-red-200">
                <p className="font-medium text-red-800">Emergency Services</p>
                <p className="text-red-700">911</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-red-200">
                <p className="font-medium text-red-800">Poison Control</p>
                <p className="text-red-700">1-800-222-1222</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-red-200">
                <p className="font-medium text-red-800">Mental Health Crisis</p>
                <p className="text-red-700">988</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommunityAlerts;