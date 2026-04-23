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
  },

  // ========== TASK 3: EXPANDED SUBJECTS ==========

  "data structures": {
    "array": {
      notes: "https://www.geeksforgeeks.org/array-data-structure/",
      pyq: "https://www.gateoverflow.in/tag/array"
    },
    "linked list": {
      notes: "https://www.geeksforgeeks.org/linked-list-data-structure/",
      pyq: "https://www.gateoverflow.in/tag/linked-list"
    },
    "stack": {
      notes: "https://www.geeksforgeeks.org/stack-data-structure/",
      pyq: "https://www.gateoverflow.in/tag/stack"
    },
    "queue": {
      notes: "https://www.geeksforgeeks.org/queue-data-structure/",
      pyq: "https://www.gateoverflow.in/tag/queue"
    },
    "binary tree": {
      notes: "https://www.geeksforgeeks.org/binary-tree-data-structure/",
      pyq: "https://www.gateoverflow.in/tag/binary-tree"
    },
    "bst": {
      notes: "https://www.geeksforgeeks.org/binary-search-tree-data-structure/",
      pyq: "https://www.gateoverflow.in/tag/bst"
    },
    "heap": {
      notes: "https://www.geeksforgeeks.org/heap-data-structure/",
      pyq: "https://www.gateoverflow.in/tag/heap"
    },
    "hashing": {
      notes: "https://www.geeksforgeeks.org/hashing-data-structure/",
      pyq: "https://www.gateoverflow.in/tag/hashing"
    },
    "graph": {
      notes: "https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/",
      pyq: "https://www.gateoverflow.in/tag/graph"
    },
    "sorting": {
      notes: "https://www.geeksforgeeks.org/sorting-algorithms/",
      pyq: "https://www.gateoverflow.in/tag/sorting"
    },
    "searching": {
      notes: "https://www.geeksforgeeks.org/searching-algorithms/",
      pyq: "https://www.gateoverflow.in/tag/searching"
    },
    "avl tree": {
      notes: "https://www.geeksforgeeks.org/avl-tree-set-1-insertion/",
      pyq: "https://www.gateoverflow.in/tag/avl-tree"
    },
    "trie": {
      notes: "https://www.geeksforgeeks.org/trie-insert-and-search/",
      pyq: "https://www.gateoverflow.in/tag/trie"
    }
  },

  "oop": {
    "classes and objects": {
      notes: "https://www.geeksforgeeks.org/classes-and-objects-in-cpp/",
      pyq: "https://www.gateoverflow.in/tag/oop"
    },
    "inheritance": {
      notes: "https://www.geeksforgeeks.org/inheritance-in-cpp/",
      pyq: "https://www.gateoverflow.in/tag/inheritance"
    },
    "polymorphism": {
      notes: "https://www.geeksforgeeks.org/polymorphism-in-cpp/",
      pyq: "https://www.gateoverflow.in/tag/polymorphism"
    },
    "encapsulation": {
      notes: "https://www.geeksforgeeks.org/encapsulation-in-cpp/",
      pyq: "https://www.gateoverflow.in/tag/oop"
    },
    "abstraction": {
      notes: "https://www.geeksforgeeks.org/abstraction-in-cpp/",
      pyq: "https://www.gateoverflow.in/tag/oop"
    },
    "virtual function": {
      notes: "https://www.geeksforgeeks.org/virtual-function-cpp/",
      pyq: "https://www.gateoverflow.in/tag/virtual-function"
    },
    "constructor": {
      notes: "https://www.geeksforgeeks.org/constructors-in-cpp/",
      pyq: "https://www.gateoverflow.in/tag/constructor"
    },
    "destructor": {
      notes: "https://www.geeksforgeeks.org/destructors-in-cpp/",
      pyq: "https://www.gateoverflow.in/tag/destructor"
    },
    "operator overloading": {
      notes: "https://www.geeksforgeeks.org/operator-overloading-cpp/",
      pyq: "https://www.gateoverflow.in/tag/operator-overloading"
    },
    "templates": {
      notes: "https://www.geeksforgeeks.org/templates-cpp/",
      pyq: "https://www.gateoverflow.in/tag/templates"
    }
  },

  "software engineering": {
    "software development life cycle": {
      notes: "https://www.geeksforgeeks.org/software-development-life-cycle-sdlc/",
      pyq: "https://www.gateoverflow.in/tag/sdlc"
    },
    "sdlc": {
      notes: "https://www.geeksforgeeks.org/software-development-life-cycle-sdlc/",
      pyq: "https://www.gateoverflow.in/tag/sdlc"
    },
    "software testing": {
      notes: "https://www.geeksforgeeks.org/software-testing-basics/",
      pyq: "https://www.gateoverflow.in/tag/software-testing"
    },
    "unit testing": {
      notes: "https://www.geeksforgeeks.org/unit-testing/",
      pyq: "https://www.gateoverflow.in/tag/software-testing"
    },
    "coupling": {
      notes: "https://www.geeksforgeeks.org/coupling-and-cohesion/",
      pyq: "https://www.gateoverflow.in/tag/coupling"
    },
    "cohesion": {
      notes: "https://www.geeksforgeeks.org/coupling-and-cohesion/",
      pyq: "https://www.gateoverflow.in/tag/cohesion"
    },
    "requirements engineering": {
      notes: "https://www.geeksforgeeks.org/software-requirements-specification-srs/",
      pyq: "https://www.gateoverflow.in/tag/srs"
    },
    "srs": {
      notes: "https://www.geeksforgeeks.org/software-requirements-specification-srs/",
      pyq: "https://www.gateoverflow.in/tag/srs"
    },
    "agile": {
      notes: "https://www.geeksforgeeks.org/agile-software-development/",
      pyq: "https://www.gateoverflow.in/tag/agile"
    },
    "uml": {
      notes: "https://www.geeksforgeeks.org/unified-modeling-language-uml-introduction/",
      pyq: "https://www.gateoverflow.in/tag/uml"
    },
    "design patterns": {
      notes: "https://www.geeksforgeeks.org/design-patterns-set-1-introduction/",
      pyq: "https://www.gateoverflow.in/tag/design-patterns"
    },
    "configuration management": {
      notes: "https://www.geeksforgeeks.org/software-configuration-management/",
      pyq: "https://www.gateoverflow.in/tag/configuration-management"
    }
  },

  "computer organization": {
    "boolean algebra": {
      notes: "https://www.geeksforgeeks.org/boolean-algebra/",
      pyq: "https://www.gateoverflow.in/tag/boolean-algebra"
    },
    "karnaugh map": {
      notes: "https://www.geeksforgeeks.org/karnaugh-map-k-map/",
      pyq: "https://www.gateoverflow.in/tag/k-map"
    },
    "k map": {
      notes: "https://www.geeksforgeeks.org/karnaugh-map-k-map/",
      pyq: "https://www.gateoverflow.in/tag/k-map"
    },
    "combinational circuits": {
      notes: "https://www.geeksforgeeks.org/combinational-circuits-in-digital-electronics/",
      pyq: "https://www.gateoverflow.in/tag/combinational-circuits"
    },
    "sequential circuits": {
      notes: "https://www.geeksforgeeks.org/sequential-circuits-digital-electronics/",
      pyq: "https://www.gateoverflow.in/tag/sequential-circuits"
    },
    "flip flop": {
      notes: "https://www.geeksforgeeks.org/flip-flops-in-digital-electronics/",
      pyq: "https://www.gateoverflow.in/tag/flip-flops"
    },
    "register": {
      notes: "https://www.geeksforgeeks.org/shift-registers-in-digital-logic/",
      pyq: "https://www.gateoverflow.in/tag/registers"
    },
    "counter": {
      notes: "https://www.geeksforgeeks.org/counters-in-digital-logic/",
      pyq: "https://www.gateoverflow.in/tag/counters"
    },
    "instruction pipeline": {
      notes: "https://www.geeksforgeeks.org/pipelining-in-computer-architecture/",
      pyq: "https://www.gateoverflow.in/tag/pipelining"
    },
    "pipelining": {
      notes: "https://www.geeksforgeeks.org/pipelining-in-computer-architecture/",
      pyq: "https://www.gateoverflow.in/tag/pipelining"
    },
    "cache memory": {
      notes: "https://www.geeksforgeeks.org/cache-memory-in-computer-organization/",
      pyq: "https://www.gateoverflow.in/tag/cache"
    },
    "memory hierarchy": {
      notes: "https://www.geeksforgeeks.org/memory-hierarchy-design-and-its-characteristics/",
      pyq: "https://www.gateoverflow.in/tag/memory-hierarchy"
    },
    "addressing modes": {
      notes: "https://www.geeksforgeeks.org/addressing-modes/",
      pyq: "https://www.gateoverflow.in/tag/addressing-modes"
    },
    "alu": {
      notes: "https://www.geeksforgeeks.org/arithmetic-logic-unit-alu/",
      pyq: "https://www.gateoverflow.in/tag/alu"
    },
    "risc": {
      notes: "https://www.geeksforgeeks.org/difference-between-risc-and-cisc-architecture/",
      pyq: "https://www.gateoverflow.in/tag/risc"
    },
    "cisc": {
      notes: "https://www.geeksforgeeks.org/difference-between-risc-and-cisc-architecture/",
      pyq: "https://www.gateoverflow.in/tag/cisc"
    },
    "i/o mapping": {
      notes: "https://www.geeksforgeeks.org/memory-mapped-io-vs-io-mapped-io/",
      pyq: "https://www.gateoverflow.in/tag/io-mapping"
    },
    "interrupt": {
      notes: "https://www.geeksforgeeks.org/interrupts-in-microprocessor/",
      pyq: "https://www.gateoverflow.in/tag/interrupts"
    },
    "floating point": {
      notes: "https://www.geeksforgeeks.org/ieee-754-floating-point-representation/",
      pyq: "https://www.gateoverflow.in/tag/floating-point"
    }
  },

  "theory of computation": {
    "finite automata": {
      notes: "https://www.geeksforgeeks.org/introduction-of-finite-automata/",
      pyq: "https://www.gateoverflow.in/tag/finite-automata"
    },
    "dfa": {
      notes: "https://www.geeksforgeeks.org/deterministic-finite-automata/",
      pyq: "https://www.gateoverflow.in/tag/dfa"
    },
    "nfa": {
      notes: "https://www.geeksforgeeks.org/non-deterministic-finite-automata/",
      pyq: "https://www.gateoverflow.in/tag/nfa"
    },
    "regular expression": {
      notes: "https://www.geeksforgeeks.org/regular-expressions/",
      pyq: "https://www.gateoverflow.in/tag/regular-expressions"
    },
    "regular language": {
      notes: "https://www.geeksforgeeks.org/regular-languages-properties/",
      pyq: "https://www.gateoverflow.in/tag/regular-languages"
    },
    "closure properties": {
      notes: "https://www.geeksforgeeks.org/closure-properties-of-regular-languages/",
      pyq: "https://www.gateoverflow.in/tag/closure-properties"
    },
    "pumping lemma": {
      notes: "https://www.geeksforgeeks.org/pumping-lemma-in-theory-of-computation/",
      pyq: "https://www.gateoverflow.in/tag/pumping-lemma"
    },
    "context free grammar": {
      notes: "https://www.geeksforgeeks.org/context-free-grammars-cfg/",
      pyq: "https://www.gateoverflow.in/tag/cfg"
    },
    "cfg": {
      notes: "https://www.geeksforgeeks.org/context-free-grammars-cfg/",
      pyq: "https://www.gateoverflow.in/tag/cfg"
    },
    "pushdown automata": {
      notes: "https://www.geeksforgeeks.org/introduction-of-pushdown-automata/",
      pyq: "https://www.gateoverflow.in/tag/pda"
    },
    "pda": {
      notes: "https://www.geeksforgeeks.org/introduction-of-pushdown-automata/",
      pyq: "https://www.gateoverflow.in/tag/pda"
    },
    "turing machine": {
      notes: "https://www.geeksforgeeks.org/introduction-of-turing-machine/",
      pyq: "https://www.gateoverflow.in/tag/turing-machine"
    },
    "chomsky hierarchy": {
      notes: "https://www.geeksforgeeks.org/chomsky-hierarchy-in-theory-of-computation/",
      pyq: "https://www.gateoverflow.in/tag/chomsky-hierarchy"
    },
    "decidability": {
      notes: "https://www.geeksforgeeks.org/decidability-and-undecidability/",
      pyq: "https://www.gateoverflow.in/tag/decidability"
    },
    "recursive language": {
      notes: "https://www.geeksforgeeks.org/recursive-and-recursively-enumerable-languages/",
      pyq: "https://www.gateoverflow.in/tag/recursively-enumerable"
    },
    "npc": {
      notes: "https://www.geeksforgeeks.org/np-completeness-set-1/",
      pyq: "https://www.gateoverflow.in/tag/np-completeness"
    },
    "np complete": {
      notes: "https://www.geeksforgeeks.org/np-completeness-set-1/",
      pyq: "https://www.gateoverflow.in/tag/np-completeness"
    },
    "minimization of dfa": {
      notes: "https://www.geeksforgeeks.org/minimization-of-dfa/",
      pyq: "https://www.gateoverflow.in/tag/dfa-minimization"
    },
    "conversion nfa to dfa": {
      notes: "https://www.geeksforgeeks.org/conversion-from-nfa-to-dfa/",
      pyq: "https://www.gateoverflow.in/tag/nfa-to-dfa"
    }
  },

  "machine learning": {
    "linear regression": {
      notes: "https://www.geeksforgeeks.org/linear-regression-python-implementation/",
      pyq: "https://www.gateoverflow.in/tag/linear-regression"
    },
    "logistic regression": {
      notes: "https://www.geeksforgeeks.org/logistic-regression-ml/",
      pyq: "https://www.gateoverflow.in/tag/logistic-regression"
    },
    "decision tree": {
      notes: "https://www.geeksforgeeks.org/decision-tree/",
      pyq: "https://www.gateoverflow.in/tag/decision-tree"
    },
    "svm": {
      notes: "https://www.geeksforgeeks.org/support-vector-machines-introduction-to-svm/",
      pyq: "https://www.gateoverflow.in/tag/svm"
    },
    "naive bayes": {
      notes: "https://www.geeksforgeeks.org/naive-bayes-classifiers/",
      pyq: "https://www.gateoverflow.in/tag/naive-bayes"
    },
    "knn": {
      notes: "https://www.geeksforgeeks.org/k-nearest-neighbours/",
      pyq: "https://www.gateoverflow.in/tag/knn"
    },
    "k means": {
      notes: "https://www.geeksforgeeks.org/k-means-clustering-introduction/",
      pyq: "https://www.gateoverflow.in/tag/k-means"
    },
    "clustering": {
      notes: "https://www.geeksforgeeks.org/clustering-in-machine-learning/",
      pyq: "https://www.gateoverflow.in/tag/clustering"
    },
    "neural network": {
      notes: "https://www.geeksforgeeks.org/introduction-of-neural-networks/",
      pyq: "https://www.gateoverflow.in/tag/neural-networks"
    },
    "gradient descent": {
      notes: "https://www.geeksforgeeks.org/gradient-descent-algorithm/",
      pyq: "https://www.gateoverflow.in/tag/gradient-descent"
    },
    "overfitting": {
      notes: "https://www.geeksforgeeks.org/underfitting-and-overfitting-in-machine-learning/",
      pyq: "https://www.gateoverflow.in/tag/overfitting"
    },
    "regularization": {
      notes: "https://www.geeksforgeeks.org/regularization-in-machine-learning/",
      pyq: "https://www.gateoverflow.in/tag/regularization"
    },
    "cross validation": {
      notes: "https://www.geeksforgeeks.org/cross-validation-machine-learning/",
      pyq: "https://www.gateoverflow.in/tag/cross-validation"
    },
    "bias variance": {
      notes: "https://www.geeksforgeeks.org/bias-variance-trade-off-machine-learning/",
      pyq: "https://www.gateoverflow.in/tag/bias-variance"
    },
    "confusion matrix": {
      notes: "https://www.geeksforgeeks.org/confusion-matrix-machine-learning/",
      pyq: "https://www.gateoverflow.in/tag/confusion-matrix"
    },
    "precision recall": {
      notes: "https://www.geeksforgeeks.org/precision-recall/",
      pyq: "https://www.gateoverflow.in/tag/precision-recall"
    },
    "random forest": {
      notes: "https://www.geeksforgeeks.org/random-forest-regression-ml/",
      pyq: "https://www.gateoverflow.in/tag/random-forest"
    },
    "pca": {
      notes: "https://www.geeksforgeeks.org/principal-component-analysis-pca/",
      pyq: "https://www.gateoverflow.in/tag/pca"
    },
    "principal component analysis": {
      notes: "https://www.geeksforgeeks.org/principal-component-analysis-pca/",
      pyq: "https://www.gateoverflow.in/tag/pca"
    },
    "perceptron": {
      notes: "https://www.geeksforgeeks.org/perceptron-the-perceptron-algorithm/",
      pyq: "https://www.gateoverflow.in/tag/perceptron"
    },
    "backpropagation": {
      notes: "https://www.geeksforgeeks.org/backpropagation-in-neural-network/",
      pyq: "https://www.gateoverflow.in/tag/backpropagation"
    }
  }
};

/**
 * YouTube channels to bias search toward, per language.
 * Person C: Expand this list.
 */
const YT_CHANNELS = {
  en: ["Neso Academy", "Gate Smashers", "CS50", "3Blue1Brown", "MIT OpenCourseWare", "StatQuest", "Sentdex"],
  hi: ["Gate Smashers Hindi", "Jenny's Lectures CS IT", "Knowledge Gate", "Apna College", "CodeHelp"],
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

// ============================================================
// TASK 1: YOUTUBE DATA API v3 INTEGRATION
// ============================================================

/**
 * fetchYouTubeVideo
 *
 * Calls the YouTube Data API v3 search endpoint with the topic name + subject + language preference.
 * Fetches top 6 results and ranks them, preferring known educational channels.
 * Returns the best video as: { title, channel, thumbnail, url }
 *
 * @param {string} topicName  - The topic to search for
 * @param {string} subject    - The parent subject
 * @param {string} lang       - Language code (en, hi, ta, te)
 * @param {string} apiKey     - YouTube Data API v3 key
 * @returns {Promise<{title: string, channel: string, thumbnail: string, url: string}|null>}
 */
async function fetchYouTubeVideo(topicName, subject, lang, apiKey) {
  const channels = YT_CHANNELS[lang] || YT_CHANNELS.en;

  // Build search query: include the first preferred channel for better results
  const query = `${subject} ${topicName} tutorial explanation`;

  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '6',
    key: apiKey,
    videoEmbeddable: 'true',
    videoSyndicated: 'true',
    relevanceLanguage: lang === 'hi' ? 'hi' : 'en'
  });

  const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`YouTube API ${response.status}: ${errorBody}`);
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    return null;
  }

  // Rank each result, preferring known educational channels
  const ranked = data.items.map((item, index) => {
    const channel = item.snippet.channelTitle || '';
    let score = 0;

    // Check against preferred channels (higher index in list = lower priority)
    channels.forEach((ch, idx) => {
      if (channel.toLowerCase().includes(ch.toLowerCase())) {
        score += (channels.length - idx) * 10;
      }
    });

    // Bonus for general educational keywords in channel name
    if (/academy|university|lectures|tutorial|education|learn|cs50|mit|nptel|open/i.test(channel)) {
      score += 5;
    }

    // Slight penalty for very long titles (often clickbait)
    if (item.snippet.title.length > 80) {
      score -= 2;
    }

    // Small position bonus so if all scores tie, earlier results win
    score += (6 - index) * 0.1;

    return { item, score };
  });

  // Sort descending by score
  ranked.sort((a, b) => b.score - a.score);

  const best = ranked[0].item;
  const videoId = best.id.videoId;

  // Pick the best available thumbnail resolution
  const thumbs = best.snippet.thumbnails;
  const thumbnail =
    (thumbs.maxres && thumbs.maxres.url) ||
    (thumbs.high && thumbs.high.url) ||
    (thumbs.medium && thumbs.medium.url) ||
    (thumbs.default && thumbs.default.url) ||
    '';

  return {
    title: best.snippet.title,
    channel: best.snippet.channelTitle,
    thumbnail: thumbnail,
    url: `https://www.youtube.com/watch?v=${videoId}`
  };
}

// ============================================================
// MAIN RESOURCE FETCHER
// ============================================================

/**
 * fetchAllResources
 *
 * For each topic, finds: YouTube video, notes link, PYQ link.
 * Uses YouTube API when an apiKey is provided; otherwise falls back to search URLs.
 */
export async function fetchAllResources(topics, subject, lang, apiKey) {
  const resources = {};

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];

    // Try to find curated links
    const curatedMatch = findCuratedMatch(topic.name, subject);

    resources[topic.name] = {
      // YouTube: will be filled by API if key is available
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
    // YouTube API integration
    // -------------------------------------------------------
    if (apiKey) {
      try {
        const video = await fetchYouTubeVideo(topic.name, subject, lang, apiKey);
        resources[topic.name].youtube = video; // { title, channel, thumbnail, url }
      } catch (err) {
        console.warn(`YouTube API error for "${topic.name}":`, err.message);
      }

      // 200ms delay between API calls to respect quota limits
      if (i < topics.length - 1) {
        await new Promise(r => setTimeout(r, 200));
      }
    }
  }

  return resources;
}

// ============================================================
// TASK 2: PDF PARSING
// ============================================================

/**
 * parsePDF
 *
 * Takes a File object (from the file input), reads it with PDF.js,
 * and returns the extracted text as a string.
 *
 * @param {File} file - The PDF file to parse
 * @returns {Promise<string>} - Extracted text from all pages
 */
export async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();

  // pdfjsLib is loaded globally via CDN in index.html
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    // Extract strings from text items and join with spaces
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
}
