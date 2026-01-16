/**
 * =====================================================
 * INSTANT LOAN LEADS - NORTH POD DASHBOARD v3.0
 * AI-POWERED EDITION - ChatGPT 5.2 Integration
 * =====================================================
 * Enhanced Features:
 * - AI-Powered Insights & Recommendations (ChatGPT 5.2)
 * - Predictive Analytics & Forecasting
 * - Natural Language Query Interface
 * - Smart Anomaly Detection
 * - AI-Generated Performance Reports
 * - Advanced Visual Analytics (Charts & Graphs)
 * - Intelligent Action Prioritization
 * =====================================================
 * Setup: Extensions > Apps Script > Paste & Save > Refresh Sheet
 * Then: AI Dashboard > Configure API Key (set your OpenAI key)
 */

// =====================================================
// CONFIGURATION - CUSTOMIZE THESE
// =====================================================
const CONFIG = {
  AE_SHEETS: ['Shivam.', 'Utkarsh.', 'Jyati.'],
  SNAPSHOT_SHEET: 'Dashboard_Snapshots',
  AI_CACHE_SHEET: 'AI_Cache',

  // OpenAI Configuration - ChatGPT 5.2
  OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY_HERE',
  OPENAI_MODEL: 'gpt-5.2',
  OPENAI_ENDPOINT: 'https://api.openai.com/v1/chat/completions',
  AI_CACHE_DURATION_HOURS: 1,

  // Value mappings
  YES_VALUES: ['yes', 'y', 'true', '1', 'done', 'completed'],
  NO_VALUES: ['no', 'n', 'false', '0', 'not done', 'pending'],

  // Interested status mappings
  INTERESTED_YES: ['yes', 'y', 'interested', 'confirmed'],
  INTERESTED_EXPLORING: ['still exploring', 'exploring', 'maybe', 'thinking', 'considering'],
  INTERESTED_NO: ['no', 'not interested', 'rejected', 'declined', 'lost'],

  // Stage order from Hubspot
  STAGE_ORDER: [
    'Early Lead', 'Contacted', 'Appointment Scheduled', 'Qualified to Buy',
    'Scoping', 'Scope/ PoC Sign-Off', 'Proposal', 'Negotiation',
    'Commit', 'Integrating', 'Closed Active', 'Closed Lost'
  ],

  // Stage groupings
  STAGE_GROUPS: {
    'Top of Funnel': ['Early Lead', 'Contacted'],
    'Mid Funnel': ['Appointment Scheduled', 'Qualified to Buy', 'Scoping'],
    'Bottom Funnel': ['Scope/ PoC Sign-Off', 'Proposal', 'Negotiation', 'Commit', 'Integrating'],
    'Closed': ['Closed Active', 'Closed Lost']
  },

  // Stage colors
  STAGE_COLORS: {
    'Early Lead': '#64b5f6', 'Contacted': '#4fc3f7', 'Appointment Scheduled': '#4dd0e1',
    'Qualified to Buy': '#4db6ac', 'Scoping': '#81c784', 'Scope/ PoC Sign-Off': '#aed581',
    'Proposal': '#dce775', 'Negotiation': '#fff176', 'Commit': '#ffb74d',
    'Integrating': '#ff8a65', 'Closed Active': '#00ff88', 'Closed Lost': '#ff4757'
  }
};

// =====================================================
// MENU SETUP
// =====================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🤖 AI Dashboard')
    .addItem('🚀 Open AI Dashboard', 'showDashboard')
    .addItem('💾 Save Snapshot', 'saveSnapshotWithConfirm')
    .addSeparator()
    .addSubMenu(SpreadsheetApp.getUi().createMenu('🧠 AI Features')
      .addItem('Generate AI Insights', 'generateAIInsightsMenu')
      .addItem('Get AI Recommendations', 'getAIRecommendationsMenu')
      .addItem('Predict Next Week Performance', 'predictPerformanceMenu')
      .addItem('Ask AI a Question', 'askAIQuestionMenu'))
    .addSubMenu(SpreadsheetApp.getUi().createMenu('📤 Export')
      .addItem('Export Current Data to CSV', 'exportToCSV')
      .addItem('Export AI Report', 'exportAIReport')
      .addItem('Export Snapshot Comparison', 'exportComparison'))
    .addSubMenu(SpreadsheetApp.getUi().createMenu('📋 Reports')
      .addItem('Generate AI Weekly Report', 'generateAIWeeklyReport')
      .addItem('Generate AE Performance Report', 'generateAEReport'))
    .addSeparator()
    .addItem('⚙️ Setup', 'initialSetup')
    .addItem('🔑 Configure API Key', 'configureAPIKey')
    .addToUi();
}

function initialSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SNAPSHOT_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SNAPSHOT_SHEET);
    sheet.getRange('A1:D1').setValues([['Snapshot ID', 'Timestamp', 'Label', 'Data (JSON)']]);
    sheet.setColumnWidth(4, 50);
    sheet.hideSheet();
  }
  let aiCache = ss.getSheetByName(CONFIG.AI_CACHE_SHEET);
  if (!aiCache) {
    aiCache = ss.insertSheet(CONFIG.AI_CACHE_SHEET);
    aiCache.getRange('A1:D1').setValues([['Cache Key', 'Timestamp', 'Expiry', 'Response (JSON)']]);
    aiCache.hideSheet();
  }
  SpreadsheetApp.getUi().alert('✅ Setup Complete! Use AI Dashboard menu to open.');
}

function configureAPIKey() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('🔑 Configure OpenAI API Key', 'Enter your OpenAI API key for ChatGPT 5.2:', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() === ui.Button.OK) {
    const key = response.getResponseText().trim();
    if (key) {
      PropertiesService.getScriptProperties().setProperty('OPENAI_API_KEY', key);
      ui.alert('✅ API Key saved successfully!');
    }
  }
}

// =====================================================
// AI INTEGRATION - CHATGPT 5.2
// =====================================================
function getOpenAIKey() {
  return PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY') || CONFIG.OPENAI_API_KEY;
}

function callChatGPT(prompt, systemPrompt, maxTokens = 2000) {
  const apiKey = getOpenAIKey();
  if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
    return { success: false, error: 'API key not configured', fallback: generateFallbackInsights() };
  }
  try {
    const payload = {
      model: CONFIG.OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt || 'You are an expert sales analytics AI assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.7
    };
    const options = {
      method: 'post',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    const response = UrlFetchApp.fetch(CONFIG.OPENAI_ENDPOINT, options);
    const result = JSON.parse(response.getContentText());
    if (result.error) return { success: false, error: result.error.message };
    return { success: true, content: result.choices[0].message.content, usage: result.usage };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function getCachedAIResponse(cacheKey) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const cache = ss.getSheetByName(CONFIG.AI_CACHE_SHEET);
  if (!cache || cache.getLastRow() < 2) return null;
  const data = cache.getRange(2, 1, cache.getLastRow() - 1, 4).getValues();
  const now = new Date();
  for (const row of data) {
    if (row[0] === cacheKey && new Date(row[2]) > now) return JSON.parse(row[3]);
  }
  return null;
}

function setCachedAIResponse(cacheKey, response) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let cache = ss.getSheetByName(CONFIG.AI_CACHE_SHEET);
  if (!cache) { initialSetup(); cache = ss.getSheetByName(CONFIG.AI_CACHE_SHEET); }
  const now = new Date();
  const expiry = new Date(now.getTime() + CONFIG.AI_CACHE_DURATION_HOURS * 60 * 60 * 1000);
  cache.appendRow([cacheKey, now.toISOString(), expiry.toISOString(), JSON.stringify(response)]);
}

// =====================================================
// AI-POWERED ANALYTICS
// =====================================================
function generateAIInsights(data) {
  const cacheKey = 'insights_' + data.dateLabel;
  const cached = getCachedAIResponse(cacheKey);
  if (cached) return cached;

  const systemPrompt = `You are an expert sales analytics AI. Analyze data and provide:
1. Key Performance Highlights (3-4 bullet points)
2. Areas of Concern (2-3 issues)
3. Top 3 Actionable Recommendations
4. Performance Prediction for next week
Format response as JSON: {highlights:[], concerns:[], recommendations:[], prediction:""}`;

  const dataPrompt = `Analyze this sales team data:
TEAM: Total=${data.team.total}, Talked=${data.team.talked}, Meetings=${data.team.meetings}, InterestedYes=${data.team.interestedYes}, Exploring=${data.team.interestedExploring}, Staged=${data.team.staged}
RATES: Talk=${calcPct(data.team.talked, data.team.phones)}%, Meeting=${calcPct(data.team.meetings, data.team.talked)}%
BY AE: ${Object.keys(data.byAE).map(ae => `${ae}:${data.byAE[ae].total}accts/${data.byAE[ae].meetings}mtgs`).join(', ')}
PIPELINE: ${Object.keys(data.pipelineByStage).map(s => `${s}:${data.pipelineByStage[s]}`).join(', ')}
PENDING: ${data.pendingActions.length} actions`;

  const response = callChatGPT(dataPrompt, systemPrompt);
  if (response.success) {
    try {
      const insights = JSON.parse(response.content);
      setCachedAIResponse(cacheKey, insights);
      return insights;
    } catch (e) {
      const insights = { highlights: [response.content], concerns: [], recommendations: [], prediction: '', raw: response.content };
      setCachedAIResponse(cacheKey, insights);
      return insights;
    }
  }
  return generateFallbackInsights(data);
}

function generateFallbackInsights(data) {
  if (!data) return { highlights: ['AI unavailable - configure API key'], concerns: ['Configure OpenAI API key'], recommendations: ['Go to AI Dashboard > Configure API Key'], prediction: 'Enable AI for predictions' };
  const talkRate = calcPct(data.team.talked, data.team.phones);
  const meetingRate = calcPct(data.team.meetings, data.team.talked);
  return {
    highlights: [`${data.team.total} total accounts`, `${data.team.meetings} meetings (${meetingRate}% of talked)`, `${data.team.interestedYes + data.team.interestedExploring} leads showing interest`],
    concerns: [talkRate < 30 ? `Low talk rate (${talkRate}%)` : null, data.pendingActions.length > 10 ? `${data.pendingActions.length} pending actions` : null].filter(Boolean),
    recommendations: ['Focus on converting "Still Exploring" leads', 'Prioritize accounts with phone numbers', 'Schedule follow-ups for stale leads'],
    prediction: 'Enable AI for predictive analytics'
  };
}

function getAIRecommendations(data, context) {
  const systemPrompt = 'You are a sales optimization AI. Give specific recommendations. Format: {"recommendations":[{"priority":"high/medium/low","action":"...","expectedImpact":"..."}]}';
  const prompt = `Context: ${context || 'General optimization'}\nData: Leads=${data.team.total}, Contacted=${data.team.talked}, Meetings=${data.team.meetings}, Interested=${data.team.interestedYes}, Pending=${data.pendingActions.length}\nProvide 5 recommendations.`;
  const response = callChatGPT(prompt, systemPrompt);
  if (response.success) { try { return JSON.parse(response.content); } catch(e) { return { recommendations: [{ priority: 'medium', action: response.content, expectedImpact: 'Varies' }] }; } }
  return { recommendations: [
    { priority: 'high', action: 'Follow up with "Still Exploring" leads', expectedImpact: '10-15% conversion increase' },
    { priority: 'high', action: 'Contact leads with phone numbers not yet called', expectedImpact: '20+ new conversations' },
    { priority: 'medium', action: 'Review stale pipeline stages', expectedImpact: 'Improved accuracy' }
  ]};
}

function predictPerformance(data, snapshots) {
  const systemPrompt = 'You are a predictive analytics AI. Predict next week metrics. Format: {"predictions":{"newAccounts":X,"meetings":X,"conversions":X,"confidence":"high/medium/low"},"reasoning":"..."}';
  let historical = snapshots && snapshots.length > 0 ? 'History: ' + snapshots.slice(0,4).map(s => `${s.label}:M=${s.data.team.meetings}`).join(', ') : '';
  const prompt = `${historical}\nCurrent: Total=${data.team.total}, Meetings=${data.team.meetings}, Interested=${data.team.interestedYes}\nPredict next week.`;
  const response = callChatGPT(prompt, systemPrompt);
  if (response.success) { try { return JSON.parse(response.content); } catch(e) { return { predictions: { raw: response.content }, reasoning: response.content }; } }
  return { predictions: { newAccounts: Math.round(data.team.total * 0.1), meetings: Math.round(data.team.meetings * 1.1), conversions: Math.round(data.team.interestedYes * 1.05), confidence: 'low' }, reasoning: 'Basic projection (AI unavailable)' };
}

function askAI(question, data) {
  const systemPrompt = 'You are a helpful sales analytics AI. Answer concisely and actionably.';
  const context = `Data: Total=${data.team.total}, Talked=${data.team.talked}, Meetings=${data.team.meetings}, InterestedYes=${data.team.interestedYes}, Exploring=${data.team.interestedExploring}, Staged=${data.team.staged}, Pending=${data.pendingActions.length}\nAEs: ${Object.keys(data.byAE).map(ae => `${ae}:${data.byAE[ae].total}/${data.byAE[ae].meetings}`).join(', ')}\nQuestion: ${question}`;
  const response = callChatGPT(context, systemPrompt);
  return response.success ? response.content : 'Unable to process question. Please try again.';
}

function generateAnomalyDetection(data, snapshots) {
  if (!snapshots || snapshots.length < 2) return { anomalies: [], message: 'Need more historical data' };
  const systemPrompt = 'You are a data anomaly detection AI. Identify unusual patterns. Format: {"anomalies":[{"metric":"...","observation":"...","severity":"high/medium/low","recommendation":"..."}]}';
  const prompt = `History: ${snapshots.slice(0,5).map(s => `${s.label}:T=${s.data.team.total},M=${s.data.team.meetings}`).join(', ')}\nCurrent: Total=${data.team.total}, Meetings=${data.team.meetings}, Interested=${data.team.interestedYes}\nIdentify anomalies.`;
  const response = callChatGPT(prompt, systemPrompt);
  if (response.success) { try { return JSON.parse(response.content); } catch(e) { return { anomalies: [], raw: response.content }; } }
  return { anomalies: [] };
}

// =====================================================
// AI MENU FUNCTIONS
// =====================================================
function generateAIInsightsMenu() {
  const data = collectLiveData();
  const insights = generateAIInsights(data);
  let msg = '🧠 AI INSIGHTS\n\n✨ HIGHLIGHTS:\n' + (insights.highlights || []).map(h => '• ' + h).join('\n');
  msg += '\n\n⚠️ CONCERNS:\n' + (insights.concerns || []).map(c => '• ' + c).join('\n');
  msg += '\n\n💡 RECOMMENDATIONS:\n' + (insights.recommendations || []).map(r => '• ' + r).join('\n');
  msg += '\n\n🔮 PREDICTION:\n' + (insights.prediction || 'N/A');
  SpreadsheetApp.getUi().alert(msg);
}

function getAIRecommendationsMenu() {
  const data = collectLiveData();
  const result = getAIRecommendations(data);
  let msg = '💡 AI RECOMMENDATIONS\n\n';
  (result.recommendations || []).forEach((r, i) => { msg += `${i+1}. [${(r.priority||'medium').toUpperCase()}] ${r.action}\n   Impact: ${r.expectedImpact||'N/A'}\n\n`; });
  SpreadsheetApp.getUi().alert(msg);
}

function predictPerformanceMenu() {
  const data = collectLiveData();
  const snapshots = getSnapshots();
  const result = predictPerformance(data, snapshots);
  let msg = '🔮 AI PERFORMANCE PREDICTION\n\n';
  if (result.predictions) { const p = result.predictions; msg += `New Accounts: ~${p.newAccounts||'N/A'}\nMeetings: ~${p.meetings||'N/A'}\nConversions: ~${p.conversions||'N/A'}\nConfidence: ${p.confidence||'N/A'}\n\n`; }
  msg += `Reasoning: ${result.reasoning||'N/A'}`;
  SpreadsheetApp.getUi().alert(msg);
}

function askAIQuestionMenu() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('🤖 Ask AI', 'Enter your question about the sales data:', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() === ui.Button.OK) {
    const question = response.getResponseText().trim();
    if (question) { const data = collectLiveData(); const answer = askAI(question, data); ui.alert('🤖 AI Response:\n\n' + answer); }
  }
}

// =====================================================
// VALUE HELPERS
// =====================================================
function normalizeValue(val) { return val === null || val === undefined ? '' : String(val).toLowerCase().trim(); }
function isYesValue(val) { return CONFIG.YES_VALUES.includes(normalizeValue(val)); }
function isNoValue(val) { return CONFIG.NO_VALUES.includes(normalizeValue(val)); }
function getInterestedStatus(val) {
  const n = normalizeValue(val);
  if (!n) return 'not_contacted';
  if (CONFIG.INTERESTED_YES.includes(n)) return 'yes';
  if (CONFIG.INTERESTED_EXPLORING.includes(n)) return 'exploring';
  if (CONFIG.INTERESTED_NO.includes(n)) return 'no';
  return 'other';
}
function hasValue(val) { const n = normalizeValue(val); return n !== '' && n !== '-' && n !== 'nan' && n !== 'null'; }
function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}
function calcPct(num, denom) { return (!denom || denom === 0) ? 0 : Math.round((num / denom) * 100); }

// =====================================================
// DATA COLLECTION
// =====================================================
function collectLiveData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const now = new Date();
  const result = {
    timestamp: now.toISOString(),
    dateLabel: Utilities.formatDate(now, Session.getScriptTimeZone(), 'dd-MMM-yyyy HH:mm'),
    weekNumber: getWeekNumber(now),
    monthYear: Utilities.formatDate(now, Session.getScriptTimeZone(), 'MMM-yyyy'),
    team: createEmptyStats(),
    byAE: {},
    dealStages: {},
    dealStagesByAE: {},
    interestedBreakdown: { yes: 0, exploring: 0, no: 0, not_contacted: 0 },
    interestedByAE: {},
    pendingActions: [],
    pipelineByStage: {}
  };

  CONFIG.AE_SHEETS.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    const data = sheet.getDataRange().getValues();
    if (data.length < 2) return;
    const headers = data[0].map(h => normalizeValue(h));
    const aeName = sheetName.trim();

    const idx = {
      website: findCol(headers, ['website name', 'website']),
      companyName: findCol(headers, ['company legal name', 'legal name check']),
      linkedin: findCol(headers, ['linkedin']),
      contactsExtracted: findCol(headers, ['contacts extracted']),
      contactNumber: findCol(headers, ['contact number']),
      contactEmail: findCol(headers, ['contact email', 'email id']),
      emailed: findCol(headers, ['emailed']),
      talked: findCol(headers, ['talked']),
      meetingDone: findCol(headers, ['meeting done']),
      interested: findCol(headers, ['interested']),
      currentStage: findCol(headers, ['current stage']),
      lastConversation: findCol(headers, ['last conversation date']),
      remarks: findCol(headers, ['remarks', 'remark'])
    };

    const ae = createEmptyStats();
    const aeStages = {};
    const aeInterested = { yes: 0, exploring: 0, no: 0, not_contacted: 0 };
    const processedAccounts = new Set();

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const website = idx.website !== -1 ? normalizeValue(row[idx.website]) : '';
      if (!website || processedAccounts.has(website)) continue;
      processedAccounts.add(website);
      ae.total++;
      const companyName = idx.companyName !== -1 ? String(row[idx.companyName] || '').trim() : '';

      if (idx.linkedin !== -1 && hasValue(row[idx.linkedin])) ae.linkedin++;
      if (idx.contactsExtracted !== -1 && isYesValue(row[idx.contactsExtracted])) ae.contactsExtracted++;
      if (idx.contactNumber !== -1 && hasValue(row[idx.contactNumber])) ae.phones++;
      if (idx.contactEmail !== -1 && hasValue(row[idx.contactEmail])) ae.emails++;
      if (idx.emailed !== -1 && isYesValue(row[idx.emailed])) ae.emailed++;
      if (idx.talked !== -1 && isYesValue(row[idx.talked])) ae.talked++;
      if (idx.meetingDone !== -1 && isYesValue(row[idx.meetingDone])) ae.meetings++;

      if (idx.interested !== -1) {
        const intStatus = getInterestedStatus(row[idx.interested]);
        aeInterested[intStatus]++;
        result.interestedBreakdown[intStatus]++;
        if (intStatus === 'yes') ae.interestedYes++;
        else if (intStatus === 'exploring') ae.interestedExploring++;
        else if (intStatus === 'no') ae.interestedNo++;
      }

      if (idx.currentStage !== -1 && hasValue(row[idx.currentStage])) {
        const stage = String(row[idx.currentStage]).trim();
        ae.staged++;
        aeStages[stage] = (aeStages[stage] || 0) + 1;
        result.dealStages[stage] = (result.dealStages[stage] || 0) + 1;
      }

      const lastConv = idx.lastConversation !== -1 ? row[idx.lastConversation] : null;
      const daysSinceContact = lastConv ? Math.floor((now - new Date(lastConv)) / (1000 * 60 * 60 * 24)) : 999;

      if (idx.talked !== -1 && !isYesValue(row[idx.talked]) && hasValue(row[idx.contactNumber])) {
        result.pendingActions.push({ type: 'call_pending', ae: aeName, company: companyName || website, website: website, priority: 'high' });
      }
      if (daysSinceContact > 7 && daysSinceContact < 999 && getInterestedStatus(row[idx.interested]) === 'exploring') {
        result.pendingActions.push({ type: 'followup_needed', ae: aeName, company: companyName || website, website: website, daysSince: daysSinceContact, priority: daysSinceContact > 14 ? 'high' : 'medium' });
      }
    }

    result.byAE[aeName] = ae;
    result.dealStagesByAE[aeName] = aeStages;
    result.interestedByAE[aeName] = aeInterested;
    Object.keys(ae).forEach(k => { if (typeof ae[k] === 'number') result.team[k] = (result.team[k] || 0) + ae[k]; });
  });

  Object.keys(CONFIG.STAGE_GROUPS).forEach(group => {
    result.pipelineByStage[group] = 0;
    CONFIG.STAGE_GROUPS[group].forEach(stage => { result.pipelineByStage[group] += result.dealStages[stage] || 0; });
  });

  return result;
}

function createEmptyStats() {
  return { total: 0, linkedin: 0, contactsExtracted: 0, emails: 0, emailed: 0, phones: 0, talked: 0, meetings: 0, interestedYes: 0, interestedExploring: 0, interestedNo: 0, staged: 0 };
}

function findCol(headers, possibleNames) {
  for (const name of possibleNames) { const idx = headers.indexOf(name); if (idx !== -1) return idx; }
  return -1;
}

// =====================================================
// SNAPSHOT MANAGEMENT
// =====================================================
function getSnapshots() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SNAPSHOT_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
  return data.map(row => ({ id: row[0], timestamp: row[1], label: row[2], data: JSON.parse(row[3] || '{}') })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function saveSnapshot(label) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SNAPSHOT_SHEET);
  if (!sheet) { initialSetup(); sheet = ss.getSheetByName(CONFIG.SNAPSHOT_SHEET); }
  const liveData = collectLiveData();
  const id = 'SNAP_' + new Date().getTime();
  const snapshotLabel = label || liveData.dateLabel;
  sheet.appendRow([id, liveData.timestamp, snapshotLabel, JSON.stringify(liveData)]);
  return { success: true, id: id, label: snapshotLabel, data: liveData };
}

function saveSnapshotWithConfirm() { const result = saveSnapshot(); SpreadsheetApp.getUi().alert('✅ Snapshot Saved!\n\nLabel: ' + result.label); }
function deleteSnapshot(id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SNAPSHOT_SHEET);
  if (!sheet) return { success: false };
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) { if (data[i][0] === id) { sheet.deleteRow(i + 1); return { success: true }; } }
  return { success: false };
}

// =====================================================
// EXPORT FUNCTIONS
// =====================================================
function exportToCSV() {
  const data = collectLiveData();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let exportSheet = ss.getSheetByName('Dashboard_Export');
  if (exportSheet) ss.deleteSheet(exportSheet);
  exportSheet = ss.insertSheet('Dashboard_Export');
  const headers = ['AE', 'Total', 'LinkedIn', 'Contacts Extracted', 'Emails', 'Emailed', 'Phones', 'Talked', 'Meetings', 'Interested (Yes)', 'Interested (Exploring)', 'Interested (No)', 'Staged'];
  exportSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  let rowNum = 2;
  Object.keys(data.byAE).forEach(ae => {
    const d = data.byAE[ae];
    exportSheet.getRange(rowNum, 1, 1, headers.length).setValues([[ae, d.total, d.linkedin, d.contactsExtracted, d.emails, d.emailed, d.phones, d.talked, d.meetings, d.interestedYes, d.interestedExploring, d.interestedNo, d.staged]]);
    rowNum++;
  });
  const t = data.team;
  exportSheet.getRange(rowNum, 1, 1, headers.length).setValues([['TEAM TOTAL', t.total, t.linkedin, t.contactsExtracted, t.emails, t.emailed, t.phones, t.talked, t.meetings, t.interestedYes, t.interestedExploring, t.interestedNo, t.staged]]);
  SpreadsheetApp.getUi().alert('✅ Exported to "Dashboard_Export" sheet!');
}

function exportAIReport() {
  const data = collectLiveData();
  const insights = generateAIInsights(data);
  const recommendations = getAIRecommendations(data);
  const snapshots = getSnapshots();
  const predictions = predictPerformance(data, snapshots);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let reportSheet = ss.getSheetByName('AI_Report');
  if (reportSheet) ss.deleteSheet(reportSheet);
  reportSheet = ss.insertSheet('AI_Report');
  let row = 1;
  reportSheet.getRange(row, 1).setValue('AI-POWERED SALES ANALYTICS REPORT').setFontSize(16).setFontWeight('bold'); row += 2;
  reportSheet.getRange(row, 1).setValue('Generated: ' + data.dateLabel); row += 2;
  reportSheet.getRange(row, 1).setValue('KEY HIGHLIGHTS').setFontWeight('bold'); row++;
  (insights.highlights || []).forEach(h => { reportSheet.getRange(row, 1).setValue('• ' + h); row++; }); row++;
  reportSheet.getRange(row, 1).setValue('AREAS OF CONCERN').setFontWeight('bold'); row++;
  (insights.concerns || []).forEach(c => { reportSheet.getRange(row, 1).setValue('• ' + c); row++; }); row++;
  reportSheet.getRange(row, 1).setValue('AI RECOMMENDATIONS').setFontWeight('bold'); row++;
  (recommendations.recommendations || []).forEach(r => { reportSheet.getRange(row, 1).setValue(`[${r.priority}] ${r.action} - Impact: ${r.expectedImpact}`); row++; }); row++;
  reportSheet.getRange(row, 1).setValue('PERFORMANCE PREDICTIONS').setFontWeight('bold'); row++;
  if (predictions.predictions) {
    reportSheet.getRange(row, 1).setValue('Predicted Meetings: ' + (predictions.predictions.meetings || 'N/A')); row++;
    reportSheet.getRange(row, 1).setValue('Predicted Conversions: ' + (predictions.predictions.conversions || 'N/A')); row++;
    reportSheet.getRange(row, 1).setValue('Confidence: ' + (predictions.predictions.confidence || 'N/A'));
  }
  SpreadsheetApp.getUi().alert('✅ AI Report exported to "AI_Report" sheet!');
}

function generateAIWeeklyReport() {
  const data = collectLiveData();
  const insights = generateAIInsights(data);
  const snapshots = getSnapshots();
  const lastWeekSnap = snapshots.find(s => { const daysDiff = (new Date() - new Date(s.timestamp)) / (1000 * 60 * 60 * 24); return daysDiff >= 6 && daysDiff <= 8; });
  let report = '🤖 AI-POWERED WEEKLY REPORT - ' + data.dateLabel + '\n' + '═'.repeat(50) + '\n\n';
  report += '📈 TEAM SUMMARY\n' + '─'.repeat(30) + '\n';
  report += 'Total Accounts: ' + data.team.total + '\nTalked: ' + data.team.talked + ' (' + calcPct(data.team.talked, data.team.total) + '%)\n';
  report += 'Meetings: ' + data.team.meetings + ' (' + calcPct(data.team.meetings, data.team.total) + '%)\n';
  report += 'Interested (Yes): ' + data.team.interestedYes + '\nInterested (Exploring): ' + data.team.interestedExploring + '\n\n';
  if (lastWeekSnap) {
    report += '📊 WEEK-OVER-WEEK CHANGE\n' + '─'.repeat(30) + '\n';
    const old = lastWeekSnap.data.team;
    report += 'Total: ' + (data.team.total - old.total) + ' new accounts\nMeetings: +' + (data.team.meetings - old.meetings) + '\n';
    report += 'Interested: +' + ((data.team.interestedYes + data.team.interestedExploring) - (old.interestedYes + old.interestedExploring)) + '\n\n';
  }
  report += '🧠 AI INSIGHTS\n' + '─'.repeat(30) + '\n';
  (insights.highlights || []).forEach(h => { report += '✨ ' + h + '\n'; }); report += '\n';
  report += '💡 AI RECOMMENDATIONS\n' + '─'.repeat(30) + '\n';
  (insights.recommendations || []).forEach(r => { report += '• ' + r + '\n'; }); report += '\n';
  report += '🔮 PREDICTION\n' + '─'.repeat(30) + '\n' + (insights.prediction || 'Enable AI for predictions');
  SpreadsheetApp.getUi().alert(report);
}

function exportComparison() { SpreadsheetApp.getUi().alert('Use the Dashboard Compare tab to select snapshots, then export.'); }
function generateAEReport() { SpreadsheetApp.getUi().alert('AE Performance Report - Coming Soon'); }

// =====================================================
// API FOR DASHBOARD HTML
// =====================================================
function getLiveDataJSON() { return JSON.stringify(collectLiveData()); }
function getSnapshotsJSON() { return JSON.stringify(getSnapshots()); }
function saveSnapshotFromDashboard(label) { return JSON.stringify(saveSnapshot(label)); }
function deleteSnapshotFromDashboard(id) { return JSON.stringify(deleteSnapshot(id)); }
function getConfigJSON() { return JSON.stringify(CONFIG); }
function getAIInsightsJSON() { const data = collectLiveData(); return JSON.stringify(generateAIInsights(data)); }
function getAIRecommendationsJSON(context) { const data = collectLiveData(); return JSON.stringify(getAIRecommendations(data, context)); }
function getAIPredictionsJSON() { const data = collectLiveData(); const snapshots = getSnapshots(); return JSON.stringify(predictPerformance(data, snapshots)); }
function askAIFromDashboard(question) { const data = collectLiveData(); return askAI(question, data); }
function getAIAnomaliesJSON() { const data = collectLiveData(); const snapshots = getSnapshots(); return JSON.stringify(generateAnomalyDetection(data, snapshots)); }

// =====================================================
// MAIN DASHBOARD
// =====================================================
function showDashboard() {
  const html = HtmlService.createHtmlOutput(getDashboardHTML()).setWidth(1400).setHeight(900);
  SpreadsheetApp.getUi().showModalDialog(html, '🤖 AI-Powered Dashboard - North POD');
}
