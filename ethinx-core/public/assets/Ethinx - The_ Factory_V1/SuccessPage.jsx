/**
 * ETHINX SUCCESS PAGE
 * Displayed after successful payment
 * 
 * Features:
 * - Confirms payment received
 * - Shows T-Dog Certified badge
 * - Displays next steps
 * - Industrial aesthetic (0px border-radius, Metallic Gold, Pure Black)
 * 
 * USAGE:
 * 1. Import: import SuccessPage from './SuccessPage'
 * 2. Add route: <Route path="/success" element={<SuccessPage />} />
 * 3. Stripe redirects here after successful payment
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * COLORS & STYLES
 */
const ETHINX_COLORS = {
  primary: '#D4AF37',      // Metallic Gold
  background: '#000000',   // Pure Black
  text: '#F5F5F5',        // Off-White
  success: '#00D084',     // Success green
};

const INDUSTRIAL_STYLES = {
  borderRadius: '0px',
  fontFamily: "'Orbitron', sans-serif",
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

/**
 * SUCCESS PAGE COMPONENT
 */
export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get('session_id');

  // Fetch session data
  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    const fetchSessionData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/checkout-session/${sessionId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }

        const data = await response.json();
        setSessionData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          background: ETHINX_COLORS.background,
          color: ETHINX_COLORS.text,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
              animation: 'spin 2s linear infinite',
            }}
          >
            ⚙️
          </div>
          <p style={{ fontSize: '16px', color: ETHINX_COLORS.primary }}>
            Processing...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          background: ETHINX_COLORS.background,
          color: ETHINX_COLORS.text,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            width: '100%',
            border: `2px solid #FF6B6B`,
            borderRadius: INDUSTRIAL_STYLES.borderRadius,
            padding: '48px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              ...INDUSTRIAL_STYLES,
              fontSize: '36px',
              color: '#FF6B6B',
              margin: '0 0 16px 0',
            }}
          >
            Error
          </h1>
          <p style={{ fontSize: '14px', color: ETHINX_COLORS.text }}>
            {error}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              marginTop: '24px',
              padding: '12px 24px',
              background: ETHINX_COLORS.primary,
              color: ETHINX_COLORS.background,
              border: 'none',
              borderRadius: INDUSTRIAL_STYLES.borderRadius,
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div
      style={{
        background: ETHINX_COLORS.background,
        color: ETHINX_COLORS.text,
        minHeight: '100vh',
        padding: '48px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          border: `2px solid ${ETHINX_COLORS.primary}`,
          borderRadius: INDUSTRIAL_STYLES.borderRadius,
          padding: '48px',
          textAlign: 'center',
          boxShadow: `0 0 40px ${ETHINX_COLORS.primary}40`,
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            fontSize: '64px',
            marginBottom: '24px',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          ✓
        </div>

        {/* Header */}
        <h1
          style={{
            ...INDUSTRIAL_STYLES,
            fontSize: '36px',
            color: ETHINX_COLORS.success,
            margin: '0 0 8px 0',
          }}
        >
          Payment Successful
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: ETHINX_COLORS.text,
            margin: '0 0 32px 0',
            letterSpacing: '0.05em',
          }}
        >
          Welcome to the ETHINX Execution Layer
        </p>

        {/* T-Dog Certified Badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '32px',
          }}
        >
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663310720290/LWspXAtQPmwsxVEJ.png"
            alt="T-Dog Certified"
            style={{
              width: '80px',
              height: '80px',
              filter: `drop-shadow(0 0 20px ${ETHINX_COLORS.primary}60)`,
            }}
          />
        </div>

        {/* Session Details */}
        {sessionData && (
          <div
            style={{
              background: 'rgba(212, 175, 55, 0.05)',
              border: `1px solid ${ETHINX_COLORS.primary}40`,
              borderRadius: INDUSTRIAL_STYLES.borderRadius,
              padding: '24px',
              marginBottom: '32px',
              textAlign: 'left',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <span
                style={{
                  fontSize: '12px',
                  color: ETHINX_COLORS.primary,
                  ...INDUSTRIAL_STYLES,
                }}
              >
                Email
              </span>
              <p
                style={{
                  fontSize: '14px',
                  color: ETHINX_COLORS.text,
                  margin: '4px 0 0 0',
                }}
              >
                {sessionData.customer_email}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span
                style={{
                  fontSize: '12px',
                  color: ETHINX_COLORS.primary,
                  ...INDUSTRIAL_STYLES,
                }}
              >
                Amount Paid
              </span>
              <p
                style={{
                  fontSize: '20px',
                  color: ETHINX_COLORS.primary,
                  margin: '4px 0 0 0',
                  fontWeight: 'bold',
                }}
              >
                ${(sessionData.amount_total / 100).toFixed(2)} {sessionData.currency.toUpperCase()}
              </p>
            </div>

            <div>
              <span
                style={{
                  fontSize: '12px',
                  color: ETHINX_COLORS.primary,
                  ...INDUSTRIAL_STYLES,
                }}
              >
                Status
              </span>
              <p
                style={{
                  fontSize: '14px',
                  color: ETHINX_COLORS.success,
                  margin: '4px 0 0 0',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                }}
              >
                {sessionData.status === 'paid' ? '✓ Confirmed' : sessionData.status}
              </p>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div
          style={{
            background: 'rgba(212, 175, 55, 0.05)',
            border: `1px solid ${ETHINX_COLORS.primary}40`,
            borderRadius: INDUSTRIAL_STYLES.borderRadius,
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left',
          }}
        >
          <h3
            style={{
              ...INDUSTRIAL_STYLES,
              fontSize: '14px',
              color: ETHINX_COLORS.primary,
              margin: '0 0 16px 0',
            }}
          >
            Next Steps
          </h3>
          <ol
            style={{
              margin: '0',
              paddingLeft: '24px',
              fontSize: '14px',
              color: ETHINX_COLORS.text,
              lineHeight: '1.8',
            }}
          >
            <li>Check your email for confirmation and access details</li>
            <li>Log in to your ETHINX dashboard</li>
            <li>Access your Neural Recon Strike execution layer</li>
            <li>Begin building your $100K+ business</li>
          </ol>
        </div>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: ETHINX_COLORS.primary,
              color: ETHINX_COLORS.background,
              border: 'none',
              borderRadius: INDUSTRIAL_STYLES.borderRadius,
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#E8C547';
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = ETHINX_COLORS.primary;
              e.target.style.transform = 'scale(1)';
            }}
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => window.location.href = '/'}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: 'transparent',
              color: ETHINX_COLORS.primary,
              border: `1px solid ${ETHINX_COLORS.primary}`,
              borderRadius: INDUSTRIAL_STYLES.borderRadius,
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = ETHINX_COLORS.primary;
              e.target.style.color = ETHINX_COLORS.background;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = ETHINX_COLORS.primary;
            }}
          >
            Return Home
          </button>
        </div>

        {/* Support Link */}
        <p
          style={{
            fontSize: '12px',
            color: ETHINX_COLORS.text,
            opacity: 0.7,
          }}
        >
          Need help? Contact{' '}
          <a
            href="mailto:support@ethinx.solutions"
            style={{ color: ETHINX_COLORS.primary, textDecoration: 'none' }}
          >
            support@ethinx.solutions
          </a>
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default SuccessPage;
