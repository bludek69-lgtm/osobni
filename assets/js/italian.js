/* One shared learning application for the three site languages. No external API. */
(() => {
  'use strict';
  const D = window.ItalianData, C = window.ItalianCore;
  const lang = ['cs','en','it'].includes(document.documentElement.lang) ? document.documentElement.lang : 'cs';
  const copy = {
    cs:{lessons:'Lekce',dictionary:'Slovník',practice:'Procvičování',exam:'Zkouška',progress:'Můj pokrok',all:'Všechny úrovně',level:'Úroveň',lesson:'Lekce',allLessons:'Všechny lekce',open:'Otevřít lekci',back:'Zpět na lekce',study:'Slova a příklady',grammar:'Gramatika',choice:'Výběr významu',write:'Napiš italsky',listen:'Poslech',start:'Začít',mode:'Typ cvičení',review:'Jen chyby k opakování',noQuestions:'Pro tento výběr nejsou otázky. Zkus jiný filtr nebo nejprve dokonči test.',question:'Otázka',check:'Vyhodnotit',next:'Další otázka',finish:'Zobrazit výsledek',correct:'Správně!',wrong:'Ještě ne.',answer:'Správná odpověď',placeholder:'Napiš odpověď…',choose:'Vyber odpověď.',required:'Nejprve odpověz.',play:'Přehrát italsky',slow:'Pomaleji',stop:'Ukončit bez uložení',listenPrompt:'Poslechni si výraz a vyber jeho význam.',meaningPrompt:'Vyber význam výrazu.',writePrompt:'Napiš odpovídající výraz italsky. Všímej si členů a přízvuků.',grammarPrompt:'Doplň chybějící část věty.',result:'Výsledek',again:'Nové procvičování',saved:'Výsledek byl uložen v tomto prohlížeči.',notSaved:'Pokrok se nepodařilo uložit. Pro tuto návštěvu zůstává v paměti; stáhni si zálohu.',voice:'Italský hlas',noVoice:'Italský hlas není dostupný. Poslechové testy jsou vypnuté; ostatní funkce fungují. Zkus nainstalovat italský hlas zařízení nebo jiný prohlížeč.',voiceReady:'Zvuk používá hlas zařízení. Kvalita a dostupnost se liší; některé hlasy mohou potřebovat internet.',speechError:'Zvuk se nepodařilo přehrát. Zkus jiný hlas nebo textové cvičení. Tato otázka zatím nebyla hodnocena.',listenFirst:'Nejprve spusť poslech.',search:'Hledat slovo nebo význam',favorites:'Jen oblíbená',favorite:'Přidat k oblíbeným',unfavorite:'Odebrat z oblíbených',empty:'Nic nenalezeno.',examInfo:'20 náhodných otázek z vybrané úrovně: významy, psaní a gramatika. Volitelně přidej poslech. Výsledek platí jen pro tento soubor učiva, neurčuje celkovou jazykovou úroveň.',withAudio:'Zařadit poslechové otázky',attempts:'Dokončené testy',mistakes:'Položky k opakování',best:'Nejlepší výsledek zkoušky',history:'Poslední výsledky',export:'Stáhnout zálohu pokroku',import:'Nahrát zálohu pokroku',importConfirm:'Nahraná záloha nahradí aktuální pokrok v tomto prohlížeči. Pokračovat?',importOk:'Záloha byla načtena.',importBad:'Neplatná záloha nebo příliš velký soubor (maximum 1 MB).',storageNote:'Bez účtu a bez synchronizace. Pokrok patří tomuto prohlížeči a všem, kteří ho sdílejí. Smazání dat webu může pokrok odstranit; exportuj si zálohu.',badge:'Tematická úroveň',example:'Příklad',count:'položek',progressEmpty:'Zatím nemáš dokončený test. Začni některou lekcí.',selectVoice:'Výchozí italský hlas',accent:'Přízvuky',retry:'Opakovat chyby',reading:'Text a poslech'},
    en:{lessons:'Lessons',dictionary:'Dictionary',practice:'Practice',exam:'Exam',progress:'My progress',all:'All levels',level:'Level',lesson:'Lesson',allLessons:'All lessons',open:'Open lesson',back:'Back to lessons',study:'Words and examples',grammar:'Grammar',choice:'Choose the meaning',write:'Write in Italian',listen:'Listening',start:'Start',mode:'Exercise type',review:'Only mistakes to review',noQuestions:'No questions for this selection. Change the filter or complete a test first.',question:'Question',check:'Check answer',next:'Next question',finish:'Show result',correct:'Correct!',wrong:'Not yet.',answer:'Correct answer',placeholder:'Type your answer…',choose:'Choose an answer.',required:'Answer first.',play:'Play in Italian',slow:'Slower',stop:'Quit without saving',listenPrompt:'Listen to the expression and choose its meaning.',meaningPrompt:'Choose the meaning of the expression.',writePrompt:'Write the corresponding Italian expression. Pay attention to articles and accents.',grammarPrompt:'Complete the missing part of the sentence.',result:'Result',again:'New practice',saved:'The result was saved in this browser.',notSaved:'Progress could not be saved. It remains in memory for this visit; download a backup.',voice:'Italian voice',noVoice:'No Italian voice is available. Listening tests are disabled; other features work. Try installing an Italian device voice or another browser.',voiceReady:'Audio uses a device voice. Quality and availability vary; some voices may need internet.',speechError:'Audio could not be played. Try another voice or a text exercise. This question has not been graded.',listenFirst:'Start listening first.',search:'Search a word or meaning',favorites:'Only favorites',favorite:'Add to favorites',unfavorite:'Remove from favorites',empty:'Nothing found.',examInfo:'20 random questions from the selected level: meanings, writing and grammar. Optionally include listening. The result concerns this material only; it does not establish your overall language level.',withAudio:'Include listening questions',attempts:'Completed tests',mistakes:'Items to review',best:'Best exam result',history:'Recent results',export:'Download progress backup',import:'Upload progress backup',importConfirm:'This backup will replace progress in this browser. Continue?',importOk:'Backup loaded.',importBad:'Invalid backup or file too large (maximum 1 MB).',storageNote:'No account or synchronization. Progress belongs to this browser and everyone sharing it. Clearing site data can remove progress; export a backup.',badge:'Thematic level',example:'Example',count:'items',progressEmpty:'No completed tests yet. Start with a lesson.',selectVoice:'Default Italian voice',accent:'Accents',retry:'Review mistakes',reading:'Text and listening'},
    it:{lessons:'Lezioni',dictionary:'Glossario',practice:'Esercizi',exam:'Prova',progress:'I miei progressi',all:'Tutti i livelli',level:'Livello',lesson:'Lezione',allLessons:'Tutte le lezioni',open:'Apri la lezione',back:'Torna alle lezioni',study:'Espressioni ed esempi',grammar:'Grammatica',choice:'Scegli il significato',write:'Scrivi in italiano',listen:'Ascolto',start:'Inizia',mode:'Tipo di esercizio',review:'Solo errori da ripassare',noQuestions:'Nessuna domanda per questa selezione. Cambia filtro o completa prima una prova.',question:'Domanda',check:'Verifica',next:'Prossima domanda',finish:'Mostra il risultato',correct:'Corretto!',wrong:'Non ancora.',answer:'Risposta corretta',placeholder:'Scrivi la risposta…',choose:'Scegli una risposta.',required:'Rispondi prima.',play:'Ascolta in italiano',slow:'Più lentamente',stop:'Esci senza salvare',listenPrompt:'Ascolta l’espressione e scegli il significato.',meaningPrompt:'Scegli il significato dell’espressione.',writePrompt:'Scrivi l’espressione italiana corrispondente. Fai attenzione ad articoli e accenti.',grammarPrompt:'Completa la parte mancante della frase.',result:'Risultato',again:'Nuovo esercizio',saved:'Risultato salvato in questo browser.',notSaved:'Impossibile salvare i progressi. Restano in memoria per questa visita; scarica una copia.',voice:'Voce italiana',noVoice:'Nessuna voce italiana disponibile. Le prove di ascolto sono disattivate; le altre funzioni restano disponibili. Prova a installare una voce italiana o a cambiare browser.',voiceReady:'L’audio usa una voce del dispositivo. Qualità e disponibilità variano; alcune voci richiedono internet.',speechError:'Riproduzione non riuscita. Prova un’altra voce o un esercizio scritto. La domanda non è stata valutata.',listenFirst:'Avvia prima l’ascolto.',search:'Cerca espressione o significato',favorites:'Solo preferiti',favorite:'Aggiungi ai preferiti',unfavorite:'Rimuovi dai preferiti',empty:'Nessun risultato.',examInfo:'20 domande casuali del livello selezionato: significati, scrittura e grammatica. Puoi aggiungere l’ascolto. Il risultato riguarda solo questi materiali e non determina il livello linguistico generale.',withAudio:'Includi domande di ascolto',attempts:'Prove completate',mistakes:'Elementi da ripassare',best:'Miglior risultato nella prova',history:'Risultati recenti',export:'Scarica copia dei progressi',import:'Carica copia dei progressi',importConfirm:'La copia sostituirà i progressi in questo browser. Continuare?',importOk:'Copia caricata.',importBad:'Copia non valida o file troppo grande (massimo 1 MB).',storageNote:'Senza account né sincronizzazione. I progressi appartengono al browser e a chi lo condivide. Cancellare i dati del sito può eliminarli: scarica una copia.',badge:'Livello tematico',example:'Esempio',count:'elementi',progressEmpty:'Nessuna prova completata. Inizia da una lezione.',selectVoice:'Voce italiana predefinita',accent:'Accenti',retry:'Ripassa gli errori',reading:'Testo e ascolto'}
  };
  const T = copy[lang], app = document.getElementById('italian-app');
  const key = 'cestovatel69_italian_progress_v1';
  let progress = C.emptyProgress(), storageOK = true, voices = [], selectedVoice = '', active = 'lessons', currentLevel = 'all', currentLesson = 'all', mode = 'choice', session = null;
  let search = '', onlyFavorites = false, reviewOnly = false;
  const words = D.lessons.flatMap(l=>l.words.map(w=>({...w,level:l.level,lessonId:l.id})));
  const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const el = id => document.getElementById(id);
  const levels = ['A1','A2','B1','B2'];
  try { const stored = localStorage.getItem(key); if (stored) progress = C.validateProgress(JSON.parse(stored),D); } catch (_) { storageOK = false; }
  function save() { try {localStorage.setItem(key,JSON.stringify(progress)); storageOK=true;} catch (_) {storageOK=false;} }
  function status(text) { el('it-status').textContent = text; }
  function button(action,text,extra='') {return '<button type="button" data-action="'+action+'" '+extra+'>'+esc(text)+'</button>';}
  const options = (items,value) => items.map(([v,label])=>'<option value="'+esc(v)+'"'+(v===value?' selected':'')+'>'+esc(label)+'</option>').join('');
  function levelSelect() {return '<label>'+T.level+'<select id="it-level">'+options([['all',T.all],...levels.map(l=>[l,l])],currentLevel)+'</select></label>';}
  function lessonSelect() {return '<label>'+T.lesson+'<select id="it-lesson">'+options([['all',T.allLessons],...D.lessons.filter(l=>currentLevel==='all'||l.level===currentLevel).map(l=>[l.id,l.title[lang]])],currentLesson)+'</select></label>';}
  function audio(text) { return '<span class="it-audio">'+button('speak','▶ '+T.play,'data-speech="'+esc(text)+'"')+button('slow',T.slow,'data-speech="'+esc(text)+'"')+'</span>'; }
  function favorite(w) {const yes=progress.favorites.includes(w.id); return button('favorite',yes?'★':'☆','data-word="'+w.id+'" aria-label="'+esc(yes?T.unfavorite:T.favorite)+'" aria-pressed="'+yes+'"');}
  function renderShell() {
    app.innerHTML='<nav class="it-tabs" aria-label="'+esc(T.mode)+'">'+['lessons','dictionary','practice','exam','progress'].map(name=>button('tab',T[name],'data-tab="'+name+'" aria-pressed="'+(active===name)+'"')).join('')+'</nav><div class="it-audio-settings"><label>'+T.voice+'<select id="it-voice"></select></label><p id="it-voice-note"></p></div><p id="it-status" role="status" aria-live="polite"></p><div id="it-view"></div>';
    updateVoiceControls();
  }
  function render() {
    renderShell();
    const view=el('it-view');
    if (session) {renderQuestion(); return;}
    if (active==='lessons') {
      view.innerHTML='<div class="it-toolbar">'+levelSelect()+'</div><div class="it-lessons">'+D.lessons.filter(l=>currentLevel==='all'||l.level===currentLevel).map(l=>'<article class="it-card"><span class="it-level">'+l.level+'</span><h2>'+esc(l.title[lang])+'</h2><p>'+esc(l.note[lang])+'</p>'+button('lesson',T.open,'data-lesson="'+l.id+'"')+'</article>').join('')+'</div>';
    } else if (active==='dictionary') {
      view.innerHTML='<div class="it-toolbar">'+levelSelect()+'<label>'+T.search+'<input type="search" id="it-search" value="'+esc(search)+'"></label><label class="it-check"><input type="checkbox" id="it-favorites"'+(onlyFavorites?' checked':'')+'>'+T.favorites+'</label></div><div id="it-dictionary"></div>';
      renderDictionary();
    } else if (active==='practice') {
      view.innerHTML='<section class="it-panel"><h2>'+T.practice+'</h2><div class="it-toolbar">'+levelSelect()+lessonSelect()+'<label>'+T.mode+'<select id="it-mode">'+options(['choice','write','listen','grammar'].map(m=>[m,T[m]]),mode)+'</select></label></div><label class="it-check"><input type="checkbox" id="it-review"'+(reviewOnly?' checked':'')+'>'+T.review+'</label>'+button('start',T.start)+'</section>';
      el('it-mode').querySelector('option[value="listen"]').disabled=!voices.length;
    } else if (active==='exam') {
      view.innerHTML='<section class="it-panel"><h2>'+T.exam+'</h2><p>'+T.examInfo+'</p><div class="it-toolbar">'+levelSelect()+'</div><label class="it-check"><input type="checkbox" id="it-with-audio"'+(!voices.length?' disabled':'')+'>'+T.withAudio+'</label>'+button('exam',T.start)+'</section>';
    } else renderProgress();
    updateVoiceControls();
    if (!storageOK) status(T.notSaved);
  }
  function renderDictionary() {
    const query=C.normalize(search);
    const filtered=words.filter(w=>(currentLevel==='all'||w.level===currentLevel)&&(!onlyFavorites||progress.favorites.includes(w.id))&&C.normalize(w.italian+' '+w.meaning[lang]+' '+w.example).includes(query));
    el('it-dictionary').innerHTML='<p class="it-muted">'+filtered.length+' '+T.count+'</p><div class="it-words">'+filtered.map(w=>'<article class="it-card"><div class="it-word-top"><span class="it-level">'+w.level+'</span>'+favorite(w)+'</div><h3 lang="it">'+esc(w.italian)+'</h3><p>'+esc(w.meaning[lang])+'</p><p class="it-example" lang="it">'+esc(w.example)+'</p>'+audio(w.italian)+'</article>').join('')+'</div>'+(filtered.length?'':'<p>'+T.empty+'</p>');
    updateAudioButtons();
  }
  function showLesson(id) {
    const l=D.lessons.find(x=>x.id===id); if(!l)return;
    currentLevel=l.level; currentLesson=id;
    el('it-view').innerHTML='<section class="it-panel">'+button('back',T.back)+'<span class="it-level">'+l.level+'</span><h2 tabindex="-1" id="it-focus">'+esc(l.title[lang])+'</h2><p>'+esc(l.note[lang])+'</p><h3>'+T.study+'</h3><div class="it-words">'+l.words.map(w=>'<article class="it-card"><div class="it-word-top">'+favorite(w)+'</div><h3 lang="it">'+esc(w.italian)+'</h3><p>'+esc(w.meaning[lang])+'</p><p class="it-example" lang="it">'+esc(w.example)+'</p>'+audio(w.italian)+audio(w.example)+'</article>').join('')+'</div><div class="it-toolbar">'+['choice','write','listen','grammar'].map(m=>button('lesson-practice',T[m],'data-mode="'+m+'"'+(m==='listen'&&!voices.length?' disabled':''))).join('')+'</div></section>';
    updateAudioButtons(); el('it-focus').focus();
  }
  function selectedLessons() {return D.lessons.filter(l=>(currentLevel==='all'||l.level===currentLevel)&&(currentLesson==='all'||l.id===currentLesson));}
  function start(isExam=false) {
    const selected=isExam?D.lessons.filter(l=>currentLevel==='all'||l.level===currentLevel):selectedLessons();
    let pool;
    if(isExam) {
      const withAudio=!!el('it-with-audio')?.checked&&!!voices.length;
      // Exactly one question per vocabulary item to avoid repeating the same answer in an exam.
      pool=C.questions(selected,'choice',lang).map((q,i)=>{
        const kind=withAudio&&i%3===0?'listen':i%2===0?'write':'choice';
        return kind==='write'?{...q,kind,prompt:words.find(w=>w.id===q.id).meaning[lang],answers:[q.italian],options:[]}:{...q,kind};
      }).concat(C.questions(selected,'grammar',lang));
    } else pool=C.questions(selected,mode,lang).filter(q=>!reviewOnly||progress.mistakes[q.id]);
    if(!pool.length){status(T.noQuestions);return;}
    if(!isExam&&mode==='listen'&&!voices.length){status(T.noVoice);return;}
    session={questions:C.shuffle(pool).slice(0,isExam?20:12),index:0,correct:0,answered:false,played:false,type:isExam?'exam':'practice',level:currentLevel,changes:[]};
    render();
  }
  function renderQuestion() {
    const s=session,q=s.questions[s.index],choice=q.kind!=='write';
    const prompt=q.kind==='listen'?T.listenPrompt:q.kind==='write'?T.writePrompt:q.kind==='grammar'?T.grammarPrompt:T.meaningPrompt;
    el('it-view').innerHTML='<section class="it-panel it-quiz"><div class="it-quiz-top"><span>'+T.question+' '+(s.index+1)+' / '+s.questions.length+'</span>'+button('quit',T.stop)+'</div><progress value="'+s.index+'" max="'+s.questions.length+'" aria-label="'+T.progress+'"></progress><h2 id="it-focus" tabindex="-1">'+esc(prompt)+'</h2>'+(q.kind==='listen'?audio(q.italian):'<p class="it-prompt"'+(q.kind==='write'?'':' lang="it"')+'>'+esc(q.prompt)+'</p>')+'<form id="it-answer-form">'+(choice?'<fieldset><legend class="it-muted">'+T.choose+'</legend><div class="it-options">'+C.shuffle(q.options).map((a,i)=>'<label><input type="radio" name="answer" value="'+esc(a)+'"><span>'+esc(a)+'</span></label>').join('')+'</div></fieldset>':'<label>'+T.write+'<input id="it-written" name="answer" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="'+T.placeholder+'"></label><div class="it-accent-bar" aria-label="'+T.accent+'">'+['à','è','é','ì','ò','ù','’'].map(c=>button('accent',c,'data-char="'+c+'"')).join('')+'</div>')+'<button type="submit" class="it-primary">'+T.check+'</button></form><div id="it-feedback" role="status" aria-live="polite"></div><div id="it-next"></div></section>';
    updateAudioButtons(); el('it-focus').focus();
  }
  function submit(event) {
    event.preventDefault(); if(!session||session.answered)return;
    const q=session.questions[session.index];
    if(q.kind==='listen'&&!session.played){status(T.listenFirst);return;}
    const value=new FormData(event.target).get('answer');
    if(!value||!String(value).trim()){status(T.required);return;}
    const correct=C.grade(value,q.answers);
    session.correct+=Number(correct);session.answered=true;
    session.changes.push({id:q.id,correct});
    event.target.querySelectorAll('input,button').forEach(e=>e.disabled=true);
    el('it-feedback').className='it-feedback '+(correct?'is-correct':'is-wrong');
    el('it-feedback').innerHTML='<h3>'+esc(correct?T.correct:T.wrong)+'</h3><p>'+T.answer+': <strong>'+esc(q.answers[0])+'</strong></p>'+(q.kind==='listen'?'<p lang="it">'+esc(q.italian)+'</p>':'')+'<p'+(q.kind==='grammar'?'':' lang="it"')+'>'+esc(q.kind==='grammar'?q.explanation[lang]:q.explanation)+'</p>';
    el('it-next').innerHTML=button('next',session.index===session.questions.length-1?T.finish:T.next);
    status('');
  }
  function finish() {
    const s=session;
    for(const item of s.changes) {if(item.correct)delete progress.mistakes[item.id];else progress.mistakes[item.id]=(progress.mistakes[item.id]||0)+1;}
    progress.results.push({date:new Date().toISOString(),correct:s.correct,total:s.questions.length,type:s.type,level:s.level});
    progress.results=progress.results.slice(-50);save(); session=null;
    el('it-view').innerHTML='<section class="it-panel it-result"><h2 id="it-focus" tabindex="-1">'+T.result+'</h2><p class="it-score">'+s.correct+' / '+s.questions.length+'</p><p>'+Math.round(s.correct/s.questions.length*100)+' %</p><p>'+esc(storageOK?T.saved:T.notSaved)+'</p><div class="it-toolbar">'+button('again',T.again)+button('retry',T.retry)+'</div></section>';
    el('it-focus').focus();
  }
  function renderProgress() {
    const exams=progress.results.filter(r=>r.type==='exam');
    const best=exams.length?Math.max(...exams.map(r=>Math.round(r.correct/r.total*100)))+' %':'—';
    el('it-view').innerHTML='<section class="it-panel"><h2>'+T.progress+'</h2><p>'+T.storageNote+'</p><div class="it-stats"><div><strong>'+progress.results.length+'</strong><span>'+T.attempts+' (max. 50)</span></div><div><strong>'+Object.keys(progress.mistakes).length+'</strong><span>'+T.mistakes+'</span></div><div><strong>'+best+'</strong><span>'+T.best+'</span></div></div><div class="it-toolbar">'+button('export',T.export)+'<label class="it-import">'+T.import+'<input type="file" id="it-import" accept=".json,application/json"></label>'+button('retry',T.retry)+'</div><h3>'+T.history+'</h3><ol class="it-history">'+progress.results.slice(-10).reverse().map(r=>'<li>'+esc(new Date(r.date).toLocaleDateString(lang))+' · '+esc(T[r.type])+' · '+r.level+' <strong>'+r.correct+' / '+r.total+'</strong></li>').join('')+'</ol>'+(progress.results.length?'':'<p>'+T.progressEmpty+'</p>')+'</section>';
  }
  function updateAudioButtons() {app.querySelectorAll('[data-action="speak"],[data-action="slow"]').forEach(b=>b.disabled=!voices.length);}
  function updateVoiceControls() {
    const select=el('it-voice'); if(!select)return;
    select.innerHTML=options(voices.map(v=>[v.voiceURI,v.name+' ('+v.lang+')']),selectedVoice);
    select.disabled=!voices.length;
    el('it-voice-note').textContent=voices.length?T.voiceReady:T.noVoice;
    updateAudioButtons();
    const listeningOption=el('it-mode')?.querySelector('[value="listen"]');if(listeningOption)listeningOption.disabled=!voices.length;
    const withAudio=el('it-with-audio');if(withAudio)withAudio.disabled=!voices.length;
    app.querySelectorAll('[data-action="lesson-practice"][data-mode="listen"]').forEach(b=>b.disabled=!voices.length);
  }
  function loadVoices() {
    voices=window.speechSynthesis?window.speechSynthesis.getVoices().filter(v=>/^it(?:-|_)/i.test(v.lang)):[];
    if(!voices.some(v=>v.voiceURI===selectedVoice))selectedVoice=voices[0]?.voiceURI||'';
    updateVoiceControls();
  }
  function speak(text,slow=false) {
    if(!voices.length){status(T.noVoice);return;}
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);utterance.lang='it-IT';utterance.voice=voices.find(v=>v.voiceURI===selectedVoice)||voices[0];utterance.rate=slow?0.72:0.95;
    const target=session;
    utterance.onstart=()=>{if(session===target&&target)target.played=true;};
    utterance.onerror=event=>{if(['canceled','interrupted'].includes(event.error))return;if(session===target&&target)target.played=false;status(T.speechError);};
    window.speechSynthesis.speak(utterance);
  }
  app.addEventListener('submit',submit);
  app.addEventListener('input',event=>{if(event.target.id==='it-search'){search=event.target.value;renderDictionary();}});
  app.addEventListener('change',async event=>{
    const target=event.target;
    if(target.id==='it-level'){currentLevel=target.value;currentLesson='all';render();}
    if(target.id==='it-lesson')currentLesson=target.value;
    if(target.id==='it-mode')mode=target.value;
    if(target.id==='it-voice')selectedVoice=target.value;
    if(target.id==='it-favorites'){onlyFavorites=target.checked;renderDictionary();}
    if(target.id==='it-review')reviewOnly=target.checked;
    if(target.id==='it-import'){
      try {
        const file=target.files[0];if(!file)return;if(file.size>1048576)throw new Error('large');
        const imported=C.validateProgress(JSON.parse(await file.text()),D);
        if(!window.confirm(T.importConfirm))return;
        progress=imported;save();render();status(storageOK?T.importOk:T.notSaved);
      } catch(_){status(T.importBad);} finally {target.value='';}
    }
  });
  app.addEventListener('click',event=>{
    const b=event.target.closest('button[data-action]');if(!b||b.disabled)return;
    const action=b.dataset.action;
    if(action==='speak'||action==='slow'){speak(b.dataset.speech,action==='slow');return;}
    if(action==='accent'){
      const input=el('it-written');if(!input||input.disabled)return;
      const start=input.selectionStart,end=input.selectionEnd;input.setRangeText(b.dataset.char,start,end,'end');input.focus();return;
    }
    if(action==='favorite'){
      const id=b.dataset.word;const yes=progress.favorites.includes(id);
      progress.favorites=yes?progress.favorites.filter(x=>x!==id):[...progress.favorites,id];save();
      b.textContent=yes?'☆':'★';b.setAttribute('aria-pressed',String(!yes));b.setAttribute('aria-label',yes?T.favorite:T.unfavorite);
      if(active==='dictionary')renderDictionary();if(!storageOK)status(T.notSaved);return;
    }
    if(action==='tab'){if(session)window.speechSynthesis?.cancel();session=null;active=b.dataset.tab;render();}
    if(action==='lesson')showLesson(b.dataset.lesson);
    if(action==='back'){currentLesson='all';render();}
    if(action==='lesson-practice'){mode=b.dataset.mode;reviewOnly=false;active='practice';start();}
    if(action==='start')start();
    if(action==='exam'){currentLesson='all';start(true);}
    if(action==='quit'){window.speechSynthesis?.cancel();session=null;render();}
    if(action==='next'&&session?.answered){if(session.index===session.questions.length-1)finish();else{window.speechSynthesis?.cancel();session.index++;session.answered=false;session.played=false;renderQuestion();}}
    if(action==='again'){active='practice';reviewOnly=false;render();}
    if(action==='retry'){active='practice';currentLevel='all';currentLesson='all';mode='choice';reviewOnly=true;render();}
    if(action==='export'){
      const url=URL.createObjectURL(new Blob([JSON.stringify(progress,null,2)],{type:'application/json'}));
      const a=document.createElement('a');a.href=url;a.download='italian-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
  });
  render();loadVoices();
  window.speechSynthesis?.addEventListener('voiceschanged',loadVoices);
})();
