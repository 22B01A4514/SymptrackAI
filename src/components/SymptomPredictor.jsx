import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Brain, AlertCircle, CheckCircle, TrendingUp, Activity, Heart } from 'lucide-react';

function SymptomPredictor() {
  const [symptoms, setSymptoms] = useState('');
  const [additionalData, setAdditionalData] = useState({
    age: '',
    gender: '',
    lifestyle: '',
    medicalHistory: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchPredictionHistory();
  }, []);

  const fetchPredictionHistory = async () => {
    try {
      const response = await axios.get('/api/predictions/history');
      setHistory(response.data.predictions || []);
    } catch (error) {
      console.error('Error fetching prediction history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/predictions/predict', {
        symptoms,
        ...additionalData
      });
      
      setPrediction(response.data);
      fetchPredictionHistory();
    } catch (error) {
      console.error('Error making prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return CheckCircle;
      case 'medium': return AlertCircle;
      case 'high': return AlertCircle;
      default: return Activity;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Health Prediction
            </h1>
            <p className="text-gray-600">
              Get AI-powered health insights based on your symptoms and lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Prediction Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe Your Symptoms
                    </label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Describe your symptoms in detail... (e.g., headache, fever, fatigue, cough)"
                      rows={4}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        value={additionalData.age}
                        onChange={(e) => setAdditionalData({...additionalData, age: e.target.value})}
                        placeholder="Your age"
                        min="1"
                        max="120"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        value={additionalData.gender}
                        onChange={(e) => setAdditionalData({...additionalData, gender: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lifestyle Factors
                    </label>
                    <textarea
                      value={additionalData.lifestyle}
                      onChange={(e) => setAdditionalData({...additionalData, lifestyle: e.target.value})}
                      placeholder="Exercise routine, diet, sleep patterns, stress levels, smoking, alcohol consumption..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical History
                    </label>
                    <textarea
                      value={additionalData.medicalHistory}
                      onChange={(e) => setAdditionalData({...additionalData, medicalHistory: e.target.value})}
                      placeholder="Previous conditions, family history, medications, allergies..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !symptoms.trim()}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4" />
                        <span>Get AI Prediction</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Prediction Results */}
              {prediction && (
                <>
                  <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Brain className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Prediction Results</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Possible Conditions</h4>
                          <div className="space-y-2">
                            {prediction.conditions?.map((condition, index) => {
                              const RiskIcon = getRiskIcon(condition.risk_level);
                              return (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <RiskIcon className="w-4 h-4 text-gray-600" />
                                    <span className="font-medium">{condition.name}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">{condition.probability}%</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(condition.risk_level)}`}>
                                      {condition.risk_level}
                                    </span>
                                  </div>
                                </div>
                              );
                            }) || (
                              <div className="p-3 bg-green-50 rounded-lg">
                                <p className="text-green-800">No significant health risks detected based on the provided symptoms.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Risk Score</h4>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full transition-all duration-500 ${
                                  prediction.risk_score >= 70 ? 'bg-red-500' :
                                  prediction.risk_score >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${prediction.risk_score || 25}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-lg">
                              {prediction.risk_score || 25}/100
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                          <div className="space-y-2">
                            {prediction.recommendations?.map((rec, index) => (
                              <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 rounded-lg">
                                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-blue-800">{rec}</span>
                              </div>
                            )) || (
                              <div className="space-y-2">
                                <div className="flex items-start space-x-2 p-2 bg-blue-50 rounded-lg">
                                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-blue-800">Monitor symptoms and stay hydrated</span>
                                </div>
                                <div className="flex items-start space-x-2 p-2 bg-blue-50 rounded-lg">
                                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-blue-800">Consult healthcare provider if symptoms persist</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Medical Disclaimer</p>
                          <p className="text-xs text-yellow-700 mt-1">
                            This AI prediction is for informational purposes only and should not replace professional medical advice. 
                            Please consult a healthcare provider for proper diagnosis and treatment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Prediction History Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Predictions</h3>
                <div className="space-y-3">
                  {history.length > 0 ? history.slice(0, 5).map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(item.risk_level)}`}>
                          {item.risk_level || 'Low'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {item.symptoms.substring(0, 50)}...
                      </p>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No predictions yet. Start by describing your symptoms above.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Tips</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <Heart className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Stay Hydrated</p>
                      <p className="text-xs text-green-700">Drink at least 8 glasses of water daily</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Activity className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Regular Exercise</p>
                      <p className="text-xs text-blue-700">30 minutes of activity daily</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-purple-800">Monitor Symptoms</p>
                      <p className="text-xs text-purple-700">Track changes over time</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SymptomPredictor;