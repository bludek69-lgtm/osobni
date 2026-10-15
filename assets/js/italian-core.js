(function (root) {
  'use strict';
  function normalize(value) {
    return String(value).normalize('NFC').toLocaleLowerCase('it').replace(/[’‘]/g, "'").trim().replace(/[.!?]+$/g, '').trim().replace(/\s+/g, ' ');
  }
  const grade = (value, answers) => answers.some(answer => normalize(answer) === normalize(value));
  function writtenFeedback(value, answers, article = '') {
    const input=normalize(value), plain=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(grade(value,answers))return {kind:'correct'};
    for(const answer of answers) {
      const expected=normalize(answer);
      if(plain(input)===plain(expected))return {kind:'accent',expected:answer};
    }
    let combined=null;
    if(article)for(const answer of answers) {
      const expected=normalize(answer), prefix=normalize(article)+(article.endsWith('’')||article.endsWith("'")?'':' ');
      if(!expected.startsWith(prefix))continue;
      const body=expected.slice(prefix.length);
      if(input===body)return {kind:'article',article,expected:answer};
      if(plain(input)===plain(body))combined={kind:'article-accent',article,expected:answer};
    }
    if(combined)return combined;
    // A different string alone cannot prove a different meaning (it may be a typo).
    return {kind:'expression',expected:answers[0]};
  }
  function shuffle(items, random = Math.random) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function questions(lessons, mode, lang) {
    const words = lessons.flatMap(l => l.words);
    const illustrated = words.filter(w=>w.picture);
    const optionWords = mode==='picture' && illustrated.length>=4 ? illustrated : words;
    if (mode === 'grammar') return lessons.flatMap(l => l.questions.map(q => ({...q, kind:'grammar', lessonId:l.id})));
    return lessons.flatMap(l => l.words.filter(w=>mode!=='picture'||w.picture).map(w => {
      const italianAnswer = mode === 'write' || mode === 'picture';
      const answers = mode === 'write' ? [w.italian,...(w.writingVariants||[])] : italianAnswer ? [w.italian] : [w.meaning[lang]];
      const distractors = [...new Set(optionWords.filter(x => x.id !== w.id && (mode !== 'picture' || !(w.pictureExcludes || []).includes(x.id))).map(x => italianAnswer ? x.italian : x.meaning[lang]))].filter(x => !answers.includes(x));
      return {id:w.id, lessonId:l.id, kind:mode, italian:w.italian, prompt:mode === 'write' ? w.meaning[lang] : w.italian,
        picture:w.picture, pictureDescription:w.meaning[lang],
        article:w.article||'', answers, options:mode === 'write' ? [] : shuffle([answers[0], ...shuffle(distractors).slice(0,3)]),
        explanation:w.example};
    }));
  }
  function emptyProgress() { return {version:1,favorites:[],mistakes:{},mistakeKinds:{},results:[]}; }
  function validateProgress(value, data) {
    if (!value || value.version !== 1 || !Array.isArray(value.favorites) || !Array.isArray(value.results) ||
      !value.mistakes || typeof value.mistakes !== 'object' || Array.isArray(value.mistakes)) throw new Error('Invalid progress');
    const wordIds = new Set(data.lessons.flatMap(l=>l.words.map(w=>w.id)));
    const allIds = new Set([...wordIds,...data.lessons.flatMap(l=>l.questions.map(q=>q.id))]);
    const result = emptyProgress();
    result.favorites = [...new Set(value.favorites.filter(id=>wordIds.has(id)))];
    for (const [id,count] of Object.entries(value.mistakes)) if (allIds.has(id) && Number.isInteger(count) && count > 0) result.mistakes[id] = Math.min(count,10000);
    for (const id of Object.keys(result.mistakes)) {
      const kind = value.mistakeKinds?.[id];
      if (['choice','write','listen','picture','grammar'].includes(kind)) result.mistakeKinds[id] = kind;
    }
    result.results = value.results.slice(-50).map(r=>{
      if (!r || !Number.isInteger(r.total) || r.total < 1 || r.total > 100 || !Number.isInteger(r.correct) ||
        r.correct < 0 || r.correct > r.total || typeof r.date !== 'string' || !Number.isFinite(Date.parse(r.date)) ||
        !['practice','exam'].includes(r.type) || !['A1','A2','B1','B2','all'].includes(r.level)) throw new Error('Invalid result');
      return {total:r.total,correct:r.correct,date:new Date(r.date).toISOString(),type:r.type,level:r.level};
    });
    return result;
  }
  function reviewQuestions(lessons, progress, lang) {
    const pools = Object.fromEntries(['choice','write','listen','picture','grammar'].map(kind=>[kind,questions(lessons,kind,lang)]));
    return Object.keys(progress.mistakes).map(id=> {
      const kind = progress.mistakeKinds?.[id] || (pools.grammar.some(q=>q.id===id)?'grammar':'choice');
      return pools[kind]?.find(q=>q.id===id) || pools.choice.find(q=>q.id===id);
    }).filter(Boolean);
  }
  // Rebuild questions from trusted lesson data; do not trust stored prompts or HTML.
  function restoreSession(raw, lessons, lang) {
    if (!raw || !['practice','exam'].includes(raw.type) || !['A1','A2','B1','B2','all'].includes(raw.level) ||
        !Array.isArray(raw.questions) || !raw.questions.length || raw.questions.length>100 ||
        !Number.isInteger(raw.index) || raw.index<0 || raw.index>=raw.questions.length || !Array.isArray(raw.changes)) return null;
    const pools = Object.fromEntries(['choice','write','listen','picture','grammar'].map(kind=>[kind,questions(lessons,kind,lang)]));
    const restored = raw.questions.map(q=>pools[q.kind]?.find(x=>x.id===q.id));
    if (restored.some(q=>!q)) return null;
    const answered=raw.answered===true;
    if(raw.changes.length!==raw.index+Number(answered))return null;
    const changes=raw.changes.map((c,i)=>({id:restored[i].id,kind:restored[i].kind,correct:c.correct===true}));
    if(raw.changes.some((c,i)=>c.id!==restored[i].id||typeof c.correct!=='boolean'))return null;
    return {questions:restored,index:raw.index,answered,correct:changes.filter(c=>c.correct).length,
      played:false,type:raw.type,level:raw.level,changes,answer:typeof raw.answer==='string'?raw.answer.slice(0,500):''};
  }
  const api = {normalize,grade,writtenFeedback,shuffle,questions,emptyProgress,validateProgress,reviewQuestions,restoreSession};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ItalianCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
