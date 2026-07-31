// src/features/jlpt-practice/api/testDataLoader.js
// ============================================================
// STATIC REGISTRY — all JSONs bundled at build time via Metro
// Copy your JSON files into assets/data/jlpttest/N1-N5/
// then adjust the import paths below to match your folder depth.
// ============================================================

// ── N1 ──
import N1MojiGoiTest1 from "../../../../assets/data/jlpttest/N1/N1MojiGoiTest1.json";
import N1MojiGoiTest2 from "../../../../assets/data/jlpttest/N1/N1MojiGoiTest2.json";
import N1MojiGoiTest3 from "../../../../assets/data/jlpttest/N1/N1MojiGoiTest3.json";
import N1ReadingTest1 from "../../../../assets/data/jlpttest/N1/N1ReadingTest1.json";
import N1ReadingTest2 from "../../../../assets/data/jlpttest/N1/N1ReadingTest2.json";
import N1ReadingTest3 from "../../../../assets/data/jlpttest/N1/N1ReadingTest3.json";
import N1ListeningTest1 from "../../../../assets/data/jlpttest/N1/N1ListeningTest1.json";
import N1ListeningTest2 from "../../../../assets/data/jlpttest/N1/N1ListeningTest2.json";
import N1ListeningTest3 from "../../../../assets/data/jlpttest/N1/N1ListeningTest3.json";

// ── N2 ──
import N2MojiGoiTest1 from "../../../../assets/data/jlpttest/N2/N2MojiGoiTest1.json";
import N2MojiGoiTest2 from "../../../../assets/data/jlpttest/N2/N2MojiGoiTest2.json";
import N2MojiGoiTest3 from "../../../../assets/data/jlpttest/N2/N2MojiGoiTest3.json";
import N2ReadingTest1 from "../../../../assets/data/jlpttest/N2/N2ReadingTest1.json";
import N2ReadingTest2 from "../../../../assets/data/jlpttest/N2/N2ReadingTest2.json";
import N2ReadingTest3 from "../../../../assets/data/jlpttest/N2/N2ReadingTest3.json";
import N2ListeningTest1 from "../../../../assets/data/jlpttest/N2/N2ListeningTest1.json";
import N2ListeningTest2 from "../../../../assets/data/jlpttest/N2/N2ListeningTest2.json";
import N2ListeningTest3 from "../../../../assets/data/jlpttest/N2/N2ListeningTest3.json";

// ── N3 ──
import N3MojiGoiTest1 from "../../../../assets/data/jlpttest/N3/N3MojiGoiTest1.json";
import N3MojiGoiTest2 from "../../../../assets/data/jlpttest/N3/N3MojiGoiTest2.json";
import N3MojiGoiTest3 from "../../../../assets/data/jlpttest/N3/N3MojiGoiTest3.json";
import N3ReadingTest1 from "../../../../assets/data/jlpttest/N3/N3ReadingTest1.json";
import N3ReadingTest2 from "../../../../assets/data/jlpttest/N3/N3ReadingTest2.json";
import N3ReadingTest3 from "../../../../assets/data/jlpttest/N3/N3ReadingTest3.json";
import N3ListeningTest1 from "../../../../assets/data/jlpttest/N3/N3ListeningTest1.json";
import N3ListeningTest2 from "../../../../assets/data/jlpttest/N3/N3ListeningTest2.json";
import N3ListeningTest3 from "../../../../assets/data/jlpttest/N3/N3ListeningTest3.json";

// ── N4 ──
import N4MojiGoiTest1 from "../../../../assets/data/jlpttest/N4/N4MojiGoiTest1.json";
import N4MojiGoiTest2 from "../../../../assets/data/jlpttest/N4/N4MojiGoiTest2.json";
import N4MojiGoiTest3 from "../../../../assets/data/jlpttest/N4/N4MojiGoiTest3.json";
import N4ReadingTest1 from "../../../../assets/data/jlpttest/N4/N4ReadingTest1.json";
import N4ReadingTest2 from "../../../../assets/data/jlpttest/N4/N4ReadingTest2.json";
import N4ReadingTest3 from "../../../../assets/data/jlpttest/N4/N4ReadingTest3.json";
import N4ListeningTest1 from "../../../../assets/data/jlpttest/N4/N4ListeningTest1.json";
import N4ListeningTest2 from "../../../../assets/data/jlpttest/N4/N4ListeningTest2.json";
import N4ListeningTest3 from "../../../../assets/data/jlpttest/N4/N4ListeningTest3.json";

// ── N5 ──
import N5MojiGoiTest1 from "../../../../assets/data/jlpttest/N5/N5MojiGoiTest1.json";
import N5MojiGoiTest2 from "../../../../assets/data/jlpttest/N5/N5MojiGoiTest2.json";
import N5MojiGoiTest3 from "../../../../assets/data/jlpttest/N5/N5MojiGoiTest3.json";
import N5ReadingTest1 from "../../../../assets/data/jlpttest/N5/N5ReadingTest1.json";
import N5ReadingTest2 from "../../../../assets/data/jlpttest/N5/N5ReadingTest2.json";
import N5ReadingTest3 from "../../../../assets/data/jlpttest/N5/N5ReadingTest3.json";
import N5ListeningTest1 from "../../../../assets/data/jlpttest/N5/N5ListeningTest1.json";
import N5ListeningTest2 from "../../../../assets/data/jlpttest/N5/N5ListeningTest2.json";
import N5ListeningTest3 from "../../../../assets/data/jlpttest/N5/N5ListeningTest3.json";

const REGISTRY = {
  N1: {
    1: { mojiGoi: N1MojiGoiTest1, reading: N1ReadingTest1, listening: N1ListeningTest1 },
    2: { mojiGoi: N1MojiGoiTest2, reading: N1ReadingTest2, listening: N1ListeningTest2 },
    3: { mojiGoi: N1MojiGoiTest3, reading: N1ReadingTest3, listening: N1ListeningTest3 },
  },
  N2: {
    1: { mojiGoi: N2MojiGoiTest1, reading: N2ReadingTest1, listening: N2ListeningTest1 },
    2: { mojiGoi: N2MojiGoiTest2, reading: N2ReadingTest2, listening: N2ListeningTest2 },
    3: { mojiGoi: N2MojiGoiTest3, reading: N2ReadingTest3, listening: N2ListeningTest3 },
  },
  N3: {
    1: { mojiGoi: N3MojiGoiTest1, reading: N3ReadingTest1, listening: N3ListeningTest1 },
    2: { mojiGoi: N3MojiGoiTest2, reading: N3ReadingTest2, listening: N3ListeningTest2 },
    3: { mojiGoi: N3MojiGoiTest3, reading: N3ReadingTest3, listening: N3ListeningTest3 },
  },
  N4: {
    1: { mojiGoi: N4MojiGoiTest1, reading: N4ReadingTest1, listening: N4ListeningTest1 },
    2: { mojiGoi: N4MojiGoiTest2, reading: N4ReadingTest2, listening: N4ListeningTest2 },
    3: { mojiGoi: N4MojiGoiTest3, reading: N4ReadingTest3, listening: N4ListeningTest3 },
  },
  N5: {
    1: { mojiGoi: N5MojiGoiTest1, reading: N5ReadingTest1, listening: N5ListeningTest1 },
    2: { mojiGoi: N5MojiGoiTest2, reading: N5ReadingTest2, listening: N5ListeningTest2 },
    3: { mojiGoi: N5MojiGoiTest3, reading: N5ReadingTest3, listening: N5ListeningTest3 },
  },
};

/**
 * Load a combined test from local bundled JSONs.
 * Fully offline. Zero network requests.
 */
export function loadCombinedTest(level, testNum) {
  const test = REGISTRY[level]?.[testNum];
  if (!test) throw new Error(`Test not found: ${level} Test ${testNum}`);

  // Return deep clones so we never mutate the original imports
  return {
    level,
    testNum,
    mojiGoi: JSON.parse(JSON.stringify(test.mojiGoi)),
    reading: JSON.parse(JSON.stringify(test.reading)),
    listening: JSON.parse(JSON.stringify(test.listening)),
  };
}
