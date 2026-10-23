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
      grammar('vorrei','___ un caffè, per favore. (io, richiesta cortese)',['Vorrei'],['Vorrei','Vorremmo','Vorrebbero','Vorresti'],'Vorrei je 1. osoba podmiňovacího způsobu.','Vorrei is the first-person singular conditional.','Vorrei è il condizionale, prima persona singolare.')]),
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
      word('la-vedo','la vedo','vidím ji / ho (italský ženský rod)','I see her / it (feminine)','vedo la persona o cosa femminile nominata','La stazione? La vedo da qui.'),
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
  const pictures = ['caffe','acqua','cornetto','spremuta','stazione','biglietto','camera','chiave','asciugamano','menu','verdure','passeggiata','pane','latte','gelato','autobus','farmacia','museo','valigia','letto','doccia','pasta','pizza','pesce','conto','colazione','piccante','destra','sinistra'];
  for (const l of lessons) for (const w of l.words) if (pictures.includes(w.id)) w.picture = w.id;
  // Do not offer another object visibly contained in the same illustrated scene.
  const pictureExclusions = {camera:['letto'],letto:['camera'],menu:['pasta','pizza','pesce','verdure'],colazione:['caffe','latte','cornetto','pane','spremuta','acqua'],piccante:['verdure']};
  for (const l of lessons) for (const w of l.words) if (pictureExclusions[w.id]) w.pictureExcludes = pictureExclusions[w.id];
  const photo = (title,author,license,licenseUrl) => ({title,author,license,licenseUrl,source:'https://commons.wikimedia.org/wiki/'+encodeURIComponent('File:'+title.replace(/ /g,'_'))});
  // Real photographs; metadata checked against Commons imageinfo on 2026-10-10.
  // Each photo retains its own license. Only Commons-provided scaled versions are used.
  const photos = {
    conto:photo("Golden Crown Restaurant Receipt.jpg","Collection of My Community SG","CC BY 4.0","https://creativecommons.org/licenses/by/4.0"),
    colazione:photo("Coffee, breakfast, croissant.jpg","Kurt Kaiser","CC0","https://creativecommons.org/publicdomain/zero/1.0/deed.en"),
    piccante:photo("Red Chili Pepper.jpg","Psychonaught","Public domain",null),
    destra:photo("UK Turn Right Sign - geograph.org.uk - 6261777.jpg","Gary","CC BY-SA 2.0","https://creativecommons.org/licenses/by-sa/2.0"),
    sinistra:photo("Turn left sign, Kingsway, Newport - geograph.org.uk - 6925215.jpg","Jaggery","CC BY-SA 2.0","https://creativecommons.org/licenses/by-sa/2.0"),
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
    pane:photo("Bread-breakfast-baguette-sliced (24244220141).jpg","www.Pixel.la Free Stock Photos","CC0","https://creativecommons.org/publicdomain/zero/1.0/deed.en"),
    latte:photo("Glass of milk.jpg","Santeri Viinamäki","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0"),
    gelato:photo("Sprinkles (Jimmies) on Ice Cream Cone.jpg","Bigmacthealmanac","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0"),
    autobus:photo("Roma TPL Iveco Bus Urbanway (9951).jpg","Kaga tau","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0"),
    farmacia:photo("Pharmacies have illuminated green crosses (18417857026).jpg","Eric Fischer","CC BY 2.0","https://creativecommons.org/licenses/by/2.0"),
    museo:photo("Gallery display of American paintings formerly in the collection of the Corcoran Gallery of Art, now at the National Gallery of Art in Washington, D.C.jpg","Ser Amantio di Nicolao","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0"),
    valigia:photo("Cloth Suitcase.jpg","Mk2010","CC BY-SA 3.0","https://creativecommons.org/licenses/by-sa/3.0"),
    letto:photo("European single bed from seahorse.jpg","Peachyeung316","CC BY-SA 4.0","https://creativecommons.org/licenses/by-sa/4.0"),
    doccia:photo("Shower Cubicle.jpg","Fanti Salms","CC BY-SA 3.0","https://creativecommons.org/licenses/by-sa/3.0"),
    pasta:photo("Spaghetti-prepared.jpg","Eloquence","Public domain",null),
    pizza:photo("Pizza Margherita (14565452088).jpg","jeffreyw","CC BY 2.0","https://creativecommons.org/licenses/by/2.0"),
    pesce:photo("Grilled Fish (4791990726).jpg","Emilian Robert Vicol from Com. Balanesti, Romania","CC BY 2.0","https://creativecommons.org/licenses/by/2.0"),
    passeggiata:photo('Couple walking in park.jpg','Bill Branson / National Cancer Institute','Public domain',null)
  };
  // Previous AI illustrations are retained as an unused archive; flashcards display photos.
  const illustrations = Object.fromEntries(pictures.slice(0,24).map(id=>[id,{file:id+'.webp',kind:'ai',generator:'OpenAI image generation',created:'2026-10-10'}]));
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
    grammar('ristorante-menu','Per scegliere i piatti: Posso vedere il ___, per favore?',['menù'],['menù','conto','tavolo','bicchiere'],'Před objednáním požádáš o menù, jídelní lístek.','Before ordering, ask for the menù, the menu.','Prima di ordinare chiedi il menù.'),
    grammar('ristorante-order','Io ___ la pasta al pomodoro. (prendere)',['prendo'],['prendo','prendi','prendete','prendono'],'Prendo = dám si. Prendere má pro io tvar prendo.','Prendo means I will have. The io form of prendere is prendo.','Con io: prendo.'),
    grammar('ristorante-drink','E da ___? — Acqua naturale, grazie.',['bere'],['bere','mangiare','pagare','prenotare'],'Da bere = k pití.','Da bere means to drink.','Da bere introduce le bevande.')
  );
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
    grammar('hotel-time','___ che ora devo lasciare la camera?',['A'],['A','In','Da','Su'],'A che ora? = V kolik hodin?','A che ora? means At what time?','A che ora introduce una domanda sull’orario.'),
    grammar('hotel-towel','Mi ___ un asciugamano, per favore. (servire)',['serve'],['serve','servono','servire','servi'],'Un asciugamano je jednotné číslo: mi serve.','Un asciugamano is singular: mi serve.','Con un asciugamano si usa il singolare: serve.')
  );
  hotel.guide={
    cs:{cafeTitle:'V hotelu',cafeTime:'V hotelu · A2 · asi 7 minut',cafeContext:'Přijíždíš do hotelu na dvě noci. Domluv se na recepci na pobytu a odjezdu. Časy snídaně a odjezdu jsou pouze příklady z dialogu.',ruleText:'A nome… = na jméno… Per due notti = na dvě noci. La colazione è inclusa? = Je snídaně v ceně? Dalle sette alle dieci = od sedmi do deseti. Entro le undici = nejpozději do jedenácti. Mi serve… = potřebuji…',completed:'Bez nápovědy oznam rezervaci na dvě noci, zeptej se na snídani a čas opuštění pokoje.',practiceCafe:'Procvičit domluvu v hotelu',barista:'Recepční',customer:'Host'},
    en:{cafeTitle:'At a hotel',cafeTime:'At a hotel · A2 · about 7 minutes',cafeContext:'You arrive at a hotel for two nights. Arrange your stay and departure at reception. Breakfast and checkout times are examples from this dialogue only.',ruleText:'A nome… = under the name… Per due notti = for two nights. La colazione è inclusa? = Is breakfast included? Dalle sette alle dieci = from seven until ten. Entro le undici = by eleven. Mi serve… = I need…',completed:'Without hints, give a reservation for two nights, ask about breakfast and the checkout time.',practiceCafe:'Practise speaking at a hotel',barista:'Receptionist',customer:'Guest'},
    it:{cafeTitle:'In hotel',cafeTime:'In hotel · A2 · circa 7 minuti',cafeContext:'Arrivi per due notti. Gli orari del dialogo sono esempi.',ruleText:'A nome indica il nome della prenotazione. Per due notti indica la durata. Entro le undici indica un limite di orario.',completed:'Presenta la prenotazione e chiedi della colazione e della partenza.',practiceCafe:'Esercitati in hotel',barista:'Receptionist',customer:'Ospite'}
  };
  const city=lessons.find(l=>l.id==='citta');
  city.goal=t('Zeptám se na cestu, porozumím jednoduchým pokynům a ověřím si směr.','Ask for directions, understand simple instructions and confirm the route.','Chiedere indicazioni, capire istruzioni semplici e verificare il percorso.');
  city.dialogue=[
    ['Mi scusi, dov’è la stazione?','Promiňte, kde je nádraží?','Excuse me, where is the station?'],
    ['Vada sempre dritto fino al semaforo.','Jděte pořád rovně až k semaforu.','Go straight ahead until the traffic light.'],
    ['E poi?','A potom?','And then?'],
    ['Al semaforo giri a destra. La stazione è sulla sinistra.','U semaforu odbočte vpravo. Nádraží je po levé straně.','At the traffic light, turn right. The station is on the left.'],
    ['È lontana?','Je daleko?','Is it far away?'],
    ['No, sono circa dieci minuti a piedi.','Ne, je to asi deset minut pěšky.','No, it is about ten minutes on foot.'],
    ['Mi scusi, può ripetere più lentamente?','Promiňte, můžete to zopakovat pomaleji?','Excuse me, could you repeat that more slowly?'],
    ['Certo. Sempre dritto, poi a destra al semaforo.','Jistě. Pořád rovně, potom u semaforu doprava.','Of course. Straight ahead, then right at the traffic light.'],
    ['Quindi, dritto e poi a destra. Grazie mille!','Takže rovně a potom doprava. Moc děkuji!','So, straight ahead and then right. Thank you very much!'],
    ['Esatto. Prego, buona giornata!','Přesně tak. Není zač, hezký den!','Exactly. You are welcome, have a nice day!']
  ].map((row,i)=>({id:'citta-'+String(i+1).padStart(2,'0'),role:i%2?'barista':'customer',it:row[0],translation:t(row[1],row[2],row[0])}));
  city.guide={
    cs:{cafeTitle:'Orientace ve městě',cafeTime:'Orientace ve městě · A1 · asi 6 minut',cafeContext:'Vycházíš z hotelu a hledáš nádraží. Zeptej se kolemjdoucího a zopakuj si cestu. Trasa a čas jsou modelový příklad.',ruleText:'Mi scusi = promiňte při zdvořilém oslovení. Dov’è…? = kde je…? Sempre dritto = pořád rovně. Giri a destra = odbočte vpravo; sulla sinistra = po levé straně. A piedi = pěšky. Può ripetere? = Můžete to zopakovat?',completed:'Bez nápovědy se zeptej na nádraží, požádej o pomalejší zopakování a potvrď směr cesty.',practiceCafe:'Procvičit cestu po městě',barista:'Kolemjdoucí',customer:'Cestovatel'},
    en:{cafeTitle:'Finding your way',cafeTime:'Finding your way · A1 · about 6 minutes',cafeContext:'You leave your hotel and look for the station. Ask a passer-by and repeat the route. The route and travel time are examples.',ruleText:'Mi scusi = excuse me, politely. Dov’è…? = where is…? Sempre dritto = straight ahead. Giri a destra = turn right; sulla sinistra = on the left. A piedi = on foot. Può ripetere? = Could you repeat that?',completed:'Without hints, ask for the station, ask for slower repetition and confirm the directions.',practiceCafe:'Practise directions',barista:'Passer-by',customer:'Traveller'},
    it:{cafeTitle:'Orientarsi in città',cafeTime:'In città · A1 · circa 6 minuti',cafeContext:'Cerchi la stazione. Il percorso e il tempo sono esempi.',ruleText:'Mi scusi è una formula cortese. Dritto indica di proseguire senza svoltare. A piedi significa camminando.',completed:'Chiedi la strada e conferma il percorso.',practiceCafe:'Esercitati con le indicazioni',barista:'Passante',customer:'Viaggiatore'}
  };
  city.questions.push(
    grammar('citta-polite','Mi ___, dov’è la stazione? (Lei)',['scusi'],['scusi','scusa','scusate','scusiamo'],'Mi scusi je zdvořilé oslovení jedné osoby.','Mi scusi is a polite way to address one person.','Mi scusi si usa con Lei.'),
    grammar('citta-right','Giri a ___. (vpravo / right)',['destra'],['destra','sinistra','piedi','stazione'],'A destra znamená doprava.','A destra means to the right.','A destra indica la direzione.'),
    grammar('citta-walk','Sono dieci minuti a ___. (pěšky / on foot)',['piedi'],['piedi','piede','destra','treno'],'A piedi je ustálené spojení pro pěšky.','A piedi is the expression for on foot.','A piedi significa camminando.'),
    grammar('citta-repeat','Può ___ più lentamente? (ripetere)',['ripetere'],['ripetere','ripete','ripeto','ripetuto'],'Po può následuje infinitiv: ripetere.','Può is followed by an infinitive: ripetere.','Dopo può si usa l’infinito: ripetere.')
  );
  const greetings=lessons.find(l=>l.id==='saluti');
  greetings.goal=t('Pozdravím, představím se, zeptám se na jméno a rozloučím se.','Greet someone, introduce myself, ask their name and say goodbye.','Salutare, presentarsi, chiedere il nome e congedarsi.');
  greetings.dialogue=[
    ['Ciao! Mi chiamo Anna. E tu, come ti chiami?','Ahoj! Jmenuji se Anna. A ty, jak se jmenuješ?','Hi! My name is Anna. And you, what is your name?'],
    ['Ciao, Anna! Mi chiamo Marco. Piacere!','Ahoj, Anno! Jmenuji se Marco. Těší mě!','Hi, Anna! My name is Marco. Nice to meet you!'],
    ['Piacere! Come stai?','Těší mě! Jak se máš?','Nice to meet you! How are you?'],
    ['Bene, grazie. E tu?','Dobře, děkuji. A ty?','Fine, thank you. And you?'],
    ['Molto bene. Sono ceca. E tu, di dove sei?','Velmi dobře. Jsem Češka. A ty, odkud jsi?','Very well. I am Czech. And you, where are you from?'],
    ['Sono italiano, di Roma. Sei qui in vacanza?','Jsem Ital, z Říma. Jsi tu na dovolené?','I am Italian, from Rome. Are you here on holiday?'],
    ['Sì, sono in vacanza. Parlo un po’ italiano.','Ano, jsem na dovolené. Mluvím trochu italsky.','Yes, I am on holiday. I speak a little Italian.'],
    ['Parli bene! Benvenuta in Italia!','Mluvíš dobře! Vítej v Itálii!','You speak well! Welcome to Italy!'],
    ['Grazie, Marco! A presto!','Děkuji, Marku! Brzy na viděnou!','Thank you, Marco! See you soon!'],
    ['A presto, Anna! Buona giornata!','Brzy na viděnou, Anno! Hezký den!','See you soon, Anna! Have a nice day!']
  ].map((row,i)=>({id:'saluti-'+String(i+1).padStart(2,'0'),role:i%2?'customer':'barista',it:row[0],translation:t(row[1],row[2],row[0])}));
  greetings.guide={
    cs:{cafeTitle:'Pozdravy a představení',cafeTime:'Pozdravy a představení · A1 · asi 5 minut',cafeContext:'Anna se na dovolené seznamuje s Marcem. V rozhovoru si tykají. Na recepci nebo při zdvořilém oslovení použij buongiorno či buonasera.',ruleText:'Ciao = ahoj při setkání i loučení mezi lidmi, kteří si tykají. Mi chiamo… = jmenuji se… Come ti chiami? = jak se jmenuješ? Zdvořile: Come si chiama? Come stai? = jak se máš? Zdvořile: Come sta? Sono ceco / ceca = jsem Čech / Češka. Arrivederci = na shledanou; a presto = brzy na viděnou.',completed:'Bez nápovědy pozdrav, řekni své jméno a odkud jsi, zeptej se druhého na jméno a rozluč se.',practiceCafe:'Procvičit seznámení',barista:'Anna',customer:'Marco'},
    en:{cafeTitle:'Greetings and introductions',cafeTime:'Greetings and introductions · A1 · about 5 minutes',cafeContext:'Anna meets Marco while on holiday. They use informal language. At reception or when greeting someone politely, use buongiorno or buonasera.',ruleText:'Ciao = hi or bye in informal situations. Mi chiamo… = my name is… Come ti chiami? = what is your name? Politely: Come si chiama? Come stai? = how are you? Politely: Come sta? Sono ceco / ceca = I am Czech (male / female). Arrivederci = goodbye; a presto = see you soon.',completed:'Without hints, greet someone, say your name and where you are from, ask their name and say goodbye.',practiceCafe:'Practise introductions',barista:'Anna',customer:'Marco'},
    it:{cafeTitle:'Saluti e presentazioni',cafeTime:'Saluti · A1 · circa 5 minuti',cafeContext:'Anna incontra Marco. Si danno del tu.',ruleText:'Ciao è informale. Con Lei si dice: Come si chiama? Come sta? Arrivederci si usa per congedarsi.',completed:'Saluta, presentati e chiedi il nome.',practiceCafe:'Esercitati con le presentazioni',barista:'Anna',customer:'Marco'}
  };
  greetings.questions.push(
    grammar('saluti-name','Io ___ chiamo Anna.',['mi'],['mi','ti','si','ci'],'Mi chiamo = jmenuji se.','Mi chiamo means my name is.','Con io: mi chiamo.'),
    grammar('saluti-formal','Come ___ chiama? (Lei)',['si'],['si','ti','mi','vi'],'Při vykání jedné osobě: Come si chiama?','When addressing one person formally: Come si chiama?','Con Lei: Come si chiama?'),
    grammar('saluti-feeling','Come ___? (tu, stare)',['stai'],['stai','sta','sto','stiamo'],'Come stai? používáme při tykání.','Come stai? is informal.','Con tu si usa stai.'),
    grammar('saluti-origin','Sono italiano, ___ Roma. (origine)',['di'],['di','a','in','per'],'Di Roma vyjadřuje původ: z Říma.','Di Roma expresses origin: from Rome.','Di Roma indica la provenienza.')
  );
  const yesterday=lessons.find(l=>l.id==='passato');
  yesterday.goal=t('Povím, kde jsem včera byl/a, co jsem navštívil/a a kdy jsem se vrátil/a.','Say where I went yesterday, what I visited and when I returned.','Raccontare dove sono stato ieri, cosa ho visitato e quando sono tornato.');
  yesterday.dialogue=[
    ['Ciao, Anna! Che cosa hai fatto ieri?','Ahoj, Anno! Co jsi dělala včera?','Hi, Anna! What did you do yesterday?'],
    ['Sono andata a Siena con un’amica.','Jela jsem do Sieny s kamarádkou.','I went to Siena with a friend.'],
    ['Bello! Come siete andate?','To je hezké! Jak jste jely?','Lovely! How did you get there?'],
    ['Abbiamo preso l’autobus. Il viaggio è stato piacevole.','Jely jsme autobusem. Cesta byla příjemná.','We took the bus. The journey was pleasant.'],
    ['Che cosa avete visitato?','Co jste navštívily?','What did you visit?'],
    ['Abbiamo visitato il duomo e poi abbiamo fatto una passeggiata in centro.','Navštívily jsme dóm a pak jsme se prošly po centru.','We visited the cathedral and then took a walk in the centre.'],
    ['Avete mangiato in centro?','Jedly jste v centru?','Did you eat in the centre?'],
    ['Sì, abbiamo mangiato in una piccola trattoria. E tu?','Ano, jedly jsme v malé trattorii. A ty?','Yes, we ate in a small trattoria. And you?'],
    ['Io sono rimasto a Firenze. Ho visitato un museo.','Já jsem zůstal ve Florencii. Navštívil jsem muzeum.','I stayed in Florence. I visited a museum.'],
    ['A che ora sei tornato a casa?','V kolik ses vrátil domů?','What time did you get home?'],
    ['Sono tornato alle sei. E voi?','Vrátil jsem se v šest. A vy?','I got home at six. And you?'],
    ['Siamo tornate alle otto, stanche ma contente!','Vrátily jsme se v osm, unavené, ale spokojené!','We got back at eight, tired but happy!']
  ].map((row,i)=>({id:'passato-'+String(i+1).padStart(2,'0'),role:i%2?'barista':'customer',it:row[0],translation:t(row[1],row[2],row[0])}));
  yesterday.guide={
    cs:{cafeTitle:'Co se stalo včera',cafeTime:'Co se stalo včera · A2 · asi 6 minut',cafeContext:'Anna vypráví Marcovi o výletu do Sieny s kamarádkou. Marco strávil den ve Florencii. Poslouchej, kdy zazní ho / abbiamo a kdy sono / siamo.',ruleText:'Passato prossimo tvoří přítomný čas avere nebo essere + příčestí: ho visitato = navštívil/a jsem, abbiamo preso = jeli jsme / vzali jsme. Andare a tornare používají essere: Marco è andato / tornato, Anna è andata / tornata. Příčestí s essere se shoduje s podmětem: Anna a kamarádka sono andate / tornate; Marco a Paolo sono andati / tornati. U abbiamo visitato se podle rodu mluvčího koncovka nemění. Ieri = včera, poi = pak, alle sei = v šest.',completed:'Řekni tři věty o včerejšku: kam jsi šel/šla, co jsi navštívil/a a kdy ses vrátil/a. Zkus Sono andato/andata…, Ho visitato… a Sono tornato/tornata alle…',practiceCafe:'Procvičit minulý čas',barista:'Anna',customer:'Marco'},
    en:{cafeTitle:'Talking about yesterday',cafeTime:'Talking about yesterday · A2 · about 6 minutes',cafeContext:'Anna tells Marco about a trip to Siena with a female friend. Marco spent the day in Florence. Listen for ho / abbiamo and sono / siamo.',ruleText:'The passato prossimo uses present-tense avere or essere + a past participle: ho visitato = I visited, abbiamo preso = we took. Andare and tornare use essere: Marco è andato / tornato, Anna è andata / tornata. With essere the participle agrees with the subject: Anna and her female friend sono andate / tornate; Marco and Paolo sono andati / tornati. In abbiamo visitato the ending does not change with the speaker’s gender. Ieri = yesterday, poi = then, alle sei = at six.',completed:'Say three sentences about yesterday: where you went, what you visited and when you returned. Try Sono andato/andata…, Ho visitato… and Sono tornato/tornata alle…',practiceCafe:'Practise the past tense',barista:'Anna',customer:'Marco'},
    it:{cafeTitle:'Raccontare ieri',cafeTime:'Raccontare ieri · A2 · circa 6 minuti',cafeContext:'Anna racconta a Marco una gita a Siena con un’amica.',ruleText:'Passato prossimo: avere o essere + participio passato. Con essere il participio concorda con il soggetto: Anna è andata; le amiche sono tornate.',completed:'Racconta dove sei andato, cosa hai visitato e quando sei tornato.',practiceCafe:'Esercitati con il passato',barista:'Anna',customer:'Marco'}
  };
  yesterday.questions.push(
    grammar('passato-auxiliary','Anna ___ andata a Siena.',['è'],['è','ha','sono','hai'],'Andare používá essere: Anna è andata.','Andare uses essere: Anna è andata.','Andare usa essere: Anna è andata.'),
    grammar('passato-feminine','Anna e Lucia sono ___ alle otto. (tornare)',['tornate'],['tornate','tornati','tornata','tornato'],'Dvě ženy: sono tornate.','Two women: sono tornate.','Con Anna e Lucia: sono tornate.'),
    grammar('passato-take','Abbiamo ___ l’autobus. (prendere)',['preso'],['preso','prenduto','prendere','presi'],'Příčestí slovesa prendere je preso: abbiamo preso.','The past participle of prendere is preso: abbiamo preso.','Il participio di prendere è preso.'),
    grammar('passato-do','Ieri ho ___ una passeggiata. (fare)',['fatto'],['fatto','fare','fatta','faccio'],'Fare má nepravidelné příčestí fatto.','Fare has the irregular past participle fatto.','Il participio irregolare di fare è fatto.')
  );
  const story=lessons.find(l=>l.id==='racconto');
  story.goal=t('Popíšu okolnosti příběhu, řeknu, co se náhle stalo, a navážu jeho pokračování.','Describe the background of a story, say what suddenly happened and explain what followed.','Descrivere lo sfondo di un racconto e gli eventi successivi.');
  story.dialogue=[
    ['Anna, com’è andata la gita di ieri?','Anno, jak dopadl včerejší výlet?','Anna, how did yesterday’s trip go?'],
    ['Bene, ma all’inizio abbiamo avuto un piccolo problema.','Dobře, ale na začátku jsme měli malý problém.','Well, but at first we had a small problem.'],
    ['Che cosa è successo?','Co se stalo?','What happened?'],
    ['Mentre aspettavamo il treno, ha iniziato a piovere.','Zatímco jsme čekali na vlak, začalo pršet.','While we were waiting for the train, it started to rain.'],
    ['Avevate un ombrello?','Měli jste deštník?','Did you have an umbrella?'],
    ['No. Di solito portavo un ombrello nello zaino, ma ieri non c’era.','Ne. Obvykle jsem nosila deštník v batohu, ale včera tam nebyl.','No. I usually used to carry an umbrella in my backpack, but yesterday it wasn’t there.'],
    ['E allora che cosa avete fatto?','A co jste tedy udělali?','So what did you do?'],
    ['Siamo entrati nel bar della stazione. Mentre bevevamo un caffè, è arrivato il treno.','Vešli jsme do nádražní kavárny. Zatímco jsme pili kávu, přijel vlak.','We went into the station café. While we were drinking coffee, the train arrived.'],
    ['Siete riusciti a prenderlo?','Stihli jste ho?','Did you manage to catch it?'],
    ['Sì, ma sul treno mi sono accorta che non avevo il telefono.','Ano, ale ve vlaku jsem si uvědomila, že nemám telefon.','Yes, but on the train I realised I didn’t have my phone.'],
    ['Oh no! Dove l’hai trovato?','Ale ne! Kde jsi ho našla?','Oh no! Where did you find it?'],
    ['Per fortuna era nella tasca della giacca! Alla fine siamo arrivati in tempo e abbiamo visitato il museo.','Naštěstí byl v kapse bundy! Nakonec jsme dorazili včas a navštívili muzeum.','Luckily, it was in my jacket pocket! In the end we arrived on time and visited the museum.']
  ].map((row,i)=>({id:'racconto-'+String(i+1).padStart(2,'0'),role:i%2?'barista':'customer',it:row[0],translation:t(row[1],row[2],row[0])}));
  story.guide={
    cs:{cafeTitle:'Vyprávění a souvislosti',cafeTime:'Vyprávění a souvislosti · B1 · asi 7 minut',cafeContext:'Anna vypráví Marcovi o výletu s přáteli. Déšť, příjezd vlaku a zdánlivě ztracený telefon: všimni si rozdílu mezi okolnostmi a událostmi, které příběh posouvají dál.',ruleText:'Imperfetto popisuje pozadí, stav nebo opakovaný děj v minulosti: aspettavamo = čekali jsme, avevo = měl/a jsem, di solito portavo = obvykle jsem nosil/a. Passato prossimo představuje dokončené události: ha iniziato a piovere = začalo pršet, è arrivato = přijel. Mentre aspettavamo, ha iniziato a piovere: během čekání začalo pršet. Mentre samo o sobě neurčuje čas; záleží na významu dějů. Accorgersi používá essere: Anna si è accorta, Marco si è accorto. All’improvviso = najednou, comunque = každopádně, alla fine = nakonec.',completed:'Vyprávěj krátkou příhodu ve čtyřech větách. Popiš situaci pomocí imperfetta, přidej náhlou událost v passato prossimo a zakonči příběh slovy alla fine. Začni například Mentre aspettavo il treno…',practiceCafe:'Procvičit vyprávění',barista:'Anna',customer:'Marco'},
    en:{cafeTitle:'Narration and background',cafeTime:'Narration and background · B1 · about 7 minutes',cafeContext:'Anna tells Marco about a trip with friends. Rain, an arriving train and a seemingly missing phone: notice the difference between background details and events that move the story forward.',ruleText:'The imperfetto describes background, states or repeated past actions: aspettavamo = we were waiting, avevo = I had, di solito portavo = I usually used to carry. The passato prossimo presents completed events: ha iniziato a piovere = it started to rain, è arrivato = it arrived. Mentre aspettavamo, ha iniziato a piovere: it started raining while we were waiting. Mentre does not determine the tense by itself; the meaning of the actions matters. Accorgersi uses essere: Anna si è accorta, Marco si è accorto. All’improvviso = suddenly, comunque = anyway, alla fine = in the end.',completed:'Tell a short story in four sentences. Set the scene with the imperfetto, add a sudden event in the passato prossimo and finish with alla fine. Start with Mentre aspettavo il treno…',practiceCafe:'Practise storytelling',barista:'Anna',customer:'Marco'},
    it:{cafeTitle:'Racconto e contesto',cafeTime:'Racconto e contesto · B1 · circa 7 minuti',cafeContext:'Anna racconta a Marco una gita con gli amici.',ruleText:'L’imperfetto descrive lo sfondo, gli stati e le abitudini; il passato prossimo presenta gli eventi conclusi. Mentre non determina da solo il tempo verbale. Anna si è accorta; Marco si è accorto.',completed:'Racconta una breve storia usando mentre e alla fine.',practiceCafe:'Esercitati con il racconto',barista:'Anna',customer:'Marco'}
  };
  story.questions.push(
    grammar('racconto-waiting','Mentre ___ il treno, ha iniziato a piovere. (noi, aspettare)',['aspettavamo'],['aspettavamo','aspettiamo','aspetteremo','aspettare'],'Čekání tvoří pozadí: imperfetto aspettavamo.','Waiting forms the background: imperfetto aspettavamo.','L’attesa è lo sfondo: aspettavamo.'),
    grammar('racconto-event','Mentre bevevamo un caffè, il treno ___. (arrivare, passato prossimo)',['è arrivato'],['è arrivato','ha arrivato','è arrivata','arrivare'],'Arrivare používá essere; il treno je mužského rodu: è arrivato.','Arrivare uses essere; il treno is masculine: è arrivato.','Arrivare usa essere: il treno è arrivato.'),
    grammar('racconto-realised','Anna si è ___ che non aveva il telefono. (accorgersi)',['accorta'],['accorta','accorto','accorti','accorgere'],'S essere se příčestí shoduje s Annou: accorta.','With essere, the participle agrees with Anna: accorta.','Il participio concorda con Anna: accorta.'),
    grammar('racconto-state','Il telefono ___ nella tasca della giacca. (essere, imperfetto)',['era'],['era','ero','erano','essere'],'Popis stavu v minulosti: il telefono era.','A past state: il telefono era.','Uno stato nel passato: il telefono era.')
  );
  const plans=lessons.find(l=>l.id==='progetti');
  plans.goal=t('Navrhnu společný výlet, zdvořile požádám o pomoc a domluvím čas odjezdu.','Suggest a trip together, politely ask for help and agree on a departure time.','Proporre una gita, chiedere aiuto con cortesia e concordare la partenza.');
  plans.dialogue=[
    ['Anna, che programmi hai per domani?','Anno, jaké máš plány na zítřek?','Anna, what are your plans for tomorrow?'],
    ['Ho intenzione di visitare Lucca. Ti piacerebbe venire con me?','Mám v úmyslu navštívit Luccu. Chtěl bys jet se mnou?','I intend to visit Lucca. Would you like to come with me?'],
    ['Verrei volentieri! Potremmo prendere il treno.','Rád bych jel! Mohli bychom jet vlakem.','I would love to! We could take the train.'],
    ['Ottima idea. Potresti controllare gli orari?','Výborný nápad. Mohl bys zkontrolovat jízdní řád?','Great idea. Could you check the timetable?'],
    ['Certo. C’è un treno alle nove. Dovremmo comprare i biglietti prima.','Jistě. V devět jede vlak. Měli bychom si koupit jízdenky předem.','Of course. There is a train at nine. We should buy the tickets in advance.'],
    ['D’accordo. Li comprerò online stasera.','Dobře. Koupím je dnes večer online.','All right. I will buy them online this evening.'],
    ['Ti andrebbe di fare una passeggiata sulle mura?','Chtěla by ses projít po hradbách?','Would you like to take a walk on the city walls?'],
    ['Sì, volentieri. Magari potremmo anche visitare il centro.','Ano, ráda. Třeba bychom mohli navštívit i centrum.','Yes, gladly. Perhaps we could also visit the centre.'],
    ['Se piove, possiamo visitare un museo.','Jestli bude pršet, můžeme navštívit muzeum.','If it rains, we can visit a museum.'],
    ['Va bene. A che ora ci incontreremo?','Dobře. V kolik se sejdeme?','All right. What time will we meet?'],
    ['Ci incontreremo alle otto e mezza davanti alla stazione.','Sejdeme se v půl deváté před nádražím.','We will meet at half past eight in front of the station.'],
    ['Perfetto. Allora partiremo alle nove!','Výborně. Tak vyrazíme v devět!','Perfect. Then we will leave at nine!']
  ].map((row,i)=>({id:'progetti-'+String(i+1).padStart(2,'0'),role:i%2?'barista':'customer',it:row[0],translation:t(row[1],row[2],row[0])}));
  plans.guide={
    cs:{cafeTitle:'Plány a zdvořilé návrhy',cafeTime:'Plány a zdvořilé návrhy · B1 · asi 7 minut',cafeContext:'Anna a Marco plánují výlet do Luccy. Nejdřív si navrhují možnosti, potom se domluví na konkrétním čase. V rozhovoru si tykají.',ruleText:'Condizionale změkčuje návrh či prosbu: potremmo = mohli bychom, potresti = mohl/a bys, dovremmo = měli bychom. Při vykání jedné osobě použij potrebbe: Potrebbe aiutarmi? Ti piacerebbe…? a Ti andrebbe di…? nabízejí společnou aktivitu. Verrei volentieri = rád/a bych jel/a. Futuro semplice vyjadřuje budoucí děj: comprerò = koupím, ci incontreremo = sejdeme se, partiremo = vyrazíme. Ho intenzione di + infinitiv = mám v úmyslu. Magari zde znamená třeba / možná. V reálné podmínce lze použít přítomný čas: Se piove, possiamo visitare un museo.',completed:'Navrhni společný výlet pomocí Potremmo…, požádej kamaráda o pomoc pomocí Potresti… a domluv odjezd větou Partiremo alle… Potom změň prosbu na zdvořilé vykání s Potrebbe…',practiceCafe:'Procvičit plány a návrhy',barista:'Anna',customer:'Marco'},
    en:{cafeTitle:'Plans and polite suggestions',cafeTime:'Plans and polite suggestions · B1 · about 7 minutes',cafeContext:'Anna and Marco plan a trip to Lucca. First they suggest possibilities, then agree on a specific time. They address each other informally.',ruleText:'The conditional softens suggestions and requests: potremmo = we could, potresti = could you (informal), dovremmo = we should. Use potrebbe to address one person formally: Potrebbe aiutarmi? Ti piacerebbe…? and Ti andrebbe di…? suggest an activity together. Verrei volentieri = I would gladly come. The simple future expresses future actions: comprerò = I will buy, ci incontreremo = we will meet, partiremo = we will leave. Ho intenzione di + infinitive = I intend to. Magari here means perhaps. Real conditions can use the present tense: Se piove, possiamo visitare un museo.',completed:'Suggest a trip with Potremmo…, ask a friend for help with Potresti… and agree on departure with Partiremo alle… Then make the request formal using Potrebbe…',practiceCafe:'Practise plans and suggestions',barista:'Anna',customer:'Marco'},
    it:{cafeTitle:'Progetti e proposte',cafeTime:'Progetti e proposte · B1 · circa 7 minuti',cafeContext:'Anna e Marco organizzano una gita a Lucca e si danno del tu.',ruleText:'Il condizionale attenua proposte e richieste: potremmo, potresti, potrebbe. Il futuro esprime azioni future: comprerò, ci incontreremo, partiremo.',completed:'Proponi una gita, chiedi aiuto e concorda l’orario.',practiceCafe:'Esercitati con le proposte',barista:'Anna',customer:'Marco'}
  };
  plans.questions.push(
    grammar('progetti-request','___ controllare gli orari? (tu, potere, condizionale)',['Potresti'],['Potresti','Potrebbe','Potremmo','Potrebbero'],'Při tykání: potresti. Při vykání: potrebbe.','Informal tu: potresti. Formal Lei: potrebbe.','Con tu: potresti. Con Lei: potrebbe.'),
    grammar('progetti-suggestion','Noi ___ prendere il treno. (potere, condizionale)',['potremmo'],['potremmo','potrebbe','potresti','potrebbero'],'Návrh pro nás: potremmo = mohli bychom.','A suggestion for us: potremmo = we could.','Con noi: potremmo.'),
    grammar('progetti-future','Stasera io ___ i biglietti. (comprare, futuro semplice)',['comprerò'],['comprerò','comprerei','compravo','comprare'],'Budoucí čas slovesa comprare pro io: comprerò.','Simple future of comprare with io: comprerò.','Futuro semplice, io: comprerò.'),
    grammar('progetti-intention','Ho intenzione ___ visitare Lucca.',['di'],['di','a','da','per'],'Vazba avere intenzione di + infinitiv.','Use avere intenzione di + infinitive.','Avere intenzione di + infinito.')
  );
  const pronouns=lessons.find(l=>l.id==='pronomi');
  pronouns.goal=t('Nahradím už zmíněnou věc, množství nebo místo zájmeny lo, la, ne a ci.','Replace a previously mentioned object, quantity or place with lo, la, ne and ci.','Riprendere un oggetto, una quantità o un luogo con lo, la, ne e ci.');
  pronouns.dialogue=[
    ['Anna, hai il biglietto per il museo?','Anno, máš lístek do muzea?','Anna, do you have the museum ticket?'],
    ['No, lo compro alla cassa. E tu?','Ne, koupím ho u pokladny. A ty?','No, I’ll buy it at the ticket office. And you?'],
    ['Io ce l’ho già. Hai anche la mappa della città?','Já už ho mám. Máš i mapu města?','I already have it. Do you also have the city map?'],
    ['Sì, la porto nello zaino. Il museo è vicino alla stazione.','Ano, nesu ji v batohu. Muzeum je blízko nádraží.','Yes, I’m carrying it in my backpack. The museum is near the station.'],
    ['Vedi la stazione da qui?','Vidíš odtud nádraží?','Can you see the station from here?'],
    ['Sì, la vedo. Andiamo prima al bar?','Ano, vidím ho. Půjdeme nejdřív do kavárny?','Yes, I can see it. Shall we go to the café first?'],
    ['Volentieri, ci vado spesso. Vuoi un cornetto?','Rád, chodím tam často. Chceš croissant?','Gladly, I go there often. Would you like a croissant?'],
    ['Sì, ne prendo uno. E tu, quanti ne vuoi?','Ano, vezmu si jeden. A ty, kolik jich chceš?','Yes, I’ll have one. And you, how many do you want?'],
    ['Ne vorrei due. Poi andiamo al museo a piedi?','Chtěl bych dva. Pak půjdeme do muzea pěšky?','I would like two. Shall we then walk to the museum?'],
    ['Sì, ci andiamo a piedi. Sono solo dieci minuti.','Ano, půjdeme tam pěšky. Je to jen deset minut.','Yes, we’ll walk there. It’s only ten minutes.'],
    ['Con questo zaino pesante non è facile, ma ce la faccio!','S tímhle těžkým batohem to není snadné, ale zvládnu to!','With this heavy backpack it isn’t easy, but I can manage!'],
    ['Dopo il museo me ne vado in albergo. Ci vediamo stasera!','Po muzeu odejdu do hotelu. Uvidíme se večer!','After the museum I’m heading back to the hotel. See you this evening!']
  ].map((row,i)=>({id:'pronomi-'+String(i+1).padStart(2,'0'),role:i%2?'barista':'customer',it:row[0],translation:t(row[1],row[2],row[0])}));
  pronouns.guide={
    cs:{cafeTitle:'Zájmena lo, la, ne, ci',cafeTime:'Zájmena lo, la, ne, ci · B1 · asi 7 minut',cafeContext:'Anna a Marco míří do muzea a cestou se zastaví v kavárně. Sleduj, co nahrazují krátká slova před slovesem: lístek, mapu, nádraží, croissanty nebo místo.',ruleText:'Lo nahrazuje přímý předmět mužského rodu: il biglietto → lo compro. La nahrazuje ženský rod: la mappa → la porto, la stazione → la vedo. Řiď se italským rodem: nádraží je česky středního rodu, ale la stazione je italsky ženského rodu. Ne vyjadřuje množství z už zmíněné věci: i cornetti → ne prendo uno / ne vorrei due. Ci zde nahrazuje místo: al bar → ci vado, al museo → ci andiamo. Před časovaným slovesem stojí lo, la, ne, ci. Výrazy ce l’ho = mám ho/ji/to, ce la faccio = zvládnu to a me ne vado = odcházím se uč jako celky. V ci vediamo znamená ci vzájemnost: uvidíme se, nikoli tam.',completed:'Odpověz bez opakování podstatného jména: Compri il biglietto? Porti la mappa? Quanti cornetti vuoi? Vai al museo? Použij postupně lo, la, ne a ci. Potom řekni vlastní větu s ce la faccio.',practiceCafe:'Procvičit zájmena',barista:'Anna',customer:'Marco'},
    en:{cafeTitle:'Pronouns lo, la, ne, ci',cafeTime:'Pronouns lo, la, ne, ci · B1 · about 7 minutes',cafeContext:'Anna and Marco are going to a museum and stop at a café on the way. Follow what the short words before the verb refer to: a ticket, a map, the station, croissants or a place.',ruleText:'Lo replaces a masculine direct object: il biglietto → lo compro. La replaces a feminine one: la mappa → la porto, la stazione → la vedo. Follow the Italian noun’s gender. Ne expresses a quantity of something already mentioned: i cornetti → ne prendo uno / ne vorrei due. Ci here replaces a place: al bar → ci vado, al museo → ci andiamo. Lo, la, ne and ci go before the conjugated verb in these examples. Learn ce l’ho = I have it, ce la faccio = I can manage and me ne vado = I am leaving as complete expressions. In ci vediamo, ci is reciprocal: we see each other, not there.',completed:'Answer without repeating the noun: Compri il biglietto? Porti la mappa? Quanti cornetti vuoi? Vai al museo? Use lo, la, ne and ci respectively. Then make your own sentence with ce la faccio.',practiceCafe:'Practise pronouns',barista:'Anna',customer:'Marco'},
    it:{cafeTitle:'Pronomi lo, la, ne, ci',cafeTime:'Pronomi · B1 · circa 7 minuti',cafeContext:'Anna e Marco vanno al museo passando dal bar.',ruleText:'Lo e la riprendono un oggetto diretto. Ne indica una quantità; ci può riprendere un luogo. In ci vediamo, ci è reciproco. Impara ce la faccio e me ne vado come espressioni complete.',completed:'Rispondi usando lo, la, ne e ci.',practiceCafe:'Esercitati con i pronomi',barista:'Anna',customer:'Marco'}
  };
  pronouns.questions.push(
    grammar('pronomi-ticket','Il biglietto? ___ compro alla cassa.',['Lo'],['Lo','La','Ne','Ci'],'Il biglietto je mužského rodu: lo.','Il biglietto is masculine: lo.','Il biglietto è maschile: lo.'),
    grammar('pronomi-map','La mappa? ___ porto nello zaino.',['La'],['La','Lo','Ne','Ci'],'La mappa je ženského rodu: la.','La mappa is feminine: la.','La mappa è femminile: la.'),
    grammar('pronomi-quantity','Quanti cornetti vuoi? ___ vorrei due.',['Ne'],['Ne','Ci','Lo','La'],'Ne zastupuje cornetti ve spojení s množstvím due.','Ne refers to cornetti with the quantity due.','Ne riprende i cornetti con la quantità due.'),
    grammar('pronomi-place','Andate al museo? Sì, ___ andiamo a piedi.',['ci'],['ci','ne','lo','la'],'Ci zde nahrazuje al museo.','Ci replaces al museo here.','Ci sostituisce al museo.')
  );
  const opinions=lessons.find(l=>l.id==='opinioni');
  opinions.goal=t('Vyjádřím názor, uvedu výhodu i námitku a navrhnu společný závěr.','Express an opinion, give an advantage and a counterargument, and propose a shared conclusion.','Esprimere un’opinione, valutare vantaggi e obiezioni e proporre una conclusione comune.');
  opinions.dialogue=[
    ['Anna, secondo te dovremmo visitare il centro con una guida?','Anno, myslíš, že bychom měli navštívit centrum s průvodcem?','Anna, do you think we should visit the centre with a guide?'],
    ['A mio avviso, è una buona idea. Penso che una guida possa aiutarci a capire meglio la storia della città.','Podle mého názoru je to dobrý nápad. Myslím, že nám průvodce může pomoci lépe pochopit historii města.','In my opinion, it is a good idea. I think a guide can help us understand the city’s history better.'],
    ['Sono d’accordo. Un vantaggio è poter fare domande; tuttavia, la visita costa più di una passeggiata da soli.','Souhlasím. Výhodou je možnost klást otázky; nicméně prohlídka stojí víc než samostatná procházka.','I agree. One advantage is being able to ask questions; however, the tour costs more than walking around on our own.'],
    ['È vero. Benché il prezzo sia più alto, credo che ne valga la pena.','To je pravda. Přestože je cena vyšší, myslím, že to stojí za to.','That’s true. Although the price is higher, I think it is worth it.'],
    ['Uno svantaggio è l’orario fisso. Preferirei fermarmi quando voglio.','Nevýhodou je pevně daný čas. Raději bych se zastavil, kdy chci.','One disadvantage is the fixed schedule. I would prefer to stop whenever I want.'],
    ['Capisco il tuo punto di vista. Potremmo scegliere una visita breve e poi continuare da soli.','Chápu tvůj pohled. Mohli bychom zvolit krátkou prohlídku a pak pokračovat sami.','I understand your point of view. We could choose a short tour and then continue on our own.'],
    ['Mi sembra un buon compromesso. Credi che ci siano ancora posti?','To mi připadá jako dobrý kompromis. Myslíš, že jsou ještě volná místa?','That seems like a good compromise. Do you think there are still places available?'],
    ['Il sito indica quattro posti disponibili; pertanto possiamo ancora prenotare.','Web uvádí čtyři volná místa, tudíž si ještě můžeme udělat rezervaci.','The website shows four places available; therefore, we can still book.'],
    ['E se piove? Preferirei non passare tutta la mattina fuori.','A co když bude pršet? Raději bych nestrávil celé dopoledne venku.','What if it rains? I would rather not spend the whole morning outside.'],
    ['Nonostante la pioggia prevista, vorrei partecipare. Ma prima controlliamo le condizioni della visita.','Navzdory předpovědi deště bych se chtěla zúčastnit. Ale nejdřív zkontrolujme podmínky prohlídky.','Despite the forecast rain, I would like to take part. But let’s check the tour conditions first.'],
    ['D’accordo. Per me è importante che il gruppo sia piccolo.','Dobře. Pro mě je důležité, aby skupina byla malá.','All right. It is important to me that the group is small.'],
    ['Anche per me. In conclusione, scegliamo una visita breve in un piccolo gruppo, se troviamo un’offerta adatta.','Pro mě také. Závěrem tedy zvolme krátkou prohlídku v malé skupině, pokud najdeme vhodnou nabídku.','For me too. In conclusion, let’s choose a short tour in a small group if we find a suitable option.']
  ].map((row,i)=>({id:'opinioni-'+String(i+1).padStart(2,'0'),role:i%2?'barista':'customer',it:row[0],translation:t(row[1],row[2],row[0])}));
  opinions.guide={
    cs:{cafeTitle:'Názory a argumentace',cafeTime:'Názory a argumentace · B2 · asi 8 minut',cafeContext:'Anna a Marco zvažují prohlídku města s průvodcem. Oba uvádějí důvody, reagují na námitky a hledají kompromis. Údaje o nabídce jsou součástí modelového rozhovoru.',ruleText:'A mio avviso a secondo me uvádějí názor. Un vantaggio / uno svantaggio pojmenují výhodu a nevýhodu. Tuttavia uvádí kontrast, pertanto důsledek; pertanto zní formálněji než quindi. Ve standardní italštině zde po penso che a credo che procvičujeme congiuntivo: possa, valga; po è importante che: sia. Benché + congiuntivo: benché il prezzo sia più alto. Nonostante + podstatné jméno: nonostante la pioggia; se slovesnou větou se běžně pojí s congiuntivem. Capisco il tuo punto di vista uznává pohled druhého, aniž musíš se vším souhlasit. In conclusione uvádí závěr.',completed:'Zvol si mezi prohlídkou s průvodcem a samostatnou návštěvou. Vyjádři názor pomocí A mio avviso…, uveď jednu výhodu, přidej námitku s tuttavia a závěr s pertanto nebo in conclusione. Použij také Penso che sia…',practiceCafe:'Procvičit argumentaci',barista:'Anna',customer:'Marco'},
    en:{cafeTitle:'Opinions and arguments',cafeTime:'Opinions and arguments · B2 · about 8 minutes',cafeContext:'Anna and Marco consider a guided city tour. They give reasons, respond to objections and seek a compromise. The offer details belong to this fictional conversation.',ruleText:'A mio avviso and secondo me introduce opinions. Un vantaggio / uno svantaggio name an advantage and a disadvantage. Tuttavia marks contrast, pertanto a consequence; pertanto sounds more formal than quindi. Here we practise the standard subjunctive after penso che and credo che: possa, valga; after è importante che: sia. Benché + subjunctive: benché il prezzo sia più alto. Nonostante + noun: nonostante la pioggia; with a finite clause it commonly takes the subjunctive. Capisco il tuo punto di vista acknowledges another view without requiring complete agreement. In conclusione introduces a conclusion.',completed:'Choose between a guided tour and visiting independently. State your opinion with A mio avviso…, give one advantage, add an objection with tuttavia and conclude with pertanto or in conclusione. Also use Penso che sia…',practiceCafe:'Practise argumentation',barista:'Anna',customer:'Marco'},
    it:{cafeTitle:'Opinioni e argomenti',cafeTime:'Opinioni e argomenti · B2 · circa 8 minuti',cafeContext:'Anna e Marco valutano una visita guidata e cercano un compromesso. I dettagli dell’offerta sono inventati.',ruleText:'Tuttavia introduce un contrasto; pertanto una conseguenza. Penso che sia; credo che valga; benché il prezzo sia alto. Nonostante la pioggia: nonostante seguito da un nome.',completed:'Esprimi un’opinione, un vantaggio, un’obiezione e una conclusione.',practiceCafe:'Esercitati con gli argomenti',barista:'Anna',customer:'Marco'}
  };
  opinions.questions.push(
    grammar('opinioni-ability','Penso che una guida ___ aiutarci. (potere, congiuntivo presente)',['possa'],['possa','può','potrà','potere'],'Congiuntivo presente slovesa potere v jednotném čísle: possa.','Present subjunctive of potere in the singular: possa.','Congiuntivo presente singolare di potere: possa.'),
    grammar('opinioni-group','È importante che il gruppo ___ piccolo. (essere, congiuntivo presente)',['sia'],['sia','è','essere','sarà'],'Po è importante che zde používáme congiuntivo: sia.','After è importante che we use the subjunctive here: sia.','Dopo è importante che si usa qui il congiuntivo: sia.'),
    grammar('opinioni-contrast','La visita è interessante; ___ costa molto. (contrasto)',['tuttavia'],['tuttavia','pertanto','quindi','perciò'],'Tuttavia uvádí kontrast: nicméně.','Tuttavia introduces contrast: however.','Tuttavia introduce un contrasto.'),
    grammar('opinioni-result','Ci sono posti disponibili; ___ possiamo prenotare. (conseguenza)',['pertanto'],['pertanto','tuttavia','benché','nonostante'],'Pertanto uvádí důsledek: tudíž.','Pertanto introduces a consequence: therefore.','Pertanto introduce una conseguenza.')
  );
  const conditions=lessons.find(l=>l.id==='ipotesi');
  conditions.goal=t('Vyjádřím hypotetické přání, podmínku účasti a náhradní plán.','Express a hypothetical wish, a condition for taking part and a backup plan.','Esprimere un desiderio ipotetico, una condizione e un piano alternativo.');
  conditions.dialogue=[
    ['Anna, se avessi un giorno libero in più, che cosa faresti?','Anno, kdybys měla ještě jeden volný den, co bys dělala?','Anna, if you had one more day off, what would you do?'],
    ['Se avessi più tempo, visiterei un’isola. E tu?','Kdybych měla víc času, navštívila bych nějaký ostrov. A ty?','If I had more time, I would visit an island. And you?'],
    ['Io farei una gita in barca, purché il mare sia calmo.','Já bych podnikl výlet lodí, pokud by moře bylo klidné.','I would take a boat trip, provided the sea is calm.'],
    ['Verrei con te a condizione che ci siano posti a sedere al coperto.','Jela bych s tebou pod podmínkou, že budou místa k sezení pod střechou.','I would come with you on condition that there are covered seats.'],
    ['Certo. Nel caso in cui il tempo cambi, potremmo visitare un museo.','Jistě. V případě, že se počasí změní, mohli bychom navštívit muzeum.','Of course. In case the weather changes, we could visit a museum.'],
    ['Mi sembra una buona alternativa. Non vorrei rinunciare alla giornata insieme.','To mi připadá jako dobrá alternativa. Nechtěla bych se vzdát společného dne.','That seems like a good alternative. I would not want to give up our day together.'],
    ['Se fossi in te, controllerei prima gli orari dei battelli.','Být tebou, nejdřív bych zkontroloval jízdní řád lodí.','If I were you, I would check the boat timetable first.'],
    ['Hai ragione. Se partissimo presto, avremmo più tempo sull’isola.','Máš pravdu. Kdybychom vyrazili brzy, měli bychom na ostrově víc času.','You’re right. If we left early, we would have more time on the island.'],
    ['Dovremmo prenotare oggi, altrimenti rischieremmo di non trovare posto.','Měli bychom rezervovat dnes, jinak bychom riskovali, že nenajdeme místo.','We should book today; otherwise, we would risk not finding a place.'],
    ['Prima leggiamo le condizioni di cancellazione. Se fossero troppo rigide, sceglierei un’altra offerta.','Nejdřív si přečtěme podmínky zrušení. Kdyby byly příliš přísné, vybrala bych jinou nabídku.','Let’s read the cancellation terms first. If they were too strict, I would choose another offer.'],
    ['Sono d’accordo. Vale la pena confrontare le possibilità.','Souhlasím. Stojí za to porovnat možnosti.','I agree. It is worth comparing the options.'],
    ['Allora controlliamo tutto e decidiamo. Se troviamo una buona offerta, prenotiamo!','Tak všechno zkontrolujme a rozhodněme se. Jestli najdeme dobrou nabídku, rezervujeme!','Then let’s check everything and decide. If we find a good offer, we’ll book!']
  ].map((row,i)=>({id:'ipotesi-'+String(i+1).padStart(2,'0'),role:i%2?'barista':'customer',it:row[0],translation:t(row[1],row[2],row[0])}));
  conditions.guide={
    cs:{cafeTitle:'Hypotézy a podmínky',cafeTime:'Hypotézy a podmínky · B2 · asi 8 minut',cafeContext:'Anna a Marco uvažují o výletu na ostrov. Rozlišuj představu „kdybych měl více času“ od konkrétní podmínky, za které se výlet uskuteční. Nabídka ani jízdní řád nejsou skutečná cestovní doporučení.',ruleText:'Hypotéza pro přítomnost nebo budoucnost: se + congiuntivo imperfetto, potom condizionale presente. Se avessi tempo, visiterei un’isola = kdybych měl/a čas, navštívil/a bych ostrov. Se fossi in te, controllerei… = být tebou, zkontroloval/a bych… V této konstrukci neříkej se avrei. Purché a a condizione che uvádějí podmínku s congiuntivem: purché il mare sia calmo, a condizione che ci siano posti. Nel caso in cui il tempo cambi = v případě změny počasí; cambi je zde congiuntivo presente. Reálná podmínka může mít přítomný čas: se troviamo una buona offerta, prenotiamo. Altrimenti = jinak; rinunciare a = vzdát se; vale la pena + infinitiv = stojí za to.',completed:'Řekni, co bys dělal/a s jedním dnem volna navíc: Se avessi…, farei… Přidej podmínku s purché a náhradní plán s nel caso in cui. Nakonec dej kamarádovi radu: Se fossi in te…',practiceCafe:'Procvičit hypotézy',barista:'Anna',customer:'Marco'},
    en:{cafeTitle:'Hypotheses and conditions',cafeTime:'Hypotheses and conditions · B2 · about 8 minutes',cafeContext:'Anna and Marco consider an island trip. Distinguish an imagined situation such as having more time from a specific condition for taking part. The offer and timetable are fictional.',ruleText:'A present or future hypothesis uses se + imperfect subjunctive, followed by the present conditional. Se avessi tempo, visiterei un’isola = if I had time, I would visit an island. Se fossi in te, controllerei… = if I were you, I would check… Do not use se avrei in this construction. Purché and a condizione che introduce conditions with the subjunctive: purché il mare sia calmo, a condizione che ci siano posti. Nel caso in cui il tempo cambi = in case the weather changes; cambi is present subjunctive here. A real condition can use the present tense: se troviamo una buona offerta, prenotiamo. Altrimenti = otherwise; rinunciare a = give up; vale la pena + infinitive = it is worth doing.',completed:'Say what you would do with an extra day off: Se avessi…, farei… Add a condition with purché and a backup plan with nel caso in cui. Finally advise a friend: Se fossi in te…',practiceCafe:'Practise hypotheses',barista:'Anna',customer:'Marco'},
    it:{cafeTitle:'Ipotesi e condizioni',cafeTime:'Ipotesi e condizioni · B2 · circa 8 minuti',cafeContext:'Anna e Marco immaginano una gita e valutano condizioni e alternative.',ruleText:'Se avessi tempo, visiterei un’isola: congiuntivo imperfetto e condizionale presente. Purché il mare sia calmo: congiuntivo presente. Se troviamo un’offerta, prenotiamo: condizione reale.',completed:'Esprimi un’ipotesi, una condizione e un’alternativa.',practiceCafe:'Esercitati con le ipotesi',barista:'Anna',customer:'Marco'}
  };
  conditions.questions.push(
    grammar('ipotesi-departure','Se ___ presto, avremmo più tempo. (noi, partire, congiuntivo imperfetto)',['partissimo'],['partissimo','partiremmo','partiremo','partiamo'],'V této hypotéze po se: congiuntivo imperfetto partissimo.','This hypothesis uses the imperfect subjunctive after se: partissimo.','Nell’ipotesi: se partissimo.'),
    grammar('ipotesi-sea','Vengo purché il mare ___ calmo. (essere, congiuntivo presente)',['sia'],['sia','è','sarà','essere'],'Purché vyžaduje congiuntivo: sia.','Purché takes the subjunctive: sia.','Purché richiede il congiuntivo: sia.'),
    grammar('ipotesi-result','Se avessi un giorno libero, ___ una gita. (io, fare, condizionale presente)',['farei'],['farei','facessi','farò','faccio'],'Výsledek hypotézy vyjádří condizionale presente: farei.','The hypothetical result uses the present conditional: farei.','La conseguenza ipotetica: farei.'),
    grammar('ipotesi-weather','Nel caso in cui il tempo ___, visitiamo un museo. (cambiare, congiuntivo presente)',['cambi'],['cambi','cambia','cambierà','cambiare'],'Po nel caso in cui zde procvičujeme congiuntivo presente: cambi.','Here we practise the present subjunctive after nel caso in cui: cambi.','Qui si usa il congiuntivo presente: cambi.')
  );
  const formal=lessons.find(l=>l.id==='registro');
  formal.goal=t('Zdvořile požádám o upřesnění, ověřím přijetí dokumentu a napíšu krátký formální e-mail.','Politely request clarification, check that a document was received and write a short formal email.','Chiedere un chiarimento, verificare la ricezione di un documento e scrivere una breve e-mail formale.');
  formal.dialogue=[
    ['Buongiorno, ufficio prenotazioni. Sono Marco Rossi, come posso aiutarLa?','Dobrý den, rezervační oddělení. Jsem Marco Rossi, jak Vám mohu pomoci?','Good morning, reservations office. Marco Rossi speaking, how may I help you?'],
    ['Buongiorno, sono Anna Novák. La contatto per una richiesta di prenotazione inviata ieri.','Dobrý den, jsem Anna Novák. Obracím se na Vás ohledně žádosti o rezervaci odeslané včera.','Good morning, I am Anna Novák. I am contacting you about a booking request sent yesterday.'],
    ['Certamente, signora Novák. Mi può indicare il numero della richiesta?','Samozřejmě, paní Novák. Můžete mi sdělit číslo žádosti?','Of course, Ms Novák. Could you give me the request number?'],
    ['È il numero ventiquattro. Avrei bisogno di un chiarimento sulle modalità di pagamento.','Je to číslo dvacet čtyři. Potřebovala bych upřesnit způsob platby.','It is number twenty-four. I would like some clarification about the payment method.'],
    ['Le invio le informazioni via e-mail. Ha già ricevuto il modulo?','Pošlu Vám informace e-mailem. Obdržela jste již formulář?','I will send you the information by email. Have you already received the form?'],
    ['Sì, grazie. L’ho compilato e inviato in allegato. Potrebbe confermarmi di averlo ricevuto?','Ano, děkuji. Vyplnila jsem ho a poslala v příloze. Mohl byste mi potvrdit jeho přijetí?','Yes, thank you. I completed it and sent it as an attachment. Could you confirm that you have received it?'],
    ['Controllo subito. Sì, il documento è stato ricevuto ieri.','Hned to zkontroluji. Ano, dokument byl přijat včera.','I will check now. Yes, the document was received yesterday.'],
    ['La ringrazio. Sarebbe possibile ricevere una conferma scritta?','Děkuji Vám. Bylo by možné obdržet písemné potvrzení?','Thank you. Would it be possible to receive written confirmation?'],
    ['Certamente. Le risponderò entro domani.','Samozřejmě. Odpovím Vám nejpozději zítra.','Of course. I will reply by tomorrow.'],
    ['Perfetto. Resto in attesa di un Suo riscontro.','Výborně. Očekávám Vaši odpověď.','Perfect. I look forward to your response.'],
    ['Ha altre domande, signora Novák?','Máte další otázky, paní Novák?','Do you have any other questions, Ms Novák?'],
    ['No, grazie. La ringrazio per la disponibilità. Arrivederci.','Ne, děkuji. Děkuji Vám za ochotu. Na shledanou.','No, thank you. Thank you for your assistance. Goodbye.']
  ].map((row,i)=>({id:'registro-'+String(i+1).padStart(2,'0'),role:i%2?'barista':'customer',it:row[0],translation:t(row[1],row[2],row[0])}));
  formal.guide={
    cs:{cafeTitle:'Formální komunikace',cafeTime:'Formální komunikace · B2 · asi 8 minut',cafeContext:'Anna telefonuje do rezervačního oddělení a ověřuje přijetí formuláře. S Marcem si vykají. Po poslechu si zkus stejnou žádost napsat e-mailem.',ruleText:'Při vykání jedné osobě používáme Lei a sloveso ve 3. osobě: Ha ricevuto…? Přímý předmět je La: La ringrazio = děkuji Vám. Nepřímý předmět je Le: Le invio = posílám Vám. Velké písmeno v La, Le a Suo je zdvořilostní písemná konvence, malé písmeno je také možné. Avrei bisogno di… a Sarebbe possibile…? změkčují žádost. Il documento è stato ricevuto je trpný rod; příčestí se shoduje s dokumentem. V e-mailu použij oslovení Gentile signora / Gentile signor + příjmení a zakončení Cordiali saluti. Při telefonování jsou přirozené Buongiorno a Arrivederci. Entro domani = nejpozději zítra.',completed:'Napiš krátký e-mail: Gentile signor Rossi, Le scrivo per chiedere conferma della ricezione del modulo. Trova il documento in allegato. La ringrazio per la disponibilità. Cordiali saluti, Anna Novák. Potom uprav oslovení, dokument a podpis podle sebe.',practiceCafe:'Procvičit formální komunikaci',barista:'Anna · zákaznice',customer:'Marco · rezervace'},
    en:{cafeTitle:'Formal communication',cafeTime:'Formal communication · B2 · about 8 minutes',cafeContext:'Anna calls the reservations office to check that her form was received. She and Marco use formal address. After listening, try writing the same request as an email.',ruleText:'To address one person formally, use Lei and a third-person verb: Ha ricevuto…? The direct object is La: La ringrazio = thank you. The indirect object is Le: Le invio = I am sending you. Capitalising La, Le and Suo is a written courtesy convention; lower case is also possible. Avrei bisogno di… and Sarebbe possibile…? soften requests. Il documento è stato ricevuto is passive; the participle agrees with the document. In an email use Gentile signora / Gentile signor + surname and close with Cordiali saluti. On the phone Buongiorno and Arrivederci are natural. Entro domani = by tomorrow.',completed:'Write a short email: Gentile signor Rossi, Le scrivo per chiedere conferma della ricezione del modulo. Trova il documento in allegato. La ringrazio per la disponibilità. Cordiali saluti, Anna Novák. Then adapt the greeting, document and signature to your own situation.',practiceCafe:'Practise formal communication',barista:'Anna · customer',customer:'Marco · reservations'},
    it:{cafeTitle:'Comunicazione formale',cafeTime:'Comunicazione formale · B2 · circa 8 minuti',cafeContext:'Anna chiama l’ufficio prenotazioni e usa il Lei.',ruleText:'La ringrazio: oggetto diretto. Le invio: oggetto indiretto. Avrei bisogno e sarebbe possibile attenuano le richieste. Gentile e Cordiali saluti si usano nelle e-mail; Buongiorno e Arrivederci al telefono.',completed:'Scrivi un’e-mail per chiedere conferma della ricezione di un documento, con apertura, richiesta, ringraziamento e firma.',practiceCafe:'Esercitati con il registro formale',barista:'Anna · cliente',customer:'Marco · prenotazioni'}
  };
  formal.questions.push(
    grammar('registro-indirect','___ invio il documento. (a Lei, oggetto indiretto)',['Le'],['Le','La','Lo','Ti'],'Posílám komu? Vám: nepřímý předmět Le.','Sending to whom? To you formally: indirect object Le.','A Lei: pronome indiretto Le.'),
    grammar('registro-request','___ bisogno di un chiarimento. (io, avere, condizionale presente)',['Avrei'],['Avrei','Avessi','Avrò','Avere'],'Zdvořilá žádost používá condizionale: avrei bisogno.','A polite request uses the conditional: avrei bisogno.','Richiesta cortese al condizionale: avrei bisogno.'),
    grammar('registro-passive','La richiesta è stata ___ ieri. (ricevere)',['ricevuta'],['ricevuta','ricevuto','ricevuti','ricevere'],'Příčestí se shoduje s ženským rodem la richiesta: ricevuta.','The participle agrees with feminine la richiesta: ricevuta.','Il participio concorda con la richiesta: ricevuta.'),
    grammar('registro-attachment','Trova il modulo ___ allegato.',['in'],['in','a','da','su'],'Ustálená vazba je in allegato = v příloze.','The fixed phrase is in allegato = attached.','La locuzione è in allegato.')
  );
  const audioFiles = {};
  for(const w of formal.words){audioFiles[w.italian]='registro-'+w.id+'-word.mp3';audioFiles[w.example]='registro-'+w.id+'-example.mp3';}
  for(const line of formal.dialogue)audioFiles[line.it]=line.id+'.mp3';
  for(const w of conditions.words){audioFiles[w.italian]='ipotesi-'+w.id+'-word.mp3';audioFiles[w.example]='ipotesi-'+w.id+'-example.mp3';}
  for(const line of conditions.dialogue)audioFiles[line.it]=line.id+'.mp3';
  for(const w of opinions.words){audioFiles[w.italian]='opinioni-'+w.id+'-word.mp3';audioFiles[w.example]='opinioni-'+w.id+'-example.mp3';}
  for(const line of opinions.dialogue)audioFiles[line.it]=line.id+'.mp3';
  for(const w of pronouns.words){audioFiles[w.italian]='pronomi-'+w.id+'-word.mp3';audioFiles[w.example]='pronomi-'+w.id+'-example.mp3';}
  for(const line of pronouns.dialogue)audioFiles[line.it]=line.id+'.mp3';
  for(const w of plans.words){audioFiles[w.italian]='progetti-'+w.id+'-word.mp3';audioFiles[w.example]='progetti-'+w.id+'-example.mp3';}
  for(const line of plans.dialogue)audioFiles[line.it]=line.id+'.mp3';
  for(const w of story.words){audioFiles[w.italian]='racconto-'+w.id+'-word.mp3';audioFiles[w.example]='racconto-'+w.id+'-example.mp3';}
  for(const line of story.dialogue)audioFiles[line.it]=line.id+'.mp3';
  for(const w of yesterday.words){audioFiles[w.italian]='passato-'+w.id+'-word.mp3';audioFiles[w.example]='passato-'+w.id+'-example.mp3';}
  for(const line of yesterday.dialogue)audioFiles[line.it]=line.id+'.mp3';
  for(const w of greetings.words){audioFiles[w.italian]='saluti-'+w.id+'-word.mp3';audioFiles[w.example]='saluti-'+w.id+'-example.mp3';}
  for(const line of greetings.dialogue)audioFiles[line.it]=line.id+'.mp3';
  for(const w of city.words){audioFiles[w.italian]='citta-'+w.id+'-word.mp3';audioFiles[w.example]='citta-'+w.id+'-example.mp3';}
  for(const line of city.dialogue)audioFiles[line.it]=line.id+'.mp3';
  for(const w of hotel.words){audioFiles[w.italian]='hotel-'+w.id+'-word.mp3';audioFiles[w.example]='hotel-'+w.id+'-example.mp3';}
  for(const line of hotel.dialogue)audioFiles[line.it]=line.id+'.mp3';
  for(const w of restaurant.words){audioFiles[w.italian]='ristorante-'+w.id+'-word.mp3';audioFiles[w.example]='ristorante-'+w.id+'-example.mp3';}
  for(const line of restaurant.dialogue)audioFiles[line.it]=line.id+'.mp3';
  for (const w of cafe.words) {
    audioFiles[w.italian] = 'bar-'+w.id+'-word.mp3';
    audioFiles[w.example] = 'bar-'+w.id+'-example.mp3';
  }
  for (const line of cafe.dialogue) audioFiles[line.it] = line.id+'.mp3';
  const lessonIllustrations=Object.fromEntries(lessons.map(l=>[l.id,{file:l.id+'.webp',kind:'ai',generator:'OpenAI image generation',created:'2026-10-15'}]));
  // Explicit noun phrases: lo/la in pronoun lessons must not be treated as articles.
  const articleWords=new Set('caffe conto cornetto spremuta pane latte gelato stazione biglietto autobus farmacia museo prenotazione camera colazione chiave asciugamano partenza valigia letto doccia menu allergia verdure pasta pizza pesce settimana viaggio passeggiata appuntamento vantaggio svantaggio riscontro chiarimento disponibilita'.split(' '));
  for(const lesson of lessons)for(const word of lesson.words)if(articleWords.has(word.id))word.article=word.italian.match(/^(un’|l’|uno|una|un|gli|il|lo|la|le|i)(?:\s|(?<=’))/u)[1];
  // Both spellings are valid: https://www.treccani.it/vocabolario/menu/
  restaurant.words.find(w=>w.id==='menu').writingVariants=['il menu'];
  // Communicative situations, intentionally not sentence translations.
  const roleSituations={
  "saluti": [
    {
      "cs": "Seznamujete se. Zahaj rozhovor a zjisti jméno druhého.",
      "en": "You are meeting someone. Start the conversation and ask their name."
    },
    {
      "cs": "Nová známá se představila. Představ se také a reaguj přátelsky.",
      "en": "Your new acquaintance introduced herself. Introduce yourself and respond warmly."
    },
    {
      "cs": "Už znáš jméno. Zajímej se, jak se druhému daří.",
      "en": "You know their name. Ask how they are doing."
    },
    {
      "cs": "Odpověz na otázku, jak se máš, a projev stejný zájem.",
      "en": "Respond about how you are and return the interest."
    },
    {
      "cs": "Rozhovor pokračuje. Přejdi od nálady k tomu, odkud pocházíte.",
      "en": "Move the conversation from how you feel to where you are from."
    },
    {
      "cs": "Představ svůj původ a zjisti důvod návštěvy.",
      "en": "Mention your origins and ask why the visitor is here."
    },
    {
      "cs": "Vysvětli účel návštěvy a svou zkušenost s italštinou.",
      "en": "Explain why you are visiting and your experience with Italian."
    },
    {
      "cs": "Povzbuď člověka, který se učí tvůj jazyk.",
      "en": "Encourage someone learning your language."
    },
    {
      "cs": "Setkání končí. Poděkuj a přátelsky se rozluč.",
      "en": "The meeting is ending. Thank them and say a friendly goodbye."
    },
    {
      "cs": "Reaguj na rozloučení a popřej něco milého.",
      "en": "Respond to the goodbye with a friendly wish."
    }
  ],
  "bar": [
    {
      "cs": "Jsi obsluha. Přivítej příchozího a zahaj objednávku.",
      "en": "You are the barista. Welcome the customer and take their order."
    },
    {
      "cs": "Chceš malou snídani: kávu a něco sladkého. Objednej zdvořile.",
      "en": "You want a small breakfast: coffee and a pastry. Order politely."
    },
    {
      "cs": "Objednávku znáš. Zjisti, kde bude zákazník konzumovat.",
      "en": "You have the order. Ask where the customer will have it."
    },
    {
      "cs": "Vyber místo u baru a doplň objednávku o vodu.",
      "en": "Choose to stay at the counter and add water to your order."
    },
    {
      "cs": "Objednávka je připravená. Předej ji zákazníkovi.",
      "en": "The order is ready. Serve it to the customer."
    },
    {
      "cs": "Dopil/a jsi a chceš odejít. Požádej o vyúčtování.",
      "en": "You have finished and want to leave. Ask for the bill."
    },
    {
      "cs": "Zákazník chce platit. Sděl modelovou cenu 4,50 €.",
      "en": "The customer wants to pay. Give the example price of €4.50."
    },
    {
      "cs": "Nemáš hotovost. Ověř možnost jiného způsobu platby.",
      "en": "You have no cash. Ask about another way to pay."
    }
  ],
  "citta": [
    {
      "cs": "Neznáš cestu na vlak. Oslov kolemjdoucího.",
      "en": "You do not know the way to catch your train. Approach a passer-by."
    },
    {
      "cs": "Vysvětli první úsek cesty k semaforu.",
      "en": "Explain the first part of the route to the traffic lights."
    },
    {
      "cs": "Prvnímu úseku rozumíš. Zjisti, jak cesta pokračuje.",
      "en": "You understand the first part. Ask what comes next."
    },
    {
      "cs": "Doplň odbočení u semaforu a polohu cíle.",
      "en": "Explain the turn at the lights and where the destination is."
    },
    {
      "cs": "Rozhoduješ se, zda jít pěšky. Zeptej se na vzdálenost.",
      "en": "You are deciding whether to walk. Ask about the distance."
    },
    {
      "cs": "Uklidni návštěvníka a odhadni dobu chůze.",
      "en": "Reassure the visitor and estimate the walking time."
    },
    {
      "cs": "Pokyny zazněly příliš rychle. Požádej o pomoc s porozuměním.",
      "en": "The directions were too fast. Ask for help understanding them."
    },
    {
      "cs": "Zopakuj hlavní směry klidněji a stručně.",
      "en": "Repeat the key directions more slowly and briefly."
    },
    {
      "cs": "Ověř vlastní porozumění pokynům a poděkuj.",
      "en": "Check that you understood the directions and thank the speaker."
    },
    {
      "cs": "Potvrď, že návštěvník cestu pochopil, a rozluč se.",
      "en": "Confirm that the visitor understood and say goodbye."
    }
  ],
  "hotel": [
    {
      "cs": "Příchozí host stojí na recepci. Zahaj přihlášení.",
      "en": "A guest has arrived at reception. Start the check-in."
    },
    {
      "cs": "Přihlašuješ se pod jménem Novák na dvě noci. Sděl údaje rezervace.",
      "en": "You are checking in as Novák for two nights. Give your booking details."
    },
    {
      "cs": "Potřebuješ ověřit totožnost hosta. Zdvořile požádej o doklady.",
      "en": "You need to verify the guest’s identity. Politely request identification."
    },
    {
      "cs": "Předej doklady a zjisti, zda pobyt zahrnuje ranní jídlo.",
      "en": "Hand over your documents and ask whether breakfast is included."
    },
    {
      "cs": "Vysvětli hostovi podmínky a čas snídaně.",
      "en": "Explain the breakfast arrangements and times to the guest."
    },
    {
      "cs": "Potřebuješ se připojit k internetu. Požádej o potřebný údaj.",
      "en": "You need internet access. Ask for the necessary information."
    },
    {
      "cs": "Ukaž hostovi údaje k připojení a předej přístup do pokoje.",
      "en": "Point out the connection details and give the guest room access."
    },
    {
      "cs": "Plánuješ den odjezdu. Zjisti termín uvolnění pokoje.",
      "en": "You are planning your departure day. Ask about check-out time."
    },
    {
      "cs": "Sděl hostovi nejzazší čas odhlášení.",
      "en": "Tell the guest the check-out deadline."
    },
    {
      "cs": "Odjíždíš až později. Domluv úschovu zavazadla.",
      "en": "You are leaving later in the day. Arrange luggage storage."
    },
    {
      "cs": "Potvrď možnost úschovy a přivítej hosta k pobytu.",
      "en": "Confirm luggage storage and wish the guest a pleasant stay."
    },
    {
      "cs": "Vše je vyřízené. Oceň pomoc recepce.",
      "en": "Everything is arranged. Thank reception for their help."
    }
  ],
  "ristorante": [
    {
      "cs": "Přivítej hosty a ověř, zda mají zamluvený stůl.",
      "en": "Welcome the guests and check whether they have booked."
    },
    {
      "cs": "Přišel/přišla jsi ve dvou pod jménem Novák. Uveď rezervaci.",
      "en": "You are a party of two booked as Novák. Give your reservation details."
    },
    {
      "cs": "Usaď hosty a umožni jim vybrat si jídlo.",
      "en": "Seat the guests and help them choose their meal."
    },
    {
      "cs": "Vybíráš jídlo a nemáš rád/a pálivé. Ověř si jeho chuť.",
      "en": "You are choosing a dish and dislike spicy food. Check what it is like."
    },
    {
      "cs": "Vysvětli chuť těstovin a přijmi objednávku.",
      "en": "Describe the pasta and ask for the order."
    },
    {
      "cs": "Vyber těstoviny s rajčaty a zeleninovou přílohu.",
      "en": "Choose tomato pasta and a vegetable side dish."
    },
    {
      "cs": "Jídlo je objednané. Zjisti, co budou hosté pít.",
      "en": "The food is ordered. Ask what the guests will drink."
    },
    {
      "cs": "Vyber vodu pro stůl a upřesni její druh.",
      "en": "Choose water for the table and specify the type."
    },
    {
      "cs": "Přines jídlo a popřej hostům.",
      "en": "Serve the food with an appropriate wish."
    },
    {
      "cs": "Dojedl/a jsi. Požádej o vyúčtování a ověř platbu bez hotovosti.",
      "en": "You have finished eating. Ask for the bill and check cashless payment."
    },
    {
      "cs": "Reaguj na žádost o zaplacení a oznam další krok.",
      "en": "Respond to the payment request and explain what you will do next."
    },
    {
      "cs": "Odcházíš z restaurace. Zdvořile ukonči návštěvu.",
      "en": "You are leaving the restaurant. End the visit politely."
    }
  ],
  "passato": [
    {
      "cs": "Potkal/a jsi známou. Zeptej se na její včerejší den.",
      "en": "You meet a friend. Ask about her day yesterday."
    },
    {
      "cs": "Vyprávěj o včerejším výletu do Sieny a své společnici.",
      "en": "Describe yesterday’s trip to Siena and your companion."
    },
    {
      "cs": "Zajímej se o dopravu na výlet.",
      "en": "Ask about transport for the trip."
    },
    {
      "cs": "Popiš způsob dopravy a zhodnoť cestu.",
      "en": "Describe the transport and how the journey went."
    },
    {
      "cs": "Zeptej se na program návštěvy města.",
      "en": "Ask what they visited in the city."
    },
    {
      "cs": "Shrň dvě hlavní aktivity výletu v jejich pořadí.",
      "en": "Summarise the two main activities in order."
    },
    {
      "cs": "Přejdi k tomu, kde se cestovatelky najedly.",
      "en": "Ask where the travellers ate."
    },
    {
      "cs": "Popiš oběd a předej slovo druhému.",
      "en": "Describe lunch and invite the other person to speak."
    },
    {
      "cs": "Vyprávěj o svém vlastním dni ve Florencii.",
      "en": "Describe your own day in Florence."
    },
    {
      "cs": "Zjisti čas návratu druhého domů.",
      "en": "Ask when the other person got home."
    },
    {
      "cs": "Sděl svůj návrat a zeptej se na jejich.",
      "en": "Give your return time and ask about theirs."
    },
    {
      "cs": "Uzavři vyprávění časem návratu a dojmem z výletu.",
      "en": "Finish with your return time and impressions of the trip."
    }
  ],
  "racconto": [
    {
      "cs": "Zeptej se, jak proběhl včerejší výlet.",
      "en": "Ask how yesterday’s trip went."
    },
    {
      "cs": "Zhodnoť výlet a naznač počáteční komplikaci.",
      "en": "Give an overall impression and mention an initial problem."
    },
    {
      "cs": "Vyzvi druhého, aby komplikaci vysvětlil.",
      "en": "Ask the speaker to explain the problem."
    },
    {
      "cs": "Popiš čekání na vlak přerušené změnou počasí.",
      "en": "Describe waiting for the train when the weather changed."
    },
    {
      "cs": "Zjisti, zda byli cestující vybaveni na déšť.",
      "en": "Ask whether the travellers were prepared for rain."
    },
    {
      "cs": "Porovnej svůj obvyklý zvyk se včerejší výjimkou.",
      "en": "Contrast your usual habit with yesterday’s exception."
    },
    {
      "cs": "Zeptej se na řešení vzniklé situace.",
      "en": "Ask how they dealt with the situation."
    },
    {
      "cs": "Popiš úkryt před deštěm a událost, která nastala během čekání.",
      "en": "Describe sheltering from rain and what happened while waiting."
    },
    {
      "cs": "Ověř, zda cestující zvládli nástup.",
      "en": "Check whether the travellers managed to board."
    },
    {
      "cs": "Potvrď nástup a přidej novou komplikaci s telefonem.",
      "en": "Confirm boarding and introduce a new problem with your phone."
    },
    {
      "cs": "Projev překvapení a zjisti, jak se telefon našel.",
      "en": "Express surprise and ask where the phone turned up."
    },
    {
      "cs": "Rozuzli příhodu a shrň konec výletu.",
      "en": "Resolve the story and summarise how the trip ended."
    }
  ],
  "progetti": [
    {
      "cs": "Zajímej se o plány známé na další den.",
      "en": "Ask about your friend’s plans for tomorrow."
    },
    {
      "cs": "Představ plán výletu do Luccy a pozvi druhého.",
      "en": "Describe a planned trip to Lucca and invite your friend."
    },
    {
      "cs": "Přijmi pozvání a navrhni dopravu.",
      "en": "Accept the invitation and suggest transport."
    },
    {
      "cs": "Souhlas s dopravou a zdvořile rozděl přípravu cesty.",
      "en": "Agree on transport and politely share the planning tasks."
    },
    {
      "cs": "Sděl nalezený spoj a doporuč nákup před cestou.",
      "en": "Give the departure you found and recommend buying tickets ahead."
    },
    {
      "cs": "Převezmi úkol koupit jízdenky.",
      "en": "Offer to take care of buying the tickets."
    },
    {
      "cs": "Navrhni společnou aktivitu na městských hradbách.",
      "en": "Suggest an activity together on the city walls."
    },
    {
      "cs": "Přijmi návrh a rozšiř program výletu.",
      "en": "Accept the suggestion and add to the itinerary."
    },
    {
      "cs": "Připrav alternativu programu pro špatné počasí.",
      "en": "Suggest an alternative for bad weather."
    },
    {
      "cs": "Program je domluvený. Zjisti čas setkání.",
      "en": "The itinerary is agreed. Ask when to meet."
    },
    {
      "cs": "Urči čas a místo srazu před odjezdem.",
      "en": "Specify a meeting time and place before departure."
    },
    {
      "cs": "Potvrď dohodu a shrň čas odjezdu.",
      "en": "Confirm the arrangement and summarise the departure time."
    }
  ],
  "pronomi": [
    {
      "cs": "Ověř, zda má druhý zajištěný vstup do muzea.",
      "en": "Check whether your friend has a museum ticket."
    },
    {
      "cs": "Vysvětli plán nákupu vstupenky bez opakování jejího názvu.",
      "en": "Explain your ticket purchase plans without repeating the noun."
    },
    {
      "cs": "Sděl, že vstup už máš, a zeptej se na další pomůcku k orientaci.",
      "en": "Say your ticket is sorted and ask about a navigation aid."
    },
    {
      "cs": "Odpověz, kde neseš mapu, a popiš polohu muzea.",
      "en": "Say where you carry the map and locate the museum."
    },
    {
      "cs": "Zjisti, zda je nádraží vidět z vašeho místa.",
      "en": "Ask whether the station is visible from here."
    },
    {
      "cs": "Potvrď viditelnost a navrhni zastávku na občerstvení.",
      "en": "Confirm you can see it and suggest a refreshment stop."
    },
    {
      "cs": "Přijmi návrh, zmiň svůj zvyk a nabídni něco k jídlu.",
      "en": "Accept, mention your habit and offer something to eat."
    },
    {
      "cs": "Vyber množství pečiva a zeptej se na přání druhého.",
      "en": "Choose a quantity of pastries and ask what your friend wants."
    },
    {
      "cs": "Upřesni své množství a navrhni další přesun.",
      "en": "Give your quantity and suggest how to get to the next stop."
    },
    {
      "cs": "Potvrď způsob přesunu a odhadni dobu.",
      "en": "Confirm how you will get there and estimate the time."
    },
    {
      "cs": "Reaguj na náročnější cestu s těžkým batohem sebejistě.",
      "en": "Respond confidently about the walk with a heavy backpack."
    },
    {
      "cs": "Popiš odchod po návštěvě muzea a domluv další setkání.",
      "en": "Describe your plans after the museum and arrange to meet later."
    }
  ],
  "opinioni": [
    {
      "cs": "Otevři debatu o návštěvě centra s průvodcem.",
      "en": "Start a discussion about visiting the centre with a guide."
    },
    {
      "cs": "Podpoř nápad a uveď vzdělávací přínos.",
      "en": "Support the idea and explain its learning benefit."
    },
    {
      "cs": "Zvaž jednu výhodu a finanční nevýhodu.",
      "en": "Weigh an advantage against the cost."
    },
    {
      "cs": "Uznej vyšší cenu, ale obhaj hodnotu zážitku.",
      "en": "Acknowledge the higher price but defend the experience’s value."
    },
    {
      "cs": "Vysvětli, proč ti pevný program nevyhovuje.",
      "en": "Explain why a fixed schedule does not suit you."
    },
    {
      "cs": "Ukaž porozumění a nabídni kompromis v délce prohlídky.",
      "en": "Show understanding and propose a shorter tour as a compromise."
    },
    {
      "cs": "Přijmi kompromis a ověř dostupnost.",
      "en": "Accept the compromise and ask about availability."
    },
    {
      "cs": "Vyvoď možnost rezervace z údajů na webu.",
      "en": "Use the website’s availability information to draw a conclusion."
    },
    {
      "cs": "Vyjádři obavu z počasí a času venku.",
      "en": "Express concern about the weather and time outdoors."
    },
    {
      "cs": "Obhaj zájem i za horšího počasí a navrhni ověření podmínek.",
      "en": "Maintain your interest despite the weather and suggest checking the terms."
    },
    {
      "cs": "Stanov svou podmínku ohledně velikosti skupiny.",
      "en": "State your preference about group size."
    },
    {
      "cs": "Shrň společné rozhodnutí a jeho podmínky.",
      "en": "Summarise the joint decision and its conditions."
    }
  ],
  "ipotesi": [
    {
      "cs": "Polož hypotetickou otázku o dni volna navíc.",
      "en": "Ask a hypothetical question about an extra free day."
    },
    {
      "cs": "Představ výlet, který bys podnikl/a s více časem.",
      "en": "Describe a trip you would take with more time."
    },
    {
      "cs": "Navrhni plavbu a podmiň ji stavem moře.",
      "en": "Suggest a boat trip conditional on sea conditions."
    },
    {
      "cs": "Přidej svou podmínku pohodlí během plavby.",
      "en": "Add a condition about comfort during the boat trip."
    },
    {
      "cs": "Navrhni záložní program pro změnu počasí.",
      "en": "Propose a backup plan if the weather changes."
    },
    {
      "cs": "Zhodnoť alternativu s ohledem na společný čas.",
      "en": "Evaluate the alternative in terms of spending time together."
    },
    {
      "cs": "Dej druhému radu, čím při plánování začít.",
      "en": "Advise your friend on the first planning step."
    },
    {
      "cs": "Odvoď výhodu brzkého odjezdu.",
      "en": "Explain the benefit of an early departure."
    },
    {
      "cs": "Doporuč včasnou rezervaci a vysvětli riziko čekání.",
      "en": "Recommend booking early and explain the risk of waiting."
    },
    {
      "cs": "Stanov hranici přijatelnosti storno podmínek.",
      "en": "State what cancellation terms would make you choose another offer."
    },
    {
      "cs": "Podpoř porovnání více možností.",
      "en": "Support comparing several options."
    },
    {
      "cs": "Uzavři plán rozhodnutím závislým na vhodné nabídce.",
      "en": "Conclude with a decision conditional on finding a suitable offer."
    }
  ],
  "registro": [
    {
      "cs": "Jsi pracovník rezervačního oddělení. Zahaj formální telefonát.",
      "en": "You work in reservations. Open a formal phone conversation."
    },
    {
      "cs": "Představ se a vysvětli, ke které dřívější záležitosti voláš.",
      "en": "Introduce yourself and identify the earlier matter you are calling about."
    },
    {
      "cs": "Zdvořile vyžádej identifikaci žádosti.",
      "en": "Politely request the reference number."
    },
    {
      "cs": "Uveď číslo 24 a požádej o vysvětlení platby.",
      "en": "Give reference 24 and request clarification about payment."
    },
    {
      "cs": "Navrhni zaslání informací a ověř doručení formuláře.",
      "en": "Offer to send information and check whether the form arrived."
    },
    {
      "cs": "Vysvětli, co jsi udělal/a s formulářem, a požádej o potvrzení doručení.",
      "en": "Explain what you did with the form and request confirmation of receipt."
    },
    {
      "cs": "Po kontrole sděl stav doručení dokumentu.",
      "en": "After checking, report the document’s delivery status."
    },
    {
      "cs": "Požádej o doklad dohody v písemné podobě.",
      "en": "Request written confirmation of the arrangement."
    },
    {
      "cs": "Přislíb odpověď a stanov nejzazší termín.",
      "en": "Promise a response and state a deadline."
    },
    {
      "cs": "Formálně potvrď, že budeš čekat na vyjádření.",
      "en": "Formally acknowledge that you will await the response."
    },
    {
      "cs": "Před ukončením hovoru nabídni prostor pro další dotazy.",
      "en": "Before ending the call, invite any further questions."
    },
    {
      "cs": "Uzavři formální hovor s poděkováním za pomoc.",
      "en": "Close the formal call with thanks for the assistance."
    }
  ]
};
  for(const l of lessons)l.dialogue.forEach((line,i)=>{line.situation=roleSituations[l.id][i];});
  // Complete coherent variants reuse unchanged lines and their recordings.
  const dialogueChanges={
  "bar": [
    {
      "title": {
        "cs": "Cappuccino u stolu",
        "en": "Cappuccino at a table"
      },
      "changes": {
        "1": {
          "it": "Buongiorno! Vorrei un cappuccino e un cornetto, per favore.",
          "translation": {
            "cs": "Dobrý den! Chtěl bych cappuccino a croissant, prosím.",
            "en": "Good morning! I would like a cappuccino and a croissant, please.",
            "it": "Buongiorno! Vorrei un cappuccino e un cornetto, per favore."
          },
          "situation": {
            "cs": "Objednej cappuccino a sladké pečivo.",
            "en": "Order a cappuccino and a pastry."
          }
        },
        "3": {
          "it": "Al tavolo, grazie. Anche un bicchiere d’acqua frizzante.",
          "translation": {
            "cs": "U stolu, děkuji. A ještě sklenici perlivé vody.",
            "en": "At a table, thank you. Also a glass of sparkling water.",
            "it": "Al tavolo, grazie. Anche un bicchiere d’acqua frizzante."
          },
          "situation": {
            "cs": "Chceš si sednout ke stolu a přidat perlivou vodu.",
            "en": "Choose a table and add sparkling water."
          }
        },
        "4": {
          "it": "Ecco il cappuccino, il cornetto e l’acqua frizzante.",
          "translation": {
            "cs": "Tady je cappuccino, croissant a perlivá voda.",
            "en": "Here are the cappuccino, croissant and sparkling water.",
            "it": "Ecco il cappuccino, il cornetto e l’acqua frizzante."
          },
          "situation": {
            "cs": "Předej objednané cappuccino, pečivo a vodu.",
            "en": "Serve the ordered cappuccino, pastry and water."
          }
        }
      }
    },
    {
      "title": {
        "cs": "Čaj a platba hotově",
        "en": "Tea and cash payment"
      },
      "changes": {
        "1": {
          "it": "Buongiorno! Vorrei un tè e un cornetto, per favore.",
          "translation": {
            "cs": "Dobrý den! Chtěl bych čaj a croissant, prosím.",
            "en": "Good morning! I would like tea and a croissant, please.",
            "it": "Buongiorno! Vorrei un tè e un cornetto, per favore."
          },
          "situation": {
            "cs": "Místo kávy si chceš dát čaj a pečivo. Objednej.",
            "en": "Order tea instead of coffee, with a pastry."
          }
        },
        "4": {
          "it": "Ecco il tè, il cornetto e l’acqua.",
          "translation": {
            "cs": "Tady je čaj, croissant a voda.",
            "en": "Here are the tea, croissant and water.",
            "it": "Ecco il tè, il cornetto e l’acqua."
          },
          "situation": {
            "cs": "Předej objednaný čaj, pečivo a vodu.",
            "en": "Serve the ordered tea, pastry and water."
          }
        },
        "7": {
          "it": "Posso pagare in contanti?",
          "translation": {
            "cs": "Mohu zaplatit hotově?",
            "en": "Can I pay in cash?",
            "it": "Posso pagare in contanti?"
          },
          "situation": {
            "cs": "Máš připravené mince. Ověř platbu hotově.",
            "en": "You have coins ready. Ask about paying cash."
          }
        }
      }
    }
  ],
  "hotel": [
    {
      "title": {
        "cs": "Tři noci a parkování",
        "en": "Three nights and parking"
      },
      "changes": {
        "1": {
          "it": "Sì, a nome Novák. Ho prenotato una camera per tre notti.",
          "translation": {
            "cs": "Ano, na jméno Novák. Rezervoval jsem pokoj na tři noci.",
            "en": "Yes, under Novák. I booked a room for three nights.",
            "it": "Sì, a nome Novák. Ho prenotato una camera per tre notti."
          },
          "situation": {
            "cs": "Přihlašuješ rezervaci Novák na tři noci.",
            "en": "Check in for a three-night booking under Novák."
          }
        },
        "5": {
          "it": "Grazie. Dove posso parcheggiare la macchina?",
          "translation": {
            "cs": "Děkuji. Kde mohu zaparkovat auto?",
            "en": "Thank you. Where can I park the car?",
            "it": "Grazie. Dove posso parcheggiare la macchina?"
          },
          "situation": {
            "cs": "Přijel/a jsi autem. Domluv místo k parkování.",
            "en": "You arrived by car. Ask where to park."
          }
        },
        "6": {
          "it": "C’è un parcheggio dietro l’albergo. Ecco la chiave della camera.",
          "translation": {
            "cs": "Za hotelem je parkoviště. Tady je klíč od pokoje.",
            "en": "There is a car park behind the hotel. Here is the room key.",
            "it": "C’è un parcheggio dietro l’albergo. Ecco la chiave della camera."
          },
          "situation": {
            "cs": "Nasměruj hosta na parkoviště za hotelem a předej klíč.",
            "en": "Direct the guest to parking behind the hotel and give them the key."
          }
        }
      }
    },
    {
      "title": {
        "cs": "Jedna noc a další ručník",
        "en": "One night and an extra towel"
      },
      "changes": {
        "1": {
          "it": "Sì, a nome Novák. Ho prenotato una camera per una notte.",
          "translation": {
            "cs": "Ano, na jméno Novák. Rezervoval jsem pokoj na jednu noc.",
            "en": "Yes, under Novák. I booked a room for one night.",
            "it": "Sì, a nome Novák. Ho prenotato una camera per una notte."
          },
          "situation": {
            "cs": "Máš rezervaci Novák pouze na jednu noc. Přihlas se.",
            "en": "Check in for a one-night booking under Novák."
          }
        },
        "5": {
          "it": "Grazie. Potrei avere un altro asciugamano?",
          "translation": {
            "cs": "Děkuji. Mohl bych dostat ještě jeden ručník?",
            "en": "Thank you. Could I have another towel?",
            "it": "Grazie. Potrei avere un altro asciugamano?"
          },
          "situation": {
            "cs": "V pokoji potřebuješ ručník navíc. Požádej zdvořile.",
            "en": "Politely request an extra towel for your room."
          }
        },
        "6": {
          "it": "Certamente, lo portiamo subito in camera. Ecco la chiave.",
          "translation": {
            "cs": "Samozřejmě, hned ho přineseme na pokoj. Tady je klíč.",
            "en": "Of course, we will bring it to your room right away. Here is the key.",
            "it": "Certamente, lo portiamo subito in camera. Ecco la chiave."
          },
          "situation": {
            "cs": "Potvrď donášku ručníku na pokoj a předej klíč.",
            "en": "Confirm delivery of the towel and hand over the key."
          }
        }
      }
    }
  ],
  "ristorante": [
    {
      "title": {
        "cs": "Čtyři hosté a pizza",
        "en": "Four guests and pizza"
      },
      "changes": {
        "1": {
          "it": "Sì, ho prenotato un tavolo per quattro, a nome Novák.",
          "translation": {
            "cs": "Ano, rezervoval jsem stůl pro čtyři na jméno Novák.",
            "en": "Yes, I booked a table for four under Novák.",
            "it": "Sì, ho prenotato un tavolo per quattro, a nome Novák."
          },
          "situation": {
            "cs": "Přicházíte ve čtyřech na rezervaci Novák.",
            "en": "You arrive as a party of four booked under Novák."
          }
        },
        "4": {
          "it": "No, la pizza margherita non è piccante. Che cosa prendete?",
          "translation": {
            "cs": "Ne, pizza margherita není pálivá. Co si dáte?",
            "en": "No, the margherita pizza is not spicy. What would you like?",
            "it": "No, la pizza margherita non è piccante. Che cosa prendete?"
          },
          "situation": {
            "cs": "Vysvětli chuť pizzy a přijmi objednávku.",
            "en": "Describe the pizza and take the order."
          }
        },
        "5": {
          "it": "Per me una pizza margherita e un’insalata, per favore.",
          "translation": {
            "cs": "Pro mě pizzu margherita a salát, prosím.",
            "en": "A margherita pizza and a salad for me, please.",
            "it": "Per me una pizza margherita e un’insalata, per favore."
          },
          "situation": {
            "cs": "Vyber si pizzu margherita a salát.",
            "en": "Order a margherita pizza and a salad."
          }
        },
        "7": {
          "it": "Una bottiglia d’acqua frizzante, grazie.",
          "translation": {
            "cs": "Láhev perlivé vody, děkuji.",
            "en": "A bottle of sparkling water, thank you.",
            "it": "Una bottiglia d’acqua frizzante, grazie."
          },
          "situation": {
            "cs": "Pro stůl chceš perlivou vodu.",
            "en": "Order sparkling water for the table."
          }
        }
      }
    },
    {
      "title": {
        "cs": "Tři hosté a jídlo bez masa",
        "en": "Three guests and meat-free food"
      },
      "changes": {
        "1": {
          "it": "Sì, ho prenotato un tavolo per tre, a nome Novák.",
          "translation": {
            "cs": "Ano, rezervoval jsem stůl pro tři na jméno Novák.",
            "en": "Yes, I booked a table for three under Novák.",
            "it": "Sì, ho prenotato un tavolo per tre, a nome Novák."
          },
          "situation": {
            "cs": "Máte rezervovaný stůl pro tři pod jménem Novák.",
            "en": "Give the booking for three under Novák."
          }
        },
        "3": {
          "it": "Grazie. Avete un piatto senza carne?",
          "translation": {
            "cs": "Děkuji. Máte nějaké jídlo bez masa?",
            "en": "Thank you. Do you have a dish without meat?",
            "it": "Grazie. Avete un piatto senza carne?"
          },
          "situation": {
            "cs": "Dnes nechceš maso. Zjisti vhodné jídlo.",
            "en": "You do not want meat today. Ask about a suitable dish."
          }
        },
        "4": {
          "it": "Sì, abbiamo la pasta al pomodoro e le verdure alla griglia. Che cosa prendete?",
          "translation": {
            "cs": "Ano, máme těstoviny s rajčaty a grilovanou zeleninu. Co si dáte?",
            "en": "Yes, we have tomato pasta and grilled vegetables. What would you like?",
            "it": "Sì, abbiamo la pasta al pomodoro e le verdure alla griglia. Che cosa prendete?"
          },
          "situation": {
            "cs": "Nabídni těstoviny s rajčaty a grilovanou zeleninu.",
            "en": "Offer tomato pasta and grilled vegetables."
          }
        }
      }
    }
  ],
  "saluti": [
    {
      "title": {
        "cs": "Pracovní cesta",
        "en": "Business trip"
      },
      "changes": {
        "6": {
          "it": "No, sono qui per lavoro. Studio l’italiano da tre mesi.",
          "translation": {
            "cs": "Ne, jsem tu pracovně. Učím se italsky tři měsíce.",
            "en": "No, I am here for work. I have studied Italian for three months.",
            "it": "No, sono qui per lavoro. Studio l’italiano da tre mesi."
          },
          "situation": {
            "cs": "Nejsi na dovolené: přijel/a jsi pracovně a učíš se tři měsíce.",
            "en": "You are here for work, not on holiday, and have studied for three months."
          }
        }
      }
    }
  ],
  "citta": [
    {
      "title": {
        "cs": "Pomalejší tempo chůze",
        "en": "A slower walking pace"
      },
      "changes": {
        "4": {
          "it": "È lontano? Cammino abbastanza lentamente.",
          "translation": {
            "cs": "Je to daleko? Chodím docela pomalu.",
            "en": "Is it far? I walk quite slowly.",
            "it": "È lontano? Cammino abbastanza lentamente."
          },
          "situation": {
            "cs": "Před chůzí se zeptej na vzdálenost a upozorni na své pomalé tempo.",
            "en": "Ask about the distance and mention your slower walking pace."
          }
        },
        "5": {
          "it": "Non molto. Con calma, ci vogliono circa venti minuti a piedi.",
          "translation": {
            "cs": "Ne moc. Volným tempem to trvá asi dvacet minut pěšky.",
            "en": "Not very far. At a leisurely pace it takes about twenty minutes on foot.",
            "it": "Non molto. Con calma, ci vogliono circa venti minuti a piedi."
          },
          "situation": {
            "cs": "Odhadni dvacet minut při pomalejším tempu.",
            "en": "Estimate twenty minutes at a slower pace."
          }
        }
      }
    }
  ],
  "passato": [
    {
      "title": {
        "cs": "Návrat pozdě večer",
        "en": "Returning late in the evening"
      },
      "changes": {
        "10": {
          "it": "Sono tornato alle nove di sera. E voi?",
          "translation": {
            "cs": "Vrátil jsem se v devět večer. A vy?",
            "en": "I returned at nine in the evening. And you?",
            "it": "Sono tornato alle nove di sera. E voi?"
          },
          "situation": {
            "cs": "Sděl návrat v devět večer a zeptej se druhých.",
            "en": "Give a nine p.m. return time and ask the others."
          }
        },
        "11": {
          "it": "Siamo tornate alle dieci, molto stanche ma contente!",
          "translation": {
            "cs": "Vrátily jsme se v deset, velmi unavené, ale spokojené!",
            "en": "We returned at ten, very tired but happy!",
            "it": "Siamo tornate alle dieci, molto stanche ma contente!"
          },
          "situation": {
            "cs": "Výlet skončil návratem v deset. Shrň své dojmy.",
            "en": "Your trip ended with a ten p.m. return. Sum up your impressions."
          }
        }
      }
    }
  ],
  "racconto": [
    {
      "title": {
        "cs": "Telefon v batohu",
        "en": "Phone in the backpack"
      },
      "changes": {
        "11": {
          "it": "Per fortuna era nello zaino! Alla fine siamo arrivati in tempo e abbiamo visitato il museo.",
          "translation": {
            "cs": "Naštěstí byl v batohu! Nakonec jsme dorazili včas a navštívili muzeum.",
            "en": "Luckily it was in the backpack! In the end we arrived on time and visited the museum.",
            "it": "Per fortuna era nello zaino! Alla fine siamo arrivati in tempo e abbiamo visitato il museo."
          },
          "situation": {
            "cs": "Telefon se našel v batohu. Uzavři příhodu úspěšnou návštěvou muzea.",
            "en": "The phone was in the backpack. End with the successful museum visit."
          }
        }
      }
    }
  ],
  "progetti": [
    {
      "title": {
        "cs": "Rezervace jízdenek společně",
        "en": "Booking tickets together"
      },
      "changes": {
        "3": {
          "it": "Ottima idea. Potresti controllare gli orari e prenotare i biglietti?",
          "translation": {
            "cs": "Výborný nápad. Mohl bys zkontrolovat jízdní řád a rezervovat jízdenky?",
            "en": "Great idea. Could you check the timetable and book the tickets?",
            "it": "Ottima idea. Potresti controllare gli orari e prenotare i biglietti?"
          },
          "situation": {
            "cs": "Požádej druhého o jízdní řád i rezervaci jízdenek.",
            "en": "Ask your friend to check the timetable and book tickets."
          }
        },
        "4": {
          "it": "Certo. C’è un treno alle nove. Prenotiamo insieme stasera?",
          "translation": {
            "cs": "Jistě. V devět jede vlak. Zarezervujeme je spolu dnes večer?",
            "en": "Sure. There is a train at nine. Shall we book together tonight?",
            "it": "Certo. C’è un treno alle nove. Prenotiamo insieme stasera?"
          },
          "situation": {
            "cs": "Našel/našla jsi vlak v devět. Navrhni společnou večerní rezervaci.",
            "en": "You found a nine o’clock train. Suggest booking together tonight."
          }
        },
        "5": {
          "it": "Va bene. Ti chiamo dopo cena e li prenotiamo online.",
          "translation": {
            "cs": "Dobře. Zavolám ti po večeři a zarezervujeme je online.",
            "en": "All right. I will call after dinner and we will book online.",
            "it": "Va bene. Ti chiamo dopo cena e li prenotiamo online."
          },
          "situation": {
            "cs": "Domluv telefonát po večeři pro společnou rezervaci.",
            "en": "Arrange a call after dinner to book together."
          }
        }
      }
    }
  ],
  "pronomi": [
    {
      "title": {
        "cs": "Bez pečiva",
        "en": "No pastry"
      },
      "changes": {
        "7": {
          "it": "No, grazie, non ne voglio. E tu, quanti ne vuoi?",
          "translation": {
            "cs": "Ne, děkuji, žádný nechci. A ty, kolik jich chceš?",
            "en": "No thanks, I do not want any. And you, how many do you want?",
            "it": "No, grazie, non ne voglio. E tu, quanti ne vuoi?"
          },
          "situation": {
            "cs": "Odmítni pečivo a zeptej se na množství pro druhého.",
            "en": "Decline the pastry and ask how many your friend wants."
          }
        }
      }
    }
  ],
  "opinioni": [
    {
      "title": {
        "cs": "Poslední dvě místa",
        "en": "Last two places"
      },
      "changes": {
        "7": {
          "it": "Il sito indica solo due posti liberi, quindi dovremmo prenotare presto.",
          "translation": {
            "cs": "Web uvádí jen dvě volná místa, takže bychom měli brzy rezervovat.",
            "en": "The website shows only two places left, so we should book soon.",
            "it": "Il sito indica solo due posti liberi, quindi dovremmo prenotare presto."
          },
          "situation": {
            "cs": "Zbývají dvě místa. Vyvoď doporučení k rezervaci.",
            "en": "Only two places remain. Draw a conclusion about booking."
          }
        }
      }
    }
  ],
  "ipotesi": [
    {
      "title": {
        "cs": "Obava z dlouhé plavby",
        "en": "Concern about a long boat trip"
      },
      "changes": {
        "3": {
          "it": "Verrei con te a condizione che il viaggio in barca non durasse più di un’ora.",
          "translation": {
            "cs": "Jela bych s tebou pod podmínkou, že plavba nebude trvat déle než hodinu.",
            "en": "I would come with you provided the boat trip lasted no more than an hour.",
            "it": "Verrei con te a condizione che il viaggio in barca non durasse più di un’ora."
          },
          "situation": {
            "cs": "Souhlas s výletem, pokud plavba nepřesáhne hodinu.",
            "en": "Agree to the trip if the boat journey takes no more than an hour."
          }
        }
      }
    }
  ],
  "registro": [
    {
      "title": {
        "cs": "Termín do pátku",
        "en": "Deadline by Friday"
      },
      "changes": {
        "7": {
          "it": "La ringrazio. Sarebbe possibile ricevere una conferma scritta entro venerdì?",
          "translation": {
            "cs": "Děkuji Vám. Bylo by možné dostat písemné potvrzení do pátku?",
            "en": "Thank you. Would it be possible to receive written confirmation by Friday?",
            "it": "La ringrazio. Sarebbe possibile ricevere una conferma scritta entro venerdì?"
          },
          "situation": {
            "cs": "Požaduj písemné potvrzení s termínem do pátku.",
            "en": "Request written confirmation by Friday."
          }
        },
        "8": {
          "it": "Certamente. Le risponderò entro giovedì pomeriggio.",
          "translation": {
            "cs": "Samozřejmě. Odpovím Vám do čtvrtka odpoledne.",
            "en": "Certainly. I will reply by Thursday afternoon.",
            "it": "Certamente. Le risponderò entro giovedì pomeriggio."
          },
          "situation": {
            "cs": "Slib odpověď už do čtvrtka odpoledne.",
            "en": "Promise a reply by Thursday afternoon."
          }
        }
      }
    }
  ]
};
  for(const l of lessons){
    l.dialogueVariants=dialogueChanges[l.id].map((v,n)=>({id:l.id+'-v'+(n+1),title:v.title,lines:l.dialogue.map((line,i)=>{
      const change=v.changes[i];if(!change)return line;
      const result={...line,...change,id:l.id+'-v'+(n+1)+'-'+(i+1)};
      audioFiles[result.it]=audioFiles[result.it]||result.id+'.mp3';return result;
    })}));
  }
  const restaurantBranchRows=[
  {
    "id": "ristorante-branch-1",
    "role": "barista",
    "it": "Mi dispiace, la pasta al pomodoro è finita. Preferisce un altro piatto?",
    "translation": {
      "cs": "Je mi líto, těstoviny s rajčatovou omáčkou už došly. Dáte si jiné jídlo?",
      "en": "Sorry, we have run out of tomato pasta. Would you prefer another dish?",
      "it": "Mi dispiace, la pasta al pomodoro è finita. Preferisce un altro piatto?"
    },
    "situation": {
      "cs": "Oznam hostovi, že těstoviny došly, a nabídni změnu objednávky.",
      "en": "Tell the guest the pasta has run out and offer a different dish."
    }
  },
  {
    "id": "ristorante-branch-2",
    "role": "customer",
    "it": "Che cosa mi consiglia al posto della pasta?",
    "translation": {
      "cs": "Co mi doporučíte místo těstovin?",
      "en": "What would you recommend instead of pasta?",
      "it": "Che cosa mi consiglia al posto della pasta?"
    },
    "situation": {
      "cs": "Těstoviny došly. Požádej obsluhu o doporučení jiného jídla.",
      "en": "The pasta has run out. Ask the waiter to recommend another dish."
    }
  },
  {
    "id": "ristorante-branch-3",
    "role": "barista",
    "it": "Le consiglio il risotto ai funghi. Non è piccante.",
    "translation": {
      "cs": "Doporučuji houbové rizoto. Není pálivé.",
      "en": "I recommend the mushroom risotto. It is not spicy.",
      "it": "Le consiglio il risotto ai funghi. Non è piccante."
    },
    "situation": {
      "cs": "Host chce doporučení. Nabídni houbové rizoto a ujisti ho, že není pálivé.",
      "en": "The guest wants a recommendation. Suggest mushroom risotto and explain it is not spicy."
    }
  },
  {
    "id": "ristorante-branch-4",
    "role": "customer",
    "it": "Allora prendo il pesce alla griglia, per favore.",
    "translation": {
      "cs": "Tak si dám grilovanou rybu, prosím.",
      "en": "Then I will have the grilled fish, please.",
      "it": "Allora prendo il pesce alla griglia, per favore."
    },
    "situation": {
      "cs": "Těstoviny došly. Změň objednávku na grilovanou rybu.",
      "en": "The pasta has run out. Change your order to grilled fish."
    }
  },
  {
    "id": "ristorante-branch-5",
    "role": "barista",
    "it": "Va bene, un pesce alla griglia con le verdure.",
    "translation": {
      "cs": "Dobře, grilovaná ryba se zeleninou.",
      "en": "Certainly, grilled fish with vegetables.",
      "it": "Va bene, un pesce alla griglia con le verdure."
    },
    "situation": {
      "cs": "Potvrď změnu objednávky na grilovanou rybu se zeleninou.",
      "en": "Confirm the change to grilled fish with vegetables."
    }
  },
  {
    "id": "ristorante-branch-6",
    "role": "customer",
    "it": "Va bene, grazie. Una bottiglia d’acqua naturale, per favore.",
    "translation": {
      "cs": "Dobře, děkuji. Láhev neperlivé vody, prosím.",
      "en": "All right, thank you. A bottle of still water, please.",
      "it": "Va bene, grazie. Una bottiglia d’acqua naturale, per favore."
    },
    "situation": {
      "cs": "Přijmi domluvené jídlo a objednej láhev neperlivé vody.",
      "en": "Accept the agreed dish and order a bottle of still water."
    }
  }
];
  for(const line of restaurantBranchRows)audioFiles[line.it]=line.id+'.mp3';
  restaurant.dialogueVariants.push({id:'ristorante-v3',title:{cs:'Vybrané jídlo došlo · dvě cesty',en:'Dish unavailable · two paths'},lines:[
    ...restaurant.dialogue.slice(0,6),restaurantBranchRows[0],
    {...restaurantBranchRows[1],branchTitle:{cs:'Jídlo došlo. Jak pokračovat?',en:'The dish is unavailable. What next?'},branches:[
      {id:'recommend',title:{cs:'Požádat o doporučení',en:'Ask for a recommendation'},lines:[restaurantBranchRows[1],restaurantBranchRows[2]]},
      {id:'fish',title:{cs:'Vybrat grilovanou rybu',en:'Choose grilled fish'},lines:[restaurantBranchRows[3],restaurantBranchRows[4]]}
    ]},restaurantBranchRows[2],restaurantBranchRows[5],...restaurant.dialogue.slice(10)
  ]});
  const hotelBranchRows=[
  {
    "id": "hotel-branch-1",
    "role": "customer",
    "it": "No, non ho prenotato. Avete una camera per questa notte?",
    "translation": {
      "cs": "Ne, nemám rezervaci. Máte pokoj na dnešní noc?",
      "en": "No, I have not booked. Do you have a room for tonight?",
      "it": "No, non ho prenotato. Avete una camera per questa notte?"
    },
    "situation": {
      "cs": "Přicházíš bez rezervace. Zjisti, zda se můžeš ubytovat na dnešní noc.",
      "en": "You arrive without a booking. Ask whether you can stay tonight."
    }
  },
  {
    "id": "hotel-branch-2",
    "role": "barista",
    "it": "Mi dispiace, per questa notte siamo al completo.",
    "translation": {
      "cs": "Je mi líto, na dnešní noc máme obsazeno.",
      "en": "I am sorry, we are fully booked tonight.",
      "it": "Mi dispiace, per questa notte siamo al completo."
    },
    "situation": {
      "cs": "Všechny pokoje na dnešní noc jsou obsazené. Zdvořile to vysvětli hostovi.",
      "en": "All rooms are booked tonight. Politely explain this to the guest."
    }
  },
  {
    "id": "hotel-branch-3",
    "role": "customer",
    "it": "Può consigliarmi un altro albergo qui vicino?",
    "translation": {
      "cs": "Můžete mi doporučit jiný hotel poblíž?",
      "en": "Can you recommend another hotel nearby?",
      "it": "Può consigliarmi un altro albergo qui vicino?"
    },
    "situation": {
      "cs": "Dnes se tu neubytuješ. Požádej o doporučení jiného hotelu poblíž.",
      "en": "You cannot stay here tonight. Ask for another hotel nearby."
    }
  },
  {
    "id": "hotel-branch-4",
    "role": "barista",
    "it": "Può provare nell’albergo qui accanto. Se vuole, chiamo per chiedere se hanno una camera libera.",
    "translation": {
      "cs": "Můžete to zkusit v hotelu hned vedle. Jestli chcete, zavolám a zeptám se, zda mají volný pokoj.",
      "en": "You can try the hotel next door. If you like, I can call to ask whether they have a room available.",
      "it": "Può provare nell’albergo qui accanto. Se vuole, chiamo per chiedere se hanno una camera libera."
    },
    "situation": {
      "cs": "Doporuč hotel vedle a nabídni ověření dostupnosti po telefonu.",
      "en": "Suggest the hotel next door and offer to phone to check availability."
    }
  },
  {
    "id": "hotel-branch-5",
    "role": "customer",
    "it": "E per domani notte avete una camera libera?",
    "translation": {
      "cs": "A na zítřejší noc máte volný pokoj?",
      "en": "And do you have a room available for tomorrow night?",
      "it": "E per domani notte avete una camera libera?"
    },
    "situation": {
      "cs": "Můžeš přijet o den později. Ověř dostupnost pokoje na zítřejší noc.",
      "en": "You can arrive a day later. Check room availability for tomorrow night."
    }
  },
  {
    "id": "hotel-branch-6",
    "role": "barista",
    "it": "Sì, per domani notte abbiamo una camera doppia disponibile.",
    "translation": {
      "cs": "Ano, na zítřejší noc máme volný dvoulůžkový pokoj.",
      "en": "Yes, we have a double room available for tomorrow night.",
      "it": "Sì, per domani notte abbiamo una camera doppia disponibile."
    },
    "situation": {
      "cs": "Zítra je volný dvoulůžkový pokoj. Sděl hostovi tuto možnost.",
      "en": "A double room is available tomorrow. Tell the guest about this option."
    }
  }
];
  for(const line of hotelBranchRows)audioFiles[line.it]=line.id+'.mp3';
  const hotelBranchLesson=lessons.find(l=>l.id==='hotel');
  hotelBranchLesson.dialogueVariants.push({id:'hotel-v3',title:{cs:'Hotel je obsazený · dvě cesty',en:'Hotel fully booked · two paths'},lines:[
    hotelBranchLesson.dialogue[0],hotelBranchRows[0],hotelBranchRows[1],
    {...hotelBranchRows[2],branchTitle:{cs:'Hotel je obsazený. Jak pokračovat?',en:'The hotel is fully booked. What next?'},branches:[
      {id:'another-hotel',title:{cs:'Zeptat se na jiný hotel',en:'Ask about another hotel'},lines:[hotelBranchRows[2],hotelBranchRows[3]]},
      {id:'tomorrow',title:{cs:'Zeptat se na zítřejší noc',en:'Ask about tomorrow night'},lines:[hotelBranchRows[4],hotelBranchRows[5]]}
    ]},hotelBranchRows[3],hotelBranchLesson.dialogue[11]
  ]});
  const cafeBranchRows=[
  {
    "id": "bar-branch-1",
    "role": "customer",
    "it": "Vorrei un cappuccino, per favore.",
    "translation": {
      "cs": "Chtěl bych cappuccino, prosím.",
      "en": "I would like a cappuccino, please.",
      "it": "Vorrei un cappuccino, per favore."
    },
    "situation": {
      "cs": "Přicházíš do kavárny a máš chuť na cappuccino. Zdvořile si ho objednej.",
      "en": "You arrive at a café and feel like a cappuccino. Order politely."
    }
  },
  {
    "id": "bar-branch-2",
    "role": "barista",
    "it": "Mi dispiace, abbiamo finito il latte. Posso prepararle un caffè o un tè.",
    "translation": {
      "cs": "Je mi líto, došlo nám mléko. Mohu vám připravit espresso nebo čaj.",
      "en": "I am sorry, we have run out of milk. I can make you an espresso or a tea.",
      "it": "Mi dispiace, abbiamo finito il latte. Posso prepararle un caffè o un tè."
    },
    "situation": {
      "cs": "Mléko došlo. Omluv se a nabídni espresso nebo čaj.",
      "en": "You have run out of milk. Apologise and offer espresso or tea."
    }
  },
  {
    "id": "bar-branch-3",
    "role": "customer",
    "it": "Allora prendo un caffè, grazie.",
    "translation": {
      "cs": "Tak si dám espresso, děkuji.",
      "en": "Then I will have an espresso, thank you.",
      "it": "Allora prendo un caffè, grazie."
    },
    "situation": {
      "cs": "Cappuccino není dostupné. Změň objednávku na espresso.",
      "en": "Cappuccino is unavailable. Change your order to espresso."
    }
  },
  {
    "id": "bar-branch-4",
    "role": "barista",
    "it": "Certo, ecco il suo caffè.",
    "translation": {
      "cs": "Jistě, tady je vaše espresso.",
      "en": "Certainly, here is your espresso.",
      "it": "Certo, ecco il suo caffè."
    },
    "situation": {
      "cs": "Zákazník si místo cappuccina vybral espresso. Podej mu ho.",
      "en": "The customer chose espresso instead of cappuccino. Serve it."
    }
  },
  {
    "id": "bar-branch-5",
    "role": "customer",
    "it": "Preferisco un tè, per favore.",
    "translation": {
      "cs": "Raději si dám čaj, prosím.",
      "en": "I would prefer a tea, please.",
      "it": "Preferisco un tè, per favore."
    },
    "situation": {
      "cs": "Cappuccino není dostupné. Vyber si místo něj čaj.",
      "en": "Cappuccino is unavailable. Choose tea instead."
    }
  },
  {
    "id": "bar-branch-6",
    "role": "barista",
    "it": "Va bene, ecco il suo tè. Attenzione, è molto caldo.",
    "translation": {
      "cs": "Dobře, tady je váš čaj. Pozor, je velmi horký.",
      "en": "All right, here is your tea. Be careful, it is very hot.",
      "it": "Va bene, ecco il suo tè. Attenzione, è molto caldo."
    },
    "situation": {
      "cs": "Podej objednaný čaj a upozorni, že je horký.",
      "en": "Serve the tea and warn the customer that it is hot."
    }
  }
];
  for(const line of cafeBranchRows)audioFiles[line.it]=line.id+'.mp3';
  const cafeBranchLesson=lessons.find(l=>l.id==='bar');
  cafeBranchLesson.dialogueVariants.push({id:'bar-v3',title:{cs:'Cappuccino není dostupné · dvě cesty',en:'Cappuccino unavailable · two paths'},lines:[
    cafeBranchLesson.dialogue[0],cafeBranchRows[0],cafeBranchRows[1],
    {...cafeBranchRows[2],branchTitle:{cs:'Mléko došlo. Co si dáš místo cappuccina?',en:'No milk left. What will you have instead?'},branches:[
      {id:'espresso',title:{cs:'Vybrat espresso',en:'Choose espresso'},lines:[cafeBranchRows[2],cafeBranchRows[3]]},
      {id:'tea',title:{cs:'Vybrat čaj',en:'Choose tea'},lines:[cafeBranchRows[4],cafeBranchRows[5]]}
    ]},cafeBranchRows[3],...cafeBranchLesson.dialogue.slice(5)
  ]});
  const cityBranchRows=[
  {
    "id": "citta-branch-1",
    "role": "barista",
    "it": "La strada per la stazione è chiusa per lavori. Deve fare un altro percorso.",
    "translation": {
      "cs": "Ulice k nádraží je uzavřená kvůli opravám. Musíte jít jinudy.",
      "en": "The road to the station is closed for roadworks. You need to take another route.",
      "it": "La strada per la stazione è chiusa per lavori. Deve fare un altro percorso."
    },
    "situation": {
      "cs": "Cesta k nádraží je uzavřená kvůli opravám. Vysvětli to návštěvníkovi.",
      "en": "The road to the station is closed for roadworks. Explain this to the visitor."
    }
  },
  {
    "id": "citta-branch-2",
    "role": "customer",
    "it": "Come posso arrivare alla stazione a piedi evitando quella strada?",
    "translation": {
      "cs": "Jak se dostanu na nádraží pěšky, abych se té ulici vyhnul?",
      "en": "How can I walk to the station while avoiding that road?",
      "it": "Come posso arrivare alla stazione a piedi evitando quella strada?"
    },
    "situation": {
      "cs": "Ulice je uzavřená a chceš pokračovat pěšky. Požádej o jinou cestu na nádraží.",
      "en": "The road is closed and you want to walk. Ask for another route to the station."
    }
  },
  {
    "id": "citta-branch-3",
    "role": "barista",
    "it": "Passi per la piazza, poi giri a sinistra. La stazione è dopo il ponte.",
    "translation": {
      "cs": "Projděte přes náměstí a potom odbočte vlevo. Nádraží je za mostem.",
      "en": "Go through the square, then turn left. The station is after the bridge.",
      "it": "Passi per la piazza, poi giri a sinistra. La stazione è dopo il ponte."
    },
    "situation": {
      "cs": "Popiš náhradní pěší cestu přes náměstí, doleva a za most.",
      "en": "Describe the alternative walking route through the square, left and past the bridge."
    }
  },
  {
    "id": "citta-branch-4",
    "role": "customer",
    "it": "C’è un autobus che va alla stazione?",
    "translation": {
      "cs": "Jede na nádraží nějaký autobus?",
      "en": "Is there a bus that goes to the station?",
      "it": "C’è un autobus che va alla stazione?"
    },
    "situation": {
      "cs": "Kvůli uzavřené ulici nechceš jít pěšky. Zjisti možnost dopravy autobusem.",
      "en": "Because of the closed road, you would rather not walk. Ask about taking a bus."
    }
  },
  {
    "id": "citta-branch-5",
    "role": "barista",
    "it": "Sì, prenda l’autobus numero cinque. La fermata è qui di fronte. Scenda alla stazione.",
    "translation": {
      "cs": "Ano, jeďte autobusem číslo pět. Zastávka je tady naproti. Vystupte u nádraží.",
      "en": "Yes, take bus number five. The stop is just opposite. Get off at the station.",
      "it": "Sì, prenda l’autobus numero cinque. La fermata è qui di fronte. Scenda alla stazione."
    },
    "situation": {
      "cs": "V tomto modelovém městě jede k nádraží autobus číslo pět. Ukaž zastávku naproti a řekni, kde vystoupit.",
      "en": "In this fictional town, bus five goes to the station. Point out the stop opposite and explain where to get off."
    }
  },
  {
    "id": "citta-branch-6",
    "role": "customer",
    "it": "Ho capito, grazie per l’aiuto!",
    "translation": {
      "cs": "Rozumím, děkuji za pomoc!",
      "en": "I understand, thank you for your help!",
      "it": "Ho capito, grazie per l’aiuto!"
    },
    "situation": {
      "cs": "Pokynům rozumíš. Poděkuj za pomoc.",
      "en": "You understand the directions. Thank the speaker for helping."
    }
  },
  {
    "id": "citta-branch-7",
    "role": "barista",
    "it": "Prego, buon viaggio!",
    "translation": {
      "cs": "Není zač, šťastnou cestu!",
      "en": "You are welcome, have a good trip!",
      "it": "Prego, buon viaggio!"
    },
    "situation": {
      "cs": "Návštěvník už ví, jak pokračovat. Popřej mu šťastnou cestu.",
      "en": "The visitor now knows how to continue. Wish them a good trip."
    }
  }
];
  for(const line of cityBranchRows)audioFiles[line.it]=line.id+'.mp3';
  const cityBranchLesson=lessons.find(l=>l.id==='citta');
  cityBranchLesson.dialogueVariants.push({id:'citta-v2',title:{cs:'Cesta je uzavřená · dvě cesty',en:'Road closed · two paths'},lines:[
    cityBranchLesson.dialogue[0],cityBranchRows[0],
    {...cityBranchRows[1],branchTitle:{cs:'Cesta je uzavřená. Jak pokračovat?',en:'The road is closed. What next?'},branches:[
      {id:'walk',title:{cs:'Zeptat se na cestu pěšky',en:'Ask for a walking route'},lines:[cityBranchRows[1],cityBranchRows[2]]},
      {id:'bus',title:{cs:'Zeptat se na autobus',en:'Ask about a bus'},lines:[cityBranchRows[3],cityBranchRows[4]]}
    ]},cityBranchRows[2],cityBranchRows[5],cityBranchRows[6]
  ]});
  const greetingBranchRows=[
  {
    "id": "saluti-branch-1",
    "role": "customer",
    "it": "Scusa, non ho capito il tuo nome. Puoi ripeterlo più lentamente?",
    "translation": {
      "cs": "Promiň, nerozuměl jsem tvému jménu. Můžeš ho zopakovat pomaleji?",
      "en": "Sorry, I did not catch your name. Can you repeat it more slowly?",
      "it": "Scusa, non ho capito il tuo nome. Puoi ripeterlo più lentamente?"
    },
    "situation": {
      "cs": "Při představování jsi nezachytil/a jméno. Požádej o jeho pomalejší zopakování.",
      "en": "You did not catch the name during introductions. Ask for it to be repeated more slowly."
    }
  },
  {
    "id": "saluti-branch-2",
    "role": "barista",
    "it": "Certo. Mi chiamo Anna.",
    "translation": {
      "cs": "Jistě. Jmenuji se Anna.",
      "en": "Of course. My name is Anna.",
      "it": "Certo. Mi chiamo Anna."
    },
    "situation": {
      "cs": "Druhý člověk nezachytil tvé jméno. Zopakuj klidně a pomalu, že se jmenuješ Anna.",
      "en": "The other person did not catch your name. Calmly and slowly repeat that your name is Anna."
    }
  },
  {
    "id": "saluti-branch-3",
    "role": "customer",
    "it": "Scusa, come si scrive il tuo nome? Puoi fare lo spelling?",
    "translation": {
      "cs": "Promiň, jak se píše tvoje jméno? Můžeš ho vyhláskovat?",
      "en": "Sorry, how do you write your name? Can you spell it?",
      "it": "Scusa, come si scrive il tuo nome? Puoi fare lo spelling?"
    },
    "situation": {
      "cs": "Nejsi si jistý/á jménem. Zeptej se, jak se píše, a požádej o vyhláskování.",
      "en": "You are unsure of the name. Ask how it is written and request the spelling."
    }
  },
  {
    "id": "saluti-branch-4",
    "role": "barista",
    "it": "Certo: a, enne, enne, a. Anna.",
    "translation": {
      "cs": "Jistě: A, N, N, A. Anna.",
      "en": "Of course: A, N, N, A. Anna.",
      "it": "Certo: a, enne, enne, a. Anna."
    },
    "situation": {
      "cs": "Druhý člověk potřebuje znát zápis tvého jména. Vyhláskuj jméno Anna.",
      "en": "The other person needs to know how your name is written. Spell the name Anna."
    }
  }
];
  for(const line of greetingBranchRows)audioFiles[line.it]=line.id+'.mp3';
  const greetingBranchLesson=lessons.find(l=>l.id==='saluti');
  greetingBranchLesson.dialogueVariants.push({id:'saluti-v2',title:{cs:'Nerozumím jménu · dvě cesty',en:'Did not catch the name · two paths'},lines:[
    greetingBranchLesson.dialogue[0],
    {...greetingBranchRows[0],branchTitle:{cs:'Nezachytil/a jsi jméno. Jak pokračovat?',en:'You did not catch the name. What next?'},branches:[
      {id:'repeat',title:{cs:'Požádat o zopakování',en:'Ask to repeat it'},lines:[greetingBranchRows[0],greetingBranchRows[1]]},
      {id:'spell',title:{cs:'Požádat o vyhláskování',en:'Ask to spell it'},lines:[greetingBranchRows[2],greetingBranchRows[3]]}
    ]},greetingBranchRows[1],...greetingBranchLesson.dialogue.slice(1,4)
  ]});
  const pastBranchRows=[
  {
    "id": "passato-branch-1",
    "role": "barista",
    "it": "Ieri la nostra gita a Siena non è andata come previsto.",
    "translation": {
      "cs": "Včera náš výlet do Sieny nevyšel podle plánu.",
      "en": "Yesterday our trip to Siena did not go as planned.",
      "it": "Ieri la nostra gita a Siena non è andata come previsto."
    },
    "situation": {
      "cs": "Včerejší výlet do Sieny nevyšel podle plánu. Zahaj vyprávění o změně programu.",
      "en": "Yesterday’s trip to Siena did not go as planned. Introduce the change of plans."
    }
  },
  {
    "id": "passato-branch-2",
    "role": "customer",
    "it": "Che cosa è successo? Perché non siete andate a Siena?",
    "translation": {
      "cs": "Co se stalo? Proč jste nejely do Sieny?",
      "en": "What happened? Why did you not go to Siena?",
      "it": "Che cosa è successo? Perché non siete andate a Siena?"
    },
    "situation": {
      "cs": "Kamarádce nevyšel výlet. Zjisti, co se stalo a proč nejely do Sieny.",
      "en": "Your friend’s trip did not work out. Ask what happened and why they did not go to Siena."
    }
  },
  {
    "id": "passato-branch-3",
    "role": "barista",
    "it": "Abbiamo perso l’autobus e siamo rimaste a Firenze.",
    "translation": {
      "cs": "Ujel nám autobus a zůstaly jsme ve Florencii.",
      "en": "We missed the bus and stayed in Florence.",
      "it": "Abbiamo perso l’autobus e siamo rimaste a Firenze."
    },
    "situation": {
      "cs": "Vysvětli, že vám ujel autobus a zůstaly jste ve Florencii.",
      "en": "Explain that you missed the bus and stayed in Florence."
    }
  },
  {
    "id": "passato-branch-4",
    "role": "customer",
    "it": "Che cosa avete fatto invece della gita?",
    "translation": {
      "cs": "Co jste dělaly místo výletu?",
      "en": "What did you do instead of the trip?",
      "it": "Che cosa avete fatto invece della gita?"
    },
    "situation": {
      "cs": "Plánovaný výlet nevyšel. Zeptej se, jaký náhradní program si kamarádky vybraly.",
      "en": "The planned trip did not work out. Ask what your friends did instead."
    }
  },
  {
    "id": "passato-branch-5",
    "role": "barista",
    "it": "Siamo rimaste a Firenze e abbiamo visitato un museo.",
    "translation": {
      "cs": "Zůstaly jsme ve Florencii a navštívily jsme muzeum.",
      "en": "We stayed in Florence and visited a museum.",
      "it": "Siamo rimaste a Firenze e abbiamo visitato un museo."
    },
    "situation": {
      "cs": "Popiš náhradní program: zůstaly jste ve Florencii a navštívily muzeum.",
      "en": "Describe the alternative plan: you stayed in Florence and visited a museum."
    }
  },
  {
    "id": "passato-branch-6",
    "role": "customer",
    "it": "Alla fine avete passato una bella giornata?",
    "translation": {
      "cs": "Nakonec jste si užily hezký den?",
      "en": "Did you have a nice day in the end?",
      "it": "Alla fine avete passato una bella giornata?"
    },
    "situation": {
      "cs": "Už víš, že se plán změnil. Zjisti, zda si kamarádky den přesto užily.",
      "en": "You know the plan changed. Ask whether your friends enjoyed the day after all."
    }
  },
  {
    "id": "passato-branch-7",
    "role": "barista",
    "it": "Sì, abbiamo cambiato programma e ci siamo divertite lo stesso.",
    "translation": {
      "cs": "Ano, změnily jsme program a přesto jsme se bavily.",
      "en": "Yes, we changed our plans and enjoyed ourselves anyway.",
      "it": "Sì, abbiamo cambiato programma e ci siamo divertite lo stesso."
    },
    "situation": {
      "cs": "Zhodnoť den pozitivně: změnily jste program, ale přesto jste se bavily.",
      "en": "End on a positive note: you changed plans but enjoyed yourselves anyway."
    }
  }
];
  for(const line of pastBranchRows)audioFiles[line.it]=line.id+'.mp3';
  const pastBranchLesson=lessons.find(l=>l.id==='passato');
  pastBranchLesson.dialogueVariants.push({id:'passato-v2',title:{cs:'Výlet nevyšel podle plánu · dvě cesty',en:'Trip did not go as planned · two paths'},lines:[
    pastBranchLesson.dialogue[0],pastBranchRows[0],
    {...pastBranchRows[1],branchTitle:{cs:'Výlet nevyšel. Na co se zeptáš?',en:'The trip did not work out. What will you ask?'},branches:[
      {id:'problem',title:{cs:'Zjistit, co se pokazilo',en:'Ask what went wrong'},lines:[pastBranchRows[1],pastBranchRows[2]]},
      {id:'alternative',title:{cs:'Zjistit náhradní program',en:'Ask what they did instead'},lines:[pastBranchRows[3],pastBranchRows[4]]}
    ]},pastBranchRows[2],pastBranchRows[5],pastBranchRows[6]
  ]});
  const storyBranchRows=[
  {
    "id": "racconto-branch-1",
    "role": "barista",
    "it": "Ieri siamo arrivati in ritardo al museo.",
    "translation": {
      "cs": "Včera jsme přijeli do muzea pozdě.",
      "en": "Yesterday we arrived late at the museum.",
      "it": "Ieri siamo arrivati in ritardo al museo."
    },
    "situation": {
      "cs": "Vyprávěj, že jste včera přijeli do muzea pozdě.",
      "en": "Say that you arrived late at the museum yesterday."
    }
  },
  {
    "id": "racconto-branch-2",
    "role": "customer",
    "it": "Perché siete arrivati in ritardo?",
    "translation": {
      "cs": "Proč jste přijeli pozdě?",
      "en": "Why did you arrive late?",
      "it": "Perché siete arrivati in ritardo?"
    },
    "situation": {
      "cs": "Zajímá tě příčina pozdního příjezdu. Zeptej se, proč se zpozdili.",
      "en": "You want to know the cause of the late arrival. Ask why they were delayed."
    }
  },
  {
    "id": "racconto-branch-3",
    "role": "barista",
    "it": "Il treno era in ritardo perché pioveva forte.",
    "translation": {
      "cs": "Vlak měl zpoždění, protože silně pršelo.",
      "en": "The train was delayed because it was raining heavily.",
      "it": "Il treno era in ritardo perché pioveva forte."
    },
    "situation": {
      "cs": "Vysvětli příčinu: vlak měl zpoždění kvůli silnému dešti.",
      "en": "Explain the cause: the train was delayed because of heavy rain."
    }
  },
  {
    "id": "racconto-branch-4",
    "role": "customer",
    "it": "E quali conseguenze ha avuto il ritardo?",
    "translation": {
      "cs": "A jaké následky mělo to zpoždění?",
      "en": "And what consequences did the delay have?",
      "it": "E quali conseguenze ha avuto il ritardo?"
    },
    "situation": {
      "cs": "Zajímá tě následek pozdního příjezdu. Zeptej se, jak zpoždění ovlivnilo program.",
      "en": "You want to know the effect of arriving late. Ask how the delay affected their plans."
    }
  },
  {
    "id": "racconto-branch-5",
    "role": "barista",
    "it": "Abbiamo perso la visita guidata, quindi abbiamo cambiato programma.",
    "translation": {
      "cs": "Zmeškali jsme komentovanou prohlídku, a tak jsme změnili program.",
      "en": "We missed the guided tour, so we changed our plans.",
      "it": "Abbiamo perso la visita guidata, quindi abbiamo cambiato programma."
    },
    "situation": {
      "cs": "Popiš následek: zmeškali jste komentovanou prohlídku, a proto změnili program.",
      "en": "Describe the consequence: you missed the guided tour, so you changed your plans."
    }
  },
  {
    "id": "racconto-branch-6",
    "role": "customer",
    "it": "Siete riusciti a visitare il museo lo stesso?",
    "translation": {
      "cs": "Podařilo se vám přesto navštívit muzeum?",
      "en": "Did you still manage to visit the museum?",
      "it": "Siete riusciti a visitare il museo lo stesso?"
    },
    "situation": {
      "cs": "Zjisti, zda se i přes zpoždění podařilo muzeum navštívit.",
      "en": "Ask whether they managed to visit the museum despite the delay."
    }
  },
  {
    "id": "racconto-branch-7",
    "role": "barista",
    "it": "Sì, abbiamo visitato il museo da soli. Anche senza guida, la visita è stata interessante.",
    "translation": {
      "cs": "Ano, prohlédli jsme si muzeum sami. I bez průvodce byla návštěva zajímavá.",
      "en": "Yes, we visited the museum on our own. Even without a guide, the visit was interesting.",
      "it": "Sì, abbiamo visitato il museo da soli. Anche senza guida, la visita è stata interessante."
    },
    "situation": {
      "cs": "Uzavři příběh: muzeum jste si prošli sami a návštěva byla zajímavá i bez průvodce.",
      "en": "Conclude the story: you explored the museum on your own and enjoyed the visit without a guide."
    }
  }
];
  for(const line of storyBranchRows)audioFiles[line.it]=line.id+'.mp3';
  const storyBranchLesson=lessons.find(l=>l.id==='racconto');
  storyBranchLesson.dialogueVariants.push({id:'racconto-v2',title:{cs:'Příčina a následek · dvě cesty',en:'Cause and consequence · two paths'},lines:[
    storyBranchLesson.dialogue[0],storyBranchRows[0],
    {...storyBranchRows[1],branchTitle:{cs:'Přijeli pozdě. Co chceš zjistit?',en:'They arrived late. What do you want to know?'},branches:[
      {id:'cause',title:{cs:'Zjistit příčinu',en:'Ask about the cause'},lines:[storyBranchRows[1],storyBranchRows[2]]},
      {id:'effect',title:{cs:'Zjistit následek',en:'Ask about the consequence'},lines:[storyBranchRows[3],storyBranchRows[4]]}
    ]},storyBranchRows[2],storyBranchRows[5],storyBranchRows[6]
  ]});
  const plansBranchRows=[
  {
    "id": "progetti-branch-1",
    "role": "customer",
    "it": "Ti andrebbe di andare a Lucca sabato mattina?",
    "translation": {
      "cs": "Chtěla bys jet do Luccy v sobotu ráno?",
      "en": "Would you like to go to Lucca on Saturday morning?",
      "it": "Ti andrebbe di andare a Lucca sabato mattina?"
    },
    "situation": {
      "cs": "Zdvořile navrhni společný výlet do Luccy v sobotu ráno.",
      "en": "Politely suggest a trip to Lucca together on Saturday morning."
    }
  },
  {
    "id": "progetti-branch-2",
    "role": "barista",
    "it": "Mi piacerebbe, ma sabato non posso. Ho già un impegno.",
    "translation": {
      "cs": "Ráda bych, ale v sobotu nemůžu. Už něco mám.",
      "en": "I would like to, but I cannot on Saturday. I already have a commitment.",
      "it": "Mi piacerebbe, ma sabato non posso. Ho già un impegno."
    },
    "situation": {
      "cs": "O výlet stojíš, ale v sobotu už něco máš. Zdvořile odmítni tento termín.",
      "en": "You would like to go, but already have plans on Saturday. Politely decline that date."
    }
  },
  {
    "id": "progetti-branch-3",
    "role": "customer",
    "it": "Potremmo andare domenica mattina. Ti andrebbe bene?",
    "translation": {
      "cs": "Mohli bychom jet v neděli ráno. Vyhovovalo by ti to?",
      "en": "We could go on Sunday morning. Would that suit you?",
      "it": "Potremmo andare domenica mattina. Ti andrebbe bene?"
    },
    "situation": {
      "cs": "Sobota druhému nevyhovuje. Zdvořile nabídni nedělní ráno.",
      "en": "Saturday does not suit your friend. Politely suggest Sunday morning."
    }
  },
  {
    "id": "progetti-branch-4",
    "role": "barista",
    "it": "Sì, domenica mattina va bene. Potremmo incontrarci alle nove.",
    "translation": {
      "cs": "Ano, nedělní ráno vyhovuje. Mohli bychom se sejít v devět.",
      "en": "Yes, Sunday morning works. We could meet at nine.",
      "it": "Sì, domenica mattina va bene. Potremmo incontrarci alle nove."
    },
    "situation": {
      "cs": "Přijmi nedělní ráno a navrhni sraz v devět hodin.",
      "en": "Accept Sunday morning and suggest meeting at nine."
    }
  },
  {
    "id": "progetti-branch-5",
    "role": "customer",
    "it": "Capisco. Quando saresti libera?",
    "translation": {
      "cs": "Rozumím. Kdy bys měla volno?",
      "en": "I understand. When would you be free?",
      "it": "Capisco. Quando saresti libera?"
    },
    "situation": {
      "cs": "Sobota nevyhovuje. Nech druhou osobu navrhnout vhodný termín.",
      "en": "Saturday does not work. Let the other person suggest a suitable time."
    }
  },
  {
    "id": "progetti-branch-6",
    "role": "barista",
    "it": "Sarei libera domenica pomeriggio. Potremmo incontrarci alle due.",
    "translation": {
      "cs": "Měla bych volno v neděli odpoledne. Mohli bychom se sejít ve dvě.",
      "en": "I would be free on Sunday afternoon. We could meet at two.",
      "it": "Sarei libera domenica pomeriggio. Potremmo incontrarci alle due."
    },
    "situation": {
      "cs": "Nabídni nedělní odpoledne a navrhni sraz ve dvě hodiny.",
      "en": "Offer Sunday afternoon and suggest meeting at two."
    }
  },
  {
    "id": "progetti-branch-7",
    "role": "customer",
    "it": "Perfetto, per me va bene. Ci vediamo davanti alla stazione.",
    "translation": {
      "cs": "Výborně, mně to vyhovuje. Uvidíme se před nádražím.",
      "en": "Perfect, that works for me. See you in front of the station.",
      "it": "Perfetto, per me va bene. Ci vediamo davanti alla stazione."
    },
    "situation": {
      "cs": "Přijmi domluvený čas a upřesni místo srazu před nádražím.",
      "en": "Accept the agreed time and specify meeting in front of the station."
    }
  },
  {
    "id": "progetti-branch-8",
    "role": "barista",
    "it": "D’accordo. Controllerò gli orari dei treni e ti manderò un messaggio.",
    "translation": {
      "cs": "Dobře. Zkontroluji časy vlaků a pošlu ti zprávu.",
      "en": "All right. I will check the train times and send you a message.",
      "it": "D’accordo. Controllerò gli orari dei treni e ti manderò un messaggio."
    },
    "situation": {
      "cs": "Potvrď dohodu a převezmi ověření vlakového spojení.",
      "en": "Confirm the arrangement and offer to check the train connections."
    }
  }
];
  for(const line of plansBranchRows)audioFiles[line.it]=line.id+'.mp3';
  const plansBranchLesson=lessons.find(l=>l.id==='progetti');
  plansBranchLesson.dialogueVariants.push({id:'progetti-v2',title:{cs:'Termín nevyhovuje · dvě cesty',en:'The time does not suit · two paths'},lines:[
    plansBranchRows[0],plansBranchRows[1],
    {...plansBranchRows[2],branchTitle:{cs:'Sobota nevyhovuje. Jak se domluvíte?',en:'Saturday does not work. How will you agree?'},branches:[
      {id:'suggest',title:{cs:'Navrhnout jiný termín',en:'Suggest another time'},lines:[plansBranchRows[2],plansBranchRows[3]]},
      {id:'ask',title:{cs:'Zeptat se, kdy má čas',en:'Ask when she is free'},lines:[plansBranchRows[4],plansBranchRows[5]]}
    ]},plansBranchRows[3],plansBranchRows[6],plansBranchRows[7]
  ]});
  const opinionBranchRows=[
  {
    "id": "opinioni-branch-1",
    "role": "customer",
    "it": "Secondo me, dovremmo visitare il centro con una guida. Credo che sia il modo migliore per conoscere la città.",
    "translation": {
      "cs": "Podle mě bychom si měli prohlédnout centrum s průvodcem. Myslím, že je to nejlepší způsob, jak poznat město.",
      "en": "In my opinion, we should visit the centre with a guide. I think it is the best way to get to know the city.",
      "it": "Secondo me, dovremmo visitare il centro con una guida. Credo che sia il modo migliore per conoscere la città."
    },
    "situation": {
      "cs": "Vyjádři názor, že prohlídka s průvodcem je nejlepší způsob poznávání města.",
      "en": "Express your opinion that a guided tour is the best way to get to know the city."
    }
  },
  {
    "id": "opinioni-branch-2",
    "role": "barista",
    "it": "Non sono del tutto d’accordo. Preferirei visitare il centro da sola.",
    "translation": {
      "cs": "Úplně nesouhlasím. Raději bych si centrum prohlédla sama.",
      "en": "I do not entirely agree. I would prefer to explore the centre on my own.",
      "it": "Non sono del tutto d’accordo. Preferirei visitare il centro da sola."
    },
    "situation": {
      "cs": "Zdvořile vyjádři nesouhlas a řekni, že upřednostňuješ samostatnou prohlídku.",
      "en": "Politely disagree and explain that you prefer exploring independently."
    }
  },
  {
    "id": "opinioni-branch-3",
    "role": "customer",
    "it": "Capisco. Potresti spiegarmi perché preferisci andare da sola?",
    "translation": {
      "cs": "Rozumím. Mohla bys mi vysvětlit, proč raději chodíš sama?",
      "en": "I understand. Could you explain why you prefer going on your own?",
      "it": "Capisco. Potresti spiegarmi perché preferisci andare da sola?"
    },
    "situation": {
      "cs": "Druhá osoba nesouhlasí. Reaguj klidně a požádej ji o vysvětlení důvodů.",
      "en": "The other person disagrees. Respond calmly and ask her to explain her reasons."
    }
  },
  {
    "id": "opinioni-branch-4",
    "role": "barista",
    "it": "Per me è importante poter scegliere il percorso e fermarmi quando voglio, senza seguire un orario fisso.",
    "translation": {
      "cs": "Pro mě je důležité moci si vybrat trasu a zastavit se, kdy chci, bez pevného časového programu.",
      "en": "For me, it is important to choose my route and stop whenever I want, without following a fixed schedule.",
      "it": "Per me è importante poter scegliere il percorso e fermarmi quando voglio, senza seguire un orario fisso."
    },
    "situation": {
      "cs": "Vysvětli svůj důvod: chceš si volit trasu a zastávky bez pevného programu.",
      "en": "Explain your reason: you want to choose your route and stops without a fixed schedule."
    }
  },
  {
    "id": "opinioni-branch-5",
    "role": "customer",
    "it": "Potremmo fare una visita guidata breve e poi continuare da soli. Che ne pensi?",
    "translation": {
      "cs": "Mohli bychom absolvovat krátkou prohlídku s průvodcem a pak pokračovat sami. Co si o tom myslíš?",
      "en": "We could take a short guided tour and then continue on our own. What do you think?",
      "it": "Potremmo fare una visita guidata breve e poi continuare da soli. Che ne pensi?"
    },
    "situation": {
      "cs": "Navrhni kompromis: krátkou prohlídku s průvodcem a potom vlastní program.",
      "en": "Suggest a compromise: a short guided tour followed by independent exploring."
    }
  },
  {
    "id": "opinioni-branch-6",
    "role": "barista",
    "it": "Mi sembra un buon compromesso, purché la visita non duri troppo.",
    "translation": {
      "cs": "To mi připadá jako dobrý kompromis, pokud prohlídka nebude trvat příliš dlouho.",
      "en": "That seems like a good compromise, provided the tour does not last too long.",
      "it": "Mi sembra un buon compromesso, purché la visita non duri troppo."
    },
    "situation": {
      "cs": "Přijmi kompromis s podmínkou, že prohlídka nebude příliš dlouhá.",
      "en": "Accept the compromise on condition that the tour is not too long."
    }
  },
  {
    "id": "opinioni-branch-7",
    "role": "customer",
    "it": "Prima di decidere, confrontiamo la durata e il prezzo delle visite.",
    "translation": {
      "cs": "Než se rozhodneme, porovnejme délku a cenu prohlídek.",
      "en": "Before deciding, let’s compare the duration and price of the tours.",
      "it": "Prima di decidere, confrontiamo la durata e il prezzo delle visite."
    },
    "situation": {
      "cs": "Navrhni další krok před rozhodnutím: porovnat délku a cenu prohlídek.",
      "en": "Suggest the next step before deciding: compare tour duration and price."
    }
  },
  {
    "id": "opinioni-branch-8",
    "role": "barista",
    "it": "D’accordo. Così potremo scegliere una soluzione che vada bene a entrambi.",
    "translation": {
      "cs": "Dobře. Tak budeme moci vybrat řešení, které bude vyhovovat nám oběma.",
      "en": "All right. That way we can choose a solution that suits us both.",
      "it": "D’accordo. Così potremo scegliere una soluzione che vada bene a entrambi."
    },
    "situation": {
      "cs": "Souhlas s porovnáním možností a zdůrazni společné řešení pro oba.",
      "en": "Agree to compare the options and emphasise finding a solution that suits both of you."
    }
  }
];
  for(const line of opinionBranchRows)audioFiles[line.it]=line.id+'.mp3';
  const opinionBranchLesson=lessons.find(l=>l.id==='opinioni');
  opinionBranchLesson.dialogueVariants.push({id:'opinioni-v2',title:{cs:'Nesouhlas s názorem · dvě cesty',en:'Disagreement · two paths'},lines:[
    opinionBranchRows[0],opinionBranchRows[1],
    {...opinionBranchRows[2],branchTitle:{cs:'Anna nesouhlasí. Jak zareaguješ?',en:'Anna disagrees. How will you respond?'},branches:[
      {id:'reason',title:{cs:'Zeptat se na důvod',en:'Ask for the reason'},lines:[opinionBranchRows[2],opinionBranchRows[3]]},
      {id:'compromise',title:{cs:'Navrhnout kompromis',en:'Suggest a compromise'},lines:[opinionBranchRows[4],opinionBranchRows[5]]}
    ]},opinionBranchRows[3],opinionBranchRows[6],opinionBranchRows[7]
  ]});
  const weatherBranchRows=[
  {
    "id": "ipotesi-branch-1",
    "role": "customer",
    "it": "Che cosa potremmo fare domani, se avessimo tutta la giornata libera?",
    "translation": {
      "cs": "Co bychom mohli dělat zítra, kdybychom měli celý den volný?",
      "en": "What could we do tomorrow if we had the whole day free?",
      "it": "Che cosa potremmo fare domani, se avessimo tutta la giornata libera?"
    },
    "situation": {
      "cs": "Představ si celý volný den a zeptej se na možný společný program.",
      "en": "Imagine having a whole day free and ask about possible plans together."
    }
  },
  {
    "id": "ipotesi-branch-2",
    "role": "barista",
    "it": "Dipenderebbe dal tempo. Le previsioni sono ancora incerte.",
    "translation": {
      "cs": "Záleželo by na počasí. Předpověď je zatím nejistá.",
      "en": "It would depend on the weather. The forecast is still uncertain.",
      "it": "Dipenderebbe dal tempo. Le previsioni sono ancora incerte."
    },
    "situation": {
      "cs": "Vysvětli, že program by závisel na počasí, protože předpověď není jistá.",
      "en": "Explain that the plan would depend on the weather because the forecast is uncertain."
    }
  },
  {
    "id": "ipotesi-branch-3",
    "role": "customer",
    "it": "Se domani piovesse, che cosa potremmo fare al coperto?",
    "translation": {
      "cs": "Kdyby zítra pršelo, co bychom mohli dělat pod střechou?",
      "en": "If it rained tomorrow, what could we do indoors?",
      "it": "Se domani piovesse, che cosa potremmo fare al coperto?"
    },
    "situation": {
      "cs": "Představ si déšť. Zeptej se podmínkovou větou na program pod střechou.",
      "en": "Imagine rain. Use a conditional sentence to ask about an indoor activity."
    }
  },
  {
    "id": "ipotesi-branch-4",
    "role": "barista",
    "it": "Se piovesse, visiterei un museo, purché fosse aperto.",
    "translation": {
      "cs": "Kdyby pršelo, navštívila bych muzeum, pokud by bylo otevřené.",
      "en": "If it rained, I would visit a museum, provided it was open.",
      "it": "Se piovesse, visiterei un museo, purché fosse aperto."
    },
    "situation": {
      "cs": "Pro případ deště navrhni muzeum s podmínkou, že bude otevřené.",
      "en": "For rainy weather, suggest a museum on condition that it is open."
    }
  },
  {
    "id": "ipotesi-branch-5",
    "role": "customer",
    "it": "E se invece ci fosse il sole, dove ti piacerebbe andare?",
    "translation": {
      "cs": "A kdyby naopak svítilo slunce, kam bys ráda jela?",
      "en": "And if it were sunny instead, where would you like to go?",
      "it": "E se invece ci fosse il sole, dove ti piacerebbe andare?"
    },
    "situation": {
      "cs": "Představ si slunečné počasí. Zeptej se podmínkovou větou na místo výletu.",
      "en": "Imagine sunny weather. Use a conditional sentence to ask where to go."
    }
  },
  {
    "id": "ipotesi-branch-6",
    "role": "barista",
    "it": "Se ci fosse il sole, farei una gita in barca, a condizione che il mare fosse calmo.",
    "translation": {
      "cs": "Kdyby svítilo slunce, podnikla bych výlet lodí pod podmínkou, že by moře bylo klidné.",
      "en": "If it were sunny, I would take a boat trip, on condition that the sea was calm.",
      "it": "Se ci fosse il sole, farei una gita in barca, a condizione che il mare fosse calmo."
    },
    "situation": {
      "cs": "Za slunečného počasí navrhni výlet lodí, ale podmiň ho klidným mořem.",
      "en": "In sunny weather, suggest a boat trip, but make it conditional on calm seas."
    }
  },
  {
    "id": "ipotesi-branch-7",
    "role": "customer",
    "it": "Prima di decidere, dovremmo controllare le previsioni e gli orari.",
    "translation": {
      "cs": "Než se rozhodneme, měli bychom zkontrolovat předpověď a časy.",
      "en": "Before deciding, we should check the forecast and opening or departure times.",
      "it": "Prima di decidere, dovremmo controllare le previsioni e gli orari."
    },
    "situation": {
      "cs": "Před konečnou volbou doporuč ověřit počasí a časové možnosti programu.",
      "en": "Before making the final choice, recommend checking the weather and timing of the activity."
    }
  },
  {
    "id": "ipotesi-branch-8",
    "role": "barista",
    "it": "Sono d’accordo. Se il tempo cambiasse, potremmo modificare il programma.",
    "translation": {
      "cs": "Souhlasím. Kdyby se počasí změnilo, mohli bychom program upravit.",
      "en": "I agree. If the weather changed, we could adjust our plans.",
      "it": "Sono d’accordo. Se il tempo cambiasse, potremmo modificare il programma."
    },
    "situation": {
      "cs": "Souhlas s ověřením a připomeň možnost změnit program při změně počasí.",
      "en": "Agree to check and point out that you could adjust your plans if the weather changed."
    }
  }
];
  for(const line of weatherBranchRows)audioFiles[line.it]=line.id+'.mp3';
  const weatherBranchLesson=lessons.find(l=>l.id==='ipotesi');
  weatherBranchLesson.dialogueVariants.push({id:'ipotesi-v2',title:{cs:'Déšť, nebo slunce · dvě cesty',en:'Rain or sunshine · two paths'},lines:[
    weatherBranchRows[0],weatherBranchRows[1],
    {...weatherBranchRows[2],branchTitle:{cs:'Počasí je nejisté. Kterou možnost promyslíš?',en:'The weather is uncertain. Which possibility will you explore?'},branches:[
      {id:'rain',title:{cs:'Kdyby pršelo',en:'If it rained'},lines:[weatherBranchRows[2],weatherBranchRows[3]]},
      {id:'sun',title:{cs:'Kdyby svítilo slunce',en:'If it were sunny'},lines:[weatherBranchRows[4],weatherBranchRows[5]]}
    ]},weatherBranchRows[3],weatherBranchRows[6],weatherBranchRows[7]
  ]});
  const formalBranchRows=[
  {
    "id": "registro-branch-1",
    "role": "customer",
    "it": "Buongiorno, signora Novák. Sono Marco Rossi. Quando desidera fissare un appuntamento?",
    "translation": {
      "cs": "Dobrý den, paní Novák. Jsem Marco Rossi. Kdy si přejete domluvit schůzku?",
      "en": "Good morning, Ms Novák. I am Marco Rossi. When would you like to arrange an appointment?",
      "it": "Buongiorno, signora Novák. Sono Marco Rossi. Quando desidera fissare un appuntamento?"
    },
    "situation": {
      "cs": "Jsi Marco Rossi. Formálně oslov paní Novák a zeptej se na termín schůzky.",
      "en": "You are Marco Rossi. Address Ms Novák formally and ask about an appointment date."
    }
  },
  {
    "id": "registro-branch-2",
    "role": "barista",
    "it": "Buongiorno. Vorrei fissare un appuntamento la prossima settimana.",
    "translation": {
      "cs": "Dobrý den. Ráda bych si domluvila schůzku na příští týden.",
      "en": "Good morning. I would like to arrange an appointment next week.",
      "it": "Buongiorno. Vorrei fissare un appuntamento la prossima settimana."
    },
    "situation": {
      "cs": "Formálně požádej o schůzku na příští týden, zatím bez konkrétního dne.",
      "en": "Formally request an appointment next week without specifying a day yet."
    }
  },
  {
    "id": "registro-branch-3",
    "role": "customer",
    "it": "Potrebbe precisare quale giorno e a che ora Le sarebbe più comodo?",
    "translation": {
      "cs": "Mohla byste upřesnit, který den a v kolik hodin by Vám to nejlépe vyhovovalo?",
      "en": "Could you clarify which day and time would be most convenient for you?",
      "it": "Potrebbe precisare quale giorno e a che ora Le sarebbe più comodo?"
    },
    "situation": {
      "cs": "Odpověď je příliš obecná. S vykáním požádej o konkrétní den a čas.",
      "en": "The answer is too general. Formally request a specific day and time."
    }
  },
  {
    "id": "registro-branch-4",
    "role": "barista",
    "it": "Martedì alle dieci sarebbe perfetto, se per Lei va bene.",
    "translation": {
      "cs": "Úterý v deset by bylo ideální, pokud Vám to vyhovuje.",
      "en": "Tuesday at ten would be perfect, if that suits you.",
      "it": "Martedì alle dieci sarebbe perfetto, se per Lei va bene."
    },
    "situation": {
      "cs": "Upřesni, že by ti vyhovovalo úterý v deset, a zohledni druhou stranu.",
      "en": "Specify Tuesday at ten as your preference and check that it suits the other person."
    }
  },
  {
    "id": "registro-branch-5",
    "role": "customer",
    "it": "La prossima settimana non abbiamo disponibilità. Le andrebbe bene il lunedì successivo alle quindici?",
    "translation": {
      "cs": "Příští týden nemáme volný termín. Vyhovovalo by Vám následující pondělí v patnáct hodin?",
      "en": "We have no availability next week. Would the following Monday at three p.m. suit you?",
      "it": "La prossima settimana non abbiamo disponibilità. Le andrebbe bene il lunedì successivo alle quindici?"
    },
    "situation": {
      "cs": "Příští týden je obsazený. Zdvořile nabídni pondělí následujícího týdne v patnáct hodin.",
      "en": "Next week is fully booked. Politely offer Monday of the following week at three p.m."
    }
  },
  {
    "id": "registro-branch-6",
    "role": "barista",
    "it": "Sì, quel lunedì alle quindici mi va bene. La ringrazio per la proposta.",
    "translation": {
      "cs": "Ano, to pondělí v patnáct hodin mi vyhovuje. Děkuji Vám za návrh.",
      "en": "Yes, that Monday at three p.m. suits me. Thank you for the suggestion.",
      "it": "Sì, quel lunedì alle quindici mi va bene. La ringrazio per la proposta."
    },
    "situation": {
      "cs": "Přijmi navržené pondělí v patnáct hodin a formálně poděkuj.",
      "en": "Accept the proposed Monday at three p.m. and thank the other person formally."
    }
  },
  {
    "id": "registro-branch-7",
    "role": "customer",
    "it": "Perfetto, confermo l’appuntamento. Le invierò una conferma scritta con la data e l’orario.",
    "translation": {
      "cs": "Výborně, schůzku potvrzuji. Zašlu Vám písemné potvrzení s datem a časem.",
      "en": "Perfect, I confirm the appointment. I will send you written confirmation with the date and time.",
      "it": "Perfetto, confermo l’appuntamento. Le invierò una conferma scritta con la data e l’orario."
    },
    "situation": {
      "cs": "Potvrď domluvenou schůzku a přislíb písemné potvrzení data a času.",
      "en": "Confirm the agreed appointment and promise written confirmation of the date and time."
    }
  },
  {
    "id": "registro-branch-8",
    "role": "barista",
    "it": "La ringrazio. Resto in attesa della conferma. Arrivederci.",
    "translation": {
      "cs": "Děkuji Vám. Očekávám potvrzení. Na shledanou.",
      "en": "Thank you. I look forward to the confirmation. Goodbye.",
      "it": "La ringrazio. Resto in attesa della conferma. Arrivederci."
    },
    "situation": {
      "cs": "Formálně poděkuj, potvrď očekávání písemného potvrzení a rozluč se.",
      "en": "Thank the other person formally, acknowledge that you await confirmation and say goodbye."
    }
  }
];
  for(const line of formalBranchRows)audioFiles[line.it]=line.id+'.mp3';
  const formalBranchLesson=lessons.find(l=>l.id==='registro');
  formalBranchLesson.dialogueVariants.push({id:'registro-v2',title:{cs:'Upřesnění nebo jiný termín · dvě cesty',en:'Clarification or another date · two paths'},lines:[
    formalBranchRows[0],formalBranchRows[1],
    {...formalBranchRows[2],branchTitle:{cs:'Příští týden. Co potřebuješ domluvit?',en:'Next week. What do you need to arrange?'},branches:[
      {id:'clarify',title:{cs:'Požádat o upřesnění',en:'Ask for clarification'},lines:[formalBranchRows[2],formalBranchRows[3]]},
      {id:'reschedule',title:{cs:'Navrhnout jiný termín',en:'Suggest another date'},lines:[formalBranchRows[4],formalBranchRows[5]]}
    ]},formalBranchRows[3],formalBranchRows[6],formalBranchRows[7]
  ]});
  const data = {version:1, lessons, photos, illustrations, lessonIllustrations, audioFiles};
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.ItalianData = data;
})(typeof window !== 'undefined' ? window : globalThis);
