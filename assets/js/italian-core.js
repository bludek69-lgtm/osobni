(function (root) {
  'use strict';
  // One ephemeral take; injected browser APIs also allow lifecycle regression tests.
  function createAnswerRecorder(env, changed=()=>{}) {
    const state={status:'idle',url:'',error:''};
    let generation=0,stream=null,recorder=null,timer=null;
    const notify=()=>changed(state);
    function release(){if(timer!==null)env.clearTimeout(timer);timer=null;stream?.getTracks().forEach(t=>t.stop());stream=null;}
    function reset(){
      generation++;release();
      if(recorder){recorder.ondataavailable=null;recorder.onstop=null;recorder.onerror=null;if(recorder.state!=='inactive')recorder.stop();recorder=null;}
      if(state.url)env.URL.revokeObjectURL(state.url);
      Object.assign(state,{status:'idle',url:'',error:''});notify();
    }
    function stop(){if(state.status!=='recording')return;state.status='stopping';notify();if(timer!==null)env.clearTimeout(timer);timer=null;recorder.stop();release();}
    async function start(){
      if(['pending','recording','stopping'].includes(state.status))return;
      reset();const token=generation;
      if(!env.navigator?.mediaDevices?.getUserMedia||!env.MediaRecorder){state.error='unsupported';notify();return;}
      state.status='pending';notify();
      try{
        const acquired=await env.navigator.mediaDevices.getUserMedia({audio:true});
        if(token!==generation){acquired.getTracks().forEach(t=>t.stop());return;}
        stream=acquired;
        const mime=['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(m=>env.MediaRecorder.isTypeSupported?.(m));
        recorder=new env.MediaRecorder(stream,mime?{mimeType:mime}:undefined);
        const current=recorder,chunks=[];
        current.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
        current.onstop=()=>{
          if(token!==generation)return;
          release();recorder=null;
          const blob=new env.Blob(chunks,{type:current.mimeType||chunks[0]?.type||'audio/webm'});
          if(blob.size){state.url=env.URL.createObjectURL(blob);state.status='ready';}
          else {state.status='idle';state.error='empty';}
          notify();
        };
        current.onerror=()=>{if(token!==generation)return;reset();state.error='failed';notify();};
        current.start();state.status='recording';notify();
        timer=env.setTimeout(stop,60000);
      }catch(error){
        if(token!==generation)return;
        reset();state.error=error.name==='NotAllowedError'?'denied':error.name==='NotFoundError'?'missing':'failed';notify();
      }
    }
    return {state,start,stop,reset};
  }
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
  function emptyProgress() { return {version:1,favorites:[],mistakes:{},mistakeKinds:{},results:[],lessonResults:{},schedule:{},savedSentences:[],sentencePractice:{}}; }
  const reviewDays=[1,3,7,14,30], dayMs=86400000;
  function dialogueEntries(data) {
    const entries=new Map();
    for(const lesson of data.lessons)for(const line of [...lesson.dialogue,...(lesson.dialogueVariants||[]).flatMap(v=>v.lines)]){
      if(!entries.has(line.id))entries.set(line.id,{...line,lessonId:lesson.id});
    }
    return [...entries.values()];
  }
  function savedDialogue(data,progress) {
    const entries=new Map(dialogueEntries(data).map(line=>[line.id,line]));
    return [...new Set(progress.savedSentences||[])].map(id=>entries.get(id)).filter(Boolean);
  }
  function recordSchedule(progress, changes, date) {
    const now=Date.parse(date);
    progress.schedule=progress.schedule||{};
    for(const item of changes){
      const key=item.kind+':'+item.id, old=progress.schedule[key];
      // Early repetitions must not inflate the interval.
      if(item.correct&&old&&now<Date.parse(old.due))continue;
      const step=item.correct?Math.min((old?.step||0)+1,reviewDays.length):0;
      progress.schedule[key]={id:item.id,kind:item.kind,step,last:new Date(now).toISOString(),due:new Date(now+reviewDays[Math.max(0,step-1)]*dayMs).toISOString()};
    }
  }
  function scheduledQuestions(lessons, progress, lang, date=new Date().toISOString()) {
    const pools=Object.fromEntries(['choice','write','listen','picture','grammar'].map(kind=>[kind,questions(lessons,kind,lang)]));
    return Object.values(progress.schedule||{}).filter(r=>Date.parse(r.due)<=Date.parse(date)).sort((a,b)=>Date.parse(a.due)-Date.parse(b.due)).map(r=>pools[r.kind]?.find(q=>q.id===r.id)).filter(Boolean);
  }
  function dialogueExcerpt(base, lines, replies=2) {
    const changed=lines.findIndex((line,i)=>line.it!==base[i]?.it);
    let start=Math.max(0,Math.min(changed-1,lines.length-replies*2));
    while(start>0&&lines.slice(start).filter(line=>line.role==='customer').length<replies)start--;
    let count=0,end=start;
    for(;end<lines.length;end++)if(lines[end].role==='customer'&&++count===replies){end++;break;}
    while(end<lines.length&&lines[end].role!=='customer')end++;
    return lines.slice(start,end);
  }
  function dailyPlan(lessons, progress, lang, lastLesson, date=new Date().toISOString()) {
    const mistakes=reviewQuestions(lessons,progress,lang);
    const due=scheduledQuestions(lessons,progress,lang,date).filter(q=>!progress.mistakes[q.id]);
    const picked=[],seen=new Set();
    function add(pool,limit,source){for(const q of pool){if(picked.length>=limit)break;if(seen.has(q.id))continue;seen.add(q.id);picked.push({...q,source});}}
    add(due,2,'due');add(mistakes,picked.length+2,'mistake');
    add(due,4,'due');add(mistakes,4,'mistake');
    const lesson=lessons.find(l=>l.id===picked[0]?.lessonId)||lessons.find(l=>l.id===lastLesson)||lessons[0];
    add(questions([lesson],'choice',lang).filter(q=>!progress.schedule?.[q.kind+':'+q.id]),4,'new');
    const saved=savedDialogue({lessons},progress).sort((a,b)=>(Date.parse(progress.sentencePractice?.[a.id])||0)-(Date.parse(progress.sentencePractice?.[b.id])||0));
    return {questions:picked,lessonId:lesson.id,sentenceId:saved[0]?.id||null};
  }
  function recordLessonResults(progress, session, date) {
    const grouped={};
    session.questions.forEach((q,i)=>{
      if(!q.lessonId)return;
      const r=grouped[q.lessonId]||(grouped[q.lessonId]={date,total:0,correct:0,type:session.type});
      r.total++;r.correct+=Number(session.changes[i]?.correct===true);
    });
    progress.lessonResults={...progress.lessonResults,...grouped};
  }
  function validateProgress(value, data) {
    if (!value || value.version !== 1 || !Array.isArray(value.favorites) || !Array.isArray(value.results) ||
      !value.mistakes || typeof value.mistakes !== 'object' || Array.isArray(value.mistakes)) throw new Error('Invalid progress');
    const wordIds = new Set(data.lessons.flatMap(l=>l.words.map(w=>w.id)));
    const allIds = new Set([...wordIds,...data.lessons.flatMap(l=>l.questions.map(q=>q.id))]);
    const result = emptyProgress();
    const sentenceIds=new Set(dialogueEntries(data).map(line=>line.id));
    result.savedSentences=Array.isArray(value.savedSentences)?[...new Set(value.savedSentences.filter(id=>sentenceIds.has(id)))]:[];
    for(const id of result.savedSentences){const date=value.sentencePractice?.[id];if(typeof date==='string'&&Number.isFinite(Date.parse(date)))result.sentencePractice[id]=new Date(date).toISOString();}
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
    for(const lesson of data.lessons){
      const r=value.lessonResults?.[lesson.id];
      if(r&&Number.isInteger(r.total)&&r.total>0&&r.total<=100&&Number.isInteger(r.correct)&&r.correct>=0&&r.correct<=r.total&&typeof r.date==='string'&&Number.isFinite(Date.parse(r.date))&&['practice','exam'].includes(r.type))result.lessonResults[lesson.id]={date:new Date(r.date).toISOString(),total:r.total,correct:r.correct,type:r.type};
    }
    for(const kind of ['choice','write','listen','picture','grammar'])for(const q of questions(data.lessons,kind,'cs')){
      const key=kind+':'+q.id,r=value.schedule?.[key];
      if(r&&r.id===q.id&&r.kind===kind&&Number.isInteger(r.step)&&r.step>=0&&r.step<=reviewDays.length&&typeof r.last==='string'&&typeof r.due==='string'&&Number.isFinite(Date.parse(r.last))&&Number.isFinite(Date.parse(r.due))&&Date.parse(r.due)>Date.parse(r.last))result.schedule[key]={id:q.id,kind,step:r.step,last:new Date(r.last).toISOString(),due:new Date(r.due).toISOString()};
    }
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
      dailySentence:dialogueEntries({lessons}).some(line=>line.id===raw.dailySentence)?raw.dailySentence:null,dailyLesson:lessons.some(l=>l.id===raw.dailyLesson)?raw.dailyLesson:null,played:false,type:raw.type,level:raw.level,changes,answer:typeof raw.answer==='string'?raw.answer.slice(0,500):''};
  }
  const api = {createAnswerRecorder,dialogueEntries,savedDialogue,normalize,grade,writtenFeedback,shuffle,questions,emptyProgress,validateProgress,reviewQuestions,restoreSession,recordLessonResults,recordSchedule,scheduledQuestions,dailyPlan,dialogueExcerpt};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ItalianCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
