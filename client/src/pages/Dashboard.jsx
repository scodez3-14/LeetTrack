import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCompanyQuestions } from '../services/fetchQuestions';

// filepath: /home/santu/CodePrep/client/src/pages/Dashboard.jsx
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCompanyQuestions()
      .then((data) => {
        // Group questions by company
        const companies = Object.entries(data).map(([company, questions]) => {
          const easy = questions.filter(q => q.difficulty === 'Easy').length;
          const medium = questions.filter(q => q.difficulty === 'Medium').length;
          const hard = questions.filter(q => q.difficulty === 'Hard').length;
          return {
            name: company,
            logo: company[0],
            totalQuestions: questions.length,
            solvedQuestions: 0, // You can update this if you track user progress
            difficulty: { easy, medium, hard },
            progress: 0, // You can update this if you track user progress
            color: 'from-blue-500 to-indigo-600', // You can randomize or map colors
          };
        });

        setDashboardData({
          totalQuestions: companies.reduce((sum, c) => sum + c.totalQuestions, 0),
          solvedQuestions: 0, // Update if you track user progress
          streak: 0, // Update if you track user progress
          todaysSolved: 0, // Update if you track user progress
          companies,
          recentActivity: [], // Update if you track user progress
          weeklyProgress: [], // Update if you track user progress
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getProgressColor = (progress) => {
    if (progress >= 70) return 'text-green-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-500';
  };

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Your <span className="text-indigo-200">Dashboard</span>
              </h1>
              <p className="text-xl text-indigo-100">
                Track your coding journey and master technical interviews
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div className="text-3xl font-bold mb-1">{dashboardData.streak}</div>
                <div className="text-indigo-200 text-sm">Day Streak 🔥</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{dashboardData.totalQuestions}</div>
                <div className="text-gray-600 text-sm">Total Questions</div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          {/* ...other stats cards, update as needed ... */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Companies Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Progress</h2>
                <p className="text-gray-600">Your question completion status by company</p>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {dashboardData.companies.map((company, index) => (
                    <Link
                      key={index}
                      to={`/company/${company.name}`}
                      className="group block p-6 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${company.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                            {company.logo}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {company.name}
                            </h3>
                            <p className="text-gray-600">
                              {company.solvedQuestions} / {company.totalQuestions} questions
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getProgressColor(company.progress)} mb-1`}>
                            {company.progress}%
                          </div>
                          <div className="text-gray-500 text-sm">Complete</div>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`bg-gradient-to-r ${company.color} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${company.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      {/* Difficulty Breakdown */}
                      <div className="flex space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">Easy: {company.difficulty.easy}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-600">Medium: {company.difficulty.medium}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-gray-600">Hard: {company.difficulty.hard}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar: You can keep or update weekly/recent activity as needed */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;