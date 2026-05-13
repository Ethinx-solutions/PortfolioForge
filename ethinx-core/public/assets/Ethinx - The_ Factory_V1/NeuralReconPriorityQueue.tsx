/**
 * NEURAL RECON PRIORITY QUEUE
 * High-Value Transaction Detection & Sensory Alerts
 * 
 * Triggers CSS pulse + console log for $2,500 AUD (250000 cents) transactions
 * Design: Industrial Aesthetic (Pure Black #000000, Metallic Gold #D4AF37)
 */

import React, { useState, useEffect } from "react";
import { AlertTriangle, Zap, Volume2 } from "lucide-react";

interface HighValueTransaction {
  id: string;
  sessionId: string;
  amount: number;
  tier: string;
  customer?: string;
  timestamp: string;
  alertTriggered: boolean;
}

interface NeuralReconProps {
  onHighValueDetected?: (transaction: HighValueTransaction) => void;
}

export const NeuralReconPriorityQueue: React.FC<NeuralReconProps> = ({ onHighValueDetected }) => {
  const [highValueTransactions, setHighValueTransactions] = useState<HighValueTransaction[]>([]);
  const [activeAlert, setActiveAlert] = useState<HighValueTransaction | null>(null);
  const [alertHistory, setAlertHistory] = useState<HighValueTransaction[]>([]);

  // Monitor for high-value transactions
  useEffect(() => {
    // Listen for custom events from Launch Sentry
    const handleHighValueEvent = (event: CustomEvent) => {
      const transaction = event.detail as HighValueTransaction;

      if (transaction.amount >= 250000) {
        triggerNeuralReconAlert(transaction);
      }
    };

    window.addEventListener("high-value-transaction", handleHighValueEvent as EventListener);

    return () => {
      window.removeEventListener("high-value-transaction", handleHighValueEvent as EventListener);
    };
  }, []);

  // Trigger Neural Recon alert
  const triggerNeuralReconAlert = (transaction: HighValueTransaction) => {
    // Set active alert
    setActiveAlert(transaction);

    // Add to high-value transactions list
    setHighValueTransactions((prev) => [transaction, ...prev.slice(0, 9)]);

    // Add to alert history
    setAlertHistory((prev) => [transaction, ...prev.slice(0, 19)]);

    // Log to console with visual emphasis
    console.log("\n🚨 NEURAL RECON PRIORITY QUEUE ACTIVATED 🚨");
    console.log("═══════════════════════════════════════════════════");
    console.log(`VAULT TIER PAYMENT DETECTED`);
    console.log(`Amount: $${(transaction.amount / 100).toFixed(2)} AUD`);
    console.log(`Tier: ${transaction.tier.toUpperCase()}`);
    console.log(`Session: ${transaction.sessionId}`);
    console.log(`Timestamp: ${new Date(transaction.timestamp).toLocaleTimeString()}`);
    console.log("═══════════════════════════════════════════════════\n");

    // Trigger sensory alert
    triggerSensoryAlert();

    // Call callback if provided
    if (onHighValueDetected) {
      onHighValueDetected(transaction);
    }

    // Clear active alert after 8 seconds
    setTimeout(() => {
      setActiveAlert(null);
    }, 8000);
  };

  // Sensory alert: CSS pulse + audio notification
  const triggerSensoryAlert = () => {
    // Play notification sound (optional)
    playNotificationSound();

    // Trigger haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 500]);
    }
  };

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // High-frequency alert tone
      oscillator.frequency.value = 1000; // 1kHz
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Audio notification not available:", error);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)} AUD`;
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="w-full font-rajdhani">
      {/* Active Alert - Full Screen Overlay */}
      {activeAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-2xl bg-black border-4 border-red-500 p-8 animate-pulse"
            style={{ borderRadius: 0 }}
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-16 w-16 bg-red-600" style={{ borderRadius: 0 }}>
                  <AlertTriangle className="h-8 w-8 text-black" />
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-orbitron font-bold text-red-500 tracking-widest mb-2">
                  🚨 NEURAL RECON ALERT 🚨
                </h1>
                <p className="text-xl text-red-400 font-orbitron tracking-wide mb-4">
                  VAULT TIER PAYMENT DETECTED
                </p>

                <div className="space-y-3 text-lg">
                  <div className="flex justify-between items-center border-b border-red-500/30 pb-2">
                    <span className="text-gray-400">Amount:</span>
                    <span className="font-bold text-red-400">{formatCurrency(activeAlert.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-red-500/30 pb-2">
                    <span className="text-gray-400">Tier:</span>
                    <span className="font-bold text-yellow-600">{activeAlert.tier.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-red-500/30 pb-2">
                    <span className="text-gray-400">Session ID:</span>
                    <span className="font-mono text-sm text-gray-300">{activeAlert.sessionId.slice(0, 20)}...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-gray-300">{formatTime(activeAlert.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Neural Recon Dashboard */}
      <div className="bg-black text-white border-b-2 border-yellow-600/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-600 flex items-center justify-center" style={{ borderRadius: 0 }}>
            <Zap className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-orbitron font-bold text-red-500 tracking-widest">
              NEURAL RECON PRIORITY QUEUE
            </h2>
            <p className="text-xs text-gray-400 mt-1">High-Value Transaction Detection System</p>
          </div>
        </div>

        {/* High-Value Transactions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highValueTransactions.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-gray-500">
              <p className="text-sm">No high-value transactions detected yet</p>
              <p className="text-xs mt-2">Transactions ≥ $2,500 AUD will appear here</p>
            </div>
          ) : (
            highValueTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-red-950/30 border-2 border-red-500/50 p-4"
                style={{ borderRadius: 0 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-orbitron text-red-400 tracking-wide">VAULT TIER</p>
                    <p className="text-2xl font-bold text-red-500 mt-1">
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <Volume2 className="w-5 h-5 text-red-500" />
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-gray-400">
                    <span className="text-gray-500">Session:</span>{" "}
                    <span className="text-gray-300 font-mono">{transaction.sessionId.slice(0, 16)}...</span>
                  </p>
                  <p className="text-gray-400">
                    <span className="text-gray-500">Time:</span> <span className="text-gray-300">{formatTime(transaction.timestamp)}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Alert History */}
      {alertHistory.length > 0 && (
        <div className="bg-gray-950 border-t border-yellow-600/30 p-6">
          <h3 className="text-lg font-orbitron font-bold text-yellow-600 mb-4 tracking-widest">
            ALERT HISTORY
          </h3>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alertHistory.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-900/50 border-l-4 border-red-500"
                style={{ borderRadius: 0 }}
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{formatTime(transaction.timestamp)}</p>
                </div>
                <span className="text-xs font-orbitron text-red-500 tracking-wide">
                  {transaction.tier.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Styles for pulse animation */}
      <style>{`
        @keyframes neural-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(239, 68, 68, 0);
          }
        }

        .animate-pulse {
          animation: neural-pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default NeuralReconPriorityQueue;
