import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';
import { User, Mail, Phone, Calendar, Edit3, Save, X, Heart, Activity, TrendingUp, Award } from 'lucide-react';

function Profile() {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    medical_history: '',
    lifestyle: '',
    emergency_contact: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [healthStats, setHealthStats] = useState({
    predictions_made: 0,
    avg_risk_score: 0,
    vlogs_shared: 0,
    community_score: 0
  });

  useEffect(() => {
    fetchProfile();
    fetchHealthStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      setProfileData(response.data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Use user data from auth context as fallback
      if (user) {
        setProfileData(prevData => ({
          ...prevData,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          age: user.age || '',
          gender: user.gender || ''
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthStats = async () => {
    try {
      const response = await axios.get('/api/user/health-stats');
      setHealthStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching health stats:', error);
      // Set default stats for demo
      setHealthStats({
        predictions_made: 12,
        avg_risk_score: 78,
        vlogs_shared: 2,
        community_score: 85
      });
    }
  };

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/api/user/profile', profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile(); // Reset to original data
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4"></div>
            <div className="text-gray-600">Loading your profile...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Health Profile</h1>
            <p className="text-gray-600">Manage your personal information and health data</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Saving...' : 'Save'}</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {profileData.name || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {profileData.email || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {profileData.phone || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Age
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="age"
                          value={profileData.age}
                          onChange={handleInputChange}
                          min="1"
                          max="120"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {profileData.age || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={profileData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          {profileData.gender || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                    {isEditing ? (
                      <textarea
                        name="medical_history"
                        value={profileData.medical_history}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Previous conditions, surgeries, medications, allergies..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[80px]">
                        {profileData.medical_history || 'No medical history provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lifestyle Information</label>
                    {isEditing ? (
                      <textarea
                        name="lifestyle"
                        value={profileData.lifestyle}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Exercise routine, diet, sleep patterns, stress levels..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[80px]">
                        {profileData.lifestyle || 'No lifestyle information provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="emergency_contact"
                        value={profileData.emergency_contact}
                        onChange={handleInputChange}
                        placeholder="Name and phone number of emergency contact"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                        {profileData.emergency_contact || 'No emergency contact provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Health Statistics */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Activity className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">Predictions Made</p>
                        <p className="text-xs text-blue-700">Total AI analyses</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {healthStats.predictions_made}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Heart className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-900">Avg Risk Score</p>
                        <p className="text-xs text-green-700">Health assessment</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {healthStats.avg_risk_score}/100
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-900">Stories Shared</p>
                        <p className="text-xs text-purple-700">Community vlogs</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-purple-600">
                      {healthStats.vlogs_shared}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Award className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-900">Community Score</p>
                        <p className="text-xs text-orange-700">Engagement level</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-orange-600">
                      {healthStats.community_score}/100
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Journey</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Joined SympTrack AI</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">First health prediction</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Shared first story</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Account Actions</h3>
                <p className="text-sm text-red-700 mb-4">
                  Manage your account settings and data
                </p>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-red-700 hover:text-red-800 p-2 hover:bg-red-100 rounded-md transition-colors">
                    Download my data
                  </button>
                  <button className="w-full text-left text-sm text-red-700 hover:text-red-800 p-2 hover:bg-red-100 rounded-md transition-colors">
                    Delete account
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left text-sm text-red-700 hover:text-red-800 p-2 hover:bg-red-100 rounded-md transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;