const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./assets/js/italian-data.js');
const C = require('./assets/js/italian-core.js');

test('12 lessons, 84 vocabulary items, 72 grammar questions, four levels', () => {
  assert.equal(D.lessons.length,12);
  assert.equal(D.lessons.flatMap(l=>l.words).length,84);
  assert.equal(D.lessons.flatMap(l=>l.questions).length,72);
  for (const level of ['A1','A2','B1','B2']) assert.equal(D.lessons.filter(l=>l.level===level).length,3);
});
test('stable unique identifiers and complete localized content', () => {
  const items=D.lessons.flatMap(l=>[l,...l.words,...l.questions]);
  assert.equal(new Set(items.map(x=>x.id)).size,items.length);
  for(const l of D.lessons) for(const lang of ['cs','en','it']) {
    assert.ok(l.title[lang]&&l.note[lang]);
    for(const w of l.words) assert.ok(w.italian&&w.meaning[lang]&&w.example);
    for(const q of l.questions) assert.ok(q.explanation[lang]);
  }
});
test('grading tolerates case, spaces, final punctuation and apostrophe style',()=>{
  assert.ok(C.grade('  UN   CAFFÈ! ',['un caffè']));
  assert.ok(C.grade("un'allergia",['un’allergia']));
  assert.ok(C.grade('caffe\u0300',['caffè']));
});
test('grading preserves meaningful Italian accents and missing articles',()=>{
  assert.equal(C.grade('e',['è']),false);
  assert.equal(C.grade('caffe',['un caffè']),false);
  assert.equal(C.grade('sono',['sei']),false);
});
for(const lang of ['cs','en','it'])for(const mode of ['choice','write','listen','grammar'])test(lang+' / '+mode+' produces valid questions',()=>{
  const qs=C.questions(D.lessons,mode,lang);
  assert.equal(qs.length,mode==='grammar'?72:84);
  assert.equal(new Set(qs.map(q=>q.id)).size,qs.length);
  for(const q of qs) {
    assert.ok(C.grade(q.answers[0],q.answers));
    if(mode!=='write'){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.options.includes(q.answers[0]));}
  }
});
test('shuffle does not mutate input and preserves every item',()=>{
  const input=[1,2,3,4,5];const result=C.shuffle(input,()=>.5);
  assert.deepEqual(input,[1,2,3,4,5]);assert.deepEqual(result.slice().sort(),input);
});
test('24 local AI illustrations with provenance and valid Italian choices in every language',()=>{
  const fs=require('node:fs');
  assert.equal(Object.keys(D.illustrations).length,24);
  for(const lang of ['cs','en','it']) {
    const qs=C.questions(D.lessons,'picture',lang);assert.equal(qs.length,24);
    for(const q of qs) {
      const illustration=D.illustrations[q.picture];assert.equal(illustration.kind,'ai');
      assert.ok(illustration.generator&&illustration.created);
      assert.equal(illustration.file,q.picture+'.webp');
      const bytes=fs.readFileSync(__dirname+'/assets/img/italian/ai/'+illustration.file);
      assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
      assert.ok(bytes.length>1000&&bytes.length<1000000);
      assert.deepEqual(q.answers,[q.italian]);assert.ok(q.pictureDescription);
      assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
      assert.ok(q.options.includes(q.italian));
    }
  }
  assert.equal(C.questions(D.lessons.filter(l=>l.level==='B2'),'picture','cs').length,0);
});
test('single illustrated lesson has four unique choices and uses existing progress IDs',()=>{
  const qs=C.questions(D.lessons.filter(l=>l.id==='hotel'),'picture','cs');
  assert.equal(qs.length,6);
  for(const q of qs){assert.equal(q.options.length,4);assert.ok(C.validateProgress({...C.emptyProgress(),mistakes:{[q.id]:1}},D).mistakes[q.id]);}
});
test('picture choices do not confuse a room with its bed or a menu with its food',()=>{
  for(let i=0;i<20;i++)for(const q of C.questions(D.lessons,'picture','cs')) {
    const w=D.lessons.flatMap(l=>l.words).find(w=>w.id===q.id);
    for(const excluded of w.pictureExcludes||[]) {
      const other=D.lessons.flatMap(l=>l.words).find(w=>w.id===excluded);
      assert.ok(!q.options.includes(other.italian));
    }
    assert.equal(q.options.length,4);
  }
});
test('progress backup round trip and unknown IDs discarded',()=>{
  const p={version:1,favorites:['caffe','unknown','caffe'],mistakes:{caffe:2,unknown:3},results:[{correct:4,total:6,type:'practice',level:'A1',date:'2026-10-10T12:00:00Z'}]};
  const clean=C.validateProgress(JSON.parse(JSON.stringify(p)),D);
  assert.deepEqual(clean.favorites,['caffe']);assert.deepEqual(clean.mistakes,{caffe:2});assert.equal(clean.results[0].correct,4);
});
test('invalid backup rejected, impossible scores rejected',()=>{
  assert.throws(()=>C.validateProgress({},D));
  for(const r of [{total:0,correct:0},{total:6,correct:7},{total:6,correct:-1}])
    assert.throws(()=>C.validateProgress({...C.emptyProgress(),results:[{...r,type:'exam',level:'A1',date:'2026-10-10'}]},D));
  assert.throws(()=>C.validateProgress({...C.emptyProgress(),results:[{total:6,correct:4,type:'exam',level:'A1',date:'invalid'}]},D));
});
test('backup keeps at most 50 results and rejects injected types',()=>{
  const r={total:20,correct:10,type:'exam',level:'B2',date:'2026-10-10'};
  assert.equal(C.validateProgress({...C.emptyProgress(),results:Array(80).fill(r)},D).results.length,50);
  assert.throws(()=>C.validateProgress({...C.emptyProgress(),results:[{...r,type:'<script>'}]},D));
});

test('review includes legacy grammar mistakes and preserves writing/listening types',()=>{
  const p=C.validateProgress({...C.emptyProgress(),mistakes:{essere:2,caffe:1,acqua:1},mistakeKinds:{caffe:'write',acqua:'listen'}},D);
  const qs=C.reviewQuestions(D.lessons,p,'cs');
  assert.deepEqual(qs.map(q=>[q.id,q.kind]),[['essere','grammar'],['caffe','write'],['acqua','listen']]);
  assert.equal(C.reviewQuestions(D.lessons.filter(l=>l.id==='bar'),p,'en').length,2);
  assert.deepEqual(C.validateProgress(JSON.parse(JSON.stringify(p)),D).mistakeKinds,p.mistakeKinds);
});

test('resuming rebuilds questions, preserves checked answer and does not double-score',()=>{
  const qs=C.questions(D.lessons,'grammar','cs').slice(0,2);
  const raw={questions:qs,index:0,answered:true,answer:qs[0].answers[0],changes:[{id:qs[0].id,correct:true}],correct:999,type:'practice',level:'A1'};
  raw.questions[0].prompt='<script>injected</script>';
  const resumed=C.restoreSession(raw,D.lessons,'en');
  assert.equal(resumed.correct,1);assert.equal(resumed.answered,true);assert.equal(resumed.played,false);
  assert.equal(resumed.answer,qs[0].answers[0]);assert.ok(!resumed.questions[0].prompt.includes('<script>'));
  assert.equal(resumed.changes[0].kind,'grammar');
  assert.equal(C.restoreSession({...raw,index:9},D.lessons,'cs'),null);
  assert.equal(C.restoreSession({...raw,changes:[]},D.lessons,'cs'),null);
  assert.equal(C.restoreSession({...raw,questions:[{id:'missing',kind:'write'}]},D.lessons,'cs'),null);
});

test('café dialogue has translations, two roles and bundled audio for lines, words and examples',()=>{
  const fs=require('node:fs');const cafe=D.lessons.find(l=>l.id==='bar');
  assert.equal(cafe.dialogue.length,8);assert.equal(cafe.questions.length,6);
  assert.deepEqual([...new Set(cafe.dialogue.map(l=>l.role))].sort(),['barista','customer']);
  for(const line of cafe.dialogue)for(const lang of ['cs','en','it'])assert.ok(line.translation[lang]);
  const texts=[...cafe.dialogue.map(l=>l.it),...cafe.words.flatMap(w=>[w.italian,w.example])];
  for(const text of texts){assert.ok(D.audioFiles[text]);assert.ok(fs.statSync(__dirname+'/assets/audio/italian/'+D.audioFiles[text]).size>1000);}
});

test('restaurant lesson preserves vocabulary and has playable dialogue and a separate Freya video',()=>{
  const fs=require('node:fs'),l=D.lessons.find(l=>l.id==='ristorante');
  assert.equal(l.level,'A2');assert.equal(l.words.length,9);assert.equal(l.questions.length,6);
  assert.equal(l.dialogue.length,12);assert.equal(new Set(l.dialogue.map(x=>x.id)).size,12);
  assert.equal(l.video.id,'d2b02d5cc883c753ed2c0558a9bce662');
  assert.notEqual(l.video.id,'dcf1d9a305bd77187a7cf9e2db8cd677');
  for(const row of l.video.transcript)assert.ok(row.length===3&&row.every(Boolean));
  for(const row of l.dialogue){assert.ok(row.translation.cs&&row.translation.en);assert.ok(['barista','customer'].includes(row.role));}
  for(const text of [...l.dialogue.map(x=>x.it),...l.words.flatMap(w=>[w.italian,w.example])]){
    assert.ok(D.audioFiles[text]);assert.ok(fs.statSync(__dirname+'/assets/audio/italian/'+D.audioFiles[text]).size>1000);
  }
  const review=C.reviewQuestions([l],{mistakes:{'ristorante-table':1},mistakeKinds:{}},'cs');
  assert.equal(review[0].kind,'grammar');assert.equal(review[0].answers[0],'per');
});

test('hotel lesson keeps existing IDs, provides audio and does not embed the failed video',()=>{
  const fs=require('node:fs'),l=D.lessons.find(l=>l.id==='hotel');
  assert.equal(l.words.length,9);assert.equal(l.questions.length,6);assert.equal(l.dialogue.length,12);
  assert.ok(l.questions.some(q=>q.id==='prenotato'));assert.ok(l.questions.some(q=>q.id==='arrivata'));
  assert.equal(l.video.id,null);assert.equal(l.video.status,'unavailable');
  for(const row of l.video.transcript)assert.ok(row.length===3&&row.every(Boolean));
  assert.equal(new Set(l.dialogue.map(x=>x.id)).size,12);
  for(const row of l.dialogue)assert.ok(row.translation.cs&&row.translation.en);
  for(const text of [...l.dialogue.map(x=>x.it),...l.words.flatMap(w=>[w.italian,w.example])]){
    assert.ok(D.audioFiles[text]);assert.ok(fs.statSync(__dirname+'/assets/audio/italian/'+D.audioFiles[text]).size>1000);
  }
  const q=C.reviewQuestions([l],{mistakes:{'hotel-duration':1},mistakeKinds:{}},'cs')[0];
  assert.equal(q.kind,'grammar');assert.equal(q.answers[0],'per');
});

test('city directions lesson has translated dialogue and audio without a Freya video',()=>{
  const fs=require('node:fs'),l=D.lessons.find(l=>l.id==='citta');
  assert.equal(l.dialogue.length,10);assert.equal(l.questions.length,6);assert.equal(l.video,undefined);
  assert.ok(l.questions.some(q=>q.id==='dove'));assert.ok(l.questions.some(q=>q.id==='luogo'));
  assert.equal(new Set(l.dialogue.map(x=>x.id)).size,10);
  for(const row of l.dialogue)assert.ok(row.translation.cs&&row.translation.en);
  for(const text of [...l.dialogue.map(x=>x.it),...l.words.flatMap(w=>[w.italian,w.example])]){
    assert.ok(D.audioFiles[text]);assert.ok(fs.statSync(__dirname+'/assets/audio/italian/'+D.audioFiles[text]).size>1000);
  }
  assert.equal(C.reviewQuestions([l],{mistakes:{'citta-repeat':1},mistakeKinds:{}},'cs')[0].answers[0],'ripetere');
});

test('all lessons have distinct local thematic illustrations',()=>{
  const fs=require('node:fs'),crypto=require('node:crypto');
  const hashes=new Set();
  assert.equal(Object.keys(D.lessonIllustrations).length,D.lessons.length);
  for(const l of D.lessons){
    const asset=D.lessonIllustrations[l.id];assert.equal(asset.kind,'ai');
    const bytes=fs.readFileSync(__dirname+'/assets/img/italian/lessons/'+asset.file);
    assert.equal(bytes.toString('ascii',8,12),'WEBP');
    assert.ok(bytes.length>10000&&bytes.length<300000);
    hashes.add(crypto.createHash('sha256').update(bytes).digest('hex'));
  }
  assert.equal(hashes.size,D.lessons.length);
});

test('every offered exercise answer is unique and distractors fail grading',()=>{
  for(const lang of ['cs','en'])for(const mode of ['choice','write','listen','grammar']){
    for(const l of D.lessons)for(const q of C.questions([l],mode,lang)){
      assert.ok(C.grade(q.answers[0],q.answers),q.id);
      assert.ok(!C.grade('nesprávná odpověď',q.answers),q.id);
      if(mode!=='write'){
        assert.equal(new Set(q.options.map(C.normalize)).size,q.options.length,q.id);
        assert.equal(q.options.filter(o=>C.grade(o,q.answers)).length,1,q.id);
      }
    }
  }
});

test('formal lesson preserves progress, distinguishes polite objects and completes audio across all lessons',()=>{
  const fs=require('node:fs'),l=D.lessons.find(l=>l.id==='registro');
  assert.equal(l.level,'B2');assert.equal(l.words.length,6);assert.equal(l.questions.length,6);
  assert.equal(l.dialogue.length,12);assert.equal(l.video,undefined);
  assert.ok(l.questions.some(q=>q.id==='formale'));assert.ok(l.questions.some(q=>q.id==='passivo'));
  assert.equal(new Set(l.dialogue.map(x=>x.id)).size,12);
  for(const lesson of D.lessons){
    assert.ok(lesson.dialogue.length>0);
    for(const row of lesson.dialogue)assert.ok(row.translation.cs&&row.translation.en);
    for(const text of [...lesson.dialogue.map(x=>x.it),...lesson.words.flatMap(w=>[w.italian,w.example])]){
      assert.ok(D.audioFiles[text]);assert.ok(fs.statSync(__dirname+'/assets/audio/italian/'+D.audioFiles[text]).size>1000);
    }
  }
  const q=C.reviewQuestions([l],{mistakes:{'registro-indirect':1},mistakeKinds:{}},'cs')[0];
  assert.equal(q.answers[0],'Le');assert.equal(q.kind,'grammar');
});

test('conditions lesson preserves progress and provides hypothetical and real conditions with audio',()=>{
  const fs=require('node:fs'),l=D.lessons.find(l=>l.id==='ipotesi');
  assert.equal(l.level,'B2');assert.equal(l.words.length,6);assert.equal(l.questions.length,6);
  assert.equal(l.dialogue.length,12);assert.equal(l.video,undefined);
  assert.ok(l.questions.some(q=>q.id==='se-avessi'));assert.ok(l.questions.some(q=>q.id==='apodosi'));
  assert.equal(new Set(l.dialogue.map(x=>x.id)).size,12);
  for(const row of l.dialogue)assert.ok(row.translation.cs&&row.translation.en);
  for(const text of [...l.dialogue.map(x=>x.it),...l.words.flatMap(w=>[w.italian,w.example])]){
    assert.ok(D.audioFiles[text]);assert.ok(fs.statSync(__dirname+'/assets/audio/italian/'+D.audioFiles[text]).size>1000);
  }
  const q=C.reviewQuestions([l],{mistakes:{'ipotesi-result':1},mistakeKinds:{}},'cs')[0];
  assert.equal(q.answers[0],'farei');assert.equal(q.kind,'grammar');
});

test('opinions lesson preserves progress and practises contrast, consequence and subjunctive with audio',()=>{
  const fs=require('node:fs'),l=D.lessons.find(l=>l.id==='opinioni');
  assert.equal(l.level,'B2');assert.equal(l.words.length,6);assert.equal(l.questions.length,6);
  assert.equal(l.dialogue.length,12);assert.equal(l.video,undefined);
  assert.ok(l.questions.some(q=>q.id==='opinione'));assert.ok(l.questions.some(q=>q.id==='benche'));
  assert.equal(new Set(l.dialogue.map(x=>x.id)).size,12);
  for(const row of l.dialogue)assert.ok(row.translation.cs&&row.translation.en);
  for(const text of [...l.dialogue.map(x=>x.it),...l.words.flatMap(w=>[w.italian,w.example])]){
    assert.ok(D.audioFiles[text]);assert.ok(fs.statSync(__dirname+'/assets/audio/italian/'+D.audioFiles[text]).size>1000);
  }
  const q=C.reviewQuestions([l],{mistakes:{'opinioni-contrast':1},mistakeKinds:{}},'cs')[0];
  assert.equal(q.answers[0],'tuttavia');assert.equal(q.kind,'grammar');
});

test('pronouns lesson preserves progress and provides contextual pronouns with complete audio',()=>{
  const fs=require('node:fs'),l=D.lessons.find(l=>l.id==='pronomi');
  assert.equal(l.level,'B1');assert.equal(l.words.length,6);assert.equal(l.questions.length,6);
  assert.equal(l.dialogue.length,12);assert.equal(l.video,undefined);
  assert.ok(l.questions.some(q=>q.id==='quantita'));assert.ok(l.questions.some(q=>q.id==='luogo-ci'));
  assert.equal(new Set(l.dialogue.map(x=>x.id)).size,12);
  for(const row of l.dialogue)assert.ok(row.translation.cs&&row.translation.en);
  for(const text of [...l.dialogue.map(x=>x.it),...l.words.flatMap(w=>[w.italian,w.example])]){
    assert.ok(D.audioFiles[text]);assert.ok(fs.statSync(__dirname+'/assets/audio/italian/'+D.audioFiles[text]).size>1000);
  }
  const q=C.reviewQuestions([l],{mistakes:{'pronomi-map':1},mistakeKinds:{}},'cs')[0];
  assert.equal(q.answers[0],'La');assert.equal(q.kind,'grammar');
});

test('plans lesson preserves progress and supports polite requests and future with audio',()=>{
  const fs=require('node:fs'),l=D.lessons.find(l=>l.id==='progetti');
  assert.equal(l.level,'B1');assert.equal(l.words.length,6);assert.equal(l.questions.length,6);
  assert.equal(l.dialogue.length,12);assert.equal(l.video,undefined);
  assert.ok(l.questions.some(q=>q.id==='cortesia'));assert.ok(l.questions.some(q=>q.id==='futuro'));
  assert.equal(new Set(l.dialogue.map(x=>x.id)).size,12);
  for(const row of l.dialogue)assert.ok(row.translation.cs&&row.translation.en);
  for(const text of [...l.dialogue.map(x=>x.it),...l.words.flatMap(w=>[w.italian,w.example])]){
    assert.ok(D.audioFiles[text]);assert.ok(fs.statSync(__dirname+'/assets/audio/italian/'+D.audioFiles[text]).size>1000);
  }
  const q=C.reviewQuestions([l],{mistakes:{'progetti-request':1},mistakeKinds:{}},'cs')[0];
  assert.equal(q.answers[0],'Potresti');assert.equal(q.kind,'grammar');
});

test('storytelling lesson preserves progress and supports background/event practice with audio',()=>{
  const fs=require('node:fs'),l=D.lessons.find(l=>l.id==='racconto');
  assert.equal(l.level,'B1');assert.equal(l.words.length,6);assert.equal(l.questions.length,6);
  assert.equal(l.dialogue.length,12);assert.equal(l.video,undefined);
  assert.ok(l.questions.some(q=>q.id==='sfondo'));assert.ok(l.questions.some(q=>q.id==='abituale'));
  assert.equal(new Set(l.dialogue.map(x=>x.id)).size,12);
  for(const row of l.dialogue)assert.ok(row.translation.cs&&row.translation.en);
  for(const text of [...l.dialogue.map(x=>x.it),...l.words.flatMap(w=>[w.italian,w.example])]){
    assert.ok(D.audioFiles[text]);assert.ok(fs.statSync(__dirname+'/assets/audio/italian/'+D.audioFiles[text]).size>1000);
  }
  const q=C.reviewQuestions([l],{mistakes:{'racconto-event':1},mistakeKinds:{}},'cs')[0];
  assert.equal(q.answers[0],'è arrivato');assert.equal(q.kind,'grammar');
});

test('yesterday lesson preserves progress and provides two-voice dialogue and complete audio',()=>{
  const fs=require('node:fs'),l=D.lessons.find(l=>l.id==='passato');
  assert.equal(l.level,'A2');assert.equal(l.words.length,6);assert.equal(l.questions.length,6);
  assert.equal(l.dialogue.length,12);assert.equal(l.video,undefined);
  assert.ok(l.questions.some(q=>q.id==='andati'));assert.ok(l.questions.some(q=>q.id==='visitato'));
  assert.equal(new Set(l.dialogue.map(x=>x.id)).size,12);
  assert.equal(l.guide.cs.barista,'Anna');assert.equal(l.guide.cs.customer,'Marco');
  for(const row of l.dialogue)assert.ok(row.translation.cs&&row.translation.en);
  for(const text of [...l.dialogue.map(x=>x.it),...l.words.flatMap(w=>[w.italian,w.example])]){
    assert.ok(D.audioFiles[text]);assert.ok(fs.statSync(__dirname+'/assets/audio/italian/'+D.audioFiles[text]).size>1000);
  }
  const q=C.reviewQuestions([l],{mistakes:{'passato-feminine':1},mistakeKinds:{}},'cs')[0];
  assert.equal(q.answers[0],'tornate');assert.equal(q.kind,'grammar');
});

test('greetings lesson keeps existing progress IDs and has complete audio without video',()=>{
  const fs=require('node:fs'),l=D.lessons.find(l=>l.id==='saluti');
  assert.equal(l.words.length,6);assert.equal(l.dialogue.length,10);assert.equal(l.questions.length,6);
  assert.equal(l.video,undefined);assert.ok(l.questions.some(q=>q.id==='essere'));assert.ok(l.questions.some(q=>q.id==='nome'));
  assert.equal(new Set(l.dialogue.map(x=>x.id)).size,10);
  assert.equal(l.guide.cs.barista,'Anna');assert.equal(l.guide.cs.customer,'Marco');
  for(const row of l.dialogue)assert.ok(row.translation.cs&&row.translation.en);
  for(const text of [...l.dialogue.map(x=>x.it),...l.words.flatMap(w=>[w.italian,w.example])]){
    assert.ok(D.audioFiles[text]);assert.ok(fs.statSync(__dirname+'/assets/audio/italian/'+D.audioFiles[text]).size>1000);
  }
  assert.equal(C.reviewQuestions([l],{mistakes:{'saluti-formal':1},mistakeKinds:{}},'cs')[0].answers[0],'si');
});


test('writing feedback distinguishes articles, accents, combined errors and other expressions',()=>{
  for(const [input,expected,article,kind] of [
    ['caffè','un caffè','un','article'],['un caffe','un caffè','un','accent'],
    ['caffe','un caffè','un','article-accent'],['autobus','l’autobus','l’','article'],
    ['allergia','un’allergia','un’','article'],['la disponibilita','la disponibilità','la','accent'],
    ['vedo','la vedo','','expression'],['prendo','lo prendo','','expression'],
    ['un gelato','un caffè','un','expression'],['un caffé','un caffè','un','accent'],
    ['UN  CAFFÈ!','un caffè','un','correct'],["l'autobus",'l’autobus','l’','correct']
  ])assert.equal(C.writtenFeedback(input,[expected],article).kind,kind,input);
  assert.equal(C.writtenFeedback('menu',['menù','menu']).kind,'correct');
});
test('writing feedback covers every word in all twelve lessons without changing grading',()=>{
  for(const lesson of D.lessons)for(const q of C.questions([lesson],'write','cs')){
    assert.equal(C.writtenFeedback(q.answers[0],q.answers,q.article).kind,'correct',q.id);
    assert.equal(C.writtenFeedback('xyz',q.answers,q.article).kind,'expression',q.id);
    if(q.article){
      const body=q.answers[0].slice(q.article.length).trim();
      assert.equal(C.writtenFeedback(body,q.answers,q.article).kind,'article',q.id);
      assert.equal(C.grade(body,q.answers),false,q.id);
    }
    const noAccent=q.answers[0].normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(noAccent!==q.answers[0]&&!C.grade(noAccent,q.answers))assert.equal(C.writtenFeedback(noAccent,q.answers,q.article).kind,'accent',q.id);
  }
});

test('menu accepts both standard spellings in writing',()=>{const q=C.questions(D.lessons,'write','cs').find(q=>q.id==='menu');assert.ok(C.grade('il menu',q.answers));assert.ok(C.grade('il menù',q.answers));});

test('per-lesson results split mixed sessions and survive export/import',()=>{
  const p=C.emptyProgress(),qs=D.lessons.map(l=>C.questions([l],'grammar','cs')[0]);
  C.recordLessonResults(p,{questions:qs,changes:qs.map((q,i)=>({correct:i%2===0})),type:'exam'},'2026-10-15T12:00:00Z');
  const restored=C.validateProgress(JSON.parse(JSON.stringify(p)),D);
  assert.equal(Object.keys(restored.lessonResults).length,12);
  qs.forEach((q,i)=>assert.deepEqual(restored.lessonResults[q.lessonId],{total:1,correct:Number(i%2===0),date:'2026-10-15T12:00:00.000Z',type:'exam'}));
  C.recordLessonResults(restored,{questions:[qs[0]],changes:[{correct:false}],type:'practice'},'2026-10-16T12:00:00Z');
  assert.equal(restored.lessonResults.saluti.correct,0);assert.equal(restored.lessonResults.bar.type,'exam');
});
test('legacy and invalid lesson results never invent per-lesson history',()=>{
  const p=C.emptyProgress();delete p.lessonResults;assert.deepEqual(C.validateProgress(p,D).lessonResults,{});
  p.lessonResults={hotel:{total:1,correct:2,date:'bad',type:'practice'},unknown:{total:1,correct:1,date:'2026-10-15',type:'exam'}};
  assert.deepEqual(C.validateProgress(p,D).lessonResults,{});
});

test('spaced review grows only when due, caps at 30 days and resets after a mistake',()=>{
  const p=C.emptyProgress(),q=C.questions(D.lessons,'write','cs')[0];
  const answer={id:q.id,kind:q.kind,correct:true},key=q.kind+':'+q.id;
  let now='2026-01-01T12:00:00.000Z';
  for(const days of [1,3,7,14,30,30]){
    C.recordSchedule(p,[answer],now);
    assert.equal(Date.parse(p.schedule[key].due)-Date.parse(now),days*86400000);
    const saved=JSON.stringify(p.schedule);
    C.recordSchedule(p,[answer],now);assert.equal(JSON.stringify(p.schedule),saved);
    assert.equal(C.scheduledQuestions(D.lessons,p,'cs',now).length,0);
    now=p.schedule[key].due;
    assert.equal(C.scheduledQuestions(D.lessons,p,'cs',now).length,1);
  }
  C.recordSchedule(p,[{...answer,correct:false}],now);
  assert.equal(p.schedule[key].step,0);
  assert.equal(Date.parse(p.schedule[key].due)-Date.parse(now),86400000);
});

test('schedule migrates old progress, survives export and rejects unknown or invalid entries',()=>{
  const p=C.emptyProgress();delete p.schedule;
  assert.deepEqual(C.validateProgress(p,D).schedule,{});
  const q=C.questions(D.lessons,'grammar','cs')[0];
  C.recordSchedule(p,[{id:q.id,kind:q.kind,correct:true}],'2026-01-01T00:00:00Z');
  const expected=JSON.parse(JSON.stringify(p.schedule));
  p.schedule.bad={id:'unknown',kind:'write',step:1,last:'bad',due:'bad'};
  assert.deepEqual(C.validateProgress(p,D).schedule,expected);
  p.schedule['grammar:'+q.id].step=99;
  assert.deepEqual(C.validateProgress(p,D).schedule,{});
});

test('all 12 lessons retain each scheduled question mode and oldest due order',()=>{
  const p=C.emptyProgress();let count=0;
  for(const l of D.lessons)for(const kind of ['choice','write','listen','picture','grammar']){
    const q=C.questions([l],kind,'cs')[0];if(!q)continue;
    C.recordSchedule(p,[{id:q.id,kind:q.kind,correct:true}],new Date(Date.UTC(2026,0,1,count++)).toISOString());
  }
  const restored=C.validateProgress(p,D),due=C.scheduledQuestions(D.lessons,restored,'en','2026-02-01T00:00:00Z');
  assert.equal(due.length,count);
  assert.equal(new Set(due.map(q=>q.lessonId)).size,12);
  for(let i=1;i<due.length;i++)assert.ok(Date.parse(restored.schedule[due[i-1].kind+':'+due[i-1].id].due)<=Date.parse(restored.schedule[due[i].kind+':'+due[i].id].due));
});

test('daily plan balances due questions and mistakes without repeating vocabulary',()=>{
 const p=C.emptyProgress(),qs=C.questions(D.lessons,'write','cs');
 C.recordSchedule(p,qs.slice(0,5).map(q=>({...q,correct:true})),'2026-01-01T00:00:00Z');
 p.mistakes[qs[0].id]=1;p.mistakeKinds[qs[0].id]='write';
 const grammar=C.questions(D.lessons,'grammar','cs')[0];p.mistakes[grammar.id]=1;p.mistakeKinds[grammar.id]='grammar';
 const plan=C.dailyPlan(D.lessons,p,'cs','hotel','2026-02-01T00:00:00Z');
 assert.equal(plan.questions.length,4);assert.equal(new Set(plan.questions.map(q=>q.id)).size,4);
 assert.equal(plan.questions.filter(q=>q.source==='due').length,2);
 assert.equal(plan.questions.filter(q=>q.source==='mistake').length,2);
 assert.ok(plan.questions.some(q=>q.id===grammar.id&&q.kind==='grammar'));
});
test('daily plan handles new learners, future reviews and all twelve role lessons',()=>{
 for(const l of D.lessons){
  const p=C.emptyProgress(),plan=C.dailyPlan(D.lessons,p,'en',l.id);
  assert.equal(plan.lessonId,l.id);assert.equal(plan.questions.length,4);
  assert.ok(l.dialogue.filter(x=>x.role==='customer').length>=2);
  C.recordSchedule(p,C.questions([l],'choice','en').map(q=>({...q,correct:true})),'2099-01-01T00:00:00Z');
  assert.equal(C.dailyPlan(D.lessons,p,'en',l.id,'2026-01-01T00:00:00Z').questions.length,0);
 }
});
test('resuming a daily test preserves its role destination and rejects unknown lessons',()=>{
 const questions=C.dailyPlan(D.lessons,C.emptyProgress(),'cs','hotel').questions;
 const raw={questions,index:0,answered:false,changes:[],level:'all',type:'practice',dailyLesson:'hotel'};
 assert.equal(C.restoreSession(raw,D.lessons,'cs').dailyLesson,'hotel');
 raw.dailyLesson='unknown';assert.equal(C.restoreSession(raw,D.lessons,'cs').dailyLesson,null);
});

test('every dialogue turn has a distinct situation cue in Czech and English',()=>{
 let count=0;
 for(const l of D.lessons)for(const line of l.dialogue){
  for(const lang of ['cs','en']){
   assert.equal(typeof line.situation[lang],'string',line.id);
   assert.ok(line.situation[lang].length>20,line.id);
   assert.notEqual(line.situation[lang],line.translation[lang],line.id);
   assert.ok(!line.situation[lang].includes(line.it),line.id);
  }
  count++;
 }
 assert.equal(count,136);
});

test('all dialogue variants keep roles, translations, cues and local audio',()=>{
 const fs=require('fs');let count=0;
 for(const l of D.lessons){
  assert.ok(l.dialogueVariants.length>=1,l.id);
  for(const v of l.dialogueVariants){
   count++;assert.ok(v.lines.length>=4);
   assert.ok(v.lines.some((line,i)=>line.it!==l.dialogue[i].it));
   v.lines.forEach((line,i)=>{
    assert.equal(line.role,l.dialogue[i].role);
    for(const lang of ['cs','en'])assert.ok(line.translation[lang]&&line.situation[lang]);
    assert.ok(fs.statSync('assets/audio/italian/'+D.audioFiles[line.it]).size>1000,line.id);
   });
   const excerpt=C.dialogueExcerpt(l.dialogue,v.lines);
   assert.equal(excerpt.filter(line=>line.role==='customer').length,2,v.id);
   assert.ok(excerpt.some(line=>!l.dialogue.some(base=>base.it===line.it)),v.id);
  }
 }
 assert.equal(count,25);
});

function recorderFixture(){
 const stopped=[],revoked=[],timers=[];let reject=null,resolve=null;
 const stream={getTracks:()=>[{stop:()=>stopped.push(true)}]};
 class Recorder{
  static isTypeSupported(m){return m==='audio/mp4';}
  constructor(s,o){this.mimeType=o.mimeType;this.state='inactive';}
  start(){this.state='recording';}
  stop(){this.state='inactive';queueMicrotask(()=>{this.ondataavailable?.({data:new Blob(['audio'],{type:this.mimeType})});this.onstop?.();});}
 }
 let clock=0;
 const env={performance:{now:()=>clock+=1000},navigator:{mediaDevices:{getUserMedia:()=>new Promise((a,b)=>{resolve=a;reject=b;})}},MediaRecorder:Recorder,Blob,URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:u=>revoked.push(u)},setTimeout:fn=>{timers.push(fn);return timers.length;},clearTimeout:()=>{}};
 return {env,stream,stopped,revoked,timers,allow:()=>resolve(stream),deny:()=>reject(Object.assign(new Error(),{name:'NotAllowedError'}))};
}
test('answer recording stops tracks, produces a local take and revokes it on reset',async()=>{
 const f=recorderFixture(),r=C.createAnswerRecorder(f.env);
 const promise=r.start();assert.equal(r.state.status,'pending');f.allow();await promise;
 assert.equal(r.state.status,'recording');r.stop();await Promise.resolve();
 assert.equal(r.state.status,'ready');assert.equal(r.state.url,'blob:test');assert.ok(f.stopped.length);
 r.reset();assert.deepEqual(f.revoked,['blob:test']);assert.equal(r.state.url,'');
});
test('late microphone permission cannot resume a discarded dialogue',async()=>{
 const f=recorderFixture(),r=C.createAnswerRecorder(f.env),pending=r.start();r.reset();f.allow();await pending;
 assert.equal(r.state.status,'idle');assert.equal(f.stopped.length,1);assert.equal(r.state.url,'');
});
test('recording handles denial, missing support and automatic time limit',async()=>{
 const f=recorderFixture(),r=C.createAnswerRecorder(f.env),pending=r.start();f.deny();await pending;
 assert.equal(r.state.error,'denied');assert.equal(r.state.status,'idle');
 const unsupported=C.createAnswerRecorder({});await unsupported.start();assert.equal(unsupported.state.error,'unsupported');
 const next=r.start();f.allow();await next;f.timers.at(-1)();await Promise.resolve();
 assert.equal(r.state.status,'ready');assert.ok(f.stopped.length);
});

test('saved sentences migrate legacy backups and retain only known unique dialogue ids',()=>{
 const p=C.emptyProgress();delete p.savedSentences;
 assert.deepEqual(C.validateProgress(p,D).savedSentences,[]);
 p.savedSentences=['bar-02','hotel-v1-2','bar-02','<script>',null,42];
 const restored=C.validateProgress(JSON.parse(JSON.stringify(p)),D);
 assert.deepEqual(restored.savedSentences,['bar-02','hotel-v1-2']);
 const lines=C.savedDialogue(D,restored);
 assert.deepEqual(lines.map(l=>l.lessonId),['bar','hotel']);
 assert.match(lines[1].it,/tre notti/);
});
test('saved dialogue catalog includes all lessons and variants without duplicating reused lines',()=>{
 const catalog=C.dialogueEntries(D);
 assert.equal(new Set(catalog.map(x=>x.id)).size,catalog.length);
 assert.equal(new Set(catalog.map(x=>x.lessonId)).size,12);
 const p=C.emptyProgress();p.savedSentences=catalog.map(x=>x.id);
 assert.equal(C.savedDialogue(D,C.validateProgress(p,D)).length,catalog.length);
 for(const line of catalog)assert.ok(line.situation.cs&&line.situation.en&&D.audioFiles[line.it]);
});

test('daily saved sentences rotate by completed practice, not by preview',()=>{
 const p=C.emptyProgress();p.savedSentences=['bar-02','hotel-v1-2','ristorante-02'];
 const pick=()=>C.dailyPlan(D.lessons,p,'cs','hotel').sentenceId;
 assert.equal(pick(),'bar-02');assert.equal(pick(),'bar-02');
 p.sentencePractice['bar-02']='2026-10-15T10:00:00Z';assert.equal(pick(),'hotel-v1-2');
 p.sentencePractice['hotel-v1-2']='2026-10-15T11:00:00Z';assert.equal(pick(),'ristorante-02');
 p.sentencePractice['ristorante-02']='2026-10-15T12:00:00Z';assert.equal(pick(),'bar-02');
 p.savedSentences=[];assert.equal(pick(),null);
});
test('sentence practice history migrates and survives backup, daily selection survives draft',()=>{
 const p=C.emptyProgress();p.savedSentences=['hotel-v1-2'];
 delete p.sentencePractice;assert.deepEqual(C.validateProgress(p,D).sentencePractice,{});
 p.sentencePractice={'hotel-v1-2':'2026-10-15T10:00:00Z','unknown':'2026-01-01'};
 assert.deepEqual(C.validateProgress(p,D).sentencePractice,{'hotel-v1-2':'2026-10-15T10:00:00.000Z'});
 const raw={questions:C.questions(D.lessons,'choice','cs').slice(0,1),changes:[],index:0,answered:false,type:'practice',level:'all',dailyLesson:'hotel',dailySentence:'hotel-v1-2'};
 assert.equal(C.restoreSession(raw,D.lessons,'cs').dailySentence,'hotel-v1-2');
 raw.dailySentence='unknown';assert.equal(C.restoreSession(raw,D.lessons,'cs').dailySentence,null);
});
test('one-reply daily excerpts retain the changed situation in every variant',()=>{
 for(const l of D.lessons)for(const v of l.dialogueVariants){
  const lines=C.dialogueExcerpt(l.dialogue,v.lines,1);
  assert.equal(lines.filter(line=>line.role==='customer').length,1,v.id);
  assert.ok(lines.some(line=>!l.dialogue.some(base=>base.it===line.it)),v.id);
 }
});


test('very short recordings release the microphone without offering an unplayable take',async()=>{
 const f=recorderFixture();f.env.performance.now=()=>100;
 const r=C.createAnswerRecorder(f.env),pending=r.start();f.allow();await pending;
 r.stop();await Promise.resolve();
 assert.equal(r.state.status,'idle');assert.equal(r.state.error,'short');assert.equal(r.state.url,'');assert.ok(f.stopped.length);
});

test('speaking self assessment schedules all lessons and variants and survives backup',()=>{
 const p=C.emptyProgress(),date='2026-10-15T10:00:00Z';
 for(const line of C.dialogueEntries(D))C.rateSpeaking(p,line.id,'again',date);
 const restored=C.validateProgress(JSON.parse(JSON.stringify(p)),D);
 assert.deepEqual(restored.speakingReview,p.speakingReview);
 assert.equal(C.dailyPlan(D.lessons,p,'cs','hotel',date).sentenceId,null);
 assert.ok(C.dailyPlan(D.lessons,p,'cs','hotel','2026-10-16T10:00:00Z').sentenceId);
 delete p.speakingReview;assert.deepEqual(C.validateProgress(p,D).speakingReview,{});
});
test('speaking intervals grow only when due and reset after help or difficulty',()=>{
 const p=C.emptyProgress(),id='hotel-v1-2';
 C.rateSpeaking(p,id,'easy','2026-10-15T10:00:00Z');
 C.rateSpeaking(p,id,'easy','2026-10-15T11:00:00Z');assert.equal(p.speakingReview[id].step,1);
 C.rateSpeaking(p,id,'easy','2026-10-16T11:00:00Z');assert.equal(p.speakingReview[id].step,2);assert.equal(p.speakingReview[id].due,'2026-10-19T11:00:00.000Z');
 C.rateSpeaking(p,id,'hint','2026-10-19T11:00:00Z');assert.equal(p.speakingReview[id].step,0);assert.equal(p.speakingReview[id].due,'2026-10-20T11:00:00.000Z');
 C.rateSpeaking(p,id,'again','2026-10-20T11:00:00Z');assert.equal(p.speakingReview[id].step,0);
});
test('due speaking beats saved sentences and future rated sentences wait',()=>{
 const p=C.emptyProgress();p.savedSentences=['bar-02'];
 C.rateSpeaking(p,'hotel-v1-2','again','2026-10-14T10:00:00Z');
 assert.equal(C.dailyPlan(D.lessons,p,'cs','hotel','2026-10-15T10:00:00Z').sentenceId,'hotel-v1-2');
 C.rateSpeaking(p,'hotel-v1-2','easy','2026-10-15T10:00:00Z');
 assert.equal(C.dailyPlan(D.lessons,p,'cs','hotel','2026-10-15T10:00:00Z').sentenceId,'bar-02');
 p.speakingReview.fake={rating:'easy',step:1,last:'bad',due:'bad'};
 assert.equal(C.validateProgress(p,D).speakingReview.fake,undefined);
});

test('restaurant branches keep distinct responses, trusted IDs and reviewable recordings',()=>{
 const fs=require('fs'),l=D.lessons.find(l=>l.id==='ristorante'),v=l.dialogueVariants.find(v=>v.id==='ristorante-v3');
 const fork=v.lines.find(line=>line.branches),entries=C.dialogueEntries(D),p=C.emptyProgress();
 assert.equal(fork.branches.length,2);
 for(const branch of fork.branches){
  assert.deepEqual(branch.lines.map(x=>x.role),['customer','barista']);
  for(const line of branch.lines){
   assert.ok(line.translation.cs&&line.translation.en&&line.situation.cs&&line.situation.en);
   assert.ok(fs.statSync('assets/audio/italian/'+D.audioFiles[line.it]).size>1000);
   assert.ok(entries.some(x=>x.id===line.id));
   p.savedSentences.push(line.id);C.rateSpeaking(p,line.id,'again','2026-10-15T10:00:00Z');
  }
 }
 const restored=C.validateProgress(p,D);assert.equal(restored.savedSentences.length,4);
 assert.equal(Object.keys(restored.speakingReview).length,4);
 for(const replies of [1,2])assert.ok(C.dialogueExcerpt(l.dialogue,v.lines,replies).some(x=>x.branches));
 assert.equal(entries.find(x=>x.id===fork.id).branches,undefined);
});

test('hotel branches retain coherent paths, review IDs and short daily excerpts',()=>{
 const fs=require('fs'),l=D.lessons.find(l=>l.id==='hotel'),v=l.dialogueVariants.find(v=>v.id==='hotel-v3');
 const fork=v.lines.find(x=>x.branches),p=C.emptyProgress();
 assert.match(v.lines[1].it,/non ho prenotato/);assert.match(v.lines[2].it,/al completo/);
 assert.equal(fork.branches.length,2);assert.ok(fork.branchTitle.cs&&fork.branchTitle.en);
 for(const b of fork.branches){
  assert.deepEqual(b.lines.map(x=>x.role),['customer','barista']);
  for(const x of b.lines){p.savedSentences.push(x.id);C.rateSpeaking(p,x.id,'again','2026-10-15T10:00:00Z');assert.ok(fs.statSync('assets/audio/italian/'+D.audioFiles[x.it]).size>1000);}
 }
 const restored=C.validateProgress(p,D);assert.equal(restored.savedSentences.length,4);assert.equal(Object.keys(restored.speakingReview).length,4);
 for(const replies of [1,2]){const excerpt=C.dialogueExcerpt(l.dialogue,v.lines,replies);assert.ok(excerpt.some(x=>x.branches));assert.equal(excerpt.filter(x=>x.role==='customer').length,replies);}
 assert.equal(C.dialogueEntries(D).find(x=>x.id===fork.id).branches,undefined);
});

test('cafe alternatives preserve cues, audio, saved sentences and daily review',()=>{
 const fs=require('fs'),l=D.lessons.find(l=>l.id==='bar'),v=l.dialogueVariants.find(v=>v.id==='bar-v3'),fork=v.lines.find(x=>x.branches),p=C.emptyProgress();
 assert.match(v.lines[1].it,/cappuccino/);assert.match(v.lines[2].it,/finito il latte/);
 assert.deepEqual(fork.branches.map(b=>b.id),['espresso','tea']);
 for(const b of fork.branches){assert.deepEqual(b.lines.map(x=>x.role),['customer','barista']);for(const x of b.lines){
 assert.ok(x.translation.cs&&x.translation.en&&x.situation.cs&&x.situation.en);
 assert.ok(fs.statSync('assets/audio/italian/'+D.audioFiles[x.it]).size>1000);
 p.savedSentences.push(x.id);C.rateSpeaking(p,x.id,'again','2026-10-15T10:00:00Z');}}
 const restored=C.validateProgress(p,D);assert.equal(restored.savedSentences.length,4);assert.equal(Object.keys(restored.speakingReview).length,4);
 for(const replies of [1,2])assert.ok(C.dialogueExcerpt(l.dialogue,v.lines,replies).some(x=>x.branches));
 assert.equal(C.dialogueEntries(D).find(x=>x.id===fork.id).branches,undefined);
});

test('city road closure supports both roles, branches and daily excerpts',()=>{
 const fs=require('fs'),l=D.lessons.find(l=>l.id==='citta'),v=l.dialogueVariants.find(v=>v.id==='citta-v2'),fork=v.lines.find(x=>x.branches),p=C.emptyProgress();
 assert.equal(v.lines[0].role,'customer');assert.match(v.lines[1].it,/chiusa per lavori/);
 assert.deepEqual(fork.branches.map(b=>b.id),['walk','bus']);
 for(const b of fork.branches){assert.deepEqual(b.lines.map(x=>x.role),['customer','barista']);for(const x of b.lines){
 assert.ok(x.translation.cs&&x.translation.en&&x.situation.cs&&x.situation.en);
 assert.ok(fs.statSync('assets/audio/italian/'+D.audioFiles[x.it]).size>1000);
 p.savedSentences.push(x.id);C.rateSpeaking(p,x.id,'again','2026-10-15T10:00:00Z');}}
 const restored=C.validateProgress(p,D);assert.equal(restored.savedSentences.length,4);assert.equal(Object.keys(restored.speakingReview).length,4);
 for(const replies of [1,2]){const excerpt=C.dialogueExcerpt(l.dialogue,v.lines,replies);assert.ok(excerpt.some(x=>x.branches));assert.equal(excerpt.filter(x=>x.role==='customer').length,replies);}
 assert.equal(C.dialogueEntries(D).find(x=>x.id===fork.id).branches,undefined);
});

test('greeting clarification branches keep spelling, saved lines and daily excerpts',()=>{
 const fs=require('fs'),l=D.lessons.find(l=>l.id==='saluti'),v=l.dialogueVariants.find(v=>v.id==='saluti-v2'),fork=v.lines.find(x=>x.branches),p=C.emptyProgress();
 assert.deepEqual(fork.branches.map(b=>b.id),['repeat','spell']);
 assert.match(fork.branches[1].lines[1].it,/a, enne, enne, a/);
 for(const b of fork.branches){assert.deepEqual(b.lines.map(x=>x.role),['customer','barista']);for(const x of b.lines){
 assert.ok(x.translation.cs&&x.translation.en&&x.situation.cs&&x.situation.en);
 assert.ok(fs.statSync('assets/audio/italian/'+D.audioFiles[x.it]).size>1000);
 p.savedSentences.push(x.id);C.rateSpeaking(p,x.id,'again','2026-10-15T10:00:00Z');}}
 const restored=C.validateProgress(p,D);assert.equal(restored.savedSentences.length,4);assert.equal(Object.keys(restored.speakingReview).length,4);
 for(const replies of [1,2]){const excerpt=C.dialogueExcerpt(l.dialogue,v.lines,replies);assert.ok(excerpt.some(x=>x.branches));assert.equal(excerpt.filter(x=>x.role==='customer').length,replies);}
 assert.equal(C.dialogueEntries(D).find(x=>x.id===fork.id).branches,undefined);
});

test('past trip branches preserve past-tense practice, audio and review',()=>{
 const fs=require('fs'),l=D.lessons.find(l=>l.id==='passato'),v=l.dialogueVariants.find(v=>v.id==='passato-v2'),fork=v.lines.find(x=>x.branches),p=C.emptyProgress();
 assert.deepEqual(fork.branches.map(b=>b.id),['problem','alternative']);
 assert.match(fork.branches[0].lines[1].it,/Abbiamo perso/);assert.match(fork.branches[1].lines[1].it,/abbiamo visitato/);
 for(const b of fork.branches){assert.deepEqual(b.lines.map(x=>x.role),['customer','barista']);for(const x of b.lines){
 assert.ok(x.translation.cs&&x.translation.en&&x.situation.cs&&x.situation.en);
 assert.ok(fs.statSync('assets/audio/italian/'+D.audioFiles[x.it]).size>1000);
 p.savedSentences.push(x.id);C.rateSpeaking(p,x.id,'again','2026-10-15T10:00:00Z');}}
 const restored=C.validateProgress(p,D);assert.equal(restored.savedSentences.length,4);assert.equal(Object.keys(restored.speakingReview).length,4);
 for(const replies of [1,2]){const excerpt=C.dialogueExcerpt(l.dialogue,v.lines,replies);assert.ok(excerpt.some(x=>x.branches));assert.equal(excerpt.filter(x=>x.role==='customer').length,replies);}
 assert.equal(C.dialogueEntries(D).find(x=>x.id===fork.id).branches,undefined);
});

test('story branches distinguish cause and consequence and retain review integration',()=>{
 const fs=require('fs'),l=D.lessons.find(l=>l.id==='racconto'),v=l.dialogueVariants.find(v=>v.id==='racconto-v2'),fork=v.lines.find(x=>x.branches),p=C.emptyProgress();
 assert.deepEqual(fork.branches.map(b=>b.id),['cause','effect']);
 assert.match(fork.branches[0].lines[1].it,/perché/);assert.match(fork.branches[1].lines[1].it,/quindi/);
 for(const b of fork.branches){assert.deepEqual(b.lines.map(x=>x.role),['customer','barista']);for(const x of b.lines){
 assert.ok(x.translation.cs&&x.translation.en&&x.situation.cs&&x.situation.en);
 assert.ok(fs.statSync('assets/audio/italian/'+D.audioFiles[x.it]).size>1000);
 p.savedSentences.push(x.id);C.rateSpeaking(p,x.id,'again','2026-10-15T10:00:00Z');}}
 const restored=C.validateProgress(p,D);assert.equal(restored.savedSentences.length,4);assert.equal(Object.keys(restored.speakingReview).length,4);
 for(const replies of [1,2]){const excerpt=C.dialogueExcerpt(l.dialogue,v.lines,replies);assert.ok(excerpt.some(x=>x.branches));assert.equal(excerpt.filter(x=>x.role==='customer').length,replies);}
 assert.equal(C.dialogueEntries(D).find(x=>x.id===fork.id).branches,undefined);
});

test('planning branches negotiate different times and retain audio and review',()=>{
 const fs=require('fs'),l=D.lessons.find(l=>l.id==='progetti'),v=l.dialogueVariants.find(v=>v.id==='progetti-v2'),fork=v.lines.find(x=>x.branches),p=C.emptyProgress();
 assert.deepEqual(fork.branches.map(b=>b.id),['suggest','ask']);
 assert.match(fork.branches[0].lines[1].it,/mattina.*nove/);assert.match(fork.branches[1].lines[1].it,/pomeriggio.*due/);
 for(const b of fork.branches){assert.deepEqual(b.lines.map(x=>x.role),['customer','barista']);for(const x of b.lines){
 assert.ok(x.translation.cs&&x.translation.en&&x.situation.cs&&x.situation.en);
 assert.ok(fs.statSync('assets/audio/italian/'+D.audioFiles[x.it]).size>1000);
 p.savedSentences.push(x.id);C.rateSpeaking(p,x.id,'again','2026-10-15T10:00:00Z');}}
 const restored=C.validateProgress(p,D);assert.equal(restored.savedSentences.length,4);assert.equal(Object.keys(restored.speakingReview).length,4);
 for(const replies of [1,2]){const excerpt=C.dialogueExcerpt(l.dialogue,v.lines,replies);assert.ok(excerpt.some(x=>x.branches));assert.equal(excerpt.filter(x=>x.role==='customer').length,replies);}
 assert.equal(C.dialogueEntries(D).find(x=>x.id===fork.id).branches,undefined);
});

test('opinion disagreement branches preserve reasons, compromise and review',()=>{
 const fs=require('fs'),l=D.lessons.find(l=>l.id==='opinioni'),v=l.dialogueVariants.find(v=>v.id==='opinioni-v2'),fork=v.lines.find(x=>x.branches),p=C.emptyProgress();
 assert.deepEqual(fork.branches.map(b=>b.id),['reason','compromise']);
 assert.match(fork.branches[0].lines[0].it,/perché/);assert.match(fork.branches[1].lines[1].it,/purché.*duri/);
 for(const b of fork.branches){assert.deepEqual(b.lines.map(x=>x.role),['customer','barista']);for(const x of b.lines){
 assert.ok(x.translation.cs&&x.translation.en&&x.situation.cs&&x.situation.en);
 assert.ok(fs.statSync('assets/audio/italian/'+D.audioFiles[x.it]).size>1000);
 p.savedSentences.push(x.id);C.rateSpeaking(p,x.id,'again','2026-10-15T10:00:00Z');}}
 const restored=C.validateProgress(p,D);assert.equal(restored.savedSentences.length,4);assert.equal(Object.keys(restored.speakingReview).length,4);
 for(const replies of [1,2]){const excerpt=C.dialogueExcerpt(l.dialogue,v.lines,replies);assert.ok(excerpt.some(x=>x.branches));assert.equal(excerpt.filter(x=>x.role==='customer').length,replies);}
 assert.equal(C.dialogueEntries(D).find(x=>x.id===fork.id).branches,undefined);
});

test('weather hypotheses branch into rain and sunshine with reviewable audio',()=>{
 const fs=require('fs'),l=D.lessons.find(l=>l.id==='ipotesi'),v=l.dialogueVariants.find(v=>v.id==='ipotesi-v2'),fork=v.lines.find(x=>x.branches),p=C.emptyProgress();
 assert.deepEqual(fork.branches.map(b=>b.id),['rain','sun']);
 assert.match(fork.branches[0].lines[1].it,/piovesse.*visiterei/);assert.match(fork.branches[1].lines[1].it,/fosse.*farei/);
 for(const b of fork.branches){assert.deepEqual(b.lines.map(x=>x.role),['customer','barista']);for(const x of b.lines){
 assert.ok(x.translation.cs&&x.translation.en&&x.situation.cs&&x.situation.en);
 assert.ok(fs.statSync('assets/audio/italian/'+D.audioFiles[x.it]).size>1000);
 p.savedSentences.push(x.id);C.rateSpeaking(p,x.id,'again','2026-10-15T10:00:00Z');}}
 const restored=C.validateProgress(p,D);assert.equal(restored.savedSentences.length,4);assert.equal(Object.keys(restored.speakingReview).length,4);
 for(const replies of [1,2]){const excerpt=C.dialogueExcerpt(l.dialogue,v.lines,replies);assert.ok(excerpt.some(x=>x.branches));assert.equal(excerpt.filter(x=>x.role==='customer').length,replies);}
 assert.equal(C.dialogueEntries(D).find(x=>x.id===fork.id).branches,undefined);
});
