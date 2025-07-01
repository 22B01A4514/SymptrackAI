import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, AlertTriangle, Heart, Brain, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const RiskAnalysis = () => {
  const [riskData, setRiskData] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiskAnalysis();
  }, [selectedTimeframe]);

  const fetchRiskAnalysis = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/dashboard-stats?user_id=1`);
      setRiskData(response.data);
    } catch (error) {
      console.error('Error fetching risk analysis:', error);
      // Mock data for demo
      setRiskData({
        risk_trend: [
          { date: '2024-01-15', risk_score: 25.5, disease: 'Common Cold', lifestyle_factor: 'Poor Sleep' },
          { date: '2024-01-14', risk_score: 30.2, disease: 'Flu', lifestyle_factor: 'Stress' },
          { date: '2024-01-13', risk_score: 15.8, disease: 'General Health', lifestyle_factor: 'Good Diet' },
          { date: '2024-01-12', risk_score: 40.1, disease: 'Anxiety', lifestyle_factor: 'High Stress' },
          { date: '2024-01-11', risk_score: 20.3, disease: 'General Health', lifestyle_factor: 'Exercise' },
          { date: '2024-01-10', risk_score: 35.7, disease: 'Hypertension', lifestyle_factor: 'Poor Diet' },
          { date: '2024-01-09', risk_score: 22.4, disease: 'General Health', lifestyle_factor: 'Good Sleep' }
        ],
        current_risk_score: 25.5,
        risk_factors: {
          lifestyle: 35,
          environmental: 20,
          genetic: 15,
          behavioral: 30
        },
        health_categories: [
          { name: 'Cardiovascular', risk: 25, color: '#ef4444' },
          { name: 'Respiratory', risk: 15, color: '#3b82f6' },
          { name: 'Mental Health', risk: 40, color: '#8b5cf6' },
          { name: 'Digestive', risk: 10, color: '#10b981' },
          { name: 'Metabolic', risk: 20, color: '#f59e0b' }
        ],
        predictions: [
          { condition: 'Type 2 Diabetes', probability: 15, timeline: '5-10 years' },
          { condition: 'Hypertension', probability: 25, timeline: '2-5 years' },
          { condition: 'Anxiety Disorder', probability: 35, timeline: '1-2 years' },
          { condition: 'Sleep Disorder', probability: 20, timeline: '6 months' }
        ]
      });
    }
    setLoading(false);
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

  const RiskMeter = ({ score, title, subtitle }) => {
    const getRiskColor = (score) => {
      if (score < 30) return '#10b981';
      if (score < 60) return '#f59e0b';
      return '#ef4444';
    };

    const getRiskLevel = (score) => {
      if (score < 30) return 'Low Risk';
      if (score < 60) return 'Medium Risk';
      return 'High Risk';
    };

    return React.createElement(
      'div',
      { className: 'bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 text-center' },
      React.createElement(
        'h3',
        { className: 'text-lg font-semibold text-gray-900 mb-2' },
        title
      ),
      React.createElement(
        'div',
        { className: 'relative w-32 h-32 mx-auto mb-4' },
        React.createElement(
          'svg',
          { className: 'w-full h-full transform -rotate-90', viewBox: '0 0 100 100' },
          React.createElement('circle', {
            cx: '50',
            cy: '50',
            r: '40',
            stroke: '#e5e7eb',
            strokeWidth: '8',
            fill: 'none'
          }),
          React.createElement('circle', {
            cx: '50',
            cy: '50',
            r: '40',
            stroke: getRiskColor(score),
            strokeWidth: '8',
            fill: 'none',
            strokeDasharray: `${2.51 * score} 251.2`,
            strokeLinecap: 'round',
            className: 'transition-all duration-1000 ease-out'
          })
        ),
        React.createElement(
          'div',
          { className: 'absolute inset-0 flex items-center justify-center flex-col' },
          React.createElement(
            'span',
            { className: 'text-2xl font-bold', style: { color: getRiskColor(score) } },
            Math.round(score), '%'
          ),
          React.createElement(
            'span',
            { className: 'text-xs', style: { color: getRiskColor(score) } },
            getRiskLevel(score)
          )
        )
      ),
      subtitle && React.createElement(
        'p',
        { className: 'text-sm text-gray-600' },
        subtitle
      )
    );
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return React.createElement(
    'div',
    { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' },
    React.createElement(
      'div',
      { className: 'mb-8' },
      React.createElement(
        'h1',
        { className: 'text-3xl font-bold text-gray-900 mb-2 flex items-center' },
        React.createElement(TrendingUp, { className: 'h-8 w-8 text-blue-600 mr-3' }),
        'Advanced Risk Analysis'
      ),
      React.createElement(
        'p',
        { className: 'text-gray-600' },
        'Comprehensive health risk assessment with predictive insights and lifestyle recommendations'
      )
    ),

    // Risk Overview Cards
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-4 gap-6 mb-8' },
      React.createElement(RiskMeter, {
        score: riskData.current_risk_score,
        title: 'Overall Risk',
        subtitle: 'Current health status'
      }),
      React.createElement(RiskMeter, {
        score: riskData.risk_factors.lifestyle,
        title: 'Lifestyle Risk',
        subtitle: 'Diet, exercise, sleep'
      }),
      React.createElement(RiskMeter, {
        score: riskData.risk_factors.environmental,
        title: 'Environmental',
        subtitle: 'Pollution, climate'
      }),
      React.createElement(RiskMeter, {
        score: riskData.risk_factors.behavioral,
        title: 'Behavioral Risk',
        subtitle: 'Habits, adherence'
      })
    ),

    // Charts Section
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8' },
      
      // Risk Trend Chart
      React.createElement(
        'div',
        { className: 'bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100' },
        React.createElement(
          'div',
          { className: 'flex items-center justify-between mb-4' },
          React.createElement(
            'h3',
            { className: 'text-lg font-semibold text-gray-900' },
            'Risk Progression'
          ),
          React.createElement(
            'select',
            {
              value: selectedTimeframe,
              onChange: (e) => setSelectedTimeframe(e.target.value),
              className: 'px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500'
            },
            React.createElement('option', { value: '7days' }, 'Last 7 Days'),
            React.createElement('option', { value: '30days' }, 'Last 30 Days'),
            React.createElement('option', { value: '90days' }, 'Last 90 Days')
          )
        ),
        React.createElement(
          ResponsiveContainer,
          { width: '100%', height: 300 },
          React.createElement(
            LineChart,
            { data: riskData.risk_trend },
            React.createElement('defs', null,
              React.createElement(
                'linearGradient',
                { id: 'colorRisk', x1: '0', y1: '0', x2: '0', y2: '1' },
                React.createElement('stop', { offset: '5%', stopColor: '#ef4444', stopOpacity: 0.3 }),
                React.createElement('stop', { offset: '95%', stopColor: '#ef4444', stopOpacity: 0 })
              )
            ),
            React.createElement(CartesianGrid, { strokeDasharray: '3 3', opacity: 0.3 }),
            React.createElement(XAxis, { 
              dataKey: 'date',
              tick: { fontSize: 12 },
              tickFormatter: (value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }),
            React.createElement(YAxis, { tick: { fontSize: 12 } }),
            React.createElement(Tooltip, {
              labelFormatter: (value) => new Date(value).toLocaleDateString(),
              formatter: (value, name) => [value + '%', 'Risk Score'],
              contentStyle: { backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb' }
            }),
            React.createElement(Line, {
              type: 'monotone',
              dataKey: 'risk_score',
              stroke: '#ef4444',
              strokeWidth: 3,
              dot: { fill: '#ef4444', strokeWidth: 2, r: 6 },
              activeDot: { r: 8, stroke: '#ef4444', strokeWidth: 2 }
            })
          )
        )
      ),

      // Health Categories Pie Chart
      React.createElement(
        'div',
        { className: 'bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100' },
        React.createElement(
          'h3',
          { className: 'text-lg font-semibold text-gray-900 mb-4' },
          'Risk by Health Category'
        ),
        React.createElement(
          ResponsiveContainer,
          { width: '100%', height: 300 },
          React.createElement(
            PieChart,
            null,
            React.createElement(Pie, {
              data: riskData.health_categories,
              cx: '50%',
              cy: '50%',
              labelLine: false,
              label: ({ name, risk }) => `${name}: ${risk}%`,
              outerRadius: 80,
              fill: '#8884d8',
              dataKey: 'risk'
            },
            riskData.health_categories.map((entry, index) =>
              React.createElement(Cell, { key: `cell-${index}`, fill: entry.color })
            )
            ),
            React.createElement(Tooltip, {
              formatter: (value) => [value + '%', 'Risk Level']
            })
          )
        )
      )
    ),

    // Predictive Analysis
    React.createElement(
      'div',
      { className: 'bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 mb-8' },
      React.createElement(
        'h3',
        { className: 'text-lg font-semibold text-gray-900 mb-6 flex items-center' },
        React.createElement(Brain, { className: 'h-6 w-6 text-purple-600 mr-2' }),
        'AI Predictive Analysis'
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
        riskData.predictions.map((prediction, index) =>
          React.createElement(
            'div',
            {
              key: index,
              className: 'border border-gray-200 rounded-lg p-4'
            },
            React.createElement(
              'div',
              { className: 'flex items-center justify-between mb-2' },
              React.createElement(
                'h4',
                { className: 'font-semibold text-gray-900' },
                prediction.condition
              ),
              React.createElement(
                'span',
                { className: `px-2 py-1 rounded-full text-xs font-medium ${
                  prediction.probability > 30 ? 'bg-red-100 text-red-800' :
                  prediction.probability > 15 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }` },
                prediction.probability, '% risk'
              )
            ),
            React.createElement(
              'div',
              { className: 'mb-2' },
              React.createElement(
                'div',
                { className: 'w-full bg-gray-200 rounded-full h-2' },
                React.createElement(
                  'div',
                  { 
                    className: `h-2 rounded-full ${
                      prediction.probability > 30 ? 'bg-red-500' :
                      prediction.probability > 15 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`,
                    style: { width: `${prediction.probability}%` }
                  }
                )
              )
            ),
            React.createElement(
              'p',
              { className: 'text-sm text-gray-600' },
              `Estimated timeline: ${prediction.timeline}`
            )
          )
        )
      )
    ),

    // Recommendations Section
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
      React.createElement(
        'div',
        { className: 'bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white' },
        React.createElement(
          'h3',
          { className: 'text-xl font-bold mb-4 flex items-center' },
          React.createElement(Shield, { className: 'h-6 w-6 mr-2' }),
          'Risk Reduction Tips'
        ),
        React.createElement(
          'ul',
          { className: 'space-y-2 text-sm' },
          React.createElement(
            'li',
            { className: 'flex items-center' },
            '✓ Maintain regular exercise routine (150 min/week)'
          ),
          React.createElement(
            'li',
            { className: 'flex items-center' },
            '✓ Follow Mediterranean diet pattern'
          ),
          React.createElement(
            'li',
            { className: 'flex items-center' },
            '✓ Ensure 7-9 hours of quality sleep'
          ),
          React.createElement(
            'li',
            { className: 'flex items-center' },
            '✓ Practice stress management techniques'
          ),
          React.createElement(
            'li',
            { className: 'flex items-center' },
            '✓ Schedule regular health checkups'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white' },
        React.createElement(
          'h3',
          { className: 'text-xl font-bold mb-4 flex items-center' },
          React.createElement(Heart, { className: 'h-6 w-6 mr-2' }),
          'Next Steps'
        ),
        React.createElement(
          'ul',
          { className: 'space-y-2 text-sm' },
          React.createElement(
            'li',
            { className: 'flex items-center' },
            '📅 Book appointment with primary care physician'
          ),
          React.createElement(
            'li',
            { className: 'flex items-center' },
            '🩺 Consider cardiovascular screening'
          ),
          React.createElement(
            'li',
            { className: 'flex items-center' },
            '🧠 Mental health wellness assessment'
          ),
          React.createElement(
            'li',
            { className: 'flex items-center' },
            '💊 Review current medications'
          ),
          React.createElement(
            'li',
            { className: 'flex items-center' },
            '📊 Schedule follow-up risk assessment'
          )
        )
      )
    )
  );
};

export default RiskAnalysis;