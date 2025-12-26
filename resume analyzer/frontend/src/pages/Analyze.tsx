import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../App.css';

interface Resume {
  id: string;
  fileName: string;
}

const Analyze = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/api/resumes');
      setResumes(response.data.resumes);
      if (response.data.resumes.length > 0) {
        setSelectedResumeId(response.data.resumes[0].id);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load resumes');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post('/api/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Resume uploaded successfully!');
      await fetchResumes();
      setSelectedResumeId(response.data.resume.id);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!selectedResumeId) {
      setError('Please select or upload a resume');
      setLoading(false);
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      setError('Job description must be at least 50 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/analyses', {
        resumeId: selectedResumeId,
        jobDescription: jobDescription.trim(),
      });

      navigate(`/results/${response.data.analysis.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>Analyze Resume</h2>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleAnalyze}>
            <div className="form-group">
              <label htmlFor="resume">Upload Resume (PDF)</label>
              <input
                type="file"
                id="resume"
                accept="application/pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                style={{ padding: '0.5rem' }}
              />
              {uploading && <p style={{ marginTop: '0.5rem', color: '#666' }}>Uploading...</p>}
            </div>

            {resumes.length > 0 && (
              <div className="form-group">
                <label htmlFor="selectResume">Or Select Existing Resume</label>
                <select
                  id="selectResume"
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                  }}
                >
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.fileName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="jobDescription">
                Job Description <span style={{ color: '#666', fontSize: '0.875rem' }}>(min 50 characters)</span>
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here. Include required skills, technologies, and qualifications..."
                required
                minLength={50}
              />
              <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                {jobDescription.length} characters
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading || !selectedResumeId || jobDescription.length < 50}
            >
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Analyze;

