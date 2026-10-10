(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const data = window.HUB_DATA;
  const S = window.HubSearch;
  const I = window.HubI18n;
  const t = (key, values) => I.t(key, values);
  const esc = str => String(str ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = n => Number(n).toLocaleString(I.locale === 'en' ? 'en-GB' : I.locale === 'zh-Hant' ? 'zh-TW' : 'zh-CN');
  const dialog = $('guide-dialog');
  const guideHTML = dialog.innerHTML;
  I.setLocale(I.locale);
  $('theme-toggle').addEventListener('click',()=>window.HubAppearance.setTheme(window.HubAppearance.theme==='dark'?'light':'dark'));
  function setupLanguageMenu(onChange) {
    const trigger=$('language-trigger'),menu=$('language-menu');
    const options=[...menu.querySelectorAll('[data-language]')];
    let closing;
    function openMenu(focusIndex) {
      clearTimeout(closing);menu.hidden=false;menu.inert=false;
      trigger.setAttribute('aria-expanded','true');
      requestAnimationFrame(()=>{if(trigger.getAttribute('aria-expanded')==='true')menu.classList.add('is-open');});
      if(typeof focusIndex==='number')options[focusIndex].focus();
    }
    function closeMenu(restoreFocus=false) {
      trigger.setAttribute('aria-expanded','false');menu.classList.remove('is-open');
      if(restoreFocus)trigger.focus();
      menu.inert=true;clearTimeout(closing);
      closing=setTimeout(()=>{menu.hidden=true;},matchMedia('(prefers-reduced-motion: reduce)').matches?0:180);
    }
    trigger.addEventListener('click',event=>{
      if(trigger.getAttribute('aria-expanded')==='true')closeMenu();
      else openMenu(event.detail===0?Math.max(0,options.findIndex(option=>option.dataset.language===I.locale)):undefined);
    });
    trigger.addEventListener('keydown',event=>{
      if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();openMenu(event.key==='ArrowDown'?0:options.length-1);}
    });
    menu.addEventListener('click',event=>{
      const button=event.target.closest('[data-language]');
      if(button){onChange(button.dataset.language);closeMenu(true);}
    });
    menu.addEventListener('keydown',event=>{
      const index=options.indexOf(document.activeElement);
      if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
        event.preventDefault();
        const next=event.key==='Home'?0:event.key==='End'?options.length-1:(index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;
        options[next].focus();
      }
    });
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&trigger.getAttribute('aria-expanded')==='true'){event.preventDefault();closeMenu(true);}});
    document.addEventListener('click',event=>{if(!event.composedPath().some(el=>el.classList?.contains('language-control')))closeMenu();});
    document.addEventListener('focusin',event=>{if(!event.target.closest('.language-control')&&trigger.getAttribute('aria-expanded')==='true')closeMenu();});
  }
  if (!data || !S) {
    function renderFailure() {
      $('paper-list').innerHTML = `<div class="empty-state"><h4>${t('loadingFailed')}</h4><p>${t('retry')}</p></div>`;
      $('index-status').textContent = t('indexFailed');
    }
    setupLanguageMenu(locale => { I.setLocale(locale); renderFailure(); });
    renderFailure();
    return;
  }
  const subjects = data.subjects;
  const subjectMap = Object.fromEntries(subjects.map(s => [s.code,s]));
  const papers = data.files.map(f => S.parse(f,subjectMap));
  const paperMap = Object.fromEntries(papers.map(p => [p.file,p]));
  const counts = papers.reduce((acc,p) => (acc[p.code] = (acc[p.code] || 0) + 1, acc), {});
  const defaults = {query:'', subject:'', level:'', year:'', season:'', type:'', component:'', sort:'newest', page:1};
  const years = [...new Set(papers.map(p=>p.year).filter(Boolean))].sort((a,b)=>b-a);
  const components = [...new Set(papers.flatMap(p=>p.components))].sort((a,b)=>Number(a)-Number(b));
  const markSchemes = {};
  papers.filter(p=>p.type==='ms').forEach(p=>{const key=p.code+'_'+p.year+'_'+p.season;(markSchemes[key] ||= []).push(p);});
  const availableTypes = Object.keys(S.types).filter(type=>papers.some(p=>p.type===type));
  let state = {...defaults};
  let filtered = [];
  let dialogFile = '';
  const size = 12;
  $('subject-total').textContent = subjects.length;
  $('sidebar-total').textContent = subjects.length;

  function snapshotStatus() {
    const el = $('guide-status');
    if (el) el.textContent = t('snapshot', {date:data.meta.capturedAt, count:fmt(papers.length)});
  }
  function setOptions(id, options) {
    $(id).replaceChildren(...options.map(([value,label])=>new Option(label,value)));
  }
  function translateControls() {
    $('index-status').textContent = t('indexed',{count:fmt(papers.length)})+(data.meta.catalogComplete ? '' : t('indexing'));
    setOptions('year-select', [['',t('allYears')], ...years.map(y=>[y,t('yearValue',{year:y})])]);
    setOptions('season-select', [['',t('allSeasons')], ...Object.keys(S.seasons).map(s=>[s,I.seasonName(s)+(s==='y'||I.locale==='en'?'':' · '+S.seasons[s][1])])]);
    setOptions('type-select', [['',t('allResources')], ...availableTypes.map(type=>[type,I.typeName(type)+(type==='other'||type==='audio'?'':' · '+type.toUpperCase())])]);
    setOptions('component-select', [['',t('allComponents')], ...components.map(c=>[c,t('componentValue',{component:c})])]);
    setOptions('sort-select', ['newest','oldest','filename'].map(mode=>[mode,t(mode)]));
    snapshotStatus();
  }
  function fromURL() {
    const params = new URLSearchParams(location.search);
    for (const key of Object.keys(defaults)) {
      const value = params.get(key === 'query' ? 'q' : key);
      if (value !== null) state[key] = key === 'page' ? Math.max(1,parseInt(value,10)||1) : value;
    }
    state.query = state.query.slice(0,160);
    if (state.subject && !subjectMap[state.subject]) state.subject = '';
    if (!['','IGCSE','A Level'].includes(state.level)) state.level='';
    if (state.year && !years.includes(Number(state.year))) state.year='';
    if (state.season && !S.seasons[state.season]) state.season='';
    if (state.type && !S.types[state.type]) state.type='';
    if (state.component && !components.includes(state.component)) state.component='';
    if (!['newest','oldest','filename'].includes(state.sort)) state.sort='newest';
  }
  function saveURL() {
    const params = new URLSearchParams();
    for (const [key,value] of Object.entries(state)) {
      if (value !== defaults[key] && value !== '') params.set(key==='query'?'q':key,value);
    }
    params.set('lang',I.locale);
    history.replaceState(null,'',location.pathname+'?'+params.toString()+location.hash);
  }
  function syncInputs() {
    $('global-search').value=state.query;
    for (const key of ['year','season','type','component','sort']) $(key+'-select').value=state[key];
    document.querySelectorAll('[data-level]').forEach(button=>{
      button.classList.toggle('active',button.dataset.level===state.level);
      button.setAttribute('aria-pressed',String(button.dataset.level===state.level));
    });
  }
  function renderSubjects() {
    const term=S.normalize($('subject-search').value);
    const visible = subjects.filter(s=>(!state.level||s.level===state.level)&&S.subjectWords(s).includes(term));
    let html=`<button class="subject-button ${!state.subject?'active':''}" data-subject="" aria-pressed="${!state.subject}"><span class="subject-label">${t('allSubjects')}</span><span class="subject-count">${fmt(papers.filter(p=>!state.level||p.subject?.level===state.level).length)}</span></button>`;
    for (const level of ['IGCSE','A Level']) {
      const group=visible.filter(s=>s.level===level);
      if (!group.length) continue;
      html+=`<div class="subject-group">${level==='IGCSE'?'IGCSE':'AS & A LEVEL'}</div>`;
      html+=group.map(s=>`<button class="subject-button ${s.code===state.subject?'active':''}" data-subject="${s.code}" aria-pressed="${s.code===state.subject}" title="${esc(s.en)}"><span class="subject-label"><span class="subject-code">${s.code}</span>${esc(I.subjectName(s))}</span><span class="subject-count">${fmt(counts[s.code]||0)}</span></button>`).join('');
    }
    if (!visible.length) html+=`<p class="subject-empty">${t('noSubjects')}</p>`;
    $('subject-list').innerHTML=html;
  }
  function renderChips() {
    const labels={query:state.query?t('queryChip',{query:state.query}):'',subject:state.subject?`${state.subject} ${I.subjectName(subjectMap[state.subject])}`:'',level:state.level,
      year:state.year?t('yearValue',{year:state.year}):'',season:state.season?I.seasonName(state.season):'',type:state.type?I.typeName(state.type):'',component:state.component?t('componentValue',{component:state.component}):''};
    $('active-filters').innerHTML=Object.entries(labels).filter(([,value])=>value).map(([key,value])=>`<button class="filter-chip" data-remove="${key}" aria-label="${esc(t('removeFilter',{value}))}">${esc(value)}<b aria-hidden="true">×</b></button>`).join('');
    $('reset-button').hidden=!Object.values(labels).some(Boolean);
  }
  function paperRow(p) {
    const counterpart=p.type==='qp'?p.file.replace(/_qp(?=_|\.)/,'_ms'):p.type==='ms'?p.file.replace(/_ms(?=_|\.)/,'_qp'):'';
    const paired = counterpart&&paperMap[counterpart] || (p.type==='qp'&&p.components.length ? (markSchemes[p.code+'_'+p.year+'_'+p.season]||[]).find(ms=>p.components.every(c=>ms.components.includes(c))) : null);
    const lessonCount=Object.keys(data.lessons[p.file]||{}).length;
    return `<article class="paper-row"><div class="paper-info"><span class="file-icon ${p.type==='ms'?'ms':p.type==='qp'?'':'other'}" aria-hidden="true">${p.rawType.toUpperCase()||p.extension}</span><div><a class="paper-filename" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('openFileAria',{file:p.file}))}">${esc(p.file)}</a><div class="paper-subtitle"><span>${esc(p.subject?I.subjectName(p.subject):p.code)}</span><span>${esc(p.subject?.level||'')}</span><span>${esc(I.typeName(p.type))}${p.component?' · '+p.component:''}</span></div></div></div><div class="season-block">${p.year||t('general')}${p.year?' · '+I.seasonName(p.season):''}<span>${I.locale==='en'?'':S.seasons[p.season][1]}</span></div><div class="paper-actions"><a class="open-link" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('openFileAria',{file:p.file}))}">${t('openFile',{extension:esc(p.extension)})} <span aria-hidden="true">↗</span></a>${paired?`<a class="paired-link" href="${esc(paired.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(t('openFileAria',{file:paired.file}))}">${t(p.type==='qp'?'pairedAnswers':'pairedPaper')}</a>`:''}${lessonCount?`<button class="lesson-button" data-lessons="${esc(p.file)}">${t('lessons',{count:lessonCount})}</button>`:''}</div></article>`;
  }
  function renderPagination() {
    const totalPages=Math.max(1,Math.ceil(filtered.length/size));
    const pages=[...new Set([1,state.page-1,state.page,state.page+1,totalPages])].filter(n=>n>0&&n<=totalPages).sort((a,b)=>a-b);
    let last=0;
    const buttons=pages.map(n=>{const gap=n-last>1&&last?'<span class="ellipsis">…</span>':'';last=n;return gap+`<button data-page="${n}" class="${n===state.page?'current':''}" ${n===state.page?'aria-current="page"':''} aria-label="${t('page',{page:n})}">${n}</button>`;}).join('');
    const start=filtered.length?(state.page-1)*size+1:0,end=Math.min(state.page*size,filtered.length);
    $('pagination').innerHTML=filtered.length?`<span>${t('showing',{start:fmt(start),end:fmt(end),count:fmt(filtered.length)})}</span><div class="pagination-controls"><button data-page="${state.page-1}" ${state.page===1?'disabled':''} aria-label="${t('previous')}">‹</button>${buttons}<button data-page="${state.page+1}" ${state.page===totalPages?'disabled':''} aria-label="${t('next')}">›</button></div>`:'';
  }
  function render() {
    filtered=S.filter(papers,state,subjects).sort(S.compare(state.sort));
    state.page=Math.min(Math.max(1,state.page),Math.max(1,Math.ceil(filtered.length/size)));
    $('result-title').textContent=state.subject?`${I.subjectName(subjectMap[state.subject])} · ${state.subject}`:state.query?t('searchResults'):state.level?t('levelResources',{level:state.level}):t('allResources');
    $('result-count').textContent=t('resourceCount',{count:fmt(filtered.length)});
    $('paper-list').innerHTML=filtered.length?filtered.slice((state.page-1)*size,state.page*size).map(paperRow).join(''):`<div class="empty-state"><div class="empty-symbol" aria-hidden="true">⌕</div><h4>${t('emptyTitle')}</h4><p>${t('emptyBody')}</p><button id="empty-reset">${t('emptyReset')}</button></div>`;
    renderChips();renderPagination();renderSubjects();saveURL();
  }
  function update(patch) {state={...state,...patch,page:patch.page||1};syncInputs();render();}
  function reset() {state={...defaults};$('subject-search').value='';syncInputs();render();}

  const historyKey = 'cie-hub-search-history';
  function readHistory() {
    try {
      const saved=JSON.parse(localStorage.getItem(historyKey)||'[]');
      const seen=new Set();
      return (Array.isArray(saved)?saved:[]).filter(value=>{
        if(typeof value!=='string'||!value.trim()||value.length>160)return false;
        const key=S.normalize(value);if(seen.has(key))return false;seen.add(key);return true;
      }).slice(0,10);
    } catch {return [];}
  }
  let recentSearches = readHistory();
  function persistHistory() {try {localStorage.setItem(historyKey,JSON.stringify(recentSearches));} catch {}}
  function recordSearch(query) {
    const value=query.trim().slice(0,160);
    if(!value)return;
    recentSearches=[value,...recentSearches.filter(item=>S.normalize(item)!==S.normalize(value))].slice(0,10);
    persistHistory();renderHistory();
  }
  function renderHistory() {
    $('clear-history').hidden=!recentSearches.length;
    $('history-items').innerHTML=recentSearches.length?recentSearches.map((query,index)=>`<div class="history-row"><button type="button" class="history-query" data-history-index="${index}" aria-label="${esc(t('historySearch',{query}))}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 11a9 9 0 1 1 2 7M3 5v6h6M12 7v5l3 2"/></svg><span>${esc(query)}</span><span class="history-reuse" aria-hidden="true">↗</span></button><button type="button" class="history-remove" data-history-remove="${index}" aria-label="${esc(t('historyRemove',{query}))}">×</button></div>`).join(''):`<p class="history-empty">${t('historyEmpty')}</p>`;
  }
  function showHistory() {renderHistory();$('search-history').hidden=false;$('global-search').setAttribute('aria-expanded','true');}
  function hideHistory() {$('search-history').hidden=true;$('global-search').setAttribute('aria-expanded','false');}
  $('global-search').setAttribute('aria-controls','search-history');
  $('global-search').setAttribute('aria-expanded','false');
  $('global-search').addEventListener('focus',showHistory);
  $('global-search').addEventListener('click',showHistory);
  $('history-items').addEventListener('click',event=>{
    const remove=event.target.closest('[data-history-remove]');
    if(remove){recentSearches.splice(Number(remove.dataset.historyRemove),1);persistHistory();renderHistory();return;}
    const button=event.target.closest('[data-history-index]');
    if(button){const query=recentSearches[Number(button.dataset.historyIndex)];clearTimeout(timer);state={...defaults};$('subject-search').value='';update({query});recordSearch(query);hideHistory();}
  });
  $('clear-history').addEventListener('click',()=>{recentSearches=[];persistHistory();renderHistory();});
  document.addEventListener('click',event=>{if(!event.composedPath().some(el=>el.classList?.contains('search-panel')))hideHistory();});
  window.addEventListener('storage',event=>{if(event.key===historyKey){recentSearches=readHistory();renderHistory();}});

  let timer;
  $('global-search').addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>update({query:$('global-search').value}),140);});
  $('search-form').addEventListener('submit',event=>{event.preventDefault();clearTimeout(timer);const query=$('global-search').value;update({query});recordSearch(query);hideHistory();});
  $('subject-search').addEventListener('input',renderSubjects);
  for (const key of ['year','season','type','component','sort']) $(key+'-select').addEventListener('change',event=>update({[key]:event.target.value}));
  $('subject-list').addEventListener('click',event=>{const button=event.target.closest('[data-subject]');if(button)update({subject:button.dataset.subject});});
  document.querySelectorAll('[data-level]').forEach(button=>button.addEventListener('click',()=>update({level:button.dataset.level,subject:''})));
  document.querySelectorAll('[data-query]').forEach(button=>button.addEventListener('click',()=>{clearTimeout(timer);state={...defaults};$('subject-search').value='';update({query:button.dataset.query});recordSearch(button.dataset.query);hideHistory();}));
  $('active-filters').addEventListener('click',event=>{const button=event.target.closest('[data-remove]');if(button)update({[button.dataset.remove]:''});});
  $('reset-button').addEventListener('click',reset);
  $('paper-list').addEventListener('click',event=>{
    if(event.target.closest('#empty-reset'))reset();
    const button=event.target.closest('[data-lessons]');
    if(button)showLessons(button.dataset.lessons);
  });
  $('pagination').addEventListener('click',event=>{const button=event.target.closest('[data-page]');if(!button||button.disabled)return;update({page:Number(button.dataset.page)});$('result-title').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')hideHistory();
    const tag=document.activeElement.tagName;
    if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(tag)&&!dialog.open){event.preventDefault();$('global-search').focus();$('library').scrollIntoView({block:'start'});}
  });
  function renderGuide() {
    dialogFile='';dialog.innerHTML=guideHTML;I.apply(dialog);snapshotStatus();
    dialog.querySelector('#close-guide').addEventListener('click',()=>dialog.close());
  }
  function showGuide() {renderGuide();dialog.showModal();}
  ['help-button','hero-guide','bottom-guide'].forEach(id=>$(id).addEventListener('click',showGuide));
  $('close-guide').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
  function safeLessonURL(url) {try {const parsed=new URL(url);return ['http:','https:'].includes(parsed.protocol)?parsed.href:null;} catch {return null;}}
  function renderLessons(file) {
    dialogFile=file;
    const links=Object.entries(data.lessons[file]||{}).map(([question,url])=>[question,safeLessonURL(url)]).filter(([,url])=>url);
    dialog.innerHTML=`<div class="dialog-heading"><span class="eyebrow">VIDEO EXPLANATIONS</span><button id="close-guide" aria-label="${t('closeLessons')}">×</button></div><h2 id="guide-title">${t('lessonsTitle')}</h2><p class="dialog-note">${esc(file)} · ${t('lessonsNote')}</p><ul class="lesson-list">${links.map(([question,url])=>`<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${t('lessonQuestion',{question:esc(question)})}</a></li>`).join('')}</ul>`;
    dialog.querySelector('#close-guide').addEventListener('click',()=>dialog.close());
  }
  function showLessons(file) {renderLessons(file);dialog.showModal();}
  function changeLanguage(locale) {
    clearTimeout(timer);state.query=$('global-search').value;
    I.setLocale(locale);translateControls();syncInputs();render();renderHistory();
    if(dialog.open){if(dialogFile)renderLessons(dialogFile);else renderGuide();}
  }
  setupLanguageMenu(changeLanguage);
  window.addEventListener('popstate',()=>{state={...defaults};fromURL();const lang=new URLSearchParams(location.search).get('lang');if(I.valid(lang))I.setLocale(lang);translateControls();syncInputs();render();renderHistory();});
  fromURL();translateControls();syncInputs();render();renderHistory();
})();
