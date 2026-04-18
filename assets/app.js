
const DEFAULT_STATE = {"sessionName": "Morning Command", "lastUpdated": "18/04/2026, 17:09:53", "market": "Crypto", "selected": "BTCUSD", "top5": [{"ticker": "GOLD", "market": "Commodities", "bias": "SELL", "score": 92, "reason": "Resistance fade + defensive pressure"}, {"ticker": "NAS100", "market": "Indices", "bias": "BUY", "score": 88, "reason": "Dip support + risk bid"}, {"ticker": "BTCUSD", "market": "Crypto", "bias": "BUY", "score": 86, "reason": "Momentum holding above support"}, {"ticker": "EURUSD", "market": "Forex", "bias": "BUY", "score": 82, "reason": "Dollar softness + structure hold"}, {"ticker": "WTI", "market": "Commodities", "bias": "SELL", "score": 78, "reason": "Weak rebound into supply"}], "watchlists": {"Crypto": ["BTCUSD", "ETHUSD", "SOLUSD", "XRPUSD"], "Forex": ["EURUSD", "GBPUSD", "USDJPY", "DXY"], "Indices": ["NAS100", "SPX500", "US30", "DAX40"], "Commodities": ["GOLD", "SILVER", "WTI", "BRENT"]}, "chartMap": {"BTCUSD": {"market": "Crypto", "bias": "BUY", "entry": "Pullback into breakout support", "stop": "Below structure low", "tp1": "Prior intraday high", "tp2": "Momentum extension", "confidence": 85, "explanation": "Momentum is holding above support and the chart is printing higher lows. The setup favours a continuation buy as long as the pullback stays controlled and risk sentiment does not weaken."}, "GOLD": {"market": "Commodities", "bias": "SELL", "entry": "Resistance retest zone", "stop": "Above spike high", "tp1": "Mid-range retest", "tp2": "Lower support / FPV", "confidence": 84, "explanation": "Gold is fading into resistance while defensive pressure stays elevated. The chart suggests a controlled sell setup if price fails to reclaim the recent spike high."}, "NAS100": {"market": "Indices", "bias": "BUY", "entry": "Support pullback zone", "stop": "Below session support", "tp1": "Morning high retest", "tp2": "Breakout extension", "confidence": 83, "explanation": "The index is holding structure and dip buyers remain active. If support is defended again, the trade favours a continuation buy back toward the highs."}, "EURUSD": {"market": "Forex", "bias": "BUY", "entry": "Higher-low support area", "stop": "Below session low", "tp1": "Range high retest", "tp2": "Breakout continuation", "confidence": 80, "explanation": "Dollar softness is helping the pair hold structure. The chart stays constructive while price remains above the latest support shelf."}, "WTI": {"market": "Commodities", "bias": "SELL", "entry": "Supply retest", "stop": "Above session high", "tp1": "Mid-range", "tp2": "Support flush", "confidence": 79, "explanation": "Oil has rebounded weakly into supply and the rally is not yet convincing. The setup favours a fade while price stays below the local high."}}, "macro": {"bias": "Risk-Off", "why": "Defensive flows are stronger, headline risk is still active, and traders are rewarding cleaner fades rather than aggressive breakout chasing."}};
function getState(){
  try { return JSON.parse(localStorage.getItem('te_mobile_state')) || JSON.stringify(DEFAULT_STATE)); }
  catch(e) { return DEFAULT_STATE; }
}
function setSelected(ticker){
  const st = getState();
  st.selected = ticker;
  localStorage.setItem('te_mobile_state', JSON.stringify(st));
}
function selectedData(){
  const st = getState();
  return st.chartMap[st.selected] || st.chartMap.BTCUSD;
}
function badgeClass(v){ return v === 'BUY' ? 'pill buy' : 'pill sell'; }
function chartSVG(direction='up'){
  const up = direction === 'up';
  const points = up
    ? '10,420 40,360 70,330 100,290 130,320 160,275 190,248 220,268 250,205 280,222 310,170 340,188 370,136 400,155'
    : '10,160 40,190 70,180 100,220 130,212 160,255 190,235 220,290 250,275 280,325 310,310 340,352 370,338 400,392';
  const price = up ? '75,875.78' : '5,020.600';
  const color = up ? '#22d3aa' : '#f16067';
  return `
    <svg viewBox="0 0 430 520" preserveAspectRatio="none">
      <polyline fill="none" stroke="${color}" stroke-width="5" points="${points}"/>
      <line x1="0" x2="430" y1="210" y2="210" stroke="#ef6461" stroke-dasharray="6 7"/>
      <rect x="${up ? 245 : 235}" y="${up ? 165 : 145}" width="88" height="88" rx="16" fill="rgba(214,176,109,.14)" stroke="rgba(214,176,109,.55)"/>
      <rect x="340" y="196" width="88" height="34" rx="8" fill="#ef6461"/>
      <text x="353" y="219" fill="white" font-size="16" font-family="Arial">${price}</text>
    </svg>`;
}
function renderTop5(){
  const st = getState();
  const el = document.getElementById('top5List');
  if (!el) return;
  el.innerHTML = st.top5.map((x,i)=>`
    <a class="top-item" href="chart.html" onclick="setSelected('${x.ticker}')">
      <div class="toprow">
        <div>
          <div class="small">TOP ${i+1}</div>
          <div style="font-size:24px;font-weight:900;margin-top:4px">${x.ticker}</div>
          <div class="sub" style="margin-top:8px">${x.reason}</div>
        </div>
        <div class="center">
          <div class="score">${x.score}</div>
          <div class="${badgeClass(x.bias)}">${x.bias}</div>
        </div>
      </div>
    </a>`).join('');
}
function renderChart(){
  const st = getState();
  const data = selectedData();
  const ttl = document.getElementById('chartTitle');
  const ttl2 = document.getElementById('chartTitle2');
  const el = document.getElementById('chartWrap');
  if (ttl) ttl.textContent = st.selected;
  if (ttl2) ttl2.textContent = st.selected;
  if (el) el.innerHTML = chartSVG(data.bias === 'BUY' ? 'up' : 'down');
}
function renderDecision(){
  const st = getState();
  const data = selectedData();
  document.getElementById('decisionTicker').textContent = st.selected;
  document.getElementById('signalText').textContent = data.bias === 'BUY' ? 'Long Position (Buy)' : 'Short Position (Sell)';
  document.getElementById('signalText').className = data.bias === 'BUY' ? 'green' : 'red';
  document.getElementById('conf').textContent = `Confidence Score: ${data.confidence}%`;
  document.getElementById('entry').textContent = data.entry;
  document.getElementById('stop').textContent = data.stop;
  document.getElementById('tp').textContent = data.tp1;
  document.getElementById('explanation').textContent = data.explanation;
}
function renderHome(){
  const st = getState();
  const bias = st.macro.bias;
  const biasEl = document.getElementById('macroBias');
  if (biasEl) {
    biasEl.textContent = bias;
    biasEl.className = bias.includes('On') ? 'big-bias bias-green' : 'big-bias bias-red';
  }
  const why = document.getElementById('macroWhy');
  if (why) why.textContent = st.macro.why;
}
