import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../App.css';

interface AnalysisResult {
  id: string;
  matchPercentage: number;
  atsScore: number;
  missingSkills: string[];
  requiredSkills: string[];
  matchedSkills: string[];
  aiFeedback: string | null;
  resume: {
    id: string;
    fileName: string;
    extractedSkills: string[];
  };
  createdAt: string;
}

const Results = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalysis();
  }, [analysisId]);

  const fetchAnalysis = async () => {
    try {
      const response = await axios.get(`/api/analyses/${analysisId}`);
      setAnalysis(response.data.analysis);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-medium';
    return 'score-low';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error || !analysis) {
    return (
      <div className="container">
        <div className="card">
          <div className="error-message">{error || 'Analysis not found'}</div>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>AI Resume Analyzer</h1>
          <div className="header-actions">
            <span className="user-info">{user?.email}</span>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/analyze')}>
              New Analysis
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>Analysis Results</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Resume: <strong>{analysis.resume.fileName}</strong> | 
            Analyzed: {new Date(analysis.createdAt).toLocaleString()}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div className={`score-circle ${getScoreClass(analysis.matchPercentage)}`}>
                {analysis.matchPercentage}%
              </div>
              <h3 style={{ marginTop: '1rem' }}>Match Score</h3>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>
                Skills matched: {analysis.matchedSkills.length} / {analysis.requiredSkills.length}
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div className={`score-circle ${getScoreClass(analysis.atsScore)}`}>
                {analysis.atsScore}%
              </div>
              <h3 style={{ marginTop: '1rem' }}>ATS Score</h3>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>
                ATS compatibility rating
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Required Skills</h3>
            <div>
              {analysis.requiredSkills.map((skill, idx) => {
                const isMatched = analysis.matchedSkills.includes(skill);
                return (
                  <span
                    key={idx}
                    className={`skill-tag ${isMatched ? 'matched' : 'missing'}`}
                  >
                    {skill} {isMatched ? '✓' : '✗'}
                  </span>
                );
              })}
            </div>
          </div>

          {analysis.missingSkills.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#dc3545' }}>Missing Skills</h3>
              <div>
                {analysis.missingSkills.map((skill, idx) => (
                  <span key={idx} className="skill-tag missing">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Resume Skills</h3>
            <div>
              {analysis.resume.extractedSkills.length > 0 ? (
                analysis.resume.extractedSkills.map((skill, idx) => (
                  <span key={idx} className="skill-tag matched">
                    {skill}
                  </span>
                ))
              ) : (
                <p style={{ color: '#666' }}>No skills detected in resume</p>
              )}
            </div>
          </div>

          {analysis.aiFeedback && (
            <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '1rem' }}>AI Feedback & Suggestions</h3>
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  color: '#333',
                }}
                dangerouslySetInnerHTML={{
                  __html: analysis.aiFeedback.replace(/\n/g, '<br />'),
                }}
              />
            </div>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/analyze')}>
              Analyze Another Resume
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function handleLogout() {
    logout();
    navigate('/login');
  }
};

export default Results;

