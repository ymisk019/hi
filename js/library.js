(function(){
  const FAVORITES_KEY='paper-games-favorites-v1';
  const cards=Array.from(document.querySelectorAll('.paper-game-card'));
  const search=document.getElementById('gameSearch');
  const category=document.getElementById('gameCategory');
  const favoritesButton=document.getElementById('favoritesOnlyBtn');
  const resultText=document.getElementById('gamesResultsStatus');
  const noResults=document.getElementById('gamesNoResults');
  const resetButton=document.getElementById('resetLibraryFilters');
  let favorites=new Set();
  try{const saved=JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]');if(Array.isArray(saved))favorites=new Set(saved.filter(x=>typeof x==='string'));}catch(e){}
  function renderFavoriteButtons(){document.querySelectorAll('[data-favorite-id]').forEach(function(button){const isSaved=favorites.has(button.dataset.favoriteId);button.setAttribute('aria-pressed',String(isSaved));button.classList.toggle('is-favorite',isSaved);button.textContent=isSaved?'♥ في المفضلة':'♡ أضف للمفضلة';});}
  function applyLibraryFilters(){
    const term=(search.value||'').trim().toLocaleLowerCase('ar');const chosen=category.value;const onlyFavorites=favoritesButton.getAttribute('aria-pressed')==='true';let visible=0;
    cards.forEach(function(card){const haystack=((card.dataset.search||'')+' '+card.textContent).toLocaleLowerCase('ar');const matchesText=!term||haystack.includes(term);const matchesCategory=chosen==='all'||card.dataset.category===chosen;const matchesFavorite=!onlyFavorites||favorites.has(card.dataset.gameId);const show=matchesText&&matchesCategory&&matchesFavorite;card.hidden=!show;if(show)visible++;});
    resultText.textContent='عرض '+visible+' من '+cards.length+' ألعاب';noResults.hidden=visible!==0;
  }
  document.addEventListener('click',function(event){const button=event.target.closest('[data-favorite-id]');if(!button)return;const id=button.dataset.favoriteId;if(favorites.has(id))favorites.delete(id);else favorites.add(id);try{localStorage.setItem(FAVORITES_KEY,JSON.stringify(Array.from(favorites)));}catch(e){}renderFavoriteButtons();applyLibraryFilters();});
  search.addEventListener('input',applyLibraryFilters);category.addEventListener('change',applyLibraryFilters);
  favoritesButton.addEventListener('click',function(){const active=favoritesButton.getAttribute('aria-pressed')!=='true';favoritesButton.setAttribute('aria-pressed',String(active));favoritesButton.textContent=active?'♥ عرض المفضلة فقط':'♡ المفضلة فقط';applyLibraryFilters();});
  resetButton.addEventListener('click',function(){search.value='';category.value='all';favoritesButton.setAttribute('aria-pressed','false');favoritesButton.textContent='♡ المفضلة فقط';applyLibraryFilters();search.focus();});
  renderFavoriteButtons();applyLibraryFilters();
})();

(function(){
  const grid=document.getElementById('goalScoreGrid');if(!grid)return;
  const countSelect=document.getElementById('goalPlayerCount');const result=document.getElementById('goalScoreResult');
  function readPlayers(){return Array.from(grid.querySelectorAll('.score-player')).map(function(card,index){return {name:card.querySelector('.score-player-name').value.trim()||('لاعب '+(index+1)),scores:Array.from(card.querySelectorAll('.shot-score-list input')).map(function(input){return input.value;})};});}
  function updateTotals(){const players=readPlayers();let anyEntry=false;players.forEach(function(player,index){const total=player.scores.reduce(function(sum,value){if(value!=='')anyEntry=true;const numeric=Number(value);return sum+(Number.isFinite(numeric)?Math.max(0,Math.floor(numeric)):0);},0);grid.querySelectorAll('.score-player-total')[index].textContent='المجموع: '+total;player.total=total;});if(!anyEntry){result.textContent='أدخل نقاط التسديدات بحسب منطقة الهدف في PDF.';return;}const highest=Math.max.apply(null,players.map(function(p){return p.total;}));const leaders=players.filter(function(p){return p.total===highest;});const complete=players.every(function(p){return p.scores.every(function(value){return value!=='';});});if(leaders.length>1){result.textContent=(complete?'تعادل نهائي':'تعادل مؤقت')+' بين '+leaders.map(function(p){return p.name;}).join(' و')+' ('+highest+' نقطة). عند التعادل اتبعوا قاعدة الهدف الذهبي في ملف اللعبة.';}else{result.textContent=(complete?'المتصدر النهائي: ':'المتقدم حاليًا: ')+leaders[0].name+' — '+highest+' نقطة.';}}
  function drawPlayers(preserve){const previous=preserve?readPlayers():[];const count=Number(countSelect.value);grid.innerHTML=Array.from({length:count},function(_,index){const old=previous[index]||{name:'',scores:['','','','','']};const name=String(old.name||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');return '<article class="score-player"><div class="score-player-head"><input class="score-player-name" type="text" maxlength="24" aria-label="اسم اللاعب '+(index+1)+'" placeholder="اسم اللاعب '+(index+1)+'" value="'+name+'" /><strong class="score-player-total">المجموع: 0</strong></div><ol class="shot-score-list">'+Array.from({length:5},function(_,shot){const value=String(old.scores[shot]||'');return '<li><label for="goal-p'+index+'-s'+shot+'">تسديدة '+(shot+1)+'<input id="goal-p'+index+'-s'+shot+'" type="number" min="0" step="1" inputmode="numeric" aria-label="نقاط التسديدة '+(shot+1)+' للاعب '+(index+1)+'" value="'+value+'" /></label></li>';}).join('')+'</ol></article>';}).join('');updateTotals();}
  grid.addEventListener('input',updateTotals);
  countSelect.addEventListener('change',function(){drawPlayers(true);});document.getElementById('resetGoalScores').addEventListener('click',function(){drawPlayers(false);});drawPlayers(false);
})();
