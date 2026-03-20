const APP_CONFIG = {
  storageKey: "rvuTracker.v1",
  badges: [
    { name: "Eisen", min: 0, nextTarget: 10, className: "badge-iron", nextLabel: "Bronze" },
    { name: "Bronze", min: 10, nextTarget: 20, className: "badge-bronze", nextLabel: "Silber" },
    { name: "Silber", min: 20, nextTarget: 30, className: "badge-silver", nextLabel: "Gold" },
    { name: "Gold", min: 30, nextTarget: 40, className: "badge-gold", nextLabel: "Platin", nextTargetExclusive: true },
    { name: "Platin", min: 40, minExclusive: true, nextTarget: null, className: "badge-platinum", nextLabel: null }
  ],
  categories: [
    {
      id: "cat-1",
      name: "1 Röntgen",
      studies: [
        { code: "11", name: "Rö-Thx liegend", rvu: 0.18 },
        { code: "12", name: "Rö-Thx 2 Eb.", rvu: 0.21 },
        { code: "13", name: "Rö-Skelett 2 Eb.", rvu: 0.21 },
        { code: "14", name: "Rö-Skelett Zusatzeb.", rvu: 0.10 }
      ]
    },
    {
      id: "cat-2",
      name: "2 Kopf",
      studies: [
        { code: "21", name: "CT Kopf nativ", rvu: 0.83 },
        { code: "22", name: "CT Kopf/Hals nativ", rvu: 1.10 },
        { code: "23", name: "CT Kopf mit KM", rvu: 1.10 },
        { code: "24", name: "CT Kopf-Hals-Angio", rvu: 2.50 },
        { code: "25", name: "CT Perfusion", rvu: 0.21 }
      ]
    },
    {
      id: "cat-3",
      name: "3 Hals",
      studies: [
        { code: "31", name: "CT Hals nativ", rvu: 0.98 },
        { code: "32", name: "CT Hals mit KM", rvu: 1.19 },
        { code: "33", name: "CT Hals Angio", rvu: 1.71 }
      ]
    },
    {
      id: "cat-4",
      name: "4 Thorax",
      studies: [
        { code: "41", name: "CT Thorax nativ", rvu: 1.05 },
        { code: "42", name: "CT Thorax arteriell", rvu: 1.13 },
        { code: "43", name: "CT Thorax venös", rvu: 1.13 },
        { code: "44", name: "CT Thorax low-dose", rvu: 1.00 },
        { code: "45", name: "CT LAE", rvu: 1.77 }
      ]
    },
    {
      id: "cat-5",
      name: "5 Oberbauch",
      studies: [
        { code: "51", name: "CT Oberbauch arteriell", rvu: 1.13 }
      ]
    },
    {
      id: "cat-6",
      name: "6 Thx/Abd/Be Kombinationen",
      studies: [
        { code: "61", name: "CT Thx/Abd/Be nativ", rvu: 2.57 },
        { code: "62", name: "CT Thx/Abd/Be arteriell", rvu: 2.62 },
        { code: "63", name: "CT Thx/Abd/Be venös", rvu: 2.62 },
        { code: "64", name: "CT Abd/Be nativ", rvu: 1.70 },
        { code: "65", name: "CT Abd/Be arteriell", rvu: 1.77 },
        { code: "66", name: "CT Abd/Be venös", rvu: 1.77 },
        { code: "67", name: "CT Abd/Be low-dose", rvu: 1.19 }
      ]
    },
    {
      id: "cat-7",
      name: "7 Becken",
      studies: [
        { code: "71", name: "CT Becken nativ", rvu: 1.06 },
        { code: "72", name: "CT Becken arteriell", rvu: 1.13 },
        { code: "73", name: "CT Becken venös", rvu: 1.13 }
      ]
    },
    {
      id: "cat-8",
      name: "8 Sonstige",
      studies: [
        { code: "81", name: "CT Becken-Bein-Angio", rvu: 1.19 },
        { code: "82", name: "CT Gelenk", rvu: 0.98 },
        { code: "83", name: "CT Plasmo", rvu: 2.44 },
        { code: "84", name: "CT Herz", rvu: 1.71 }
      ]
    },
    {
      id: "cat-9",
      name: "9 Orga",
      studies: [
        { code: "91", name: "Aufklärung", rvu: 0.18 },
        { code: "92", name: "i.v.-Zugang", rvu: 0.27 },
        { code: "93", name: "Interventionsaufklärung", rvu: 1.13 }
      ]
    }
  ]
};

const elements = {
  activeDateText: document.getElementById("activeDateText"),
  rvuTotal: document.getElementById("rvuTotal"),
  badge: document.getElementById("badge"),
  progressLabel: document.getElementById("progressLabel"),
  progressNumbers: document.getElementById("progressNumbers"),
  progressFill: document.getElementById("progressFill"),
  categorySelect: document.getElementById("categorySelect"),
  studySelect: document.getElementById("studySelect"),
  addStudyBtn: document.getElementById("addStudyBtn"),
  oaModeToggle: document.getElementById("oaModeToggle"),
  quickCodeInput: document.getElementById("quickCodeInput"),
  todayHistoryList: document.getElementById("todayHistoryList"),
  exportBtn: document.getElementById("exportBtn"),
  importBtn: document.getElementById("importBtn"),
  importFileInput: document.getElementById("importFileInput"),
  statDays: document.getElementById("statDays"),
  statRvu: document.getElementById("statRvu"),
  statAvg: document.getElementById("statAvg"),
  dayArchiveList: document.getElementById("dayArchiveList"),
  deleteIconTemplate: document.getElementById("deleteIconTemplate")
};

const state = {
  activeDate: getTodayKey(),
  todayEntries: [],
  historyDays: [],
  oaModeEnabled: false,
  codeMap: buildCodeMap(APP_CONFIG.categories)
};

const BADGE_ICONS = {
  Eisen: `
    <svg viewBox="0 0 48 48" focusable="false">
      <path d="M24 5 11 13v13c0 7 4.1 12.8 13 16 8.9-3.2 13-9 13-16V13L24 5Z"></path>
      <path d="M24 14 19 20h3.7v10h2.6V20H29l-5-6Z"></path>
      <path d="M20.8 33.4h6.4l-3.2 3.8-3.2-3.8Z"></path>
    </svg>
  `,
  Bronze: `
    <svg viewBox="0 0 48 48" focusable="false">
      <path d="M24 4 10 12.8v13.3c0 7.8 4.6 14 14 17 9.4-3 14-9.2 14-17V12.8L24 4Z"></path>
      <path d="M24 12.5 17.4 21h5.1v10.8h3V21h5.1L24 12.5Z"></path>
      <path d="M24 31.8 27.8 36 24 40.4 20.2 36 24 31.8Z"></path>
    </svg>
  `,
  Silber: `
    <svg viewBox="0 0 48 48" focusable="false">
      <path d="M24 4 9.4 13v13.6c0 8.2 5 14.6 14.6 17.6 9.6-3 14.6-9.4 14.6-17.6V13L24 4Z"></path>
      <path d="M24 11.6 16.7 21h5.4v11.1h3.8V21h5.4L24 11.6Z"></path>
      <path d="M24 30.9 29.1 36 24 41.4 18.9 36 24 30.9Z"></path>
      <path d="m24 15.7 2 3.7h4l-3 2.2 1.1 3.5-4.1-2.6-4.1 2.6 1.1-3.5-3-2.2h4l2-3.7Z"></path>
    </svg>
  `,
  Gold: `
    <svg viewBox="0 0 48 48" focusable="false">
      <path d="M24 3.5 8.8 12.8v13.9c0 8.8 5.5 15.4 15.2 18.3 9.7-2.9 15.2-9.5 15.2-18.3V12.8L24 3.5Z"></path>
      <path d="M16.8 10.4 20 8.1l4 3.4 4-3.4 3.2 2.3-3 4.4H19.8l-3-4.4Z"></path>
      <path d="M24 11.2 15.9 21.6h5.9v11.6h4.4V21.6h5.9L24 11.2Z"></path>
      <path d="M24 30.1 30.1 36 24 42.2 17.9 36 24 30.1Z"></path>
      <path d="m24 15.2 2.2 4.2h4.7l-3.6 2.7 1.3 4.2-4.6-3-4.6 3 1.3-4.2-3.6-2.7h4.7l2.2-4.2Z"></path>
    </svg>
  `,
  Platin: `
    <svg viewBox="0 0 48 48" focusable="false">
      <path d="M24 3 8.2 12.6v14.2c0 9.4 6.1 16.3 15.8 19.2 9.7-2.9 15.8-9.8 15.8-19.2V12.6L24 3Z"></path>
      <path d="M14.8 9.6 18.2 7l3.9 3.2L24 6.8l1.9 3.4L29.8 7l3.4 2.6-3.2 5h-12l-3.2-5Z"></path>
      <path d="M24 10.2 14.9 21.8h6.5v12.1h5.2V21.8h6.5L24 10.2Z"></path>
      <path d="M24 28.8 30.8 35 24 42 17.2 35 24 28.8Z"></path>
      <path d="m24 14.4 2.4 4.4h5l-3.8 2.8 1.4 4.5-5-3.2-5 3.2 1.4-4.5-3.8-2.8h5l2.4-4.4Z"></path>
    </svg>
  `
};

init();

function init() {
  hydrateState();
  renderCategoryOptions();
  renderStudyOptions(elements.categorySelect.value);
  wireEvents();
  renderAll();
  elements.quickCodeInput.focus();
}

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildCodeMap(categories) {
  const map = new Map();
  categories.forEach((category) => {
    category.studies.forEach((study) => {
      map.set(study.code, {
        ...study,
        categoryId: category.id,
        categoryName: category.name
      });
    });
  });
  return map;
}

function hydrateState() {
  const raw = localStorage.getItem(APP_CONFIG.storageKey);
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    const storedToday = parsed.todayData || {};
    const storedSettings = parsed.settings || {};
    state.historyDays = Array.isArray(parsed.historyDays)
      ? parsed.historyDays.filter(isValidDayRecord)
      : [];
    state.oaModeEnabled = typeof storedSettings.oaModeEnabled === "boolean"
      ? storedSettings.oaModeEnabled
      : false;

    if (storedToday.date && storedToday.date !== state.activeDate && Array.isArray(storedToday.entries) && storedToday.entries.length > 0) {
      upsertHistoryDay(buildDayRecord(storedToday.date, storedToday.entries, "local"));
    }

    if (storedToday.date === state.activeDate && Array.isArray(storedToday.entries)) {
      state.todayEntries = storedToday.entries.filter(isValidEntry);
    }
  } catch (error) {
    console.warn("Storage konnte nicht gelesen werden:", error);
  }
}

function wireEvents() {
  elements.categorySelect.addEventListener("change", () => {
    renderStudyOptions(elements.categorySelect.value);
  });

  elements.addStudyBtn.addEventListener("click", () => {
    const selectedCode = elements.studySelect.value;
    addStudyByCode(selectedCode);
  });

  elements.oaModeToggle.addEventListener("change", (event) => {
    state.oaModeEnabled = Boolean(event.target.checked);
    persistState();
    renderAll();
    elements.quickCodeInput.focus();
  });

  elements.quickCodeInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    const code = elements.quickCodeInput.value.trim();
    if (code.length !== 2) {
      return;
    }
    addStudyByCode(code);
  });

  elements.exportBtn.addEventListener("click", exportTodayData);
  elements.importBtn.addEventListener("click", () => elements.importFileInput.click());
  elements.importFileInput.addEventListener("change", handleImportFile);
  elements.todayHistoryList.addEventListener("click", handleDeleteEntry);
}

function renderCategoryOptions() {
  elements.categorySelect.innerHTML = "";
  APP_CONFIG.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    elements.categorySelect.append(option);
  });
}

function renderStudyOptions(categoryId) {
  const category = APP_CONFIG.categories.find((item) => item.id === categoryId) || APP_CONFIG.categories[0];
  elements.studySelect.innerHTML = "";
  category.studies.forEach((study) => {
    const option = document.createElement("option");
    option.value = study.code;
    option.textContent = `${study.code} - ${study.name} (${formatRvu(study.rvu)} RVU)`;
    elements.studySelect.append(option);
  });
}

function addStudyByCode(code) {
  const mapped = state.codeMap.get(code);
  if (!mapped) {
    elements.quickCodeInput.select();
    return;
  }

  const now = new Date();
  const multiplier = state.oaModeEnabled ? 0.5 : 1;
  const appliedRvu = roundRvu(mapped.rvu * multiplier);
  const newEntry = {
    id: crypto.randomUUID(),
    code: mapped.code,
    name: mapped.name,
    categoryId: mapped.categoryId,
    categoryName: mapped.categoryName,
    rvu: appliedRvu,
    baseRvu: roundRvu(mapped.rvu),
    oaModeApplied: state.oaModeEnabled,
    timestampISO: now.toISOString()
  };

  state.todayEntries.unshift(newEntry);
  persistState();
  renderAll();
  flashSuccess();
  elements.quickCodeInput.value = "";
  elements.quickCodeInput.focus();
}

function handleDeleteEntry(event) {
  const button = event.target.closest("button[data-entry-id]");
  if (!button) {
    return;
  }

  const { entryId } = button.dataset;
  state.todayEntries = state.todayEntries.filter((entry) => entry.id !== entryId);
  persistState();
  renderAll();
  elements.quickCodeInput.focus();
}

function getTodayTotal() {
  return state.todayEntries.reduce((sum, entry) => sum + Number(entry.rvu || 0), 0);
}

function getBadgeMeta(totalRvu) {
  let current = APP_CONFIG.badges[0];
  APP_CONFIG.badges.forEach((badge) => {
    const isReached = badge.minExclusive ? totalRvu > badge.min : totalRvu >= badge.min;
    if (isReached) {
      current = badge;
    }
  });
  return current;
}

function getProgressValues(totalRvu, badgeMeta) {
  if (!badgeMeta.nextTarget) {
    return {
      label: "Maximales Level erreicht",
      textValue: `${formatRvu(totalRvu)} RVU`,
      percent: 100
    };
  }

  const base = badgeMeta.min;
  const span = badgeMeta.nextTarget - base;
  const current = badgeMeta.nextTargetExclusive
    ? clamp(totalRvu - base, 0, Math.max(0, span - 0.001))
    : clamp(totalRvu - base, 0, span);
  const percent = span === 0 ? 0 : (current / span) * 100;
  const targetPrefix = badgeMeta.nextTargetExclusive ? "> " : "";
  return {
    label: `Fortschritt zu ${badgeMeta.nextLabel}`,
    textValue: `${formatRvu(totalRvu)} / ${targetPrefix}${formatRvu(badgeMeta.nextTarget)}`,
    percent
  };
}

function renderAll() {
  const totalRvu = getTodayTotal();
  const badgeMeta = getBadgeMeta(totalRvu);
  const progress = getProgressValues(totalRvu, badgeMeta);

  elements.oaModeToggle.checked = state.oaModeEnabled;
  elements.activeDateText.textContent = `Datum: ${formatDate(state.activeDate)}`;
  elements.rvuTotal.textContent = `${formatRvu(totalRvu)} RVU`;

  elements.badge.className = "badge";
  elements.badge.classList.add(badgeMeta.className);
  elements.badge.setAttribute("aria-label", badgeMeta.name);
  elements.badge.innerHTML = `<span class="badge-icon" aria-hidden="true">${BADGE_ICONS[badgeMeta.name] || ""}</span>`;

  elements.progressLabel.textContent = progress.label;
  elements.progressNumbers.textContent = progress.textValue;
  elements.progressFill.style.width = `${progress.percent.toFixed(2)}%`;

  renderTodayHistory();
  renderStats();
}

function renderTodayHistory() {
  elements.todayHistoryList.innerHTML = "";

  if (state.todayEntries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Noch keine Untersuchungen erfasst.";
    elements.todayHistoryList.append(empty);
    return;
  }

  state.todayEntries.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "history-item";

    const time = document.createElement("span");
    time.className = "history-time";
    time.textContent = formatTime(entry.timestampISO);

    const study = document.createElement("div");
    study.className = "history-study";
    study.innerHTML = `<strong>${entry.code} - ${entry.name}</strong><span class="history-meta">${entry.categoryName}</span>`;

    const rvu = document.createElement("span");
    rvu.className = "history-rvu";
    rvu.textContent = `${formatRvu(entry.rvu)} RVU`;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.dataset.entryId = entry.id;
    deleteBtn.setAttribute("aria-label", "Eintrag löschen");
    deleteBtn.append(elements.deleteIconTemplate.content.firstElementChild.cloneNode(true));

    li.append(time, study, rvu, deleteBtn);
    elements.todayHistoryList.append(li);
  });
}

function renderStats() {
  const currentDayRecord = buildDayRecord(state.activeDate, state.todayEntries, "local");
  const allDays = [currentDayRecord, ...state.historyDays];
  const uniqueByDate = dedupeDaysByDate(allDays).sort((a, b) => b.date.localeCompare(a.date));

  const totalRvu = uniqueByDate.reduce((sum, day) => sum + day.totalRvu, 0);
  const daysCount = uniqueByDate.length;
  const average = daysCount === 0 ? 0 : totalRvu / daysCount;

  elements.statDays.textContent = String(daysCount);
  elements.statRvu.textContent = formatRvu(totalRvu);
  elements.statAvg.textContent = formatRvu(average);

  elements.dayArchiveList.innerHTML = "";
  if (uniqueByDate.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Noch keine Tagesdaten vorhanden.";
    elements.dayArchiveList.append(empty);
    return;
  }

  uniqueByDate.forEach((day) => {
    const item = document.createElement("li");
    item.className = "archive-item";
    item.innerHTML = `
      <span class="archive-date">${formatDate(day.date)}</span>
      <span>${formatRvu(day.totalRvu)} RVU • ${day.entries.length} Einträge</span>
    `;
    elements.dayArchiveList.append(item);
  });
}

function flashSuccess() {
  document.body.classList.remove("flash-success");
  void document.body.offsetWidth;
  document.body.classList.add("flash-success");
}

function persistState() {
  const payload = {
    todayData: {
      date: state.activeDate,
      entries: state.todayEntries
    },
    settings: {
      oaModeEnabled: state.oaModeEnabled
    },
    historyDays: state.historyDays
  };
  localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(payload));
}

async function exportTodayData() {
  const currentDayRecord = buildDayRecord(state.activeDate, state.todayEntries, "local");
  const allDays = dedupeDaysByDate([currentDayRecord, ...state.historyDays])
    .sort((a, b) => a.date.localeCompare(b.date));

  const payload = {
    type: "rvu-stats-export",
    version: 2,
    exportedAt: new Date().toISOString(),
    settings: {
      oaModeEnabled: state.oaModeEnabled
    },
    days: allDays
  };

  const json = JSON.stringify(payload, null, 2);

  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: "rvu-statistik.json",
        types: [
          {
            description: "JSON-Dateien",
            accept: { "application/json": [".json"] }
          }
        ]
      });
      const writable = await handle.createWritable();
      await writable.write(json);
      await writable.close();
      return;
    } catch (error) {
      if (error && error.name === "AbortError") {
        return;
      }
      console.warn("showSaveFilePicker fehlgeschlagen, nutze Download-Fallback:", error);
    }
  }

  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rvu-statistik.json";
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function handleImportFile(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const { days: importedDays, settings: importedSettings } = parseImportedData(parsed);

    if (importedDays.length === 0) {
      throw new Error("Keine gültigen Tagesdaten im Import gefunden.");
    }

    if (importedSettings && typeof importedSettings.oaModeEnabled === "boolean") {
      state.oaModeEnabled = importedSettings.oaModeEnabled;
    }

    importedDays.forEach((day) => {
      if (day.date === state.activeDate) {
        state.todayEntries = day.entries;
      } else {
        upsertHistoryDay(day);
      }
    });

    persistState();
    renderAll();
  } catch (error) {
    console.warn(error);
    alert(`Import fehlgeschlagen: ${error.message}`);
  } finally {
    event.target.value = "";
  }
}

function parseImportedData(parsed) {
  if (parsed && Array.isArray(parsed.days)) {
    const importedDays = parsed.days
      .filter((day) => day && day.date && Array.isArray(day.entries))
      .map((day) => buildDayRecord(day.date, day.entries, "import"));
    return {
      days: importedDays,
      settings: parsed.settings || null
    };
  }

  if (parsed && parsed.date && Array.isArray(parsed.entries)) {
    return {
      days: [buildDayRecord(parsed.date, parsed.entries, "import")],
      settings: null
    };
  }

  return { days: [], settings: null };
}

function upsertHistoryDay(dayRecord) {
  const idx = state.historyDays.findIndex((day) => day.date === dayRecord.date);
  if (idx >= 0) {
    state.historyDays[idx] = dayRecord;
  } else {
    state.historyDays.push(dayRecord);
  }
}

function dedupeDaysByDate(days) {
  const map = new Map();
  days.forEach((day) => {
    map.set(day.date, day);
  });
  return Array.from(map.values());
}

function buildDayRecord(date, entries, source) {
  const sanitizedEntries = (entries || []).filter(isValidEntry).map((entry) => ({
    id: entry.id || crypto.randomUUID(),
    code: String(entry.code),
    name: String(entry.name),
    categoryId: String(entry.categoryId || ""),
    categoryName: String(entry.categoryName || ""),
    rvu: roundRvu(Number(entry.rvu)),
    timestampISO: entry.timestampISO || new Date().toISOString()
  }));

  return {
    date,
    totalRvu: roundRvu(sanitizedEntries.reduce((sum, item) => sum + item.rvu, 0)),
    entries: sanitizedEntries,
    source: source || "import"
  };
}

function isValidEntry(entry) {
  return Boolean(
    entry &&
    entry.code &&
    entry.name &&
    Number.isFinite(Number(entry.rvu)) &&
    entry.timestampISO
  );
}

function isValidDayRecord(day) {
  return Boolean(day && day.date && Array.isArray(day.entries) && Number.isFinite(Number(day.totalRvu)));
}

function formatRvu(value) {
  return Number(value).toFixed(2);
}

function roundRvu(value) {
  return Math.round(Number(value) * 100) / 100;
}

function formatDate(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function formatTime(timestampISO) {
  const date = new Date(timestampISO);
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(date);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
