// ============================================================
// RESOURCES.JS — YouTube API, PDF Parsing, Curated Links
// Person C owns this file. Only Person C should edit it.
// ============================================================

/**
 * Curated Database of direct links for common CS subjects.
 * Person C: Add more subjects and topics here.
 *
 * Structure:
 *   "subject keyword": {
 *     "topic keyword": {
 *       notes: "direct URL to GFG article",
 *       pyq: "direct URL to GateOverflow tag"
 *     }
 *   }
 */
const RESOURCE_DB = {
  "operating systems": {
    "process management": {
      notes: "https://www.geeksforgeeks.org/process-scheduling-in-operating-system/",
      pyq: "https://www.gateoverflow.in/tag/operating-system?sort=votes"
    },
    "deadlock": {
      notes: "https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/",
      pyq: "https://www.gateoverflow.in/tag/deadlock"
    },
    "memory management": {
      notes: "https://www.geeksforgeeks.org/memory-management-in-operating-system/",
      pyq: "https://www.gateoverflow.in/tag/virtual-memory"
    },
    "paging": {
      notes: "https://www.geeksforgeeks.org/paging-in-operating-system/",
      pyq: "https://www.gateoverflow.in/tag/paging"
    },
    "file system": {
      notes: "https://www.geeksforgeeks.org/file-system-in-operating-system/",
      pyq: "https://www.gateoverflow.in/tag/file-system"
    },
    "cpu scheduling": {
      notes: "https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/",
      pyq: "https://www.gateoverflow.in/tag/cpu-scheduling"
    },
    "synchronization": {
      notes: "https://www.geeksforgeeks.org/process-synchronization-in-operating-system/",
      pyq: "https://www.gateoverflow.in/tag/synchronization"
    },
    "virtual memory": {
      notes: "https://www.geeksforgeeks.org/virtual-memory-in-operating-system/",
      pyq: "https://www.gateoverflow.in/tag/virtual-memory"
    },
    "disk scheduling": {
      notes: "https://www.geeksforgeeks.org/disk-scheduling-algorithms/",
      pyq: "https://www.gateoverflow.in/tag/disk-scheduling"
    }
  },
  "database management": {
    "normalization": {
      notes: "https://www.geeksforgeeks.org/introduction-of-database-normalization/",
      pyq: "https://www.gateoverflow.in/tag/normalization"
    },
    "sql": {
      notes: "https://www.geeksforgeeks.org/sql-tutorial/",
      pyq: "https://www.gateoverflow.in/tag/sql"
    },
    "er model": {
      notes: "https://www.geeksforgeeks.org/introduction-of-er-model/",
      pyq: "https://www.gateoverflow.in/tag/er-model"
    },
    "transaction": {
      notes: "https://www.geeksforgeeks.org/transaction-in-dbms/",
      pyq: "https://www.gateoverflow.in/tag/transactions"
    },
    "concurrency": {
      notes: "https://www.geeksforgeeks.org/concurrency-control-in-dbms/",
      pyq: "https://www.gateoverflow.in/tag/concurrency-control"
    }
  },
  "computer networks": {
    "osi model": {
      notes: "https://www.geeksforgeeks.org/open-systems-interconnection-model-osi/",
      pyq: "https://www.gateoverflow.in/tag/osi-model"
    },
    "tcp ip": {
      notes: "https://www.geeksforgeeks.org/tcp-ip-model/",
      pyq: "https://www.gateoverflow.in/tag/tcp-ip"
    },
    "ip addressing": {
      notes: "https://www.geeksforgeeks.org/introduction-of-classful-ip-addressing/",
      pyq: "https://www.gateoverflow.in/tag/ip-addressing"
    },
    "routing": {
      notes: "https://www.geeksforgeeks.org/routing-in-computer-network/",
      pyq: "https://www.gateoverflow.in/tag/routing"
    },
    "network security": {
      notes: "https://www.geeksforgeeks.org/network-security/",
      pyq: "https://www.gateoverflow.in/tag/network-security"
    }
  }
};

/**
 * YouTube channels to bias search toward, per language.
 * Person C: Expand this list.
 */
const YT_CHANNELS = {
  en: ["Neso Academy", "Gate Smashers", "CS50"],
  hi: ["Gate Smashers Hindi", "Jenny's Lectures CS IT", "Knowledge Gate"],
  ta: ["Two Minute Code"],
  te: ["Telugu CS Lectures"]
};

// ---- HELPER: Normalize text for comparison ----
function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

// ---- FALLBACK URL GENERATORS ----
// Used when no API key or no curated match found

export function getFallbackYTUrl(topic, subject, lang) {
  const channels = YT_CHANNELS[lang] || YT_CHANNELS.en;
  const q = `${subject} ${topic} ${channels[0]}`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

export function getFallbackNotesUrl(topic) {
  return `https://www.google.com/search?q=${encodeURIComponent(topic + ' geeksforgeeks notes explanation')}`;
}

export function getFallbackPyqUrl(topic, subject) {
  return `https://www.google.com/search?q=${encodeURIComponent(subject + ' ' + topic + ' previous year question paper')}`;
}

// ---- CURATED MATCH FINDER ----
// Searches RESOURCE_DB for a matching subject + topic

function findCuratedMatch(topicName, subject) {
  // Find matching subject
  let subjectData = null;
  const normSubject = normalize(subject);
  for (const key of Object.keys(RESOURCE_DB)) {
    if (normSubject.includes(key) || key.includes(normSubject.split(' ')[0])) {
      subjectData = RESOURCE_DB[key];
      break;
    }
  }
  if (!subjectData) return null;

  // Find matching topic
  const normTopic = normalize(topicName);
  for (const key of Object.keys(subjectData)) {
    if (normTopic.includes(key) || key.includes(normTopic)) {
      return subjectData[key];
    }
  }

  // Partial word match
  for (const key of Object.keys(subjectData)) {
    const keyWords = key.split(' ');
    const topicWords = normTopic.split(' ');
    if (keyWords.some(w => topicWords.includes(w)) || topicWords.some(w => keyWords.includes(w))) {
      return subjectData[key];
    }
  }

  return null;
}

// ---- MAIN RESOURCE FETCHER ----
/**
 * fetchAllResources
 *
 * For each topic, finds: YouTube video, notes link, PYQ link.
 *
 * Person C: This is where you add the YouTube API call.
 * Right now it uses fallback search URLs.
 * When you add the API, replace the youtube field with actual video data.
 */

export async function fetchAllResources(topics, subject, lang, apiKey) {
  const resources = {};

  for (const topic of topics) {
    // Try to find curated links
    const curatedMatch = findCuratedMatch(topic.name, subject);

    resources[topic.name] = {
      // YouTube: Person C will add API logic here
      youtube: null,
      youtubeFallbackUrl: getFallbackYTUrl(topic.name, subject, lang),

      // Notes: curated or fallback
      notes: (curatedMatch && curatedMatch.notes) || getFallbackNotesUrl(topic.name),
      notesCurated: !!(curatedMatch && curatedMatch.notes),

      // PYQ: curated or fallback
      pyq: (curatedMatch && curatedMatch.pyq) || getFallbackPyqUrl(topic.name, subject),
      pyqCurated: !!(curatedMatch && curatedMatch.pyq),
    };

    // -------------------------------------------------------
    // Person C: ADD YOUR YOUTUBE API CODE HERE
    //
    // Example:
    // if (apiKey) {
    //   try {
    //     const video = await fetchYouTubeVideo(topic.name, subject, lang, apiKey);
    //     resources[topic.name].youtube = video; // { title, channel, thumbnail, url }
    //   } catch (err) {
    //     console.warn('YouTube API error:', err);
    //   }
    //   await new Promise(r => setTimeout(r, 200)); // Rate limiting
    // }
    // -------------------------------------------------------
  }

  return resources;
}

// ---- PDF PARSER ----
/**
 * parsePDF
 *
 * Takes a File object (from the file input), reads it with PDF.js,
 * and returns the extracted text as a string.
 *
 * Person C: Implement this function.
 * The pdfjsLib is already loaded in index.html via CDN.
 *
 * Steps:
 * 1. const arrayBuffer = await file.arrayBuffer();
 * 2. const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
 * 3. Loop through pages: const page = await pdf.getPage(i);
 * 4. Get text: const textContent = await page.getTextContent();
 * 5. Combine: textContent.items.map(item => item.str).join(' ')
 * 6. Return the full text string
 */
export async function parsePDF(file) {
  // Person C: Replace this with real PDF parsing
  console.log('parsePDF called with file:', file.name);
  return 'PDF parsing not yet implemented. Please paste text instead.';
}