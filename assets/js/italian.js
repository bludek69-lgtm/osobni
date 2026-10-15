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
  Object.assign(copy.cs,{cards:'Kartičky',picture:'Obrázkový test',picturePrompt:'Co je na obrázku? Vyber správný italský výraz.',cardsInfo:'Prohlédni si obrázek, zkus si vybavit italský výraz a otoč kartičku. Obrázky jsou u 24 konkrétních výrazů A1–A2; ostatní kartičky jsou textové.',picturesOnly:'Jen obrázkové kartičky',flip:'Otočit kartičku',hide:'Skrýt odpověď',previousCard:'Předchozí kartička',nextCard:'Další kartička',card:'Kartička',pictureStart:'Vyzkoušet obrázkový test',noPictures:'V tomto výběru nejsou obrázky. Vyber A1/A2 nebo vypni filtr obrázků pro textové kartičky.',pictureFallback:'Textový popis obrázku (pro přístupnost)'});
  Object.assign(copy.en,{cards:'Flashcards',picture:'Picture quiz',picturePrompt:'What is in the picture? Choose the Italian expression.',cardsInfo:'Look at the picture, recall the Italian expression and flip the card. Pictures cover 24 concrete A1–A2 expressions; the remaining cards use text.',picturesOnly:'Picture cards only',flip:'Flip card',hide:'Hide answer',previousCard:'Previous card',nextCard:'Next card',card:'Card',pictureStart:'Try the picture quiz',noPictures:'No pictures for this selection. Choose A1/A2 or disable the picture filter for text flashcards.',pictureFallback:'Picture description (accessibility)'});
  Object.assign(copy.it,{cards:'Carte',picture:'Quiz illustrato',picturePrompt:'Che cosa c’è nell’immagine? Scegli l’espressione italiana.',cardsInfo:'Guarda l’immagine, ricorda l’espressione italiana e gira la carta. Le immagini coprono 24 espressioni concrete A1–A2; le altre carte usano il testo.',picturesOnly:'Solo carte illustrate',flip:'Gira la carta',hide:'Nascondi la risposta',previousCard:'Carta precedente',nextCard:'Carta successiva',card:'Carta',pictureStart:'Prova il quiz illustrato',noPictures:'Nessuna immagine per questa selezione. Scegli A1/A2 o disattiva il filtro immagini per le carte testuali.',pictureFallback:'Descrizione dell’immagine (accessibilità)'});
  const T = copy[lang], app = document.getElementById('italian-app');
  const lessonPictureDirectory = new URL('../img/italian/lessons/', document.currentScript.src).href;
  const pictureDirectory = new URL('../img/italian/ai/', document.currentScript.src).href;
  Object.assign(copy.cs,{photoCredit:'AI ilustrace',photoInfo:'24 realistických ilustrací vytvořených pomocí AI pro tuto výuku. Nejde o skutečné fotografie míst či produktů. Abstraktní výrazy zůstávají textové.'});
  Object.assign(copy.en,{photoCredit:'AI illustration',photoInfo:'24 realistic AI-generated illustrations for these lessons. They are not actual photographs of places or products. Abstract expressions remain text-only.'});
  Object.assign(copy.it,{photoCredit:'Illustrazione IA',photoInfo:'24 illustrazioni realistiche generate con IA per queste lezioni. Non sono fotografie reali di luoghi o prodotti. Le espressioni astratte restano testuali.'});
  const key = 'cestovatel69_italian_progress_v1';
  const extra = {
    cs:{quick:'Začít na 5 minut',resume:'Pokračovat v učení',resumeNote:'Máš rozpracované učení.',settings:'Zvuk a výslovnost',localAudio:'Všechny lekce mají vlastní syntetické nahrávky dialogů, výrazů a příkladových vět.',textCards:'Zobrazit textové kartičky',goal:'Dnes se naučíš',dialogue:'1. Poslechni si rozhovor',vocabulary:'2. Slova a příklady',rules:'3. Jak to funguje',tryIt:'4. Vyzkoušej si to',playAll:'Přehrát celý dialog',stopAudio:'Zastavit zvuk',translation:'Ukázat překlad / vysvětlení',barista:'Obsluha',customer:'Zákazník',wordAudio:'Poslechnout výraz',sentenceAudio:'Poslechnout větu',lineAudio:'Přehrát repliku',slowLine:'Přehrát pomalu',cafeTime:'V kavárně · A1 · asi 5 minut',cafeContext:'Jsi v italské kavárně. Objednej si u baru, zjisti cenu a požádej o účet.',ruleText:'Vorrei… = chtěl/a bych… Přidej per favore. Al banco znamená u baru, al tavolo u stolu. Il conto, per favore je prosba o účet. Částka v dialogu je modelový příklad.',practiceCafe:'Procvičit objednávku',completed:'Po procvičení si zkus bez nápovědy objednat nápoj a požádat o účet.',savedDraft:'Průběžně ukládáno v tomto prohlížeči.',newAttempt:'Nový test nahradí rozpracovaný test. Pokračovat?',reviewMixed:'Opakování zahrnuje slovíčka i gramatiku; zachová typ poslední chyby.',audioUnavailable:'Tento poslech nyní nemá dostupný zvuk. Zvol jiný hlas nebo jinou lekci.',audioCredit:'Syntetické italské hlasy · předem připravené nahrávky',cafeTitle:'Objednám si v kavárně',noMistakes:'Nemáš žádné chyby k opakování.'},
    en:{quick:'Start a 5-minute lesson',resume:'Continue learning',resumeNote:'You have unfinished learning.',settings:'Audio and pronunciation',localAudio:'All lessons include prerecorded synthetic audio for dialogues, expressions and example sentences.',textCards:'Show text flashcards',goal:'Today you will learn to',dialogue:'1. Listen to the conversation',vocabulary:'2. Words and examples',rules:'3. How it works',tryIt:'4. Try it yourself',playAll:'Play the whole dialogue',stopAudio:'Stop audio',translation:'Show translation / explanation',barista:'Barista',customer:'Customer',wordAudio:'Listen to the expression',sentenceAudio:'Listen to the sentence',lineAudio:'Play this line',slowLine:'Play slowly',cafeTime:'At a café · A1 · about 5 minutes',cafeContext:'You are in an Italian café. Order at the counter, find out the price and ask for the bill.',ruleText:'Vorrei… means I would like… Add per favore. Al banco means at the counter; al tavolo means at a table. Il conto, per favore asks for the bill. The price in the dialogue is an example.',practiceCafe:'Practise ordering',completed:'After practising, try ordering a drink and asking for the bill without hints.',savedDraft:'Saved as you go in this browser.',newAttempt:'A new test will replace your unfinished test. Continue?',reviewMixed:'Review includes vocabulary and grammar and preserves the last mistake’s exercise type.',audioUnavailable:'Audio is unavailable for this question. Choose another voice or lesson.',audioCredit:'Synthetic Italian voices · prerecorded audio',cafeTitle:'Order at a café',noMistakes:'No mistakes to review.'},
    it:{quick:'Inizia una lezione di 5 minuti',resume:'Continua a imparare',resumeNote:'Hai un’attività da completare.',settings:'Audio e pronuncia',localAudio:'Al bar include registrazioni sintetiche. La voce del dispositivo serve solo per le altre lezioni.',textCards:'Mostra le carte testuali',goal:'Oggi impari a',dialogue:'1. Ascolta la conversazione',vocabulary:'2. Espressioni ed esempi',rules:'3. Come funziona',tryIt:'4. Prova tu',playAll:'Ascolta tutto il dialogo',stopAudio:'Ferma l’audio',translation:'Mostra traduzione / spiegazione',barista:'Barista',customer:'Cliente',wordAudio:'Ascolta l’espressione',sentenceAudio:'Ascolta la frase',lineAudio:'Ascolta la battuta',slowLine:'Ascolta lentamente',cafeTime:'Al bar · A1 · circa 5 minuti',cafeContext:'Sei in un bar italiano. Ordina al banco, scopri il prezzo e chiedi il conto.',ruleText:'Vorrei… rende cortese la richiesta. Aggiungi per favore. Puoi consumare al banco oppure al tavolo. Il conto, per favore serve per chiedere di pagare. Il prezzo del dialogo è un esempio.',practiceCafe:'Esercitati a ordinare',completed:'Dopo gli esercizi, prova a ordinare una bevanda e chiedere il conto senza suggerimenti.',savedDraft:'Salvataggio automatico in questo browser.',newAttempt:'La nuova prova sostituirà quella in corso. Continuare?',reviewMixed:'Il ripasso include lessico e grammatica e mantiene il tipo dell’ultimo errore.',audioUnavailable:'Audio non disponibile per questa domanda. Scegli un’altra voce o lezione.',audioCredit:'Voci italiane sintetiche · audio preregistrato',cafeTitle:'Ordinare al bar',noMistakes:'Nessun errore da ripassare.'}
  };
  Object.assign(T,extra[lang]);
  const draftKey='cestovatel69_italian_draft_v1';
  const audioDirectory=new URL('../audio/italian/',document.currentScript.src).href;
  let pausedSession=null,lastLesson=null,openedLesson=null,media=null,audioGeneration=0;
  const canSpeak=text=>!!D.audioFiles?.[text]||voices.length>0;
  let progress = C.emptyProgress(), storageOK = true, voices = [], selectedVoice = '', active = 'lessons', currentLevel = 'all', currentLesson = 'all', mode = 'choice', session = null;
  let search = '', onlyFavorites = false, reviewOnly = false;
  let cardIndex = 0, cardFlipped = false, picturesOnly = true;
  const words = D.lessons.flatMap(l=>l.words.map(w=>({...w,level:l.level,lessonId:l.id})));
  const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const el = id => document.getElementById(id);
  const levels = ['A1','A2','B1','B2'];
  try { const stored = localStorage.getItem(key); if (stored) progress = C.validateProgress(JSON.parse(stored),D); } catch (_) { storageOK = false; }
  try {
    const draft=JSON.parse(localStorage.getItem(draftKey)||'null');
    if(draft?.version===1) {
      pausedSession=C.restoreSession(draft.session,D.lessons,lang);
      if(D.lessons.some(l=>l.id===draft.lesson))lastLesson=draft.lesson;
    }
  } catch (_) { /* A malformed draft must not prevent lessons from loading. */ }
  function saveDraft() {
    try {localStorage.setItem(draftKey,JSON.stringify({version:1,lesson:lastLesson,session:session||pausedSession}));}
    catch(_){storageOK=false;status(T.notSaved);}
  }
  function save() { try {localStorage.setItem(key,JSON.stringify(progress)); storageOK=true;} catch (_) {storageOK=false;} }
  function status(text) { el('it-status').textContent = text; }
  function button(action,text,extra='') {return '<button type="button" data-action="'+action+'" '+extra+'>'+esc(text)+'</button>';}
  const options = (items,value) => items.map(([v,label])=>'<option value="'+esc(v)+'"'+(v===value?' selected':'')+'>'+esc(label)+'</option>').join('');
  function levelSelect() {return '<label>'+T.level+'<select id="it-level">'+options([['all',T.all],...levels.map(l=>[l,l])],currentLevel)+'</select></label>';}
  function lessonSelect() {return '<label>'+T.lesson+'<select id="it-lesson">'+options([['all',T.allLessons],...D.lessons.filter(l=>currentLevel==='all'||l.level===currentLevel).map(l=>[l.id,l.title[lang]])],currentLesson)+'</select></label>';}
  function audio(text,label=T.wordAudio) { return '<span class="it-audio">'+button('speak','▶ '+label,'data-speech="'+esc(text)+'"')+button('slow',T.slow,'data-speech="'+esc(text)+'" aria-label="'+esc(T.slowLine+': '+text)+'"')+'</span>'; }
  function favorite(w) {const yes=progress.favorites.includes(w.id); return button('favorite',yes?'★':'☆','data-word="'+w.id+'" aria-label="'+esc(yes?T.unfavorite:T.favorite)+'" aria-pressed="'+yes+'"');}
  function picture(w) {
    return '<img class="it-picture" src="'+esc(pictureDirectory+D.illustrations[w.picture].file)+'" alt="'+esc(w.pictureDescription||w.meaning[lang])+'" decoding="async">';
  }
  function photoCredit(w) {
    if(!D.illustrations[w.picture])return '';
    return '<p class="it-photo-credit">'+esc(T.photoCredit)+' · OpenAI</p>';
  }
  function cardDeck() {return words.filter(w=>(currentLevel==='all'||w.level===currentLevel)&&(!picturesOnly||w.picture));}
  function renderCards() {
    const deck=cardDeck(); cardIndex=deck.length?((cardIndex%deck.length)+deck.length)%deck.length:0;
    const w=deck[cardIndex];
    el('it-view').innerHTML='<section class="it-panel"><h2>'+T.cards+'</h2><p>'+T.cardsInfo+'</p><div class="it-toolbar">'+levelSelect()+'<label class="it-check"><input type="checkbox" id="it-pictures-only"'+(picturesOnly?' checked':'')+'>'+T.picturesOnly+'</label></div>'+(w?'<div class="it-flashcard"><p class="it-muted">'+T.card+' '+(cardIndex+1)+' / '+deck.length+' · '+w.level+'</p><button type="button" class="it-flip" data-action="flip" aria-expanded="'+cardFlipped+'" aria-controls="it-card-answer">'+(w.picture?picture(w):'<span class="it-card-clue">'+esc(w.meaning[lang])+'</span>')+'<span class="it-flip-label">'+(cardFlipped?T.hide:T.flip)+'</span></button><div id="it-card-answer"'+(cardFlipped?'':' hidden')+'>'+(cardFlipped?'<h3 lang="it">'+esc(w.italian)+'</h3><p>'+esc(w.meaning[lang])+'</p><p class="it-example" lang="it">'+esc(w.example)+'</p>'+audio(w.italian)+favorite(w):'')+'</div><div class="it-toolbar it-card-controls">'+button('card-previous',T.previousCard)+button('card-next',T.nextCard)+'</div>'+button('picture-start',T.pictureStart,'class="it-primary"'+(!deck.some(x=>x.picture)?' disabled':''))+'</div>':'<p>'+T.noPictures+'</p>')+'</section>';
    if(w?.picture)el('it-view').querySelector('.it-flip').insertAdjacentHTML('afterend',photoCredit(w));
    if(!w&&picturesOnly)el('it-view').querySelector('.it-panel').insertAdjacentHTML('beforeend',button('text-cards',T.textCards,'class="it-primary"'));
    el('it-view').insertAdjacentHTML('beforeend','<p class="it-photo-note">'+T.photoInfo+'</p>');
    updateAudioButtons();
  }
  function renderShell() {
    app.innerHTML='<div class="it-start-row">'+button('quick',T.quick,'class="it-primary"')+((pausedSession||lastLesson)&&!session?button('resume',T.resume):'')+'</div><nav class="it-tabs" aria-label="'+esc(T.mode)+'">'+['lessons','cards','dictionary','practice','exam','progress'].map(name=>button('tab',T[name],'data-tab="'+name+'" aria-pressed="'+(active===name)+'"')).join('')+'</nav><details class="it-audio-disclosure"><summary>'+T.settings+'</summary><div class="it-audio-settings"><label>'+T.voice+'<select id="it-voice"></select></label><p id="it-voice-note"></p></div></details><p id="it-status" role="status" aria-live="polite"></p><div id="it-view"></div>';
    updateVoiceControls();
  }
  function renderQuick() {
    const t={
      cs:{intro:'Vyber si krátké učení podle toho, kde jsi skončil/a. Pět minut je orientační čas; tempo je na tobě.',test:'Pokračovat v rozpracovaném testu',question:'Otázka',last:'Vrátit se k poslední lekci',review:'Zopakovat až 5 chyb',count:'Položky k opakování',replace:'Spuštění opakování nahradí rozpracovaný test až po potvrzení.',first:'Začít první lekcí',browse:'Vybrat jinou lekci'},
      en:{intro:'Choose a short activity based on where you left off. Five minutes is a guide; learn at your own pace.',test:'Continue your unfinished test',question:'Question',last:'Return to the last lesson',review:'Review up to 5 mistakes',count:'Items to review',replace:'Starting a review replaces your unfinished test only after confirmation.',first:'Start the first lesson',browse:'Choose another lesson'},
      it:{intro:'Scegli una breve attività. Cinque minuti sono indicativi: procedi al tuo ritmo.',test:'Continua la prova in corso',question:'Domanda',last:'Torna all’ultima lezione',review:'Ripassa fino a 5 errori',count:'Elementi da ripassare',replace:'Il ripasso sostituisce la prova in corso solo dopo la conferma.',first:'Inizia la prima lezione',browse:'Scegli un’altra lezione'}
    }[lang];
    const last=D.lessons.find(l=>l.id===lastLesson),mistakes=C.reviewQuestions(D.lessons,progress,lang);
    let choices='';
    if(pausedSession)choices+='<article class="it-card"><h3>'+t.test+'</h3><p>'+t.question+' '+(pausedSession.index+1)+' / '+pausedSession.questions.length+'</p>'+button('resume',T.resume,'class="it-primary"')+'</article>';
    else if(last)choices+='<article class="it-card"><h3>'+t.last+'</h3><p>'+esc(last.title[lang])+'</p>'+button('resume',T.resume,'class="it-primary"')+'</article>';
    if(mistakes.length)choices+='<article class="it-card"><h3>'+t.review+'</h3><p>'+t.count+': '+mistakes.length+'</p><p>'+T.reviewMixed+'</p>'+(pausedSession?'<p class="it-muted">'+t.replace+'</p>':'')+button('quick-review',T.retry,'class="it-primary"')+'</article>';
    if(!last&&!pausedSession&&!mistakes.length){const first=D.lessons[0];choices+='<article class="it-card"><h3>'+t.first+'</h3><p>'+esc(first.title[lang])+'</p>'+button('lesson',T.open,'data-lesson="'+first.id+'" class="it-primary"')+'</article>';}
    el('it-view').innerHTML='<section class="it-panel it-quick"><h2 id="it-focus" tabindex="-1">'+T.quick+'</h2><p>'+t.intro+'</p><div class="it-lessons">'+choices+'</div>'+button('tab',t.browse,'data-tab="lessons"')+'</section>';
    el('it-focus').focus();
  }
  function render() {
    renderShell();
    const view=el('it-view');
    if (session) {renderQuestion(); return;}
    if(active==='quick'){renderQuick();return;}
    if(active==='lessons'&&openedLesson){showLesson(openedLesson);return;}
    if (active==='lessons') {
      view.innerHTML='<div class="it-toolbar">'+levelSelect()+'</div><div class="it-lessons">'+D.lessons.filter(l=>currentLevel==='all'||l.level===currentLevel).map(l=>'<article class="it-card"><img class="it-lesson-thumb" src="'+esc(lessonPictureDirectory+D.lessonIllustrations[l.id].file)+'" alt="" width="1200" height="800" loading="lazy" decoding="async"><span class="it-level">'+l.level+'</span><h2>'+esc(l.title[lang])+'</h2><p>'+esc(l.note[lang])+'</p>'+button('lesson',T.open,'data-lesson="'+l.id+'"')+'</article>').join('')+'</div>';
    } else if (active==='cards') {
      renderCards();
    } else if (active==='dictionary') {
      view.innerHTML='<div class="it-toolbar">'+levelSelect()+'<label>'+T.search+'<input type="search" id="it-search" value="'+esc(search)+'"></label><label class="it-check"><input type="checkbox" id="it-favorites"'+(onlyFavorites?' checked':'')+'>'+T.favorites+'</label></div><div id="it-dictionary"></div>';
      renderDictionary();
    } else if (active==='practice') {
      view.innerHTML='<section class="it-panel"><h2>'+T.practice+'</h2><div class="it-toolbar">'+levelSelect()+lessonSelect()+'<label>'+T.mode+'<select id="it-mode">'+options(['choice','picture','write','listen','grammar'].map(m=>[m,T[m]]),mode)+'</select></label></div><label class="it-check"><input type="checkbox" id="it-review"'+(reviewOnly?' checked':'')+'>'+T.review+'</label>'+button('start',T.start)+'</section>';
      el('it-mode').querySelector('option[value="listen"]').disabled=!selectedLessons().some(l=>l.words.some(w=>canSpeak(w.italian)));
      if(reviewOnly)view.querySelector('.it-panel').insertAdjacentHTML('beforeend','<p class="it-muted">'+T.reviewMixed+'</p>');
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
  const cafeVideoId='dcf1d9a305bd77187a7cf9e2db8cd677';
  const freyaCopy={
    cs:{title:'V kavárně s Freyou',intro:'Poslechni si užitečné věty a opakuj je nahlas. Video můžeš kdykoliv pozastavit.',load:'Načíst video s Freyou',note:'AI lektorka a syntetický hlas · přehrávač HeyGen se připojí po kliknutí.',transcript:'Italský přepis a český překlad',link:'Otevřít video v HeyGen'},
    en:{title:'At a café with Freya',intro:'Listen to the useful phrases and repeat them aloud. Pause the video whenever you need.',load:'Load Freya’s video',note:'AI tutor and synthetic voice · HeyGen connects when you click.',transcript:'Italian transcript and English translation',link:'Open video in HeyGen'},
    it:{title:'Al bar con Freya',intro:'Ascolta l’ordinazione e ripeti le frasi ad alta voce. Puoi mettere in pausa quando vuoi.',load:'Carica il video con Freya',note:'Tutor IA e voce sintetica · HeyGen si collega dopo il clic.',transcript:'Leggi la trascrizione',link:'Apri il video su HeyGen'}
  };
  const freyaTranscript=[
    ['Ciao! Benvenuto alla lezione: al bar. Oggi impariamo a ordinare un caffè.','Ahoj! Vítej v lekci V kavárně. Dnes se naučíme objednat si kávu.','Hello! Welcome to the café lesson. Today we will learn to order a coffee.'],
    ['Ascolta: Buongiorno! Vorrei un caffè e un cornetto, per favore. Ora ripeti: Vorrei un caffè e un cornetto, per favore.','Poslouchej: Dobrý den! Chtěl/a bych espresso a croissant, prosím. Teď opakuj: Chtěl/a bych espresso a croissant, prosím.','Listen: Good morning! I would like an espresso and a croissant, please. Now repeat: I would like an espresso and a croissant, please.'],
    ['Il barista domanda: Al banco o al tavolo? Puoi rispondere: Al banco, grazie. Vuoi anche dell’acqua? Di’: Anche un bicchiere d’acqua naturale, per favore.','Obsluha se ptá: U baru, nebo u stolu? Můžeš odpovědět: U baru, děkuji. Chceš také vodu? Řekni: Ještě sklenici neperlivé vody, prosím.','The barista asks: At the counter or at a table? You can reply: At the counter, thank you. Would you like water too? Say: A glass of still water as well, please.'],
    ['Quando vuoi pagare, chiedi: Il conto, per favore. Il barista risponde: Sono quattro euro e cinquanta. Questo è solo un prezzo di esempio. Per pagare con la carta, domanda: Posso pagare con la carta?','Když chceš zaplatit, požádej: Účet, prosím. Obsluha odpoví: Jsou to čtyři eura padesát. To je pouze příklad ceny. Pro platbu kartou se zeptej: Mohu platit kartou?','When you want to pay, ask: The bill, please. The barista replies: That is four euros fifty. This is just an example price. To pay by card, ask: Can I pay by card?'],
    ['Ricorda: vorrei è una richiesta gentile. Adesso prova tu: ordina un caffè, chiedi dell’acqua e poi il conto. Buon caffè!','Pamatuj: vorrei je zdvořilá žádost. Teď to zkus ty: objednej si kávu, požádej o vodu a potom o účet. Užij si kávu!','Remember: vorrei is a polite request. Now try it yourself: order a coffee, ask for water and then the bill. Enjoy your coffee!']
  ];
  function freyaPlaceholder(){
    if(!currentVideo().id)return '<p style="color:#fff;padding:1rem;text-align:center">'+({cs:'Video s Freyou zatím není dostupné. Přepis je připravený níže; zvukový dialog funguje.',en:'Freya’s video is not available yet. The script is ready below; the audio dialogue works.',it:'Il video non è ancora disponibile. La trascrizione e il dialogo audio sono disponibili.'}[lang])+'</p>';
    return button('freya-load','▶ '+freyaCopy[lang].load,'class="it-primary"');
  }
  function currentVideo(){
    return D.lessons.find(l=>l.id===openedLesson)?.video || {id:cafeVideoId,transcript:freyaTranscript};
  }
  function freyaTitle(){if(openedLesson==='hotel')return {cs:'V hotelu s Freyou',en:'At a hotel with Freya',it:'In hotel con Freya'}[lang];return openedLesson==='ristorante'?({cs:'V restauraci s Freyou',en:'At a restaurant with Freya',it:'Al ristorante con Freya'}[lang]):freyaCopy[lang].title;}
  function freyaLessonVideo(){
    const t=freyaCopy[lang],video=currentVideo();
    if(!video.id)return '';
    return '<section class="it-freya" aria-labelledby="it-freya-title"><h3 id="it-freya-title">'+esc(freyaTitle())+'</h3><p>'+(video.id?t.intro:({cs:'Připravený scénář videa k procvičení hotelových situací.',en:'Prepared video script for practising hotel situations.',it:'Testo preparato per esercitarsi in hotel.'}[lang]))+'</p><div id="it-freya-player" class="it-freya-player'+(video.id?'':' is-unavailable')+'">'+freyaPlaceholder()+'</div>'+(video.id?'<p class="it-muted">'+t.note+'</p>':'')+'<details><summary>'+t.transcript+'</summary>'+video.transcript.map(row=>'<p lang="it">'+esc(row[0])+'</p>'+(lang==='it'?'':'<p class="it-muted">'+esc(row[lang==='cs'?1:2])+'</p>')).join('')+'</details></section>';
  }
  function showLesson(id) {
    const l=D.lessons.find(x=>x.id===id); if(!l)return;
    currentLevel=l.level; currentLesson=id;openedLesson=id;lastLesson=id;active='lessons';
    const isGuided=!!l.dialogue;
    const restaurantCopy={
      cs:{cafeTitle:'V restauraci',cafeTime:'V restauraci · A2 · asi 7 minut',cafeContext:'Přicházíš na večeři ve dvou. Domluv stůl, vyber si jídlo a požádej o účet.',ruleText:'Un tavolo per due = stůl pro dvě osoby. Ho prenotato = mám rezervaci. Prendo… = dám si… Da bere = k pití. Non stojí před slovesem: non è piccante. U alergií vždy prober složení a přípravu jídla s personálem.',completed:'Bez nápovědy požádej o stůl pro dva, objednej si jídlo a vodu a požádej o účet.',practiceCafe:'Procvičit objednávku v restauraci'},
      en:{cafeTitle:'At a restaurant',cafeTime:'At a restaurant · A2 · about 7 minutes',cafeContext:'You are arriving for dinner for two. Arrange a table, choose your meal and ask for the bill.',ruleText:'Un tavolo per due = a table for two. Ho prenotato = I have booked. Prendo… = I will have… Da bere = to drink. Non goes before the verb: non è piccante. For allergies, always discuss ingredients and food preparation with staff.',completed:'Without hints, ask for a table for two, order food and water, and ask for the bill.',practiceCafe:'Practise ordering at a restaurant',barista:'Waiter',customer:'Guest'},
      it:{cafeTitle:'Al ristorante',cafeTime:'Al ristorante · A2 · circa 7 minuti',cafeContext:'Arrivi a cena in due. Chiedi un tavolo, scegli un piatto e chiedi il conto.',ruleText:'Un tavolo per due indica due persone. Ho prenotato indica una prenotazione. Prendo introduce una scelta. Non precede il verbo. Per le allergie verifica ingredienti e preparazione con il personale.',completed:'Chiedi un tavolo, ordina e chiedi il conto senza suggerimenti.',practiceCafe:'Esercitati al ristorante'}
    };
    const lessonCopy=l.guide?{...T,...l.guide[lang]}:id==='ristorante'?{...T,...restaurantCopy[lang]}:T;
    const dialogue=isGuided?'<div class="it-cafe-intro"><div><p class="it-eyebrow">'+lessonCopy.cafeTime+'</p><h3>'+T.goal+'</h3><p>'+esc(l.goal[lang])+'</p><p>'+lessonCopy.cafeContext+'</p></div><img src="'+esc(lessonPictureDirectory+D.lessonIllustrations[id].file)+'" alt="" width="1200" height="800" decoding="async"></div><h3>'+T.dialogue+'</h3><div class="it-toolbar">'+button('dialogue-play','▶ '+T.playAll,'class="it-primary"')+button('audio-stop',T.stopAudio)+'</div><p class="it-muted">'+T.audioCredit+'</p><ol class="it-dialogue">'+l.dialogue.map(line=>'<li id="'+line.id+'" class="it-dialogue-line '+line.role+'"><span class="it-role">'+lessonCopy[line.role]+'</span><p lang="it">'+esc(line.it)+'</p>'+audio(line.it,T.lineAudio)+'<details><summary>'+T.translation+'</summary><p>'+esc(line.translation[lang])+'</p></details></li>').join('')+'</ol>':'';
    el('it-view').innerHTML='<section class="it-panel">'+button('back',T.back)+'<span class="it-level">'+l.level+'</span><h2 tabindex="-1" id="it-focus">'+esc(isGuided?lessonCopy.cafeTitle:l.title[lang])+'</h2>'+(isGuided?((id==='bar'||l.video)?freyaLessonVideo():'')+dialogue:'<p>'+esc(l.note[lang])+'</p>')+'<h3>'+(isGuided?T.vocabulary:T.study)+'</h3><div class="it-words">'+l.words.map(w=>'<article class="it-card"><div class="it-word-top">'+favorite(w)+'</div><h3 lang="it">'+esc(w.italian)+'</h3><p>'+esc(w.meaning[lang])+'</p><p class="it-example" lang="it">'+esc(w.example)+'</p>'+audio(w.italian,T.wordAudio)+audio(w.example,T.sentenceAudio)+'</article>').join('')+'</div>'+(isGuided?'<h3>'+T.rules+'</h3><p class="it-rule">'+lessonCopy.ruleText+'</p><h3>'+T.tryIt+'</h3><p>'+lessonCopy.completed+'</p>'+button('lesson-practice',lessonCopy.practiceCafe,'data-mode="grammar" class="it-primary"'):'')+'<div class="it-toolbar">'+['choice','write','listen','grammar'].map(m=>button('lesson-practice',T[m],'data-mode="'+m+'"'+(m==='listen'&&!l.words.some(w=>canSpeak(w.italian))?' disabled':''))).join('')+'</div><p class="it-muted">'+T.savedDraft+'</p></section>';
    updateAudioButtons();saveDraft();el('it-focus').focus();
  }
  function selectedLessons() {return D.lessons.filter(l=>(currentLevel==='all'||l.level===currentLevel)&&(currentLesson==='all'||l.id===currentLesson));}
  function start(isExam=false,limit=12) {
    if(pausedSession&&!window.confirm(T.newAttempt))return;
    const selected=isExam?D.lessons.filter(l=>currentLevel==='all'||l.level===currentLevel):selectedLessons();
    let pool;
    if(isExam) {
      const withAudio=!!el('it-with-audio')?.checked;
      // Exactly one question per vocabulary item to avoid repeating the same answer in an exam.
      pool=C.questions(selected,'choice',lang).map((q,i)=>{
        const kind=withAudio&&i%3===0&&canSpeak(q.italian)?'listen':i%2===0?'write':'choice';
        return kind==='write'?{...q,kind,prompt:words.find(w=>w.id===q.id).meaning[lang],answers:[q.italian,...(words.find(w=>w.id===q.id).writingVariants||[])],options:[]}:{...q,kind};
      }).concat(C.questions(selected,'grammar',lang));
    } else pool=reviewOnly?C.reviewQuestions(selected,progress,lang):C.questions(selected,mode,lang);
    // Keep unavailable listening mistakes in the review list; never silently grade another mode.
    if(!reviewOnly)pool=pool.filter(q=>q.kind!=='listen'||canSpeak(q.italian));
    if(!pool.length){status(!isExam&&mode==='picture'?T.noPictures:T.noQuestions);return;}
    stopAudio();
    session={questions:C.shuffle(pool).slice(0,isExam?20:limit),index:0,correct:0,answered:false,played:false,type:isExam?'exam':'practice',level:currentLevel,changes:[]};
    pausedSession=null;openedLesson=null;saveDraft();
    render();
    return true;
  }
  function renderQuestion() {
    const s=session,q=s.questions[s.index],choice=q.kind!=='write';
    const prompt=q.kind==='picture'?T.picturePrompt:q.kind==='listen'?T.listenPrompt:q.kind==='write'?T.writePrompt:q.kind==='grammar'?T.grammarPrompt:T.meaningPrompt;
    const visual=q.kind==='picture'?picture(q)+photoCredit(q)+'<details class="it-picture-description"><summary>'+T.pictureFallback+'</summary><p>'+esc(q.pictureDescription)+'</p></details>':q.kind==='listen'?audio(q.italian):'<p class="it-prompt"'+(q.kind==='write'?'':' lang="it"')+'>'+esc(q.prompt)+'</p>';
    el('it-view').innerHTML='<section class="it-panel it-quiz"><div class="it-quiz-top"><span>'+T.question+' '+(s.index+1)+' / '+s.questions.length+'</span>'+button('quit',T.stop)+'</div><progress value="'+s.index+'" max="'+s.questions.length+'" aria-label="'+T.progress+'"></progress><h2 id="it-focus" tabindex="-1">'+esc(prompt)+'</h2>'+visual+'<form id="it-answer-form">'+(choice?'<fieldset><legend class="it-muted">'+T.choose+'</legend><div class="it-options"'+(q.kind==='picture'?' lang="it"':'')+'>'+C.shuffle(q.options).map((a,i)=>'<label><input type="radio" name="answer" value="'+esc(a)+'"><span>'+esc(a)+'</span></label>').join('')+'</div></fieldset>':'<label>'+T.write+'<input id="it-written" name="answer" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="'+T.placeholder+'"></label><div class="it-accent-bar" aria-label="'+T.accent+'">'+['à','è','é','ì','ò','ù','’'].map(c=>button('accent',c,'data-char="'+c+'"')).join('')+'</div>')+'<button type="submit" class="it-primary">'+T.check+'</button></form><div id="it-feedback" role="status" aria-live="polite"></div><div id="it-next"></div></section>';
    updateAudioButtons();
    if(session.answered)renderFeedback();
    else if(session.answer){const input=el('it-written');if(input)input.value=session.answer;else el('it-answer-form').querySelectorAll('input[type="radio"]').forEach(i=>i.checked=i.value===session.answer);}
    if(q.kind==='listen'&&!canSpeak(q.italian))status(T.audioUnavailable);
    el('it-focus').focus();
  }
  function submit(event) {
    event.preventDefault(); if(!session||session.answered)return;
    const q=session.questions[session.index];
    if(q.kind==='listen'&&!session.played){status(T.listenFirst);return;}
    const value=new FormData(event.target).get('answer');
    if(!value||!String(value).trim()){status(T.required);return;}
    const correct=C.grade(value,q.answers);
    session.correct+=Number(correct);session.answered=true;
    session.answer=String(value);session.changes.push({id:q.id,kind:q.kind,correct});saveDraft();renderFeedback();
    status('');
  }
  function writingHint(q) {
    const result=C.writtenFeedback(session.answer,q.answers,q.article);
    const labels={
      cs:{article:'Výraz máš správně, ale chybí člen',accent:'Pozor na přízvuk. Porovnej svůj zápis se správnou podobou.',both:'Chybí člen a zároveň je potřeba opravit přízvuk.',expression:'Odpověď neodpovídá očekávanému výrazu. Zkontroluj význam i pravopis.',meaning:'Tento výraz znamená',wanted:'Zadání požaduje',yours:'Tvoje odpověď'},
      en:{article:'The expression is right, but the article is missing',accent:'Check the accent. Compare your spelling with the correct form.',both:'The article is missing and the accent also needs correcting.',expression:'Your answer does not match the expected expression. Check the meaning and spelling.',meaning:'This expression means',wanted:'The prompt asks for',yours:'Your answer'},
      it:{article:'L’espressione è giusta, ma manca l’articolo',accent:'Controlla l’accento e confronta la grafia con la forma corretta.',both:'Mancano l’articolo e l’accento corretto.',expression:'La risposta non corrisponde all’espressione attesa. Controlla significato e ortografia.',meaning:'Questa espressione significa',wanted:'La domanda richiede',yours:'La tua risposta'}
    }[lang];
    const other=result.kind==='expression'?words.find(w=>C.grade(session.answer,[w.italian])&&w.meaning[lang]!==q.prompt):null;
    const kind=other?'meaning':result.kind;
    const message=other?labels.meaning+': '+other.meaning[lang]+'. '+labels.wanted+': '+q.prompt+'.':kind==='article'?labels.article+': '+result.article+'.':kind==='article-accent'?labels.both+' ('+result.article+')':labels[kind];
    return '<div class="it-writing-hint" data-feedback-kind="'+kind+'"><p>'+esc(message)+'</p><p>'+labels.yours+': <strong lang="it">'+esc(session.answer)+'</strong></p></div>';
  }
  function renderFeedback() {
    const q=session.questions[session.index],correct=session.changes[session.index].correct;
    const form=el('it-answer-form');
    form.querySelectorAll('input').forEach(i=>{if(i.type==='radio')i.checked=i.value===session.answer;else i.value=session.answer||'';});
    form.querySelectorAll('input,button').forEach(e=>e.disabled=true);
    el('it-feedback').className='it-feedback '+(correct?'is-correct':'is-wrong');
    el('it-feedback').innerHTML='<h3>'+esc(correct?T.correct:T.wrong)+'</h3><p>'+T.answer+': <strong>'+esc(q.answers[0])+'</strong></p>'+(q.kind==='listen'?'<p lang="it">'+esc(q.italian)+'</p>':'')+'<p'+(q.kind==='grammar'?'':' lang="it"')+'>'+esc(q.kind==='grammar'?q.explanation[lang]:q.explanation)+'</p>';
    if(q.kind==='write'&&!correct)el('it-feedback').querySelector('h3').insertAdjacentHTML('afterend',writingHint(q));
    el('it-next').innerHTML=button('next',session.index===session.questions.length-1?T.finish:T.next);
    status('');
  }
  function finish() {
    const s=session;
    for(const item of s.changes) {
      if(item.correct){delete progress.mistakes[item.id];delete progress.mistakeKinds[item.id];}
      else {progress.mistakes[item.id]=(progress.mistakes[item.id]||0)+1;progress.mistakeKinds[item.id]=item.kind;}
    }
    progress.results.push({date:new Date().toISOString(),correct:s.correct,total:s.questions.length,type:s.type,level:s.level});
    progress.results=progress.results.slice(-50);save(); session=null;pausedSession=null;saveDraft();
    el('it-view').innerHTML='<section class="it-panel it-result"><h2 id="it-focus" tabindex="-1">'+T.result+'</h2><p class="it-score">'+s.correct+' / '+s.questions.length+'</p><p>'+Math.round(s.correct/s.questions.length*100)+' %</p><p>'+esc(storageOK?T.saved:T.notSaved)+'</p><div class="it-toolbar">'+button('again',T.again)+button('retry',T.retry)+'</div></section>';
    el('it-focus').focus();
  }
  function renderProgress() {
    const exams=progress.results.filter(r=>r.type==='exam');
    const best=exams.length?Math.max(...exams.map(r=>Math.round(r.correct/r.total*100)))+' %':'—';
    el('it-view').innerHTML='<section class="it-panel"><h2>'+T.progress+'</h2><p>'+T.storageNote+'</p><div class="it-stats"><div><strong>'+progress.results.length+'</strong><span>'+T.attempts+' (max. 50)</span></div><div><strong>'+Object.keys(progress.mistakes).length+'</strong><span>'+T.mistakes+'</span></div><div><strong>'+best+'</strong><span>'+T.best+'</span></div></div><div class="it-toolbar">'+button('export',T.export)+'<label class="it-import">'+T.import+'<input type="file" id="it-import" accept=".json,application/json"></label>'+button('retry',T.retry)+'</div><h3>'+T.history+'</h3><ol class="it-history">'+progress.results.slice(-10).reverse().map(r=>'<li>'+esc(new Date(r.date).toLocaleDateString(lang))+' · '+esc(T[r.type])+' · '+r.level+' <strong>'+r.correct+' / '+r.total+'</strong></li>').join('')+'</ol>'+(progress.results.length?'':'<p>'+T.progressEmpty+'</p>')+'</section>';
  }
  function updateAudioButtons() {app.querySelectorAll('[data-action="speak"],[data-action="slow"]').forEach(b=>b.disabled=!canSpeak(b.dataset.speech));}
  function updateVoiceControls() {
    const select=el('it-voice'); if(!select)return;
    select.innerHTML=options(voices.map(v=>[v.voiceURI,v.name+' ('+v.lang+')']),selectedVoice);
    select.disabled=!voices.length;
    el('it-voice-note').textContent=T.localAudio+' '+(voices.length?T.voiceReady:({cs:'Italský hlas zařízení není dostupný; nahrávky připravených lekcí přesto fungují.',en:'No Italian device voice is available; the bundled lesson recordings still work.',it:'La voce italiana del dispositivo non è disponibile; le registrazioni del bar funzionano comunque.'}[lang]));
    updateAudioButtons();
    const listeningOption=el('it-mode')?.querySelector('[value="listen"]');
    if(listeningOption)listeningOption.disabled=!selectedLessons().some(l=>l.words.some(w=>canSpeak(w.italian)));
    const withAudio=el('it-with-audio');if(withAudio)withAudio.disabled=false;
    app.querySelectorAll('[data-action="lesson-practice"][data-mode="listen"]').forEach(b=>b.disabled=!selectedLessons().some(l=>l.words.some(w=>canSpeak(w.italian))));
  }
  function loadVoices() {
    voices=window.speechSynthesis?window.speechSynthesis.getVoices().filter(v=>/^it(?:-|_)/i.test(v.lang)):[];
    if(!voices.some(v=>v.voiceURI===selectedVoice))selectedVoice=voices[0]?.voiceURI||'';
    updateVoiceControls();
  }
  function stopAudio() {
    const player=el('it-freya-player');
    if(player?.querySelector('iframe'))player.innerHTML=freyaPlaceholder();
    audioGeneration++;
    if(media){media.pause();media.onended=null;media.onerror=null;media=null;}
    window.speechSynthesis?.cancel();
    app.querySelectorAll('.is-speaking').forEach(n=>n.classList.remove('is-speaking'));
  }
  function playRecording(text,slow,done,generation) {
    const target=session;
    media=new Audio(audioDirectory+D.audioFiles[text]);media.playbackRate=slow?0.75:1;
    media.onplaying=()=>{if(generation===audioGeneration&&target&&session===target)target.played=true;};
    media.onended=()=>{if(generation!==audioGeneration)return;media=null;done?.();};
    media.onerror=()=>{if(generation!==audioGeneration)return;if(target&&session===target)target.played=false;stopAudio();status(T.speechError);};
    media.play().catch(()=>{if(generation===audioGeneration){if(target&&session===target)target.played=false;stopAudio();status(T.speechError);}});
  }
  function speak(text,slow=false) {
    stopAudio();
    if(D.audioFiles?.[text]){playRecording(text,slow,null,audioGeneration);return;}
    if(!voices.length){status(T.noVoice);return;}
    const utterance=new SpeechSynthesisUtterance(text);utterance.lang='it-IT';utterance.voice=voices.find(v=>v.voiceURI===selectedVoice)||voices[0];utterance.rate=slow?0.72:0.95;
    const target=session;
    utterance.onstart=()=>{if(session===target&&target)target.played=true;};
    utterance.onerror=event=>{if(['canceled','interrupted'].includes(event.error))return;if(session===target&&target)target.played=false;status(T.speechError);};
    window.speechSynthesis.speak(utterance);
  }
  function playDialogue() {
    stopAudio();const generation=audioGeneration,lines=D.lessons.find(l=>l.id===openedLesson)?.dialogue||[];
    let index=0;
    function next() {
      if(generation!==audioGeneration)return;
      app.querySelectorAll('.is-speaking').forEach(n=>n.classList.remove('is-speaking'));
      if(index===lines.length)return;
      const line=lines[index++];el(line.id)?.classList.add('is-speaking');
      playRecording(line.it,false,next,generation);
    }
    next();
  }
  app.addEventListener('submit',submit);
  app.addEventListener('input',event=>{if(event.target.id==='it-search'){search=event.target.value;renderDictionary();}});
  app.addEventListener('change',async event=>{
    const target=event.target;
    if(target.id==='it-level'){currentLevel=target.value;currentLesson='all';cardIndex=0;cardFlipped=false;render();}
    if(target.id==='it-pictures-only'){picturesOnly=target.checked;cardIndex=0;cardFlipped=false;renderCards();}
    if(target.id==='it-lesson'){currentLesson=target.value;updateVoiceControls();}
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
    if(action==='freya-load'&&currentVideo().id){
      stopAudio();
      el('it-freya-player').innerHTML='<iframe src="https://app.heygen.com/embeds/'+currentVideo().id+'" title="'+esc(freyaTitle())+'" allow="encrypted-media; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
      el('it-freya-player').querySelector('iframe').focus();return;
    }
    if(action==='audio-stop'){stopAudio();return;}
    if(action==='dialogue-play'){playDialogue();return;}
    if(action==='text-cards'){picturesOnly=false;cardIndex=0;renderCards();return;}
    if(action==='quick'){stopAudio();if(session)pausedSession=session;session=null;active='quick';openedLesson=null;saveDraft();render();return;}
    if(action==='quick-review'){
      currentLevel='all';currentLesson='all';reviewOnly=true;active='practice';
      if(!start(false,5))active='quick';return;
    }
    if(action==='resume'){
      stopAudio();session=pausedSession;pausedSession=null;
      if(session){active=session.type==='exam'?'exam':'practice';currentLevel=session.level;openedLesson=null;render();}
      else if(lastLesson){active='lessons';openedLesson=lastLesson;render();}
      saveDraft();return;
    }
    if(action==='flip'){cardFlipped=!cardFlipped;renderCards();app.querySelector('[data-action="flip"]')?.focus();return;}
    if(action==='card-next'||action==='card-previous'){cardIndex+=action==='card-next'?1:-1;cardFlipped=false;renderCards();app.querySelector('[data-action="'+action+'"]')?.focus();return;}
    if(action==='picture-start'){active='practice';mode='picture';currentLesson='all';reviewOnly=false;start();return;}
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
    if(action==='tab'){stopAudio();if(session)pausedSession=session;session=null;openedLesson=null;active=b.dataset.tab;cardFlipped=false;saveDraft();render();}
    if(action==='lesson'){stopAudio();showLesson(b.dataset.lesson);}
    if(action==='back'){stopAudio();openedLesson=null;currentLesson='all';render();}
    if(action==='lesson-practice'){mode=b.dataset.mode;reviewOnly=false;active='practice';start();}
    if(action==='start')start();
    if(action==='exam'){currentLesson='all';start(true);}
    if(action==='quit'){stopAudio();session=null;pausedSession=null;saveDraft();render();}
    if(action==='next'&&session?.answered){if(session.index===session.questions.length-1)finish();else{stopAudio();session.index++;session.answered=false;session.played=false;session.answer='';saveDraft();renderQuestion();}}
    if(action==='again'){active='practice';reviewOnly=false;render();}
    if(action==='retry'){active='practice';currentLevel='all';currentLesson='all';mode='choice';reviewOnly=true;render();}
    if(action==='export'){
      const url=URL.createObjectURL(new Blob([JSON.stringify(progress,null,2)],{type:'application/json'}));
      const a=document.createElement('a');a.href=url;a.download='italian-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
  });
  app.addEventListener('input',event=>{
    if(session&&!session.answered&&event.target.name==='answer'){session.answer=event.target.value;saveDraft();}
  });
  window.addEventListener('pagehide',()=>{stopAudio();saveDraft();});
  const requestedLesson=new URLSearchParams(location.search).get('lesson');
  if(D.lessons.some(l=>l.id===requestedLesson))openedLesson=requestedLesson;
  render();loadVoices();
  window.speechSynthesis?.addEventListener('voiceschanged',loadVoices);
})();
