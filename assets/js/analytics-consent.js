// First-party consent UI. Google Analytics is loaded only after an explicit opt-in.
(function () {
  'use strict';
  if (window.__cestovatelAnalyticsInstalled) return;
  window.__cestovatelAnalyticsInstalled = true;
  const MEASUREMENT_ID = 'G-BM11EHQG00';
  // BEGIN APPROVED YOUTUBE CAMPAIGNS
  const YOUTUBE_CAMPAIGNS = {"ZxToo_ahyIE":{"campaign":"monsanto-portugalska-vesnice-mezi-obrimi-balvany","title":"Monsanto | Portugalská vesnice mezi obřími balvany"},"MQquyHaOKqg":{"campaign":"civita-di-bagnoregio-mesto-na-skale-ktere-umira","title":"Civita di Bagnoregio | Město na skále, které umírá"},"CkCXHlf3XI4":{"campaign":"sest-vodnich-mlynu-v-cesku-cesty-s-pribehem","title":"Šest vodních mlýnů v Česku | Cesty s příběhem"},"-5uDmAUEkQM":{"campaign":"sopky-neapolskeho-zalivu-vesuv-pompeje-flegrejsk","title":"Sopky Neapolského zálivu | Vesuv, Pompeje, Flegrejská pole a ostrovy"},"F6gf5psaeN0":{"campaign":"chorvatsko-7-skrytych-klenotu-od-istrie-po-pelje","title":"Chorvatsko | 7 skrytých klenotů od Istrie po Pelješac"},"vgt36LdshZ0":{"campaign":"toskansko-italie-vsemi-smysly-1-dil","title":"Toskánsko – Itálie všemi smysly (1. díl)"},"KIXA5yxV6-U":{"campaign":"cesky-raj-putovani-mezi-skalami-hrady-a-rybniky","title":"Český ráj | Putování mezi skalami, hrady a rybníky"},"F5LfyoJ--Sw":{"campaign":"slovinsko-7-skrytych-klenotu-od-smaragdove-soci","title":"Slovinsko | 7 skrytých klenotů od smaragdové Soči po horské vesnice"},"ZoYeyDNLXVI":{"campaign":"z-hadru-vznikal-papir-pribeh-papirny-ktera-prezi","title":"Z hadrů vznikal papír: příběh papírny, která přežila staletí | Cesty s příběhem"},"x_nxi5Y2FI8":{"campaign":"francie-skalni-vesnice-troo-a-rochemenier","title":"Francie | Skalní vesnice Trôo a Rochemenier"},"bSP5eAgbMAQ":{"campaign":"recko-5-skrytych-klenotu-od-horskych-vesnic-po-o","title":"Řecko | 5 skrytých klenotů od horských vesnic po ostrov Chios"},"hqDFJFh8dak":{"campaign":"hoslovicky-mlyn-jak-se-zilo-a-pracovalo-u-vody-c","title":"Hoslovický mlýn: Jak se žilo a pracovalo u vody | Cesty s příběhem"},"hn1DCEvz7vA":{"campaign":"spanelsko-7-skrytych-klenotu-ktere-stoji-za-obje","title":"Španělsko | 7 skrytých klenotů, které stojí za objevení"},"sbYmp3SHiPA":{"campaign":"portugalsko-7-skrytych-klenotu-od-kamennych-vesn","title":"Portugalsko | 7 skrytých klenotů od kamenných vesnic po Atlantik"},"CLzoSLbxuSQ":{"campaign":"italie-skryte-klenoty-od-rasiglie-po-sardinii","title":"Itálie | Skryté klenoty od Rasiglie po Sardinii"},"LyomY8K6vxw":{"campaign":"evropa-fotograficka-cesta-s-ludkem-po-mestech-ho","title":"Evropa | Fotografická cesta s Luďkem po městech, horách a pobřeží"},"WMa86-VWYjA":{"campaign":"jak-vznikla-ucetni-kniha-od-excelu-k-vlastni-apl","title":"Jak vznikla Účetní kniha | Od Excelu k vlastní aplikaci"},"XOI-wEXWe7o":{"campaign":"z-kabiny-autobusu-do-kodu-cesty-aplikace-a-chytr","title":"Z kabiny autobusu do kódu | Cesty, aplikace a chytrá domácnost"},"Vy4qh0jMrno":{"campaign":"italstina-na-cesty-kompletni-pruvodce-lekcemi-a","title":"Italština na cesty | Kompletní průvodce lekcemi a procvičováním"},"GzZ4oiIPhBI":{"campaign":"vesuv-u-krateru-nad-neapolskym-zalivem","title":"Vesuv | U kráteru nad Neapolským zálivem"},"n_8BtNz0RiQ":{"campaign":"val-d-orcia-a-crete-senesi-toskanske-kopce-a-cyp","title":"Val d’Orcia a Crete Senesi | Toskánské kopce a cypřišová alej"},"BbLW3leadd8":{"campaign":"rozhledna-u-borovice-letecky-pohled-na-roprachti","title":"Rozhledna U Borovice | Letecký pohled na Roprachtice"},"OUvDBXV72G4":{"campaign":"turin-namesti-san-carlo-kralovsky-palac-a-zivot","title":"Turín | Náměstí San Carlo, Královský palác a život v ulicích"},"kc1Wv4uChWU":{"campaign":"spiagge-bianche-bile-pobrezi-jeho-puvod-a-okoli","title":"Spiagge Bianche | Bílé pobřeží, jeho původ a okolí Vady"},"yaCG9vW9E8s":{"campaign":"siena-ulickami-ke-katedrale-a-namesti-piazza-del","title":"Siena | Uličkami ke katedrále a náměstí Piazza del Campo"},"xhMvP3rZP6g":{"campaign":"saturnia-a-bagni-san-filippo-termalni-kaskady-a","title":"Saturnia a Bagni San Filippo | Termální kaskády a Balena Bianca"},"BVlaMY7bclo":{"campaign":"positano-plavba-pres-sorrento-ulicky-a-kostel-sa","title":"Positano | Plavba přes Sorrento, uličky a kostel Santa Maria Assunta"},"GFPBv5M4aZI":{"campaign":"pompeje-anticke-mesto-pod-vesuvem-divadla-lazne","title":"Pompeje | Antické město pod Vesuvem: divadla, lázně a fórum"},"ONu6mGwWB9M":{"campaign":"pisa-sikma-vez-baptisterium-a-namesti-zazraku","title":"Pisa | Šikmá věž, baptisterium a náměstí zázraků"},"dNqBzx2iZoA":{"campaign":"petrohrad-pamatky-neva-a-jizda-mestem","title":"Petrohrad | Památky, Něva a jízda městem"},"LBh2QtdlQGg":{"campaign":"neapol-spanelska-ctvrt-plebiscito-galerie-umbert","title":"Neapol | Španělská čtvrť, Plebiscito, galerie Umberto a metro Toledo"},"dv-Ez3CWaKg":{"campaign":"na-kruhach-v-semilech-jizera-tenis-a-pribehy-ctv","title":"Na Kruhách v Semilech | Jizera, tenis a příběhy čtvrti z dronu"},"9l7TWwhdBkE":{"campaign":"montepulciano-renesancni-ulicky-vinne-sklepy-a-p","title":"Montepulciano | Renesanční uličky, vinné sklepy a Pulcinella"},"ojMSQ78NK8A":{"campaign":"kozakov-rozhledna-a-krajina-ceskeho-raje-z-dronu","title":"Kozákov | Rozhledna a krajina Českého ráje z dronu"},"ZPBAu8_OK2c":{"campaign":"ferrari-muzea-v-modene-a-maranellu-automobily-a","title":"Ferrari | Muzea v Modeně a Maranellu, automobily a Fiorano"},"1yQyAeOyAcc":{"campaign":"benatky-pres-lagunu-ke-gondolam-palaci-a-bazilic","title":"Benátky | Přes lagunu ke gondolám, paláci a bazilice"},"iMRAilHSb6M":{"campaign":"amalfi-lodi-do-mesta-ke-katedrale-a-po-pobrezi","title":"Amalfi | Lodí do města, ke katedrále a po pobřeží"},"Tdi3HKUyo_0":{"campaign":"moje-ucetni-kniha-kompletni-prohlidka-soukrome-a","title":"Moje Účetní kniha | Kompletní prohlídka soukromé aplikace"},"fGLFL5o2yro":{"campaign":"tenispark-kompletni-prohlidka-me-soukrome-aplika","title":"TenisPark | Kompletní prohlídka mé soukromé aplikace pro areál"},"FfN7uIPu0Zw":{"campaign":"smart-home-kiosk-na-raspberry-pi-dum-topeni-medi","title":"Smart Home Kiosk na Raspberry Pi | dům, topení, média, auto a krypto"},"b6xPpSYp3Wc":{"campaign":"portfolio-tracker-kompletni-prohlidka-me-soukrom","title":"Portfolio Tracker | Kompletní prohlídka mé soukromé aplikace"},"UoxSFcJQq3M":{"campaign":"moje-chytra-domacnost-podrobne-homey-kiosek-a-co","title":"Moje chytrá domácnost podrobně: Homey, kiosek a Config Center"},"LRdEcUqsGA8":{"campaign":"meal-planner-podrobna-prohlidka-jidelnicku-recep","title":"Meal Planner | Podrobná prohlídka jídelníčku, receptů a nákupu"},"YKYiV06uLXA":{"campaign":"italia-travel-planner-kompletni-prohlidka-meho-c","title":"Italia Travel Planner | Kompletní prohlídka mého cestovního plánovače"},"9kF7CKShHTk":{"campaign":"energy-dashboard-kompletni-prohlidka-me-aplikace","title":"Energy Dashboard | Kompletní prohlídka mé aplikace pro spotřebu domu"},"-40NlRmH9BU":{"campaign":"config-center-kompletni-prohlidka-me-aplikace-pr","title":"Config Center | Kompletní prohlídka mé aplikace pro chytrou domácnost"},"fHyILzTIdh8":{"campaign":"collection-kompletni-prohlidka-me-soukrome-aplik","title":"Collection | Kompletní prohlídka mé soukromé aplikace pro sbírky"},"XAASanqGbjU":{"campaign":"budline-panel-kompletni-prohlidka-me-aplikace-pr","title":"BudLine Panel | Kompletní prohlídka mé aplikace pro řidiče autobusu"},"OPo5rNEVqGU":{"campaign":"auto-vyber-kompletni-prohlidka-me-soukrome-aplik","title":"AUTO VÝBĚR | Kompletní prohlídka mé soukromé aplikace pro nabídky aut"},"4kmxiMchZfg":{"campaign":"monsanto-portugalska-vesnice-mezi-balvany-shorts","title":"Monsanto | Portugalská vesnice mezi balvany #Shorts"},"3Gs6FozX1gI":{"campaign":"italie-civita-di-bagnoregio-mesto-na-skale-short","title":"Itálie | Civita di Bagnoregio: město na skále #Shorts"},"ZTr8l-D8eNw":{"campaign":"walschuv-mlyn-jak-se-zilo-u-mlynskeho-kola-cesty","title":"Walschův mlýn: jak se žilo u mlýnského kola | Cesty s příběhem"},"H4VL0XciUHs":{"campaign":"nisida-more-uvnitr-sopecneho-krateru-shorts","title":"Nisida | Moře uvnitř sopečného kráteru #Shorts"},"xMPYyVbzdqM":{"campaign":"rastoke-skryte-klenoty-chorvatska-shorts","title":"Rastoke | Skryté klenoty Chorvatska #Shorts"},"EHRpPIarScE":{"campaign":"toskansko-za-minutu-italie-vsemi-smysly-shorts","title":"Toskánsko za minutu – Itálie všemi smysly #Shorts"},"ZuCHhHST52o":{"campaign":"cesky-raj-trosky-a-strehomsky-mlyn-shorts","title":"Český ráj | Trosky a Střehomský mlýn #Shorts"},"cOUIjkH-MKk":{"campaign":"slovinsko-smaragdova-soca-a-jeji-skryta-koryta-s","title":"Slovinsko | Smaragdová Soča a její skrytá koryta #Shorts"},"zieSIu6cHx0":{"campaign":"velke-losiny-pribeh-rucni-papirny-shorts","title":"Velké Losiny | Příběh ruční papírny #Shorts"},"4Bl4Cx3-Hsc":{"campaign":"velke-losiny-pribeh-rucni-papirny-shorts","title":"Velké Losiny | Příběh ruční papírny #Shorts"},"JQu_iI9jc0M":{"campaign":"troo-skalni-vesnice-nad-udolim-shorts","title":"Trôo | Skalní vesnice nad údolím #Shorts"},"_Ld_tTEyWYM":{"campaign":"rochemenier-farma-ukryta-pod-zemi-shorts","title":"Rochemenier | Farma ukrytá pod zemí #Shorts"},"mvp61wHfKoA":{"campaign":"recko-skryte-klenoty-mezi-horami-a-morem-shorts","title":"Řecko | Skryté klenoty mezi horami a mořem #Shorts"},"PT3zjTTbLUY":{"campaign":"hoslovice-mlyn-ktery-zil-bez-elektriny-shorts","title":"Hoslovice | Mlýn, který žil bez elektřiny #Shorts"},"HuZ3B7nEVnE":{"campaign":"spanelsko-skryte-klenoty-a-mista-jako-z-jineho-s","title":"Španělsko | Skryté klenoty a místa jako z jiného světa #Shorts"},"jHuQapwN3QQ":{"campaign":"italie-rasiglia-vesnice-kterou-proteka-voda-shor","title":"Itálie | Rasiglia: vesnice, kterou protéká voda #Shorts"},"r0SC6J6QYBs":{"campaign":"portugalsko-skryte-klenoty-od-kamennych-vesnic-p","title":"Portugalsko | Skryté klenoty od kamenných vesnic po Atlantik #Shorts"},"NO2GP0y9MDc":{"campaign":"evropa-fotograficka-cesta-s-ludkem-shorts","title":"Evropa | Fotografická cesta s Luďkem #Shorts"},"6HHYNra8y2U":{"campaign":"z-excelu-k-vlastni-aplikaci-ucetni-kniha-shorts","title":"Z Excelu k vlastní aplikaci | Účetní kniha #Shorts"},"BehjOFWfMBM":{"campaign":"z-autobusu-do-kodu-cestovatel69-cz-shorts","title":"Z autobusu do kódu 🚌💻 | Cestovatel69.cz #Shorts"},"pTPDlpOb2I8":{"campaign":"italstina-na-cesty-lekce-dialogy-a-procvicovani","title":"Italština na cesty | Lekce, dialogy a procvičování #Shorts"},"u_Kig1kEqc0":{"campaign":"vesuv-krater-aktivni-sopky-a-cesta-vzhuru-shorts","title":"Vesuv: kráter aktivní sopky a cesta vzhůru #Shorts"},"ll6tSGOaSAQ":{"campaign":"toskansko-crete-senesi-a-cyprise-ve-val-d-orcia","title":"Toskánsko | Crete Senesi a cypřiše ve Val d’Orcia #Shorts"},"wyVzhmHf1QQ":{"campaign":"rozhledna-u-borovice-kamenna-vez-nad-roprachtice","title":"Rozhledna U Borovice: kamenná věž nad Roprachticemi #Shorts"},"T2DGPDkk5uo":{"campaign":"turin-namesti-san-carlo-kralovsky-palac-a-poulic","title":"Turín | Náměstí San Carlo, Královský palác a pouliční průvod #Shorts"},"lv-5rUs_E1g":{"campaign":"spiagge-bianche-proc-je-toskanske-pobrezi-tak-bi","title":"Spiagge Bianche | Proč je toskánské pobřeží tak bílé? #Shorts"},"HWtzoCVLdcY":{"campaign":"siena-ulicky-katedrala-a-piazza-del-campo-shorts","title":"Siena | Uličky, katedrála a Piazza del Campo #Shorts"},"jWaOx6oYB6s":{"campaign":"saturnia-a-san-filippo-termalni-jezirka-a-bila-v","title":"Saturnia a San Filippo | Termální jezírka a Bílá velryba #Shorts"},"CRayZ52nQ3g":{"campaign":"positano-barevne-domy-mistni-moda-a-majolikova-k","title":"Positano | Barevné domy, místní móda a majoliková kupole #Shorts"},"EZ3vFo-8E8s":{"campaign":"pompeje-nadvori-odlitky-a-forum-pod-vesuvem-shor","title":"Pompeje | Nádvoří, odlitky a fórum pod Vesuvem #Shorts"},"JndHwCOF338":{"campaign":"pisa-baptisterium-katedrala-a-sikma-vez-shorts","title":"Pisa: baptisterium, katedrála a šikmá věž #Shorts"},"x_XYpgvc5Ck":{"campaign":"petrohrad-pamatky-a-mesto-ze-silnice-shorts","title":"Petrohrad | Památky a město ze silnice #Shorts"},"_UvWoWfXCik":{"campaign":"neapol-namesti-plebiscito-ulicky-galerie-a-metro","title":"Neapol | Náměstí Plebiscito, uličky, galerie a metro #Shorts"},"3_5lwDdnFRU":{"campaign":"na-kruhach-v-semilech-tenis-a-jizera-z-dronu-sho","title":"Na Kruhách v Semilech | Tenis a Jizera z dronu #Shorts"},"N7cMO8QqOhM":{"campaign":"montepulciano-san-biagio-vinny-sklep-a-pulcinell","title":"Montepulciano | San Biagio, vinný sklep a Pulcinella #Shorts"},"25Gy5k-PG94":{"campaign":"kozakov-rozhledna-nad-mlhou-a-krajinou-shorts","title":"Kozákov | Rozhledna nad mlhou a krajinou #Shorts"},"hnhuUPGDqzY":{"campaign":"ferrari-f40-p80-c-a-pozvani-do-muzei-shorts","title":"Ferrari | F40, P80/C a pozvání do muzeí #Shorts"},"xnVBnku5RSA":{"campaign":"benatky-gondoly-palac-a-vodni-ulicky-shorts","title":"Benátky | Gondoly, palác a vodní uličky #Shorts"},"U6uyHL3FYYU":{"campaign":"amalfi-lodi-ke-katedrale-a-k-mori-shorts","title":"Amalfi | Lodí, ke katedrále a k moři #Shorts"},"SGeAAVffOnc":{"campaign":"moje-ucetni-kniha-co-vsechno-obsahuje-shorts","title":"Moje Účetní kniha | Co všechno obsahuje? #Shorts"},"OPcPKqmVqRE":{"campaign":"tenispark-co-je-uvnitr-me-aplikace-pro-maly-teni","title":"TenisPark | Co je uvnitř mé aplikace pro malý tenisový areál? #Shorts"},"PbDYZHqeWAc":{"campaign":"smart-home-kiosk-pet-casti-jednoho-domaciho-pane","title":"Smart Home Kiosk: pět částí jednoho domácího panelu #shorts"},"uTsS96ta3Wk":{"campaign":"portfolio-tracker-sedm-casti-me-aplikace-shorts","title":"Portfolio Tracker | Sedm částí mé aplikace #Shorts"},"GnCW2NcJk8c":{"campaign":"moje-chytra-domacnost-homey-kiosek-a-config-cent","title":"Moje chytrá domácnost: Homey, kiosek a Config Center #Shorts"},"O0afpxZV4-U":{"campaign":"meal-planner-od-jidelnicku-k-nakupu-shorts","title":"Meal Planner | Od jídelníčku k nákupu #Shorts"},"y_ojcq3w5q0":{"campaign":"italia-travel-planner-co-vsechno-umi-shorts","title":"Italia Travel Planner | Co všechno umí? #shorts"},"PYyFE5o52pE":{"campaign":"energy-dashboard-co-ukazuje-moje-soukroma-aplika","title":"Energy Dashboard | Co ukazuje moje soukromá aplikace? #Shorts"},"J4IyVQ29JSU":{"campaign":"config-center-moje-nastaveni-chytre-domacnosti-s","title":"Config Center | Moje nastavení chytré domácnosti #Shorts"},"d203zPPgnoQ":{"campaign":"collection-co-vsechno-obsahuje-moje-sberatelska","title":"Collection | Co všechno obsahuje moje sběratelská aplikace? #Shorts"},"DU1UiNtUxbM":{"campaign":"cestovatel69-cz-za-30-sekund-cesty-aplikace-a-ch","title":"Cestovatel69.cz za 30 sekund | Cesty, aplikace a chytrá domácnost #shorts"},"YzVsOyi2rU8":{"campaign":"budline-panel-co-umi-moje-aplikace-pro-ridice-sh","title":"BudLine Panel | Co umí moje aplikace pro řidiče? #Shorts"},"kvXA-W_KXo8":{"campaign":"auto-vyber-porovnani-ojetin-v-me-soukrome-aplika","title":"AUTO VÝBĚR | Porovnání ojetin v mé soukromé aplikaci #Shorts"},"QElnBFnWGWE":{"campaign":"sopky-neapolskeho-zalivu-vesuv-pompeje-flegrejsk","title":"Sopky Neapolského zálivu | Vesuv, Pompeje, Flegrejská pole a ostrovy"},"hv1H7qL-JJ0":{"campaign":"sopky-neapolskeho-zalivu-vesuv-pompeje-flegrejsk","title":"Sopky Neapolského zálivu | Vesuv, Pompeje, Flegrejská pole a ostrovy"},"cxIVdVXm-6E":{"campaign":"nisida-more-uvnitr-sopecneho-krateru-shorts","title":"Nisida | Moře uvnitř sopečného kráteru #Shorts"},"rkNmYoHXGgQ":{"campaign":"carbonara-smetana-rim-a-promeny-tradice-italska","title":"Carbonara: smetana, Řím a proměny tradice | Italská kuchyně po česku #1"},"IlP_gxJYz_E":{"campaign":"bolonske-ragu-ceska-uprava","title":"Boloňské ragù: co mění česká úprava | Italská kuchyně po česku #2"},"Nuw6haBUDnc":{"campaign":"ceske-rizoto-a-italske-risotto","title":"České rizoto a italské risotto: v čem je rozdíl? | Italská kuchyně po česku #3"},"Vdya9Oxtj6E":{"campaign":"carbonara-bez-smetany-short","title":"Carbonara bez smetany? Rozdíl je v omáčce #Shorts"},"xsvqwURd_EE":{"campaign":"bolonske-ragu-short","title":"Boloňské ragù: proč nestačí kečup? #Shorts"},"PjimBIH-TpI":{"campaign":"ceske-rizoto-italske-risotto-short","title":"České rizoto a italské risotto: rozdíl začíná při vaření #Shorts"},"PYeCCU9zO0c":{"campaign":"jizni-morava-vino-vinice-a-tradice","title":"Jižní Morava | Víno, vinice a tradice"},"OY_GgER2Zo4":{"campaign":"jizni-morava-mezi-vinnymi-sklepy-shorts","title":"Jižní Morava | Mezi vinnými sklepy #Shorts"}};
  // END APPROVED YOUTUBE CAMPAIGNS
  const KEY = 'cestovatel69_analytics_consent_v1';
  const AGE = 180 * 24 * 60 * 60 * 1000;
  const production = ['cestovatel69.cz', 'www.cestovatel69.cz'].includes(location.hostname);
  const language = document.documentElement.lang.split('-')[0];
  const words = {
    cs: ['Měření návštěvnosti', 'Se souhlasem používám Google Analytics, abych zjistil, které články a videa vás zajímají. Odmítnutí nijak neomezí používání webu.', 'Povolit měření', 'Odmítnout měření', 'Podrobnosti o soukromí', 'Nastavení soukromí', 'Měření je povolené. Svou volbu můžeš kdykoli změnit.', 'Měření je vypnuté. Svou volbu můžeš kdykoli změnit.', 'Zavřít'],
    en: ['Visitor statistics', 'With your permission, I use Google Analytics to understand which articles and videos interest you. Declining does not limit this website.', 'Allow analytics', 'Decline analytics', 'Privacy details (Czech)', 'Privacy settings', 'Analytics is enabled. You can change your choice at any time.', 'Analytics is disabled. You can change your choice at any time.', 'Close'],
    it: ['Statistiche delle visite', 'Con il tuo consenso uso Google Analytics per capire quali articoli e video ti interessano. Il rifiuto non limita il sito.', 'Consenti statistiche', 'Rifiuta statistiche', 'Informazioni sulla privacy (ceco)', 'Impostazioni privacy', 'Statistiche attive. Puoi cambiare la scelta in qualsiasi momento.', 'Statistiche disattivate. Puoi cambiare la scelta in qualsiasi momento.', 'Chiudi']
  }[language] || null;
  const text = words || ['Visitor statistics', 'With your permission, I use Google Analytics to understand which articles and videos interest you. Declining does not limit this website.', 'Allow analytics', 'Decline analytics', 'Privacy details (Czech)', 'Privacy settings', 'Analytics is enabled. You can change your choice at any time.', 'Analytics is disabled. You can change your choice at any time.', 'Close'];
  let allowed = false;
  let started = false;
  let banner;
  let status;
  let previousFocus;

  function readChoice() {
    try {
      const choice = JSON.parse(localStorage.getItem(KEY));
      return choice && typeof choice.allowed === 'boolean' && Number.isFinite(choice.at) && choice.at <= Date.now() && Date.now() - choice.at < AGE ? choice : null;
    } catch (_) { return null; }
  }

  function cleanURL(value) {
    try { const parsed = new URL(value); return /^https?:$/.test(parsed.protocol) ? parsed.origin + parsed.pathname : ''; }
    catch (_) { return ''; }
  }

  function tag() { window.dataLayer.push(arguments); }

  function youtubeCampaign() {
    // Accept only our own issued links. Never send arbitrary query strings to Google.
    const query = new URLSearchParams(location.search);
    if (query.get('utm_source') !== 'youtube' || query.get('utm_medium') !== 'organic_video') return null;
    const id = query.get('utm_content');
    if (!Object.prototype.hasOwnProperty.call(YOUTUBE_CAMPAIGNS, id)) return null;
    const video = YOUTUBE_CAMPAIGNS[id];
    if (query.get('utm_campaign') !== video.campaign) return null;
    return { id, ...video };
  }

  function trackEvent(name, parameters) {
    tag('event', name, {
      ...parameters,
      send_to: MEASUREMENT_ID,
      event_callback: function () { document.documentElement.dataset.analyticsProcessedEvent = name; }
    });
    document.documentElement.dataset.analyticsQueuedEvent = name;
  }

  function enable() {
    if (!production || !/^G-[A-Z0-9]+$/.test(MEASUREMENT_ID)) return;
    window['ga-disable-' + MEASUREMENT_ID] = false;
    if (started) {
      tag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || tag;
    tag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    tag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    tag('js', new Date());
    const campaign = youtubeCampaign();
    tag('config', MEASUREMENT_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: AGE / 1000,
      cookie_update: false,
      ...(campaign ? {
        campaign_source: 'youtube',
        campaign_medium: 'organic_video',
        campaign_name: campaign.campaign,
        campaign_content: campaign.id
      } : {}),
      page_location: location.origin + location.pathname,
      page_referrer: cleanURL(document.referrer)
    });
    trackEvent('page_view', { page_location: location.origin + location.pathname, page_title: document.title, page_referrer: cleanURL(document.referrer) });
    if (campaign) {
      trackEvent('youtube_arrival', {
        video_id: campaign.id,
        source_video: campaign.title,
        page_location: location.origin + location.pathname,
        page_title: document.title
      });
      document.documentElement.dataset.analyticsSourceVideo = campaign.id;
    }
    const script = document.createElement('script');
    script.async = true;
    script.id = 'cestovatel-google-tag';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(script);
  }

  function disable() {
    window['ga-disable-' + MEASUREMENT_ID] = true;
    if (started) tag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    const names = ['_ga', '_ga_' + MEASUREMENT_ID.replace(/^G-/, '')];
    const domains = ['', location.hostname, '.cestovatel69.cz'];
    names.forEach(name => domains.forEach(domain => {
      document.cookie = name + '=;Max-Age=0;Path=/;SameSite=Lax' + (domain ? ';Domain=' + domain : '') + (location.protocol === 'https:' ? ';Secure' : '');
    }));
  }

  function apply(value) {
    allowed = value;
    document.documentElement.dataset.analyticsConsent = value ? 'granted' : 'denied';
    if (value) enable(); else disable();
    if (status) status.textContent = text[value ? 6 : 7];
  }

  function save(value) {
    try { localStorage.setItem(KEY, JSON.stringify({ allowed: value, at: Date.now() })); } catch (_) { /* Choice still applies for this page. */ }
    apply(value);
    banner.hidden = true;
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
  }

  function open() {
    previousFocus = document.activeElement;
    banner.hidden = false;
    banner.querySelector('button').focus();
  }

  function install() {
    // Public content only: no tracking inside demos or embedded local app examples.
    if (location.pathname.includes('/demo/')) return;
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/assets/css/analytics-consent.css?v=20261116';
    document.head.appendChild(css);
    banner = document.createElement('section');
    banner.className = 'analytics-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-labelledby', 'analytics-consent-title');
    banner.innerHTML = '<div><h2 id="analytics-consent-title"></h2><p class="analytics-consent__explanation"></p><a class="analytics-consent__details" href="/soukromi/"></a><p class="analytics-consent__status"></p></div><div class="analytics-consent__actions"><button type="button" data-choice="yes"></button><button type="button" data-choice="no"></button><button type="button" data-choice="close" hidden></button></div>';
    banner.querySelector('h2').textContent = text[0];
    banner.querySelector('.analytics-consent__explanation').textContent = text[1];
    banner.querySelector('a').textContent = text[4];
    banner.querySelector('[data-choice="yes"]').textContent = text[2];
    banner.querySelector('[data-choice="no"]').textContent = text[3];
    banner.querySelector('[data-choice="close"]').textContent = text[8];
    status = banner.querySelector('.analytics-consent__status');
    document.body.appendChild(banner);
    const controls = document.createElement('span');
    controls.className = 'analytics-privacy-links';
    const settings = document.createElement('button');
    settings.type = 'button';
    settings.textContent = text[5];
    settings.addEventListener('click', open);
    const policy = document.createElement('a');
    policy.href = '/soukromi/';
    policy.textContent = text[4];
    controls.append(settings, policy);
    const footer = document.querySelector('.footer-links, .site-footer, footer');
    if (footer) footer.appendChild(controls);
    else { controls.classList.add('analytics-privacy-links--floating'); document.body.appendChild(controls); }
    const choice = readChoice();
    banner.hidden = !!choice;
    banner.querySelector('[data-choice="close"]').hidden = !choice;
    if (choice) apply(choice.allowed);
    else { window['ga-disable-' + MEASUREMENT_ID] = true; document.documentElement.dataset.analyticsConsent = 'unset'; }
    banner.addEventListener('click', event => {
      const button = event.target.closest('button[data-choice]');
      if (!button) return;
      if (button.dataset.choice === 'close') { banner.hidden = true; if (previousFocus?.isConnected) previousFocus.focus(); }
      else { save(button.dataset.choice === 'yes'); banner.querySelector('[data-choice="close"]').hidden = false; }
    });
    document.addEventListener('click', event => {
      if (!allowed || !started) return;
      const button = event.target.closest('.thumb-cover, .btn-play');
      const card = button?.closest('[data-video-id]');
      if (card && /^[\w-]{11}$/.test(card.dataset.videoId || '')) {
        trackEvent('video_play_click', { video_id: card.dataset.videoId, video_provider: 'YouTube' });
      }
      const link = event.target.closest('a[href]');
      if (!link) return;
      try {
        const target = new URL(link.href);
        if (['youtube.com', 'www.youtube.com', 'youtu.be'].includes(target.hostname)) {
          const id = target.hostname === 'youtu.be' ? target.pathname.slice(1) : target.searchParams.get('v');
          trackEvent('youtube_click', { video_id: /^[\w-]{11}$/.test(id || '') ? id : 'channel', link_domain: target.hostname });
        }
      } catch (_) { /* Invalid links are not measured. */ }
    }, true);
    window.addEventListener('storage', event => { if (event.key === KEY) { const next = readChoice(); apply(!!next?.allowed); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
