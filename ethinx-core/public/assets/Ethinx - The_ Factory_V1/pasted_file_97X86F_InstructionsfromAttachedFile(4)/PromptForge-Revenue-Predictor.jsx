import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as Plot from '@observablehq/plot';
import { createClient } from '@supabase/supabase-js';

/**
 * PromptForge Revenue Predictor Dashboard
 * 
 * T-Dog Protocol: High-velocity, real-time revenue visualization
 * 
 * Features:
 * - Interactive sliders (Pack Speed, Niche Difficulty, Ad Spend)
 * - T-Dog benchmark (4-week blitzkrieg trajectory)
 * - Real-time data shiver (Actual revenue updates with Coral Orange glow)
 * - What If engine (instant pack sequence recalculation)
 * - Observable Plot visualization (Navy Blue + Coral Orange)
 */

const RevenuePredictor = ({ founderData = {}, initialGoal = 'build', projectId = null }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const containerRef = useRef(null);
  const plotRef = useRef(null);
  
  // Slider controls
  const [packExecutionSpeed, setPackExecutionSpeed] = useState(1.0); // 0.5x to 2x
  const [nicheDifficulty, setNicheDifficulty] = useState(1.0); // 0.5x to 2x
  const [adSpend, setAdSpend] = useState(1000); // $0 to $10,000
  
  // Data state
  const [projections, setProjections] = useState([]);
  const [actuals, setActuals] = useState([]);
  const [tDogBenchmark, setTDogBenchmark] = useState([]);
  const [realtimeUpdates, setRealtimeUpdates] = useState([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);
  const [currentMRR, setCurrentMRR] = useState(0);
  const [targetMRR, setTargetMRR] = useState(50000);
  
  // ============================================================================
  // T-DOG BENCHMARK: 4-Week Blitzkrieg Trajectory
  // ============================================================================
  
  const generateTDogBenchmark = useCallback(() => {
    /**
     * T-Dog's actual 4-week execution trajectory:
     * Week 1: $5K-10K
     * Week 2: $20K-50K
     * Week 3: $50K-100K
     * Week 4: $30K-50K MRR (stabilized)
     * 
     * This is the reference line that founders see as "the bar to beat"
     */
    const benchmark = [];
    
    for (let day = 0; day <= 28; day++) {
      let revenue = 0;
      
      if (day <= 7) {
        // Week 1: Linear ramp from $0 to $7.5K
        revenue = (day / 7) * 7500;
      } else if (day <= 14) {
        // Week 2: Exponential jump from $7.5K to $35K
        const week2Progress = (day - 7) / 7;
        revenue = 7500 + (week2Progress ** 1.8) * 27500;
      } else if (day <= 21) {
        // Week 3: Aggressive scaling from $35K to $75K
        const week3Progress = (day - 14) / 7;
        revenue = 35000 + (week3Progress ** 1.5) * 40000;
      } else {
        // Week 4: Stabilization around $50K MRR
        const week4Progress = (day - 21) / 7;
        revenue = 75000 - (week4Progress ** 1.2) * 25000;
      }
      
      benchmark.push({
        day,
        revenue: Math.round(revenue),
        type: 'T-Dog Benchmark',
        label: `Day ${day}`
      });
    }
    
    return benchmark;
  }, []);
  
  // ============================================================================
  // PROJECTION ENGINE: Calculate revenue trajectory based on inputs
  // ============================================================================
  
  const generateProjections = useCallback((speed, difficulty, spend) => {
    /**
     * Projection Algorithm:
     * 
     * Base curve: Exponential growth with inflection points
     * Modifiers:
     * - Pack Execution Speed: Accelerates or decelerates the curve
     * - Niche Difficulty: Reduces revenue potential (harder niches = slower growth)
     * - Ad Spend: Increases user acquisition and revenue
     * 
     * Formula:
     * revenue(day) = baseRevenue(day) * speedMultiplier * (1 / difficultyMultiplier) * (1 + adSpendBoost)
     */
    
    const projections = [];
    const speedMultiplier = speed;
    const difficultyMultiplier = difficulty;
    const adSpendBoost = Math.log(spend + 1) / 10; // Logarithmic diminishing returns
    
    for (let day = 0; day <= 28; day++) {
      // Adjust day based on execution speed
      const adjustedDay = day / speedMultiplier;
      
      let baseRevenue = 0;
      
      if (adjustedDay <= 7) {
        // Week 1: Foundation phase
        baseRevenue = (adjustedDay / 7) * 5000;
      } else if (adjustedDay <= 14) {
        // Week 2: Launch and traction
        const week2Progress = (adjustedDay - 7) / 7;
        baseRevenue = 5000 + (week2Progress ** 1.7) * 25000;
      } else if (adjustedDay <= 21) {
        // Week 3: Momentum and optimization
        const week3Progress = (adjustedDay - 14) / 7;
        baseRevenue = 30000 + (week3Progress ** 1.4) * 35000;
      } else {
        // Week 4: Scale and revenue acceleration
        const week4Progress = (adjustedDay - 21) / 7;
        baseRevenue = 65000 - (week4Progress ** 1.1) * 15000;
      }
      
      // Apply modifiers
      const finalRevenue = Math.round(
        baseRevenue * speedMultiplier * (1 / difficultyMultiplier) * (1 + adSpendBoost)
      );
      
      projections.push({
        day,
        revenue: Math.max(0, finalRevenue),
        type: 'Projection',
        label: `Day ${day}`
      });
    }
    
    return projections;
  }, []);
  
  // ============================================================================
  // REAL-TIME SHIVER: Supabase Realtime Integration
  // ============================================================================
  
  useEffect(() => {
    if (!projectId) return;
    
    const supabase = createClient(
      process.env.REACT_APP_SUPABASE_URL,
      process.env.REACT_APP_SUPABASE_ANON_KEY
    );
    
    /**
     * Subscribe to pack execution events
     * When a pack finishes, the actual revenue line jumps and glows
     */
    const subscription = supabase
      .channel(`project:${projectId}:executions`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pack_executions',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          const execution = payload.new;
          
          // Calculate revenue from this execution
          const executionRevenue = execution.revenue_generated || 0;
          
          // Add to actuals with timestamp
          const newActual = {
            day: Math.floor((Date.now() - execution.created_at) / (1000 * 60 * 60 * 24)),
            revenue: currentMRR + executionRevenue,
            type: 'Actual',
            timestamp: execution.created_at,
            packName: execution.pack_name,
            isNew: true // Trigger glow animation
          };
          
          setActuals((prev) => [...prev, newActual]);
          setCurrentMRR((prev) => prev + executionRevenue);
          setLastUpdateTime(new Date());
          
          // Remove "isNew" flag after animation completes
          setTimeout(() => {
            setActuals((prev) =>
              prev.map((a) => ({ ...a, isNew: false }))
            );
          }, 1000);
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [projectId, currentMRR]);
  
  // ============================================================================
  // WHAT IF ENGINE: Instant recalculation
  // ============================================================================
  
  const handleSpeedChange = useCallback((newSpeed) => {
    setPackExecutionSpeed(newSpeed);
    // Instant recalculation (no loading spinner)
    const newProjections = generateProjections(newSpeed, nicheDifficulty, adSpend);
    setProjections(newProjections);
  }, [nicheDifficulty, adSpend, generateProjections]);
  
  const handleDifficultyChange = useCallback((newDifficulty) => {
    setNicheDifficulty(newDifficulty);
    const newProjections = generateProjections(packExecutionSpeed, newDifficulty, adSpend);
    setProjections(newProjections);
  }, [packExecutionSpeed, adSpend, generateProjections]);
  
  const handleAdSpendChange = useCallback((newSpend) => {
    setAdSpend(newSpend);
    const newProjections = generateProjections(packExecutionSpeed, nicheDifficulty, newSpend);
    setProjections(newProjections);
  }, [packExecutionSpeed, nicheDifficulty, generateProjections]);
  
  // ============================================================================
  // INITIALIZATION: Generate initial data
  // ============================================================================
  
  useEffect(() => {
    // Generate T-Dog benchmark (one-time)
    const benchmark = generateTDogBenchmark();
    setTDogBenchmark(benchmark);
    
    // Generate initial projections
    const initialProjections = generateProjections(packExecutionSpeed, nicheDifficulty, adSpend);
    setProjections(initialProjections);
    
    // Initialize actuals (empty, will be populated by Realtime)
    setActuals([]);
    setCurrentMRR(0);
  }, []);
  
  // ============================================================================
  // OBSERVABLE PLOT VISUALIZATION
  // ============================================================================
  
  useEffect(() => {
    if (containerRef.current && projections.length > 0) {
      // Clear previous plot
      if (plotRef.current) {
        plotRef.current.remove();
      }
      
      // Combine all data for visualization
      const allData = [
        ...tDogBenchmark.map((d) => ({ ...d, opacity: 0.3, strokeDasharray: '5,5' })), // Ghosted
        ...projections.map((d) => ({ ...d, opacity: 1 })),
        ...actuals.map((d) => ({ ...d, opacity: 1, glow: d.isNew }))
      ];
      
      // Create plot
      const plot = Plot.plot({
        title: 'PromptForge Revenue Predictor',
        subtitle: 'Your path to $50K+ MRR',
        width: 1000,
        height: 500,
        marginLeft: 60,
        marginRight: 20,
        marginTop: 40,
        marginBottom: 40,
        grid: true,
        style: {
          backgroundColor: '#0F3A7D',
          color: '#F5F5F5',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        },
        x: {
          label: 'Days',
          domain: [0, 28],
          type: 'linear'
        },
        y: {
          label: 'Revenue ($)',
          type: 'linear',
          tickFormat: (d) => `$${(d / 1000).toFixed(0)}K`
        },
        color: {
          domain: ['T-Dog Benchmark', 'Projection', 'Actual'],
          range: ['#999999', '#FF6B35', '#00FF00']
        },
        marks: [
          // T-Dog Benchmark (ghosted line)
          Plot.lineY(tDogBenchmark, {
            x: 'day',
            y: 'revenue',
            stroke: '#999999',
            strokeWidth: 2,
            strokeDasharray: '5,5',
            opacity: 0.3,
            title: (d) => `T-Dog Day ${d.day}: $${(d.revenue / 1000).toFixed(1)}K`
          }),
          
          // Projection curve (main line)
          Plot.areaY(projections, {
            x: 'day',
            y: 'revenue',
            fill: '#FF6B35',
            fillOpacity: 0.1
          }),
          Plot.lineY(projections, {
            x: 'day',
            y: 'revenue',
            stroke: '#FF6B35',
            strokeWidth: 3,
            title: (d) => `Projected Day ${d.day}: $${(d.revenue / 1000).toFixed(1)}K`
          }),
          
          // Actual revenue (real-time updates)
          actuals.length > 0 && Plot.lineY(actuals, {
            x: 'day',
            y: 'revenue',
            stroke: '#00FF00',
            strokeWidth: 3,
            title: (d) => `Actual Day ${d.day}: $${(d.revenue / 1000).toFixed(1)}K`
          }),
          
          // Data points with interactive tooltips
          Plot.dot(projections, {
            x: 'day',
            y: 'revenue',
            r: 3,
            fill: '#FF6B35',
            opacity: 0.6,
            title: (d) => `Day ${d.day}: $${(d.revenue / 1000).toFixed(1)}K`
          }),
          
          // Actual data points with glow effect
          actuals.length > 0 && Plot.dot(actuals, {
            x: 'day',
            y: 'revenue',
            r: (d) => d.isNew ? 6 : 4,
            fill: (d) => d.isNew ? '#FF6B35' : '#00FF00',
            opacity: (d) => d.isNew ? 1 : 0.7,
            title: (d) => `${d.packName} - $${(d.revenue / 1000).toFixed(1)}K`
          }),
          
          // Interactive pointer for tooltips
          Plot.tip(projections, Plot.pointer({ x: 'day', y: 'revenue' }))
        ]
      });
      
      containerRef.current.appendChild(plot);
      plotRef.current = plot;
      
      return () => {
        if (plotRef.current) {
          plotRef.current.remove();
        }
      };
    }
  }, [projections, actuals, tDogBenchmark]);
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="w-full bg-[#0F3A7D] rounded-2xl p-8 shadow-2xl border border-[#FF6B35]/30">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Revenue Predictor</h1>
        <p className="text-[#F5F5F5] opacity-80">
          Your path to $50K+ MRR. Adjust the sliders to see how different strategies impact your revenue.
        </p>
      </div>
      
      {/* Current Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a4d99] rounded-lg p-4 border border-[#FF6B35]/20">
          <div className="text-sm text-[#F5F5F5] opacity-60 mb-1">Current MRR</div>
          <div className="text-3xl font-bold text-[#FF6B35]">
            ${(currentMRR / 1000).toFixed(1)}K
          </div>
        </div>
        <div className="bg-[#1a4d99] rounded-lg p-4 border border-[#FF6B35]/20">
          <div className="text-sm text-[#F5F5F5] opacity-60 mb-1">Target MRR</div>
          <div className="text-3xl font-bold text-white">
            ${(targetMRR / 1000).toFixed(0)}K
          </div>
        </div>
        <div className="bg-[#1a4d99] rounded-lg p-4 border border-[#FF6B35]/20">
          <div className="text-sm text-[#F5F5F5] opacity-60 mb-1">Last Update</div>
          <div className="text-lg font-bold text-white">
            {lastUpdateTime ? lastUpdateTime.toLocaleTimeString() : 'Waiting...'}
          </div>
        </div>
      </div>
      
      {/* Visualization */}
      <div className="bg-[#0F3A7D] rounded-lg mb-8 overflow-hidden border border-[#FF6B35]/20">
        <div ref={containerRef} className="w-full" />
      </div>
      
      {/* Interactive Controls */}
      <div className="grid grid-cols-3 gap-6">
        {/* Pack Execution Speed */}
        <div className="bg-[#1a4d99] rounded-lg p-4 border border-[#FF6B35]/20">
          <label className="block text-sm font-bold text-white mb-3">
            Pack Execution Speed
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={packExecutionSpeed}
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#0F3A7D] rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
          />
          <div className="mt-2 text-center">
            <span className="text-[#FF6B35] font-bold text-lg">
              {packExecutionSpeed.toFixed(1)}x
            </span>
            <p className="text-xs text-[#F5F5F5] opacity-60 mt-1">
              {packExecutionSpeed < 1 ? 'Slower' : packExecutionSpeed > 1 ? 'Faster' : 'Normal'} execution
            </p>
          </div>
        </div>
        
        {/* Niche Difficulty */}
        <div className="bg-[#1a4d99] rounded-lg p-4 border border-[#FF6B35]/20">
          <label className="block text-sm font-bold text-white mb-3">
            Niche Difficulty
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={nicheDifficulty}
            onChange={(e) => handleDifficultyChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#0F3A7D] rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
          />
          <div className="mt-2 text-center">
            <span className="text-[#FF6B35] font-bold text-lg">
              {nicheDifficulty.toFixed(1)}x
            </span>
            <p className="text-xs text-[#F5F5F5] opacity-60 mt-1">
              {nicheDifficulty < 1 ? 'Easy' : nicheDifficulty > 1 ? 'Hard' : 'Medium'} niche
            </p>
          </div>
        </div>
        
        {/* Ad Spend */}
        <div className="bg-[#1a4d99] rounded-lg p-4 border border-[#FF6B35]/20">
          <label className="block text-sm font-bold text-white mb-3">
            Ad Spend
          </label>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={adSpend}
            onChange={(e) => handleAdSpendChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#0F3A7D] rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
          />
          <div className="mt-2 text-center">
            <span className="text-[#FF6B35] font-bold text-lg">
              ${adSpend.toLocaleString()}
            </span>
            <p className="text-xs text-[#F5F5F5] opacity-60 mt-1">
              Total budget
            </p>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-8 flex justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-gray-500" style={{ borderTop: '2px dashed #999999' }}></div>
          <span className="text-[#F5F5F5] opacity-60">T-Dog Benchmark (4-week blitzkrieg)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-[#FF6B35]"></div>
          <span className="text-[#F5F5F5] opacity-60">Your Projection</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-[#00FF00]"></div>
          <span className="text-[#F5F5F5] opacity-60">Actual Revenue (Real-time)</span>
        </div>
      </div>
    </div>
  );
};

export default RevenuePredictor;
