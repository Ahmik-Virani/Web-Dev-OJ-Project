import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SubmissionDetail = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetch(`http://localhost:8000/submissions/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch submission');
        }
        const data = await response.json();
        setSubmission(data);
      } catch (error) {
        console.error('Error fetching submission:', error);
        setError(error.message || 'Failed to fetch submission');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!submission) {
    return <div>Submission not found.</div>;
  }

  return (
    <div className="submission-detail">
      <h2>{submission.problem_name}</h2>
      <pre>{submission.code}</pre>
    </div>
  );
};

export default SubmissionDetail;
