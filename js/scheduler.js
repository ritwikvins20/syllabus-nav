// ============================================================
// SCHEDULER.JS — Generates the day-by-day study plan
// YOU own this file. Nobody else should edit it.
// ============================================================

/**
 * generateStudyPlan
 *
 * Takes extracted topics and user settings, returns a schedule array.
 *
 * Inputs:
 *   topics    - Array from parser.js: [{name, subtopics, weight, priority}, ...]
 *   totalDays - Number of days until exam
 *   dailyHours - How many hours the student can study per day
 *   goal      - "pass", "good", or "top"
 *
 * Returns:
 *   Array of schedule entries:
 *   [
 *     { day: 1, topic: "Process Management", hours: 2, type: "study", completed: false },
 *     { day: 1, topic: "Deadlocks", hours: 2, type: "study", completed: false },
 *     ...
 *   ]
 *
 * "type" can be: "study" (learning), "revision" (reviewing), "practice" (solving problems)
 */
export function generateStudyPlan(topics, totalDays, dailyHours, goal) {
  const schedule = [];

  // How to split time based on goal
  const goalConfigs = {
    pass: { study: 0.70, revision: 0.15, practice: 0.15, minWeight: 3 },
    good: { study: 0.58, revision: 0.22, practice: 0.20, minWeight: 1 },
    top:  { study: 0.50, revision: 0.25, practice: 0.25, minWeight: 0 }
  };
  const config = goalConfigs[goal];

  // Filter topics based on goal (pass = skip low-weight topics)
  let filteredTopics = topics.filter(t => t.weight >= config.minWeight);
  if (filteredTopics.length === 0) filteredTopics = [...topics]; // Safety fallback

  const totalHours = totalDays * dailyHours;
  const totalWeight = filteredTopics.reduce((sum, t) => sum + t.weight, 0);

  // Allocate hours per topic, per phase
  const allocations = filteredTopics.map(topic => ({
    ...topic,
    studyHours:    (topic.weight / totalWeight) * totalHours * config.study,
    revisionHours: (topic.weight / totalWeight) * totalHours * config.revision,
    practiceHours: (topic.weight / totalWeight) * totalHours * config.practice,
  }));

  let currentDay = 1;
  let hoursLeftInDay = dailyHours;

  /**
   * addEntry - Adds a study block to the schedule
   * If the same topic + type already exists on the same day, merges the hours
   */
  function addEntry(topicName, hours, type) {
    const existing = schedule.find(
      s => s.day === currentDay && s.topic === topicName && s.type === type
    );
    if (existing) {
      existing.hours += hours;
    } else {
      schedule.push({
        day: currentDay,
        topic: topicName,
        hours: Math.round(hours * 10) / 10,
        type: type,
        completed: false
      });
    }
  }

  /**
   * processPhase - Goes through all topics and schedules time for one phase
   * typeKey: "study", "revision", or "practice"
   * hourKey: "studyHours", "revisionHours", or "practiceHours"
   */
  function processPhase(typeKey, hourKey) {
    for (const topic of allocations) {
      let hoursRemaining = topic[hourKey];
      while (hoursRemaining > 0.1 && currentDay <= totalDays) {
        const hoursToday = Math.min(hoursRemaining, hoursLeftInDay);
        addEntry(topic.name, hoursToday, typeKey);
        hoursRemaining -= hoursToday;
        hoursLeftInDay -= hoursToday;
        if (hoursLeftInDay <= 0.05) {
          currentDay++;
          hoursLeftInDay = dailyHours;
        }
      }
    }
  }

  // Phase 1: Study (learning the material)
  processPhase('study', 'studyHours');

  // Phase 2: Revision (reviewing what was studied)
  processPhase('revision', 'revisionHours');

  // Phase 3: Practice (solving problems / past papers)
  processPhase('practice', 'practiceHours');

  // Merge entries on same day with same topic+type, and round hours
  const finalSchedule = [];
  const entryMap = {};
  for (const entry of schedule) {
    const key = `${entry.day}-${entry.topic}-${entry.type}`;
    if (entryMap[key]) {
      entryMap[key].hours += entry.hours;
    } else {
      entryMap[key] = { ...entry };
      finalSchedule.push(entryMap[key]);
    }
  }
  finalSchedule.forEach(e => {
    e.hours = Math.round(e.hours * 10) / 10;
  });

  // Sort by day
  finalSchedule.sort((a, b) => a.day - b.day);

  return finalSchedule;
}