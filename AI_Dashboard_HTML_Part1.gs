// =====================================================
// AI DASHBOARD HTML - PART 1 (Main Structure & Styles)
// =====================================================
// Add this to the same Apps Script file after the main code

function getDashboardHTML() {
  return `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f1922 100%);
      color: #fff;
      padding: 16px;
      min-height: 100vh;
    }

    /* AI Glow Effects */
    .ai-glow {
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.3), 0 0 40px rgba(123, 44, 191, 0.2);
    }

    .ai-pulse {
      animation: aiPulse 2s ease-in-out infinite;
    }

    @keyframes aiPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .header h1 {
      font-size: 22px;
      font-weight: 700;
      background: linear-gradient(90deg, #00d4ff, #7b2cbf, #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .ai-badge {
      background: linear-gradient(90deg, #7b2cbf, #00d4ff);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 10px;
      color: #fff;
      -webkit-text-fill-color: #fff;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .header-actions { display: flex; gap: 8px; align-items: center; }

    /* Buttons */
    .btn {
      padding: 6px 14px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 12px;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .btn-primary { background: linear-gradient(90deg, #00d4ff, #0099cc); color: #fff; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,212,255,0.3); }

    .btn-ai {
      background: linear-gradient(90deg, #7b2cbf, #9c27b0);
      color: #fff;
    }
    .btn-ai:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(123, 44, 191, 0.4);
    }

    .btn-success { background: linear-gradient(90deg, #00ff88, #00cc6a); color: #000; }
    .btn-warning { background: linear-gradient(90deg, #ffc107, #ff9800); color: #000; }
    .btn-danger { background: linear-gradient(90deg, #ff4757, #ff6b6b); color: #fff; }

    .btn-secondary {
      background: rgba(255,255,255,0.1);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .btn-secondary:hover { background: rgba(255,255,255,0.15); }

    .btn-sm { padding: 4px 10px; font-size: 11px; }

    .timestamp { font-size: 11px; color: #888; }

    /* AI Insights Panel */
    .ai-insights-panel {
      background: linear-gradient(135deg, rgba(123, 44, 191, 0.15) 0%, rgba(0, 212, 255, 0.1) 100%);
      border: 1px solid rgba(123, 44, 191, 0.3);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      position: relative;
      overflow: hidden;
    }

    .ai-insights-panel::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #7b2cbf, #00d4ff, #7b2cbf);
      animation: gradientMove 3s linear infinite;
    }

    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }

    .ai-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .ai-title {
      font-size: 14px;
      font-weight: 600;
      color: #00d4ff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ai-insights-content {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .ai-insight-card {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      padding: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .ai-insight-card h4 {
      font-size: 11px;
      color: #888;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .ai-insight-card ul {
      list-style: none;
      font-size: 11px;
      line-height: 1.6;
    }

    .ai-insight-card li {
      margin-bottom: 4px;
      padding-left: 12px;
      position: relative;
    }

    .ai-insight-card li::before {
      content: '>';
      position: absolute;
      left: 0;
      color: #00d4ff;
    }

    /* AI Chat Interface */
    .ai-chat-container {
      background: rgba(0, 0, 0, 0.4);
      border-radius: 10px;
      padding: 12px;
      margin-top: 12px;
    }

    .ai-chat-input {
      display: flex;
      gap: 8px;
    }

    .ai-chat-input input {
      flex: 1;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(123, 44, 191, 0.3);
      border-radius: 8px;
      color: #fff;
      font-size: 13px;
    }

    .ai-chat-input input:focus {
      outline: none;
      border-color: #00d4ff;
      box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
    }

    .ai-chat-input input::placeholder {
      color: #666;
    }

    .ai-response {
      margin-top: 12px;
      padding: 12px;
      background: rgba(123, 44, 191, 0.1);
      border-radius: 8px;
      border-left: 3px solid #7b2cbf;
      font-size: 12px;
      line-height: 1.6;
      display: none;
    }

    .ai-response.visible {
      display: block;
    }

    /* Summary Cards */
    .summary-row {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }

    .summary-card {
      background: rgba(255,255,255,0.05);
      border-radius: 10px;
      padding: 12px;
      border: 1px solid rgba(255,255,255,0.1);
      position: relative;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .summary-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }

    .summary-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--accent-color, #00d4ff);
    }

    .summary-card .label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .summary-card .value { font-size: 24px; font-weight: 700; margin: 4px 0; }
    .summary-card .delta { font-size: 11px; }
    .delta.positive { color: #00ff88; }
    .delta.negative { color: #ff4757; }
    .delta.neutral { color: #888; }

    .ai-indicator {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #7b2cbf;
      animation: aiPulse 2s ease-in-out infinite;
    }

    /* Interested Breakdown */
    .interested-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 16px;
    }

    .mini-card {
      background: rgba(255,255,255,0.03);
      border-radius: 8px;
      padding: 10px;
      text-align: center;
      border: 1px solid rgba(255,255,255,0.08);
    }

    .mini-card .mini-label { font-size: 10px; color: #888; }
    .mini-card .mini-value { font-size: 20px; font-weight: 700; }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .tab {
      padding: 6px 14px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #888;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .tab.active { background: rgba(0,212,255,0.2); color: #00d4ff; border-color: rgba(0,212,255,0.3); }
    .tab:hover:not(.active) { color: #fff; background: rgba(255,255,255,0.08); }

    .tab.ai-tab {
      background: rgba(123, 44, 191, 0.2);
      border-color: rgba(123, 44, 191, 0.3);
      color: #b388ff;
    }

    .tab.ai-tab.active {
      background: rgba(123, 44, 191, 0.4);
      color: #e1bee7;
    }

    .tab-content { display: none; }
    .tab-content.active { display: block; }

    /* Tables */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    .data-table th {
      text-align: left;
      padding: 8px 10px;
      background: rgba(0,212,255,0.1);
      font-weight: 600;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #00d4ff;
      position: sticky;
      top: 0;
    }

    .data-table td {
      padding: 8px 10px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .data-table tr:hover td { background: rgba(255,255,255,0.03); }
    .data-table tr.total-row { background: rgba(0,212,255,0.1); font-weight: 600; }

    .ratio { font-weight: 600; }
    .ratio.high { color: #00ff88; }
    .ratio.medium { color: #ffc107; }
    .ratio.low { color: #ff4757; }

    /* Charts Grid */
    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
    }

    .charts-grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 12px;
    }

    .chart-box {
      background: rgba(255,255,255,0.03);
      border-radius: 10px;
      padding: 12px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .chart-box h3 {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #00d4ff;
    }

    .chart-box.ai-chart {
      border-color: rgba(123, 44, 191, 0.3);
    }

    .chart-box.ai-chart h3 {
      color: #b388ff;
    }

    /* AI Predictions Card */
    .ai-predictions-card {
      background: linear-gradient(135deg, rgba(123, 44, 191, 0.2), rgba(0, 212, 255, 0.1));
      border: 1px solid rgba(123, 44, 191, 0.4);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .prediction-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 12px;
    }

    .prediction-item {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }

    .prediction-item .pred-label {
      font-size: 10px;
      color: #888;
      margin-bottom: 4px;
    }

    .prediction-item .pred-value {
      font-size: 22px;
      font-weight: 700;
      color: #b388ff;
    }

    .prediction-item .pred-change {
      font-size: 10px;
      margin-top: 4px;
    }

    /* Pipeline & Funnel */
    .pipeline-container {
      display: flex;
      gap: 12px;
      margin-top: 12px;
    }

    .pipeline-stage {
      flex: 1;
      background: rgba(255,255,255,0.03);
      border-radius: 10px;
      padding: 12px;
      border: 1px solid rgba(255,255,255,0.1);
      text-align: center;
    }

    .pipeline-stage h4 { font-size: 11px; color: #888; margin-bottom: 8px; }
    .pipeline-stage .count { font-size: 28px; font-weight: 700; }

    .pipeline-stage.top { --stage-color: #00d4ff; }
    .pipeline-stage.mid { --stage-color: #ffc107; }
    .pipeline-stage.bottom { --stage-color: #00ff88; }
    .pipeline-stage.closed { --stage-color: #ff6b6b; }

    .pipeline-stage .count { color: var(--stage-color); }

    /* Filter Row */
    .filter-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding: 10px 14px;
      background: rgba(0,212,255,0.08);
      border-radius: 8px;
      border: 1px solid rgba(0,212,255,0.2);
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .filter-group label { font-size: 12px; color: #888; }

    .ae-select {
      padding: 6px 12px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 6px;
      color: #fff;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      min-width: 180px;
    }

    .ae-select:focus { outline: none; border-color: #00d4ff; }

    .filter-info { font-size: 11px; color: #00d4ff; }

    /* Action Items */
    .action-list { max-height: 300px; overflow-y: auto; }

    .action-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      background: rgba(255,255,255,0.03);
      border-radius: 6px;
      margin-bottom: 6px;
      border-left: 3px solid;
    }

    .action-item.high { border-left-color: #ff4757; }
    .action-item.medium { border-left-color: #ffc107; }
    .action-item.low { border-left-color: #00d4ff; }

    .action-info { flex: 1; }
    .action-type { font-size: 10px; color: #888; text-transform: uppercase; }
    .action-company { font-weight: 600; font-size: 13px; }
    .action-ae { font-size: 11px; color: #888; }

    /* Action Bar */
    .action-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      padding: 10px;
      background: rgba(255,255,255,0.03);
      border-radius: 8px;
    }

    /* Snapshot List */
    .snapshot-list { max-height: 250px; overflow-y: auto; }

    .snapshot-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: rgba(255,255,255,0.03);
      border-radius: 6px;
      margin-bottom: 6px;
    }

    .snapshot-item:hover { background: rgba(255,255,255,0.06); }
    .snapshot-label { font-weight: 600; font-size: 12px; }
    .snapshot-date { font-size: 10px; color: #888; }

    /* Compare */
    .compare-select {
      padding: 6px 10px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 6px;
      color: #fff;
      font-size: 12px;
      min-width: 200px;
    }

    .compare-row { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }

    /* Loading */
    .loading { text-align: center; padding: 30px; color: #888; }

    .spinner {
      border: 3px solid rgba(255,255,255,0.1);
      border-top: 3px solid #00d4ff;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      animation: spin 1s linear infinite;
      margin: 0 auto 10px;
    }

    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    .scroll-container { max-height: 400px; overflow-y: auto; }

    /* AI Analytics Specific */
    .ai-analytics-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }

    .trend-chart-container {
      background: rgba(255,255,255,0.03);
      border-radius: 12px;
      padding: 16px;
      border: 1px solid rgba(123, 44, 191, 0.2);
    }

    .anomaly-list {
      background: rgba(255,255,255,0.03);
      border-radius: 12px;
      padding: 16px;
      border: 1px solid rgba(255, 71, 87, 0.2);
    }

    .anomaly-item {
      padding: 10px;
      background: rgba(255, 71, 87, 0.1);
      border-radius: 6px;
      margin-bottom: 8px;
      border-left: 3px solid #ff4757;
    }

    .anomaly-item.medium {
      background: rgba(255, 193, 7, 0.1);
      border-left-color: #ffc107;
    }

    .anomaly-item.low {
      background: rgba(0, 212, 255, 0.1);
      border-left-color: #00d4ff;
    }

    /* Funnel Visualization */
    .true-funnel {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      background: rgba(255,255,255,0.02);
      border-radius: 10px;
    }

    .funnel-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin-bottom: 2px;
    }

    .funnel-trapezoid {
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 600;
      font-size: 12px;
      position: relative;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .funnel-trapezoid:hover {
      filter: brightness(1.2);
      transform: scale(1.02);
    }

    .funnel-trapezoid .trap-label { font-size: 11px; opacity: 0.9; }
    .funnel-trapezoid .trap-count { font-size: 14px; font-weight: 700; margin-left: 8px; }

    .funnel-summary-card {
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
      padding: 10px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .funnel-summary-card .fsc-label { font-size: 11px; color: #888; }
    .funnel-summary-card .fsc-value { font-size: 18px; font-weight: 700; }

    /* Responsive */
    @media (max-width: 1200px) {
      .summary-row { grid-template-columns: repeat(3, 1fr); }
      .ai-insights-content { grid-template-columns: repeat(2, 1fr); }
      .charts-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <h1>
      <span>Instant Loan Leads - North POD</span>
      <span class="ai-badge">AI POWERED</span>
    </h1>
    <div class="header-actions">
      <span class="timestamp" id="lastUpdated">Loading...</span>
      <button class="btn btn-secondary btn-sm" onclick="refreshData()">Refresh</button>
      <button class="btn btn-ai btn-sm" onclick="generateInsights()">AI Insights</button>
      <button class="btn btn-primary btn-sm" onclick="saveNewSnapshot()">Save Snapshot</button>
    </div>
  </div>

  <!-- AI Insights Panel -->
  <div class="ai-insights-panel" id="aiInsightsPanel">
    <div class="ai-header">
      <div class="ai-title">
        <span>AI Analytics Engine</span>
        <span class="ai-badge" style="font-size:9px">ChatGPT 5.2</span>
      </div>
      <button class="btn btn-ai btn-sm" onclick="refreshAIInsights()">Refresh Insights</button>
    </div>
    <div class="ai-insights-content" id="aiInsightsContent">
      <div class="ai-insight-card">
        <h4>Key Highlights</h4>
        <ul id="aiHighlights"><li class="ai-pulse">Analyzing data...</li></ul>
      </div>
      <div class="ai-insight-card">
        <h4>Areas of Concern</h4>
        <ul id="aiConcerns"><li class="ai-pulse">Detecting issues...</li></ul>
      </div>
      <div class="ai-insight-card">
        <h4>AI Recommendations</h4>
        <ul id="aiRecommendations"><li class="ai-pulse">Generating recommendations...</li></ul>
      </div>
      <div class="ai-insight-card">
        <h4>Performance Prediction</h4>
        <ul id="aiPrediction"><li class="ai-pulse">Forecasting...</li></ul>
      </div>
    </div>
    <div class="ai-chat-container">
      <div class="ai-chat-input">
        <input type="text" id="aiQuestion" placeholder="Ask AI anything about your sales data..." onkeypress="if(event.key==='Enter')askAIQuestion()">
        <button class="btn btn-ai" onclick="askAIQuestion()">Ask AI</button>
      </div>
      <div class="ai-response" id="aiResponse"></div>
    </div>
  </div>

  <!-- AE Filter Row -->
  <div class="filter-row">
    <div class="filter-group">
      <label>View Data For:</label>
      <select class="ae-select" id="aeFilter" onchange="applyAEFilter()">
        <option value="all">Team (All AEs)</option>
        <option value="Shivam">Shivam Only</option>
        <option value="Utkarsh">Utkarsh Only</option>
        <option value="Jyati">Jyati Only</option>
        <option value="Shivam,Utkarsh">Shivam + Utkarsh</option>
        <option value="Shivam,Jyati">Shivam + Jyati</option>
        <option value="Utkarsh,Jyati">Utkarsh + Jyati</option>
      </select>
    </div>
    <div class="filter-info" id="filterInfo">Showing: All AEs (Team View)</div>
  </div>

  <!-- Summary Cards -->
  <div class="summary-row" id="summaryCards">
    <div class="loading"><div class="spinner"></div>Loading...</div>
  </div>

  <!-- Interested Breakdown -->
  <div class="interested-row" id="interestedCards"></div>

  <!-- Action Bar -->
  <div class="action-bar">
    <button class="btn btn-success btn-sm" onclick="exportData()">Export CSV</button>
    <button class="btn btn-ai btn-sm" onclick="exportAIReport()">Export AI Report</button>
    <button class="btn btn-warning btn-sm" onclick="generateReport()">Weekly Report</button>
    <button class="btn btn-secondary btn-sm" onclick="showFilters()">Filters</button>
    <button class="btn btn-secondary btn-sm" onclick="showSettings()">Settings</button>
  </div>

  <!-- Tabs -->
  <div class="tabs">
    <button class="tab active" onclick="switchTab('overview')">Overview</button>
    <button class="tab" onclick="switchTab('ratios')">Conversion Ratios</button>
    <button class="tab" onclick="switchTab('pipeline')">Pipeline & Stages</button>
    <button class="tab ai-tab" onclick="switchTab('ai-analytics')">AI Analytics</button>
    <button class="tab" onclick="switchTab('actions')">Pending Actions</button>
    <button class="tab" onclick="switchTab('compare')">Compare</button>
    <button class="tab" onclick="switchTab('snapshots')">Snapshots</button>
  </div>

  <!-- Tab Contents -->
  <div id="tab-overview" class="tab-content active"></div>
  <div id="tab-ratios" class="tab-content"></div>
  <div id="tab-pipeline" class="tab-content"></div>
  <div id="tab-ai-analytics" class="tab-content"></div>
  <div id="tab-actions" class="tab-content"></div>
  <div id="tab-compare" class="tab-content"></div>
  <div id="tab-snapshots" class="tab-content"></div>
