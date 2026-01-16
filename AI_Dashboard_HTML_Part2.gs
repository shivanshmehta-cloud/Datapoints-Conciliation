// =====================================================
// AI DASHBOARD HTML - PART 2 (JavaScript Logic)
// =====================================================
// Continue from Part 1 - add this to the getDashboardHTML() function

// Add this script section after the HTML body elements:

/*
  <script>
    // Global Variables
    var liveData = null;
    var snapshots = [];
    var aiInsights = null;
    var aiPredictions = null;
    var charts = {};
    var selectedAEs = 'all';

    // Initialize on DOM Load
    document.addEventListener('DOMContentLoaded', function() {
      refreshData();
      loadAIInsights();
    });

    // =====================================================
    // DATA LOADING FUNCTIONS
    // =====================================================
    function refreshData() {
      google.script.run.withSuccessHandler(function(data) {
        liveData = JSON.parse(data);
        renderAll();
        document.getElementById('lastUpdated').textContent = 'Updated: ' + liveData.dateLabel;
      }).getLiveDataJSON();

      google.script.run.withSuccessHandler(function(data) {
        snapshots = JSON.parse(data);
        renderSnapshots();
        renderCompare();
      }).getSnapshotsJSON();
    }

    function loadAIInsights() {
      google.script.run.withSuccessHandler(function(data) {
        aiInsights = JSON.parse(data);
        renderAIInsights();
      }).getAIInsightsJSON();

      google.script.run.withSuccessHandler(function(data) {
        aiPredictions = JSON.parse(data);
        renderAIPredictions();
      }).getAIPredictionsJSON();
    }

    function refreshAIInsights() {
      document.getElementById('aiHighlights').innerHTML = '<li class="ai-pulse">Analyzing data...</li>';
      document.getElementById('aiConcerns').innerHTML = '<li class="ai-pulse">Detecting issues...</li>';
      document.getElementById('aiRecommendations').innerHTML = '<li class="ai-pulse">Generating recommendations...</li>';
      document.getElementById('aiPrediction').innerHTML = '<li class="ai-pulse">Forecasting...</li>';
      loadAIInsights();
    }

    // =====================================================
    // AI RENDERING FUNCTIONS
    // =====================================================
    function renderAIInsights() {
      if (!aiInsights) return;

      var highlightsHtml = (aiInsights.highlights || []).map(function(h) {
        return '<li>' + h + '</li>';
      }).join('') || '<li>No highlights available</li>';

      var concernsHtml = (aiInsights.concerns || []).map(function(c) {
        return '<li style="color:#ff6b6b">' + c + '</li>';
      }).join('') || '<li style="color:#00ff88">No concerns detected</li>';

      var recsHtml = (aiInsights.recommendations || []).map(function(r) {
        return '<li>' + r + '</li>';
      }).join('') || '<li>No recommendations</li>';

      var predHtml = '<li>' + (aiInsights.prediction || 'Prediction unavailable') + '</li>';

      document.getElementById('aiHighlights').innerHTML = highlightsHtml;
      document.getElementById('aiConcerns').innerHTML = concernsHtml;
      document.getElementById('aiRecommendations').innerHTML = recsHtml;
      document.getElementById('aiPrediction').innerHTML = predHtml;
    }

    function renderAIPredictions() {
      // Predictions will be rendered in AI Analytics tab
      if (document.getElementById('tab-ai-analytics').classList.contains('active')) {
        renderAIAnalytics();
      }
    }

    function askAIQuestion() {
      var question = document.getElementById('aiQuestion').value.trim();
      if (!question) return;

      var responseDiv = document.getElementById('aiResponse');
      responseDiv.innerHTML = '<span class="ai-pulse">AI is thinking...</span>';
      responseDiv.classList.add('visible');

      google.script.run.withSuccessHandler(function(answer) {
        responseDiv.innerHTML = '<strong>AI Response:</strong><br>' + answer.replace(/\\n/g, '<br>');
      }).withFailureHandler(function(err) {
        responseDiv.innerHTML = '<span style="color:#ff4757">Error: ' + err + '</span>';
      }).askAIFromDashboard(question);

      document.getElementById('aiQuestion').value = '';
    }

    // =====================================================
    // AE FILTER FUNCTIONS
    // =====================================================
    function applyAEFilter() {
      selectedAEs = document.getElementById('aeFilter').value;
      var label = selectedAEs === 'all' ? 'All AEs (Team View)' : selectedAEs.split(',').join(' + ');
      document.getElementById('filterInfo').textContent = 'Showing: ' + label;
      renderAll();
    }

    function getFilteredData() {
      if (selectedAEs === 'all') {
        return {
          team: liveData.team,
          byAE: liveData.byAE,
          dealStages: liveData.dealStages,
          dealStagesByAE: liveData.dealStagesByAE,
          interestedBreakdown: liveData.interestedBreakdown,
          interestedByAE: liveData.interestedByAE,
          pipelineByStage: liveData.pipelineByStage,
          pendingActions: liveData.pendingActions
        };
      }

      var aeList = selectedAEs.split(',');
      var filtered = {
        team: { total: 0, linkedin: 0, contactsExtracted: 0, emails: 0, emailed: 0, phones: 0, talked: 0, meetings: 0, interestedYes: 0, interestedExploring: 0, interestedNo: 0, staged: 0 },
        byAE: {},
        dealStages: {},
        dealStagesByAE: {},
        interestedBreakdown: { yes: 0, exploring: 0, no: 0, not_contacted: 0 },
        interestedByAE: {},
        pipelineByStage: { 'Top of Funnel': 0, 'Mid Funnel': 0, 'Bottom Funnel': 0, 'Closed': 0 },
        pendingActions: []
      };

      var stageGroups = {
        'Top of Funnel': ['Early Lead', 'Contacted'],
        'Mid Funnel': ['Appointment Scheduled', 'Qualified to Buy', 'Scoping'],
        'Bottom Funnel': ['Scope/ PoC Sign-Off', 'Proposal', 'Negotiation', 'Commit', 'Integrating'],
        'Closed': ['Closed Active', 'Closed Lost']
      };

      aeList.forEach(function(ae) {
        var aeData = liveData.byAE[ae];
        if (!aeData) return;

        filtered.byAE[ae] = aeData;
        filtered.dealStagesByAE[ae] = liveData.dealStagesByAE[ae];
        filtered.interestedByAE[ae] = liveData.interestedByAE[ae];

        Object.keys(aeData).forEach(function(k) {
          if (typeof aeData[k] === 'number') {
            filtered.team[k] = (filtered.team[k] || 0) + aeData[k];
          }
        });

        var aeStages = liveData.dealStagesByAE[ae] || {};
        Object.keys(aeStages).forEach(function(stage) {
          filtered.dealStages[stage] = (filtered.dealStages[stage] || 0) + aeStages[stage];
        });

        var aeInt = liveData.interestedByAE[ae] || {};
        Object.keys(aeInt).forEach(function(k) {
          filtered.interestedBreakdown[k] = (filtered.interestedBreakdown[k] || 0) + aeInt[k];
        });
      });

      Object.keys(stageGroups).forEach(function(group) {
        stageGroups[group].forEach(function(stage) {
          filtered.pipelineByStage[group] += filtered.dealStages[stage] || 0;
        });
      });

      filtered.pendingActions = liveData.pendingActions.filter(function(a) {
        return aeList.indexOf(a.ae) !== -1;
      });

      return filtered;
    }

    // =====================================================
    // MAIN RENDER FUNCTIONS
    // =====================================================
    function renderAll() {
      renderSummaryCards();
      renderInterestedCards();
      renderOverview();
      renderRatios();
      renderPipeline();
      renderAIAnalytics();
      renderActions();
    }

    function switchTab(tabId) {
      document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
      event.target.classList.add('active');
      document.getElementById('tab-' + tabId).classList.add('active');
    }

    function renderSummaryCards() {
      var data = getFilteredData();
      var t = data.team;
      var prev = snapshots[0] ? snapshots[0].data.team : null;

      var cards = [
        { label: 'Total Accounts', value: t.total, key: 'total', color: '#00d4ff' },
        { label: 'Talked', value: t.talked, key: 'talked', color: '#7b2cbf' },
        { label: 'Meetings', value: t.meetings, key: 'meetings', color: '#00ff88' },
        { label: 'Interested (Yes)', value: t.interestedYes, key: 'interestedYes', color: '#00ff88' },
        { label: 'Exploring', value: t.interestedExploring, key: 'interestedExploring', color: '#ffc107' },
        { label: 'Deal Staged', value: t.staged, key: 'staged', color: '#ff6b6b' }
      ];

      var html = '';
      cards.forEach(function(c) {
        var delta = (prev && selectedAEs === 'all') ? (c.value - (prev[c.key] || 0)) : null;
        var deltaClass = delta !== null ? (delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral') : 'neutral';
        var deltaText = delta !== null ? (delta >= 0 ? '+' + delta : delta) + ' vs last' : '—';

        html += '<div class="summary-card" style="--accent-color: ' + c.color + '">';
        html += '<div class="ai-indicator"></div>';
        html += '<div class="label">' + c.label + '</div>';
        html += '<div class="value" style="color: ' + c.color + '">' + c.value + '</div>';
        html += '<div class="delta ' + deltaClass + '">' + deltaText + '</div>';
        html += '</div>';
      });

      document.getElementById('summaryCards').innerHTML = html;
    }

    function renderInterestedCards() {
      var data = getFilteredData();
      var i = data.interestedBreakdown;
      var total = i.yes + i.exploring + i.no + i.not_contacted;

      var items = [
        { label: 'Interested (Yes)', value: i.yes, color: '#00ff88' },
        { label: 'Still Exploring', value: i.exploring, color: '#ffc107' },
        { label: 'Not Interested', value: i.no, color: '#ff4757' },
        { label: 'Not Yet Contacted', value: i.not_contacted, color: '#888' }
      ];

      var html = '';
      items.forEach(function(item) {
        var pct = total > 0 ? Math.round(item.value / total * 100) : 0;
        html += '<div class="mini-card">';
        html += '<div class="mini-label">' + item.label + '</div>';
        html += '<div class="mini-value" style="color: ' + item.color + '">' + item.value + '</div>';
        html += '<div class="mini-label">' + pct + '%</div>';
        html += '</div>';
      });

      document.getElementById('interestedCards').innerHTML = html;
    }

    // =====================================================
    // OVERVIEW TAB
    // =====================================================
    function renderOverview() {
      var data = getFilteredData();
      var aeNames = Object.keys(data.byAE);

      var html = '<div class="scroll-container"><table class="data-table"><thead><tr>';
      html += '<th>AE</th><th>Total</th><th>LinkedIn</th><th>Phones</th><th>Talked</th><th>Meetings</th>';
      html += '<th style="color:#00ff88">Yes</th><th style="color:#ffc107">Exploring</th><th style="color:#ff4757">No</th><th>Staged</th>';
      html += '</tr></thead><tbody>';

      aeNames.forEach(function(ae) {
        var d = data.byAE[ae];
        var intData = data.interestedByAE[ae] || { yes: 0, exploring: 0, no: 0 };
        html += '<tr>';
        html += '<td><strong>' + ae + '</strong></td>';
        html += '<td>' + d.total + '</td>';
        html += '<td>' + d.linkedin + '</td>';
        html += '<td>' + d.phones + '</td>';
        html += '<td>' + d.talked + '</td>';
        html += '<td>' + d.meetings + '</td>';
        html += '<td style="color:#00ff88;font-weight:600">' + intData.yes + '</td>';
        html += '<td style="color:#ffc107;font-weight:600">' + intData.exploring + '</td>';
        html += '<td style="color:#ff4757;font-weight:600">' + intData.no + '</td>';
        html += '<td>' + d.staged + '</td>';
        html += '</tr>';
      });

      if (aeNames.length > 1) {
        var t = data.team;
        var totalInt = data.interestedBreakdown;
        html += '<tr class="total-row">';
        html += '<td>TOTAL</td>';
        html += '<td>' + t.total + '</td>';
        html += '<td>' + t.linkedin + '</td>';
        html += '<td>' + t.phones + '</td>';
        html += '<td>' + t.talked + '</td>';
        html += '<td>' + t.meetings + '</td>';
        html += '<td style="color:#00ff88;font-weight:600">' + totalInt.yes + '</td>';
        html += '<td style="color:#ffc107;font-weight:600">' + totalInt.exploring + '</td>';
        html += '<td style="color:#ff4757;font-weight:600">' + totalInt.no + '</td>';
        html += '<td>' + t.staged + '</td>';
        html += '</tr>';
      }

      html += '</tbody></table></div>';

      html += '<div class="charts-grid">';
      html += '<div class="chart-box"><h3>Funnel by AE</h3><canvas id="chartFunnel"></canvas></div>';
      html += '<div class="chart-box"><h3>Interested Breakdown</h3><canvas id="chartInterested"></canvas></div>';
      html += '</div>';

      document.getElementById('tab-overview').innerHTML = html;

      setTimeout(function() {
        renderFunnelChart();
        renderInterestedChart();
      }, 100);
    }

    // =====================================================
    // AI ANALYTICS TAB
    // =====================================================
    function renderAIAnalytics() {
      var data = getFilteredData();
      var t = data.team;

      var html = '';

      // AI Predictions Section
      html += '<div class="ai-predictions-card">';
      html += '<div class="ai-header">';
      html += '<div class="ai-title"><span>AI Performance Predictions</span><span class="ai-badge" style="font-size:9px">FORECAST</span></div>';
      html += '</div>';
      html += '<div class="prediction-grid" id="predictionGrid">';

      if (aiPredictions && aiPredictions.predictions) {
        var p = aiPredictions.predictions;
        html += '<div class="prediction-item"><div class="pred-label">Predicted New Accounts</div><div class="pred-value">' + (p.newAccounts || '~' + Math.round(t.total * 0.1)) + '</div><div class="pred-change positive">Next Week</div></div>';
        html += '<div class="prediction-item"><div class="pred-label">Predicted Meetings</div><div class="pred-value">' + (p.meetings || '~' + Math.round(t.meetings * 1.1)) + '</div><div class="pred-change positive">+10% expected</div></div>';
        html += '<div class="prediction-item"><div class="pred-label">Predicted Conversions</div><div class="pred-value">' + (p.conversions || '~' + Math.round(t.interestedYes * 1.05)) + '</div><div class="pred-change positive">Based on trend</div></div>';
        html += '<div class="prediction-item"><div class="pred-label">Confidence Level</div><div class="pred-value">' + (p.confidence || 'Medium').toUpperCase() + '</div><div class="pred-change neutral">AI Confidence</div></div>';
      } else {
        html += '<div class="prediction-item"><div class="pred-label">New Accounts</div><div class="pred-value">~' + Math.round(t.total * 0.1) + '</div><div class="pred-change">Projected</div></div>';
        html += '<div class="prediction-item"><div class="pred-label">Meetings</div><div class="pred-value">~' + Math.round(t.meetings * 1.1) + '</div><div class="pred-change">Projected</div></div>';
        html += '<div class="prediction-item"><div class="pred-label">Conversions</div><div class="pred-value">~' + Math.round(t.interestedYes * 1.05) + '</div><div class="pred-change">Projected</div></div>';
        html += '<div class="prediction-item"><div class="pred-label">Confidence</div><div class="pred-value">LOW</div><div class="pred-change neutral">Enable AI</div></div>';
      }

      html += '</div></div>';

      // Charts Grid
      html += '<div class="charts-grid-3">';

      // Conversion Funnel Chart
      html += '<div class="chart-box ai-chart"><h3>AI Conversion Funnel Analysis</h3><canvas id="chartAIFunnel"></canvas></div>';

      // Performance Trend Chart
      html += '<div class="chart-box ai-chart"><h3>Performance Trend (AI Enhanced)</h3><canvas id="chartTrend"></canvas></div>';

      // Efficiency Radar Chart
      html += '<div class="chart-box ai-chart"><h3>AE Efficiency Radar</h3><canvas id="chartRadar"></canvas></div>';

      html += '</div>';

      // Second row of charts
      html += '<div class="charts-grid" style="margin-top:12px">';

      // Stage Distribution
      html += '<div class="chart-box ai-chart"><h3>Pipeline Stage Distribution</h3><canvas id="chartStageDistribution"></canvas></div>';

      // Conversion Rates
      html += '<div class="chart-box ai-chart"><h3>Key Conversion Metrics</h3><canvas id="chartConversionMetrics"></canvas></div>';

      html += '</div>';

      document.getElementById('tab-ai-analytics').innerHTML = html;

      setTimeout(function() {
        renderAIFunnelChart();
        renderTrendChart();
        renderRadarChart();
        renderStageDistributionChart();
        renderConversionMetricsChart();
      }, 100);
    }

    // =====================================================
    // CHART RENDERING FUNCTIONS
    // =====================================================
    function calcPct(num, denom) {
      if (!denom || denom === 0) return 0;
      return Math.round((num / denom) * 100);
    }

    function getRatioClass(pct) {
      if (pct >= 50) return 'high';
      if (pct >= 25) return 'medium';
      return 'low';
    }

    function renderFunnelChart() {
      var ctx = document.getElementById('chartFunnel');
      if (!ctx) return;

      var data = getFilteredData();
      var aeNames = Object.keys(data.byAE);

      if (charts.funnel) charts.funnel.destroy();

      charts.funnel = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: aeNames,
          datasets: [
            { label: 'Total', data: aeNames.map(function(ae) { return data.byAE[ae].total; }), backgroundColor: '#00d4ff' },
            { label: 'Talked', data: aeNames.map(function(ae) { return data.byAE[ae].talked; }), backgroundColor: '#7b2cbf' },
            { label: 'Meetings', data: aeNames.map(function(ae) { return data.byAE[ae].meetings; }), backgroundColor: '#00ff88' }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#fff' } } },
          scales: {
            x: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }

    function renderInterestedChart() {
      var ctx = document.getElementById('chartInterested');
      if (!ctx) return;

      var data = getFilteredData();
      var i = data.interestedBreakdown;

      if (charts.interested) charts.interested.destroy();

      charts.interested = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Yes', 'Exploring', 'No', 'Not Contacted'],
          datasets: [{
            data: [i.yes, i.exploring, i.no, i.not_contacted],
            backgroundColor: ['#00ff88', '#ffc107', '#ff4757', '#555']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'right', labels: { color: '#fff' } }
          }
        }
      });
    }

    function renderAIFunnelChart() {
      var ctx = document.getElementById('chartAIFunnel');
      if (!ctx) return;

      var data = getFilteredData();
      var t = data.team;

      var stages = ['Total', 'LinkedIn', 'Phones', 'Talked', 'Meetings', 'Interested'];
      var values = [t.total, t.linkedin, t.phones, t.talked, t.meetings, t.interestedYes];
      var colors = ['#00d4ff', '#5c6bc0', '#7b2cbf', '#9c27b0', '#00ff88', '#ffc107'];

      if (charts.aiFunnel) charts.aiFunnel.destroy();

      charts.aiFunnel = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: stages,
          datasets: [{
            data: values,
            backgroundColor: colors,
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'end',
              color: '#fff',
              font: { weight: 'bold' }
            }
          },
          scales: {
            x: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }

    function renderTrendChart() {
      var ctx = document.getElementById('chartTrend');
      if (!ctx) return;

      // Use snapshots for trend data
      var trendData = [];
      var labels = [];

      if (snapshots.length > 0) {
        var recentSnapshots = snapshots.slice(0, 7).reverse();
        recentSnapshots.forEach(function(s) {
          labels.push(s.label.split(' ')[0]);
          trendData.push({
            meetings: s.data.team.meetings,
            interested: s.data.team.interestedYes
          });
        });
      }

      // Add current data
      labels.push('Now');
      trendData.push({
        meetings: liveData.team.meetings,
        interested: liveData.team.interestedYes
      });

      if (charts.trend) charts.trend.destroy();

      charts.trend = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Meetings',
              data: trendData.map(function(d) { return d.meetings; }),
              borderColor: '#00ff88',
              backgroundColor: 'rgba(0,255,136,0.1)',
              fill: true,
              tension: 0.3
            },
            {
              label: 'Interested',
              data: trendData.map(function(d) { return d.interested; }),
              borderColor: '#7b2cbf',
              backgroundColor: 'rgba(123,44,191,0.1)',
              fill: true,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#fff' } } },
          scales: {
            x: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }

    function renderRadarChart() {
      var ctx = document.getElementById('chartRadar');
      if (!ctx) return;

      var data = getFilteredData();
      var aeNames = Object.keys(data.byAE);

      var datasets = aeNames.map(function(ae, idx) {
        var d = data.byAE[ae];
        var colors = ['rgba(0,212,255,0.5)', 'rgba(123,44,191,0.5)', 'rgba(0,255,136,0.5)'];
        var borderColors = ['#00d4ff', '#7b2cbf', '#00ff88'];

        return {
          label: ae,
          data: [
            calcPct(d.linkedin, d.total),
            calcPct(d.phones, d.total),
            calcPct(d.talked, d.phones || 1),
            calcPct(d.meetings, d.talked || 1),
            calcPct(d.interestedYes, d.meetings || 1)
          ],
          backgroundColor: colors[idx % 3],
          borderColor: borderColors[idx % 3],
          borderWidth: 2
        };
      });

      if (charts.radar) charts.radar.destroy();

      charts.radar = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['LinkedIn %', 'Phone %', 'Talk Rate', 'Meeting Rate', 'Interest Rate'],
          datasets: datasets
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#fff' } } },
          scales: {
            r: {
              ticks: { color: '#888', backdropColor: 'transparent' },
              grid: { color: 'rgba(255,255,255,0.1)' },
              pointLabels: { color: '#fff' },
              max: 100
            }
          }
        }
      });
    }

    function renderStageDistributionChart() {
      var ctx = document.getElementById('chartStageDistribution');
      if (!ctx) return;

      var data = getFilteredData();
      var stageOrder = ['Early Lead', 'Contacted', 'Appointment Scheduled', 'Qualified to Buy', 'Scoping', 'Scope/ PoC Sign-Off', 'Proposal', 'Negotiation', 'Commit', 'Integrating', 'Closed Active', 'Closed Lost'];
      var stageColors = ['#64b5f6', '#4fc3f7', '#4dd0e1', '#4db6ac', '#81c784', '#aed581', '#dce775', '#fff176', '#ffb74d', '#ff8a65', '#00ff88', '#ff4757'];

      var values = stageOrder.map(function(stage) { return data.dealStages[stage] || 0; });
      var labels = stageOrder.map(function(s) { return s.length > 10 ? s.substring(0,8) + '..' : s; });

      if (charts.stageDistribution) charts.stageDistribution.destroy();

      charts.stageDistribution = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: stageColors.map(function(c) { return c + '80'; }),
            borderColor: stageColors
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'right', labels: { color: '#fff', font: { size: 10 } } }
          },
          scales: {
            r: {
              ticks: { color: '#888', backdropColor: 'transparent' },
              grid: { color: 'rgba(255,255,255,0.1)' }
            }
          }
        }
      });
    }

    function renderConversionMetricsChart() {
      var ctx = document.getElementById('chartConversionMetrics');
      if (!ctx) return;

      var data = getFilteredData();
      var t = data.team;

      var metrics = [
        { label: 'LinkedIn Rate', value: calcPct(t.linkedin, t.total) },
        { label: 'Phone Rate', value: calcPct(t.phones, t.total) },
        { label: 'Talk Rate', value: calcPct(t.talked, t.phones || 1) },
        { label: 'Meeting Rate', value: calcPct(t.meetings, t.talked || 1) },
        { label: 'Interest Rate', value: calcPct(t.interestedYes, t.meetings || 1) },
        { label: 'Stage Rate', value: calcPct(t.staged, t.total) }
      ];

      if (charts.conversionMetrics) charts.conversionMetrics.destroy();

      charts.conversionMetrics = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: metrics.map(function(m) { return m.label; }),
          datasets: [{
            data: metrics.map(function(m) { return m.value; }),
            backgroundColor: metrics.map(function(m) {
              if (m.value >= 50) return '#00ff88';
              if (m.value >= 25) return '#ffc107';
              return '#ff4757';
            }),
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#888', callback: function(v) { return v + '%'; } }, grid: { color: 'rgba(255,255,255,0.05)' }, max: 100 }
          }
        }
      });
    }
*/
