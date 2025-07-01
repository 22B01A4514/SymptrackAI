import React, { useState, useEffect } from 'react';
import { Video, Heart, MessageCircle, Filter, Plus, Play, User, Calendar, MapPin } from 'lucide-react';
import axios from 'axios';

const VlogPlatform = () => {
  const [vlogs, setVlogs] = useState([]);
  const [filteredVlogs, setFilteredVlogs] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [activeVlogId, setActiveVlogId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newVlog, setNewVlog] = useState({
    title: '',
    description: '',
    disease_category: '',
    medicines_used: '',
    hospital_visited: '',
    recovery_timeline: '',
    video_url: ''
  });

  const diseases = ['COVID-19', 'Flu', 'Common Cold', 'Diabetes', 'Hypertension', 'Asthma', 'PCOS', 'Anxiety'];

  useEffect(() => {
    fetchVlogs();
  }, []);

  useEffect(() => {
    if (selectedDisease) {
      setFilteredVlogs(vlogs.filter(vlog => 
        vlog.disease_category.toLowerCase().includes(selectedDisease.toLowerCase())
      ));
    } else {
      setFilteredVlogs(vlogs);
    }
  }, [vlogs, selectedDisease]);

  const fetchVlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vlogs');
      setVlogs(response.data);
    } catch (error) {
      console.error('Error fetching vlogs:', error);
      // Mock data for demo
      setVlogs([
        {
          id: 1,
          username: 'Sarah M.',
          title: 'My PCOS Journey: How I Managed Symptoms Naturally',
          description: 'Sharing my 2-year journey with PCOS, the treatments that worked, and lifestyle changes that made a difference.',
          disease_category: 'PCOS',
          medicines_used: 'Metformin, Birth control pills',
          hospital_visited: 'Women\'s Health Center',
          recovery_timeline: '6 months to see improvements',
          created_at: '2024-01-15T10:30:00',
          likes: 24,
          video_url: ''
        },
        {
          id: 2,
          username: 'Mike R.',
          title: 'Beating Anxiety: Therapy and Meditation That Helped',
          description: 'My experience with anxiety disorder and the combination of therapy and mindfulness that changed my life.',
          disease_category: 'Anxiety',
          medicines_used: 'Sertraline (initially), now medication-free',
          hospital_visited: 'Mental Health Clinic Downtown',
          recovery_timeline: '1 year of consistent therapy',
          created_at: '2024-01-14T15:45:00',
          likes: 18,
          video_url: ''
        },
        {
          id: 3,
          username: 'Emma K.',
          title: 'Asthma Control: Finding the Right Treatment',
          description: 'How I learned to manage my asthma effectively and found the right inhaler combination.',
          disease_category: 'Asthma',
          medicines_used: 'Albuterol inhaler, Flovent daily',
          hospital_visited: 'City Respiratory Center',
          recovery_timeline: 'Ongoing management, major improvement in 3 months',
          created_at: '2024-01-13T09:20:00',
          likes: 32,
          video_url: ''
        }
      ]);
    }
    setLoading(false);
  };

  const fetchComments = async (vlogId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/comments/${vlogId}`);
      setComments(prev => ({ ...prev, [vlogId]: response.data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Mock comments for demo
      setComments(prev => ({
        ...prev,
        [vlogId]: [
          {
            id: 1,
            username: 'John D.',
            comment_text: 'Thank you for sharing your story! This gives me hope.',
            created_at: '2024-01-15T12:00:00'
          },
          {
            id: 2,
            username: 'Lisa T.',
            comment_text: 'Which doctor did you see at the Women\'s Health Center?',
            created_at: '2024-01-15T14:30:00'
          }
        ]
      }));
    }
  };

  const handleCreateVlog = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/vlogs', newVlog);
      setShowCreateModal(false);
      setNewVlog({
        title: '',
        description: '',
        disease_category: '',
        medicines_used: '',
        hospital_visited: '',
        recovery_timeline: '',
        video_url: ''
      });
      fetchVlogs();
    } catch (error) {
      console.error('Error creating vlog:', error);
    }
  };

  const handleAddComment = async (vlogId) => {
    if (!newComment.trim()) return;
    
    try {
      await axios.post('http://localhost:5000/api/comments', {
        vlog_id: vlogId,
        user_id: 1,
        comment_text: newComment
      });
      setNewComment('');
      fetchComments(vlogId);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleComments = (vlogId) => {
    if (activeVlogId === vlogId) {
      setActiveVlogId(null);
    } else {
      setActiveVlogId(vlogId);
      if (!comments[vlogId]) {
        fetchComments(vlogId);
      }
    }
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

  const VlogCard = ({ vlog }) => {
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
            { className: 'w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center' },
            React.createElement(User, { className: 'h-5 w-5 text-white' })
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'h3',
              { className: 'font-semibold text-gray-900' },
              vlog.username
            ),
            React.createElement(
              'div',
              { className: 'flex items-center text-sm text-gray-500' },
              React.createElement(Calendar, { className: 'h-4 w-4 mr-1' }),
              new Date(vlog.created_at).toLocaleDateString()
            )
          )
        ),
        React.createElement(
          'span',
          { className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800' },
          vlog.disease_category
        )
      ),
      React.createElement(
        'h2',
        { className: 'text-xl font-bold text-gray-900 mb-3' },
        vlog.title
      ),
      React.createElement(
        'p',
        { className: 'text-gray-600 mb-4 line-clamp-3' },
        vlog.description
      ),
      React.createElement(
        'div',
        { className: 'space-y-2 mb-4 text-sm' },
        vlog.medicines_used && React.createElement(
          'div',
          { className: 'flex items-start space-x-2' },
          React.createElement(
            'span',
            { className: 'font-medium text-gray-700 min-w-0' },
            '💊 Medicines:'
          ),
          React.createElement(
            'span',
            { className: 'text-gray-600' },
            vlog.medicines_used
          )
        ),
        vlog.hospital_visited && React.createElement(
          'div',
          { className: 'flex items-start space-x-2' },
          React.createElement(MapPin, { className: 'h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0' }),
          React.createElement(
            'span',
            { className: 'text-gray-600' },
            vlog.hospital_visited
          )
        ),
        vlog.recovery_timeline && React.createElement(
          'div',
          { className: 'flex items-start space-x-2' },
          React.createElement(
            'span',
            { className: 'font-medium text-gray-700 min-w-0' },
            '⏱️ Timeline:'
          ),
          React.createElement(
            'span',
            { className: 'text-gray-600' },
            vlog.recovery_timeline
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'flex items-center justify-between pt-4 border-t border-gray-200' },
        React.createElement(
          'div',
          { className: 'flex items-center space-x-4' },
          React.createElement(
            'button',
            { className: 'flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors' },
            React.createElement(Heart, { className: 'h-5 w-5' }),
            React.createElement('span', null, vlog.likes)
          ),
          React.createElement(
            'button',
            { 
              onClick: () => toggleComments(vlog.id),
              className: 'flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors'
            },
            React.createElement(MessageCircle, { className: 'h-5 w-5' }),
            React.createElement('span', null, 'Comments')
          )
        ),
        vlog.video_url && React.createElement(
          'button',
          { className: 'flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all' },
          React.createElement(Play, { className: 'h-4 w-4' }),
          React.createElement('span', null, 'Watch Video')
        )
      ),
      
      // Comments Section
      activeVlogId === vlog.id && React.createElement(
        'div',
        { className: 'mt-4 pt-4 border-t border-gray-200' },
        React.createElement(
          'div',
          { className: 'space-y-3 mb-4' },
          comments[vlog.id]?.map(comment =>
            React.createElement(
              'div',
              { key: comment.id, className: 'bg-gray-50 rounded-lg p-3' },
              React.createElement(
                'div',
                { className: 'flex items-center justify-between mb-1' },
                React.createElement(
                  'span',
                  { className: 'font-medium text-sm text-gray-900' },
                  comment.username
                ),
                React.createElement(
                  'span',
                  { className: 'text-xs text-gray-500' },
                  new Date(comment.created_at).toLocaleDateString()
                )
              ),
              React.createElement(
                'p',
                { className: 'text-sm text-gray-700' },
                comment.comment_text
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'flex space-x-2' },
          React.createElement('input', {
            type: 'text',
            value: newComment,
            onChange: (e) => setNewComment(e.target.value),
            placeholder: 'Add a comment...',
            className: 'flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
          }),
          React.createElement(
            'button',
            {
              onClick: () => handleAddComment(vlog.id),
              className: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'
            },
            'Post'
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
      { className: 'flex items-center justify-between mb-8' },
      React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          { className: 'text-3xl font-bold text-gray-900 mb-2 flex items-center' },
          React.createElement(Video, { className: 'h-8 w-8 text-blue-600 mr-3' }),
          'Patient Stories'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-600' },
          'Real recovery journeys, treatments, and hope shared by our community'
        )
      ),
      React.createElement(
        'button',
        {
          onClick: () => setShowCreateModal(true),
          className: 'flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200'
        },
        React.createElement(Plus, { className: 'h-5 w-5' }),
        React.createElement('span', null, 'Share Your Story')
      )
    ),

    // Filters
    React.createElement(
      'div',
      { className: 'bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100 mb-8' },
      React.createElement(
        'div',
        { className: 'flex items-center space-x-4' },
        React.createElement(Filter, { className: 'h-5 w-5 text-gray-500' }),
        React.createElement(
          'select',
          {
            value: selectedDisease,
            onChange: (e) => setSelectedDisease(e.target.value),
            className: 'px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          },
          React.createElement('option', { value: '' }, 'All Conditions'),
          diseases.map(disease =>
            React.createElement('option', { key: disease, value: disease }, disease)
          )
        ),
        React.createElement(
          'span',
          { className: 'text-sm text-gray-600' },
          `${filteredVlogs.length} stories found`
        )
      )
    ),

    // Vlogs Grid
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
      filteredVlogs.map(vlog =>
        React.createElement(VlogCard, { key: vlog.id, vlog })
      )
    ),

    // Create Vlog Modal
    showCreateModal && React.createElement(
      'div',
      { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50' },
      React.createElement(
        'div',
        { className: 'bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto' },
        React.createElement(
          'h2',
          { className: 'text-2xl font-bold text-gray-900 mb-6' },
          'Share Your Recovery Story'
        ),
        React.createElement(
          'form',
          { onSubmit: handleCreateVlog },
          React.createElement(
            'div',
            { className: 'space-y-4' },
            React.createElement(
              'div',
              null,
              React.createElement(
                'label',
                { className: 'block text-sm font-medium text-gray-700 mb-1' },
                'Title *'
              ),
              React.createElement('input', {
                type: 'text',
                required: true,
                value: newVlog.title,
                onChange: (e) => setNewVlog(prev => ({ ...prev, title: e.target.value })),
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              })
            ),
            React.createElement(
              'div',
              null,
              React.createElement(
                'label',
                { className: 'block text-sm font-medium text-gray-700 mb-1' },
                'Your Story *'
              ),
              React.createElement('textarea', {
                required: true,
                rows: 4,
                value: newVlog.description,
                onChange: (e) => setNewVlog(prev => ({ ...prev, description: e.target.value })),
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              })
            ),
            React.createElement(
              'div',
              null,
              React.createElement(
                'label',
                { className: 'block text-sm font-medium text-gray-700 mb-1' },
                'Condition/Disease *'
              ),
              React.createElement(
                'select',
                {
                  required: true,
                  value: newVlog.disease_category,
                  onChange: (e) => setNewVlog(prev => ({ ...prev, disease_category: e.target.value })),
                  className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                },
                React.createElement('option', { value: '' }, 'Select condition...'),
                diseases.map(disease =>
                  React.createElement('option', { key: disease, value: disease }, disease)
                )
              )
            ),
            React.createElement(
              'div',
              null,
              React.createElement(
                'label',
                { className: 'block text-sm font-medium text-gray-700 mb-1' },
                'Medicines/Treatments Used'
              ),
              React.createElement('input', {
                type: 'text',
                value: newVlog.medicines_used,
                onChange: (e) => setNewVlog(prev => ({ ...prev, medicines_used: e.target.value })),
                placeholder: 'List medications or treatments...',
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              })
            ),
            React.createElement(
              'div',
              null,
              React.createElement(
                'label',
                { className: 'block text-sm font-medium text-gray-700 mb-1' },
                'Hospital/Clinic Visited'
              ),
              React.createElement('input', {
                type: 'text',
                value: newVlog.hospital_visited,
                onChange: (e) => setNewVlog(prev => ({ ...prev, hospital_visited: e.target.value })),
                placeholder: 'Name of healthcare facility...',
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              })
            ),
            React.createElement(
              'div',
              null,
              React.createElement(
                'label',
                { className: 'block text-sm font-medium text-gray-700 mb-1' },
                'Recovery Timeline'
              ),
              React.createElement('input', {
                type: 'text',
                value: newVlog.recovery_timeline,
                onChange: (e) => setNewVlog(prev => ({ ...prev, recovery_timeline: e.target.value })),
                placeholder: 'How long did recovery take?',
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              })
            )
          ),
          React.createElement(
            'div',
            { className: 'flex space-x-3 mt-6' },
            React.createElement(
              'button',
              {
                type: 'button',
                onClick: () => setShowCreateModal(false),
                className: 'flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
              },
              'Cancel'
            ),
            React.createElement(
              'button',
              {
                type: 'submit',
                className: 'flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all'
              },
              'Share Story'
            )
          )
        )
      )
    )
  );
};

export default VlogPlatform;