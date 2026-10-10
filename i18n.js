(function (root) {
  'use strict';
  const locales = ['zh-Hans', 'zh-Hant', 'en'];
  const messages = {
    language: ['语言', '語言', 'Language'],
    chooseLanguage: ['选择语言', '選擇語言', 'Choose language'],
    darkMode: ['深色模式', '深色模式', 'Dark mode'],
    switchToDark: ['切换到深色主题', '切換至深色主題', 'Switch to dark theme'],
    switchToLight: ['切换到浅色主题', '切換至淺色主題', 'Switch to light theme'],
    skip: ['跳转到资料库', '跳至資料庫', 'Skip to the library'],
    brandHome: ['CIE Past Paper Hub 首页', 'CIE Past Paper Hub 首頁', 'CIE Past Paper Hub home'],
    mainNav: ['主导航', '主導覽', 'Main navigation'],
    library: ['资料库', '資料庫', 'Library'],
    subjectNav: ['科目导航', '科目導覽', 'Subjects'],
    guide: ['使用指南', '使用指南', 'Guide'],
    explore: ['开始探索 <span aria-hidden="true">↗</span>', '開始探索 <span aria-hidden="true">↗</span>', 'Explore <span aria-hidden="true">↗</span>'],
    heroTitle: ['每一份真题，<br>离目标<span class="red-word">更近。</span>', '每一份真題，<br>離目標<span class="red-word">更近。</span>', 'Every paper.<br><span class="red-word">One step closer.</span>'],
    heroDescription: ['让寻找试卷，成为备考中最轻松的一步。<br>IGCSE 与 AS / A Level 历年资料，井然有序。', '讓尋找試卷，成為備考中最輕鬆的一步。<br>IGCSE 與 AS / A Level 歷年資料，井然有序。', 'Make finding a paper the easiest part of preparing.<br>IGCSE and AS / A Level resources, neatly organised.'],
    findPaper: ['寻找我的试卷 <span aria-hidden="true">→</span>', '尋找我的試卷 <span aria-hidden="true">→</span>', 'Find a paper <span aria-hidden="true">→</span>'],
    decodeFilename: ['读懂文件名 <span aria-hidden="true">↗</span>', '讀懂檔案名稱 <span aria-hidden="true">↗</span>', 'Decode a filename <span aria-hidden="true">↗</span>'],
    subjectsUnit: ['个科目', '個科目', 'subjects'],
    yearIndex: ['年份索引', '年份索引', 'year index'],
    noLogin: ['无需登录，直接查找', '無需登入，直接查找', 'No login needed'],
    papersPaired: ['试卷与答案，一起找到。', '試卷與答案，一起找到。', 'Papers and answers, together.'],
    libraryTitle: ['你的下一份练习，在这里。', '你的下一份練習，在這裡。', 'Your next practice starts here.'],
    search: ['搜索', '搜尋', 'Search'],
    searchPlaceholder: ['搜索科目、代码、年份或文件名，例如 9709 2024', '搜尋科目、代碼、年份或檔案名稱，例如 9709 2024', 'Search subjects, codes, years or filenames, e.g. 9709 2024'],
    searchLabel: ['搜索科目、代码、年份或文件名', '搜尋科目、代碼、年份或檔案名稱', 'Search subjects, codes, years or filenames'],
    searchButton: ['搜索 <span aria-hidden="true">→</span>', '搜尋 <span aria-hidden="true">→</span>', 'Search <span aria-hidden="true">→</span>'],
    recentSearches: ['最近搜索', '最近搜尋', 'Recent searches'],
    clearAll: ['清空记录', '清空紀錄', 'Clear history'],
    historyPrivacy: ['仅保存在此浏览器', '僅儲存在此瀏覽器', 'Saved only in this browser'],
    historyEmpty: ['还没有搜索记录。搜索后会出现在这里。', '還沒有搜尋紀錄。搜尋後會出現在這裡。', 'No recent searches yet. Your searches will appear here.'],
    historySearch: ['再次搜索：{query}', '再次搜尋：{query}', 'Search again: {query}'],
    historyRemove: ['删除搜索记录：{query}', '刪除搜尋紀錄：{query}', 'Remove recent search: {query}'],
    trySearch: ['试试搜索', '試試搜尋', 'Try'],
    quickMath: ['9709 · 数学', '9709 · 數學', '9709 · Maths'],
    quickPhysics: ['0625 · 物理', '0625 · 物理', '0625 · Physics'],
    quickEconomics: ['9708 · 经济', '9708 · 經濟', '9708 · Economics'],
    searchHint: ['中英文、文件名，随你输入', '中英文、檔案名稱，隨你輸入', 'Search in English or Chinese'],
    browseBySubject: ['按科目浏览', '按科目瀏覽', 'Browse by subject'],
    subjectPlaceholder: ['科目名称或代码', '科目名稱或代碼', 'Subject name or code'],
    subjectSearchLabel: ['筛选科目列表', '篩選科目列表', 'Filter the subject list'],
    qualification: ['课程类别', '課程類別', 'Qualification'],
    all: ['全部', '全部', 'All'],
    subjectTip: ['名称不同？<br>输入四位科目代码，定位更准确。', '名稱不同？<br>輸入四位科目代碼，定位更準確。', 'Different subject name?<br>Try the four-digit syllabus code.'],
    year: ['年份', '年份', 'Year'],
    season: ['考季', '考季', 'Session'],
    documentType: ['资料类型', '資料類型', 'Document type'],
    component: ['卷号', '卷號', 'Paper'],
    reset: ['重置筛选', '重設篩選', 'Reset filters'],
    sort: ['排序', '排序', 'Sort'],
    activeFilters: ['当前筛选条件', '目前篩選條件', 'Active filters'],
    fileSubject: ['文件 / 科目', '檔案 / 科目', 'File / subject'],
    actions: ['操作', '操作', 'Actions'],
    pagination: ['结果分页', '結果分頁', 'Results pagination'],
    filenameStripTitle: ['读懂一个文件名，就读懂一份资料。', '讀懂一個檔案名稱，就讀懂一份資料。', 'A filename tells a whole story.'],
    filenameStripExample: ['<code>9709_s24_qp_11.pdf</code> &nbsp; 数学 · 2024 夏季 · 试卷 · 卷号 11', '<code>9709_s24_qp_11.pdf</code> &nbsp; 數學 · 2024 夏季 · 試卷 · 卷號 11', '<code>9709_s24_qp_11.pdf</code> &nbsp; Maths · May / Jun 2024 · Question paper · Paper 11'],
    viewGuide: ['查看使用指南 <span aria-hidden="true">↗</span>', '查看使用指南 <span aria-hidden="true">↗</span>', 'View the guide <span aria-hidden="true">↗</span>'],
    footerTagline: ['为每一次认真准备，留一条清晰的路。', '為每一次認真準備，留一條清晰的路。', 'A clearer path for every moment of preparation.'],
    independent: ['独立学习项目，与 Cambridge、剑桥大学及原站无关联。', '獨立學習專案，與 Cambridge、劍橋大學及原站無關聯。', 'An independent study project, unaffiliated with Cambridge, the University of Cambridge or the source website.'],
    closeGuide: ['关闭使用指南', '關閉使用指南', 'Close the guide'],
    guideTitle: ['找到试卷，只需几步。', '找到試卷，只需幾步。', 'Find a paper in a few steps.'],
    guideStep1: ['先找科目', '先找科目', 'Choose a subject'],
    guideStep1Body: ['点击科目，或直接输入中文名、英文名、四位代码。', '點選科目，或直接輸入中文名、英文名、四位代碼。', 'Choose a subject or search by its English or Chinese name, or four-digit code.'],
    guideStep2: ['缩小范围', '縮小範圍', 'Narrow it down'],
    guideStep2Body: ['年份、考季、资料类型和卷号可以同时筛选。搜索支持多个关键词，例如 <code>9709 2024 夏季 答案</code>。', '年份、考季、資料類型和卷號可以同時篩選。搜尋支援多個關鍵字，例如 <code>9709 2024 夏季 答案</code>。', 'Combine year, session, document type and paper filters. Search accepts multiple keywords, such as <code>9709 2024 summer answers</code>.'],
    guideStep3: ['配对练习与答案', '配對練習與答案', 'Pair papers with answers'],
    guideStep3Body: ['QP 是试卷，MS 是评分方案，ER 是考官报告，GT 是等级阈值。点击“对应答案”可找到相同年份、考季和卷号的 MS。', 'QP 是試卷，MS 是評分方案，ER 是考官報告，GT 是等級閾值。點選「對應答案」可找到相同年份、考季和卷號的 MS。', 'QP means question paper, MS mark scheme, ER examiner report and GT grade thresholds. “Mark scheme” opens the matching MS for the same year, session and paper.'],
    filenameDescription: ['9709_s24_qp_11.pdf：科目代码 9709，2024 年夏季，试卷，卷号 11', '9709_s24_qp_11.pdf：科目代碼 9709，2024 年夏季，試卷，卷號 11', '9709_s24_qp_11.pdf: subject code 9709, May / June 2024, question paper, paper 11'],
    subjectCode: ['科目代码', '科目代碼', 'Subject code'],
    summer2024: ['夏季 2024', '夏季 2024', 'May / Jun 2024'],
    questionPaper: ['试卷', '試卷', 'Question paper'],
    guideNote: ['考季对应：m = 二/三月；s = 五/六月；w = 十/十一月。部分通用资料不属于单一考季。文件在新标签页中打开，可使用浏览器 PDF 工具栏保存。', '考季對應：m = 二/三月；s = 五/六月；w = 十/十一月。部分通用資料不屬於單一考季。檔案在新分頁中開啟，可使用瀏覽器 PDF 工具列儲存。', 'Sessions: m = February / March; s = May / June; w = October / November. General resources may cover more than one session. Files open in a new tab; use the browser’s PDF toolbar to save them.'],
    downloadIndex: ['下载资料索引 JSON <span aria-hidden="true">↓</span>', '下載資料索引 JSON <span aria-hidden="true">↓</span>', 'Download the JSON index <span aria-hidden="true">↓</span>'],
    description: ['按科目、年份、考季及资料类型快速查找 IGCSE 与 AS/A Level 历年试卷。', '按科目、年份、考季及資料類型快速查找 IGCSE 與 AS/A Level 歷年試卷。', 'Find IGCSE and AS/A Level past papers by subject, year, session and document type.'],
    loadingFailed: ['资料索引暂时无法加载', '資料索引暫時無法載入', 'The paper index could not be loaded'],
    retry: ['请刷新页面后重试。', '請重新整理頁面後再試。', 'Refresh the page to try again.'],
    indexFailed: ['索引加载失败', '索引載入失敗', 'Index unavailable'],
    indexed: ['{count} 份资料已收录', '已收錄 {count} 份資料', '{count} resources indexed'],
    indexing: [' · 索引整理中', ' · 索引整理中', ' · Indexing in progress'],
    snapshot: ['索引更新：{date} · {count} 份资料。', '索引更新：{date} · {count} 份資料。', 'Index updated: {date} · {count} resources.'],
    allYears: ['全部年份', '全部年份', 'All years'],
    yearValue: ['{year} 年', '{year} 年', '{year}'],
    allSeasons: ['全部考季', '全部考季', 'All sessions'],
    allResources: ['全部资料', '全部資料', 'All resources'],
    allComponents: ['全部卷号', '全部卷號', 'All papers'],
    componentValue: ['卷号 {component}', '卷號 {component}', 'Paper {component}'],
    newest: ['年份：从新到旧', '年份：從新到舊', 'Year: newest first'],
    oldest: ['年份：从旧到新', '年份：從舊到新', 'Year: oldest first'],
    filename: ['按文件名排序', '按檔案名稱排序', 'Filename'],
    allSubjects: ['全部科目', '全部科目', 'All subjects'],
    noSubjects: ['未找到科目。试试四位代码。', '找不到科目。試試四位代碼。', 'No subjects found. Try a four-digit code.'],
    queryChip: ['搜索：{query}', '搜尋：{query}', 'Search: {query}'],
    removeFilter: ['移除筛选：{value}', '移除篩選：{value}', 'Remove filter: {value}'],
    openFileAria: ['打开 {file}，新标签页', '開啟 {file}，新分頁', 'Open {file} in a new tab'],
    general: ['通用资料', '通用資料', 'General resources'],
    openFile: ['打开 {extension}', '開啟 {extension}', 'Open {extension}'],
    pairedAnswers: ['对应答案', '對應答案', 'Mark scheme'],
    pairedPaper: ['对应试卷', '對應試卷', 'Question paper'],
    lessons: ['{count} 题讲解 ↗', '{count} 題講解 ↗', '{count} explanations ↗'],
    page: ['第 {page} 页', '第 {page} 頁', 'Page {page}'],
    previous: ['上一页', '上一頁', 'Previous page'],
    next: ['下一页', '下一頁', 'Next page'],
    showing: ['显示 {start}—{end} / {count} 份', '顯示 {start}—{end} / {count} 份', 'Showing {start}–{end} of {count}'],
    searchResults: ['搜索结果', '搜尋結果', 'Search results'],
    levelResources: ['{level} 资料', '{level} 資料', '{level} resources'],
    resourceCount: ['{count} 份资料', '{count} 份資料', '{count} resources'],
    emptyTitle: ['这里暂时没有匹配的资料。', '這裡暫時沒有符合的資料。', 'No matching resources yet.'],
    emptyBody: ['试试缩短关键词，或减少年份、考季等筛选条件。<br>并非所有科目都在每个考季开考。', '試試縮短關鍵字，或減少年份、考季等篩選條件。<br>並非所有科目都在每個考季開考。', 'Try shorter keywords or fewer filters.<br>Not every subject is offered in every session.'],
    emptyReset: ['清除筛选，重新查找', '清除篩選，重新查找', 'Clear filters and try again'],
    closeLessons: ['关闭讲解列表', '關閉講解清單', 'Close the explanations'],
    lessonsTitle: ['逐题讲解', '逐題講解', 'Question explanations'],
    lessonsNote: ['视频在外部页面打开。', '影片在外部分頁中開啟。', 'Videos open on an external page.'],
    lessonQuestion: ['第 {question} 题讲解 ↗', '第 {question} 題講解 ↗', 'Question {question} explanation ↗'],
    type_qp: ['试卷', '試卷', 'Question paper'], type_ms: ['评分方案', '評分方案', 'Mark scheme'],
    type_er: ['考官报告', '考官報告', 'Examiner report'], type_gt: ['等级阈值', '等級閾值', 'Grade thresholds'],
    type_in: ['附页材料', '附頁材料', 'Insert'], type_i2: ['附页材料 2', '附頁材料 2', 'Insert 2'],
    type_ci: ['保密说明', '保密說明', 'Confidential instructions'], type_sy: ['考试大纲', '考試大綱', 'Syllabus'],
    type_sp: ['样卷', '樣卷', 'Specimen paper'], type_sm: ['样卷评分方案', '樣卷評分方案', 'Specimen mark scheme'],
    type_sf: ['补充资料', '補充資料', 'Supplementary files'], type_tn: ['教师说明', '教師說明', 'Teacher notes'],
    type_rp: ['角色扮演', '角色扮演', 'Role play'], type_audio: ['听力音频', '聽力音訊', 'Listening audio'],
    type_other: ['其他资料', '其他資料', 'Other resources'],
    season_m: ['春季', '春季', 'Feb / Mar'], season_s: ['夏季', '夏季', 'May / Jun'],
    season_w: ['冬季', '冬季', 'Oct / Nov'], season_y: ['通用 / 全年', '通用 / 全年', 'General / all year']
  };
  const traditionalSubjects = {
    '体育':'體育', '商学':'商學', '会计':'會計', '经济':'經濟', '历史':'歷史', '英语附加':'英語附加',
    '计算机科学':'電腦科學', '社会学':'社會學', '英语母语':'英語母語', '中文母语':'中文母語',
    '英语(无口语)':'英語（無口語）', '英语(带口语)':'英語（含口語）', '数学':'數學', '数学附加':'附加數學',
    '数学国际':'國際數學', '化学':'化學', '环境管理':'環境管理', '运动和体育':'運動與體育',
    '英语':'英語', '高等数学':'高等數學', '心理学':'心理學', '应用信息技术':'應用資訊科技'
  };
  let locale = 'zh-Hans';
  function valid(value) { return locales.includes(value); }
  try { const saved = localStorage.getItem('cie-hub-language'); if (valid(saved)) locale = saved; } catch {}
  const requested = new URLSearchParams(location.search).get('lang');
  if (valid(requested)) locale = requested;
  function t(key, variables = {}) {
    const entry = messages[key];
    if (!entry) return key;
    return entry[locales.indexOf(locale)].replace(/\{(\w+)\}/g, (all, name) => variables[name] ?? all);
  }
  function apply(container = document) {
    container.querySelectorAll('[data-i18n]').forEach(el => {
      const value = t(el.dataset.i18n);
      if (el.hasAttribute('data-i18n-html')) el.innerHTML = value;
      else el.textContent = value;
    });
    for (const [attribute, dataKey] of [['aria-label','i18nAria'], ['placeholder','i18nPlaceholder']]) {
      container.querySelectorAll(`[data-${dataKey.replace(/[A-Z]/g, c => '-'+c.toLowerCase())}]`).forEach(el => el.setAttribute(attribute, t(el.dataset[dataKey])));
    }
  }
  function setLocale(value) {
    if (!valid(value)) return;
    locale = value;
    try { localStorage.setItem('cie-hub-language', locale); } catch {}
    document.documentElement.lang = locale;
    document.querySelector('meta[name="description"]').content = 'CIE Past Paper Hub: '+t('description');
    apply();
    document.getElementById('language-label').textContent = {'en':'English','zh-Hant':'繁體中文','zh-Hans':'简体中文'}[locale];
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-checked',String(button.dataset.language===locale)));
    root.HubAppearance?.syncUI();
  }
  const api = {t, apply, setLocale, valid, get locale() {return locale;},
    subjectName: subject => locale === 'en' ? subject.en : locale === 'zh-Hant' ? traditionalSubjects[subject.name] || subject.name : subject.name,
    typeName: type => t('type_'+type), seasonName: season => t('season_'+season)};
  root.HubI18n = api;
})(window);
