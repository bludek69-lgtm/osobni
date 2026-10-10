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
  const data = {version:1, lessons, photos, illustrations};
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.ItalianData = data;
})(typeof window !== 'undefined' ? window : globalThis);
