import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';
import { Activity, Heart, Users, AlertTriangle, Video, TrendingUp, Brain, Shield } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    riskScore: 0,
    recentPredictions: [],
    healthTrends: [],
    communityAlerts: [],
    recentVlogs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const riskScoreData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [70, 25, 5],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const healthTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Health Score',
        data: [85, 82, 88, 86, 90, 92],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4"></div>
            <div className="text-gray-600">Loading your dashboard...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Your personalized health insights and community updates
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Risk Score</p>
                  <p className="text-2xl font-bold text-green-600">
                    {dashboardData.riskScore || 85}/100
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Predictions Made</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {dashboardData.recentPredictions?.length || 12}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Community Alerts</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {dashboardData.communityAlerts?.length || 3}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Health Trend</p>
                  <p className="text-2xl font-bold text-teal-600">↗ Improving</p>
                </div>
                <div className="p-3 bg-teal-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Trend</h3>
              <div className="h-64">
                <Line 
                  data={healthTrendData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                  }} 
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <Doughnut 
                  data={riskScoreData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link 
              to="/predict"
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:scale-105 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Predict Health Risk</h3>
                  <p className="text-sm text-gray-600">AI-powered symptom analysis</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/vlogs"
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:scale-105 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <Video className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Patient Stories</h3>
                  <p className="text-sm text-gray-600">Share & learn from others</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/alerts"
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:scale-105 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Community Alerts</h3>
                  <p className="text-sm text-gray-600">Local health updates</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/profile"
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:scale-105 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-teal-100 rounded-full group-hover:bg-teal-200 transition-colors">
                  <Heart className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Health Profile</h3>
                  <p className="text-sm text-gray-600">Manage your data</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Symptom prediction completed</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Low Risk</span>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Video className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New patient story shared</p>
                  <p className="text-xs text-gray-600">1 day ago</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Community</span>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                <div className="p-2 bg-orange-100 rounded-full">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Health alert in your area</p>
                  <p className="text-xs text-gray-600">3 days ago</p>
                </div>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Alert</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;