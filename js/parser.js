// ============================================================
// PARSER.JS — Reads syllabus text and extracts topics
// YOU own this file. Nobody else should edit it.
// ============================================================

/**
 * normalize - Makes text lowercase and removes special characters
 * Used internally to compare topic names without worrying about case/punctuation
 */
function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * toTitleCase - Converts ALL CAPS TEXT to Title Case
 * Example: "PROCESS MANAGEMENT" → "Process Management"
 */
function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * extractTopics - THE MAIN FUNCTION
 *
 * Takes raw syllabus text (string) and returns an array of topic objects.
 * Each topic object looks like:
 *   {
 *     name: "Process Management",
 *     subtopics: ["CPU scheduling", "Deadlocks"],
 *     weight: 8.5,        // 1-10, how important this topic is
 *     priority: "high"     // "high", "medium", or "low"
 *   }
 *
 * It handles 7 different syllabus formats:
 * 1. "Unit 1: Process Management" (explicit headers)
 * 2. "PROCESS MANAGEMENT" (all caps headers)
 * 3. "Process Management:" (colon headers)
 * 4. "- CPU scheduling" (bullet subtopics)
 * 5. "1. CPU scheduling" (numbered items)
 * 6. "a) CPU scheduling" (lettered items)
 * 7. Plain short lines (generic fallback)
 */
export function extractTopics(text) {
  const topics = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // ---- PATTERN DEFINITIONS ----

  // Pattern: "Unit 1: Name" or "Module 2 - Name" etc.
  const unitHeader = /^(unit|module|chapter|section|part|lecture)\s*[\d.:]+\s*[:\-–.)\s]+(.{2,})/i;

  // Pattern: "- subtopic" or "• subtopic" etc.
  const bulletSub = /^[-•▪▸➤●○◦]\s+(.+)/;

  // Pattern: "1) subtopic" or "2. subtopic"
  const numSub = /^\s*(\d{1,2})[.)]\s+(.+)/;

  // Pattern: "a) subtopic" or "b. subtopic"
  const alphaSub = /^\s*([a-z])[.)]\s+(.+)/i;

  // Pattern: ALL CAPS LINE (often a unit title)
  const allCaps = /^[A-Z][A-Z\s&,:\-]{3,}$/;

  // Pattern: Line ending with colon (often a header)
  const colonHeader = /^(.{3,}):\s*$/;

  // Lines to skip (not topics)
  const skipPatterns = /^(syllabus|curriculum|course|subject|code|credit|hours|semester|batch|duration|prerequisite|objective|outcome|textbook|reference|internal|external|total|max|min|pass|marks|grade)/i;

  let currentUnit = null;       // The topic we're currently adding subtopics to
  let lastLineWasHeader = false; // Was the previous line a unit header?
  let consecutiveSubtopics = 0;  // How many subtopics in a row?

  // ---- MAIN LOOP: Process each line ----

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip junk lines
    if (line.length < 2) continue;
    if (/^\d+$/.test(line)) continue;       // standalone numbers
    if (/^(page|pp)\.?\s*\d+/i.test(line)) continue;  // page numbers

    let matched = false;

    // ---- TRY 1: Unit/Module/Chapter header ----
    const unitMatch = line.match(unitHeader);
    if (unitMatch && unitMatch[2].trim().length >= 2) {
      let name = unitMatch[2].trim().replace(/^[:\-–.)\s]+/, '').trim();
      currentUnit = { name, subtopics: [], weight: 1, priority: 'medium' };
      topics.push(currentUnit);
      matched = true;
      lastLineWasHeader = true;
      consecutiveSubtopics = 0;
    }
    if (matched) continue;

    // ---- TRY 2: ALL CAPS header ----
    if (allCaps.test(line) && line.length > 3 && line.length < 80) {
      currentUnit = { name: toTitleCase(line), subtopics: [], weight: 1, priority: 'medium' };
      topics.push(currentUnit);
      matched = true;
      lastLineWasHeader = true;
      consecutiveSubtopics = 0;
    }
    if (matched) continue;

    // ---- TRY 3: Colon header ----
    if (colonHeader.test(line)) {
      const name = line.replace(/:\s*$/, '').trim();
      if (name.length >= 3 && !skipPatterns.test(name)) {
        currentUnit = { name, subtopics: [], weight: 1, priority: 'medium' };
        topics.push(currentUnit);
        matched = true;
        lastLineWasHeader = true;
        consecutiveSubtopics = 0;
      }
    }
    if (matched) continue;

    // ---- TRY 4: Bullet subtopic ----
    const bulletMatch = line.match(bulletSub);
    if (bulletMatch && bulletMatch[1].trim().length > 2) {
      const sub = bulletMatch[1].trim();
      if (currentUnit) {
        currentUnit.subtopics.push(sub);
      } else {
        currentUnit = { name: sub, subtopics: [], weight: 1, priority: 'medium' };
        topics.push(currentUnit);
      }
      matched = true;
      lastLineWasHeader = false;
      consecutiveSubtopics++;
    }
    if (matched) continue;

    // ---- TRY 5: Numbered subtopic ----
    const numMatch = line.match(numSub);
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      const sub = numMatch[2].trim();

      // If number is 1 and it looks like a header, start a new unit
      if (num === 1 && sub.length > 3 && (lastLineWasHeader || consecutiveSubtopics > 0 || !currentUnit) && /^[A-Z]/.test(sub)) {
        currentUnit = { name: sub, subtopics: [], weight: 1, priority: 'medium' };
        topics.push(currentUnit);
        matched = true;
        lastLineWasHeader = true;
        consecutiveSubtopics = 0;
      } else if (sub.length > 2) {
        // Otherwise it's a subtopic
        if (currentUnit) {
          currentUnit.subtopics.push(sub);
        } else {
          currentUnit = { name: sub, subtopics: [], weight: 1, priority: 'medium' };
          topics.push(currentUnit);
        }
        matched = true;
        lastLineWasHeader = false;
        consecutiveSubtopics++;
      }
    }
    if (matched) continue;

    // ---- TRY 6: Lettered subtopic ----
    const alphaMatch = line.match(alphaSub);
    if (alphaMatch && alphaMatch[2].trim().length > 2) {
      const sub = alphaMatch[2].trim();
      if (currentUnit) {
        currentUnit.subtopics.push(sub);
      }
      matched = true;
      lastLineWasHeader = false;
      consecutiveSubtopics++;
    }
    if (matched) continue;

    // ---- TRY 7: Generic short line (fallback) ----
    if (line.length > 3 && line.length < 80 &&
        !line.endsWith('.') && !line.endsWith('?') && !line.endsWith('!') &&
        !skipPatterns.test(line)) {

      const isHeaderLike = /^[A-Z]/.test(line) && line.length < 60 && (line.match(/,/g) || []).length < 3;

      if (isHeaderLike && !lastLineWasHeader && currentUnit && currentUnit.subtopics.length === 0) {
        currentUnit.subtopics.push(line);
        consecutiveSubtopics++;
        lastLineWasHeader = false;
      } else if (isHeaderLike && (lastLineWasHeader || !currentUnit || currentUnit.subtopics.length > 2)) {
        currentUnit = { name: line, subtopics: [], weight: 1, priority: 'medium' };
        topics.push(currentUnit);
        lastLineWasHeader = true;
        consecutiveSubtopics = 0;
      } else if (currentUnit) {
        currentUnit.subtopics.push(line);
        consecutiveSubtopics++;
        lastLineWasHeader = false;
      } else {
        currentUnit = { name: line, subtopics: [], weight: 1, priority: 'medium' };
        topics.push(currentUnit);
        lastLineWasHeader = true;
        consecutiveSubtopics = 0;
      }
    }
  }

  // ---- POST-PROCESSING ----

  // Merge orphan topics (no subtopics) into the previous topic
  const merged = [];
  for (const t of topics) {
    if (t.subtopics.length === 0 && merged.length > 0 && t.name.length < 60) {
      merged[merged.length - 1].subtopics.push(t.name);
    } else {
      merged.push(t);
    }
  }

  // Remove duplicates
  const seen = new Set();
  const deduped = [];
  for (const t of merged) {
    const key = normalize(t.name);
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(t);
    } else {
      const existing = deduped.find(d => normalize(d.name) === key);
      if (existing) {
        t.subtopics.forEach(s => {
          if (!existing.subtopics.some(es => normalize(es) === normalize(s))) {
            existing.subtopics.push(s);
          }
        });
      }
    }
  }

  if (deduped.length === 0) return deduped;

  // ---- WEIGHT CALCULATION ----

  const maxSub = Math.max(...deduped.map(t => t.subtopics.length), 1);

  deduped.forEach((t, idx) => {
    // Factor 1: Subtopic density (0-3 points)
    // More subtopics = more important chapter
    const densityScore = (t.subtopics.length / maxSub) * 3;

    // Factor 2: Position bonus (0-0.6 points)
    // Earlier chapters often build foundations, tested more
    const positionScore = (1 - (idx / deduped.length)) * 0.6;

    // Factor 3: Keyword diversity (0-0.5 points)
    // Diverse vocabulary in subtopics = broader topic
    const words = new Set(t.subtopics.join(' ').toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const diversityScore = Math.min(words.size / 15, 0.5);

    // Factor 4: Important keywords (0-0.6 points)
    // Words like "introduction", "fundamentals" signal core chapters
    const importantKw = ['introduction', 'fundamentals', 'basics', 'overview', 'concepts', 'principles', 'design', 'analysis', 'architecture', 'management'];
    const hasImportant = importantKw.some(kw => t.name.toLowerCase().includes(kw)) ? 0.6 : 0;

    const rawWeight = 1 + densityScore + positionScore + diversityScore + hasImportant;
    t.weight = Math.round(rawWeight * 10) / 10;
  });

  // Normalize to 1-10 scale
  const maxW = Math.max(...deduped.map(t => t.weight));
  if (maxW > 0) {
    deduped.forEach(t => {
      t.weight = Math.max(1, Math.round((t.weight / maxW) * 10 * 10) / 10);
    });
  }

  // Assign priority labels
  deduped.forEach(t => {
    if (t.weight >= 7) t.priority = 'high';
    else if (t.weight >= 4) t.priority = 'medium';
    else t.priority = 'low';
  });

  return deduped;
}