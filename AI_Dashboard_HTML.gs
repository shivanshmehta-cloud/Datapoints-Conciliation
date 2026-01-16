// =====================================================
// AI DASHBOARD HTML FUNCTION
// Add this to the end of AI_Powered_Dashboard_Complete.gs
// =====================================================

function getDashboardHTML() {
  return `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',sans-serif;background:linear-gradient(135deg,#0a0a0f 0%,#1a1a2e 50%,#0f1922 100%);color:#fff;padding:16px;min-height:100vh}
    .ai-glow{box-shadow:0 0 20px rgba(0,212,255,0.3),0 0 40px rgba(123,44,191,0.2)}
    .ai-pulse{animation:aiPulse 2s ease-in-out infinite}
    @keyframes aiPulse{0%,100%{opacity:1}50%{opacity:0.7}}
    .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.1)}
    .header h1{font-size:22px;font-weight:700;background:linear-gradient(90deg,#00d4ff,#7b2cbf,#ff6b6b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:flex;align-items:center;gap:10px}
    .ai-badge{background:linear-gradient(90deg,#7b2cbf,#00d4ff);padding:4px 10px;border-radius:12px;font-size:10px;color:#fff;-webkit-text-fill-color:#fff;font-weight:600}
    .header-actions{display:flex;gap:8px;align-items:center}
    .btn{padding:6px 14px;border:none;border-radius:6px;cursor:pointer;font-weight:600;font-size:12px;transition:all 0.2s;display:inline-flex;align-items:center;gap:4px}
    .btn-primary{background:linear-gradient(90deg,#00d4ff,#0099cc);color:#fff}
    .btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,212,255,0.3)}
    .btn-ai{background:linear-gradient(90deg,#7b2cbf,#9c27b0);color:#fff}
    .btn-ai:hover{transform:translateY(-1px);box-shadow:0 4px 15px rgba(123,44,191,0.4)}
    .btn-success{background:linear-gradient(90deg,#00ff88,#00cc6a);color:#000}
    .btn-warning{background:linear-gradient(90deg,#ffc107,#ff9800);color:#000}
    .btn-secondary{background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.2)}
    .btn-secondary:hover{background:rgba(255,255,255,0.15)}
    .btn-sm{padding:4px 10px;font-size:11px}
    .timestamp{font-size:11px;color:#888}
    .ai-insights-panel{background:linear-gradient(135deg,rgba(123,44,191,0.15) 0%,rgba(0,212,255,0.1) 100%);border:1px solid rgba(123,44,191,0.3);border-radius:12px;padding:16px;margin-bottom:16px;position:relative;overflow:hidden}
    .ai-insights-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#7b2cbf,#00d4ff,#7b2cbf);background-size:200% 100%;animation:gradientMove 3s linear infinite}
    @keyframes gradientMove{0%{background-position:0% 50%}100%{background-position:200% 50%}}
    .ai-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
    .ai-title{font-size:14px;font-weight:600;color:#00d4ff;display:flex;align-items:center;gap:8px}
    .ai-insights-content{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
    .ai-insight-card{background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;border:1px solid rgba(255,255,255,0.1)}
    .ai-insight-card h4{font-size:11px;color:#888;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px}
    .ai-insight-card ul{list-style:none;font-size:11px;line-height:1.6}
    .ai-insight-card li{margin-bottom:4px;padding-left:12px;position:relative}
    .ai-insight-card li::before{content:'>';position:absolute;left:0;color:#00d4ff}
    .ai-chat-container{background:rgba(0,0,0,0.4);border-radius:10px;padding:12px;margin-top:12px}
    .ai-chat-input{display:flex;gap:8px}
    .ai-chat-input input{flex:1;padding:10px 14px;background:rgba(255,255,255,0.1);border:1px solid rgba(123,44,191,0.3);border-radius:8px;color:#fff;font-size:13px}
    .ai-chat-input input:focus{outline:none;border-color:#00d4ff;box-shadow:0 0 10px rgba(0,212,255,0.2)}
    .ai-chat-input input::placeholder{color:#666}
    .ai-response{margin-top:12px;padding:12px;background:rgba(123,44,191,0.1);border-radius:8px;border-left:3px solid #7b2cbf;font-size:12px;line-height:1.6;display:none}
    .ai-response.visible{display:block}
    .summary-row{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:16px}
    .summary-card{background:rgba(255,255,255,0.05);border-radius:10px;padding:12px;border:1px solid rgba(255,255,255,0.1);position:relative;overflow:hidden;transition:transform 0.2s,box-shadow 0.2s}
    .summary-card:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.3)}
    .summary-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--accent-color,#00d4ff)}
    .summary-card .label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
    .summary-card .value{font-size:24px;font-weight:700;margin:4px 0}
    .summary-card .delta{font-size:11px}
    .delta.positive{color:#00ff88}
    .delta.negative{color:#ff4757}
    .delta.neutral{color:#888}
    .ai-indicator{position:absolute;top:8px;right:8px;width:8px;height:8px;border-radius:50%;background:#7b2cbf;animation:aiPulse 2s ease-in-out infinite}
    .interested-row{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px}
    .mini-card{background:rgba(255,255,255,0.03);border-radius:8px;padding:10px;text-align:center;border:1px solid rgba(255,255,255,0.08)}
    .mini-card .mini-label{font-size:10px;color:#888}
    .mini-card .mini-value{font-size:20px;font-weight:700}
    .tabs{display:flex;gap:4px;margin-bottom:12px;flex-wrap:wrap}
    .tab{padding:6px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#888;cursor:pointer;font-size:12px;font-weight:500;border-radius:6px;transition:all 0.2s}
    .tab.active{background:rgba(0,212,255,0.2);color:#00d4ff;border-color:rgba(0,212,255,0.3)}
    .tab:hover:not(.active){color:#fff;background:rgba(255,255,255,0.08)}
    .tab.ai-tab{background:rgba(123,44,191,0.2);border-color:rgba(123,44,191,0.3);color:#b388ff}
    .tab.ai-tab.active{background:rgba(123,44,191,0.4);color:#e1bee7}
    .tab-content{display:none}
    .tab-content.active{display:block}
    .data-table{width:100%;border-collapse:collapse;font-size:12px}
    .data-table th{text-align:left;padding:8px 10px;background:rgba(0,212,255,0.1);font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#00d4ff;position:sticky;top:0}
    .data-table td{padding:8px 10px;border-bottom:1px solid rgba(255,255,255,0.05)}
    .data-table tr:hover td{background:rgba(255,255,255,0.03)}
    .data-table tr.total-row{background:rgba(0,212,255,0.1);font-weight:600}
    .ratio{font-weight:600}
    .ratio.high{color:#00ff88}
    .ratio.medium{color:#ffc107}
    .ratio.low{color:#ff4757}
    .charts-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
    .charts-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:12px}
    .chart-box{background:rgba(255,255,255,0.03);border-radius:10px;padding:12px;border:1px solid rgba(255,255,255,0.1)}
    .chart-box h3{font-size:12px;font-weight:600;margin-bottom:8px;color:#00d4ff}
    .chart-box.ai-chart{border-color:rgba(123,44,191,0.3)}
    .chart-box.ai-chart h3{color:#b388ff}
    .ai-predictions-card{background:linear-gradient(135deg,rgba(123,44,191,0.2),rgba(0,212,255,0.1));border:1px solid rgba(123,44,191,0.4);border-radius:12px;padding:16px;margin-bottom:16px}
    .prediction-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:12px}
    .prediction-item{background:rgba(0,0,0,0.3);border-radius:8px;padding:12px;text-align:center}
    .prediction-item .pred-label{font-size:10px;color:#888;margin-bottom:4px}
    .prediction-item .pred-value{font-size:22px;font-weight:700;color:#b388ff}
    .prediction-item .pred-change{font-size:10px;margin-top:4px}
    .pipeline-container{display:flex;gap:12px;margin-top:12px}
    .pipeline-stage{flex:1;background:rgba(255,255,255,0.03);border-radius:10px;padding:12px;border:1px solid rgba(255,255,255,0.1);text-align:center}
    .pipeline-stage h4{font-size:11px;color:#888;margin-bottom:8px}
    .pipeline-stage .count{font-size:28px;font-weight:700}
    .pipeline-stage.top .count{color:#00d4ff}
    .pipeline-stage.mid .count{color:#ffc107}
    .pipeline-stage.bottom .count{color:#00ff88}
    .pipeline-stage.closed .count{color:#ff6b6b}
    .filter-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding:10px 14px;background:rgba(0,212,255,0.08);border-radius:8px;border:1px solid rgba(0,212,255,0.2)}
    .filter-group{display:flex;align-items:center;gap:10px}
    .filter-group label{font-size:12px;color:#888}
    .ae-select{padding:6px 12px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:6px;color:#fff;font-size:13px;font-weight:500;cursor:pointer;min-width:180px}
    .ae-select:focus{outline:none;border-color:#00d4ff}
    .filter-info{font-size:11px;color:#00d4ff}
    .action-bar{display:flex;gap:8px;margin-bottom:12px;padding:10px;background:rgba(255,255,255,0.03);border-radius:8px}
    .action-list{max-height:300px;overflow-y:auto}
    .action-item{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:rgba(255,255,255,0.03);border-radius:6px;margin-bottom:6px;border-left:3px solid}
    .action-item.high{border-left-color:#ff4757}
    .action-item.medium{border-left-color:#ffc107}
    .action-info{flex:1}
    .action-company{font-weight:600;font-size:13px}
    .action-ae{font-size:11px;color:#888}
    .snapshot-list{max-height:250px;overflow-y:auto}
    .snapshot-item{display:flex;justify-content:space-between;align-items:center;padding:10px;background:rgba(255,255,255,0.03);border-radius:6px;margin-bottom:6px}
    .snapshot-item:hover{background:rgba(255,255,255,0.06)}
    .snapshot-label{font-weight:600;font-size:12px}
    .snapshot-date{font-size:10px;color:#888}
    .compare-select{padding:6px 10px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:6px;color:#fff;font-size:12px;min-width:200px}
    .compare-row{display:flex;gap:12px;align-items:center;margin-bottom:12px}
    .loading{text-align:center;padding:30px;color:#888}
    .spinner{border:3px solid rgba(255,255,255,0.1);border-top:3px solid #00d4ff;border-radius:50%;width:24px;height:24px;animation:spin 1s linear infinite;margin:0 auto 10px}
    @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
    .scroll-container{max-height:400px;overflow-y:auto}
    .funnel-summary-card{background:rgba(255,255,255,0.05);border-radius:8px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
    .funnel-summary-card .fsc-label{font-size:11px;color:#888}
    .funnel-summary-card .fsc-value{font-size:18px;font-weight:700}
    .true-funnel{display:flex;flex-direction:column;align-items:center;padding:16px;background:rgba(255,255,255,0.02);border-radius:10px}
    .funnel-section{display:flex;flex-direction:column;align-items:center;width:100%;margin-bottom:2px}
    .funnel-trapezoid{height:36px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:12px;position:relative;transition:all 0.3s ease;cursor:pointer}
    .funnel-trapezoid:hover{filter:brightness(1.2);transform:scale(1.02)}
    .funnel-trapezoid .trap-label{font-size:11px;opacity:0.9}
    .funnel-trapezoid .trap-count{font-size:14px;font-weight:700;margin-left:8px}
    @media(max-width:1200px){.summary-row{grid-template-columns:repeat(3,1fr)}.ai-insights-content{grid-template-columns:repeat(2,1fr)}.charts-grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <div class="header">
    <h1><span>Instant Loan Leads - North POD</span><span class="ai-badge">AI POWERED - GPT 5.2</span></h1>
    <div class="header-actions">
      <span class="timestamp" id="lastUpdated">Loading...</span>
      <button class="btn btn-secondary btn-sm" onclick="refreshData()">Refresh</button>
      <button class="btn btn-ai btn-sm" onclick="generateInsights()">AI Insights</button>
      <button class="btn btn-primary btn-sm" onclick="saveNewSnapshot()">Save Snapshot</button>
    </div>
  </div>
  <div class="ai-insights-panel" id="aiInsightsPanel">
    <div class="ai-header">
      <div class="ai-title"><span>AI Analytics Engine</span><span class="ai-badge" style="font-size:9px">ChatGPT 5.2</span></div>
      <button class="btn btn-ai btn-sm" onclick="refreshAIInsights()">Refresh Insights</button>
    </div>
    <div class="ai-insights-content" id="aiInsightsContent">
      <div class="ai-insight-card"><h4>Key Highlights</h4><ul id="aiHighlights"><li class="ai-pulse">Analyzing data...</li></ul></div>
      <div class="ai-insight-card"><h4>Areas of Concern</h4><ul id="aiConcerns"><li class="ai-pulse">Detecting issues...</li></ul></div>
      <div class="ai-insight-card"><h4>AI Recommendations</h4><ul id="aiRecommendations"><li class="ai-pulse">Generating...</li></ul></div>
      <div class="ai-insight-card"><h4>Performance Prediction</h4><ul id="aiPrediction"><li class="ai-pulse">Forecasting...</li></ul></div>
    </div>
    <div class="ai-chat-container">
      <div class="ai-chat-input">
        <input type="text" id="aiQuestion" placeholder="Ask AI anything about your sales data..." onkeypress="if(event.key==='Enter')askAIQuestion()">
        <button class="btn btn-ai" onclick="askAIQuestion()">Ask AI</button>
      </div>
      <div class="ai-response" id="aiResponse"></div>
    </div>
  </div>
  <div class="filter-row">
    <div class="filter-group">
      <label>View Data For:</label>
      <select class="ae-select" id="aeFilter" onchange="applyAEFilter()">
        <option value="all">Team (All AEs)</option>
        <option value="Shivam">Shivam Only</option>
        <option value="Utkarsh">Utkarsh Only</option>
        <option value="Jyati">Jyati Only</option>
      </select>
    </div>
    <div class="filter-info" id="filterInfo">Showing: All AEs (Team View)</div>
  </div>
  <div class="summary-row" id="summaryCards"><div class="loading"><div class="spinner"></div>Loading...</div></div>
  <div class="interested-row" id="interestedCards"></div>
  <div class="action-bar">
    <button class="btn btn-success btn-sm" onclick="exportData()">Export CSV</button>
    <button class="btn btn-ai btn-sm" onclick="exportAIReport()">Export AI Report</button>
    <button class="btn btn-warning btn-sm" onclick="generateReport()">Weekly Report</button>
  </div>
  <div class="tabs">
    <button class="tab active" onclick="switchTab('overview')">Overview</button>
    <button class="tab" onclick="switchTab('ratios')">Conversion Ratios</button>
    <button class="tab" onclick="switchTab('pipeline')">Pipeline & Stages</button>
    <button class="tab ai-tab" onclick="switchTab('ai-analytics')">AI Analytics</button>
    <button class="tab" onclick="switchTab('actions')">Pending Actions</button>
    <button class="tab" onclick="switchTab('compare')">Compare</button>
    <button class="tab" onclick="switchTab('snapshots')">Snapshots</button>
  </div>
  <div id="tab-overview" class="tab-content active"></div>
  <div id="tab-ratios" class="tab-content"></div>
  <div id="tab-pipeline" class="tab-content"></div>
  <div id="tab-ai-analytics" class="tab-content"></div>
  <div id="tab-actions" class="tab-content"></div>
  <div id="tab-compare" class="tab-content"></div>
  <div id="tab-snapshots" class="tab-content"></div>

  <script>
    var liveData=null,snapshots=[],aiInsights=null,aiPredictions=null,charts={},selectedAEs='all';
    document.addEventListener('DOMContentLoaded',function(){refreshData();loadAIInsights()});
    function refreshData(){google.script.run.withSuccessHandler(function(d){liveData=JSON.parse(d);renderAll();document.getElementById('lastUpdated').textContent='Updated: '+liveData.dateLabel}).getLiveDataJSON();google.script.run.withSuccessHandler(function(d){snapshots=JSON.parse(d);renderSnapshots();renderCompare()}).getSnapshotsJSON()}
    function loadAIInsights(){google.script.run.withSuccessHandler(function(d){aiInsights=JSON.parse(d);renderAIInsights()}).getAIInsightsJSON();google.script.run.withSuccessHandler(function(d){aiPredictions=JSON.parse(d);renderAIPredictions()}).getAIPredictionsJSON()}
    function refreshAIInsights(){document.getElementById('aiHighlights').innerHTML='<li class="ai-pulse">Analyzing...</li>';document.getElementById('aiConcerns').innerHTML='<li class="ai-pulse">Detecting...</li>';document.getElementById('aiRecommendations').innerHTML='<li class="ai-pulse">Generating...</li>';document.getElementById('aiPrediction').innerHTML='<li class="ai-pulse">Forecasting...</li>';loadAIInsights()}
    function renderAIInsights(){if(!aiInsights)return;document.getElementById('aiHighlights').innerHTML=(aiInsights.highlights||[]).map(function(h){return'<li>'+h+'</li>'}).join('')||'<li>No highlights</li>';document.getElementById('aiConcerns').innerHTML=(aiInsights.concerns||[]).map(function(c){return'<li style="color:#ff6b6b">'+c+'</li>'}).join('')||'<li style="color:#00ff88">No concerns</li>';document.getElementById('aiRecommendations').innerHTML=(aiInsights.recommendations||[]).map(function(r){return'<li>'+r+'</li>'}).join('')||'<li>No recommendations</li>';document.getElementById('aiPrediction').innerHTML='<li>'+(aiInsights.prediction||'Unavailable')+'</li>'}
    function renderAIPredictions(){if(document.getElementById('tab-ai-analytics').classList.contains('active'))renderAIAnalytics()}
    function askAIQuestion(){var q=document.getElementById('aiQuestion').value.trim();if(!q)return;var r=document.getElementById('aiResponse');r.innerHTML='<span class="ai-pulse">AI is thinking...</span>';r.classList.add('visible');google.script.run.withSuccessHandler(function(a){r.innerHTML='<strong>AI Response:</strong><br>'+a.replace(/\\n/g,'<br>')}).withFailureHandler(function(e){r.innerHTML='<span style="color:#ff4757">Error: '+e+'</span>'}).askAIFromDashboard(q);document.getElementById('aiQuestion').value=''}
    function applyAEFilter(){selectedAEs=document.getElementById('aeFilter').value;document.getElementById('filterInfo').textContent='Showing: '+(selectedAEs==='all'?'All AEs (Team View)':selectedAEs);renderAll()}
    function getFilteredData(){if(selectedAEs==='all')return{team:liveData.team,byAE:liveData.byAE,dealStages:liveData.dealStages,dealStagesByAE:liveData.dealStagesByAE,interestedBreakdown:liveData.interestedBreakdown,interestedByAE:liveData.interestedByAE,pipelineByStage:liveData.pipelineByStage,pendingActions:liveData.pendingActions};var aeList=selectedAEs.split(','),filtered={team:{total:0,linkedin:0,contactsExtracted:0,emails:0,emailed:0,phones:0,talked:0,meetings:0,interestedYes:0,interestedExploring:0,interestedNo:0,staged:0},byAE:{},dealStages:{},dealStagesByAE:{},interestedBreakdown:{yes:0,exploring:0,no:0,not_contacted:0},interestedByAE:{},pipelineByStage:{'Top of Funnel':0,'Mid Funnel':0,'Bottom Funnel':0,'Closed':0},pendingActions:[]},stageGroups={'Top of Funnel':['Early Lead','Contacted'],'Mid Funnel':['Appointment Scheduled','Qualified to Buy','Scoping'],'Bottom Funnel':['Scope/ PoC Sign-Off','Proposal','Negotiation','Commit','Integrating'],'Closed':['Closed Active','Closed Lost']};aeList.forEach(function(ae){var aeData=liveData.byAE[ae];if(!aeData)return;filtered.byAE[ae]=aeData;filtered.dealStagesByAE[ae]=liveData.dealStagesByAE[ae];filtered.interestedByAE[ae]=liveData.interestedByAE[ae];Object.keys(aeData).forEach(function(k){if(typeof aeData[k]==='number')filtered.team[k]=(filtered.team[k]||0)+aeData[k]});var aeStages=liveData.dealStagesByAE[ae]||{};Object.keys(aeStages).forEach(function(stage){filtered.dealStages[stage]=(filtered.dealStages[stage]||0)+aeStages[stage]});var aeInt=liveData.interestedByAE[ae]||{};Object.keys(aeInt).forEach(function(k){filtered.interestedBreakdown[k]=(filtered.interestedBreakdown[k]||0)+aeInt[k]})});Object.keys(stageGroups).forEach(function(group){stageGroups[group].forEach(function(stage){filtered.pipelineByStage[group]+=filtered.dealStages[stage]||0})});filtered.pendingActions=liveData.pendingActions.filter(function(a){return aeList.indexOf(a.ae)!==-1});return filtered}
    function renderAll(){renderSummaryCards();renderInterestedCards();renderOverview();renderRatios();renderPipeline();renderAIAnalytics();renderActions()}
    function switchTab(tabId){document.querySelectorAll('.tab').forEach(function(t){t.classList.remove('active')});document.querySelectorAll('.tab-content').forEach(function(t){t.classList.remove('active')});event.target.classList.add('active');document.getElementById('tab-'+tabId).classList.add('active')}
    function calcPct(n,d){return(!d||d===0)?0:Math.round((n/d)*100)}
    function getRatioClass(p){return p>=50?'high':p>=25?'medium':'low'}
    function renderSummaryCards(){var data=getFilteredData(),t=data.team,prev=snapshots[0]?snapshots[0].data.team:null,cards=[{label:'Total Accounts',value:t.total,key:'total',color:'#00d4ff'},{label:'Talked',value:t.talked,key:'talked',color:'#7b2cbf'},{label:'Meetings',value:t.meetings,key:'meetings',color:'#00ff88'},{label:'Interested (Yes)',value:t.interestedYes,key:'interestedYes',color:'#00ff88'},{label:'Exploring',value:t.interestedExploring,key:'interestedExploring',color:'#ffc107'},{label:'Deal Staged',value:t.staged,key:'staged',color:'#ff6b6b'}],html='';cards.forEach(function(c){var delta=(prev&&selectedAEs==='all')?(c.value-(prev[c.key]||0)):null,deltaClass=delta!==null?(delta>0?'positive':delta<0?'negative':'neutral'):'neutral',deltaText=delta!==null?(delta>=0?'+'+delta:delta)+' vs last':'-';html+='<div class="summary-card" style="--accent-color:'+c.color+'"><div class="ai-indicator"></div><div class="label">'+c.label+'</div><div class="value" style="color:'+c.color+'">'+c.value+'</div><div class="delta '+deltaClass+'">'+deltaText+'</div></div>'});document.getElementById('summaryCards').innerHTML=html}
    function renderInterestedCards(){var data=getFilteredData(),i=data.interestedBreakdown,total=i.yes+i.exploring+i.no+i.not_contacted,items=[{label:'Interested (Yes)',value:i.yes,color:'#00ff88'},{label:'Still Exploring',value:i.exploring,color:'#ffc107'},{label:'Not Interested',value:i.no,color:'#ff4757'},{label:'Not Yet Contacted',value:i.not_contacted,color:'#888'}],html='';items.forEach(function(item){var pct=total>0?Math.round(item.value/total*100):0;html+='<div class="mini-card"><div class="mini-label">'+item.label+'</div><div class="mini-value" style="color:'+item.color+'">'+item.value+'</div><div class="mini-label">'+pct+'%</div></div>'});document.getElementById('interestedCards').innerHTML=html}
    function renderOverview(){var data=getFilteredData(),aeNames=Object.keys(data.byAE),html='<div class="scroll-container"><table class="data-table"><thead><tr><th>AE</th><th>Total</th><th>LinkedIn</th><th>Phones</th><th>Talked</th><th>Meetings</th><th style="color:#00ff88">Yes</th><th style="color:#ffc107">Exploring</th><th style="color:#ff4757">No</th><th>Staged</th></tr></thead><tbody>';aeNames.forEach(function(ae){var d=data.byAE[ae],intData=data.interestedByAE[ae]||{yes:0,exploring:0,no:0};html+='<tr><td><strong>'+ae+'</strong></td><td>'+d.total+'</td><td>'+d.linkedin+'</td><td>'+d.phones+'</td><td>'+d.talked+'</td><td>'+d.meetings+'</td><td style="color:#00ff88;font-weight:600">'+intData.yes+'</td><td style="color:#ffc107;font-weight:600">'+intData.exploring+'</td><td style="color:#ff4757;font-weight:600">'+intData.no+'</td><td>'+d.staged+'</td></tr>'});if(aeNames.length>1){var t=data.team,totalInt=data.interestedBreakdown;html+='<tr class="total-row"><td>TOTAL</td><td>'+t.total+'</td><td>'+t.linkedin+'</td><td>'+t.phones+'</td><td>'+t.talked+'</td><td>'+t.meetings+'</td><td style="color:#00ff88;font-weight:600">'+totalInt.yes+'</td><td style="color:#ffc107;font-weight:600">'+totalInt.exploring+'</td><td style="color:#ff4757;font-weight:600">'+totalInt.no+'</td><td>'+t.staged+'</td></tr>'}html+='</tbody></table></div><div class="charts-grid"><div class="chart-box"><h3>Funnel by AE</h3><canvas id="chartFunnel"></canvas></div><div class="chart-box"><h3>Interested Breakdown</h3><canvas id="chartInterested"></canvas></div></div>';document.getElementById('tab-overview').innerHTML=html;setTimeout(function(){renderFunnelChart();renderInterestedChart()},100)}
    function renderFunnelChart(){var ctx=document.getElementById('chartFunnel');if(!ctx)return;var data=getFilteredData(),aeNames=Object.keys(data.byAE);if(charts.funnel)charts.funnel.destroy();charts.funnel=new Chart(ctx,{type:'bar',data:{labels:aeNames,datasets:[{label:'Total',data:aeNames.map(function(ae){return data.byAE[ae].total}),backgroundColor:'#00d4ff'},{label:'Talked',data:aeNames.map(function(ae){return data.byAE[ae].talked}),backgroundColor:'#7b2cbf'},{label:'Meetings',data:aeNames.map(function(ae){return data.byAE[ae].meetings}),backgroundColor:'#00ff88'}]},options:{responsive:true,plugins:{legend:{labels:{color:'#fff'}}},scales:{x:{ticks:{color:'#888'},grid:{color:'rgba(255,255,255,0.05)'}},y:{ticks:{color:'#888'},grid:{color:'rgba(255,255,255,0.05)'}}}}})}
    function renderInterestedChart(){var ctx=document.getElementById('chartInterested');if(!ctx)return;var data=getFilteredData(),i=data.interestedBreakdown;if(charts.interested)charts.interested.destroy();charts.interested=new Chart(ctx,{type:'doughnut',data:{labels:['Yes','Exploring','No','Not Contacted'],datasets:[{data:[i.yes,i.exploring,i.no,i.not_contacted],backgroundColor:['#00ff88','#ffc107','#ff4757','#555']}]},options:{responsive:true,plugins:{legend:{position:'right',labels:{color:'#fff'}}}}})}
    function renderAIAnalytics(){var data=getFilteredData(),t=data.team,html='<div class="ai-predictions-card"><div class="ai-header"><div class="ai-title"><span>AI Performance Predictions</span><span class="ai-badge" style="font-size:9px">FORECAST</span></div></div><div class="prediction-grid">';if(aiPredictions&&aiPredictions.predictions){var p=aiPredictions.predictions;html+='<div class="prediction-item"><div class="pred-label">Predicted New Accounts</div><div class="pred-value">'+(p.newAccounts||'~'+Math.round(t.total*0.1))+'</div><div class="pred-change positive">Next Week</div></div>';html+='<div class="prediction-item"><div class="pred-label">Predicted Meetings</div><div class="pred-value">'+(p.meetings||'~'+Math.round(t.meetings*1.1))+'</div><div class="pred-change positive">+10% expected</div></div>';html+='<div class="prediction-item"><div class="pred-label">Predicted Conversions</div><div class="pred-value">'+(p.conversions||'~'+Math.round(t.interestedYes*1.05))+'</div><div class="pred-change positive">Based on trend</div></div>';html+='<div class="prediction-item"><div class="pred-label">Confidence Level</div><div class="pred-value">'+(p.confidence||'Medium').toUpperCase()+'</div><div class="pred-change neutral">AI Confidence</div></div>'}else{html+='<div class="prediction-item"><div class="pred-label">New Accounts</div><div class="pred-value">~'+Math.round(t.total*0.1)+'</div><div class="pred-change">Projected</div></div><div class="prediction-item"><div class="pred-label">Meetings</div><div class="pred-value">~'+Math.round(t.meetings*1.1)+'</div><div class="pred-change">Projected</div></div><div class="prediction-item"><div class="pred-label">Conversions</div><div class="pred-value">~'+Math.round(t.interestedYes*1.05)+'</div><div class="pred-change">Projected</div></div><div class="prediction-item"><div class="pred-label">Confidence</div><div class="pred-value">LOW</div><div class="pred-change neutral">Enable AI</div></div>'}html+='</div></div>';html+='<div class="charts-grid-3"><div class="chart-box ai-chart"><h3>AI Conversion Funnel</h3><canvas id="chartAIFunnel"></canvas></div><div class="chart-box ai-chart"><h3>Performance Trend</h3><canvas id="chartTrend"></canvas></div><div class="chart-box ai-chart"><h3>AE Efficiency Radar</h3><canvas id="chartRadar"></canvas></div></div>';html+='<div class="charts-grid" style="margin-top:12px"><div class="chart-box ai-chart"><h3>Pipeline Distribution</h3><canvas id="chartStageDistribution"></canvas></div><div class="chart-box ai-chart"><h3>Conversion Metrics</h3><canvas id="chartConversionMetrics"></canvas></div></div>';document.getElementById('tab-ai-analytics').innerHTML=html;setTimeout(function(){renderAIFunnelChart();renderTrendChart();renderRadarChart();renderStageDistributionChart();renderConversionMetricsChart()},100)}
    function renderAIFunnelChart(){var ctx=document.getElementById('chartAIFunnel');if(!ctx)return;var data=getFilteredData(),t=data.team,stages=['Total','LinkedIn','Phones','Talked','Meetings','Interested'],values=[t.total,t.linkedin,t.phones,t.talked,t.meetings,t.interestedYes],colors=['#00d4ff','#5c6bc0','#7b2cbf','#9c27b0','#00ff88','#ffc107'];if(charts.aiFunnel)charts.aiFunnel.destroy();charts.aiFunnel=new Chart(ctx,{type:'bar',data:{labels:stages,datasets:[{data:values,backgroundColor:colors,borderRadius:4}]},options:{indexAxis:'y',responsive:true,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#888'},grid:{color:'rgba(255,255,255,0.05)'}},y:{ticks:{color:'#fff'},grid:{color:'rgba(255,255,255,0.05)'}}}}})}
    function renderTrendChart(){var ctx=document.getElementById('chartTrend');if(!ctx)return;var trendData=[],labels=[];if(snapshots.length>0){snapshots.slice(0,7).reverse().forEach(function(s){labels.push(s.label.split(' ')[0]);trendData.push({meetings:s.data.team.meetings,interested:s.data.team.interestedYes})})}labels.push('Now');trendData.push({meetings:liveData.team.meetings,interested:liveData.team.interestedYes});if(charts.trend)charts.trend.destroy();charts.trend=new Chart(ctx,{type:'line',data:{labels:labels,datasets:[{label:'Meetings',data:trendData.map(function(d){return d.meetings}),borderColor:'#00ff88',backgroundColor:'rgba(0,255,136,0.1)',fill:true,tension:0.3},{label:'Interested',data:trendData.map(function(d){return d.interested}),borderColor:'#7b2cbf',backgroundColor:'rgba(123,44,191,0.1)',fill:true,tension:0.3}]},options:{responsive:true,plugins:{legend:{labels:{color:'#fff'}}},scales:{x:{ticks:{color:'#888'},grid:{color:'rgba(255,255,255,0.05)'}},y:{ticks:{color:'#888'},grid:{color:'rgba(255,255,255,0.05)'}}}}})}
    function renderRadarChart(){var ctx=document.getElementById('chartRadar');if(!ctx)return;var data=getFilteredData(),aeNames=Object.keys(data.byAE),colors=['rgba(0,212,255,0.5)','rgba(123,44,191,0.5)','rgba(0,255,136,0.5)'],borderColors=['#00d4ff','#7b2cbf','#00ff88'],datasets=aeNames.map(function(ae,idx){var d=data.byAE[ae];return{label:ae,data:[calcPct(d.linkedin,d.total),calcPct(d.phones,d.total),calcPct(d.talked,d.phones||1),calcPct(d.meetings,d.talked||1),calcPct(d.interestedYes,d.meetings||1)],backgroundColor:colors[idx%3],borderColor:borderColors[idx%3],borderWidth:2}});if(charts.radar)charts.radar.destroy();charts.radar=new Chart(ctx,{type:'radar',data:{labels:['LinkedIn %','Phone %','Talk Rate','Meeting Rate','Interest Rate'],datasets:datasets},options:{responsive:true,plugins:{legend:{labels:{color:'#fff'}}},scales:{r:{ticks:{color:'#888',backdropColor:'transparent'},grid:{color:'rgba(255,255,255,0.1)'},pointLabels:{color:'#fff'},max:100}}}})}
    function renderStageDistributionChart(){var ctx=document.getElementById('chartStageDistribution');if(!ctx)return;var data=getFilteredData(),stageOrder=['Early Lead','Contacted','Appointment Scheduled','Qualified to Buy','Scoping','Scope/ PoC Sign-Off','Proposal','Negotiation','Commit','Integrating','Closed Active','Closed Lost'],stageColors=['#64b5f6','#4fc3f7','#4dd0e1','#4db6ac','#81c784','#aed581','#dce775','#fff176','#ffb74d','#ff8a65','#00ff88','#ff4757'],values=stageOrder.map(function(stage){return data.dealStages[stage]||0}),labels=stageOrder.map(function(s){return s.length>10?s.substring(0,8)+'..':s});if(charts.stageDistribution)charts.stageDistribution.destroy();charts.stageDistribution=new Chart(ctx,{type:'polarArea',data:{labels:labels,datasets:[{data:values,backgroundColor:stageColors.map(function(c){return c+'80'}),borderColor:stageColors}]},options:{responsive:true,plugins:{legend:{position:'right',labels:{color:'#fff',font:{size:10}}}},scales:{r:{ticks:{color:'#888',backdropColor:'transparent'},grid:{color:'rgba(255,255,255,0.1)'}}}}})}
    function renderConversionMetricsChart(){var ctx=document.getElementById('chartConversionMetrics');if(!ctx)return;var data=getFilteredData(),t=data.team,metrics=[{label:'LinkedIn Rate',value:calcPct(t.linkedin,t.total)},{label:'Phone Rate',value:calcPct(t.phones,t.total)},{label:'Talk Rate',value:calcPct(t.talked,t.phones||1)},{label:'Meeting Rate',value:calcPct(t.meetings,t.talked||1)},{label:'Interest Rate',value:calcPct(t.interestedYes,t.meetings||1)},{label:'Stage Rate',value:calcPct(t.staged,t.total)}];if(charts.conversionMetrics)charts.conversionMetrics.destroy();charts.conversionMetrics=new Chart(ctx,{type:'bar',data:{labels:metrics.map(function(m){return m.label}),datasets:[{data:metrics.map(function(m){return m.value}),backgroundColor:metrics.map(function(m){return m.value>=50?'#00ff88':m.value>=25?'#ffc107':'#ff4757'}),borderRadius:4}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'#888'},grid:{color:'rgba(255,255,255,0.05)'}},y:{ticks:{color:'#888',callback:function(v){return v+'%'}},grid:{color:'rgba(255,255,255,0.05)'},max:100}}}})}
    function renderRatios(){var data=getFilteredData(),ratios=[{from:'Total',to:'LinkedIn',fKey:'total',tKey:'linkedin'},{from:'Total',to:'Phones',fKey:'total',tKey:'phones'},{from:'Total',to:'Talked',fKey:'total',tKey:'talked'},{from:'Total',to:'Meetings',fKey:'total',tKey:'meetings'},{from:'Phones',to:'Talked',fKey:'phones',tKey:'talked'},{from:'Talked',to:'Meetings',fKey:'talked',tKey:'meetings'},{from:'Meetings',to:'Interested',fKey:'meetings',tKey:'interestedYes'}],aeNames=Object.keys(data.byAE),html='<div class="scroll-container"><table class="data-table"><thead><tr><th>Conversion</th>';aeNames.forEach(function(ae){html+='<th>'+ae+'</th>'});if(aeNames.length>1)html+='<th>TOTAL</th>';html+='</tr></thead><tbody>';ratios.forEach(function(r){html+='<tr><td><strong>'+r.from+' -> '+r.to+'</strong></td>';aeNames.forEach(function(ae){var d=data.byAE[ae],pct=calcPct(d[r.tKey],d[r.fKey]);html+='<td class="ratio '+getRatioClass(pct)+'">'+pct+'%</td>'});if(aeNames.length>1){var t=data.team,teamPct=calcPct(t[r.tKey],t[r.fKey]);html+='<td class="ratio '+getRatioClass(teamPct)+'"><strong>'+teamPct+'%</strong></td>'}html+='</tr>'});html+='</tbody></table></div>';document.getElementById('tab-ratios').innerHTML=html}
    function renderPipeline(){var data=getFilteredData(),pipeline=data.pipelineByStage,stageOrder=['Early Lead','Contacted','Appointment Scheduled','Qualified to Buy','Scoping','Scope/ PoC Sign-Off','Proposal','Negotiation','Commit','Integrating','Closed Active','Closed Lost'],stageColors={'Early Lead':'#64b5f6','Contacted':'#4fc3f7','Appointment Scheduled':'#4dd0e1','Qualified to Buy':'#4db6ac','Scoping':'#81c784','Scope/ PoC Sign-Off':'#aed581','Proposal':'#dce775','Negotiation':'#fff176','Commit':'#ffb74d','Integrating':'#ff8a65','Closed Active':'#00ff88','Closed Lost':'#ff4757'},totalStaged=0;stageOrder.forEach(function(stage){totalStaged+=data.dealStages[stage]||0});var html='<div class="pipeline-container"><div class="pipeline-stage top"><h4>Top of Funnel</h4><div class="count">'+(pipeline['Top of Funnel']||0)+'</div></div><div class="pipeline-stage mid"><h4>Mid Funnel</h4><div class="count">'+(pipeline['Mid Funnel']||0)+'</div></div><div class="pipeline-stage bottom"><h4>Bottom Funnel</h4><div class="count">'+(pipeline['Bottom Funnel']||0)+'</div></div><div class="pipeline-stage closed"><h4>Closed</h4><div class="count">'+(pipeline['Closed']||0)+'</div></div></div>';html+='<div style="display:flex;gap:20px;margin-top:16px"><div class="true-funnel" style="flex:1"><h3 style="color:#00d4ff;font-size:12px;margin-bottom:12px;text-align:center">Deal Stage Funnel</h3>';var runningTotal=totalStaged;stageOrder.forEach(function(stage){var count=data.dealStages[stage]||0,color=stageColors[stage],widthPct=totalStaged>0?Math.max(30,(runningTotal/totalStaged)*100):30,nextWidthPct=totalStaged>0?Math.max(25,((runningTotal-count)/totalStaged)*100):25,indent=(100-widthPct)/2,nextIndent=(100-nextWidthPct)/2;html+='<div class="funnel-section" style="width:'+widthPct+'%"><div class="funnel-trapezoid" style="width:100%;background:'+color+';clip-path:polygon('+indent+'% 0%,'+(100-indent)+'% 0%,'+(100-nextIndent)+'% 100%,'+nextIndent+'% 100%);height:'+(count>0?'32px':'20px')+'"><span class="trap-label">'+stage+'</span><span class="trap-count">'+count+'</span></div></div>';runningTotal-=count});html+='</div><div style="width:250px"><h3 style="color:#00d4ff;font-size:12px;margin-bottom:12px">Funnel Summary</h3><div class="funnel-summary-card"><span class="fsc-label">Total in Pipeline</span><span class="fsc-value" style="color:#00d4ff">'+totalStaged+'</span></div><div class="funnel-summary-card"><span class="fsc-label">Top of Funnel</span><span class="fsc-value" style="color:#64b5f6">'+(pipeline['Top of Funnel']||0)+'</span></div><div class="funnel-summary-card"><span class="fsc-label">Mid Funnel</span><span class="fsc-value" style="color:#81c784">'+(pipeline['Mid Funnel']||0)+'</span></div><div class="funnel-summary-card"><span class="fsc-label">Bottom Funnel</span><span class="fsc-value" style="color:#fff176">'+(pipeline['Bottom Funnel']||0)+'</span></div><div class="funnel-summary-card"><span class="fsc-label">Closed Active</span><span class="fsc-value" style="color:#00ff88">'+(data.dealStages['Closed Active']||0)+'</span></div><div class="funnel-summary-card"><span class="fsc-label">Closed Lost</span><span class="fsc-value" style="color:#ff4757">'+(data.dealStages['Closed Lost']||0)+'</span></div></div></div>';document.getElementById('tab-pipeline').innerHTML=html}
    function renderActions(){var data=getFilteredData(),actions=data.pendingActions||[],callPending=actions.filter(function(a){return a.type==='call_pending'}),followupNeeded=actions.filter(function(a){return a.type==='followup_needed'}),html='<div style="margin-bottom:16px;padding:12px;background:rgba(0,212,255,0.1);border-radius:8px;border:1px solid rgba(0,212,255,0.2)"><h3 style="color:#00d4ff;font-size:13px;margin-bottom:8px">Pending Actions (AI Enhanced)</h3><div style="font-size:11px;color:#aaa"><div><span style="color:#ff4757">Call Pending</span>: Has phone but not talked</div><div><span style="color:#ffc107">Follow-up</span>: Exploring + >7 days since contact</div></div></div>';if(actions.length===0){html+='<div class="loading">No pending actions!</div>';document.getElementById('tab-actions').innerHTML=html;return}html+='<div style="display:flex;gap:12px;margin-bottom:16px"><div style="flex:1;background:rgba(255,71,87,0.15);border:1px solid rgba(255,71,87,0.3);border-radius:8px;padding:12px;text-align:center"><div style="font-size:24px;font-weight:700;color:#ff4757">'+callPending.length+'</div><div style="font-size:11px;color:#888">Calls Pending</div></div><div style="flex:1;background:rgba(255,193,7,0.15);border:1px solid rgba(255,193,7,0.3);border-radius:8px;padding:12px;text-align:center"><div style="font-size:24px;font-weight:700;color:#ffc107">'+followupNeeded.length+'</div><div style="font-size:11px;color:#888">Follow-ups</div></div><div style="flex:1;background:rgba(0,212,255,0.15);border:1px solid rgba(0,212,255,0.3);border-radius:8px;padding:12px;text-align:center"><div style="font-size:24px;font-weight:700;color:#00d4ff">'+actions.length+'</div><div style="font-size:11px;color:#888">Total</div></div></div>';if(callPending.length>0){html+='<h4 style="color:#ff4757;font-size:12px;margin:16px 0 8px">Calls Pending ('+callPending.length+')</h4><div class="action-list" style="max-height:150px">';callPending.slice(0,15).forEach(function(a){html+='<div class="action-item high"><div class="action-info"><div class="action-company">'+a.company+'</div><div class="action-ae">AE: '+a.ae+'</div></div></div>'});html+='</div>'}if(followupNeeded.length>0){html+='<h4 style="color:#ffc107;font-size:12px;margin:16px 0 8px">Follow-ups ('+followupNeeded.length+')</h4><div class="action-list" style="max-height:150px">';followupNeeded.slice(0,15).forEach(function(a){html+='<div class="action-item medium"><div class="action-info"><div class="action-company">'+a.company+' <span style="color:#888;font-size:10px">('+a.daysSince+' days)</span></div><div class="action-ae">AE: '+a.ae+'</div></div></div>'});html+='</div>'}document.getElementById('tab-actions').innerHTML=html}
    function renderCompare(){if(snapshots.length===0){document.getElementById('tab-compare').innerHTML='<div class="loading">No snapshots yet.</div>';return}var options='<option value="">-- Select Snapshot --</option>';snapshots.forEach(function(s,i){options+='<option value="'+i+'">'+s.label+' ('+new Date(s.timestamp).toLocaleDateString()+')</option>'});document.getElementById('tab-compare').innerHTML='<div class="compare-row"><label>Compare with:</label><select class="compare-select" id="compareSelect" onchange="updateComparison()">'+options+'</select></div><div id="compareResults"></div>'}
    function updateComparison(){var idx=document.getElementById('compareSelect').value;if(idx===''){document.getElementById('compareResults').innerHTML='';return}var snap=snapshots[parseInt(idx)],old=snap.data.team,now=liveData.team,metrics=[{label:'Total Accounts',key:'total'},{label:'Talked',key:'talked'},{label:'Meetings',key:'meetings'},{label:'Interested (Yes)',key:'interestedYes'},{label:'Exploring',key:'interestedExploring'},{label:'Staged',key:'staged'}],html='<h3 style="margin-bottom:12px">Now vs '+snap.label+'</h3><table class="data-table"><thead><tr><th>Metric</th><th>Then</th><th>Now</th><th>Change</th><th>%</th></tr></thead><tbody>';metrics.forEach(function(m){var oldVal=old[m.key]||0,nowVal=now[m.key]||0,diff=nowVal-oldVal,pct=oldVal>0?((diff/oldVal)*100).toFixed(1):(nowVal>0?'NEW':'0'),cls=diff>0?'positive':diff<0?'negative':'neutral';html+='<tr><td><strong>'+m.label+'</strong></td><td>'+oldVal+'</td><td>'+nowVal+'</td><td class="delta '+cls+'">'+(diff>=0?'+':'')+diff+'</td><td class="delta '+cls+'">'+pct+'%</td></tr>'});html+='</tbody></table>';document.getElementById('compareResults').innerHTML=html}
    function renderSnapshots(){if(snapshots.length===0){document.getElementById('tab-snapshots').innerHTML='<div class="loading">No snapshots saved yet.</div>';return}var html='<div class="snapshot-list">';snapshots.forEach(function(s){html+='<div class="snapshot-item"><div><div class="snapshot-label">'+s.label+'</div><div class="snapshot-date">'+new Date(s.timestamp).toLocaleString()+' | Week '+s.data.weekNumber+'</div></div><div><button class="btn btn-secondary btn-sm" onclick="deleteSnap(\\''+s.id+'\\')">Delete</button></div></div>'});html+='</div>';document.getElementById('tab-snapshots').innerHTML=html}
    function saveNewSnapshot(){google.script.run.withSuccessHandler(function(r){var d=JSON.parse(r);alert('Snapshot saved: '+d.label);refreshData()}).saveSnapshotFromDashboard('')}
    function deleteSnap(id){if(confirm('Delete this snapshot?'))google.script.run.withSuccessHandler(function(){refreshData()}).deleteSnapshotFromDashboard(id)}
    function generateInsights(){refreshAIInsights()}
    function exportData(){google.script.run.exportToCSV()}
    function exportAIReport(){google.script.run.exportAIReport()}
    function generateReport(){google.script.run.generateAIWeeklyReport()}
  </script>
</body>
</html>`;
}
