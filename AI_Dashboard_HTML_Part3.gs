// =====================================================
// AI DASHBOARD HTML - PART 3 (Remaining Functions)
// =====================================================
// Continue from Part 2 - Complete the JavaScript section

/*
    // =====================================================
    // RATIOS TAB
    // =====================================================
    function renderRatios() {
      var data = getFilteredData();

      var ratios = [
        { from: 'Total', to: 'LinkedIn', fKey: 'total', tKey: 'linkedin' },
        { from: 'Total', to: 'Phones', fKey: 'total', tKey: 'phones' },
        { from: 'Total', to: 'Talked', fKey: 'total', tKey: 'talked' },
        { from: 'Total', to: 'Meetings', fKey: 'total', tKey: 'meetings' },
        { from: 'Total', to: 'Interested (Yes)', fKey: 'total', tKey: 'interestedYes' },
        { from: 'Total', to: 'Interested (All)', fKey: 'total', tKey: 'interestedAll', special: 'yesExploring' },
        { from: 'Phones', to: 'Talked', fKey: 'phones', tKey: 'talked' },
        { from: 'Phones', to: 'Meetings', fKey: 'phones', tKey: 'meetings' },
        { from: 'Talked', to: 'Meetings', fKey: 'talked', tKey: 'meetings' },
        { from: 'Talked', to: 'Interested', fKey: 'talked', tKey: 'interestedYes' },
        { from: 'Meetings', to: 'Interested', fKey: 'meetings', tKey: 'interestedYes' }
      ];

      var aeNames = Object.keys(data.byAE);

      var html = '<div class="scroll-container"><table class="data-table"><thead><tr><th>Conversion</th>';
      aeNames.forEach(function(ae) { html += '<th>' + ae + '</th>'; });
      if (aeNames.length > 1) html += '<th>TOTAL</th>';
      html += '</tr></thead><tbody>';

      ratios.forEach(function(r) {
        html += '<tr><td><strong>' + r.from + ' -> ' + r.to + '</strong></td>';
        aeNames.forEach(function(ae) {
          var d = data.byAE[ae];
          var intAE = data.interestedByAE[ae] || { yes: 0, exploring: 0 };
          var tVal = r.special === 'yesExploring' ? (intAE.yes + intAE.exploring) : d[r.tKey];
          var pct = calcPct(tVal, d[r.fKey]);
          html += '<td class="ratio ' + getRatioClass(pct) + '">' + pct + '%</td>';
        });

        if (aeNames.length > 1) {
          var t = data.team;
          var totalInt = data.interestedBreakdown;
          var tValTotal = r.special === 'yesExploring' ? (totalInt.yes + totalInt.exploring) : t[r.tKey];
          var teamPct = calcPct(tValTotal, t[r.fKey]);
          html += '<td class="ratio ' + getRatioClass(teamPct) + '"><strong>' + teamPct + '%</strong></td>';
        }
        html += '</tr>';
      });

      html += '</tbody></table></div>';

      html += '<div class="charts-grid" style="margin-top:12px">';
      html += '<div class="chart-box"><h3>Key Conversion Rates by AE</h3><canvas id="chartRatios"></canvas></div>';
      html += '<div class="chart-box"><h3>Funnel Progression</h3><canvas id="chartFunnelProgress"></canvas></div>';
      html += '</div>';

      document.getElementById('tab-ratios').innerHTML = html;

      setTimeout(function() {
        renderRatiosChart();
        renderFunnelProgressChart();
      }, 100);
    }

    function renderRatiosChart() {
      var ctx = document.getElementById('chartRatios');
      if (!ctx) return;

      var data = getFilteredData();
      var aeNames = Object.keys(data.byAE);
      var metrics = ['Talked', 'Meetings', 'Interested'];
      var colors = ['#7b2cbf', '#00ff88', '#ffc107'];

      var datasets = metrics.map(function(metric, i) {
        return {
          label: metric + ' %',
          data: aeNames.map(function(ae) {
            var d = data.byAE[ae];
            var intAE = data.interestedByAE[ae] || { yes: 0 };
            if (metric === 'Talked') return calcPct(d.talked, d.total);
            if (metric === 'Meetings') return calcPct(d.meetings, d.total);
            if (metric === 'Interested') return calcPct(intAE.yes, d.total);
            return 0;
          }),
          backgroundColor: colors[i],
          borderColor: colors[i],
          borderWidth: 2
        };
      });

      if (charts.ratios) charts.ratios.destroy();

      charts.ratios = new Chart(ctx, {
        type: 'bar',
        data: { labels: aeNames, datasets: datasets },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#fff' } } },
          scales: {
            x: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#888', callback: function(v) { return v + '%'; } }, grid: { color: 'rgba(255,255,255,0.05)' }, max: 100 }
          }
        }
      });
    }

    function renderFunnelProgressChart() {
      var ctx = document.getElementById('chartFunnelProgress');
      if (!ctx) return;

      var data = getFilteredData();
      var t = data.team;
      var totalInt = data.interestedBreakdown;

      var stages = ['Total', 'LinkedIn', 'Phones', 'Talked', 'Meetings', 'Interested'];
      var values = [t.total, t.linkedin, t.phones, t.talked, t.meetings, totalInt.yes];
      var colors = ['#00d4ff', '#5c6bc0', '#7b2cbf', '#9c27b0', '#00ff88', '#ffc107'];

      if (charts.funnelProgress) charts.funnelProgress.destroy();

      charts.funnelProgress = new Chart(ctx, {
        type: 'line',
        data: {
          labels: stages,
          datasets: [{
            label: 'Count',
            data: values,
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0,212,255,0.1)',
            fill: true,
            tension: 0.3,
            pointBackgroundColor: colors,
            pointBorderColor: colors,
            pointRadius: 6
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }

    // =====================================================
    // PIPELINE TAB
    // =====================================================
    function renderPipeline() {
      var data = getFilteredData();
      var pipeline = data.pipelineByStage;
      var stageOrder = ['Early Lead', 'Contacted', 'Appointment Scheduled', 'Qualified to Buy', 'Scoping', 'Scope/ PoC Sign-Off', 'Proposal', 'Negotiation', 'Commit', 'Integrating', 'Closed Active', 'Closed Lost'];
      var stageColors = {
        'Early Lead': '#64b5f6', 'Contacted': '#4fc3f7', 'Appointment Scheduled': '#4dd0e1',
        'Qualified to Buy': '#4db6ac', 'Scoping': '#81c784', 'Scope/ PoC Sign-Off': '#aed581',
        'Proposal': '#dce775', 'Negotiation': '#fff176', 'Commit': '#ffb74d',
        'Integrating': '#ff8a65', 'Closed Active': '#00ff88', 'Closed Lost': '#ff4757'
      };

      var totalStaged = 0;
      stageOrder.forEach(function(stage) { totalStaged += data.dealStages[stage] || 0; });

      var html = '<div class="pipeline-container">';
      html += '<div class="pipeline-stage top"><h4>Top of Funnel</h4><div class="count">' + (pipeline['Top of Funnel'] || 0) + '</div><div style="font-size:10px;color:#888">Early Lead + Contacted</div></div>';
      html += '<div class="pipeline-stage mid"><h4>Mid Funnel</h4><div class="count">' + (pipeline['Mid Funnel'] || 0) + '</div><div style="font-size:10px;color:#888">Appt - Scoping</div></div>';
      html += '<div class="pipeline-stage bottom"><h4>Bottom Funnel</h4><div class="count">' + (pipeline['Bottom Funnel'] || 0) + '</div><div style="font-size:10px;color:#888">PoC - Integrating</div></div>';
      html += '<div class="pipeline-stage closed"><h4>Closed</h4><div class="count">' + (pipeline['Closed'] || 0) + '</div><div style="font-size:10px;color:#888">Active + Lost</div></div>';
      html += '</div>';

      // Funnel visualization
      html += '<div style="display:flex;gap:20px;margin-top:16px">';
      html += '<div class="true-funnel" style="flex:1">';
      html += '<h3 style="color:#00d4ff;font-size:12px;margin-bottom:12px;text-align:center">Deal Stage Funnel</h3>';

      var runningTotal = totalStaged;
      stageOrder.forEach(function(stage) {
        var count = data.dealStages[stage] || 0;
        var color = stageColors[stage];
        var widthPct = totalStaged > 0 ? Math.max(30, (runningTotal / totalStaged) * 100) : 30;
        var nextWidthPct = totalStaged > 0 ? Math.max(25, ((runningTotal - count) / totalStaged) * 100) : 25;
        var indent = (100 - widthPct) / 2;
        var nextIndent = (100 - nextWidthPct) / 2;

        html += '<div class="funnel-section" style="width:' + widthPct + '%">';
        html += '<div class="funnel-trapezoid" style="width:100%;background:' + color + ';';
        html += 'clip-path: polygon(' + indent + '% 0%, ' + (100-indent) + '% 0%, ' + (100-nextIndent) + '% 100%, ' + nextIndent + '% 100%);';
        html += 'height:' + (count > 0 ? '32px' : '20px') + '">';
        html += '<span class="trap-label">' + stage + '</span>';
        html += '<span class="trap-count">' + count + '</span>';
        html += '</div></div>';
        runningTotal -= count;
      });
      html += '</div>';

      // Summary stats
      html += '<div style="width:250px">';
      html += '<h3 style="color:#00d4ff;font-size:12px;margin-bottom:12px">Funnel Summary</h3>';
      html += '<div class="funnel-summary-card"><span class="fsc-label">Total in Pipeline</span><span class="fsc-value" style="color:#00d4ff">' + totalStaged + '</span></div>';
      html += '<div class="funnel-summary-card"><span class="fsc-label">Top of Funnel</span><span class="fsc-value" style="color:#64b5f6">' + (pipeline['Top of Funnel'] || 0) + '</span></div>';
      html += '<div class="funnel-summary-card"><span class="fsc-label">Mid Funnel</span><span class="fsc-value" style="color:#81c784">' + (pipeline['Mid Funnel'] || 0) + '</span></div>';
      html += '<div class="funnel-summary-card"><span class="fsc-label">Bottom Funnel</span><span class="fsc-value" style="color:#fff176">' + (pipeline['Bottom Funnel'] || 0) + '</span></div>';
      html += '<div class="funnel-summary-card"><span class="fsc-label">Closed Active</span><span class="fsc-value" style="color:#00ff88">' + (data.dealStages['Closed Active'] || 0) + '</span></div>';
      html += '<div class="funnel-summary-card"><span class="fsc-label">Closed Lost</span><span class="fsc-value" style="color:#ff4757">' + (data.dealStages['Closed Lost'] || 0) + '</span></div>';
      html += '</div></div>';

      // Stage table
      var aeNames = Object.keys(data.byAE);
      var activeStages = stageOrder.filter(function(stage) { return data.dealStages[stage] && data.dealStages[stage] > 0; });

      html += '<h3 style="color:#00d4ff;font-size:12px;margin:20px 0 10px">Stage Breakdown by AE</h3>';
      html += '<div class="scroll-container"><table class="data-table"><thead><tr><th>#</th><th>Deal Stage</th>';
      aeNames.forEach(function(ae) { html += '<th>' + ae + '</th>'; });
      if (aeNames.length > 1) html += '<th>TOTAL</th>';
      html += '</tr></thead><tbody>';

      activeStages.forEach(function(stage) {
        var total = data.dealStages[stage] || 0;
        var stageNum = stageOrder.indexOf(stage) + 1;
        html += '<tr><td style="color:#666">' + stageNum + '</td>';
        html += '<td><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:' + stageColors[stage] + ';margin-right:6px"></span><strong>' + stage + '</strong></td>';
        aeNames.forEach(function(ae) {
          var count = data.dealStagesByAE[ae] ? (data.dealStagesByAE[ae][stage] || 0) : 0;
          html += '<td>' + count + '</td>';
        });
        if (aeNames.length > 1) html += '<td><strong>' + total + '</strong></td>';
        html += '</tr>';
      });

      if (aeNames.length > 1) {
        html += '<tr class="total-row"><td></td><td>TOTAL STAGED</td>';
        aeNames.forEach(function(ae) {
          var aeTotal = 0;
          Object.values(data.dealStagesByAE[ae] || {}).forEach(function(v) { aeTotal += v; });
          html += '<td>' + aeTotal + '</td>';
        });
        html += '<td><strong>' + totalStaged + '</strong></td></tr>';
      }

      html += '</tbody></table></div>';
      document.getElementById('tab-pipeline').innerHTML = html;
    }

    // =====================================================
    // ACTIONS TAB
    // =====================================================
    function renderActions() {
      var data = getFilteredData();
      var actions = data.pendingActions || [];

      var callPending = actions.filter(function(a) { return a.type === 'call_pending'; });
      var followupNeeded = actions.filter(function(a) { return a.type === 'followup_needed'; });

      var html = '<div style="margin-bottom:16px;padding:12px;background:rgba(0,212,255,0.1);border-radius:8px;border:1px solid rgba(0,212,255,0.2)">';
      html += '<h3 style="color:#00d4ff;font-size:13px;margin-bottom:8px">Pending Actions Logic (AI Enhanced)</h3>';
      html += '<div style="font-size:11px;color:#aaa;line-height:1.6">';
      html += '<div><span style="color:#ff4757">Call Pending (High)</span>: Has phone number but not yet talked</div>';
      html += '<div><span style="color:#ffc107">Follow-up Needed</span>: Status is "Still Exploring" + last contact was >7 days ago</div>';
      html += '</div></div>';

      if (actions.length === 0) {
        html += '<div class="loading">No pending actions! Great job.</div>';
        document.getElementById('tab-actions').innerHTML = html;
        return;
      }

      // Summary cards
      html += '<div style="display:flex;gap:12px;margin-bottom:16px">';
      html += '<div style="flex:1;background:rgba(255,71,87,0.15);border:1px solid rgba(255,71,87,0.3);border-radius:8px;padding:12px;text-align:center">';
      html += '<div style="font-size:24px;font-weight:700;color:#ff4757">' + callPending.length + '</div>';
      html += '<div style="font-size:11px;color:#888">Calls Pending</div></div>';
      html += '<div style="flex:1;background:rgba(255,193,7,0.15);border:1px solid rgba(255,193,7,0.3);border-radius:8px;padding:12px;text-align:center">';
      html += '<div style="font-size:24px;font-weight:700;color:#ffc107">' + followupNeeded.length + '</div>';
      html += '<div style="font-size:11px;color:#888">Follow-ups Needed</div></div>';
      html += '<div style="flex:1;background:rgba(0,212,255,0.15);border:1px solid rgba(0,212,255,0.3);border-radius:8px;padding:12px;text-align:center">';
      html += '<div style="font-size:24px;font-weight:700;color:#00d4ff">' + actions.length + '</div>';
      html += '<div style="font-size:11px;color:#888">Total Actions</div></div>';
      html += '</div>';

      // Call Pending Section
      if (callPending.length > 0) {
        html += '<h4 style="color:#ff4757;font-size:12px;margin:16px 0 8px">Calls Pending (' + callPending.length + ')</h4>';
        html += '<div class="action-list" style="max-height:150px">';
        callPending.slice(0, 20).forEach(function(a) {
          html += '<div class="action-item high"><div class="action-info">';
          html += '<div class="action-company">' + a.company + '</div>';
          html += '<div class="action-ae">AE: ' + a.ae + '</div>';
          html += '</div><button class="btn btn-secondary btn-sm">Done</button></div>';
        });
        if (callPending.length > 20) html += '<div style="text-align:center;color:#888;font-size:11px;padding:8px">+' + (callPending.length - 20) + ' more</div>';
        html += '</div>';
      }

      // Follow-up Section
      if (followupNeeded.length > 0) {
        html += '<h4 style="color:#ffc107;font-size:12px;margin:16px 0 8px">Follow-ups Needed (' + followupNeeded.length + ')</h4>';
        html += '<div class="action-list" style="max-height:150px">';
        followupNeeded.slice(0, 20).forEach(function(a) {
          html += '<div class="action-item medium"><div class="action-info">';
          html += '<div class="action-company">' + a.company + ' <span style="color:#888;font-size:10px">(' + a.daysSince + ' days)</span></div>';
          html += '<div class="action-ae">AE: ' + a.ae + '</div>';
          html += '</div><button class="btn btn-secondary btn-sm">Done</button></div>';
        });
        if (followupNeeded.length > 20) html += '<div style="text-align:center;color:#888;font-size:11px;padding:8px">+' + (followupNeeded.length - 20) + ' more</div>';
        html += '</div>';
      }

      document.getElementById('tab-actions').innerHTML = html;
    }

    // =====================================================
    // COMPARE & SNAPSHOTS TABS
    // =====================================================
    function renderCompare() {
      if (snapshots.length === 0) {
        document.getElementById('tab-compare').innerHTML = '<div class="loading">No snapshots yet. Save a snapshot first.</div>';
        return;
      }

      var options = '<option value="">-- Select Snapshot --</option>';
      snapshots.forEach(function(s, i) {
        options += '<option value="' + i + '">' + s.label + ' (' + new Date(s.timestamp).toLocaleDateString() + ')</option>';
      });

      var html = '<div class="compare-row"><label>Compare with:</label><select class="compare-select" id="compareSelect" onchange="updateComparison()">' + options + '</select></div><div id="compareResults"></div>';
      document.getElementById('tab-compare').innerHTML = html;
    }

    function updateComparison() {
      var idx = document.getElementById('compareSelect').value;
      if (idx === '') {
        document.getElementById('compareResults').innerHTML = '';
        return;
      }

      var snap = snapshots[parseInt(idx)];
      var old = snap.data.team;
      var now = liveData.team;

      var metrics = [
        { label: 'Total Accounts', key: 'total' },
        { label: 'Talked', key: 'talked' },
        { label: 'Meetings', key: 'meetings' },
        { label: 'Interested (Yes)', key: 'interestedYes' },
        { label: 'Interested (Exploring)', key: 'interestedExploring' },
        { label: 'Deal Staged', key: 'staged' }
      ];

      var html = '<h3 style="margin-bottom:12px">Now vs ' + snap.label + '</h3><table class="data-table"><thead><tr><th>Metric</th><th>Then</th><th>Now</th><th>Change</th><th>%</th></tr></thead><tbody>';

      metrics.forEach(function(m) {
        var oldVal = old[m.key] || 0;
        var nowVal = now[m.key] || 0;
        var diff = nowVal - oldVal;
        var pct = oldVal > 0 ? ((diff / oldVal) * 100).toFixed(1) : (nowVal > 0 ? 'NEW' : '0');
        var cls = diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral';
        html += '<tr><td><strong>' + m.label + '</strong></td><td>' + oldVal + '</td><td>' + nowVal + '</td><td class="delta ' + cls + '">' + (diff >= 0 ? '+' : '') + diff + '</td><td class="delta ' + cls + '">' + pct + '%</td></tr>';
      });

      html += '</tbody></table>';
      document.getElementById('compareResults').innerHTML = html;
    }

    function renderSnapshots() {
      if (snapshots.length === 0) {
        document.getElementById('tab-snapshots').innerHTML = '<div class="loading">No snapshots saved yet.</div>';
        return;
      }

      var html = '<div class="snapshot-list">';
      snapshots.forEach(function(s) {
        var date = new Date(s.timestamp);
        html += '<div class="snapshot-item"><div><div class="snapshot-label">' + s.label + '</div><div class="snapshot-date">' + date.toLocaleString() + ' | Week ' + s.data.weekNumber + '</div></div><div><button class="btn btn-secondary btn-sm" onclick="deleteSnap(\'' + s.id + '\')">Delete</button></div></div>';
      });
      html += '</div>';

      document.getElementById('tab-snapshots').innerHTML = html;
    }

    // =====================================================
    // UTILITY FUNCTIONS
    // =====================================================
    function saveNewSnapshot() {
      google.script.run.withSuccessHandler(function(result) {
        var data = JSON.parse(result);
        alert('Snapshot saved: ' + data.label);
        refreshData();
      }).saveSnapshotFromDashboard('');
    }

    function deleteSnap(id) {
      if (confirm('Delete this snapshot?')) {
        google.script.run.withSuccessHandler(function() {
          refreshData();
        }).deleteSnapshotFromDashboard(id);
      }
    }

    function generateInsights() {
      refreshAIInsights();
    }

    function exportData() {
      google.script.run.exportToCSV();
    }

    function exportAIReport() {
      google.script.run.exportAIReport();
    }

    function generateReport() {
      google.script.run.generateAIWeeklyReport();
    }

    function showFilters() {
      alert('Filter options - Use the AE dropdown above to filter data by Account Executive.');
    }

    function showSettings() {
      alert('Settings\\n\\n1. Configure API Key: AI Dashboard > Configure API Key\\n2. AE Sheets: Edit CONFIG.AE_SHEETS in the script\\n3. Stage Colors: Edit CONFIG.STAGE_COLORS in the script');
    }
  </script>
</body>
</html>`;
}
*/
