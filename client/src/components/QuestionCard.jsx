import React from 'react';

const QuestionCard = ({ question }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      
      <div className="relative p-6">
        {/* Header with title and difficulty */}
        <div className="flex justify-between items-start mb-3">
          <h2 className="font-bold text-xl text-gray-900 group-hover:text-indigo-900 transition-colors duration-200 line-clamp-2">
            {question.title}
          </h2>
          {question.difficulty && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(question.difficulty)} ml-3 flex-shrink-0`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </span>
          )}
        </div>

        {/* Company info */}
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
            <p className="text-gray-600 font-medium">
              <span className="text-gray-500">Company:</span>{' '}
              <span className="text-indigo-700 font-semibold">{question.company}</span>
            </p>
          </div>
        </div>

        {/* Tags if available */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
            {question.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                +{question.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action button */}
        <div className="flex justify-end">
          <a 
            href={question.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg group/btn"
          >
            <span>Solve on LeetCode</span>
            <svg 
              className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
