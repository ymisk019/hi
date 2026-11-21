/* ========= 1. Tabs for Video / Demo ========= */
    function switchMediaTab(tabId, btn) {
      document.querySelectorAll(".media-tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".media-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("tab-" + tabId).classList.add("active");
      stopAutoPlay();
    }

    /* ========= 2. Interactive Visual Demo ========= */
    const CARD_BADGES = {
      gold: '<span class="token-card tc-gold">🪙 ذهب</span>',
      silk: '<span class="token-card tc-silk">〰️ حرير</span>',
      spices: '<span class="token-card tc-spices">🥣 بهارات</span>',
      dates: '<span class="token-card tc-dates">🌴 تمر</span>',
      bandit: '<span class="token-card tc-bandit">🥷 قاطع طريق</span>',
      guard: '<span class="token-card tc-guard">🛡️ حارس</span>'
    };

    const DEMO_SCENES = [
      {
        steps: [
          { road: ["silk"], stash: [], guards: [], discard: [], text: "ليلى تبدأ دورها وتقلب الورقة الأولى: حرير (بضاعة) ينضم إلى الطريق." },
          { road: ["silk", "gold"], stash: [], guards: [], discard: [], text: "تقرر المتابعة وتقلب ذهباً. الطريق الآن فيه حرير وذهب." },
          { road: ["silk", "gold", "silk"], stash: [], guards: [], discard: [], text: "تقلب حريراً ثانياً! بضائع رائعة، فتقرر أن تخيّم الآن قبل ظهور قاطع طريق." },
          { road: [], stash: ["silk", "gold", "silk"], guards: [], discard: [], text: "⛺ تخييم! ينتقل الطريق كله إلى المخزن وتصبح الأوراق ملك ليلى للأبد." }
        ]
      },
      {
        steps: [
          { road: ["bandit"], stash: [], guards: [], discard: [], text: "عمر يقلب قاطع طريق! لأنه الأول في الدور فلا يحدث شيء بعد." },
          { road: ["bandit", "spices"], stash: [], guards: [], discard: [], text: "يجازف عمر ويقلب بهارات. ما زال في مأمن ويكمل السير." },
          { road: ["bandit", "spices", "bandit"], stash: [], guards: [], discard: [], text: "⚠️ قاطع طريق ثانٍ في الطريق نفسه، ولا يوجد حارس مع عمر: كمين!" },
          { road: [], stash: [], guards: [], discard: ["bandit", "spices", "bandit"], text: "💥 خسارة! يذهب طريق عمر كله إلى كومة المرمى وينتهي دوره دون مكسب." }
        ]
      },
      {
        steps: [
          { road: [], stash: [], guards: ["guard"], discard: [], text: "ليلى تقلب حارساً! ينتقل فوراً إلى منطقة الحرس الآمنة." },
          { road: ["spices", "bandit"], stash: [], guards: ["guard"], discard: [], text: "تقلب بهارات ثم قاطع طريق أول. ما زال الوضع آمناً." },
          { road: ["spices", "bandit", "bandit"], stash: [], guards: ["guard"], discard: [], text: "⚠️ ظهر قاطع طريق ثانٍ (كمين!) لكن مع ليلى حارس جاهز." },
          { road: ["spices", "bandit"], stash: [], guards: [], discard: ["guard", "bandit"], text: "🛡️ إنقاذ! ترمي ليلى الحارس مع قاطع الطريق الجديد إلى المرمى، وتكمل دورها بأمان!" }
        ]
      }
    ];

    let currentScene = 0;
    let currentStep = 0;
    let autoPlayTimer = null;

    function renderDemoStep() {
      const steps = DEMO_SCENES[currentScene].steps;
      const state = steps[currentStep];
      const renderList = arr => arr.map(k => CARD_BADGES[k]).join("");

      document.getElementById("zoneRoad").innerHTML = renderList(state.road);
      document.getElementById("zoneStash").innerHTML = renderList(state.stash);
      document.getElementById("zoneGuards").innerHTML = renderList(state.guards);
      document.getElementById("zoneDiscard").innerHTML = renderList(state.discard);
      document.getElementById("demoText").textContent = state.text;
      document.getElementById("demoStepCounter").textContent = `${currentStep + 1} / ${steps.length}`;
    }

    function selectScene(idx, btn) {
      stopAutoPlay();
      currentScene = idx;
      currentStep = 0;
      document.querySelectorAll(".scene-pill").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      renderDemoStep();
    }

    function nextDemoStep() {
      const steps = DEMO_SCENES[currentScene].steps;
      currentStep = (currentStep + 1) % steps.length;
      renderDemoStep();
    }

    function resetDemo() {
      stopAutoPlay();
      currentStep = 0;
      renderDemoStep();
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
      const btn = document.getElementById("autoPlayBtn");
      if (btn) btn.textContent = "▶ تشغيل تلقائي";
    }

    function toggleAutoPlay() {
      const btn = document.getElementById("autoPlayBtn");
      if (autoPlayTimer) {
        stopAutoPlay();
      } else {
        btn.textContent = "⏸ إيقاف";
        autoPlayTimer = setInterval(() => {
          const steps = DEMO_SCENES[currentScene].steps;
          if (currentStep < steps.length - 1) {
            currentStep++;
          } else {
            currentStep = 0;
          }
          renderDemoStep();
        }, 2300);
      }
    }

    renderDemoStep();

    /* ========= 3. Score Calculator ========= */
    const GOODS_POINTS = [0, 1, 3, 6, 10, 15, 21, 28, 36];
    const GOODS_KEYS = [
      { key: "gold", label: "ذهب 🪙" },
      { key: "silk", label: "حرير 〰️" },
      { key: "spices", label: "بهارات 🥣" },
      { key: "dates", label: "تمر 🌴" },
      { key: "incense", label: "بخور ♨️" }
    ];

    let playerCount = 2;
    let players = [
      { name: "ليلى", gold: 2, silk: 3, spices: 4, dates: 1, incense: 0, bandits: 2, guards: 0 },
      { name: "عمر", gold: 4, silk: 1, spices: 2, dates: 0, incense: 3, bandits: 0, guards: 1 },
      { name: "لاعب 3", gold: 0, silk: 0, spices: 0, dates: 0, incense: 0, bandits: 0, guards: 0 },
      { name: "لاعب 4", gold: 0, silk: 0, spices: 0, dates: 0, incense: 0, bandits: 0, guards: 0 }
    ];

    function setPlayerCount(count, btn) {
      playerCount = count;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCalculator();
    }

    function updateField(idx, field, val) {
      if (field === "name") {
        players[idx].name = val;
      } else {
        const max = field === "guards" ? 4 : 8;
        players[idx][field] = Math.max(0, Math.min(max, parseInt(val || 0, 10)));
      }
      try { localStorage.setItem("sandSilkPlayers", JSON.stringify(players)); } catch (_) {}
      renderCalculator();
      const selector = field === "name" ? ".player-calc-card:nth-child(" + (idx + 1) + ") input[type=text]" : ".player-calc-card:nth-child(" + (idx + 1) + ") input[oninput*=\"'" + field + "'\"]";
      const next = document.querySelector(selector);
      if (next) { next.focus(); if (field === "name") next.setSelectionRange(next.value.length, next.value.length); }
      const note = document.getElementById("saveNote"); if (note) note.textContent = "تم حفظ النتائج على هذا الجهاز";
    }

    function resetCalculator() {
      players = ["ليلى", "عمر", "لاعب 3", "لاعب 4"].map(name => ({name, gold:0, silk:0, spices:0, dates:0, incense:0, bandits:0, guards:0}));
      try { localStorage.removeItem("sandSilkPlayers"); } catch (_) {}
      renderCalculator();
    }
    try { const saved = JSON.parse(localStorage.getItem("sandSilkPlayers") || "null"); if (Array.isArray(saved) && saved.length === 4) players = saved; } catch (_) {}

    function calculateScores() {
      const active = players.slice(0, playerCount);
      const majorityBonuses = new Array(playerCount).fill(0);

      GOODS_KEYS.forEach(({ key }) => {
        const counts = active.map(p => p[key]);
        const maxVal = Math.max(...counts);
        if (maxVal >= 2) {
          const winners = counts.map((c, i) => (c === maxVal ? i : -1)).filter(i => i !== -1);
          const bonus = winners.length === 1 ? 4 : 2;
          winners.forEach(i => { majorityBonuses[i] += bonus; });
        }
      });

      const results = active.map((p, i) => {
        const goodsPts = GOODS_KEYS.reduce((sum, g) => sum + GOODS_POINTS[p[g.key]], 0);
        const majPts = majorityBonuses[i];
        const guardPts = p.guards;
        const banditPts = p.bandits * -2;
        const total = goodsPts + majPts + guardPts + banditPts;
        return { goodsPts, majPts, guardPts, banditPts, total, gold: p.gold };
      });

      const bestTotal = Math.max(...results.map(r => r.total));
      const tiedBest = results.filter(r => r.total === bestTotal);
      const bestGold = Math.max(...tiedBest.map(r => r.gold));

      return results.map(r => ({
        ...r,
        isWinner: r.total === bestTotal && r.gold === bestGold
      }));
    }

    function renderCalculator() {
      const grid = document.getElementById("calcGrid");
      const results = calculateScores();

      grid.innerHTML = players.slice(0, playerCount).map((p, idx) => {
        const res = results[idx];
        return `
          <div class="player-calc-card ${res.isWinner ? "winner" : ""}">
            <input type="text" value="${p.name}" aria-label="اسم اللاعب"
              onchange="updateField(${idx}, 'name', this.value)" />

            ${GOODS_KEYS.map(g => `
              <div class="input-row">
                <span>${g.label}</span>
                <input type="number" min="0" max="8" value="${p[g.key]}"
                  oninput="updateField(${idx}, '${g.key}', this.value)" />
              </div>
            `).join("")}

            <div class="input-row">
              <span>حراس غير مستعملين 🛡️ (+1)</span>
              <input type="number" min="0" max="4" value="${p.guards}"
                oninput="updateField(${idx}, 'guards', this.value)" />
            </div>

            <div class="input-row">
              <span>قطاع طرق في المخزن 🥷 (-2)</span>
              <input type="number" min="0" max="8" value="${p.bandits}"
                oninput="updateField(${idx}, 'bandits', this.value)" />
            </div>

            <div class="score-summary">
              <div>نقاط البضائع: <strong>${res.goodsPts}</strong> | الأغلبية: <strong>+${res.majPts}</strong></div>
              <div>الحراس: <strong>+${res.guardPts}</strong> | قطاع الطرق: <strong>${res.banditPts}</strong></div>
              <div class="total-score">
                <span>المجموع: ${res.total}</span>
                ${res.isWinner ? '<span class="winner-badge">🏆 الفائز</span>' : ""}
              </div>
            </div>
          </div>
        `;
      }).join("");
    }

    renderCalculator();

    // Welcome tour: brief, skippable and remembered on this device.
    const tourSteps=[{icon:"🗂️",title:"أهلًا بك في مكتبة الألعاب الورقية",text:"استكشف الألعاب الورقية واختر اللعبة التي تريدها. تقدر تتخطى الجولة متى ما بدك."},{icon:"🎲",title:"العب رمل وحرير",text:"ابدأ جولة من 2 إلى 4 لاعبين على الجهاز نفسه أو عبر الإنترنت."},{icon:"⚽",title:"اكتشف كرة المرمى الورقية",text:"شاهد فكرة اللعبة وافتح ملفها من صفحتها المستقلة."}];let tourIndex=0;
    function showTour(){if(localStorage.getItem('sandSilkTourDone'))return;tourIndex=0;document.getElementById('tourModal').classList.add('open');renderTour();}
    function renderTour(){const x=tourSteps[tourIndex];document.getElementById('tourIcon').textContent=x.icon;document.getElementById('tourTitle').textContent=x.title;document.getElementById('tourText').textContent=x.text;document.getElementById('tourProgress').innerHTML=tourSteps.map((_,i)=>'<span class="tour-dot '+(i<=tourIndex?'active':'')+'"></span>').join('');document.getElementById('tourNext').textContent=tourIndex===tourSteps.length-1?'ابدأ الجولة':'التالي';}
    function nextTour(){if(tourIndex<tourSteps.length-1){tourIndex++;renderTour()}else closeTour()}
    function closeTour(){document.getElementById('tourModal').classList.remove('open');try{localStorage.setItem('sandSilkTourDone','1')}catch(_){}}
    setTimeout(showTour,450);
    // PDF preview modal, with explicit download option.
    document.querySelectorAll('a.pdf-preview-link[href$=".pdf"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openPDFPreview(a.href,a.closest('.file-card')?.querySelector('h3')?.textContent||'معاينة الملف')}));
    function openPDFPreview(src,title){document.getElementById('fileModalTitle').textContent=title||'معاينة الملف';document.getElementById('filePreview').src=src;document.getElementById('fileDownload').href=src;document.getElementById('fileDownload').download=src.split('/').pop();document.getElementById('fileModal').classList.add('open')}
    function closeFile(){document.getElementById('fileModal').classList.remove('open');document.getElementById('filePreview').src='about:blank'}
    function renderNameFields(){const n=+document.getElementById('gamePlayerCount').value;document.getElementById('gameNames').innerHTML=Array.from({length:n},(_,i)=>'<div><label for="playerName'+i+'">اسم اللاعب '+(i+1)+'</label><input id="playerName'+i+'" maxlength="18" value="'+(['ليلى','عمر','سارة','خالد'][i])+'"></div>').join('')}
    const goodsMeta={gold:['ذهب','🪙'],silk:['حرير','〰️'],spices:['بهارات','🥣'],dates:['تمر','🌴'],incense:['بخور','♨️']};let liveGame=null;
    function startGame(){const n=+document.getElementById('gamePlayerCount').value;const names=Array.from({length:n},(_,i)=>document.getElementById('playerName'+i).value.trim()||'لاعب '+(i+1));const deck=[];for(const k of Object.keys(goodsMeta))for(let i=0;i<8;i++)deck.push(k);for(let i=0;i<8;i++)deck.push('bandit');for(let i=0;i<4;i++)deck.push('guard');for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}liveGame={deck,players:names.map(name=>({name,stash:{gold:0,silk:0,spices:0,dates:0,incense:0,bandits:0},guards:0})),turn:0,road:[],roadBandits:0,active:true};document.getElementById('gameSetup').hidden=true;document.getElementById('gameTable').hidden=false;document.getElementById('gameResult').innerHTML='';document.getElementById('gameLog').textContent='قافلتكم جاهزة. اقلبوا أول بطاقة!';paintGame()}
    function currentPlayer(){return liveGame.players[liveGame.turn]}
    function drawCard(){if(!liveGame?.active||!liveGame.deck.length)return;const p=currentPlayer(),card=liveGame.deck.pop();let msg='';if(card==='guard'){p.guards++;msg='🛡️ حصل '+p.name+' على حارس؛ أُضيف إلى حراسه الآمنين.'}else if(card==='bandit'){liveGame.road.push(card);liveGame.roadBandits++;if(liveGame.roadBandits===2){if(p.guards>0){p.guards--;liveGame.road.pop();liveGame.roadBandits--;msg='🛡️ كمين! الحارس صدّ قاطع الطريق الثاني. بقي الطريق كما هو.'}else{msg='💥 كمين! خسر '+p.name+' كل بطاقات الطريق. انتهى دوره.';liveGame.road=[];liveGame.roadBandits=0;finishTurn(msg);return}}else msg='🥷 قاطع الطريق الأول في الطريق؛ ما زال بإمكانك المتابعة.'}else{liveGame.road.push(card);msg='ظهرت بطاقة '+goodsMeta[card][0]+'؛ تابع أو خيّم لتأمينها.'}document.getElementById('gameLog').textContent=msg;if(liveGame.deck.length===0){camp(true);return}document.getElementById('campBtn').disabled=liveGame.road.length===0;paintGame(msg)}
    function camp(forced=false){if(!liveGame?.active)return;const p=currentPlayer();if(liveGame.road.length===0&&!forced)return;liveGame.road.forEach(c=>{if(c==='bandit')p.stash.bandits++;else p.stash[c]++});const n=liveGame.road.length;liveGame.road=[];liveGame.roadBandits=0;finishTurn(forced?'انتهت الرزمة؛ أُودعت البطاقات المتبقية تلقائيًا في المخزن.':'⛺ خيّم '+p.name+' وأمّن '+n+' بطاقة في مخزنه.')}
    function finishTurn(message){document.getElementById('gameLog').textContent=message;if(liveGame.deck.length===0){endGame();return}liveGame.turn=(liveGame.turn+1)%liveGame.players.length;liveGame.road=[];liveGame.roadBandits=0;paintGame(message)}
    function paintGame(message){if(!liveGame)return;const p=currentPlayer();document.getElementById('turnTitle').textContent='دور: '+p.name;document.getElementById('deckCount').textContent='متبقي في الرزمة: '+liveGame.deck.length+' بطاقة';document.getElementById('gameMessage').textContent=message||'ماذا ستفعل؟';document.getElementById('gamePlayers').innerHTML=liveGame.players.map((x,i)=>'<span class="game-player-chip '+(i===liveGame.turn?'active':'')+'">'+x.name+' · '+Object.values(x.stash).reduce((a,b)=>a+b,0)+' بطاقة</span>').join('');document.getElementById('roadCards').innerHTML=liveGame.road.map(c=>'<span class="play-card">'+(c==='bandit'?'🥷 قاطع طريق':goodsMeta[c][1]+' '+goodsMeta[c][0])+'</span>').join('')||'<span style="color:var(--muted)">لا توجد بطاقات بعد</span>';document.getElementById('stashCards').innerHTML=Object.entries(p.stash).filter(([,v])=>v>0).map(([k,v])=>'<span class="play-card">'+(k==='bandits'?'🥷 قطاع طرق':goodsMeta[k][1]+' '+goodsMeta[k][0])+' ×'+v+'</span>').join('')||'<span style="color:var(--muted)">المخزن فارغ</span>';document.getElementById('guardCards').innerHTML=p.guards?'<span class="play-card">🛡️ حارس ×'+p.guards+'</span>':'<span style="color:var(--muted)">لا حراس</span>';document.getElementById('deckVisual').textContent='🂠 '.repeat(Math.min(liveGame.deck.length,9))+(liveGame.deck.length>9?'…':'');document.getElementById('drawBtn').disabled=!liveGame.deck.length;document.getElementById('campBtn').disabled=!liveGame.road.length}
    function endGame(){liveGame.active=false;const gs=Object.keys(goodsMeta),pl=liveGame.players;const scores=pl.map(p=>{let total=0;for(const k of gs){const c=p.stash[k];total+=c*(c+1)/2;const max=Math.max(...pl.map(q=>q.stash[k]));if(c===max&&max>=2){const tied=pl.filter(q=>q.stash[k]===max).length;total+=tied===1?4:2}}total+=p.guards-2*p.stash.bandits;return {name:p.name,total,gold:p.stash.gold}});const high=Math.max(...scores.map(x=>x.total));const pool=scores.filter(x=>x.total===high);const hg=Math.max(...pool.map(x=>x.gold));const winners=pool.filter(x=>x.gold===hg);document.getElementById('gameMessage').textContent='انتهت الرحلة!';document.getElementById('drawBtn').disabled=true;document.getElementById('campBtn').disabled=true;document.getElementById('gameResult').innerHTML='<div class="game-summary"><h3>🏆 النتائج النهائية</h3>'+scores.sort((a,b)=>b.total-a.total||b.gold-a.gold).map(x=>'<p><strong>'+x.name+'</strong>: '+x.total+' نقطة'+(winners.some(w=>w.name===x.name)?' — الفائز!':'')+'</p>').join('')+'<small>عند التعادل، يحسم الذهب النتيجة.</small></div>';document.getElementById('gameLog').textContent='انتهت البطاقات؛ أحسنتم يا قافلة!'}
    function newGame(){if(roomPeer){cleanupPeer();}document.getElementById('networkBadge').hidden=true;document.getElementById('gameTable').hidden=true;document.getElementById('gameSetup').hidden=false;document.getElementById('gameResult').innerHTML='';document.getElementById('roomLobby').hidden=true;document.getElementById('createRoomBtn').disabled=false;renderNameFields();setGameMode('local')}

    // PeerJS room networking. The host owns the deck and validates each turn action.
    let gameMode='local',roomPeer=null,roomConnections=new Map(),roomSeats=new Map(),roomIsHost=false,roomMyIndex=-1,roomHostId='',roomExpected=2,onlineName='';
    function setGameMode(mode){gameMode=mode;document.getElementById('localSetup').hidden=mode!=='local';document.getElementById('onlineSetup').classList.toggle('active',mode==='online');document.getElementById('localModeBtn').classList.toggle('active',mode==='local');document.getElementById('onlineModeBtn').classList.toggle('active',mode==='online')}
    function toggleJoinForm(){document.getElementById('joinRoomForm').hidden=!document.getElementById('joinRoomForm').hidden}
    function peerStatus(text){const e=document.getElementById('roomStatus');if(e)e.textContent=text}
    function cleanPeerName(value){return String(value||'لاعب').replace(/[<>\u0000-\u001f]/g,'').replace(/[\"']/g,'').replace(/\s+/g,' ').trim().slice(0,18)||'لاعب'}
    function cleanupPeer(){if(roomPeer){try{roomPeer.destroy()}catch(_){}roomPeer=null}roomConnections.clear();roomSeats.clear();roomIsHost=false;roomMyIndex=-1;roomHostId='';liveGame=null}
    function createOnlineRoom(){if(typeof Peer==='undefined'){peerStatus('تعذر تحميل PeerJS. تحقق من اتصال الإنترنت ثم أعد تحميل الصفحة.');document.getElementById('roomLobby').hidden=false;return}cleanupPeer();roomIsHost=true;onlineName=cleanPeerName(document.getElementById('onlineName').value||'قائد القافلة');roomExpected=+document.getElementById('onlinePlayerCount').value;const b=document.getElementById('createRoomBtn');b.disabled=true;document.getElementById('roomLobby').hidden=false;peerStatus('جارٍ إنشاء غرفة آمنة عبر PeerJS…');roomPeer=new Peer();roomPeer.on('open',id=>{roomHostId=id;document.getElementById('roomCode').textContent=id;roomSeats.set(id,{name:onlineName,index:0});renderRoomPlayers();peerStatus('الغرفة جاهزة. أرسل رابط الدعوة أو الرمز إلى اللاعبين.');b.disabled=false});roomPeer.on('connection',conn=>{conn.on('open',()=>{});conn.on('data',data=>hostHandlePeerData(conn,data));conn.on('close',()=>{const seat=roomSeats.get(conn.peer);if(seat){roomSeats.delete(conn.peer);roomConnections.delete(conn.peer);renderRoomPlayers();peerStatus(seat.name+' انقطع اتصاله. يمكنه إعادة الانضمام قبل بدء الجولة.')}})});roomPeer.on('error',e=>{peerStatus(peerErrorText(e));b.disabled=false})}
    function peerErrorText(e){if(e?.type==='peer-unavailable')return'لم نعثر على الغرفة. تأكد من الرمز وأن المضيف متصل.';if(e?.type==='unavailable-id')return'رمز الغرفة مستخدم بالفعل. حاول إنشاء غرفة جديدة.';if(e?.type==='network')return'تعذر الاتصال بخادم الإشارة. تحقق من الإنترنت وأعد المحاولة.';if(e?.type==='browser-incompatible')return'هذا المتصفح لا يدعم اتصال WebRTC المطلوب.';return'تعذر الاتصال ('+(e?.type||'خطأ غير معروف')+'). أعد المحاولة.'}
    function roomIdentifier(raw){let v=(raw||'').trim();try{if(v.includes('://')){const u=new URL(v);v=u.searchParams.get('room')||v}}catch(_){}return v.trim()}
    function joinOnlineRoom(){if(typeof Peer==='undefined'){peerStatus('تعذر تحميل PeerJS. تحقق من اتصال الإنترنت ثم أعد تحميل الصفحة.');document.getElementById('roomLobby').hidden=false;return}const target=roomIdentifier(document.getElementById('joinRoomCode').value);if(!target){peerStatus('أدخل رمز الغرفة أو رابط الدعوة أولًا.');document.getElementById('roomLobby').hidden=false;return}cleanupPeer();roomIsHost=false;onlineName=cleanPeerName(document.getElementById('onlineName').value||'لاعب');roomHostId=target;document.getElementById('roomLobby').hidden=false;document.getElementById('roomCode').textContent='جارٍ الاتصال…';peerStatus('نتصل بالغرفة…');roomPeer=new Peer();roomPeer.on('open',()=>{const conn=roomPeer.connect(target,{reliable:true,serialization:'json',metadata:{name:onlineName}});roomConnections.set(target,conn);conn.on('open',()=>conn.send({type:'join',name:onlineName}));conn.on('data',data=>guestHandlePeerData(data));conn.on('error',e=>peerStatus(peerErrorText(e)));conn.on('close',()=>peerStatus('انقطع الاتصال بالمضيف. اترك الصفحة مفتوحة وحاول الانضمام مجددًا.'))});roomPeer.on('error',e=>peerStatus(peerErrorText(e)))}
    function hostHandlePeerData(conn,data){if(!data||typeof data!=='object')return;if(data.type==='join'){if(!roomIsHost)return;if(roomSeats.has(conn.peer)){sendToPeer(conn,{type:'welcome',index:roomSeats.get(conn.peer).index,players:roomRoster()});return}if(liveGame?.active||roomSeats.size>=roomExpected){sendToPeer(conn,{type:'rejected',reason:liveGame?.active?'بدأت الجولة بالفعل.':'الغرفة ممتلئة.'});return}const index=roomSeats.size;roomSeats.set(conn.peer,{name:cleanPeerName(data.name),index});roomConnections.set(conn.peer,conn);sendToPeer(conn,{type:'welcome',index,players:roomRoster()});renderRoomPlayers();peerStatus('انضم لاعب جديد. '+roomSeats.size+' من '+roomExpected+' مقاعد مشغولة.');broadcastRoster();return}if(data.type==='action'&&roomIsHost&&liveGame?.active){const seat=roomSeats.get(conn.peer);if(!seat||seat.index!==liveGame.turn)return;if(data.action==='draw')hostPerformDraw();if(data.action==='camp')hostPerformCamp()}}
    function roomRoster(){return [...roomSeats.values()].sort((a,b)=>a.index-b.index).map(x=>x.name)}
    function sendToPeer(conn,data){try{if(conn?.open)conn.send(data)}catch(_){}}
    function renderRoomPlayers(){const el=document.getElementById('roomPlayers');if(!el)return;el.innerHTML=[...roomSeats.values()].sort((a,b)=>a.index-b.index).map((x,i)=>'<span class="game-player-chip '+(i===0?'active':'')+'">'+(i===0?'👑 ':'')+escapeRoomText(x.name)+'</span>').join('');const start=document.getElementById('roomStartBtn');if(start)start.disabled=!roomIsHost||roomSeats.size<2||!!liveGame?.active}
    function escapeRoomText(t){const d=document.createElement('div');d.textContent=t;return d.innerHTML}
    function broadcastRoster(){if(!roomIsHost)return;const packet={type:'lobby',players:roomRoster(),expected:roomExpected};for(const c of roomConnections.values())sendToPeer(c,packet)}
    function startOnlineGame(){if(!roomIsHost||roomSeats.size<2)return;const names=roomRoster();const count=document.getElementById('gamePlayerCount');count.value=String(names.length);renderNameFields();names.forEach((name,i)=>{const input=document.getElementById('playerName'+i);if(input)input.value=name});startGame();document.getElementById('networkBadge').hidden=false;roomSeats.forEach(seat=>{});broadcastGameState('بدأت الجولة! دور '+liveGame.players[0].name);}
    function snapshotForNetwork(message){return{type:'state',players:liveGame.players,turn:liveGame.turn,road:liveGame.road,roadBandits:liveGame.roadBandits,active:liveGame.active,deckCount:liveGame.deck.length,message:message||'',scores:liveGame.active?null:calculateOnlineScores()}}
    function broadcastGameState(message){if(!roomIsHost||!liveGame)return;const packet=snapshotForNetwork(message);for(const c of roomConnections.values())sendToPeer(c,packet)}
    function calculateOnlineScores(){const gs=Object.keys(goodsMeta),pl=liveGame.players;return pl.map(p=>{let total=0;for(const k of gs){const c=p.stash[k]||0;total+=c*(c+1)/2;const max=Math.max(...pl.map(q=>q.stash[k]||0));if(c===max&&max>=2){const tied=pl.filter(q=>(q.stash[k]||0)===max).length;total+=tied===1?4:2}}total+=(p.guards||0)-2*(p.stash.bandits||0);return{name:p.name,total,gold:p.stash.gold||0}})}
    function guestHandlePeerData(data){if(!data||typeof data!=='object')return;if(data.type==='rejected'){peerStatus(data.reason);return}if(data.type==='welcome'||data.type==='lobby'){roomMyIndex=data.index??roomMyIndex;renderRoomPlayersFromGuest(data.players||[],data.expected);if(data.type==='welcome')peerStatus('انضممت إلى الغرفة. بانتظار المضيف لبدء الجولة.');return}if(data.type==='state'){liveGame={deck:new Array(data.deckCount),players:data.players,turn:data.turn,road:data.road,roadBandits:data.roadBandits,active:data.active,remote:true};document.getElementById('gameSetup').hidden=true;document.getElementById('gameTable').hidden=false;document.getElementById('networkBadge').hidden=false;document.getElementById('gameLog').textContent=data.message||'تم تحديث الجولة.';paintGame(data.message);if(!data.active&&data.scores)renderNetworkResults(data.scores)}}
    function renderRoomPlayersFromGuest(names,expected){roomSeats=new Map(names.map((name,index)=>['guest-'+index,{name,index}]));roomExpected=expected||roomExpected;renderRoomPlayers();document.getElementById('roomCode').textContent=roomHostId;document.getElementById('roomStartBtn').hidden=true}
    function sendGuestAction(action){const c=roomConnections.get(roomHostId);if(!c?.open){peerStatus('لا يوجد اتصال بالمضيف.');return}sendToPeer(c,{type:'action',action})}
    function hostPerformDraw(){localDrawCard();broadcastGameState(document.getElementById('gameLog').textContent)}
    function hostPerformCamp(){localCamp();broadcastGameState(document.getElementById('gameLog').textContent)}
    function renderNetworkResults(scores){const high=Math.max(...scores.map(x=>x.total)),pool=scores.filter(x=>x.total===high),gold=Math.max(...pool.map(x=>x.gold)),winners=pool.filter(x=>x.gold===gold);document.getElementById('gameResult').innerHTML='<div class="game-summary"><h3>🏆 النتائج النهائية</h3>'+scores.slice().sort((a,b)=>b.total-a.total||b.gold-a.gold).map(x=>'<p><strong>'+escapeRoomText(x.name)+'</strong>: '+x.total+' نقطة'+(winners.some(w=>w.name===x.name)?' — الفائز!':'')+'</p>').join('')+'<small>عند التعادل، يحسم الذهب النتيجة.</small></div>'}
    function copyText(text){if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(text);const i=document.createElement('textarea');i.value=text;document.body.appendChild(i);i.select();document.execCommand('copy');i.remove();return Promise.resolve()}
    function copyRoomCode(){copyText(roomHostId).then(()=>peerStatus('تم نسخ رمز الغرفة.'))}
    function copyRoomInvite(){const u=new URL(location.href);u.searchParams.set('room',roomHostId);copyText(u.href).then(()=>peerStatus('تم نسخ رابط الدعوة. أرسله إلى أصدقائك.'))}
    const localPaintGame=paintGame;
    paintGame=function(message){localPaintGame(message);if(liveGame?.remote){const allowed=liveGame.active&&liveGame.turn===roomMyIndex;document.getElementById('drawBtn').disabled=!allowed||!liveGame.deck.length;document.getElementById('campBtn').disabled=!allowed||!liveGame.road.length}else if(roomIsHost&&liveGame?.active){const allowed=liveGame.turn===0;document.getElementById('drawBtn').disabled=!allowed||!liveGame.deck.length;document.getElementById('campBtn').disabled=!allowed||!liveGame.road.length}};
    const localDrawCard=drawCard,localCamp=camp,localFinishTurn=finishTurn,localEndGame=endGame;
    drawCard=function(){if(liveGame?.remote){sendGuestAction('draw');return}if(roomIsHost&&liveGame?.active){hostPerformDraw();return}return localDrawCard()};
    camp=function(forced=false){if(liveGame?.remote){sendGuestAction('camp');return}if(roomIsHost&&liveGame?.active&&!forced){hostPerformCamp();return}return localCamp(forced)};
    finishTurn=function(message){const result=localFinishTurn(message);if(roomIsHost)broadcastGameState(message);return result};
    endGame=function(){const result=localEndGame();if(roomIsHost)broadcastGameState('انتهت الجولة!');return result};
    const localStartGame=startGame;startGame=function(){if(gameMode==='online'&&!roomIsHost)return;return localStartGame()};
    window.addEventListener('beforeunload',()=>{if(roomPeer)roomPeer.destroy()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeTour();closeFile()}});document.getElementById('tourModal').addEventListener('click',e=>{if(e.target.id==='tourModal')closeTour()});document.getElementById('fileModal').addEventListener('click',e=>{if(e.target.id==='fileModal')closeFile()});renderNameFields();

    const SITE_PAGES=['homePage','games','sand-silk','paper-goal','play','files','video','deck','rules','calculator','print','gameToolsPage'];
    const SITE_TITLES={homePage:'الرئيسية',games:'الألعاب الورقية','sand-silk':'رمل وحرير','paper-goal':'كرة المرمى الورقية',play:'العب الآن',files:'ملفات رمل وحرير',video:'الفيديو والشرح',deck:'البطاقات',rules:'طريقة اللعب',calculator:'حاسبة النقاط',print:'الطباعة والعلبة',gameToolsPage:'أدوات اللعب'};
    function showPage(id,updateHistory=true){const page=SITE_PAGES.includes(id)?id:'homePage';document.querySelectorAll('.page-view').forEach(view=>{const active=view.id===page;view.hidden=!active;view.classList.toggle('active',active)});document.body.classList.toggle('inner-page',page!=='homePage');const back=document.getElementById('homeBackButton'),label=document.getElementById('pageIndicator');back.hidden=page==='homePage';label.hidden=page==='homePage';label.textContent=SITE_TITLES[page]||'';if(updateHistory){const hash=page==='homePage'?'#home':'#'+page;if(location.hash!==hash)history.pushState({page},'',hash)}window.scrollTo({top:0,behavior:'instant'});}
    function pageFromLocation(){const key=(location.hash||'').slice(1);showPage(key==='home'||key==='homePage'?'homePage':SITE_PAGES.includes(key)?key:'homePage',false)}
    document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const key=link.getAttribute('href').slice(1);if(SITE_PAGES.includes(key)||key==='home'){event.preventDefault();showPage(key==='home'?'homePage':key)}}));
    window.addEventListener('popstate',pageFromLocation);window.addEventListener('hashchange',pageFromLocation);
    const invitedRoomAtLaunch=new URLSearchParams(location.search).get('room');if(invitedRoomAtLaunch){setGameMode('online');document.getElementById('joinRoomForm').hidden=false;document.getElementById('joinRoomCode').value=invitedRoomAtLaunch;document.getElementById('onlineName').value='لاعب جديد';showPage('play')}else pageFromLocation();

    const progressBar = document.getElementById("readingProgress"), backTop = document.getElementById("backTop");
    window.addEventListener("scroll", () => { const max = document.documentElement.scrollHeight - innerHeight; progressBar.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%"; backTop.classList.toggle("visible", scrollY > 520); }, {passive:true});
    backTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
