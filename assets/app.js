
const DEFAULT_STATE = {"sessionName": "Morning Command", "lastUpdated": "Not published yet", "uploads": {"scan1": "", "scan2": "", "chart": "", "news": ""}, "watchlistSource": "Waiting for 2 scans", "selected": "GOLD", "top5": [{"ticker": "GOLD", "name": "Gold Spot", "score": 92, "bias": "SELL", "reason": "Resistance fade + defensive pressure"}, {"ticker": "NAS100", "name": "Nasdaq 100", "score": 88, "bias": "BUY", "reason": "Dip support + risk bid"}, {"ticker": "BITCOIN", "name": "Bitcoin", "score": 84, "bias": "BUY", "reason": "Momentum holding above support"}, {"ticker": "EURUSD", "name": "EURUSD", "score": 80, "bias": "BUY", "reason": "Dollar softness + structure hold"}, {"ticker": "WTI", "name": "WTI Crude", "score": 76, "bias": "SELL", "reason": "Weak rebound into supply"}], "watchlist": [{"ticker": "GOLD", "name": "Gold Spot", "category": "Metals", "bias": "SELL", "trend": "down"}, {"ticker": "NAS100", "name": "Nasdaq 100", "category": "Indices", "bias": "BUY", "trend": "up"}, {"ticker": "SPX500", "name": "S&P 500", "category": "Indices", "bias": "BUY", "trend": "up"}, {"ticker": "US30", "name": "Dow 30", "category": "Indices", "bias": "BUY", "trend": "up"}, {"ticker": "WTI", "name": "WTI Crude", "category": "Energy", "bias": "SELL", "trend": "down"}, {"ticker": "EURUSD", "name": "EURUSD", "category": "Forex", "bias": "BUY", "trend": "up"}, {"ticker": "USDJPY", "name": "USDJPY", "category": "Forex", "bias": "BUY", "trend": "up"}, {"ticker": "BITCOIN", "name": "Bitcoin", "category": "Crypto", "bias": "BUY", "trend": "up"}, {"ticker": "ETHEREUM", "name": "Ethereum", "category": "Crypto", "bias": "SELL", "trend": "down"}, {"ticker": "SOLANA", "name": "Solana", "category": "Crypto", "bias": "SELL", "trend": "down"}, {"ticker": "XRP", "name": "XRP", "category": "Crypto", "bias": "BUY", "trend": "up"}], "battlefield": {"GOLD": {"readyBias": "SELL the rally", "timeframe": "Intraday", "entryZone": "R2\u2013R3 resistance band", "stop": "Above spike high", "target1": "Mid-range retest", "target2": "Lower support / FPV", "note": "Wait for rejection before pressing the sell.", "direction": "down"}, "NAS100": {"readyBias": "BUY the dip", "timeframe": "Intraday", "entryZone": "Support pullback zone", "stop": "Below session support", "target1": "Morning high retest", "target2": "Breakout extension", "note": "Best when risk-on tone stays active.", "direction": "up"}, "BITCOIN": {"readyBias": "BUY continuation", "timeframe": "Intraday", "entryZone": "Pullback into breakout support", "stop": "Below structure low", "target1": "Prior intraday high", "target2": "Momentum extension", "note": "Only clean if risk sentiment remains firm.", "direction": "up"}, "EURUSD": {"readyBias": "BUY the dip", "timeframe": "Intraday", "entryZone": "Support retest / upper range hold", "stop": "Below structure support", "target1": "Range high", "target2": "Breakout continuation", "note": "Bias improves when the dollar softens.", "direction": "up"}, "WTI": {"readyBias": "SELL the rally", "timeframe": "Intraday", "entryZone": "Supply retest", "stop": "Above session high", "target1": "Mid-range", "target2": "Support flush", "note": "Avoid if fresh geopolitical squeeze hits oil.", "direction": "down"}}, "news": {"regime": "Risk-Off Lean", "summary": "Macro upload judges whether markets want risk or safety. That sets how aggressive the session should be.", "why": "Defensive tone is still stronger than outright risk appetite.", "drivers": ["Dollar firm", "Defensive tone", "Energy headline risk"], "sources": "Macro upload / squawk / daily commentary"}};
function getState(){try{return JSON.parse(localStorage.getItem('te_sync_session_state')||JSON.stringify(DEFAULT_STATE));}catch(e){return DEFAULT_STATE;}}
function setState(s){localStorage.setItem('te_sync_session_state', JSON.stringify(s));}
function nav(active){const links=[['home.html','Home'],['login.html','Login'],['dashboard.html','Command Desk'],['watchlist.html','Watchlist'],['admin.html','Admin']];return `<div class="nav"><div class="brand">The Trader <span>Edge</span></div><div class="links">${links.map(([href,label])=>`<a href="${href}" class="${active===label?'active':''}">${label}</a>`).join('')}</div></div>`;}
function trendArrow(v){return v==='up'?'↑ Up':'↓ Down';}
function biasClass(v){return v==='BUY'?'buy':'sell';}
function findInstrument(t){const s=getState();return s.watchlist.find(x=>x.ticker===t)||s.watchlist[0];}
function renderTop5List(){const s=getState();const el=document.getElementById('top5List'); if(!el) return; el.innerHTML=s.top5.map((x,i)=>`<div class="top5-item"><div><div class="eyebrow">Top ${i+1}</div><h3>${x.ticker}</h3><div class="note">${x.reason}</div></div><div style="text-align:right"><div class="score">${x.score}</div><div class="pill ${biasClass(x.bias)}">${x.bias}</div></div></div>`).join('');}
function renderTop5Strip(){const s=getState();const el=document.getElementById('top5Strip'); if(!el) return; el.innerHTML=s.top5.map(x=>`<button class="top5-pick ${s.selected===x.ticker?'active':''}" onclick="selectInstrument('${x.ticker}')">${x.ticker}</button>`).join('');}
function renderSyncMeta(){
  const s=getState();
  document.querySelectorAll('[data-sync-meta]').forEach(src=>{
    src.innerHTML=`<span class="chip">Watchlist source: ${s.watchlistSource}</span><span class="chip">Top 5 source: merged Scan 1 + Scan 2</span>`;
  });
}
function selectInstrument(t){const s=getState();s.selected=t;setState(s);renderDashboard();renderWatchlist();}
function intelCard(t){const x=findInstrument(t);const top=getState().top5.find(a=>a.ticker===x.ticker)||{reason:'Watchlist candidate'};return `<div class="card intel"><div class="card-header"><div><div class="eyebrow">Intel Card</div><div class="card-title">${x.ticker}</div><div class="sub">${x.name} · ${x.category}</div></div><div class="pill ${biasClass(x.bias)}">${x.bias}</div></div><div class="box"><div class="note">Scanner output</div><div class="scanrow"><div>Bias</div><div>${x.bias}</div></div><div class="scanrow"><div>Trend</div><div>${trendArrow(x.trend)}</div></div><div class="scanrow"><div>Why it made Top 5</div><div>${top.reason}</div></div></div><div class="box"><div class="note">Simple read</div><strong>${x.bias==='BUY'?'We want to buy key reversals from support.':'We want to sell key reversals from resistance.'}</strong><div class="note" style="margin-top:8px">Intel is driven from the same merged 2-scan watchlist that powers Home and Watchlist.</div></div></div>`;}
function zoneChart(b){const dir=b.direction||'down'; return `<div class="zonechart"><div class="zline zstop"></div><div class="zlabel lstop">Stop</div><div class="zonebox ${dir}"></div><div class="zlabel lentry">Attack Zone</div><div class="zline zlive"></div><div class="zlabel llive">Live</div><div class="zline zt1"></div><div class="zlabel lt1">Target 1</div><div class="zline zt2"></div><div class="zlabel lt2">Target 2</div><div class="arrow-route ${dir}">➜</div></div>`}
function battleCard(t){const b=getState().battlefield[t]||getState().battlefield['GOLD'];return `<div class="card battle"><div class="card-header"><div><div class="eyebrow">Battlefield Card</div><div class="card-title">${t}</div><div class="sub">Chart-driven trade plan</div></div><div class="pill neutral">${b.timeframe}</div></div><div class="box"><strong>${b.readyBias}</strong><div class="note" style="margin-top:8px">${b.note}</div></div>${zoneChart(b)}<div class="levels"><div class="level"><strong>Attack Zone</strong>${b.entryZone}</div><div class="level"><strong>Stop Loss</strong>${b.stop}</div><div class="level"><strong>Take Profit 1</strong>${b.target1}</div><div class="level"><strong>Take Profit 2</strong>${b.target2}</div></div></div>`;}
function newsCard(){const n=getState().news;return `<div class="card news"><div class="card-header"><div><div class="eyebrow">News Card</div><div class="card-title">${n.regime}</div><div class="sub">Macro mood from uploaded news</div></div><div class="pill neutral">Risk Mood</div></div><div class="box"><div class="note">${n.summary}</div></div><div class="box"><strong>Why</strong><div class="note" style="margin-top:8px">${n.why}</div></div><div class="box"><strong>Drivers</strong><div class="tag-row">${n.drivers.map(d=>`<span class="tag">${d}</span>`).join('')}</div></div></div>`;}
function renderDashboard(){const s=getState();renderTop5Strip();const el=document.getElementById('cards');if(el) el.innerHTML=intelCard(s.selected)+battleCard(s.selected)+newsCard();const sum=document.getElementById('sessionMeta');if(sum) sum.innerHTML=`<span class="chip">Session: ${s.sessionName}</span><span class="chip">Updated: ${s.lastUpdated}</span>`;renderSyncMeta();}
function renderWatchlist(){const s=getState();renderTop5Strip();const market=s.watchlist.filter(x=>x.category!=='Crypto');const crypto=s.watchlist.filter(x=>x.category==='Crypto');const row=x=>`<div class="watchlist-row"><div><strong>${x.ticker}</strong><div class="note">${x.name} · ${x.category}</div></div><div class="tag-row"><span class="pill ${biasClass(x.bias)}">${x.bias}</span><span class="pill neutral">${trendArrow(x.trend)}</span><button onclick="selectInstrument('${x.ticker}');location.href='dashboard.html'">Load Chart</button></div></div>`;const m=document.getElementById('marketWatch');const c=document.getElementById('cryptoWatch');if(m) m.innerHTML=market.map(row).join('');if(c) c.innerHTML=crypto.map(row).join('');const sum=document.getElementById('watchMeta');if(sum) sum.innerHTML=`<span class="chip">Session: ${s.sessionName}</span><span class="chip">Updated: ${s.lastUpdated}</span>`;renderSyncMeta();}
function renderHome(){const s=getState();const meta=document.getElementById('homeMeta');if(meta) meta.innerHTML=`<span class="chip">Session: ${s.sessionName}</span><span class="chip">Updated: ${s.lastUpdated}</span>`;renderTop5List();renderSyncMeta();}
function loadAdmin(){const s=getState();document.getElementById('sessionName').value=s.sessionName;['scan1','scan2','chart','news'].forEach(k=>{const el=document.getElementById(k+'Name');if(el) el.textContent=s.uploads[k]||'Nothing uploaded yet';});const meta=document.getElementById('currentState');if(meta) meta.innerHTML=`<span class="chip">Selected: ${s.selected}</span><span class="chip">Top 1: ${s.top5[0].ticker}</span><span class="chip">Source: ${s.watchlistSource}</span>`;}
function setUpload(type,input){const f=input.files&&input.files[0];if(!f) return;const s=getState();s.uploads[type]=f.name;setState(s);loadAdmin();}
function publishSession(){
  const s=getState();
  s.sessionName=document.getElementById('sessionName').value || 'Session Update';
  const scan1=(s.uploads.scan1||'').toLowerCase();
  const scan2=(s.uploads.scan2||'').toLowerCase();
  const chart=(s.uploads.chart||'').toLowerCase();
  const news=(s.uploads.news||'').toLowerCase();
  if(!scan1 || !scan2){document.getElementById('status').textContent='Upload Scan 1 and Scan 2 first.';return;}
  const combined = `${scan1} ${scan2}`;
  s.watchlistSource = 'Scan 1 + Scan 2';
  const order = ['GOLD','NAS100','SPX500','US30','WTI','EURUSD','USDJPY','BITCOIN','ETHEREUM','SOLANA','XRP'];
  const aliases = {
    GOLD:['gold','xau'],
    NAS100:['nas','nas100','nasdaq'],
    SPX500:['spx','spx500','s&p'],
    US30:['us30','dow'],
    WTI:['wti','oil','crude'],
    EURUSD:['eurusd','eur usd','eur'],
    USDJPY:['usdjpy','usd jpy','jpy'],
    BITCOIN:['bitcoin','btc'],
    ETHEREUM:['ethereum','eth'],
    SOLANA:['solana','sol'],
    XRP:['xrp']
  };
  const matched = order.filter(t => aliases[t].some(a => combined.includes(a)));
  let top = [...new Set(matched)].slice(0,5);
  while(top.length < 5){
    const add = order.find(x => !top.includes(x));
    top.push(add);
  }
  const reasonMap = {
    GOLD:'Resistance fade + defensive pressure',
    NAS100:'Dip support + risk bid',
    SPX500:'Index strength + session support',
    US30:'Momentum structure holding',
    WTI:'Weak rebound into supply',
    EURUSD:'Dollar softness + structure hold',
    USDJPY:'Dollar/yen trend continuation',
    BITCOIN:'Momentum holding above support',
    ETHEREUM:'Weak structure under resistance',
    SOLANA:'Rotation risk into supply',
    XRP:'Breakout watch + flow interest'
  };
  s.top5 = top.map((ticker, i) => {
    const inst = findInstrument(ticker);
    return {ticker, name: inst.name, score: 92 - i*4, bias: inst.bias, reason: reasonMap[ticker] || 'Selected session opportunity'};
  });
  if(chart.includes('gold')) s.selected='GOLD';
  else if(chart.includes('nas')) s.selected='NAS100';
  else if(chart.includes('bitcoin') || chart.includes('btc')) s.selected='BITCOIN';
  else if(chart.includes('eur')) s.selected='EURUSD';
  else if(chart.includes('wti') || chart.includes('oil')) s.selected='WTI';
  else s.selected = s.top5[0].ticker;
  if(news.includes('risk on') || news.includes('bull') || news.includes('relief')){
    s.news.regime='Risk-On';
    s.news.summary='Macro upload suggests markets want risk and continuation.';
    s.news.why='The news input leans positive for growth, beta, and dip buying.';
    s.news.drivers=['Equities supported','Dollar softer','Dip buyers active'];
  } else if(news.includes('risk off') || news.includes('war') || news.includes('defensive')) {
    s.news.regime='Risk-Off';
    s.news.summary='Macro upload suggests markets prefer defence and tighter risk control.';
    s.news.why='The news input leans defensive, with caution taking priority over aggression.';
    s.news.drivers=['Defensive tone','Dollar firm','Headline risk active'];
  } else {
    s.news.regime='Risk-Off Lean';
    s.news.summary='Macro upload is mixed, so the session keeps a cautious stance.';
    s.news.why='The news input is not strong enough for full risk-on, so the app keeps a guarded tone.';
    s.news.drivers=['Mixed headlines','Selective risk','Need confirmation'];
  }
  s.lastUpdated = new Date().toLocaleString();
  setState(s);
  loadAdmin();
  document.getElementById('status').textContent='Published. Scan 1 + Scan 2 now drive the watchlist and Top 5 across Home, Watchlist, and Command Desk.';
}
