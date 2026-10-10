(function (root) {
  'use strict';
  function normalize(value) {
    return String(value).normalize('NFC').toLocaleLowerCase('it').replace(/[’‘]/g, "'").trim().replace(/[.!?]+$/g, '').trim().replace(/\s+/g, ' ');
  }
  const grade = (value, answers) => answers.some(answer => normalize(answer) === normalize(value));
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
    if (mode === 'grammar') return lessons.flatMap(l => l.questions.map(q => ({...q, kind:'grammar', lessonId:l.id})));
    return lessons.flatMap(l => l.words.map(w => {
      const answers = mode === 'write' ? [w.italian] : [w.meaning[lang]];
      const distractors = [...new Set(words.filter(x => x.id !== w.id).map(x => x.meaning[lang]))].filter(x => !answers.includes(x));
      return {id:w.id, lessonId:l.id, kind:mode, italian:w.italian, prompt:mode === 'write' ? w.meaning[lang] : w.italian,
        answers, options:mode === 'write' ? [] : shuffle([answers[0], ...shuffle(distractors).slice(0,3)]),
        explanation:w.example};
    }));
  }
  function emptyProgress() { return {version:1,favorites:[],mistakes:{},results:[]}; }
  function validateProgress(value, data) {
    if (!value || value.version !== 1 || !Array.isArray(value.favorites) || !Array.isArray(value.results) ||
      !value.mistakes || typeof value.mistakes !== 'object' || Array.isArray(value.mistakes)) throw new Error('Invalid progress');
    const wordIds = new Set(data.lessons.flatMap(l=>l.words.map(w=>w.id)));
    const allIds = new Set([...wordIds,...data.lessons.flatMap(l=>l.questions.map(q=>q.id))]);
    const result = emptyProgress();
    result.favorites = [...new Set(value.favorites.filter(id=>wordIds.has(id)))];
    for (const [id,count] of Object.entries(value.mistakes)) if (allIds.has(id) && Number.isInteger(count) && count > 0) result.mistakes[id] = Math.min(count,10000);
    result.results = value.results.slice(-50).map(r=>{
      if (!r || !Number.isInteger(r.total) || r.total < 1 || r.total > 100 || !Number.isInteger(r.correct) ||
        r.correct < 0 || r.correct > r.total || typeof r.date !== 'string' || !Number.isFinite(Date.parse(r.date)) ||
        !['practice','exam'].includes(r.type) || !['A1','A2','B1','B2','all'].includes(r.level)) throw new Error('Invalid result');
      return {total:r.total,correct:r.correct,date:new Date(r.date).toISOString(),type:r.type,level:r.level};
    });
    return result;
  }
  const api = {normalize,grade,shuffle,questions,emptyProgress,validateProgress};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ItalianCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
