// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Error Types
export const API_ERRORS = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
};

// Custom Error Class
class APIError extends Error {
  constructor(message, type, status = null, data = null) {
    super(message);
    this.name = 'APIError';
    this.type = type;
    this.status = status;
    this.data = data;
  }
}

// HTTP Client with timeout and error handling
const httpClient = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData = null;
      try {
        errorData = await response.json();
      } catch (e) {
        // Response is not JSON
      }

      switch (response.status) {
        case 404:
          throw new APIError('Resource not found', API_ERRORS.NOT_FOUND, response.status, errorData);
        case 400:
          throw new APIError('Invalid request', API_ERRORS.VALIDATION_ERROR, response.status, errorData);
        case 500:
          throw new APIError('Server error', API_ERRORS.SERVER_ERROR, response.status, errorData);
        default:
          throw new APIError(
            errorData?.message || `HTTP Error: ${response.status}`,
            API_ERRORS.SERVER_ERROR,
            response.status,
            errorData
          );
      }
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new APIError('Request timeout', API_ERRORS.TIMEOUT_ERROR);
    }

    if (error instanceof APIError) {
      throw error;
    }

    // Network or other errors
    throw new APIError(
      'Network error occurred',
      API_ERRORS.NETWORK_ERROR,
      null,
      { originalError: error.message }
    );
  }
};

// Mock data for development
const MOCK_QUESTIONS = [
  {
    id: 1,
    title: 'Two Sum',
    company: 'Google',
    difficulty: 'easy',
    link: 'https://leetcode.com/problems/two-sum/',
    tags: ['Array', 'Hash Table'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    solved: false,
    attempts: 0,
    lastAttempt: null,
    notes: '',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 2,
    title: 'Add Two Numbers',
    company: 'Amazon',
    difficulty: 'medium',
    link: 'https://leetcode.com/problems/add-two-numbers/',
    tags: ['Linked List', 'Math', 'Recursion'],
    description: 'You are given two non-empty linked lists representing two non-negative integers.',
    solved: true,
    attempts: 3,
    lastAttempt: '2024-01-15T10:30:00Z',
    notes: 'Remember to handle carry properly',
    timeComplexity: 'O(max(m,n))',
    spaceComplexity: 'O(max(m,n))'
  },
  {
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    company: 'Meta',
    difficulty: 'medium',
    link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    solved: false,
    attempts: 1,
    lastAttempt: '2024-01-14T15:45:00Z',
    notes: 'Try sliding window approach',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(m,n))'
  },
  {
    id: 4,
    title: 'Median of Two Sorted Arrays',
    company: 'Microsoft',
    difficulty: 'hard',
    link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
    solved: false,
    attempts: 0,
    lastAttempt: null,
    notes: '',
    timeComplexity: 'O(log(min(m,n)))',
    spaceComplexity: 'O(1)'
  },
  {
    id: 5,
    title: 'Valid Parentheses',
    company: 'Apple',
    difficulty: 'easy',
    link: 'https://leetcode.com/problems/valid-parentheses/',
    tags: ['String', 'Stack'],
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    solved: true,
    attempts: 1,
    lastAttempt: '2024-01-13T09:20:00Z',
    notes: 'Simple stack problem',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  }
];

// Fetch all questions
export const fetchQuestions = async (options = {}) => {
  const { useCache = true, company = null, difficulty = null } = options;

  try {
    // Check cache first (if enabled)
    if (useCache && typeof window !== 'undefined') {
      const cached = localStorage.getItem('leettrack_questions');
      const cacheTimestamp = localStorage.getItem('leettrack_questions_timestamp');
      
      if (cached && cacheTimestamp) {
        const age = Date.now() - parseInt(cacheTimestamp);
        const maxAge = 5 * 60 * 1000; // 5 minutes
        
        if (age < maxAge) {
          console.log('📦 Using cached questions data');
          const questions = JSON.parse(cached);
          return filterQuestions(questions, { company, difficulty });
        }
      }
    }

    // Try to fetch from API first
    let questions;
    try {
      console.log('🌐 Fetching questions from API...');
      questions = await httpClient(`${API_BASE_URL}/questions`);
    } catch (error) {
      console.warn('⚠️ API unavailable, using mock data:', error.message);
      questions = MOCK_QUESTIONS;
    }

    // Cache the results
    if (typeof window !== 'undefined') {
      localStorage.setItem('leettrack_questions', JSON.stringify(questions));
      localStorage.setItem('leettrack_questions_timestamp', Date.now().toString());
    }

    return filterQuestions(questions, { company, difficulty });
  } catch (error) {
    console.error('❌ Error fetching questions:', error);
    throw error;
  }
};

// Fetch questions for a specific company
export const fetchQuestionsByCompany = async (companyName) => {
  if (!companyName) {
    throw new APIError('Company name is required', API_ERRORS.VALIDATION_ERROR);
  }

  try {
    return await fetchQuestions({ company: companyName });
  } catch (error) {
    console.error(`❌ Error fetching questions for ${companyName}:`, error);
    throw error;
  }
};

// Update question progress
export const updateQuestionProgress = async (questionId, progressData) => {
  if (!questionId) {
    throw new APIError('Question ID is required', API_ERRORS.VALIDATION_ERROR);
  }

  try {
    const response = await httpClient(`${API_BASE_URL}/questions/${questionId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });

    // Update local cache
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('leettrack_questions');
      if (cached) {
        const questions = JSON.parse(cached);
        const questionIndex = questions.findIndex(q => q.id === questionId);
        if (questionIndex !== -1) {
          questions[questionIndex] = { ...questions[questionIndex], ...progressData };
          localStorage.setItem('leettrack_questions', JSON.stringify(questions));
        }
      }
    }

    return response;
  } catch (error) {
    console.error(`❌ Error updating question ${questionId}:`, error);
    throw error;
  }
};

// Get user statistics
export const fetchUserStats = async () => {
  try {
    const questions = await fetchQuestions();
    
    const stats = {
      total: questions.length,
      solved: questions.filter(q => q.solved).length,
      easy: questions.filter(q => q.difficulty === 'easy').length,
      medium: questions.filter(q => q.difficulty === 'medium').length,
      hard: questions.filter(q => q.difficulty === 'hard').length,
      easySolved: questions.filter(q => q.difficulty === 'easy' && q.solved).length,
      mediumSolved: questions.filter(q => q.difficulty === 'medium' && q.solved).length,
      hardSolved: questions.filter(q => q.difficulty === 'hard' && q.solved).length,
      companies: [...new Set(questions.map(q => q.company))].length,
      recentActivity: questions
        .filter(q => q.lastAttempt)
        .sort((a, b) => new Date(b.lastAttempt) - new Date(a.lastAttempt))
        .slice(0, 10)
    };

    stats.successRate = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
    
    return stats;
  } catch (error) {
    console.error('❌ Error fetching user stats:', error);
    throw error;
  }
};

// Search questions
export const searchQuestions = async (query, filters = {}) => {
  if (!query || query.trim().length === 0) {
    return await fetchQuestions(filters);
  }

  try {
    const questions = await fetchQuestions();
    const searchTerm = query.toLowerCase().trim();
    
    const filtered = questions.filter(question => {
      const titleMatch = question.title.toLowerCase().includes(searchTerm);
      const companyMatch = question.company.toLowerCase().includes(searchTerm);
      const tagMatch = question.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      const descriptionMatch = question.description?.toLowerCase().includes(searchTerm);
      
      return titleMatch || companyMatch || tagMatch || descriptionMatch;
    });

    return filterQuestions(filtered, filters);
  } catch (error) {
    console.error('❌ Error searching questions:', error);
    throw error;
  }
};

// Helper function to filter questions
const filterQuestions = (questions, filters) => {
  let filtered = [...questions];

  if (filters.company) {
    filtered = filtered.filter(q => 
      q.company.toLowerCase() === filters.company.toLowerCase()
    );
  }

  if (filters.difficulty) {
    filtered = filtered.filter(q => 
      q.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
    );
  }

  if (filters.solved !== undefined) {
    filtered = filtered.filter(q => q.solved === filters.solved);
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(q =>
      filters.tags.some(tag => 
        q.tags.some(qTag => qTag.toLowerCase().includes(tag.toLowerCase()))
      )
    );
  }

  return filtered;
};

// Clear cache
export const clearCache = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('leettrack_questions');
    localStorage.removeItem('leettrack_questions_timestamp');
    console.log('🗑️ Cache cleared');
  }
};

// Export mock data for testing
export { MOCK_QUESTIONS };
