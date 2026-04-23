// ============================================================
// APP.JS — Main Controller
// Connects the UI to the parser, scheduler, and resource modules.
// Everyone works in this file a little, but mostly You + Person B.
// ============================================================

import { extractTopics } from './parser.js';
import { generateStudyPlan } from './scheduler.js';
import { fetchAllResources, parsePDF } from './resources.js';

// ============================
// APPLICATION STATE
// ============================
const state = {
  subject: '',
  syllabusText: '',
  examDate: null,
  dailyHours: 4,
  goal: 'good',
  lang: 'en',
  ytApiKey: '',
  topics: [],
  schedule: [],
  resources: {},
  totalDays: 0,
  totalHours: 0
};

// Track which input mode is currently active
let currentInputMode = 'text';

// ============================
// PAGE NAVIGATION
// ============================
window.goToPage = function(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0, 0);
};

// ============================
// INPUT MODE TOGGLE (Text / PDF / Manual)
// Only ONE definition — handles all three modes
// ============================
window.switchInputMode = function(mode, btn) {
  currentInputMode = mode;
  btn.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('textInputWrap').style.display = mode === 'text' ? 'block' : 'none';
  document.getElementById('pdfInputWrap').style.display = mode === 'pdf' ? 'block' : 'none';
  document.getElementById('manualInputWrap').style.display = mode === 'manual' ? 'block' : 'none';

  // Auto-add first two units when switching to manual mode
  if (mode === 'manual' && manualUnitCount === 0) {
    addManualUnit();
    addManualUnit();
  }
};

// ============================
// GOAL SELECTION
// ============================
window.selectGoal = function(goal, el) {
  state.goal = goal;
  document.querySelectorAll('.goal-card').forEach(g => g.classList.remove('selected'));
  el.classList.add('selected');
};

// ============================
// PDF UPLOAD HANDLER
// ============================
window.handlePDFUpload = async function(input) {
  const file = input.files[0];
  if (!file) return;

  document.getElementById('pdfStatus').classList.remove('hidden');
  document.getElementById('pdfFileName').textContent = file.name + ' (reading...)';

  try {
    const text = await parsePDF(file);
    state.syllabusText = text;
    document.getElementById('pdfFileName').textContent = file.name + ' — extracted!';
    showToast('PDF parsed successfully', 'success');
  } catch (err) {
    document.getElementById('pdfFileName').textContent = file.name + ' — error reading file';
    showToast('Failed to read PDF', 'error');
  }
};

// ============================
// DEMO DATA
// ============================
const DEMO_SYLLABUS = `Operating Systems (CS501)

Unit 1: Process Management
- Process concepts and process control block
- Process scheduling algorithms (FCFS, SJF, Round Robin, Priority)
- Multithreading models and thread libraries
- Process synchronization and critical section problem
- Semaphores and monitors

Unit 2: Deadlocks and Memory Management
- Deadlock conditions: prevention, avoidance, detection
- Banker's algorithm for deadlock avoidance
- Contiguous memory allocation strategies
- Paging and segmentation techniques
- Virtual memory and page replacement algorithms

Unit 3: File Systems and I/O
- File system structure and implementation
- Directory structures and file allocation methods
- Free space management techniques
- Disk scheduling algorithms (SCAN, C-SCAN, LOOK)
- I/O systems and device management

Unit 4: Computer Networks Fundamentals
- OSI and TCP/IP protocol models
- Physical layer: transmission media and multiplexing
- Data link layer: error detection, flow control, MAC protocols
- Network layer: IP addressing, subnetting, routing algorithms
- Transport layer: TCP, UDP, congestion control

Unit 5: Application Layer and Network Security
- Application layer protocols: HTTP, DNS, SMTP, FTP
- Network security basics and cryptography
- Symmetric and asymmetric encryption algorithms
- Digital signatures and certificates
- Firewalls and intrusion detection systems`;

window.loadDemo = function() {
  state.subject = 'Operating Systems (CS501)';
  state.syllabusText = DEMO_SYLLABUS;
  state.examDate = getFutureDate(30);
  state.dailyHours = 4;
  state.goal = 'good';

  document.getElementById('subjectName').value = state.subject;
  document.getElementById('syllabusText').value = DEMO_SYLLABUS;
  document.getElementById('examDate').value = state.examDate;
  document.getElementById('dailyHours').value = 4;
  document.getElementById('hoursVal').textContent = '4';

  // Switch to text mode so the demo syllabus is visible
  const textBtn = document.querySelector('.tab-toggle .tab-btn');
  if (textBtn) switchInputMode('text', textBtn);

  goToPage('page-input');
  showToast('Demo syllabus loaded — hit Analyze', 'success');
};

function getFutureDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

// ============================
// MANUAL ENTRY MODE
// ============================

let manualUnitCount = 0;

// Add a new unit card to the manual entry form
window.addManualUnit = function() {
  manualUnitCount++;
  const container = document.getElementById('manualUnits');
  if (!container) return;
  const card = document.createElement('div');
  card.className = 'manual-unit-card';
  card.id = `manual-unit-${manualUnitCount}`;
  card.innerHTML = `
    <div class="unit-card-header">
      <span class="unit-number">Unit ${manualUnitCount}</span>
      <button class="remove-unit-btn" onclick="removeManualUnit('manual-unit-${manualUnitCount}')">
        <i class="fas fa-trash-alt"></i> Remove
      </button>
    </div>
    <label class="field-label">Unit Name</label>
    <input type="text" class="manual-unit-name" placeholder="e.g., Inheritance and Exceptions">
    <label class="field-label">Subtopics (one per line)</label>
    <textarea class="manual-unit-subs" placeholder="Types of inheritance&#10;Member access rules&#10;Usage of super keyword&#10;Method overriding"></textarea>
  `;
  container.appendChild(card);
};

// Remove a unit card
window.removeManualUnit = function(cardId) {
  const card = document.getElementById(cardId);
  if (card) {
    card.remove();
    // Renumber remaining units
    const cards = document.querySelectorAll('.manual-unit-card');
    cards.forEach((c, i) => {
      c.querySelector('.unit-number').textContent = `Unit ${i + 1}`;
    });
    manualUnitCount = cards.length;
  }
};

// Convert manual entry data into the same format as extractTopics()
function getManualTopics() {
  const cards = document.querySelectorAll('.manual-unit-card');
  const topics = [];

  cards.forEach((card, idx) => {
    const nameInput = card.querySelector('.manual-unit-name');
    const subsTextarea = card.querySelector('.manual-unit-subs');

    const name = nameInput ? nameInput.value.trim() : '';
    const subsText = subsTextarea ? subsTextarea.value.trim() : '';

    if (!name) return; // Skip empty units

    const subtopics = subsText
      .split('\n')
      .map(s => s.trim().replace(/^[-•▪▸➤●○◦\d.)\s]+/, '')) // Remove bullets/numbers
      .filter(s => s.length > 1);

    topics.push({
      name: name,
      subtopics: subtopics,
      weight: 1,
      priority: 'medium'
    });
  });

  // Apply the same weight calculation as the parser
  if (topics.length === 0) return topics;

  const maxSub = Math.max(...topics.map(t => t.subtopics.length), 1);

  topics.forEach((t, idx) => {
    const densityScore = (t.subtopics.length / maxSub) * 3;
    const positionScore = (1 - (idx / topics.length)) * 0.6;
    const words = new Set(t.subtopics.join(' ').toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const diversityScore = Math.min(words.size / 15, 0.5);
    const importantKw = ['introduction', 'fundamentals', 'basics', 'overview', 'concepts', 'principles', 'design', 'analysis', 'architecture', 'management'];
    const hasImportant = importantKw.some(kw => t.name.toLowerCase().includes(kw)) ? 0.6 : 0;

    const rawWeight = 1 + densityScore + positionScore + diversityScore + hasImportant;
    t.weight = Math.round(rawWeight * 10) / 10;
  });

  const maxW = Math.max(...topics.map(t => t.weight));
  if (maxW > 0) {
    topics.forEach(t => {
      t.weight = Math.max(1, Math.round((t.weight / maxW) * 10 * 10) / 10);
    });
  }

  topics.forEach(t => {
    if (t.weight >= 7) t.priority = 'high';
    else if (t.weight >= 4) t.priority = 'medium';
    else t.priority = 'low';
  });

  return topics;
}

// ============================
// STEP 1: ANALYZE SYLLABUS
// Handles both auto-paste and manual entry modes
// ============================
window.handleAnalyze = function() {
  // Read common inputs
  state.subject = document.getElementById('subjectName').value.trim();
  state.examDate = document.getElementById('examDate').value;
  state.dailyHours = parseFloat(document.getElementById('dailyHours').value);
  state.lang = document.getElementById('langSelect').value;
  state.ytApiKey = document.getElementById('ytApiKey').value.trim();

  // Validate common fields first
  if (!state.subject) {
    showToast('Please enter a subject name', 'error');
    return;
  }
  if (!state.examDate) {
    showToast('Please select an exam date', 'error');
    return;
  }
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const exam = new Date(state.examDate);
  if (exam <= today) {
    showToast('Exam date must be in the future', 'error');
    return;
  }

  // Check which input mode is active and get topics accordingly
  if (currentInputMode === 'manual') {
    // ---- MANUAL MODE ----
    state.topics = getManualTopics();
    if (state.topics.length === 0) {
      showToast('Please add at least one unit with a name', 'error');
      return;
    }
  } else {
    // ---- TEXT / PDF MODE ----
    const textFromBox = document.getElementById('syllabusText').value.trim();
    if (textFromBox.length > 20) {
      state.syllabusText = textFromBox;
    }

    if (!state.syllabusText || state.syllabusText.length < 20) {
      showToast('Please provide a valid syllabus (at least a few lines)', 'error');
      return;
    }

    state.topics = extractTopics(state.syllabusText);

    if (state.topics.length === 0) {
      showToast('Could not detect topics. Try Manual Entry mode instead.', 'error');
      return;
    }
  }

  // Show the Review page with weight sliders
  renderReviewPage();
  goToPage('page-review');
};

// ============================
// REVIEW PAGE RENDERING
// ============================
function renderReviewPage() {
  const container = document.getElementById('reviewCards');
  container.innerHTML = '';

  state.topics.forEach((topic, idx) => {
    const priorityClass = `badge-${topic.priority}`;
    const priorityLabel = topic.priority.charAt(0).toUpperCase() + topic.priority.slice(1);
    const weightColor = topic.priority === 'high' ? 'color:#f87171' : topic.priority === 'medium' ? 'color:#fbbf24' : 'color:#34d399';

    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-card-header">
        <div>
          <div class="meta">
            <span class="unit-label">Unit ${idx + 1}</span>
            <span class="badge ${priorityClass}" id="pr-badge-${idx}">${priorityLabel}</span>
          </div>
          <h4 style="font-size:1rem;font-weight:700">${topic.name}</h4>
        </div>
        <div class="weight-display" id="weight-val-${idx}" style="${weightColor}">${topic.weight}</div>
      </div>
      ${topic.subtopics.length > 0 ? `
        <div class="subtopic-tags">
          ${topic.subtopics.slice(0, 5).map(s => `<span class="subtopic-tag">${s}</span>`).join('')}
          ${topic.subtopics.length > 5 ? `<span class="subtopic-tag">+${topic.subtopics.length - 5} more</span>` : ''}
        </div>
      ` : ''}
      <div class="slider-row">
        <span>1</span>
        <input type="range" min="1" max="10" step="0.5" value="${topic.weight}" style="flex:1"
          oninput="updateWeight(${idx}, this.value)">
        <span>10</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// Called when user drags a weight slider
window.updateWeight = function(idx, val) {
  const v = parseFloat(val);
  state.topics[idx].weight = v;

  const weightEl = document.getElementById('weight-val-' + idx);
  weightEl.textContent = v;

  const pr = v >= 7 ? 'high' : v >= 4 ? 'medium' : 'low';
  state.topics[idx].priority = pr;

  const badge = document.getElementById('pr-badge-' + idx);
  badge.className = `badge badge-${pr}`;
  badge.textContent = pr.charAt(0).toUpperCase() + pr.slice(1);

  weightEl.style.color = pr === 'high' ? '#f87171' : pr === 'medium' ? '#fbbf24' : '#34d399';
};

// ============================
// STEP 2: GENERATE PLAN
// ============================
window.handleGenerate = async function() {
  goToPage('page-processing');
  await runProcessingAnimation();

  const today2 = new Date(); today2.setHours(0, 0, 0, 0);
  const exam2 = new Date(state.examDate);
  state.totalDays = Math.ceil((exam2 - today2) / (1000 * 60 * 60 * 24));
  state.totalHours = state.totalDays * state.dailyHours;

  state.schedule = generateStudyPlan(state.topics, state.totalDays, state.dailyHours, state.goal);
  state.resources = await fetchAllResources(state.topics, state.subject, state.lang, state.ytApiKey);

  renderDashboard();
  goToPage('page-results');
};

// ============================
// PROCESSING ANIMATION
// ============================
async function runProcessingAnimation() {
  const steps = document.querySelectorAll('.p-step');
  const progress = document.getElementById('processingProgress');
  const delays = [600, 1000, 1500, 800];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    step.classList.add('visible');

    const icon = step.querySelector('.p-step-icon');
    icon.innerHTML = '<div class="spinner-small"></div>';

    progress.style.width = ((i + 0.5) / steps.length * 100) + '%';

    await new Promise(r => setTimeout(r, delays[i]));

    icon.innerHTML = '<i class="fas fa-check" style="font-size:0.8rem"></i>';
    step.classList.add('done');
    progress.style.width = ((i + 1) / steps.length * 100) + '%';
  }

  await new Promise(r => setTimeout(r, 400));
}

// ============================
// DASHBOARD RENDERING
// ============================
function renderDashboard() {
  document.getElementById('dashSubject').textContent = state.subject;
  document.getElementById('statTopics').textContent = state.topics.length;
  document.getElementById('statDays').textContent = state.totalDays;
  document.getElementById('statHours').textContent = Math.round(state.totalHours);
  document.getElementById('statHigh').textContent = state.topics.filter(t => t.priority === 'high').length;

  renderSchedule();
  renderResources();
  renderTopicMap();
}

// ---- Schedule Tab ----
function renderSchedule() {
  const container = document.getElementById('tab-schedule');
  container.innerHTML = '';

  const dayGroups = {};
  for (const entry of state.schedule) {
    if (!dayGroups[entry.day]) dayGroups[entry.day] = [];
    dayGroups[entry.day].push(entry);
  }

  const startDate = new Date();

  for (const [day, entries] of Object.entries(dayGroups)) {
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + parseInt(day) - 1);
    const dateStr = dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const totalDayHours = entries.reduce((s, e) => s + e.hours, 0);

    const card = document.createElement('div');
    card.className = 'day-card';
    card.innerHTML = `
      <div class="day-card-header">
        <div style="display:flex;align-items:center;gap:12px">
          <div class="day-badge">D${day}</div>
          <div>
            <div style="font-weight:700;font-family:'Sora',sans-serif;font-size:0.9rem">Day ${day}</div>
            <div style="font-size:0.75rem;color:var(--dim)">${dateStr}</div>
          </div>
        </div>
        <div class="day-hours"><i class="fas fa-clock"></i> ${Math.round(totalDayHours * 10) / 10} hrs</div>
      </div>
      ${entries.map(entry => {
        const typeIcons = { study: 'fa-book', revision: 'fa-rotate', practice: 'fa-pen-to-square' };
        const typeLabels = { study: 'Study', revision: 'Revision', practice: 'Practice' };
        return `
          <div class="entry-row">
            <div class="check-box ${entry.completed ? 'checked' : ''}"
              onclick="toggleComplete(${entry.day}, '${entry.topic.replace(/'/g, "\\'")}', '${entry.type}')">
              <i class="fas fa-check"></i>
            </div>
            <i class="fas ${typeIcons[entry.type]} entry-type-icon ${entry.type}"></i>
            <span class="entry-label ${entry.completed ? 'done' : ''}">${entry.topic}</span>
            <span class="entry-type-badge">${typeLabels[entry.type]}</span>
            <span class="entry-hours">${entry.hours}h</span>
          </div>
        `;
      }).join('')}
    `;
    container.appendChild(card);
  }
}

window.toggleComplete = function(day, topic, type) {
  const entry = state.schedule.find(s => s.day == day && s.topic === topic && s.type === type);
  if (entry) {
    entry.completed = !entry.completed;
    renderSchedule();
    if (entry.completed) showToast('Marked complete', 'success');
  }
};

// ---- Resources Tab ----
function renderResources() {
  const container = document.getElementById('tab-resources');
  container.innerHTML = '';

  state.topics.forEach((topic, idx) => {
    const r = state.resources[topic.name] || {};
    const priorityClass = `badge-${topic.priority}`;

    const section = document.createElement('div');
    section.className = 'resource-section';

    let ytHtml = '';
    if (r.youtube) {
      ytHtml = `
        <a href="${r.youtube.url}" target="_blank" rel="noopener" class="resource-link" style="margin-bottom:0.6rem">
          <div class="resource-icon yt"><i class="fab fa-youtube"></i></div>
          <div class="resource-info">
            <div class="title">${r.youtube.title}</div>
            <div class="subtitle">${r.youtube.channel} — Watch on YouTube</div>
          </div>
          <div class="resource-external"><i class="fas fa-external-link-alt"></i></div>
        </a>`;
    } else {
      ytHtml = `
        <a href="${r.youtubeFallbackUrl}" target="_blank" rel="noopener" class="resource-link" style="margin-bottom:0.6rem">
          <div class="resource-icon yt"><i class="fab fa-youtube"></i></div>
          <div class="resource-info">
            <div class="title">Search on YouTube</div>
            <div class="subtitle">Curated channel search for this topic</div>
          </div>
          <div class="resource-external"><i class="fas fa-external-link-alt"></i></div>
        </a>`;
    }

    section.innerHTML = `
      <div class="resource-section-header">
        <div class="topic-num">${idx + 1}</div>
        <h4>${topic.name}</h4>
        <span class="badge ${priorityClass}">${topic.priority}</span>
      </div>
      ${ytHtml}
      <div class="resource-grid">
        <a href="${r.notes}" target="_blank" rel="noopener" class="resource-link">
          <div class="resource-icon notes"><i class="fas fa-file-alt"></i></div>
          <div class="resource-info">
            <div class="title">${r.notesCurated ? 'Curated Notes' : 'Search Notes'}</div>
            <div class="subtitle">${r.notesCurated ? 'GeeksforGeeks' : 'Google Search'}</div>
          </div>
          <div class="resource-external"><i class="fas fa-external-link-alt"></i></div>
        </a>
        <a href="${r.pyq}" target="_blank" rel="noopener" class="resource-link">
          <div class="resource-icon pyq"><i class="fas fa-question-circle"></i></div>
          <div class="resource-info">
            <div class="title">${r.pyqCurated ? 'GATE PYQs' : 'Search PYQs'}</div>
            <div class="subtitle">${r.pyqCurated ? 'GateOverflow' : 'Previous Year Papers'}</div>
          </div>
          <div class="resource-external"><i class="fas fa-external-link-alt"></i></div>
        </a>
      </div>
    `;
    container.appendChild(section);
  });
}

// ---- Topic Map Tab ----
function renderTopicMap() {
  const container = document.getElementById('tab-topics');
  container.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'topics-grid';

  state.topics.forEach((topic, idx) => {
    const priorityClass = `badge-${topic.priority}`;
    const priorityLabel = topic.priority.charAt(0).toUpperCase() + topic.priority.slice(1);
    const weightPercent = (topic.weight / 10) * 100;

    const card = document.createElement('div');
    card.className = 'topic-card';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.8rem">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span class="unit-label">Unit ${idx + 1}</span>
            <span class="badge ${priorityClass}">${priorityLabel}</span>
          </div>
          <h4 style="font-size:0.95rem;font-weight:700">${topic.name}</h4>
        </div>
        <div style="text-align:right">
          <div style="font-size:1.3rem;font-weight:800;font-family:'Sora',sans-serif;color:${topic.priority === 'high' ? '#f87171' : topic.priority === 'medium' ? '#fbbf24' : '#34d399'}">${topic.weight}</div>
          <div style="font-size:0.7rem;color:var(--dim)">weight</div>
        </div>
      </div>
      <div class="progress-bar" style="margin-bottom:0.8rem">
        <div class="progress-fill" style="width:${weightPercent}%"></div>
      </div>
      ${topic.subtopics.length > 0 ? `
        <div style="font-size:0.85rem;color:var(--muted)">
          ${topic.subtopics.slice(0, 4).map(s => `<div style="margin-bottom:2px"><i class="fas fa-chevron-right" style="font-size:0.6rem;color:rgba(16,185,129,0.4);margin-right:6px"></i>${s}</div>`).join('')}
          ${topic.subtopics.length > 4 ? `<div style="font-size:0.75rem;color:var(--dim);margin-top:4px">+${topic.subtopics.length - 4} more</div>` : ''}
        </div>
      ` : ''}
    `;
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

// ============================
// DASHBOARD TAB SWITCH
// ============================
window.switchDashTab = function(tabName, btn) {
  document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
  document.querySelectorAll('.dash-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tabName).style.display = 'block';
  btn.classList.add('active');
};

// ============================
// EXPORT / DOWNLOAD
// ============================
window.downloadPlan = function() {
  let content = `SMART SYLLABUS NAVIGATOR - STUDY PLAN\n${'='.repeat(50)}\n\n`;
  content += `Subject: ${state.subject}\nExam Date: ${state.examDate}\nDaily Hours: ${state.dailyHours}\nGoal: ${state.goal === 'pass' ? 'Just Pass' : state.goal === 'good' ? 'Good Score' : 'Top Score'}\nDays: ${state.totalDays}\nTotal Hours: ${Math.round(state.totalHours)}\n\n`;

  content += `TOPICS\n${'-'.repeat(30)}\n`;
  state.topics.forEach((t, i) => {
    content += `\n${i + 1}. ${t.name} [${t.priority.toUpperCase()}, weight: ${t.weight}]\n`;
    t.subtopics.forEach(s => content += `   - ${s}\n`);
  });

  content += `\n\nSCHEDULE\n${'-'.repeat(30)}\n`;
  const dayGroups = {};
  for (const e of state.schedule) { if (!dayGroups[e.day]) dayGroups[e.day] = []; dayGroups[e.day].push(e); }
  const startDate = new Date();
  for (const [day, entries] of Object.entries(dayGroups)) {
    const dayDate = new Date(startDate); dayDate.setDate(dayDate.getDate() + parseInt(day) - 1);
    const ds = dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    content += `\nDay ${day} (${ds}):\n`;
    entries.forEach(e => {
      const tl = e.type === 'study' ? 'Study' : e.type === 'revision' ? 'Revision' : 'Practice';
      content += `  [${tl}] ${e.topic} - ${e.hours}h ${e.completed ? '(DONE)' : ''}\n`;
    });
  }

  content += `\n\nRESOURCES\n${'-'.repeat(30)}\n`;
  state.topics.forEach(t => {
    const r = state.resources[t.name] || {};
    content += `\n${t.name}:\n`;
    if (r.youtube) content += `  YouTube: ${r.youtube.url} (${r.youtube.channel})\n`;
    else content += `  YouTube: ${r.youtubeFallbackUrl}\n`;
    content += `  Notes:   ${r.notes}\n`;
    content += `  PYQs:    ${r.pyq}\n`;
  });

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `study-plan-${state.subject.replace(/\s+/g, '-').toLowerCase()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Study plan downloaded', 'success');
};

// ============================
// TOAST NOTIFICATIONS
// ============================
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = document.getElementById('toast-icon');
  const msg = document.getElementById('toast-msg');

  msg.textContent = message;
  icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
  icon.style.color = type === 'success' ? '#34d399' : '#f87171';

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================
// INIT
// ============================
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('examDate');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];
});