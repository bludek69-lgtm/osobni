const test = require('node:test');
const assert = require('node:assert/strict');
const D = require('./assets/js/italian-data.js');
const C = require('./assets/js/italian-core.js');

test('12 lessons, 72 vocabulary items, 24 grammar questions, four levels', () => {
  assert.equal(D.lessons.length,12);
  assert.equal(D.lessons.flatMap(l=>l.words).length,72);
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
  assert.equal(qs.length,mode==='grammar'?24:72);
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
