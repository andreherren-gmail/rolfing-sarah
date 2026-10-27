const assistant = document.querySelector('.appointment-assistant');
if (assistant) {
  const steps = [...assistant.querySelectorAll('.appointment-step')];
  const placeForm = document.querySelector('#place-form');
  const timeForm = document.querySelector('#time-form');
  const typeForm = document.querySelector('#type-form');
  const date = document.querySelector('#preferred-date');
  const flexibleDate = document.querySelector('#flexible-date');
  const period = document.querySelector('#preferred-period');
  const time = document.querySelector('#preferred-time');
  const status = document.querySelector('.assistant-status');
  const places = {
    bern: 'Bern, Kramgasse 12, 3011 Bern',
    niederscherli: 'Niederscherli, Schwarzenburgstrasse 854, c/o Physiotherapie Niederscherli, 3145 Niederscherli',
    flexible: 'Beide Standorte sind möglich'
  };
  const periods = { morning: 'Vormittag', afternoon: 'Nachmittag', evening: 'Früher Abend', flexible: 'Zeitlich flexibel' };
  const treatments = { rolfing: 'Rolfing®', fascia: 'Faszientherapie', scar: 'ScarWork: Narbenarbeit', unsure: 'Die passende Behandlung zuerst besprechen' };
  const visits = { first: 'Erster Termin bei Sarah', returning: 'Bereits bei Sarah in Behandlung gewesen' };
  const selected = (form, name) => form.querySelector(`input[name="${name}"]:checked`)?.value || '';

  function localClock() {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Zurich', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return { date: `${values.year}-${values.month}-${values.day}`, time: `${values.hour}:${values.minute}` };
  }

  function updateTimeFields() {
    const now = localClock();
    date.min = now.date;
    date.disabled = flexibleDate.checked;
    date.required = !flexibleDate.checked;
    const exact = period.value === 'exact';
    document.querySelector('#exact-time-field').hidden = !exact;
    time.disabled = !exact;
    time.required = exact;
    time.setCustomValidity('');
    if (exact && !flexibleDate.checked && date.value === now.date && time.value && time.value <= now.time) {
      time.setCustomValidity('Bitte wähle eine Uhrzeit, die noch bevorsteht, oder ein anderes Datum.');
    }
  }

  function valid(form) {
    return [...form.elements].every(field => !field.willValidate || field.validity.valid);
  }

  function formatDate(value) {
    if (!value) return '';
    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('de-CH', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(year, month - 1, day, 12));
  }

  function timeDescription() {
    const day = flexibleDate.checked ? 'Datum flexibel' : formatDate(date.value);
    const timing = period.value === 'exact' ? (time.value ? `${time.value} Uhr` : '') : periods[period.value];
    return [day, timing].filter(Boolean).join(', ');
  }

  function update() {
    updateTimeFields();
    const place = selected(placeForm, 'place');
    const treatment = selected(typeForm, 'treatment');
    const visit = selected(typeForm, 'visit');
    const complete = [placeForm, timeForm, typeForm].every(valid);
    assistant.querySelector('[data-answer="place"]').textContent = place === 'bern' ? 'Bern' : place === 'niederscherli' ? 'Niederscherli' : place ? 'Flexibel' : 'Bitte wählen';
    assistant.querySelector('[data-answer="time"]').textContent = valid(timeForm) ? timeDescription() : 'Noch offen';
    assistant.querySelector('[data-answer="type"]').textContent = valid(typeForm) ? treatments[treatment] : 'Noch offen';
    assistant.querySelector('[data-answer="review"]').textContent = complete ? 'Bereit zum Prüfen' : 'Noch unvollständig';
    document.querySelector('#review-incomplete').hidden = complete;
    document.querySelector('#review-ready').hidden = !complete;
    if (!complete) {
      document.querySelector('#request-email').href = 'mailto:info@rolfing-herren.ch';
      document.querySelector('#request-text').value = '';
      return;
    }
    document.querySelector('#review-place').textContent = places[place];
    document.querySelector('#review-time').textContent = timeDescription();
    document.querySelector('#review-type').textContent = treatments[treatment];
    document.querySelector('#review-visit').textContent = visits[visit];
    const body = [
      'Guten Tag Sarah', '', 'Ich möchte gerne einen Termin anfragen.', '',
      `Ort: ${places[place]}`, `Datum und Zeit: ${timeDescription()}`,
      `Behandlung: ${treatments[treatment]}`, `Besuch: ${visits[visit]}`, '',
      'Bitte teile mir mit, ob mein Terminwunsch möglich ist oder welche Alternative du vorschlägst.', '',
      'Mein Name: [bitte ergänzen]', 'Meine Rückrufnummer (optional): [bitte ergänzen]', '',
      'Freundliche Grüsse'
    ].join('\n');
    document.querySelector('#request-text').value = body;
    document.querySelector('#request-email').href = `mailto:info@rolfing-herren.ch?subject=${encodeURIComponent('Terminanfrage')}&body=${encodeURIComponent(body)}`;
  }

  function openStep(target) {
    for (const step of steps) step.open = step === target;
    target.querySelector('summary').focus({ preventScroll: true });
    target.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    status.textContent = {
      place: 'Wähle einen Standort.', time: 'Gib deinen gewünschten Zeitpunkt an.',
      type: 'Wähle eine Behandlungsart.', review: 'Prüfe deine Angaben. Es wurde noch keine Anfrage gesendet.'
    }[target.dataset.step];
    update();
  }

  for (const step of steps) {
    step.querySelector('summary').addEventListener('click', () => {
      if (!step.open) for (const other of steps) if (other !== step) other.open = false;
    });
    step.addEventListener('toggle', update);
  }
  for (const [index, form] of [placeForm, timeForm, typeForm].entries()) {
    form.noValidate = true;
    form.addEventListener('submit', event => {
      event.preventDefault();
      update();
      if (!form.reportValidity()) return;
      openStep(steps[index + 1]);
    });
    form.addEventListener('input', update);
    form.addEventListener('change', update);
  }
  update();
}
