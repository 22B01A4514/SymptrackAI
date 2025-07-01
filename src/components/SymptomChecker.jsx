import React, { useState } from 'react';
import { Brain, Search, AlertCircle, TrendingUp, Activity, CheckCircle } from 'lucide-react';
import axios from 'axios';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [multiModalData, setMultiModalData] = useState({
    heartRate: '',
    sleepHours: '',
    stressLevel: 5,
    environmentalFactors: '',
    location: ''
  });

  const handleSymptomAnalysis = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/predict', {
        symptoms,
        user_id: 1
      });
      setPrediction(response.data);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      // Mock response for demo
      setPrediction({
        predicted_disease: 'Common Cold',
        confidence_score: 0.75,
        risk_level: 'medium',
        recommendations: [
          'Get plenty of rest',
          'Stay hydrated',
          'Consider over-the-counter medication',
          'Monitor symptoms for 48 hours'
        ]
      });
    }
    setLoading(false);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const commonSymptoms = [
    'Fever', 'Cough', 'Headache', 'Fatigue', 'Sore throat',
    'Runny nose', 'Body aches', 'Nausea', 'Dizziness', 'Chest pain'
  ];

  return React.createElement(
    'div',
    { className: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8' },
    React.createElement(
      'div',
      { className: 'mb-8' },
      React.createElement(
        'h1',
        { className: 'text-3xl font-bold text-gray-900 mb-2 flex items-center' },
        React.createElement(Brain, { className: 'h-8 w-8 text-blue-600 mr-3' }),
        'AI Symptom Checker'
      ),
      React.createElement(
        'p',
        { className: 'text-gray-600' },
        'Describe your symptoms and get AI-powered health insights. Not a substitute for professional medical advice.'
      )
    ),

    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-2 gap-8' },
      
      // Main Symptom Input
      React.createElement(
        'div',
        { className: 'bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100' },
        React.createElement(
          'h2',
          { className: 'text-xl font-semibold text-gray-900 mb-4' },
          'Describe Your Symptoms'
        ),
        React.createElement(
          'form',
          { onSubmit: handleSymptomAnalysis },
          React.createElement(
            'div',
            { className: 'mb-4' },
            React.createElement('textarea', {
              value: symptoms,
              onChange: (e) => setSymptoms(e.target.value),
              placeholder: 'Describe your symptoms in detail... (e.g., "I have a headache, runny nose, and feel tired for the past 2 days")',
              className: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none',
              rows: 4
            })
          ),
          React.createElement(
            'div',
            { className: 'mb-4' },
            React.createElement(
              'p',
              { className: 'text-sm text-gray-600 mb-2' },
              'Quick add common symptoms:'
            ),
            React.createElement(
              'div',
              { className: 'flex flex-wrap gap-2' },
              commonSymptoms.map(symptom =>
                React.createElement(
                  'button',
                  {
                    key: symptom,
                    type: 'button',
                    onClick: () => setSymptoms(prev => prev + (prev ? ', ' : '') + symptom.toLowerCase()),
                    className: 'px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors'
                  },
                  symptom
                )
              )
            )
          ),
          React.createElement(
            'button',
            {
              type: 'submit',
              disabled: loading || !symptoms.trim(),
              className: 'w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center'
            },
            loading
              ? React.createElement(
                  'div',
                  { className: 'animate-spin rounded-full h-5 w-5 border-b-2 border-white' }
                )
              : React.createElement React.Fragment, null,
                  React.createElement(Search, { className: 'h-5 w-5 mr-2' }),
                  'Analyze Symptoms'
                )
          )
        )
      ),

      // Multimodal Input
      React.createElement(
        'div',
        { className: 'bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100' },
        React.createElement(
          'h2',
          { className: 'text-xl font-semibold text-gray-900 mb-4' },
          'Additional Health Data'
        ),
        React.createElement(
          'div',
          { className: 'space-y-4' },
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Heart Rate (BPM)'
            ),
            React.createElement('input', {
              type: 'number',
              value: multiModalData.heartRate,
              onChange: (e) => setMultiModalData(prev => ({ ...prev, heartRate: e.target.value })),
              placeholder: '72',
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            })
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Sleep Hours (Last Night)'
            ),
            React.createElement('input', {
              type: 'number',
              step: '0.5',
              value: multiModalData.sleepHours,
              onChange: (e) => setMultiModalData(prev => ({ ...prev, sleepHours: e.target.value })),
              placeholder: '7.5',
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            })
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { className: 'block text-sm font-medium text-gray-700 mb-1' },
              `Stress Level: ${multiModalData.stressLevel}/10`
            ),
            React.createElement('input', {
              type: 'range',
              min: '1',
              max: '10',
              value: multiModalData.stressLevel,
              onChange: (e) => setMultiModalData(prev => ({ ...prev, stressLevel: e.target.value })),
              className: 'w-full'
            })
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'label',
              { className: 'block text-sm font-medium text-gray-700 mb-1' },
              'Environmental Factors'
            ),
            React.createElement('input', {
              type: 'text',
              value: multiModalData.environmentalFactors,
              onChange: (e) => setMultiModalData(prev => ({ ...prev, environmentalFactors: e.target.value })),
              placeholder: 'High pollution, cold weather...',
              className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            })
          )
        )
      )
    ),

    // Prediction Results
    prediction && React.createElement(
      'div',
      { className: 'mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100' },
      React.createElement(
        'h2',
        { className: 'text-xl font-semibold text-gray-900 mb-6 flex items-center' },
        React.createElement(Activity, { className: 'h-6 w-6 text-green-600 mr-2' }),
        'Analysis Results'
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-6' },
        React.createElement(
          'div',
          { className: 'text-center' },
          React.createElement(
            'div',
            { className: 'text-2xl font-bold text-gray-900' },
            prediction.predicted_disease
          ),
          React.createElement(
            'div',
            { className: 'text-sm text-gray-600' },
            'Most Likely Condition'
          )
        ),
        React.createElement(
          'div',
          { className: 'text-center' },
          React.createElement(
            'div',
            { className: 'text-2xl font-bold text-blue-600' },
            Math.round(prediction.confidence_score * 100), '%'
          ),
          React.createElement(
            'div',
            { className: 'text-sm text-gray-600' },
            'Confidence Level'
          )
        ),
        React.createElement(
          'div',
          { className: 'text-center' },
          React.createElement(
            'div',
            { className: `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(prediction.risk_level)}` },
            React.createElement(AlertCircle, { className: 'h-4 w-4 mr-1' }),
            prediction.risk_level.charAt(0).toUpperCase() + prediction.risk_level.slice(1), ' Risk'
          )
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'h3',
          { className: 'text-lg font-semibold text-gray-900 mb-3' },
          'Recommendations'
        ),
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
          prediction.recommendations.map((rec, index) =>
            React.createElement(
              'div',
              {
                key: index,
                className: 'flex items-start space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg'
              },
              React.createElement(CheckCircle, { className: 'h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' }),
              React.createElement(
                'span',
                { className: 'text-sm text-green-800' },
                rec
              )
            )
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg' },
        React.createElement(
          'p',
          { className: 'text-sm text-yellow-800' },
          React.createElement('strong', null, 'Disclaimer:'),
          ' This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.'
        )
      )
    )
  );
};

export default SymptomChecker;