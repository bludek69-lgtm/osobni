/* Model calculations only. No network requests, storage or live market data. */
(function () {
  'use strict';

  const definitions = [
    { id: 'growth', fields: [['initial', 100000, 0, 1000000000], ['monthly', 2000, 0, 100000000], ['years', 20, 1, 50], ['rate', 6, -30, 30]] },
    { id: 'goal', fields: [['initial', 100000, 0, 1000000000], ['target', 1000000, 1, 1000000000000], ['years', 15, 1, 50], ['rate', 4, -30, 30]] },
    { id: 'reserve', fields: [['expense', 30000, 0, 100000000], ['months', 6, 1, 36]] },
    { id: 'average', fields: [['q1', 10, 0, 100000000], ['p1', 1000, 0, 1000000000], ['q2', 5, 0, 100000000], ['p2', 1200, 0, 1000000000]] },
    { id: 'rebalance', fields: [['a', 70000, 0, 1000000000], ['b', 20000, 0, 1000000000], ['c', 10000, 0, 1000000000], ['ta', 60, 0, 100], ['tb', 25, 0, 100], ['tc', 15, 0, 100]] },
    { id: 'dividend', fields: [['price', 1000, 0.01, 1000000000], ['dividend', 40, 0, 1000000000], ['quantity', 10, 0, 100000000]] },
    { id: 'fx', fields: [['foreign', 100, 0, 1000000000], ['rate', 24.5, 0.000001, 1000000]] },
    { id: 'fifo', fields: [['q1', 5, 0, 100000000], ['p1', 100, 0, 1000000000], ['q2', 4, 0, 100000000], ['p2', 120, 0, 1000000000], ['q3', 3, 0, 100000000], ['p3', 130, 0, 1000000000], ['sell', 7, 0.000001, 100000000], ['salePrice', 150, 0, 1000000000]] },
    { id: 'stress', fields: [['value', 100000, 0, 1000000000000], ['drop', 40, 0, 100]] }
  ];

  const copy = {
    cs: {
      button: 'Spočítat', invalid: 'Zkontroluj zadané hodnoty.', sum: 'Cílové podíly musí dohromady tvořit 100 %.', quantity: 'Zadej alespoň jeden nakoupený kus.', sell: 'Nelze prodat více kusů, než je v uvedených nákupech.', buySell: 'Kladná změna znamená přikoupit, záporná prodat.',
      growth: { title: 'Složené úročení a pravidelný vklad', desc: 'Model se stálým ročním výnosem a vkladem na konci každého měsíce.', fields: ['Počáteční částka (Kč)', 'Měsíční vklad (Kč)', 'Počet let', 'Roční výnos (%)'], results: ['Konečná hodnota', 'Celkem vloženo', 'Modelový rozdíl'], note: 'Bez poplatků, daní a inflace. Stálý výnos je zjednodušení, nikoli předpověď.' },
      goal: { title: 'Měsíční vklad pro cílovou částku', desc: 'Kolik by bylo potřeba vkládat při zvoleném modelovém výnosu.', fields: ['Počáteční částka (Kč)', 'Cílová částka (Kč)', 'Počet let', 'Roční výnos (%)'], results: ['Potřebný měsíční vklad', 'Hodnota bez dalších vkladů'], note: 'Vklad na konci měsíce; bez poplatků, daní a inflace. Cíl není zaručen.' },
      reserve: { title: 'Finanční rezerva', desc: 'Jednoduchý násobek měsíčních nezbytných výdajů.', fields: ['Měsíční výdaje (Kč)', 'Počet měsíců'], results: ['Modelová výše rezervy'], note: 'Nezohledňuje mimořádné výdaje ani změny cen.' },
      average: { title: 'Průměrná nákupní cena', desc: 'Vážený průměr dvou nákupů stejného aktiva.', fields: ['První nákup: kusy', 'První nákup: cena za kus (Kč)', 'Druhý nákup: kusy', 'Druhý nákup: cena za kus (Kč)'], results: ['Průměrná cena za kus', 'Celkem kusů', 'Celkem zaplaceno'], note: 'Bez poplatků a měnových převodů.' },
      rebalance: { title: 'Rebalancování tří složek', desc: 'Modelový přesun mezi složkami A, B a C bez dalšího vkladu.', fields: ['Hodnota A (Kč)', 'Hodnota B (Kč)', 'Hodnota C (Kč)', 'Cílový podíl A (%)', 'Cílový podíl B (%)', 'Cílový podíl C (%)'], results: ['Celková hodnota', 'Změna A', 'Změna B', 'Změna C'], note: 'Kladná změna znamená přikoupit, záporná prodat. Bez poplatků, daní a omezení obchodování.' },
      dividend: { title: 'Hrubý dividendový výnos', desc: 'Roční dividenda na kus vzhledem k zadané ceně.', fields: ['Cena za kus (Kč)', 'Roční dividenda na kus (Kč)', 'Počet kusů'], results: ['Hrubý dividendový výnos', 'Roční hrubá dividenda'], note: 'Dividenda není zaručená; bez daní a měnových převodů.' },
      fx: { title: 'Přepočet měny na koruny', desc: 'Kurz zadáváš ručně jako počet Kč za jednu jednotku cizí měny.', fields: ['Částka v cizí měně', 'Kč za 1 jednotku'], results: ['Přepočteno na Kč'], note: 'Kurz není živý ani daňový. Pro skutečný převod a evidenci ověř odpovídající kurz a datum.' },
      fifo: { title: 'FIFO: modelový prodej', desc: 'Tři nákupy v pořadí od nejstaršího; prodej se páruje od prvního.', fields: ['Nákup 1: kusy', 'Nákup 1: cena za kus (Kč)', 'Nákup 2: kusy', 'Nákup 2: cena za kus (Kč)', 'Nákup 3: kusy', 'Nákup 3: cena za kus (Kč)', 'Prodávané kusy', 'Prodejní cena za kus (Kč)'], results: ['Pořizovací cena prodaných kusů', 'Hrubý výnos z prodeje', 'Modelový rozdíl', 'Zbývající kusy'], note: 'Pouze ukázka párování nákupů v jedné měně. Neřeší poplatky, daně, časové testy ani skutečnou evidenci.' },
      stress: { title: 'Modelový pokles portfolia', desc: 'Co udělá stejný procentní pokles se zadanou hodnotou.', fields: ['Současná hodnota (Kč)', 'Pokles (%)'], results: ['Hodnota po poklesu', 'Absolutní ztráta'], note: 'Nejde o předpověď ani kompletní měření rizika.' }
    },
    en: {
      button: 'Calculate', invalid: 'Check the entered values.', sum: 'Target weights must add up to 100%.', quantity: 'Enter at least one purchased unit.', sell: 'You cannot sell more units than the listed purchases contain.',
      growth: { title: 'Compound growth and monthly deposits', desc: 'A constant annual return with deposits at the end of each month.', fields: ['Initial amount (CZK)', 'Monthly deposit (CZK)', 'Years', 'Annual return (%)'], results: ['Final value', 'Total contributed', 'Illustrative difference'], note: 'Excludes fees, taxes and inflation. A constant return is a simplification, not a forecast.' },
      goal: { title: 'Monthly deposit for a target amount', desc: 'Required deposits at an assumed constant return.', fields: ['Initial amount (CZK)', 'Target amount (CZK)', 'Years', 'Annual return (%)'], results: ['Required monthly deposit', 'Value without further deposits'], note: 'Deposits at month-end; excludes fees, taxes and inflation. The target is not guaranteed.' },
      reserve: { title: 'Cash reserve', desc: 'Monthly essential expenses multiplied by a number of months.', fields: ['Monthly expenses (CZK)', 'Months'], results: ['Illustrative reserve'], note: 'Excludes unexpected expenses and price changes.' },
      average: { title: 'Average purchase price', desc: 'Weighted average of two purchases of the same asset.', fields: ['First purchase: units', 'First purchase: price per unit (CZK)', 'Second purchase: units', 'Second purchase: price per unit (CZK)'], results: ['Average price per unit', 'Total units', 'Total cost'], note: 'Excludes fees and currency conversions.' },
      rebalance: { title: 'Rebalance three holdings', desc: 'Illustrative transfers among A, B and C, with no new contribution.', fields: ['Value A (CZK)', 'Value B (CZK)', 'Value C (CZK)', 'Target weight A (%)', 'Target weight B (%)', 'Target weight C (%)'], results: ['Total value', 'Change A', 'Change B', 'Change C'], note: 'Positive means buy, negative means sell. Excludes fees, taxes and trading constraints.' },
      dividend: { title: 'Gross dividend yield', desc: 'Annual dividend per unit divided by the entered price.', fields: ['Price per unit (CZK)', 'Annual dividend per unit (CZK)', 'Units'], results: ['Gross dividend yield', 'Annual gross dividend'], note: 'Dividends are not guaranteed; excludes taxes and currency conversions.' },
      fx: { title: 'Currency conversion to CZK', desc: 'Enter your own rate in CZK per one unit of foreign currency.', fields: ['Amount in foreign currency', 'CZK per unit'], results: ['Converted to CZK'], note: 'The rate is not live or tax-specific. Verify the rate and date for real transactions.' },
      fifo: { title: 'FIFO: illustrative sale', desc: 'Three purchases, oldest first; sold units are matched from the first lot.', fields: ['Lot 1: units', 'Lot 1: price per unit (CZK)', 'Lot 2: units', 'Lot 2: price per unit (CZK)', 'Lot 3: units', 'Lot 3: price per unit (CZK)', 'Units sold', 'Sale price per unit (CZK)'], results: ['Acquisition cost of units sold', 'Gross sale proceeds', 'Illustrative difference', 'Units remaining'], note: 'Only a matching example in one currency. Excludes fees, taxes, holding periods and actual records.' },
      stress: { title: 'Illustrative portfolio decline', desc: 'Apply a uniform percentage drop to the entered value.', fields: ['Current value (CZK)', 'Drop (%)'], results: ['Value after decline', 'Absolute loss'], note: 'Neither a forecast nor a complete measure of risk.' }
    },
    it: {
      button: 'Calcola', invalid: 'Controlla i valori inseriti.', sum: 'Le percentuali obiettivo devono sommare al 100%.', quantity: 'Inserisci almeno un’unità acquistata.', sell: 'Non puoi vendere più unità di quelle acquistate.',
      growth: { title: 'Interesse composto e versamenti mensili', desc: 'Rendimento annuo costante e versamenti alla fine di ogni mese.', fields: ['Capitale iniziale (CZK)', 'Versamento mensile (CZK)', 'Anni', 'Rendimento annuo (%)'], results: ['Valore finale', 'Totale versato', 'Differenza indicativa'], note: 'Esclude costi, imposte e inflazione. Un rendimento costante è una semplificazione, non una previsione.' },
      goal: { title: 'Versamento mensile per un obiettivo', desc: 'Versamento necessario con un rendimento costante ipotetico.', fields: ['Capitale iniziale (CZK)', 'Obiettivo (CZK)', 'Anni', 'Rendimento annuo (%)'], results: ['Versamento mensile necessario', 'Valore senza altri versamenti'], note: 'Versamenti a fine mese; esclude costi, imposte e inflazione. L’obiettivo non è garantito.' },
      reserve: { title: 'Fondo di riserva', desc: 'Spese mensili essenziali moltiplicate per il numero di mesi.', fields: ['Spese mensili (CZK)', 'Mesi'], results: ['Riserva indicativa'], note: 'Non considera spese impreviste né variazioni dei prezzi.' },
      average: { title: 'Prezzo medio di acquisto', desc: 'Media ponderata di due acquisti dello stesso titolo.', fields: ['Primo acquisto: unità', 'Primo acquisto: prezzo unitario (CZK)', 'Secondo acquisto: unità', 'Secondo acquisto: prezzo unitario (CZK)'], results: ['Prezzo medio unitario', 'Unità totali', 'Costo totale'], note: 'Esclude costi e conversioni valutarie.' },
      rebalance: { title: 'Ribilanciamento di tre componenti', desc: 'Spostamento indicativo tra A, B e C senza versare altro capitale.', fields: ['Valore A (CZK)', 'Valore B (CZK)', 'Valore C (CZK)', 'Quota obiettivo A (%)', 'Quota obiettivo B (%)', 'Quota obiettivo C (%)'], results: ['Valore totale', 'Variazione A', 'Variazione B', 'Variazione C'], note: 'Una variazione positiva indica acquisto, negativa vendita. Esclude costi, imposte e vincoli.' },
      dividend: { title: 'Rendimento lordo da dividendi', desc: 'Dividendo annuo per unità diviso per il prezzo inserito.', fields: ['Prezzo unitario (CZK)', 'Dividendo annuo per unità (CZK)', 'Unità'], results: ['Rendimento lordo', 'Dividendo annuo lordo'], note: 'I dividendi non sono garantiti; esclude imposte e conversioni valutarie.' },
      fx: { title: 'Conversione in corone ceche', desc: 'Inserisci manualmente il cambio in CZK per unità di valuta estera.', fields: ['Importo in valuta estera', 'CZK per unità'], results: ['Importo in CZK'], note: 'Il tasso non è aggiornato in tempo reale né valido per le imposte. Verifica tasso e data.' },
      fifo: { title: 'FIFO: vendita di esempio', desc: 'Tre acquisti in ordine cronologico; la vendita usa prima il lotto più vecchio.', fields: ['Lotto 1: unità', 'Lotto 1: prezzo unitario (CZK)', 'Lotto 2: unità', 'Lotto 2: prezzo unitario (CZK)', 'Lotto 3: unità', 'Lotto 3: prezzo unitario (CZK)', 'Unità vendute', 'Prezzo di vendita unitario (CZK)'], results: ['Costo delle unità vendute', 'Ricavo lordo della vendita', 'Differenza indicativa', 'Unità rimanenti'], note: 'Solo esempio di abbinamento in una valuta. Esclude costi, imposte, periodi di possesso e registri reali.' },
      stress: { title: 'Calo ipotetico del portafoglio', desc: 'Applica un calo percentuale uniforme al valore inserito.', fields: ['Valore attuale (CZK)', 'Calo (%)'], results: ['Valore dopo il calo', 'Perdita assoluta'], note: 'Non è una previsione né una misura completa del rischio.' }
    }
  };

  function monthlyRate(annualPercent) {
    return Math.pow(1 + annualPercent / 100, 1 / 12) - 1;
  }

  function annuity(monthly, months) {
    return Math.abs(monthly) < 1e-12 ? months : Math.expm1(months * Math.log1p(monthly)) / monthly;
  }

  function calculate(id, p) {
    let n, m, factor, total, cost, remaining;
    switch (id) {
      case 'growth':
        n = Math.round(p.years * 12); m = monthlyRate(p.rate); factor = Math.pow(1 + m, n);
        total = p.initial * factor + p.monthly * annuity(m, n);
        return [['money', total], ['money', p.initial + p.monthly * n], ['money', total - p.initial - p.monthly * n]];
      case 'goal':
        n = Math.round(p.years * 12); m = monthlyRate(p.rate); factor = Math.pow(1 + m, n);
        return [['money', Math.max(0, (p.target - p.initial * factor) / annuity(m, n))], ['money', p.initial * factor]];
      case 'reserve': return [['money', p.expense * p.months]];
      case 'average':
        total = p.q1 + p.q2;
        if (total <= 0) throw new Error('quantity');
        cost = p.q1 * p.p1 + p.q2 * p.p2;
        return [['money', cost / total], ['number', total], ['money', cost]];
      case 'rebalance':
        if (Math.abs(p.ta + p.tb + p.tc - 100) > 0.001) throw new Error('sum');
        total = p.a + p.b + p.c;
        return [['money', total], ['money', total * p.ta / 100 - p.a], ['money', total * p.tb / 100 - p.b], ['money', total * p.tc / 100 - p.c]];
      case 'dividend': return [['percent', p.dividend / p.price * 100], ['money', p.dividend * p.quantity]];
      case 'fx': return [['money', p.foreign * p.rate]];
      case 'fifo':
        total = p.q1 + p.q2 + p.q3;
        if (p.sell > total) throw new Error('sell');
        remaining = p.sell; cost = 0;
        for (const [qty, price] of [[p.q1, p.p1], [p.q2, p.p2], [p.q3, p.p3]]) {
          const used = Math.min(remaining, qty);
          cost += used * price;
          remaining -= used;
        }
        return [['money', cost], ['money', p.sell * p.salePrice], ['money', p.sell * p.salePrice - cost], ['number', total - p.sell]];
      case 'stress': return [['money', p.value * (1 - p.drop / 100)], ['money', p.value * p.drop / 100]];
      default: throw new Error('invalid');
    }
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { calculate, monthlyRate };
  if (typeof document === 'undefined') return;

  const root = document.querySelector('[data-finance-calculators]');
  if (!root) return;
  const language = ['cs', 'en', 'it'].includes(root.dataset.locale) ? root.dataset.locale : 'cs';
  const t = copy[language];
  const formatter = new Intl.NumberFormat(language === 'cs' ? 'cs-CZ' : language === 'it' ? 'it-IT' : 'en-US', { maximumFractionDigits: 2 });
  const currency = new Intl.NumberFormat(language === 'cs' ? 'cs-CZ' : language === 'it' ? 'it-IT' : 'en-US', { style: 'currency', currency: 'CZK', maximumFractionDigits: 2 });
  const format = (type, value) => type === 'money' ? currency.format(value) : type === 'percent' ? formatter.format(value) + ' %' : formatter.format(value);
  root.replaceChildren();

  definitions.forEach((definition, index) => {
    const words = t[definition.id];
    const details = document.createElement('details');
    details.className = 'finance-calc';
    if (index === 0) details.open = true;
    const summary = document.createElement('summary');
    summary.textContent = words.title;
    details.append(summary);
    const description = document.createElement('p');
    description.className = 'finance-calc-description';
    description.textContent = words.desc;
    details.append(description);
    const form = document.createElement('form');
    form.className = 'finance-calc-form';
    form.noValidate = false;
    const fields = document.createElement('div');
    fields.className = 'finance-calc-fields';
    definition.fields.forEach(([name, initial, min, max], fieldIndex) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.id = `fin-${definition.id}-${name}`;
      input.name = name;
      input.type = 'number';
      input.inputMode = 'decimal';
      input.required = true;
      input.min = String(min);
      input.max = String(max);
      input.step = ['years', 'months'].includes(name) ? '1' : 'any';
      input.value = String(initial);
      label.htmlFor = input.id;
      label.textContent = words.fields[fieldIndex];
      label.append(input);
      fields.append(label);
    });
    form.append(fields);
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = t.button;
    form.append(button);
    const result = document.createElement('div');
    result.className = 'finance-calc-result';
    result.setAttribute('role', 'status');
    result.setAttribute('aria-live', 'polite');
    form.append(result);
    const note = document.createElement('p');
    note.className = 'finance-calc-note';
    note.textContent = words.note;
    form.append(note);
    details.append(form);
    root.append(details);

    function update() {
      if (!form.reportValidity()) return;
      const values = Object.fromEntries(Array.from(form.elements).filter(el => el instanceof HTMLInputElement).map(el => [el.name, Number(el.value)]));
      try {
        const calculated = calculate(definition.id, values);
        if (calculated.some(([, value]) => !Number.isFinite(value))) throw new Error('invalid');
        const list = document.createElement('dl');
        calculated.forEach(([unit, value], i) => {
          const label = document.createElement('dt');
          label.textContent = words.results[i];
          const output = document.createElement('dd');
          output.textContent = format(unit, value);
          list.append(label, output);
        });
        result.replaceChildren(list);
      } catch (error) {
        result.textContent = t[error.message] || t.invalid;
      }
    }
    form.addEventListener('submit', event => { event.preventDefault(); update(); });
    update();
  });
})();
