// Exercise the real consent/GA configuration without contacting Google.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const original = fs.readFileSync('assets/js/analytics-consent.js', 'utf8');
const registry = JSON.parse(fs.readFileSync('_data/youtube-campaigns.json', 'utf8'));
const source = original.replace(/if \(document\.readyState === 'loading'\) document\.addEventListener\('DOMContentLoaded', install\);\r?\n  else install\(\);/, 'window.testConsent = {apply, disable, installAdvertising};');
assert.notEqual(source, original);
function run(search, hostname = 'cestovatel69.cz') {
  const scripts = [];
  const document = {documentElement: {lang: 'cs', dataset: {}}, referrer: 'https://www.youtube.com/watch?v=private&email=secret@example.com', title: 'Článek', cookie: '', createElement: () => ({addEventListener(event, fn) { this[event] = fn; }}), getElementById: id => scripts.find(x => x.id === id), head: {appendChild: x => scripts.push(x)}};
  const window = {};
  vm.runInNewContext(source, {window, document, URL, URLSearchParams, location: {hostname, search, origin: 'https://' + hostname, pathname: '/blog/hoslovicky-mlyn/', protocol: 'https:'}, localStorage: {getItem: () => null}, Date, Number});
  return {window, document, scripts, commands: () => Array.from(window.dataLayer || [], x => Array.from(x))};
}
for (const video of registry) {
  const query = '?' + new URLSearchParams({utm_source: 'youtube', utm_medium: 'organic_video', utm_campaign: video.campaign, utm_content: video.id, email: 'secret@example.com'});
  const test = run(query);
  assert.equal(test.scripts.length, 0, 'nothing loaded before consent');
  test.window.testConsent.apply(false);
  assert.equal(test.commands().length, 0, 'no GA commands on decline');
  test.window.testConsent.apply(true);
  const commands = test.commands();
  const config = commands.find(c => c[0] === 'config')[2];
  assert.equal(config.campaign_content, video.id);
  assert.equal(config.campaign_name, video.campaign);
  assert.equal(config.campaign_source, 'youtube');
  const arrival = commands.find(c => c[1] === 'youtube_arrival');
  assert.equal(arrival[2].video_id, video.id);
  assert.equal(arrival[2].source_video, video.title.slice(0, 100));
  assert(!JSON.stringify(commands).includes('secret@example.com'));
  assert.equal(config.page_referrer, 'https://www.youtube.com/watch');
  assert(!config.page_location.includes('?'));
  test.window.testConsent.apply(true);
  assert.equal(test.commands().filter(c => c[1] === 'youtube_arrival').length, 1, 'no duplicate arrival on reopening consent');
  test.window.testConsent.apply(false);
  assert.equal(test.window['ga-disable-G-BM11EHQG00'], true);
}
for (const search of ['', '?utm_source=youtube&utm_medium=organic_video&utm_content=abcdefghijk&utm_campaign=unknown', '?utm_source=youtube&utm_medium=organic_video&utm_content=hqDFJFh8dak&utm_campaign=secret', '?utm_source=email&utm_medium=organic_video&utm_content=hqDFJFh8dak']) {
  const test = run(search); test.window.testConsent.apply(true);
  assert(!test.commands().some(c => c[1] === 'youtube_arrival'));
  assert.equal(test.commands().find(c => c[0] === 'config')[2].campaign_source, undefined);
}
const local = run('', '127.0.0.1'); local.window.testConsent.apply(true);
assert.equal(local.scripts.length, 0);
const ads = run('');
const controls = {children: [], appendChild(node) { this.children.push(node); }};
ads.window.testConsent.installAdvertising(controls);
assert.equal(ads.scripts.length, 1);
assert(ads.scripts[0].src.startsWith('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2131933406219379'));
assert(!ads.commands().some(c => c[0] === 'config'), 'loading the CMP never enables Analytics');
const defaults = ads.commands()[0];
assert.equal(defaults[0], 'consent');
for (const purpose of ['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization']) assert.equal(defaults[2][purpose], 'denied');
const button = controls.children[0];
assert.equal(button.hidden, true);
const queue = ads.window.googlefc.callbackQueue;
queue[0].CONSENT_API_READY();
assert.equal(button.hidden, false);
let revocations = 0;
ads.window.googlefc.showRevocationMessage = () => { revocations++; };
button.click();
assert.equal(revocations, 0, 'revocation uses the supported ready callback');
queue[1].CONSENT_API_READY();
assert.equal(revocations, 1);
const beforeAnalytics = ads.commands().length;
ads.window.testConsent.apply(true);
ads.window.testConsent.apply(false);
const analyticsConsentCommands = ads.commands().slice(beforeAnalytics).filter(c => c[0] === 'consent');
for (const command of analyticsConsentCommands) {
  assert.deepEqual(Object.keys(command[2]), ['analytics_storage'], 'Analytics choices must not override the CMP advertising decision');
}
assert.equal(ads.window['ga-disable-G-BM11EHQG00'], true);
local.window.testConsent.installAdvertising(controls);
assert.equal(local.scripts.length, 0, 'CMP and advertising excluded from local previews');
console.log(`PASS: ${registry.length} issued video links; attribution, privacy, independent advertising consent, revocation, denied defaults, localhost exclusion.`);
