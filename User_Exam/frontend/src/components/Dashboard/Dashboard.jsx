import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const Dashboard = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserResults();
  }, []);

  const fetchUserResults = async () => {
    try {
      const response = await apiService.getUserResults();
      setResults(response.data.results);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const startExam = () => {
    navigate('/exam');
  };

  const viewResult = (resultId) => {
    navigate(`/results/${resultId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-nav">
          <div className="dashboard-logo">
            ExamPlatform
          </div>
          
          <div className="dashboard-user">
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>
            <button 
              onClick={logout}
              className="btn btn-outline"
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Start New Exam</h2>
              <p className="card-subtitle">
                Take a practice exam with randomized questions
              </p>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '12px', color: '#374151' }}>
                  Exam Details:
                </h4>
                <ul style={{ color: '#6b7280', lineHeight: '1.8' }}>
                  <li>• 10 randomized questions</li>
                  <li>• 30 minutes time limit</li>
                  <li>• Multiple choice format</li>
                  <li>• Auto-submit when time expires</li>
                </ul>
              </div>
              <button 
                onClick={startExam}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Start Exam
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Your Performance</h2>
              <p className="card-subtitle">
                Track your progress and results
              </p>
            </div>
            <div className="card-body">
              {results.length > 0 ? (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(2, 1fr)', 
                      gap: '16px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '24px', 
                          fontWeight: '700', 
                          color: '#667eea' 
                        }}>
                          {results.length}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          Exams Taken
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '24px', 
                          fontWeight: '700', 
                          color: '#10b981' 
                        }}>
                          {results.length > 0 
                            ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
                            : 0}%
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          Average Score
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    maxHeight: '200px', 
                    overflowY: 'auto',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}>
                    {results.slice(0, 5).map((result, index) => (
                      <div 
                        key={result._id}
                        style={{
                          padding: '12px 16px',
                          borderBottom: index < Math.min(results.length, 5) - 1 ? '1px solid #e5e7eb' : 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '14px' }}>
                            {result.score}/{result.totalQuestions} ({result.percentage}%)
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {formatDate(result.completedAt)}
                          </div>
                        </div>
                        <button
                          onClick={() => viewResult(result._id)}
                          className="btn btn-outline"
                          style={{ fontSize: '12px', padding: '4px 12px' }}
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                  <p>No exams taken yet.</p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>
                    Start your first exam to see your results here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {results.length > 0 && (
          <div className="card" style={{ marginTop: '24px' }}>
            <div className="card-header" style={{ background: 'white', color: '#1f2937' }}>
              <h2 className="card-title">Recent Exam History</h2>
              <p className="card-subtitle" style={{ color: '#6b7280' }}>
                View all your previous exam attempts
              </p>
            </div>
            <div className="card-body">
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Date
                      </th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Score
                      </th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Percentage
                      </th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Time Spent
                      </th>
                      <th style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr 
                        key={result._id}
                        style={{
                          borderBottom: '1px solid #e5e7eb'
                        }}
                      >
                        <td style={{ padding: '12px' }}>
                          {formatDate(result.completedAt)}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {result.score}/{result.totalQuestions}
                        </td>
                        <td style={{ 
                          padding: '12px', 
                          textAlign: 'center',
                          color: result.percentage >= 70 ? '#10b981' : result.percentage >= 50 ? '#d97706' : '#ef4444',
                          fontWeight: '600'
                        }}>
                          {result.percentage}%
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {formatTime(result.timeSpent)}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            onClick={() => viewResult(result._id)}
                            className="btn btn-outline"
                            style={{ fontSize: '12px', padding: '4px 12px' }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;