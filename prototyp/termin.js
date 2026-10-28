const assistant = document.querySelector('.appointment-assistant');
if (assistant) {
  const steps = [...assistant.querySelectorAll('.appointment-step')];
  const forms = ['place', 'type', 'time', 'contact'].map(id => document.querySelector(`#${id}-form`));
  const [placeForm, typeForm, timeForm, contactForm] = forms;
  const date = document.querySelector('#booking-date');
  const slots = document.querySelector('#time-slots');
  const status = document.querySelector('.assistant-status');
  const slotError = document.querySelector('#slot-error');
  const reviewForm = document.querySelector('#review-form');
  const name = document.querySelector('#customer-name');
  const email = document.querySelector('#customer-email');
  const phone = document.querySelector('#customer-phone');
  const storageKey = 'balance.booking-demo.v1';
  const times = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30'];
  const places = { bern: { name: 'Bern', day: 1, weekday: 'Montag', address: 'Kramgasse 12, 3011 Bern' }, niederscherli: { name: 'Niederscherli', day: 2, weekday: 'Dienstag', address: 'Schwarzenburgstrasse 854, 3145 Niederscherli' } };
  const treatments = { rolfing: 'Rolfing®', fascia: 'Faszientherapie', scar: 'ScarWork: Narbenarbeit', unsure: 'Passende Behandlung zuerst besprechen' };
  const visits = { first: 'Erster Termin', returning: 'Folgetermin' };
  const selected = (form, field) => form.querySelector(`input[name="${field}"]:checked`)?.value || '';
  let chosenTime = '';
  let memoryBookings = [];
  let storageAvailable = true;
  let booking = false;

  function clock() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Zurich', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map(p => [p.type, p.value]));
    return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
  }
  function dayObject(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [y, m, d] = value.split('-').map(Number);
    const result = new Date(Date.UTC(y, m - 1, d, 12));
    return Number.isFinite(result.getTime()) && result.toISOString().slice(0, 10) === value ? result : null;
  }
  const dayString = value => value.toISOString().slice(0, 10);
  function readableDate(value) {
    const day = dayObject(value);
    return day ? new Intl.DateTimeFormat('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(day) : '';
  }
  function endTime(value) {
    const [hours, minutes] = value.split(':').map(Number);
    const end = hours * 60 + minutes + 75;
    return `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`;
  }
  function storageUnavailable() {
    storageAvailable = false;
    document.querySelector('#storage-note').hidden = false;
  }
  function readBookings() {
    if (!storageAvailable) return [...memoryBookings];
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      memoryBookings = Array.isArray(saved) ? saved.filter(v => typeof v === 'string' && /^(bern|niederscherli)\|\d{4}-\d{2}-\d{2}\|\d{2}:\d{2}$/.test(v)).slice(-200) : [];
    } catch { storageUnavailable(); }
    return [...memoryBookings];
  }
  function saveBookings(values) {
    memoryBookings = values.slice(-200);
    if (storageAvailable) try { localStorage.setItem(storageKey, JSON.stringify(memoryBookings)); } catch { storageUnavailable(); }
  }
  const slotKey = time => `${selected(placeForm, 'place')}|${date.value}|${time}`;
  function isPracticeDay() {
    const place = places[selected(placeForm, 'place')];
    const day = dayObject(date.value);
    return !!place && !!day && day.getUTCDay() === place.day && date.value >= date.min && date.value <= date.max;
  }
  function unavailable(time) {
    const now = clock();
    return !isPracticeDay() || !times.includes(time) || readBookings().includes(slotKey(time)) || (date.value === now.date && time <= now.time);
  }
  function nextDate() {
    const place = places[selected(placeForm, 'place')];
    if (!place) return;
    const now = clock();
    const day = dayObject(now.date);
    for (let i = 0; i <= 90; i++) {
      date.value = dayString(day);
      if (day.getUTCDay() === place.day && times.some(time => !unavailable(time))) break;
      day.setUTCDate(day.getUTCDate() + 1);
    }
    chosenTime = '';
    renderSlots();
  }
  function renderSlots() {
    const now = clock();
    date.min = now.date;
    const limit = dayObject(now.date); limit.setUTCDate(limit.getUTCDate() + 90); date.max = dayString(limit);
    slots.replaceChildren();
    const place = places[selected(placeForm, 'place')];
    const hint = document.querySelector('#schedule-hint');
    if (!place) { hint.textContent = 'Bitte wähle zuerst einen Standort.'; chosenTime = ''; update(); return; }
    hint.textContent = `Zeitauswahl in ${place.name}: ${place.weekday}, 8 bis 17 Uhr. Behandlung: 75 Minuten, anschliessend 15 Minuten Pause.`;
    if (!isPracticeDay()) {
      const note = document.createElement('p'); note.className = 'field-note'; note.textContent = date.value ? `An diesem Datum sind keine Zeiten für die Auswahl vorgesehen. Wähle einen ${place.weekday} oder nutze den nächsten Behandlungstag.` : 'Bitte wähle ein Datum.'; slots.append(note); chosenTime = ''; update(); return;
    }
    if (chosenTime && unavailable(chosenTime)) chosenTime = '';
    for (const time of times) {
      const disabled = unavailable(time);
      const label = document.createElement('label'); label.className = 'slot-option';
      const input = document.createElement('input'); input.type = 'radio'; input.name = 'slot'; input.value = time; input.disabled = disabled; input.required = true; input.checked = chosenTime === time;
      const text = document.createElement('span'); text.textContent = time;
      const state = document.createElement('small'); state.textContent = disabled ? 'Nicht auswählbar' : 'Auswählbar';
      input.addEventListener('change', () => { chosenTime = time; slotError.hidden = true; update(); });
      label.append(input, text, state); slots.append(label);
    }
    update();
  }
  function valid(form) { return [...form.elements].every(field => !field.willValidate || field.validity.valid); }
  function validateContact() {
    name.setCustomValidity(name.value && name.value.trim().length < 2 ? 'Bitte gib deinen Vor- und Nachnamen an.' : '');
    const digits = phone.value.replace(/\D/g, '');
    phone.setCustomValidity(phone.value && (!/^[+\d\s().-]+$/.test(phone.value) || digits.length < 7 || digits.length > 15) ? 'Bitte gib eine gültige Telefonnummer an.' : '');
  }
  function complete() { return forms.every(valid) && !!chosenTime && !unavailable(chosenTime); }
  function summaryRows() {
    const place = places[selected(placeForm, 'place')];
    return [
      ['Ort', `${place.name}, ${place.address}`], ['Datum', readableDate(date.value)], ['Zeit', `${chosenTime} bis ${endTime(chosenTime)} Uhr`],
      ['Behandlung', treatments[selected(typeForm, 'treatment')]], ['Besuch', visits[selected(typeForm, 'visit')]],
      ['Name', name.value.trim()], ['E-Mail', email.value.trim()], ['Telefon', phone.value.trim()]
    ];
  }
  function fillSummary(target, rows) {
    target.replaceChildren();
    for (const [heading, value] of rows) {
      const row = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = heading; dd.textContent = value; row.append(dt, dd); target.append(row);
    }
  }
  function update() {
    validateContact();
    const place = places[selected(placeForm, 'place')];
    const treatment = treatments[selected(typeForm, 'treatment')];
    const ready = complete();
    document.querySelector('[data-answer="place"]').textContent = place?.name || 'Bitte wählen';
    document.querySelector('[data-answer="type"]').textContent = valid(typeForm) ? treatment : 'Noch offen';
    document.querySelector('[data-answer="time"]').textContent = chosenTime && !unavailable(chosenTime) ? `${new Intl.DateTimeFormat('de-CH', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }).format(dayObject(date.value))}, ${chosenTime}` : 'Noch offen';
    document.querySelector('[data-answer="contact"]').textContent = valid(contactForm) ? 'Vollständig' : 'Noch offen';
    document.querySelector('[data-answer="review"]').textContent = ready ? 'Bereit zum Prüfen' : 'Noch unvollständig';
    reviewForm.hidden = !ready;
    document.querySelector('#review-incomplete').hidden = ready;
    if (ready) fillSummary(document.querySelector('#booking-summary'), summaryRows());
    else document.querySelector('#booking-summary').replaceChildren();
  }
  function openStep(step) {
    for (const item of steps) item.open = item === step;
    step.querySelector('summary').focus({ preventScroll: true });
    step.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    status.textContent = { place: 'Wähle einen Standort.', type: 'Wähle eine Behandlung.', time: 'Wähle ein Datum und eine freie Uhrzeit.', contact: 'Ergänze deine Kontaktdaten.', review: 'Prüfe deine Angaben vor dem Abschluss.' }[step.dataset.step];
    update();
  }
  for (const step of steps) {
    step.querySelector('summary').addEventListener('click', () => { if (!step.open) for (const other of steps) if (other !== step) other.open = false; });
    step.addEventListener('toggle', update);
  }
  for (const [index, form] of forms.entries()) {
    form.noValidate = true;
    form.addEventListener('submit', event => {
      event.preventDefault(); update();
      if (!form.reportValidity()) return;
      if (form === timeForm && (!chosenTime || unavailable(chosenTime))) { slotError.textContent = 'Bitte wähle eine freie Uhrzeit an einem Behandlungstag.'; slotError.hidden = false; return; }
      openStep(steps[index + 1]);
    });
    form.addEventListener('input', update);
    form.addEventListener('change', update);
  }
  placeForm.addEventListener('change', nextDate);
  date.addEventListener('change', () => { chosenTime = ''; slotError.hidden = true; renderSlots(); });
  document.querySelector('#next-practice-day').addEventListener('click', nextDate);
  reviewForm.noValidate = true;
  reviewForm.addEventListener('submit', async event => {
    event.preventDefault(); if (booking) return;
    update(); if (!complete() || !reviewForm.reportValidity()) return;
    booking = true; const button = document.querySelector('#book-button'); button.disabled = true;
    const finish = () => {
      if (unavailable(chosenTime)) return false;
      const key = slotKey(chosenTime); const rows = summaryRows();
      saveBookings([...new Set([...readBookings(), key])]);
      fillSummary(document.querySelector('#success-summary'), rows);
      return true;
    };
    try {
      const saved = navigator.locks ? await navigator.locks.request('balance-demo-booking', finish) : finish();
      if (!saved) {
        chosenTime = ''; renderSlots(); openStep(steps[2]); slotError.textContent = 'Diese Zeit ist nicht mehr auswählbar. Bitte wähle eine andere Uhrzeit.'; slotError.hidden = false; return;
      }
      document.querySelector('#booking-steps').hidden = true;
      const success = document.querySelector('#booking-success'); success.hidden = false; success.focus(); success.scrollIntoView({ block: 'start' });
      contactForm.reset(); reviewForm.reset(); document.querySelector('#booking-summary').replaceChildren();
    } finally { booking = false; button.disabled = false; }
  });
  document.querySelector('#start-another').addEventListener('click', () => {
    document.querySelector('#booking-success').hidden = true; document.querySelector('#success-summary').replaceChildren(); document.querySelector('#booking-steps').hidden = false;
    chosenTime = ''; renderSlots(); openStep(steps[2]);
  });
  document.querySelector('.demo-reset').addEventListener('click', () => { saveBookings([]); renderSlots(); status.textContent = 'Deine gespeicherte Auswahl wurde zurückgesetzt.'; });
  window.addEventListener('storage', event => {
    if (event.key !== storageKey) return;
    const previous = chosenTime;
    renderSlots();
    if (previous && !chosenTime && !document.querySelector('#booking-steps').hidden) {
      openStep(steps[2]);
      slotError.textContent = 'Diese Zeit wurde in einem anderen Tab ausgewählt. Bitte wähle eine andere Uhrzeit.';
      slotError.hidden = false;
    }
  });
  date.min = clock().date; const limit = dayObject(date.min); limit.setUTCDate(limit.getUTCDate() + 90); date.max = dayString(limit);
  readBookings(); renderSlots();
}
