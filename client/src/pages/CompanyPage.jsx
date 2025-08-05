import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import { fetchQuestionsByCompany } from '../services/fetchQuestions';


const CompanyPage = () => {
  const { companyName } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    setLoading(true);
    fetchQuestionsByCompany(companyName)
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [companyName]);



  const filteredQuestions = questions.filter(question => {
    const matchesFilter = filter === 'all' || question.difficulty === filter;
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCompanyLogo = (company) => {
    // Return first letter of company name as a simple logo
    return company?.charAt(0).toUpperCase() || 'C';
  };

  const stats = {
    total: questions.length,
    solved: questions.filter(q => q.solved).length,
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length
  };

  return (
    <>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center space-x-4 mb-6">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center text-indigo-200 hover:text-white transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Company Logo */}
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <span className="text-3xl font-bold text-white">
                  {getCompanyLogo(companyName)}
                </span>
              </div>
              
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {companyName} <span className="text-indigo-200">Questions</span>
                </h1>
                <p className="text-xl text-indigo-100">
                  Master the coding challenges asked at {companyName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
              <div className="text-gray-600 text-sm">Total</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.solved}</div>
              <div className="text-gray-600 text-sm">Solved</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-green-500 mb-1">{stats.easy}</div>
              <div className="text-gray-600 text-sm">Easy</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-yellow-500 mb-1">{stats.medium}</div>
              <div className="text-gray-600 text-sm">Medium</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl font-bold text-red-500 mb-1">{stats.hard}</div>
              <div className="text-gray-600 text-sm">Hard</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Difficulty Filter */}
              <div className="flex space-x-2">
                {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setFilter(difficulty)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      filter === difficulty
                        ? 'bg-indigo-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredQuestions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'Questions for this company will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyPage;
