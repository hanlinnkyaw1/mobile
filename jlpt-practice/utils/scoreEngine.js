// src/features/jlpt-practice/utils/scoreEngine.js
// Direct port of score.js — N1-N5 proportional normalization

const POINT_CONFIGS = {
  N1: {
    vocab: { 1: 1, 2: 1, 3: 1.5, 4: 2 },
    grammar: { 5: 1, 6: 1.5, 7: 2 },
    reading: { 8: 2, 9: 2, 10: 3, 11: 3, 12: 3.5, 13: 4 },
    listening: { 1: 2, 2: 2, 3: 2.5, 4: 1.5, 5: 3 },
  },
  N2: {
    vocab: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 2 },
    grammar: { 7: 1, 8: 1, 9: 2 },
    reading: { 10: 3, 11: 2.5, 12: 3, 13: 3.5, 14: 4 },
    listening: { 1: 2, 2: 2, 3: 2.5, 4: 1.5, 5: 3 },
  },
  N3: {
    vocab: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 },
    grammar: { 1: 1, 2: 1, 3: 1.5 },
    reading: { 4: 3, 5: 4, 6: 4, 7: 5 },
    listening: { 1: 3, 2: 3, 3: 3, 4: 2, 5: 1 },
  },
  N4: {
    vocab: { 1: 1, 2: 1, 3: 1, 4: 2, 5: 2 },
    grammar: { 1: 1, 2: 1, 3: 1.5 },
    reading: { 4: 7, 5: 7, 6: 9 },
    listening: { 1: 2, 2: 2, 3: 4, 4: 1.5 },
  },
  N5: {
    vocab: { 1: 2, 2: 2, 3: 2, 4: 2 },
    grammar: { 1: 1, 2: 1, 3: 1 },
    reading: { 4: 10, 5: 10, 6: 20 },
    listening: { 1: 2, 2: 2.5, 3: 3, 4: 2.5 },
  },
};

const PASS_RULES = {
  N1: { totalMin: 100, totalMax: 180 },
  N2: { totalMin: 90, totalMax: 180 },
  N3: { totalMin: 95, totalMax: 180 },
  N4: { totalMin: 90, totalMax: 180 },
  N5: { totalMin: 80, totalMax: 180 },
};

const THREE_WAY_GROUPS = [
  { name: "vocabGrammar", label: "Vocab/Grammar", buckets: ["vocabGrammar"], scale: 60, min: 19 },
  { name: "reading", label: "Reading", buckets: ["reading"], scale: 60, min: 19 },
  { name: "listening", label: "Listening", buckets: ["listening"], scale: 60, min: 19 },
];

const COMBINED_GROUPS = [
  { name: "languageReading", label: "Language Knowledge & Reading", buckets: ["vocabGrammar", "reading"], scale: 120, min: 38 },
  { name: "listening", label: "Listening", buckets: ["listening"], scale: 60, min: 19 },
];

function getSectionGroups(level) {
  return ["N4", "N5"].includes(level) ? COMBINED_GROUPS : THREE_WAY_GROUPS;
}

function parseMondaiFromTitle(title) {
  if (!title) return null;
  const m = String(title).match(/問題\s*([0-9０-９]+)/);
  if (!m) return null;
  const raw = m[1].replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0));
  return parseInt(raw, 10);
}

function normalizeReadingMondai(level, mondai) {
  if (level === "N3") {
    if (mondai >= 4 && mondai <= 7) return mondai;
    if (mondai >= 10 && mondai <= 13) return mondai - 6;
  }
  return mondai;
}

function getPoints(level, kind, mondai) {
  const table = POINT_CONFIGS[level]?.[kind];
  if (!table || mondai == null) return 0;
  return table[mondai] ?? 0;
}

export function buildScoreMeta(level, sectionType, title, mondaiNum = null) {
  const type = (sectionType || "").toLowerCase();
  let kind = "vocab";
  if (type === "grammar" || type === "clozetest") kind = "grammar";
  if (type === "reading") kind = "reading";
  if (type === "listening") kind = "listening";

  let mondai = mondaiNum ?? parseMondaiFromTitle(title);
  if (kind === "reading") mondai = normalizeReadingMondai(level, mondai);
  if (type === "clozetest" && !mondai) {
    const grammarKeys = Object.keys(POINT_CONFIGS[level]?.grammar || {}).map(Number);
    mondai = grammarKeys.length ? Math.min(...grammarKeys) : null;
  }

  const bucket = kind === "vocab" || kind === "grammar" ? "vocabGrammar" : kind;
  return { kind, mondai, bucket };
}

export function calculateScores(level, items) {
  const passRules = PASS_RULES[level];
  const sectionGroups = getSectionGroups(level);

  const buckets = {
    vocabGrammar: { score: 0, max: 0, correct: 0, total: 0, rawScore: 0, rawMax: 0 },
    reading: { score: 0, max: 0, correct: 0, total: 0, rawScore: 0, rawMax: 0 },
    listening: { score: 0, max: 0, correct: 0, total: 0, rawScore: 0, rawMax: 0 },
  };

  items.forEach((item) => {
    const meta = item.scoreMeta;
    if (!meta || !buckets[meta.bucket]) return;

    const pts = getPoints(level, meta.kind, meta.mondai);
    const bucket = buckets[meta.bucket];
    bucket.total += 1;
    bucket.max += pts;

    const selected = item.selected == null ? null : Number(item.selected);
    const correct = Number(item.correct);
    if (selected !== null && selected === correct) {
      bucket.score += pts;
      bucket.correct += 1;
    }
  });

  Object.values(buckets).forEach((b) => {
    b.rawScore = Math.round(b.score * 10) / 10;
    b.rawMax = Math.round(b.max * 10) / 10;
  });

  const failReasons = [];

  sectionGroups.forEach((group) => {
    const groupRawScore = group.buckets.reduce((sum, key) => sum + buckets[key].rawScore, 0);
    const groupRawMax = group.buckets.reduce((sum, key) => sum + buckets[key].rawMax, 0);

    const incomplete = groupRawMax <= 0;
    const scaledTotal = incomplete ? 0 : Math.round(((groupRawScore / groupRawMax) * group.scale) * 10) / 10;
    const passed = !incomplete && scaledTotal >= group.min;
    const factor = incomplete ? 0 : group.scale / groupRawMax;

    group.buckets.forEach((key) => {
      const b = buckets[key];
      b.score = incomplete ? 0 : Math.round(b.rawScore * factor * 10) / 10;
      b.max = incomplete
        ? Math.round((group.scale / group.buckets.length) * 10) / 10
        : Math.round(b.rawMax * factor * 10) / 10;
      b.passed = passed;
      b.incomplete = incomplete;
      b.groupName = group.name;
      b.groupLabel = group.label;
      b.groupScaledScore = scaledTotal;
      b.groupMin = group.min;
    });

    if (!passed) {
      failReasons.push(
        incomplete
          ? `${group.label}: section not attempted`
          : `${group.label} ${scaledTotal} < ${group.min}`
      );
    }
  });

  const totalScore =
    Math.round((buckets.vocabGrammar.score + buckets.reading.score + buckets.listening.score) * 10) / 10;

  if (totalScore < passRules.totalMin) {
    failReasons.unshift(`Total ${totalScore} < ${passRules.totalMin}`);
  }

  const allGroupsPassed = sectionGroups.every((group) => buckets[group.buckets[0]].passed);
  const passed = totalScore >= passRules.totalMin && allGroupsPassed;

  return {
    level,
    vocabGrammar: buckets.vocabGrammar,
    reading: buckets.reading,
    listening: buckets.listening,
    total: {
      score: totalScore,
      max: 180,
      correct:
        buckets.vocabGrammar.correct + buckets.reading.correct + buckets.listening.correct,
      total: buckets.vocabGrammar.total + buckets.reading.total + buckets.listening.total,
    },
    passed,
    failReasons,
  };
}
