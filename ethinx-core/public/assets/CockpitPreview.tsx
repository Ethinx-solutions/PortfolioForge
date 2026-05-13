import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Zap, TrendingUp, AlertCircle } from "lucide-react";

export default function CockpitPreview() {
  const [workflowData, setWorkflowData] = useState([
    { time: "00:00", active: 12, completed: 48 },
    { time: "04:00", active: 19, completed: 62 },
    { time: "08:00", active: 28, completed: 85 },
    { time: "12:00", active: 35, completed: 110 },
    { time: "16:00", active: 32, completed: 128 },
    { time: "20:00", active: 24, completed: 145 },
  ]);

  const [agentMetrics, setAgentMetrics] = useState([
    { name: "Agent A", efficiency: 94 },
    { name: "Agent B", efficiency: 87 },
    { name: "Agent C", efficiency: 91 },
    { name: "Agent D", efficiency: 88 },
    { name: "Agent E", efficiency: 95 },
  ]);

  const [systemHealth, setSystemHealth] = useState({
    uptime: "99.8%",
    latency: "142ms",
    throughput: "2.3K ops/s",
    errors: "0.2%",
  });

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkflowData((prev) =>
        prev.map((d) => ({
          ...d,
          active: Math.max(5, d.active + Math.random() * 10 - 5),
          completed: d.completed + Math.floor(Math.random() * 5),
        }))
      );

      setAgentMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          efficiency: Math.min(100, Math.max(70, m.efficiency + (Math.random() - 0.5) * 3)),
        }))
      );

      setSystemHealth((prev) => ({
        ...prev,
        latency: `${Math.floor(120 + Math.random() * 60)}ms`,
        throughput: `${(2.1 + Math.random() * 0.4).toFixed(1)}K ops/s`,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-background py-20">
      <div className="container">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Sovereign Cockpit in Action
          </h2>
          <p className="text-lg text-muted mb-2">
            Real-time visibility into your entire automation universe.
          </p>
        </div>

        {/* Main Cockpit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - TDog Mascot & System Health */}
          <div className="lg:col-span-1">
            <div className="cockpit-tile h-full flex flex-col items-center justify-center text-center">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663263238695/mJGrfetK4zeYhgVdM8fcdz/3dtdog_a7ccf85e.gif"
                alt="TDog Mascot"
                className="w-32 h-32 mb-6 drop-shadow-lg"
              />
              <h3 className="text-xl font-bold text-accent mb-6">System Status</h3>
              <div className="space-y-4 w-full">
                <div className="bg-background/50 rounded p-3 border border-border">
                  <p className="text-sm text-muted mb-1">Uptime</p>
                  <p className="text-2xl font-bold text-accent">{systemHealth.uptime}</p>
                </div>
                <div className="bg-background/50 rounded p-3 border border-border">
                  <p className="text-sm text-muted mb-1">Latency</p>
                  <p className="text-2xl font-bold text-accent">{systemHealth.latency}</p>
                </div>
                <div className="bg-background/50 rounded p-3 border border-border">
                  <p className="text-sm text-muted mb-1">Throughput</p>
                  <p className="text-2xl font-bold text-accent">{systemHealth.throughput}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Workflow Activity */}
          <div className="lg:col-span-1">
            <div className="cockpit-tile">
              <div className="cockpit-tile-header">
                <h3 className="cockpit-tile-title">Workflow Activity</h3>
                <Activity size={20} className="text-accent" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={workflowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252525" />
                  <XAxis dataKey="time" stroke="#888888" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#888888" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#131313",
                      border: "1px solid #252525",
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "#F2F2F2" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="#C9A84C"
                    strokeWidth={2}
                    dot={false}
                    name="Active"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#E8C96A"
                    strokeWidth={2}
                    dot={false}
                    name="Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column - Agent Performance */}
          <div className="lg:col-span-1">
            <div className="cockpit-tile">
              <div className="cockpit-tile-header">
                <h3 className="cockpit-tile-title">Agent Efficiency</h3>
                <Zap size={20} className="text-accent" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={agentMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252525" />
                  <XAxis dataKey="name" stroke="#888888" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#888888" style={{ fontSize: "12px" }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#131313",
                      border: "1px solid #252525",
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "#F2F2F2" }}
                  />
                  <Bar dataKey="efficiency" fill="#C9A84C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row - Operational Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tile 1 - Active Workflows */}
          <div className="cockpit-tile">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="cockpit-tile-label">Active Workflows</p>
                <p className="cockpit-tile-value">
                  {Math.floor(workflowData[workflowData.length - 1].active)}
                </p>
              </div>
              <div className="w-8 h-8 rounded bg-green-900/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              </div>
            </div>
            <p className="text-xs text-muted">Running in parallel</p>
          </div>

          {/* Tile 2 - Completed Tasks */}
          <div className="cockpit-tile">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="cockpit-tile-label">Completed Tasks</p>
                <p className="cockpit-tile-value">
                  {Math.floor(workflowData[workflowData.length - 1].completed)}
                </p>
              </div>
              <div className="w-8 h-8 rounded bg-green-900/30 flex items-center justify-center">
                <TrendingUp size={16} className="text-green-400" />
              </div>
            </div>
            <p className="text-xs text-muted">Last 24 hours</p>
          </div>

          {/* Tile 3 - System Health */}
          <div className="cockpit-tile">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="cockpit-tile-label">System Health</p>
                <p className="cockpit-tile-value">99.8%</p>
              </div>
              <div className="w-8 h-8 rounded bg-green-900/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
            </div>
            <p className="text-xs text-muted">All systems nominal</p>
          </div>

          {/* Tile 4 - Error Rate */}
          <div className="cockpit-tile">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="cockpit-tile-label">Error Rate</p>
                <p className="cockpit-tile-value">0.2%</p>
              </div>
              <div className="w-8 h-8 rounded bg-yellow-900/30 flex items-center justify-center">
                <AlertCircle size={16} className="text-yellow-300" />
              </div>
            </div>
            <p className="text-xs text-muted">Within acceptable range</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-muted mb-6">Ready to take control of your automation universe?</p>
          <button className="cta-primary inline-flex items-center justify-center gap-2">
            Access the Full Cockpit
            <Zap size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
