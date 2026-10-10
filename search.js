(function (root) {
  'use strict';
  const types = {
    qp: ['试卷', 'Question paper questionpaper questions exam 试题 真题 卷子'],
    ms: ['评分方案', 'Mark scheme markscheme answer answers solution solutions 答案 评分标准'],
    er: ['考官报告', 'Examiner report reports 考官报告'],
    gt: ['等级阈值', 'Grade threshold thresholds boundaries 分数线 等级阈值'],
    in: ['附页材料', 'Insert inserts 附页 材料'],
    i2: ['附页材料 2', 'Insert second inserts 附页 材料'],
    ci: ['保密说明', 'Confidential instructions 保密说明 实验说明'],
    sy: ['考试大纲', 'Syllabus 大纲 考纲'],
    sp: ['样卷', 'Specimen paper 样卷'],
    sm: ['样卷评分方案', 'Specimen mark scheme 答案 样卷评分'],
    sf: ['补充资料', 'Supplementary files 补充资料'],
    tn: ['教师说明', 'Teacher notes 教师说明'],
    rp: ['角色扮演', 'Role play 角色扮演'],
    audio: ['听力音频', 'Audio listening recording mp3 听力 音频 音讯 录音'],
    other: ['其他资料', 'Other resources 其他资料']
  };
  const seasons = {
    m: ['春季', 'Feb / Mar', 'spring feb february mar march 春季 春 二月 三月'],
    s: ['夏季', 'May / Jun', 'summer may june jun 夏季 夏 五月 六月'],
    w: ['冬季', 'Oct / Nov', 'winter autumn oct october nov november 冬季 秋季 冬 秋 十月 十一月'],
    y: ['通用 / 全年', 'General', 'general syllabus 全年 通用 大纲']
  };
  const simplified = {'數':'数','學':'学','經':'经','濟':'济','會':'会','計':'计','電':'电','腦':'脑','語':'语','歷':'历','體':'体','運':'运','動':'动','環':'环','應':'应','資':'资','訊':'讯','術':'术','聽':'听','頻':'频','錄':'录','試':'试','評':'评','標':'标','準':'准','報':'报','閾':'阈','級':'级','綱':'纲','樣':'样','補':'补','師':'师','說':'说','頁':'页','號':'号','無':'无','帶':'带','國':'国','際':'际','漢':'汉','務':'务','業':'业','進':'进','階':'阶','線':'线','題':'题'};
  function normalize(text) {
    return String(text || '').normalize('NFKC').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[\u3400-\u9fff]/g,c=>simplified[c]||c).replace(/[_.\-/]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const aliases = {
    数学: 'math mathematics maths 数学', 高等数学: 'further mathematics further maths further math 高数 进阶数学 高等数学 数学',
    数学附加: 'additional mathematics add maths 数学附加 附加数学 数学', 数学国际: 'international mathematics 国际数学 数学',
    物理: 'physics physical 物理', 化学: 'chemistry chem 化学', 生物: 'biology bio 生物',
    经济: 'economics econ 经济 经济学', 商学: 'business business studies 商学 商业 商务',
    计算机科学: 'computer science computing cs 计算机 计算机科学 电脑科学 电脑', 应用信息技术: 'information technology ict applied 信息技术 资讯科技 应用资讯科技',
    会计: 'accounting accounts 会计 会计学', 中文: 'chinese 中文 汉语', 中文母语: 'chinese mandarin 中文母语 中文 汉语',
    英语: 'english language 英语 英文', 心理学: 'psychology psych 心理 心理学', 地理: 'geography geo 地理',
    历史: 'history 历史', 体育: 'physical education pe sport 体育', 社会学: 'sociology 社会学',
    环境管理: 'environment environmental management 环境 环境管理',
    '英语(无口语)': 'english second language esl english without speaking 英语 无口语',
    '英语(带口语)': 'english second language esl english with speaking 英语 含口语 带口语',
    运动和体育: 'sport physical education pe 运动 体育 运动与体育'
  };
  function subjectWords(subject) {
    return normalize([subject.code, subject.name, subject.en, subject.level, aliases[subject.name] || '', subject.level === 'A Level' ? 'as a2 alevel a level aslevel' : 'igcse'].join(' '));
  }
  function parse(filename, subjectMap) {
    const parts = filename.split('_');
    const period = parts[1] || '';
    const match = /^([mswy])(\d{2})$/.exec(period);
    const type = (parts[2] || '').split('.')[0];
    const component = (parts[3] || '').split('.')[0];
    const subject = subjectMap[parts[0]];
    const record = {
      file: filename, code: parts[0], subject,
      year: match ? 2000 + Number(match[2]) : null,
      season: match ? match[1] : 'y',
      type: filename.toLowerCase().endsWith('.mp3') ? 'audio' : types[type] ? type : 'other', rawType: type,
      component: /^\d+(?:\+\d+)*$/.test(component) ? component : '',
      components: /^\d+(?:\+\d+)*$/.test(component) ? component.split('+') : [],
      extension: filename.split('.').pop().toUpperCase(),
      url: 'https://cie.fraft.cn/obj/Common/Fetch/redir/' + encodeURIComponent(filename)
    };
    record.searchText = normalize([filename, subject ? subjectWords(subject) : '', record.year || '',
      seasons[record.season][0], seasons[record.season][1], seasons[record.season][2],
      record.type, types[record.type][0], types[record.type][1],
      record.component ? `paper ${record.component} 卷号 ${record.component}` : ''].join(' '));
    return record;
  }
  function distance(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    const row = Array.from({length:b.length + 1}, (_, i) => i);
    for (let i=1; i<=a.length; i++) {
      let previous = row[0]; row[0] = i;
      for (let j=1; j<=b.length; j++) {
        const before = row[j];
        row[j] = Math.min(row[j] + 1, row[j-1] + 1, previous + (a[i-1] === b[j-1] ? 0 : 1));
        previous = before;
      }
    }
    return row[b.length];
  }
  function prepareQuery(query, subjects) {
    const vocabulary = new Set(subjects.flatMap(s => subjectWords(s).split(' ')).filter(w => /^[a-z]{4,}$/.test(w)));
    return normalize(query).split(' ').filter(Boolean).map(term => {
      if (!/^[a-z]{5,}$/.test(term) || [...vocabulary].some(word => word.includes(term))) return [term];
      const nearby = [...vocabulary].filter(word => distance(term, word) <= (term.length >= 8 ? 2 : 1));
      return [term, ...nearby];
    });
  }
  function filter(records, state, subjects) {
    const terms = prepareQuery(state.query, subjects);
    return records.filter(p => (!state.level || p.subject?.level === state.level)
      && (!state.subject || p.code === state.subject)
      && (!state.year || p.year === Number(state.year))
      && (!state.season || p.season === state.season)
      && (!state.type || p.type === state.type)
      && (!state.component || p.components.includes(state.component))
      && terms.every(variants => variants.some(term => p.searchText.includes(term))));
  }
  function filterSubjects(subjects, query, level = '') {
    const terms = prepareQuery(query, subjects);
    return subjects.filter(subject => (!level || subject.level === level)
      && terms.every(variants => variants.some(term => subjectWords(subject).includes(term))));
  }
  function compare(mode) {
    if (mode === 'filename') return (a,b) => a.file.localeCompare(b.file, 'en', {numeric:true});
    const factor = mode === 'oldest' ? 1 : -1;
    return (a,b) => factor * ((a.year || 0) - (b.year || 0))
      || a.code.localeCompare(b.code)
      || ({m:1,s:2,w:3,y:0}[b.season] - {m:1,s:2,w:3,y:0}[a.season]) * (mode === 'oldest' ? -1 : 1)
      || ({qp:0,ms:1,er:2,gt:3}[a.type] ?? 4) - ({qp:0,ms:1,er:2,gt:3}[b.type] ?? 4)
      || a.file.localeCompare(b.file,'en',{numeric:true});
  }
  const api = {types,seasons,normalize,subjectWords,parse,filter,filterSubjects,compare,prepareQuery};
  root.HubSearch = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window === 'undefined' ? globalThis : window);
