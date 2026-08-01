// src/features/jlpt-practice/JLPTPracticeScreen.js
import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StickyHeader from "./components/StickyHeader";
import TestSelection from "./components/TestSelection";
import SectionNavigator from "./components/SectionNavigator";
import MojiGoiSection from "./sections/MojiGoiSection";
import ReadingSection from "./sections/ReadingSection";
import ListeningSection from "./sections/ListeningSection";
import ScoreCard from "./components/ScoreCard";
import CertificateModal from "./components/CertificateModal";
import useTimer from "./hooks/useTimer";
import { loadCombinedTest } from "./api/testDataLoader";
import { calculateScores, buildScoreMeta } from "./utils/scoreEngine";

const SECTIONS = {
  MOJIGOI: "mojiGoi",
  READING: "reading",
  LISTENING: "listening",
};

const STORAGE_KEY = (level, num) => `jlpt_attempt_${level}_${num}`;

export default function JLPTPracticeScreen() {
  const [currentTest, setCurrentTest] = useState(null);
  const [activeSection, setActiveSection] = useState(SECTIONS.MOJIGOI);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  const scrollViewRef = useRef(null);
  const { time, isRunning, startTimer, stopTimer, resetTimer } = useTimer();

  const startNewTest = useCallback((level, testNum) => {
    try {
      const data = loadCombinedTest(level, testNum);
      setCurrentTest({ level, testNum, data });
      setAnswers({});
      setIsSubmitted(false);
      setShowScore(false);
      setScoreResult(null);
      setActiveSection(SECTIONS.MOJIGOI);
      resetTimer();
      startTimer();
    } catch (err) {
      Alert.alert("Error", "Failed to load test data.");
    }
  }, [resetTimer, startTimer]);

  const resumeTest = useCallback((level, testNum, savedData) => {
    try {
      const data = loadCombinedTest(level, testNum);
      setCurrentTest({ level, testNum, data });
      setAnswers(savedData.answers || {});
      setIsSubmitted(false);
      setShowScore(false);
      setScoreResult(null);
      setActiveSection(savedData.activeSection || SECTIONS.MOJIGOI);
      resetTimer();
      startTimer();
    } catch (err) {
      Alert.alert("Error", "Failed to resume test.");
    }
  }, [resetTimer, startTimer]);

  const handleLoadTest = useCallback(async (level, testNum) => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY(level, testNum));
      if (saved) {
        const data = JSON.parse(saved);
        Alert.alert(
          "Resume Test?",
          "You have a previous attempt saved. Continue where you left off?",
          [
            { text: "Start New", style: "destructive", onPress: () => startNewTest(level, testNum) },
            { text: "Resume", onPress: () => resumeTest(level, testNum, data) },
          ]
        );
        return;
      }
    } catch (e) { console.error(e); }
    startNewTest(level, testNum);
  }, [startNewTest, resumeTest]);

  const persistAnswers = useCallback(async (newAnswers, section) => {
    if (!currentTest) return;
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY(currentTest.level, currentTest.testNum),
        JSON.stringify({
          answers: newAnswers,
          activeSection: section,
          timestamp: Date.now(),
        })
      );
    } catch (e) { console.error(e); }
  }, [currentTest]);

  const handleSelectAnswer = useCallback((questionId, optionIndex) => {
    if (isSubmitted) return;
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: optionIndex };
      persistAnswers(next, activeSection);
      return next;
    });
  }, [isSubmitted, activeSection, persistAnswers]);

  const handleSubmit = useCallback(() => {
    const items = [];
    const { data, level } = currentTest;

    // MojiGoi
    [...(data.mojiGoi.section1 || []), ...(data.mojiGoi.section2 || [])].forEach((sec) => {
      if (sec.type === "clozeTest") {
        sec.questions?.forEach((q) => {
          q.blanks?.forEach((blank) => {
            const meta = buildScoreMeta(level, sec.type, sec.title);
            items.push({
              id: `cloze-${q.id}-${blank.number}`,
              scoreMeta: meta,
              selected: answers[`cloze-${q.id}-${blank.number}`],
              correct: blank.answer - 1,
            });
          });
        });
      } else {
        sec.questions?.forEach((q) => {
          const meta = buildScoreMeta(level, sec.type, sec.title);
          items.push({
            id: q.id,
            scoreMeta: meta,
            selected: answers[q.id],
            correct: q.answer - 1,
          });
        });
      }
    });

    // Reading — data uses section3 and section4
    [...(data.reading.section3 || []), ...(data.reading.section4 || [])].forEach((sec) => {
      sec.questions?.forEach((q) => {
        const meta = buildScoreMeta(level, "reading", sec.title);
        items.push({
          id: `reading-${q.id}`,
          scoreMeta: meta,
          selected: answers[`reading-${q.id}`],
          correct: q.answer - 1,
        });
      });
    });

    // Listening
    (data.listening.sections || []).forEach((sec) => {
      sec.questions?.forEach((q) => {
        const meta = buildScoreMeta(level, "listening", null, sec.mondai);
        items.push({
          id: `listen-${q.id}`,
          scoreMeta: meta,
          selected: answers[`listen-${q.id}`],
          correct: q.answer - 1,
        });
      });
    });

    const result = calculateScores(level, items);
    setScoreResult(result);
    stopTimer();
    setIsSubmitted(true);
    setShowScore(true);
  }, [currentTest, answers, stopTimer]);

  const handleBackToSelection = useCallback(() => {
    setCurrentTest(null);
    stopTimer();
    resetTimer();
    setAnswers({});
    setIsSubmitted(false);
    setShowScore(false);
    setScoreResult(null);
  }, [stopTimer, resetTimer]);

  const scrollToSection = useCallback((section) => {
    setActiveSection(section);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  if (!currentTest) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <StickyHeader title="JLPT Practice" subtitle="Select a test to begin" time={0} showTimer={false} />
        <TestSelection onSelectTest={handleLoadTest} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <StickyHeader
        title={`JLPT ${currentTest.level} Mock Exam`}
        subtitle={`Test ${currentTest.testNum}`}
        time={time}
        showTimer={true}
        onBack={handleBackToSelection}
      />
      <SectionNavigator activeSection={activeSection} onSelectSection={scrollToSection} sections={SECTIONS} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeSection === SECTIONS.MOJIGOI && currentTest.data.mojiGoi && (
          <MojiGoiSection
            data={currentTest.data.mojiGoi}
            answers={answers}
            onSelectAnswer={handleSelectAnswer}
            isSubmitted={isSubmitted}
          />
        )}
        {activeSection === SECTIONS.MOJIGOI && !currentTest.data.mojiGoi && (
          <View style={styles.emptySection}>
            <Text style={styles.emptySectionText}>Moji/Goi section not available for this test.</Text>
          </View>
        )}
        {activeSection === SECTIONS.READING && currentTest.data.reading && (
          <ReadingSection
            data={currentTest.data.reading}
            answers={answers}
            onSelectAnswer={handleSelectAnswer}
            isSubmitted={isSubmitted}
          />
        )}
        {activeSection === SECTIONS.READING && !currentTest.data.reading && (
          <View style={styles.emptySection}>
            <Text style={styles.emptySectionText}>Reading section not available for this test.</Text>
          </View>
        )}
        {activeSection === SECTIONS.LISTENING && currentTest.data.listening && (
          <ListeningSection
            data={currentTest.data.listening}
            answers={answers}
            onSelectAnswer={handleSelectAnswer}
            isSubmitted={isSubmitted}
          />
        )}
        {activeSection === SECTIONS.LISTENING && !currentTest.data.listening && (
          <View style={styles.emptySection}>
            <Text style={styles.emptySectionText}>Listening section not available for this test.</Text>
          </View>
        )}

        <View style={styles.actionArea}>
          {!isSubmitted ? (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
              <Text style={styles.submitButtonText}>Submit Answers</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: "#2c3e50" }]}
              onPress={() => setShowCertificate(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>View Certificate</Text>
            </TouchableOpacity>
          )}

          {showScore && scoreResult && <ScoreCard result={scoreResult} time={time} />}
        </View>
      </ScrollView>

      <CertificateModal
        visible={showCertificate}
        onClose={() => setShowCertificate(false)}
        result={scoreResult}
        time={time}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f6ff" },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  actionArea: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 20,
    gap: 16,
  },
  submitButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  emptySection: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptySectionText: { fontSize: 15, color: "#6b7280", textAlign: "center" },
});
