import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../App.css';

interface Resume {
  id: string;
  fileName: string;
  extractedSkills: string[];
  createdAt: string;
}

interface Analysis {
  id: string;
  matchPercentage: number;
  atsScore: number;
  resume: Resume;
  createdAt: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resumesRes, analysesRes] = await Promise.all([
        axios.get('/api/resumes'),
        axios.get('/api/analyses'),
      ]);
      setResumes(resumesRes.data.resumes);
      setAnalyses(analysesRes.data.analyses);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>AI Resume Analyzer</h1>
          <div className="header-actions">
            <span className="user-info">{user?.email}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Resumes</h2>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/analyze')}
            >
              Upload Resume
            </button>
          </div>

          {resumes.length === 0 ? (
            <p style={{ color: '#666' }}>No resumes uploaded yet. Upload your first resume to get started.</p>
          ) : (
            <div>
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  style={{
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3 style={{ marginBottom: '0.5rem' }}>{resume.fileName}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                        Uploaded: {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                      <div>
                        <strong>Skills found:</strong>
                        <div style={{ marginTop: '0.5rem' }}>
                          {resume.extractedSkills.length > 0 ? (
                            resume.extractedSkills.map((skill, idx) => (
                              <span key={idx} className="skill-tag matched">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: '#666' }}>No skills detected</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>Recent Analyses</h2>
          {analyses.length === 0 ? (
            <p style={{ color: '#666' }}>No analyses yet. Upload a resume and analyze it against a job description.</p>
          ) : (
            <div>
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  style={{
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/results/${analysis.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ marginBottom: '0.5rem' }}>{analysis.resume.fileName}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#666' }}>
                        Analyzed: {new Date(analysis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>
                        {analysis.matchPercentage}%
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>Match</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

