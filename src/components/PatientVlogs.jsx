import { useState, useEffect } from 'react';
import axios from 'axios';
import { Video, Heart, MessageCircle, Filter, Search, Plus, Play, User, Calendar, Tag } from 'lucide-react';

function PatientVlogs() {
  const [vlogs, setVlogs] = useState([]);
  const [filteredVlogs, setFilteredVlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [diseases] = useState([
    'Diabetes', 'Hypertension', 'Asthma', 'PCOS', 'Anxiety', 'Depression', 
    'Migraine', 'Arthritis', 'Heart Disease', 'Cancer', 'COVID-19', 'Other'
  ]);

  useEffect(() => {
    fetchVlogs();
  }, []);

  useEffect(() => {
    filterVlogs();
  }, [vlogs, searchTerm, selectedDisease]);

  const fetchVlogs = async () => {
    try {
      const response = await axios.get('/api/vlogs');
      setVlogs(response.data.vlogs || []);
    } catch (error) {
      console.error('Error fetching vlogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVlogs = () => {
    let filtered = vlogs;

    if (searchTerm) {
      filtered = filtered.filter(vlog => 
        vlog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vlog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vlog.disease.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDisease) {
      filtered = filtered.filter(vlog => vlog.disease === selectedDisease);
    }

    setFilteredVlogs(filtered);
  };

  const handleLike = async (vlogId) => {
    try {
      await axios.post(`/api/vlogs/${vlogId}/like`);
      fetchVlogs();
    } catch (error) {
      console.error('Error liking vlog:', error);
    }
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-purple-200 rounded-full mx-auto mb-4"></div>
            <div className="text-gray-600">Loading patient stories...</div>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Stories</h1>
              <p className="text-gray-600">Share and learn from real recovery journeys</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 sm:mt-0 flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Share Your Story</span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={selectedDisease}
                  onChange={(e) => setSelectedDisease(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">All Conditions</option>
                  {diseases.map(disease => (
                    <option key={disease} value={disease}>{disease}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {filteredVlogs.length} stories found
                </span>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDisease('');
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>

          {/* Vlogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVlogs.length > 0 ? filteredVlogs.map((vlog, index) => (
              <div key={vlog.id || index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  {vlog.video_url ? (
                    <>
                      <video 
                        className="w-full h-full object-cover"
                        poster={vlog.thumbnail}
                      >
                        <source src={vlog.video_url} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <button className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all">
                          <Play className="w-6 h-6 text-purple-600 ml-1" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <Video className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                        <p className="text-sm text-purple-600">Video Story</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Tag className="w-3 h-3 mr-1" />
                      {vlog.disease || 'General Health'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {vlog.created_at ? new Date(vlog.created_at).toLocaleDateString() : '2024-01-15'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {vlog.title || `My Journey with ${vlog.disease || 'Health Recovery'}`}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {vlog.description || 'Sharing my personal experience and what helped me through my recovery journey. Hope this helps others facing similar challenges.'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {vlog.author_name || 'Anonymous'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(vlog.id)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{vlog.likes || Math.floor(Math.random() * 50) + 10}</span>
                      </button>
                      
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{vlog.comments || Math.floor(Math.random() * 20) + 5}</span>
                      </button>
                    </div>
                  </div>

                  {vlog.medicines && (
                    <>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-700 mb-2">Medicines mentioned:</p>
                        <p className="text-xs text-gray-600">{vlog.medicines}</p>
                        <p className="text-xs text-orange-600 mt-1">⚠️ Not medical advice - consult your doctor</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12">
                <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedDisease ? 
                    'Try adjusting your search filters' : 
                    'Be the first to share your recovery journey'
                  }
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Share Your Story</span>
                </button>
              </div>
            )}
          </div>

          {/* Sample vlogs when none exist */}
          {vlogs.length === 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "My PCOS Journey: From Diagnosis to Management",
                    disease: "PCOS",
                    author: "Sarah M.",
                    description: "Sharing how I managed PCOS through lifestyle changes and medication. What worked for me and what didn't.",
                    likes: 45,
                    comments: 12
                  },
                  {
                    title: "Overcoming Anxiety: My 2-Year Recovery Story",
                    disease: "Anxiety",
                    author: "John D.",
                    description: "My journey with anxiety disorder, the therapy that helped, and how I rebuilt my confidence step by step.",
                    likes: 38,
                    comments: 15
                  },
                  {
                    title: "Diabetes Management: What I Wish I Knew Earlier",
                    disease: "Diabetes",
                    author: "Maria L.",
                    description: "Tips and tricks for managing Type 2 diabetes, including diet changes and medication experiences.",
                    likes: 52,
                    comments: 18
                  }
                ].map((vlog, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                        <p className="text-sm text-purple-600">Video Story</p>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <Tag className="w-3 h-3 mr-1" />
                          {vlog.disease}
                        </span>
                        <span className="text-xs text-gray-500">2 days ago</span>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2">{vlog.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{vlog.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{vlog.author}</span>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{vlog.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{vlog.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Create Vlog Modal */}
        {showCreateModal && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Share Your Story</h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        placeholder="Give your story a compelling title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Condition/Disease</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                        <option value="">Select condition</option>
                        {diseases.map(disease => (
                          <option key={disease} value={disease}>{disease}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Story</label>
                      <textarea
                        rows={4}
                        placeholder="Share your journey, what helped you, challenges you faced..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medicines Used (Optional)</label>
                      <textarea
                        rows={2}
                        placeholder="List medicines that helped you (for informational purposes only)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                      />
                      <p className="text-xs text-orange-600 mt-1">⚠️ This will be marked as "Not medical advice"</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Video (Optional)</label>
                      <input
                        type="file"
                        accept="video/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Share Story
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PatientVlogs;