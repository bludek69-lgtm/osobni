/* Original practice material. Levels are thematic guides, not CEFR certification. */
(function (root) {
  'use strict';
  const t = (cs, en, it) => ({cs, en, it});
  const word = (id, italian, cs, en, definition, example) => ({id, italian, meaning:t(cs,en,definition), example});
  const grammar = (id, prompt, answers, options, cs, en, it) => ({id, prompt, answers, options, explanation:t(cs,en,it)});
  const lesson = (id, level, title, note, words, questions) => ({id,level,title,note,words,questions});
  const lessons = [
    lesson('saluti','A1',t('Pozdravy a představení','Greetings and introductions','Saluti e presentazioni'),
      t('Mi chiamo znamená „jmenuji se“. Pro oslovení jednoho člověka rozlišuj neformální tu a zdvořilé Lei.','Mi chiamo means “my name is”. Distinguish informal tu from polite Lei when addressing one person.','Mi chiamo introduce il nome. Con una persona distingui il tu informale dal Lei di cortesia.'),[
      word('buongiorno','buongiorno','dobrý den','good morning / good day','saluto durante il giorno','Buongiorno, come sta?'),
      word('buonasera','buonasera','dobrý večer','good evening','saluto della sera','Buonasera, signora Rossi.'),
      word('arrivederci','arrivederci','na shledanou','goodbye','saluto quando ci si separa','Arrivederci, a domani!'),
      word('grazie','grazie','děkuji','thank you','espressione di ringraziamento','Grazie per il suo aiuto.'),
      word('piacere','piacere','těší mě','nice to meet you','formula usata nelle presentazioni','Piacere, sono Marco.'),
      word('mi-chiamo','mi chiamo','jmenuji se','my name is','espressione per dire il proprio nome','Mi chiamo Anna.')],[
      grammar('essere','Io ___ italiano.',['sono'],['sono','sei','è','siamo'],'Io sono = já jsem.','Io sono = I am.','Con io si usa sono.'),
      grammar('nome','Come ___ chiami? (tu)',['ti'],['ti','mi','si','ci'],'Come ti chiami? = Jak se jmenuješ?','Come ti chiami? = What is your name?','Con tu: come ti chiami?')]),
    lesson('bar','A1',t('V kavárně','At a café','Al bar'),
      t('Un a una jsou neurčité členy: un caffè, una spremuta. Vorrei je zdvořilé „chtěl/a bych“.','Un and una are indefinite articles: un caffè, una spremuta. Vorrei is the polite “I would like”.','Un e una sono articoli indeterminativi. Vorrei rende la richiesta più cortese.'),[
      word('caffe','un caffè','káva','a coffee','bevanda preparata con chicchi tostati','Vorrei un caffè, per favore.'),
      word('acqua','acqua naturale','neperlivá voda','still water','acqua senza bollicine','Prendo acqua naturale.'),
      word('conto','il conto','účet','the bill','somma da pagare al ristorante','Il conto, per favore.'),
      word('cornetto','un cornetto','croissant / sladký rohlík','a croissant','dolce da colazione a forma di mezzaluna','Un cornetto e un cappuccino.'),
      word('spremuta','una spremuta','čerstvě vymačkaná šťáva','a freshly squeezed juice','succo ottenuto spremendo la frutta','Una spremuta d’arancia, grazie.'),
      word('per-favore','per favore','prosím','please','formula per una richiesta cortese','Un bicchiere, per favore.'),
      word('pane','il pane','chléb','bread','alimento preparato con farina, acqua e lievito','Vorrei del pane, per favore.'),
      word('latte','il latte','mléko','milk','bevanda bianca usata anche nel cappuccino','Prendo un bicchiere di latte.'),
      word('gelato','un gelato','zmrzlina','an ice cream','dolce freddo e cremoso','Vorrei un gelato alla vaniglia.')],[
      grammar('articolo','Vorrei ___ spremuta.',['una'],['una','un','uno','il'],'Spremuta je ženského rodu: una spremuta.','Spremuta is feminine: una spremuta.','Spremuta è femminile: una spremuta.'),
      grammar('vorrei','___ un caffè, per favore. (richiesta cortese)',['Vorrei'],['Vorrei','Vorremmo','Vorrebbero','Vorresti'],'Vorrei je 1. osoba podmiňovacího způsobu.','Vorrei is the first-person singular conditional.','Vorrei è il condizionale, prima persona singolare.')]),
    lesson('citta','A1',t('Orientace ve městě','Finding your way','Orientarsi in città'),
      t('Dov’è znamená „kde je“. Všímej si apostrofu a přízvuku v è. A destra / a sinistra = vpravo / vlevo.','Dov’è means “where is”. Notice the apostrophe and the accent on è. A destra / a sinistra = right / left.','Dov’è significa dove si trova. Nota l’apostrofo e l’accento su è.'),[
      word('stazione','la stazione','nádraží','the station','luogo da cui partono i treni','Dov’è la stazione?'),
      word('destra','a destra','vpravo','to the right','nella direzione opposta alla sinistra','Giri a destra.'),
      word('sinistra','a sinistra','vlevo','to the left','nella direzione opposta alla destra','La farmacia è a sinistra.'),
      word('dritto','sempre dritto','stále rovně','straight ahead','senza girare lungo il percorso','Vada sempre dritto.'),
      word('biglietto','un biglietto','jízdenka / vstupenka','a ticket','documento per viaggiare o entrare','Un biglietto per Roma.'),
      word('vicino','vicino','blízko','nearby','a poca distanza','Il museo è vicino.'),
      word('autobus','l’autobus','autobus','the bus','mezzo pubblico su strada per molti passeggeri','Dove si prende l’autobus?'),
      word('farmacia','la farmacia','lékárna','the pharmacy','negozio in cui si vendono medicinali','Cerco una farmacia aperta.'),
      word('museo','il museo','muzeum','the museum','luogo in cui si conservano ed espongono opere e oggetti','Il museo apre alle nove.')],[
      grammar('dove','Dov’___ la farmacia?',['è'],['è','e','sei','sono'],'È s přízvukem je „je“, e bez přízvuku je „a“.','È with an accent means “is”; e means “and”.','È è una forma di essere; e è una congiunzione.'),
      grammar('luogo','Vado ___ Roma.',['a'],['a','in','da','su'],'U měst používáme v tomto významu a: a Roma.','For cities in this use: a Roma.','Con il nome della città: a Roma.')]),
    lesson('hotel','A2',t('Ubytování a domluva','Accommodation','Alloggio'),
      t('Ho prenotato = rezervoval/a jsem. Passato prossimo často tvoří avere + příčestí, ale některá slovesa používají essere.','Ho prenotato means “I booked”. Many passato prossimo forms use avere + a past participle; some verbs use essere.','Ho prenotato è al passato prossimo. Molti verbi usano avere, altri essere.'),[
      word('prenotazione','la prenotazione','rezervace','the reservation','accordo per riservare un servizio','Ho una prenotazione per due notti.'),
      word('camera','una camera doppia','dvoulůžkový pokoj','a double room','stanza per due persone','Vorrei una camera doppia.'),
      word('colazione','la colazione','snídaně','breakfast','primo pasto della giornata','La colazione è inclusa?'),
      word('chiave','la chiave','klíč','the key','oggetto per aprire una serratura','La chiave non funziona.'),
      word('asciugamano','un asciugamano','ručník','a towel','tessuto usato per asciugarsi','Mi serve un asciugamano.'),
      word('partenza','la partenza','odjezd','departure','momento in cui si lascia un luogo','La partenza è domani.'),
      word('valigia','la valigia','kufr','the suitcase','bagaglio usato per trasportare vestiti e oggetti','La mia valigia è pesante.'),
      word('letto','il letto','postel','the bed','mobile su cui si dorme','Il letto è comodo.'),
      word('doccia','la doccia','sprcha','the shower','impianto che permette di lavarsi con acqua corrente','La camera ha una doccia.')],[
      grammar('prenotato','Ieri ho ___ una camera.',['prenotato'],['prenotato','prenotare','prenoto','prenotando'],'Po ho zde následuje příčestí prenotato.','Ho is followed here by the participle prenotato.','Dopo ho serve il participio prenotato.'),
      grammar('arrivata','Anna è ___ ieri.',['arrivata'],['arrivata','arrivato','arrivare','arrivano'],'S essere se příčestí shoduje s podmětem: Anna è arrivata.','With essere, the participle agrees with the subject: Anna è arrivata.','Con essere il participio concorda con Anna: arrivata.')]),
    lesson('ristorante','A2',t('Jídlo a požadavky','Food and requests','Cibo e richieste'),
      t('Sono allergico/allergica a… = jsem alergický/alergická na… Negace non stojí před slovesem. Tyto fráze nenahrazují domluvu s personálem o bezpečnosti jídla.','Sono allergico/allergica a… means “I am allergic to…”. Non goes before the verb. These phrases do not replace checking food safety with staff.','Non precede il verbo. Per le allergie verifica sempre gli ingredienti con il personale.'),[
      word('menu','il menù','jídelní lístek','the menu','elenco dei piatti proposti','Posso vedere il menù?'),
      word('senza','senza glutine','bez lepku','gluten-free','privo di glutine','Avete pasta senza glutine?'),
      word('allergia','un’allergia','alergie','an allergy','reazione allergica a una sostanza','Ho un’allergia alle arachidi.'),
      word('verdure','le verdure','zelenina','vegetables','ortaggi usati come alimenti','Prendo le verdure alla griglia.'),
      word('piccante','piccante','pálivý','spicy','dal sapore che brucia in bocca','Questo piatto è piccante?'),
      word('prenotare','prenotare un tavolo','rezervovat stůl','to book a table','riservare posti al ristorante','Vorrei prenotare un tavolo.'),
      word('pasta','la pasta','těstoviny','pasta','alimento di farina e acqua, spesso servito con un sugo','Prendo la pasta al pomodoro.'),
      word('pizza','una pizza','pizza','a pizza','disco di pasta cotto al forno con vari condimenti','Vorrei una pizza margherita.'),
      word('pesce','il pesce','ryba','fish','animale acquatico, anche usato come alimento','Oggi mangiamo pesce alla griglia.')],[
      grammar('negazione','Io ___ mangio carne. (negazione)',['non'],['non','no','niente','nessuno'],'Non stojí před mangio.','Non goes before mangio.','La negazione è non mangio.'),
      grammar('allergico','Sono allergico ___ latte.',['al'],['al','il','nel','dal'],'A + il = al.','A + il = al.','La preposizione articolata è al.')]),
    lesson('passato','A2',t('Co se stalo včera','Talking about yesterday','Raccontare ieri'),
      t('U pohybu andare používá passato prossimo pomocné essere: sono andato/andata. Visitare používá avere: ho visitato.','Andare uses essere in the passato prossimo: sono andato/andata. Visitare uses avere: ho visitato.','Andare usa essere: sono andato/andata. Visitare usa avere: ho visitato.'),[
      word('ieri','ieri','včera','yesterday','il giorno prima di oggi','Ieri ho visitato il museo.'),
      word('settimana','la settimana scorsa','minulý týden','last week','la settimana precedente','La settimana scorsa ero a Firenze.'),
      word('visitare','visitare','navštívit','to visit','andare a vedere un luogo','Voglio visitare Siena.'),
      word('tornare','tornare','vrátit se','to return','ritornare nel luogo di partenza','Devo tornare a casa.'),
      word('viaggio','il viaggio','cesta','the journey','spostamento verso un altro luogo','Il viaggio è stato piacevole.'),
      word('passeggiata','una passeggiata','procházka','a walk','breve cammino per piacere','Abbiamo fatto una passeggiata.')],[
      grammar('andati','Marco e Paolo sono ___ a Roma.',['andati'],['andati','andato','andata','andare'],'Mužský nebo smíšený plurál: andati.','Masculine or mixed plural: andati.','Con Marco e Paolo: andati.'),
      grammar('visitato','Noi ___ visitato Siena.',['abbiamo'],['abbiamo','siamo','avete','hanno'],'Noi abbiamo visitato: pomocné avere v 1. osobě množného čísla.','Noi abbiamo visitato uses first-person plural avere.','Con noi: abbiamo visitato.')]),
    lesson('racconto','B1',t('Vyprávění a souvislosti','Narration and background','Racconto e contesto'),
      t('Imperfetto často popisuje pozadí či opakovaný děj. Passato prossimo vyjadřuje dokončené události: pioveva quando sono arrivato.','Imperfetto often gives background or repeated actions; passato prossimo expresses completed events: pioveva quando sono arrivato.','L’imperfetto presenta spesso lo sfondo; il passato prossimo gli eventi conclusi.'),[
      word('mentre','mentre','zatímco','while','congiunzione che indica contemporaneità','Mentre camminavo, ha iniziato a piovere.'),
      word('improvviso','all’improvviso','najednou','suddenly','in modo inatteso','All’improvviso il treno si è fermato.'),
      word('abitudine','di solito','obvykle','usually','abitualmente','Di solito andavo al lavoro a piedi.'),
      word('accorgersi','accorgersi','všimnout si / uvědomit si','to notice / realize','rendersi conto di qualcosa','Mi sono accorto dell’errore.'),
      word('comunque','comunque','každopádně','anyway','in ogni caso','Comunque siamo arrivati in tempo.'),
      word('alla-fine','alla fine','nakonec','in the end','al termine di una vicenda','Alla fine abbiamo trovato l’albergo.')],[
      grammar('sfondo','Mentre ___, è arrivato Luca. (io, studiare)',['studiavo'],['studiavo','studio','studierò','studiare'],'Imperfetto studiavo tvoří pozadí příchodu.','Imperfetto studiavo gives the background to the arrival.','Studiavo esprime l’azione di sfondo.'),
      grammar('abituale','Da bambino ___ spesso al mare. (io)',['andavo'],['andavo','andrò','andare','vado'],'Opakovaný děj v minulosti: andavo.','Repeated past action: andavo.','Un’abitudine nel passato: andavo.')]),
    lesson('progetti','B1',t('Plány a zdvořilé návrhy','Plans and polite suggestions','Progetti e proposte'),
      t('Condizionale umožňuje zdvořilou prosbu nebo radu: potrebbe…, dovresti… Futuro semplice může vyjádřit budoucí plán.','The conditional can soften requests or advice: potrebbe…, dovresti… The simple future can express future plans.','Il condizionale attenua richieste e consigli. Il futuro semplice può esprimere progetti.'),[
      word('potrebbe','potrebbe','mohl/a byste','could you (polite)','forma cortese per chiedere una possibilità','Potrebbe aiutarmi?'),
      word('dovresti','dovresti','měl/a bys','you should','forma per dare un consiglio con tu','Dovresti prenotare prima.'),
      word('volentieri','volentieri','rád / ochotně','gladly','con piacere','Verrei volentieri con voi.'),
      word('magari','magari','třeba / možná (v tomto kontextu)','perhaps (in this context)','forse, in questa frase','Magari partiamo domani.'),
      word('intenzione','avere intenzione di','mít v úmyslu','to intend to','progettare di fare qualcosa','Ho intenzione di imparare l’italiano.'),
      word('appuntamento','un appuntamento','schůzka / termín','an appointment','incontro fissato per un certo momento','Vorrei fissare un appuntamento.')],[
      grammar('cortesia','___ dirmi l’orario? (Lei, potere)',['Potrebbe'],['Potrebbe','Potresti','Potreste','Potrebbero'],'Zdvořilé Lei: potrebbe.','Polite Lei takes potrebbe.','Con Lei di cortesia: potrebbe.'),
      grammar('futuro','Domani noi ___ per Milano. (partire, futuro semplice)',['partiremo'],['partiremo','partivamo','partiremmo','partire'],'Futuro semplice, noi: partiremo.','Simple future, noi: partiremo.','Il futuro di partire con noi è partiremo.')]),
    lesson('pronomi','B1',t('Zájmena lo, la, ne, ci','Pronouns lo, la, ne, ci','Pronomi lo, la, ne, ci'),
      t('Lo/la mohou nahradit přímý předmět. Ne může vyjadřovat „z toho / z nich“, ci „tam“. Význam vždy záleží na větě.','Lo/la can replace a direct object. Ne can mean “of it/them”; ci can mean “there”. Meaning depends on context.','Lo/la sostituiscono un oggetto diretto; ne può indicare una parte o quantità, ci un luogo.'),[
      word('lo-prendo','lo prendo','vezmu si ho (např. lístek)','I will take it (masculine)','prendo l’oggetto maschile già nominato','Il biglietto? Lo prendo qui.'),
      word('la-vedo','la vedo','vidím ji','I see her / it (feminine)','vedo la persona o cosa femminile nominata','La stazione? La vedo da qui.'),
      word('ne-vorrei','ne vorrei due','chtěl/a bych dva z nich','I would like two of them','vorrei due elementi di quelli nominati','I cornetti? Ne vorrei due.'),
      word('ci-vado','ci vado','jdu tam','I go there','vado nel luogo già nominato','A Roma? Ci vado domani.'),
      word('me-ne','me ne vado','odcházím','I am leaving','lascio questo luogo','È tardi, me ne vado.'),
      word('ce-la','ce la faccio','zvládnu to','I can manage it','riesco a fare qualcosa','Non è facile, ma ce la faccio.')],[
      grammar('quantita','Quante mele vuoi? ___ voglio due.',['Ne'],['Ne','Ci','Lo','La'],'Ne zastupuje mele ve spojení s množstvím due.','Ne refers to mele with the quantity due.','Ne riprende le mele e accompagna la quantità.'),
      grammar('luogo-ci','Vai a Torino? Sì, ___ vado domani.',['ci'],['ci','ne','lo','la'],'Ci v této větě nahrazuje a Torino.','Ci replaces a Torino here.','Ci sostituisce il luogo a Torino.')]),
    lesson('opinioni','B2',t('Názory a argumentace','Opinions and arguments','Opinioni e argomenti'),
      t('V této lekci procvičujeme standardní psaný jazyk: penso che sia… Spojovací výrazy pomáhají ukázat vztahy mezi argumenty.','We practise standard written usage here: penso che sia… Linking expressions show relationships between arguments.','Qui si esercita l’uso scritto standard: penso che sia… I connettivi collegano gli argomenti.'),[
      word('tuttavia','tuttavia','nicméně','however','connettivo che introduce un contrasto','È utile; tuttavia costa molto.'),
      word('pertanto','pertanto','proto / tudíž','therefore','connettivo che introduce una conseguenza','Il servizio è sospeso; pertanto dobbiamo aspettare.'),
      word('nonostante','nonostante','navzdory','despite','espressione che introduce un ostacolo superato','Siamo usciti nonostante la pioggia.'),
      word('a-mio-avviso','a mio avviso','podle mého názoru','in my opinion','secondo il mio punto di vista','A mio avviso, è una buona proposta.'),
      word('vantaggio','un vantaggio','výhoda','an advantage','aspetto favorevole','Un vantaggio è la flessibilità.'),
      word('svantaggio','uno svantaggio','nevýhoda','a disadvantage','aspetto sfavorevole','Uno svantaggio è il costo.')],[
      grammar('opinione','Penso che questa idea ___ utile. (essere, congiuntivo presente)',['sia'],['sia','è','sarà','essere'],'Procvičovaný congiuntivo presente slovesa essere: sia.','The requested present subjunctive of essere is sia.','Il congiuntivo presente richiesto è sia.'),
      grammar('benche','Benché ___, usciamo. (piovere, congiuntivo presente)',['piova'],['piova','piove','piovere','pioverà'],'Benché zde uvádí větu s congiuntivo: piova.','Benché takes the subjunctive here: piova.','Benché introduce qui il congiuntivo piova.')]),
    lesson('ipotesi','B2',t('Hypotézy a podmínky','Hypotheses and conditions','Ipotesi e condizioni'),
      t('Pro hypotetickou podmínku zde použijeme se + congiuntivo imperfetto a condizionale presente: se avessi tempo, viaggerei.','For a hypothetical condition here, use se + imperfect subjunctive and present conditional: se avessi tempo, viaggerei.','Per l’ipotesi qui: se + congiuntivo imperfetto e condizionale presente: se avessi tempo, viaggerei.'),[
      word('a-condizione','a condizione che','pod podmínkou, že','provided that','purché si verifichi una condizione','Vengo a condizione che ci sia posto.'),
      word('purché','purché','pokud / jen když','provided that','congiunzione che pone una condizione','Puoi uscire purché tu torni presto.'),
      word('altrimenti','altrimenti','jinak (v opačném případě)','otherwise','in caso contrario','Partiamo ora, altrimenti faremo tardi.'),
      word('nel-caso','nel caso in cui','v případě, že','in the event that','se si verifica una certa situazione','Telefonami nel caso in cui tu abbia bisogno.'),
      word('rinunciare','rinunciare a','vzdát se něčeho','to give up','decidere di non avere o fare qualcosa','Non voglio rinunciare al viaggio.'),
      word('valere','valere la pena','stát za to','to be worth it','meritare lo sforzo','Vale la pena visitare il museo.')],[
      grammar('se-avessi','Se ___ tempo, viaggerei di più. (io, avere)',['avessi'],['avessi','avrei','ho','avrò'],'V této hypotetické podmínce po se: avessi.','In this hypothetical condition after se: avessi.','Nell’ipotesi proposta: se avessi.'),
      grammar('apodosi','Se fossi in te, ___ prima. (io, prenotare)',['prenoterei'],['prenoterei','prenotassi','prenoto','prenotare'],'Výsledná hypotetická rada používá condizionale: prenoterei.','The hypothetical advice uses the conditional: prenoterei.','La conseguenza ipotetica usa il condizionale prenoterei.')]),
    lesson('registro','B2',t('Formální komunikace','Formal communication','Comunicazione formale'),
      t('Formální e-mail používá jiný registr než rozhovor s kamarádem. Gentile… a Cordiali saluti jsou běžné zdvořilé formule.','A formal email uses a different register from a chat with a friend. Gentile… and Cordiali saluti are common polite formulas.','Un’e-mail formale ha un registro diverso da una conversazione tra amici. Gentile… e Cordiali saluti sono formule comuni.'),[
      word('gentile','Gentile signora','Vážená paní','Dear Madam','formula di apertura rivolta a una signora','Gentile signora Rossi, Le scrivo per…'),
      word('cordiali-saluti','Cordiali saluti','S pozdravem','Kind regards','formula di chiusura cortese','La ringrazio. Cordiali saluti.'),
      word('allegato','in allegato','v příloze','attached','insieme al messaggio come documento','Trova il modulo in allegato.'),
      word('riscontro','un riscontro','odpověď / reakce','a response','risposta o conferma a una richiesta','Resto in attesa di un Suo riscontro.'),
      word('chiarimento','un chiarimento','upřesnění / vysvětlení','a clarification','spiegazione che rende chiaro un punto','Avrei bisogno di un chiarimento.'),
      word('disponibilita','la disponibilità','ochota / dostupnost','availability / willingness','possibilità o volontà di offrire aiuto','La ringrazio per la disponibilità.')],[
      grammar('formale','___ ringrazio per la risposta. (Lei, oggetto diretto)',['La'],['La','Ti','Gli','Ci'],'Zdvořilé oslovení Lei má přímý předmět La.','The direct object for polite Lei is La.','Il pronome diretto di cortesia è La.'),
      grammar('passivo','Il documento è stato ___ ieri. (inviare)',['inviato'],['inviato','inviata','inviare','inviando'],'Příčestí v pasivu se shoduje s il documento: inviato.','The passive participle agrees with il documento: inviato.','Il participio concorda con documento: inviato.')])
  ];
  // Concrete vocabulary only: abstract B1/B2 expressions remain text flashcards.
  const pictures = ['caffe','acqua','cornetto','spremuta','stazione','biglietto','camera','chiave','asciugamano','menu','verdure','passeggiata','pane','latte','gelato','autobus','farmacia','museo','valigia','letto','doccia','pasta','pizza','pesce'];
  for (const l of lessons) for (const w of l.words) if (pictures.includes(w.id)) w.picture = w.id;
  // Do not offer another object visibly contained in the same illustrated scene.
  const pictureExclusions = {camera:['letto'],letto:['camera'],menu:['pasta','pizza','pesce','verdure']};
  for (const l of lessons) for (const w of l.words) if (pictureExclusions[w.id]) w.pictureExcludes = pictureExclusions[w.id];
  const photo = (title,author,license,licenseUrl) => ({title,author,license,licenseUrl,source:'https://commons.wikimedia.org/wiki/'+encodeURIComponent('File:'+title.replace(/ /g,'_'))});
  // Real photographs; metadata checked against Commons imageinfo on 2026-10-10.
  // Each photo retains its own license. Only Commons-provided scaled versions are used.
  const photos = {
    caffe:photo('A cup of espresso.jpg','Vee Satayamas','CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/'),
    acqua:photo('Glass-of-water.jpg','Derek Jensen (Tysto)','Public domain',null),
    cornetto:photo('Cornetti2.JPG','exeair','CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/'),
    spremuta:photo('Orangejuice.jpg','rawpixel.com','CC0','https://creativecommons.org/publicdomain/zero/1.0/'),
    stazione:photo('Palermo Notarbartolo train station.01.jpg','Nenea hartia','CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/'),
    biglietto:photo('Ticket train.jpg','Macholi','CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/'),
    camera:photo('Double room of Conscious Hotel The Tire Staion 2024-11-26.jpg','Andy Li','CC0','https://creativecommons.org/publicdomain/zero/1.0/'),
    chiave:photo('Standard-lock-key.jpg','Evan-Amos','Public domain',null),
    asciugamano:photo('HSY- Folded Towels.jpg','HanSangYoon','CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/'),
    menu:photo('Restaurant menus.jpg','E4024','CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/'),
    verdure:photo('Vegetables, 2025 - Massachusetts.jpg','Daderot','CC0','https://creativecommons.org/publicdomain/zero/1.0/'),
    passeggiata:photo('Couple walking in park.jpg','Bill Branson / National Cancer Institute','Public domain',null)
  };
  // The old photographs retain their provenance for archival use, but are not displayed.
  const illustrations = Object.fromEntries(pictures.map(id=>[id,{file:id+'.webp',kind:'ai',generator:'OpenAI image generation',created:'2026-10-10'}]));
  const cafe = lessons.find(l=>l.id==='bar');
  cafe.goal = t('Objednám si kávu a něco k snídani, odpovím obsluze a požádám o účet.','Order coffee and breakfast, reply to the barista and ask for the bill.','Ordinare un caffè e la colazione, rispondere al barista e chiedere il conto.');
  cafe.dialogue = [
    {id:'bar-01',role:'barista',it:'Buongiorno! Che cosa desidera?',translation:t('Dobrý den! Co si přejete?','Good morning! What would you like?','Il barista chiede che cosa vuoi ordinare.')},
    {id:'bar-02',role:'customer',it:'Buongiorno! Vorrei un caffè e un cornetto, per favore.',translation:t('Dobrý den! Chtěl bych kávu a croissant, prosím.','Good morning! I would like a coffee and a croissant, please.','Il cliente ordina un caffè e un cornetto in modo cortese.')},
    {id:'bar-03',role:'barista',it:'Certo. Al banco o al tavolo?',translation:t('Jistě. U baru, nebo u stolu?','Of course. At the counter or at a table?','Il barista chiede dove vuoi consumare.')},
    {id:'bar-04',role:'customer',it:'Al banco, grazie. Anche un bicchiere d’acqua naturale.',translation:t('U baru, děkuji. A ještě sklenici neperlivé vody.','At the counter, thank you. Also a glass of still water.','Il cliente sceglie il banco e chiede anche acqua senza bollicine.')},
    {id:'bar-05',role:'barista',it:'Ecco il caffè, il cornetto e l’acqua.',translation:t('Tady je káva, croissant a voda.','Here are your coffee, croissant and water.','Il barista serve l’ordinazione.')},
    {id:'bar-06',role:'customer',it:'Grazie. Il conto, per favore.',translation:t('Děkuji. Účet, prosím.','Thank you. The bill, please.','Il cliente chiede di pagare.')},
    {id:'bar-07',role:'barista',it:'Sono quattro euro e cinquanta.',translation:t('Jsou to čtyři eura a padesát centů.','That is four euros fifty.','Il totale di questo esempio è 4,50 euro.')},
    {id:'bar-08',role:'customer',it:'Posso pagare con la carta?',translation:t('Mohu zaplatit kartou?','Can I pay by card?','Il cliente chiede se può usare la carta.')}
  ];
  cafe.questions.push(
    grammar('bar-order','___ un caffè e un cornetto, per favore. (io, richiesta cortese)',['Vorrei'],['Vorrei','Vorresti','Vorrebbero','Vorremmo'],'Vorrei znamená „chtěl/a bych“. Per favore dělá objednávku zdvořilou.','Vorrei means “I would like”. Per favore makes the order polite.','Vorrei è la forma di cortesia per ordinare in prima persona.'),
    grammar('bar-counter','Al banco o al tavolo? — ___ banco, grazie.',['Al'],['Al','Nel','Dal','Del'],'Al banco = u baru. A + il se spojuje v al.','Al banco means at the counter. A + il becomes al.','A + il diventa al: al banco.'),
    grammar('bar-bill','Per chiedere di pagare: Il ___, per favore.',['conto'],['conto','cornetto','latte','pane'],'Il conto je účet. Cornetto je sladké pečivo.','Il conto is the bill. Cornetto is a pastry.','Il conto indica la somma da pagare.'),
    grammar('bar-price','Sono quattro euro e cinquanta. → ___',['4,50 €'],['4,50 €','14,50 €','4,15 €','5,40 €'],'Quattro euro e cinquanta = 4 eura a 50 centů. Jde o cenu v modelovém dialogu.','Quattro euro e cinquanta = 4 euros and 50 cents, the price in this sample dialogue.','Quattro euro e cinquanta corrisponde a 4,50 euro nel dialogo di esempio.')
  );
  // Bundled synthetic Italian audio: no device voice needed for this lesson.
  const restaurant = lessons.find(l=>l.id==='ristorante');
  restaurant.title=t('V restauraci','At a restaurant','Al ristorante');
  restaurant.goal=t('Požádám o stůl a jídelní lístek, objednám jídlo a pití a zaplatím.','Ask for a table and a menu, order food and drinks, and pay.','Chiedere un tavolo e il menù, ordinare e pagare.');
  restaurant.dialogue=[
    ['Buonasera! Avete prenotato?','Dobrý večer! Máte rezervaci?','Good evening! Have you booked?'],
    ['Sì, ho prenotato un tavolo per due, a nome Novák.','Ano, rezervoval jsem stůl pro dva na jméno Novák.','Yes, I booked a table for two under the name Novák.'],
    ['Prego, accomodatevi. Ecco il menù.','Prosím, posaďte se. Tady je jídelní lístek.','Please, take a seat. Here is the menu.'],
    ['Grazie. Questo piatto è piccante?','Děkuji. Je toto jídlo pálivé?','Thank you. Is this dish spicy?'],
    ['No, la pasta al pomodoro non è piccante. Che cosa prendete?','Ne, těstoviny s rajčatovou omáčkou nejsou pálivé. Co si dáte?','No, the pasta with tomato sauce is not spicy. What would you like?'],
    ['Per me la pasta al pomodoro e le verdure alla griglia, per favore.','Pro mě těstoviny s rajčatovou omáčkou a grilovanou zeleninu, prosím.','For me, pasta with tomato sauce and grilled vegetables, please.'],
    ['E da bere?','A k pití?','And to drink?'],
    ['Una bottiglia d’acqua naturale, grazie.','Láhev neperlivé vody, děkuji.','A bottle of still water, thank you.'],
    ['Ecco i vostri piatti. Buon appetito!','Tady jsou vaše jídla. Dobrou chuť!','Here are your dishes. Enjoy your meal!'],
    ['Grazie! Il conto, per favore. Posso pagare con la carta?','Děkuji! Účet, prosím. Mohu platit kartou?','Thank you! The bill, please. Can I pay by card?'],
    ['Certamente. Porto subito il conto.','Samozřejmě. Hned přinesu účet.','Of course. I will bring the bill right away.'],
    ['Grazie, arrivederci!','Děkuji, na shledanou!','Thank you, goodbye!']
  ].map((row,i)=>({id:'ristorante-'+String(i+1).padStart(2,'0'),role:i%2?'customer':'barista',it:row[0],translation:t(row[1],row[2],row[0])}));
  restaurant.questions.push(
    grammar('ristorante-table','Ho prenotato un tavolo ___ due.',['per'],['per','con','di','da'],'Per due = pro dvě osoby.','Per due means for two people.','Per due significa per due persone.'),
    grammar('ristorante-menu','Posso vedere il ___, per favore?',['menù'],['menù','conto','tavolo','bicchiere'],'Před objednáním požádáš o menù, jídelní lístek.','Before ordering, ask for the menù, the menu.','Prima di ordinare chiedi il menù.'),
    grammar('ristorante-order','Io ___ la pasta al pomodoro. (prendere)',['prendo'],['prendo','prendi','prendete','prendono'],'Prendo = dám si. Prendere má pro io tvar prendo.','Prendo means I will have. The io form of prendere is prendo.','Con io: prendo.'),
    grammar('ristorante-drink','E da ___? — Acqua naturale, grazie.',['bere'],['bere','mangiare','pagare','prenotare'],'Da bere = k pití.','Da bere means to drink.','Da bere introduce le bevande.')
  );
  restaurant.video={id:'d2b02d5cc883c753ed2c0558a9bce662',transcript:[
    ['Ciao! Oggi andiamo al ristorante. Cominciamo dalla prenotazione: Buonasera, ho prenotato un tavolo per due, a nome Novák.','Ahoj! Dnes jdeme do restaurace. Začneme rezervací: Dobrý večer, rezervoval/a jsem stůl pro dva na jméno Novák.','Hello! Today we are going to a restaurant. Let’s start with the reservation: Good evening, I booked a table for two under the name Novák.'],
    ['Se non hai prenotato, puoi chiedere: Avete un tavolo per due? Ora chiedi il menù: Posso vedere il menù, per favore?','Pokud nemáš rezervaci, můžeš se zeptat: Máte stůl pro dva? Teď požádej o jídelní lístek: Mohu vidět jídelní lístek, prosím?','If you have not booked, you can ask: Do you have a table for two? Now ask for the menu: May I see the menu, please?'],
    ['Per ordinare, puoi dire: Prendo la pasta al pomodoro e le verdure alla griglia. Da bere, una bottiglia d’acqua naturale.','Při objednávání můžeš říct: Dám si těstoviny s rajčatovou omáčkou a grilovanou zeleninu. K pití láhev neperlivé vody.','To order, you can say: I will have pasta with tomato sauce and grilled vegetables. To drink, a bottle of still water.'],
    ['Vuoi sapere se un piatto è piccante? Chiedi: Questo piatto è piccante? Ascolta e ripeti: Prendo la pasta al pomodoro.','Chceš vědět, zda je jídlo pálivé? Zeptej se: Je toto jídlo pálivé? Poslouchej a opakuj: Dám si těstoviny s rajčatovou omáčkou.','Want to know whether a dish is spicy? Ask: Is this dish spicy? Listen and repeat: I will have pasta with tomato sauce.'],
    ['Alla fine del pasto, chiedi: Il conto, per favore. E poi: Posso pagare con la carta? Ricorda: un tavolo per due significa un tavolo per due persone.','Na konci jídla požádej: Účet, prosím. A potom: Mohu platit kartou? Pamatuj: un tavolo per due znamená stůl pro dvě osoby.','At the end of the meal, ask: The bill, please. And then: Can I pay by card? Remember: un tavolo per due means a table for two people.'],
    ['Adesso prova tu: chiedi un tavolo, ordina un piatto e chiedi il conto. Buon appetito!','Teď to zkus ty: požádej o stůl, objednej jídlo a požádej o účet. Dobrou chuť!','Now try it yourself: ask for a table, order a dish and ask for the bill. Enjoy your meal!']
  ]};
  const hotel = lessons.find(l=>l.id==='hotel');
  hotel.title=t('V hotelu','At a hotel','In hotel');
  hotel.goal=t('Přihlásím se na recepci, zeptám se na snídani a Wi-Fi a domluvím odjezd.','Check in, ask about breakfast and Wi-Fi, and arrange departure.','Fare il check-in, chiedere della colazione e del Wi-Fi e organizzare la partenza.');
  hotel.dialogue=[
    ['Buonasera! Avete una prenotazione?','Dobrý večer! Máte rezervaci?','Good evening! Do you have a reservation?'],
    ['Sì, a nome Novák. Ho prenotato una camera per due notti.','Ano, na jméno Novák. Rezervoval jsem pokoj na dvě noci.','Yes, under the name Novák. I booked a room for two nights.'],
    ['Perfetto. Posso vedere i vostri documenti, per favore?','Výborně. Mohu vidět vaše doklady, prosím?','Perfect. May I see your identity documents, please?'],
    ['Certo, ecco i documenti. La colazione è inclusa?','Jistě, tady jsou doklady. Je snídaně v ceně?','Of course, here are our documents. Is breakfast included?'],
    ['Sì, è inclusa. Viene servita dalle sette alle dieci.','Ano, je v ceně. Podává se od sedmi do deseti.','Yes, it is included. It is served from seven until ten.'],
    ['Grazie. Qual è la password del Wi-Fi?','Děkuji. Jaké je heslo k Wi-Fi?','Thank you. What is the Wi-Fi password?'],
    ['È scritta su questo foglio. Ecco la chiave della camera.','Je napsané na tomto papíru. Tady je klíč od pokoje.','It is written on this sheet. Here is your room key.'],
    ['A che ora devo lasciare la camera il giorno della partenza?','V kolik hodin musím v den odjezdu opustit pokoj?','What time must I leave the room on the day of departure?'],
    ['Entro le undici, per favore.','Do jedenácti, prosím.','By eleven, please.'],
    ['Posso lasciare qui la valigia fino al pomeriggio?','Mohu tu nechat kufr až do odpoledne?','Can I leave my suitcase here until the afternoon?'],
    ['Certamente, può lasciarla alla reception. Buon soggiorno!','Samozřejmě, můžete jej nechat na recepci. Příjemný pobyt!','Of course, you can leave it at reception. Enjoy your stay!'],
    ['Grazie mille!','Moc děkuji!','Thank you very much!']
  ].map((row,i)=>({id:'hotel-'+String(i+1).padStart(2,'0'),role:i%2?'customer':'barista',it:row[0],translation:t(row[1],row[2],row[0])}));
  hotel.questions.push(
    grammar('hotel-duration','Ho una prenotazione ___ due notti.',['per'],['per','a','di','con'],'Per due notti vyjadřuje délku pobytu: na dvě noci.','Per due notti expresses duration: for two nights.','Per due notti indica la durata.'),
    grammar('hotel-breakfast','La colazione è ___? (compresa nel prezzo)',['inclusa'],['inclusa','incluso','inclusi','incluse'],'Colazione je ženského rodu v jednotném čísle: inclusa.','Colazione is feminine singular: inclusa.','Colazione è femminile singolare: inclusa.'),
    grammar('hotel-time','___ che ora devo lasciare la camera?',['A'],['A','In','Da','Per'],'A che ora? = V kolik hodin?','A che ora? means At what time?','A che ora introduce una domanda sull’orario.'),
    grammar('hotel-towel','Mi ___ un asciugamano, per favore. (servire)',['serve'],['serve','servono','servire','servi'],'Un asciugamano je jednotné číslo: mi serve.','Un asciugamano is singular: mi serve.','Con un asciugamano si usa il singolare: serve.')
  );
  hotel.video={id:null,status:'unavailable',failedGenerationId:'0f679c2c3416412bd18db7220b18840b',transcript:[
    ['Ciao! Oggi arriviamo in hotel. Alla reception puoi dire: Buonasera, ho una prenotazione a nome Novák, per due notti. Ascolta e ripeti: Ho una prenotazione per due notti.','Ahoj! Dnes přijíždíme do hotelu. Na recepci můžeš říct: Dobrý večer, mám rezervaci na jméno Novák na dvě noci. Poslouchej a opakuj: Mám rezervaci na dvě noci.','Hello! Today we arrive at a hotel. At reception you can say: Good evening, I have a reservation under the name Novák for two nights. Listen and repeat: I have a reservation for two nights.'],
    ['Vuoi sapere se la colazione è compresa? Chiedi: La colazione è inclusa? E poi: A che ora viene servita?','Chceš vědět, zda je snídaně v ceně? Zeptej se: Je snídaně zahrnutá? A potom: V kolik hodin se podává?','Want to know whether breakfast is included? Ask: Is breakfast included? And then: What time is it served?'],
    ['Per collegarti a Internet, domanda: Qual è la password del Wi-Fi? Se manca un asciugamano, puoi dire: Mi serve un asciugamano, per favore. Se la chiave non apre la porta: La chiave non funziona.','Pro připojení k internetu se zeptej: Jaké je heslo k Wi-Fi? Pokud chybí ručník, můžeš říct: Potřebuji ručník, prosím. Pokud klíč neotevírá dveře: Klíč nefunguje.','To connect to the internet, ask: What is the Wi-Fi password? If a towel is missing, you can say: I need a towel, please. If the key does not open the door: The key does not work.'],
    ['Alla partenza chiedi: A che ora devo lasciare la camera? E se vuoi visitare ancora la città: Posso lasciare qui la valigia fino al pomeriggio?','Při odjezdu se zeptej: V kolik hodin musím opustit pokoj? A pokud chceš ještě navštívit město: Mohu tu nechat kufr až do odpoledne?','When leaving, ask: What time must I leave the room? And if you want to explore the city some more: Can I leave my suitcase here until the afternoon?'],
    ['Ricorda: per due notti indica la durata del soggiorno. Adesso prova tu: presenta la prenotazione, chiedi della colazione e dell’orario di partenza. Buon soggiorno!','Pamatuj: per due notti označuje délku pobytu. Teď to zkus ty: oznam rezervaci, zeptej se na snídani a čas odjezdu. Příjemný pobyt!','Remember: per due notti indicates the length of the stay. Now try it yourself: give your reservation details, ask about breakfast and the departure time. Enjoy your stay!']
  ]};
  hotel.guide={
    cs:{cafeTitle:'V hotelu',cafeTime:'V hotelu · A2 · asi 7 minut',cafeContext:'Přijíždíš do hotelu na dvě noci. Domluv se na recepci na pobytu a odjezdu. Časy snídaně a odjezdu jsou pouze příklady z dialogu.',ruleText:'A nome… = na jméno… Per due notti = na dvě noci. La colazione è inclusa? = Je snídaně v ceně? Dalle sette alle dieci = od sedmi do deseti. Entro le undici = nejpozději do jedenácti. Mi serve… = potřebuji…',completed:'Bez nápovědy oznam rezervaci na dvě noci, zeptej se na snídani a čas opuštění pokoje.',practiceCafe:'Procvičit domluvu v hotelu',barista:'Recepční',customer:'Host'},
    en:{cafeTitle:'At a hotel',cafeTime:'At a hotel · A2 · about 7 minutes',cafeContext:'You arrive at a hotel for two nights. Arrange your stay and departure at reception. Breakfast and checkout times are examples from this dialogue only.',ruleText:'A nome… = under the name… Per due notti = for two nights. La colazione è inclusa? = Is breakfast included? Dalle sette alle dieci = from seven until ten. Entro le undici = by eleven. Mi serve… = I need…',completed:'Without hints, give a reservation for two nights, ask about breakfast and the checkout time.',practiceCafe:'Practise speaking at a hotel',barista:'Receptionist',customer:'Guest'},
    it:{cafeTitle:'In hotel',cafeTime:'In hotel · A2 · circa 7 minuti',cafeContext:'Arrivi per due notti. Gli orari del dialogo sono esempi.',ruleText:'A nome indica il nome della prenotazione. Per due notti indica la durata. Entro le undici indica un limite di orario.',completed:'Presenta la prenotazione e chiedi della colazione e della partenza.',practiceCafe:'Esercitati in hotel',barista:'Receptionist',customer:'Ospite'}
  };
  const audioFiles = {};
  for(const w of hotel.words){audioFiles[w.italian]='hotel-'+w.id+'-word.mp3';audioFiles[w.example]='hotel-'+w.id+'-example.mp3';}
  for(const line of hotel.dialogue)audioFiles[line.it]=line.id+'.mp3';
  for(const w of restaurant.words){audioFiles[w.italian]='ristorante-'+w.id+'-word.mp3';audioFiles[w.example]='ristorante-'+w.id+'-example.mp3';}
  for(const line of restaurant.dialogue)audioFiles[line.it]=line.id+'.mp3';
  for (const w of cafe.words) {
    audioFiles[w.italian] = 'bar-'+w.id+'-word.mp3';
    audioFiles[w.example] = 'bar-'+w.id+'-example.mp3';
  }
  for (const line of cafe.dialogue) audioFiles[line.it] = line.id+'.mp3';
  const data = {version:1, lessons, photos, illustrations, audioFiles};
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.ItalianData = data;
})(typeof window !== 'undefined' ? window : globalThis);
