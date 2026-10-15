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
    grammar('ristorante-menu','Per scegliere i piatti: Posso vedere il ___, per favore?',['menù'],['menù','conto','tavolo','bicchiere'],'Před objednáním požádáš o menù, jídelní lístek.','Before ordering, ask for the menù, the menu.','Prima di ordinare chiedi il menù.'),
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
    grammar('hotel-time','___ che ora devo lasciare la camera?',['A'],['A','In','Da','Su'],'A che ora? = V kolik hodin?','A che ora? means At what time?','A che ora introduce una domanda sull’orario.'),
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
  const data = {version:1, lessons, photos, illustrations, lessonIllustrations, audioFiles};
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.ItalianData = data;
})(typeof window !== 'undefined' ? window : globalThis);
