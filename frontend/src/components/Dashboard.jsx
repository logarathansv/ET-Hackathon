import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  Brain,
  Compass,
  FlaskConical,
  Radar,
  ShieldCheck,
  Target,
} from 'lucide-react';
import {
  analyze,
  getDebate,
  getMarketMood,
  getRadar,
  getTrace,
  getStockSignal,
  simulate,
} from '../services/api';
import { ErrorMessage, LoadingSpinner } from './LoadingSpinner';
import { getActionBgColor, getConfidenceColor, getEffectColor, getVerdictColor } from '../utils/colors';

const Dashboard = () => {
  const [marketMood, setMarketMood] = useState(null);
  const [radarSignals, setRadarSignals] = useState([]);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [selectedStock, setSelectedStock] = useState('');

  const [signalDetails, setSignalDetails] = useState(null);
  const [debateData, setDebateData] = useState(null);
  const [traceData, setTraceData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [simulationData, setSimulationData] = useState(null);

  const [question, setQuestion] = useState('Should I consider entry now or wait for confirmation?');
  const [scenario, setScenario] = useState('bear_market');
  const [extraPortfolio, setExtraPortfolio] = useState('RELIANCE,HDFCBANK');

  const [loadingTop, setLoadingTop] = useState(false);
  const [loadingHub, setLoadingHub] = useState(false);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [loadingSimulate, setLoadingSimulate] = useState(false);

  const [topError, setTopError] = useState(null);
  const [hubError, setHubError] = useState(null);
  const [analyzeError, setAnalyzeError] = useState(null);
  const [simulateError, setSimulateError] = useState(null);

  const hubRef = useRef(null);

  const decisionSummary = useMemo(() => {
    const confidence = analysisData?.confidence || selectedSignal?.confidence || 'Medium';
    const riskLevel = marketMood?.risk_level || 'Medium';

    let action = selectedSignal?.action || 'Watch';
    if (!selectedSignal?.action && analysisData?.verdict) {
      if (analysisData.verdict === 'Opportunity') action = 'Consider Entry';
      if (analysisData.verdict === 'Risk') action = 'Avoid';
      if (analysisData.verdict === 'Neutral') action = 'Watch';
    }

    return { action, confidence, riskLevel };
  }, [analysisData, marketMood?.risk_level, selectedSignal]);

  const loadTopSections = async () => {
    try {
      setLoadingTop(true);
      setTopError(null);
      const [market, radar] = await Promise.all([getMarketMood(), getRadar(3)]);
      setMarketMood(market);
      setRadarSignals(radar.top_signals || []);
    } catch (err) {
      setTopError(err);
    } finally {
      setLoadingTop(false);
    }
  };

  const loadSignalHub = async (stock) => {
    try {
      setLoadingHub(true);
      setHubError(null);
      const [signalResp, debateResp, traceResp] = await Promise.all([
        getStockSignal(stock),
        getDebate(stock),
        getTrace(stock),
      ]);
      setSignalDetails(signalResp);
      setDebateData(debateResp);
      setTraceData(traceResp);
    } catch (err) {
      setHubError(err);
    } finally {
      setLoadingHub(false);
    }
  };

  useEffect(() => {
    loadTopSections();
  }, []);

  const handleSelectSignal = async (signal) => {
    const stock = signal?.stock;
    if (!stock) return;

    setSelectedSignal(signal);
    setSelectedStock(stock);
    setAnalysisData(null);
    setSimulationData(null);

    await loadSignalHub(stock);
    hubRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();
    if (!selectedStock) return;

    try {
      setLoadingAnalyze(true);
      setAnalyzeError(null);
      const response = await analyze(question, selectedStock);
      setAnalysisData(response);
    } catch (err) {
      setAnalyzeError(err);
    } finally {
      setLoadingAnalyze(false);
    }
  };

  const handleSimulate = async () => {
    if (!selectedStock) return;

    const parsedExtra = extraPortfolio
      .split(',')
      .map((item) => item.trim().toUpperCase())
      .filter(Boolean);
    const portfolio = Array.from(new Set([selectedStock, ...parsedExtra]));

    try {
      setLoadingSimulate(true);
      setSimulateError(null);
      const response = await simulate(scenario, portfolio);
      setSimulationData(response);
    } catch (err) {
      setSimulateError(err);
    } finally {
      setLoadingSimulate(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-white">AI Investor Copilot</h1>
              <p className="text-gray-400 text-sm mt-1">Decision Intelligence Platform</p>
            </div>
            <div className="px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-sm font-semibold">
              Focus Stock: {selectedStock || 'Select from Radar'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-10">
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Step 0: Market Context</h2>
            </div>

            {loadingTop && <LoadingSpinner message="Loading market context..." />}
            {topError && <ErrorMessage error={topError} onRetry={loadTopSections} />}

            {!loadingTop && !topError && marketMood && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-4">
                  <p className="text-xs uppercase text-gray-400 mb-1">Trend</p>
                  <p className="text-xl font-bold text-white">{marketMood.trend}</p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-4">
                  <p className="text-xs uppercase text-gray-400 mb-1">Risk Level</p>
                  <p className="text-xl font-bold text-white">{marketMood.risk_level}</p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-4">
                  <p className="text-xs uppercase text-gray-400 mb-1">Volatility</p>
                  <p className="text-xl font-bold text-white">{marketMood.volatility}</p>
                </div>
              </div>
            )}
          </section>

          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Radar className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Step 1: Opportunity Radar</h2>
            </div>
            <p className="text-sm text-gray-400 mb-5">Discover top opportunities. Click one signal to enter focus mode.</p>

            {loadingTop && <LoadingSpinner message="Loading radar opportunities..." />}

            {!loadingTop && !topError && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {radarSignals.map((signal, idx) => {
                  const selected = selectedStock === signal.stock;
                  return (
                    <button
                      key={`${signal.stock}-${idx}`}
                      onClick={() => handleSelectSignal(signal)}
                      className={`text-left rounded-xl border p-5 transition-all ${
                        selected
                          ? 'border-amber-500 bg-amber-500/10 shadow-neon-amber'
                          : 'border-slate-700 bg-slate-900/40 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-lg font-bold text-white">{signal.stock}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getActionBgColor(signal.action)}`}>
                          {signal.action}
                        </span>
                      </div>
                      <p className="text-sm text-blue-300 font-semibold mb-2">{signal.signal_type}</p>
                      <p className="text-sm text-gray-300 mb-2">
                        Urgency: <span className="text-white font-semibold">{signal.urgency?.toFixed?.(1) ?? signal.urgency}</span>
                      </p>
                      <p className="text-sm text-gray-400 line-clamp-3">{signal.insight || signal.explanation}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <div className="flex items-center justify-center text-gray-500">
            <ArrowDown className="w-5 h-5" />
          </div>

          <section ref={hubRef} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Step 2-3: Signal Intelligence Hub</h2>
            </div>
            <p className="text-sm text-gray-400">All intelligence is connected to selected stock: <span className="text-amber-300 font-semibold">{selectedStock || 'None selected'}</span></p>

            {!selectedStock && (
              <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-6 text-center text-gray-400">
                Select a signal from Opportunity Radar to unlock the full decision journey.
              </div>
            )}

            {selectedStock && loadingHub && <LoadingSpinner message={`Building intelligence hub for ${selectedStock}...`} />}
            {selectedStock && hubError && <ErrorMessage error={hubError} onRetry={() => loadSignalHub(selectedStock)} />}

            {selectedStock && !loadingHub && !hubError && signalDetails && (
              <>
                <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-5">
                  <h3 className="text-lg font-semibold text-white mb-3">Why This Signal Matters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Explanation</p>
                      <p className="text-gray-200">{signalDetails.explanation}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Insight</p>
                      <p className="text-gray-200">{signalDetails.insight}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Market Context</p>
                      <p className="text-gray-200">{signalDetails.market_context}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Priority Reason</p>
                      <p className="text-gray-200">{signalDetails.priority_reason}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-5">
                  <h3 className="text-lg font-semibold text-white mb-3">Bull vs Bear Analysis</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                      <p className="text-green-300 font-semibold mb-2">Bull Case</p>
                      <ul className="space-y-2 text-green-100 text-sm">
                        {(debateData?.bull_case || []).map((item, idx) => (
                          <li key={`bull-${idx}`}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                      <p className="text-red-300 font-semibold mb-2">Bear Case</p>
                      <ul className="space-y-2 text-red-100 text-sm">
                        {(debateData?.bear_case || []).map((item, idx) => (
                          <li key={`bear-${idx}`}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={`mt-4 rounded-lg border p-4 ${getVerdictColor(debateData?.verdict)}`}>
                    <p className="text-xs uppercase opacity-80 mb-1">Verdict</p>
                    <p className="text-lg font-bold">{debateData?.verdict || 'Neutral'}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-5">
                  <h3 className="text-lg font-semibold text-white mb-3">How This Was Detected</h3>
                  <div className="space-y-3">
                    {(traceData?.logic_flow || []).map((step, idx) => (
                      <div key={`trace-step-${idx}`} className="flex items-start gap-3">
                        <div className="mt-1 w-6 h-6 rounded-full border border-amber-500/70 text-amber-300 text-xs font-semibold flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <p className="text-gray-200 text-sm leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedStock && (
              <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Ask AI (Deep Analysis)</h3>
                </div>

                <form onSubmit={handleAnalyze} className="space-y-3">
                  <label className="block text-sm text-gray-300">Question for {selectedStock}</label>
                  <textarea
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                    placeholder="Ask for entry timing, risks, or confirmation signals..."
                  />
                  <button
                    type="submit"
                    disabled={loadingAnalyze}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 disabled:opacity-60"
                  >
                    {loadingAnalyze ? 'Analyzing...' : 'Run AI Analysis'}
                  </button>
                </form>

                {loadingAnalyze && <LoadingSpinner message={`Running AI analysis for ${selectedStock}...`} />}
                {analyzeError && <div className="mt-4"><ErrorMessage error={analyzeError} /></div>}

                {analysisData && (
                  <div className="mt-5 space-y-4">
                    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                      <p className="text-gray-300 text-sm leading-relaxed">{analysisData.summary}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                        <p className="text-green-300 font-semibold mb-2">AI Bull Case</p>
                        <ul className="space-y-2 text-green-100 text-sm">
                          {(analysisData.bull_case || []).map((item, idx) => (
                            <li key={`ai-bull-${idx}`}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                        <p className="text-red-300 font-semibold mb-2">AI Bear Case</p>
                        <ul className="space-y-2 text-red-100 text-sm">
                          {(analysisData.bear_case || []).map((item, idx) => (
                            <li key={`ai-bear-${idx}`}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`rounded-lg border p-4 ${getConfidenceColor(analysisData.confidence)}`}>
                        <p className="text-xs uppercase opacity-80 mb-1">Confidence</p>
                        <p className="text-lg font-bold">{analysisData.confidence}</p>
                      </div>
                      <div className={`rounded-lg border p-4 ${getVerdictColor(analysisData.verdict)}`}>
                        <p className="text-xs uppercase opacity-80 mb-1">Verdict</p>
                        <p className="text-lg font-bold">{analysisData.verdict}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <div className="flex items-center justify-center text-gray-500">
            <ArrowDown className="w-5 h-5" />
          </div>

          <section className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-amber-300" />
              <h2 className="text-xl font-semibold text-white">Step 4: Final Decision Box</h2>
            </div>
            <p className="text-sm text-gray-300 mb-4">Combined decision from signal + AI + market context.</p>

            {!selectedStock ? (
              <p className="text-gray-400">Select a stock in radar to generate decision guidance.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`rounded-lg border p-4 ${getActionBgColor(decisionSummary.action)}`}>
                  <p className="text-xs uppercase opacity-80 mb-1">Final Action</p>
                  <p className="text-xl font-bold">{decisionSummary.action}</p>
                </div>
                <div className={`rounded-lg border p-4 ${getConfidenceColor(decisionSummary.confidence)}`}>
                  <p className="text-xs uppercase opacity-80 mb-1">Confidence</p>
                  <p className="text-xl font-bold">{decisionSummary.confidence}</p>
                </div>
                <div className="rounded-lg border border-slate-600 bg-slate-900/40 p-4 text-white">
                  <p className="text-xs uppercase text-gray-400 mb-1">Risk Level</p>
                  <p className="text-xl font-bold">{decisionSummary.riskLevel}</p>
                </div>
              </div>
            )}
          </section>

          <div className="flex items-center justify-center text-gray-500">
            <ArrowDown className="w-5 h-5" />
          </div>

          <section className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
            <div className="flex items-center gap-3 mb-3">
              <FlaskConical className="w-5 h-5 text-violet-400" />
              <h2 className="text-xl font-semibold text-white">Step 5: Simulation (What-if)</h2>
            </div>
            <p className="text-sm text-gray-400 mb-5">Test your decision under different market scenarios.</p>

            {!selectedStock ? (
              <p className="text-gray-400">Select a stock first to auto-include it in simulation.</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Scenario</label>
                    <select
                      value={scenario}
                      onChange={(event) => setScenario(event.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="bull_market">Bull Market</option>
                      <option value="bear_market">Bear Market</option>
                      <option value="recession">Recession</option>
                      <option value="high_inflation">High Inflation</option>
                      <option value="rate_hike">Rate Hike</option>
                      <option value="tech_crash">Tech Crash</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Portfolio Symbols (comma separated)</label>
                    <input
                      value={extraPortfolio}
                      onChange={(event) => setExtraPortfolio(event.target.value)}
                      placeholder="RELIANCE,HDFCBANK"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">{selectedStock} is auto-included.</p>
                  </div>
                </div>

                <button
                  onClick={handleSimulate}
                  disabled={loadingSimulate}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold hover:from-violet-600 hover:to-blue-600 disabled:opacity-60"
                >
                  {loadingSimulate ? 'Running Simulation...' : 'Test Decision'}
                </button>

                {loadingSimulate && <LoadingSpinner message="Running scenario simulation..." />}
                {simulateError && <ErrorMessage error={simulateError} />}

                {simulationData?.impact && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {simulationData.impact.map((item, idx) => (
                      <div key={`${item.stock}-${idx}`} className={`rounded-lg border p-4 ${getEffectColor(item.effect)}`}>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="font-bold text-white">{item.stock}</p>
                          <span className="text-xs font-semibold uppercase">{item.effect}</span>
                        </div>
                        <p className="text-sm mb-2">{item.reason}</p>
                        <p className="text-xs opacity-80">Confidence: {item.confidence}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-700 bg-slate-900/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Guided decision journey: Discover → Understand → Analyze → Decide → Simulate
          </p>
          <p className="mt-1">AI Investor Copilot © 2026</p>
          {marketMood?.risk_level === 'High' && (
            <p className="mt-2 text-red-400 inline-flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Elevated market risk detected. Use tighter risk controls.
            </p>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
