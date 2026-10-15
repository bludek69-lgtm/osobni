const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./assets/js/italian-data.js');
const C = require('./assets/js/italian-core.js');

test('12 lessons, 84 vocabulary items, 60 grammar questions, four levels', () => {
  assert.equal(D.lessons.length,12);
  assert.equal(D.lessons.flatMap(l=>l.words).length,84);
  assert.equal(D.lessons.flatMap(l=>l.questions).length,60);
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
  assert.equal(qs.length,mode==='grammar'?60:84);
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
