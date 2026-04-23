// ============================================================
// PARSER.JS — Reads syllabus text and extracts topics
// YOU own this file. Nobody else should edit it.
// ============================================================

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Splits a comma-separated line into individual subtopic strings.
 * Smart enough to keep fragments like "try, catch, throw" together.
 */
function splitCommaLine(text) {
  const parts = text.split(',');
  const result = [];
  let buffer = '';

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const wordCount = trimmed.split(/\s+/).filter(w => w.length > 0).length;

    // Short fragments (1-2 words) are probably part of the previous subtopic
    // Example: "Usage of try, catch, throw" should stay together
    if (wordCount <= 2 && buffer.length > 0) {
      buffer += ', ' + trimmed;
    } else {
      if (buffer) result.push(buffer);
      buffer = trimmed;
    }
  }
  if (buffer) result.push(buffer);

  return result.map(s => s.replace(/\.\s*$/, '').trim()).filter(s => s.length > 2);
}

/**
 * extractTopics - THE MAIN FUNCTION
 */
export function extractTopics(text) {
  const topics = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // ---- PATTERN DEFINITIONS ----

  // FIXED: Now handles "Unit-1:", "Unit 1:", "Unit1:", "Module-2:" etc.
  const unitHeader = /^(unit|module|chapter|section|part|lecture)[\s\-]*[\d.:]+\s*[:\-–.)\s]+(.{2,})/i;

  const bulletSub = /^[-•▪▸➤●○◦]\s+(.+)/;
  const numSub = /^\s*(\d{1,2})[.)]\s+(.+)/;
  const alphaSub = /^\s*([a-z])[.)]\s+(.+)/i;
  const allCaps = /^[A-Z][A-Z\s&,:\-]{3,}$/;
  const colonHeader = /^(.{3,}):\s*$/;

  const skipPatterns = /^(syllabus|curriculum|course|subject|code|credit|hours|semester|batch|duration|prerequisite|objective|outcome|textbook|reference|internal|external|total|max|min|pass|marks|grade|signature|date)/i;

  let currentUnit = null;
  let lastLineWasHeader = false;
  let consecutiveSubtopics = 0;

  // ---- MAIN LOOP ----
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length < 2 || /^\d+$/.test(line) || /^(page|pp)\.?\s*\d+/i.test(line)) continue;
    let matched = false;

    // ---- TRY 1: Unit/Module/Chapter header ----
    const unitMatch = line.match(unitHeader);
    if (unitMatch && unitMatch[2].trim().length >= 2) {
      let name = unitMatch[2].trim().replace(/^[:\-–.)\s]+/, '').replace(/[:\-–.)\s]+$/, '').trim();
      currentUnit = { name, subtopics: [], weight: 1, priority: 'medium' };
      topics.push(currentUnit);
      matched = true; lastLineWasHeader = true; consecutiveSubtopics = 0;
    }
    if (matched) continue;

    // ---- TRY 2: ALL CAPS header (even with trailing colon) ----
    const cleanLine = line.replace(/:\s*$/, '');
    if (cleanLine.length > 3 && cleanLine.length < 80 && /^[A-Z][A-Z\s&,\-]{2,}$/.test(cleanLine)) {
      currentUnit = { name: toTitleCase(cleanLine), subtopics: [], weight: 1, priority: 'medium' };
      topics.push(currentUnit);
      matched = true; lastLineWasHeader = true; consecutiveSubtopics = 0;
    }
    if (matched) continue;

    // ---- TRY 3: Colon-only header ----
    if (colonHeader.test(line)) {
      const name = line.replace(/:\s*$/, '').trim();
      if (name.length >= 3 && !skipPatterns.test(name)) {
        currentUnit = { name, subtopics: [], weight: 1, priority: 'medium' };
        topics.push(currentUnit);
        matched = true; lastLineWasHeader = true; consecutiveSubtopics = 0;
      }
    }
    if (matched) continue;

    // ---- TRY 4: Bullet subtopic ----
    const bulletMatch = line.match(bulletSub);
    if (bulletMatch && bulletMatch[1].trim().length > 2) {
      const sub = bulletMatch[1].trim();
      if (currentUnit) currentUnit.subtopics.push(sub);
      else { currentUnit = { name: sub, subtopics: [], weight: 1, priority: 'medium' }; topics.push(currentUnit); }
      matched = true; lastLineWasHeader = false; consecutiveSubtopics++;
    }
    if (matched) continue;

    // ---- TRY 5: Numbered subtopic ----
    const numMatch = line.match(numSub);
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      const sub = numMatch[2].trim();
      if (num === 1 && sub.length > 3 && (lastLineWasHeader || consecutiveSubtopics > 0 || !currentUnit) && /^[A-Z]/.test(sub)) {
        currentUnit = { name: sub, subtopics: [], weight: 1, priority: 'medium' };
        topics.push(currentUnit);
        matched = true; lastLineWasHeader = true; consecutiveSubtopics = 0;
      } else if (sub.length > 2) {
        if (currentUnit) currentUnit.subtopics.push(sub);
        else { currentUnit = { name: sub, subtopics: [], weight: 1, priority: 'medium' }; topics.push(currentUnit); }
        matched = true; lastLineWasHeader = false; consecutiveSubtopics++;
      }
    }
    if (matched) continue;

    // ---- TRY 6: Lettered subtopic ----
    const alphaMatch = line.match(alphaSub);
    if (alphaMatch && alphaMatch[2].trim().length > 2) {
      const sub = alphaMatch[2].trim();
      if (currentUnit) currentUnit.subtopics.push(sub);
      matched = true; lastLineWasHeader = false; consecutiveSubtopics++;
    }
    if (matched) continue;

    // ---- TRY 7: Paragraph / Comma-separated format ----
    // Handles: "Inheritance: Types of inheritance, Member access rules, Usage of super keyword"
    if (!matched && line.length > 5 && currentUnit) {
      // Check for sub-header like "Inheritance: Types of inheritance, ..."
      const subHeaderMatch = line.match(/^([A-Z][a-zA-Z\s]{2,30}):\s+(.+)/);

      if (subHeaderMatch) {
        const subHeaderName = subHeaderMatch[1].trim();
        const afterColon = subHeaderMatch[2].trim();
        currentUnit.subtopics.push(subHeaderName);
        const parts = splitCommaLine(afterColon);
        for (const part of parts) {
          if (part.length > 2 && part.toLowerCase() !== subHeaderName.toLowerCase()) {
            currentUnit.subtopics.push(part);
          }
        }
        matched = true; lastLineWasHeader = false; consecutiveSubtopics++;
      } else if (line.includes(',') || line.includes(' - ')) {
        // No sub-header, but has commas or dashes — split into subtopics
        const normalized = line.replace(/\s*-\s*/g, ', ');
        const parts = splitCommaLine(normalized);
        for (const part of parts) {
          if (part.length > 2) {
            currentUnit.subtopics.push(part);
          }
        }
        matched = true; lastLineWasHeader = false; consecutiveSubtopics++;
      }
    }
    if (matched) continue;

    // ---- TRY 8: Generic short line (fallback) ----
    if (line.length > 3 && line.length < 80 &&
        !line.endsWith('.') && !line.endsWith('?') && !line.endsWith('!') &&
        !skipPatterns.test(line)) {

      const isHeaderLike = /^[A-Z]/.test(line) && line.length < 60 && (line.match(/,/g) || []).length < 3;

      if (isHeaderLike && !lastLineWasHeader && currentUnit && currentUnit.subtopics.length === 0) {
        currentUnit.subtopics.push(line);
        consecutiveSubtopics++; lastLineWasHeader = false;
      } else if (isHeaderLike && (lastLineWasHeader || !currentUnit || currentUnit.subtopics.length > 2)) {
        currentUnit = { name: line, subtopics: [], weight: 1, priority: 'medium' };
        topics.push(currentUnit);
        lastLineWasHeader = true; consecutiveSubtopics = 0;
      } else if (currentUnit) {
        currentUnit.subtopics.push(line);
        consecutiveSubtopics++; lastLineWasHeader = false;
      } else {
        currentUnit = { name: line, subtopics: [], weight: 1, priority: 'medium' };
        topics.push(currentUnit);
        lastLineWasHeader = true; consecutiveSubtopics = 0;
      }
    }
  }

  // ---- POST-PROCESSING ----

  // Merge orphans — BUT NOT if they look like unit headers
  const merged = [];
  for (const t of topics) {
    const looksLikeHeader = /^[A-Z]{2,}/.test(t.name) || t.name.endsWith(':');
    if (t.subtopics.length === 0 && merged.length > 0 && t.name.length < 60 && !looksLikeHeader) {
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
    const densityScore = (t.subtopics.length / maxSub) * 3;
    const positionScore = (1 - (idx / deduped.length)) * 0.6;
    const words = new Set(t.subtopics.join(' ').toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const diversityScore = Math.min(words.size / 15, 0.5);
    const importantKw = ['introduction', 'fundamentals', 'basics', 'overview', 'concepts', 'principles', 'design', 'analysis', 'architecture', 'management'];
    const hasImportant = importantKw.some(kw => t.name.toLowerCase().includes(kw)) ? 0.6 : 0;

    const rawWeight = 1 + densityScore + positionScore + diversityScore + hasImportant;
    t.weight = Math.round(rawWeight * 10) / 10;
  });

  const maxW = Math.max(...deduped.map(t => t.weight));
  if (maxW > 0) {
    deduped.forEach(t => {
      t.weight = Math.max(1, Math.round((t.weight / maxW) * 10 * 10) / 10);
    });
  }

  deduped.forEach(t => {
    if (t.weight >= 7) t.priority = 'high';
    else if (t.weight >= 4) t.priority = 'medium';
    else t.priority = 'low';
  });

  return deduped;
}