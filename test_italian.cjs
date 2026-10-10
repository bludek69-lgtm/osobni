const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./assets/js/italian-data.js');
const C = require('./assets/js/italian-core.js');

test('12 lessons, 84 vocabulary items, 24 grammar questions, four levels', () => {
  assert.equal(D.lessons.length,12);
  assert.equal(D.lessons.flatMap(l=>l.words).length,84);
  assert.equal(D.lessons.flatMap(l=>l.questions).length,24);
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
  assert.equal(qs.length,mode==='grammar'?24:84);
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
