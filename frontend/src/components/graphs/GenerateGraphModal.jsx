import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import graphService from '../../services/graphService';

const SUGGESTED_TOPICS = [
  'Neural Networks & Backpropagation',
  'Human Circadian Rhythm & Melatonin',
  'Zero-Knowledge Proofs in Cryptography',
  'Microservices Architecture & Resilience Patterns',
  'CRISPR Gene Editing & DNA Repair'
];

const GenerateGraphModal = ({ onClose, onGenerated }) => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const generatedGraph = await graphService.generateGraph(prompt.trim(), isPublic);
      if (onGenerated) {
        onGenerated(generatedGraph);
      }
      onClose();
      // Navigate straight to the interactive canvas for the new graph
      navigate(`/graphs/${generatedGraph.id}/canvas`);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to generate graph with Gemini';
      setError(errMsg);
      setLoading(false);
    }
  };

  const handleChipClick = (topic) => {
    setPrompt(topic);
    setError(null);
  };

  return (
    <div className="modal-overlay" onClick={loading ? undefined : onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', padding: '2rem' }}
      >
        {/* MODAL HEADER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge lime">[ AI SYNTHESIS ]</span>
              <span className="badge">POWERED BY GEMINI</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Generate Knowledge Graph
            </h2>
            <p className="muted" style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem' }}>
              Synthesize a multi-concept knowledge mesh with semantically linked nodes and relationships.
            </p>
          </div>
          {!loading && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.25rem',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                padding: '0.25rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(255, 51, 75, 0.1)',
            border: '1px solid rgba(255, 51, 75, 0.4)',
            borderRadius: 'var(--radius-md)',
            color: '#ff6b7e',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            marginBottom: '1.25rem',
            lineHeight: 1.5
          }}>
            <span>[!] {error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
              letterSpacing: '0.05em'
            }}>
              Topic / Research Query *
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Distributed Consensus in Blockchain, Synaptic Plasticity and Memory Encoding, Microservices Fault Tolerance Patterns..."
              required
              disabled={loading}
              rows={3}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.75rem',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-strong)',
                background: 'var(--surface-color-elevated)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-main)',
                resize: 'vertical'
              }}
            />
          </div>

          {/* SUGGESTION CHIPS */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.4rem'
            }}>
              Suggested Topics:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {SUGGESTED_TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  disabled={loading}
                  onClick={() => handleChipClick(topic)}
                  style={{
                    background: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.color = 'var(--accent-color)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  + {topic}
                </button>
              ))}
            </div>
          </div>

          {/* VISIBILITY TOGGLE */}
          <div style={{
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Publish to Discovery
              </span>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  disabled={loading}
                  style={{ accentColor: 'var(--accent-color)', width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: isPublic ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
                  {isPublic ? 'PUBLIC' : 'PRIVATE'}
                </span>
              </label>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: '0.75rem', lineHeight: 1.4 }}>
              {isPublic
                ? 'Public graphs appear in your Workspace and are shared with all researchers in Discovery.'
                : 'Private graphs are accessible exclusively within your private Workspace.'}
            </p>
          </div>

          {/* FOOTER ACTIONS */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-strong)',
                color: 'var(--text-secondary)',
                padding: '0.5rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="btn primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: loading || !prompt.trim() ? 0.7 : 1,
                cursor: loading ? 'wait' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                  <span>Synthesizing with Gemini...</span>
                </>
              ) : (
                <>
                  <span>Generate Mesh</span>
                  <span>✨</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateGraphModal;
