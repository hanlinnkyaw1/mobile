// src/features/jlpt-practice/sections/ListeningSection.js
import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AudioPlayer from "../components/AudioPlayer";
import QuestionCard from "../components/QuestionCard";
import JumpNav from "../components/JumpNav";

export default function ListeningSection({ data, answers, onSelectAnswer, isSubmitted }) {
  const [audioProgress, setAudioProgress] = useState(0);
  const scrollViewRef = useRef(null);
  const questionRefs = useRef({});

  const allQuestions = (data.sections || []).flatMap((sec) =>
    sec.questions.map((q) => ({
      ...q,
      sectionMondai: sec.mondai,
      sectionTitle: sec.title,
      instruction: sec.instruction,
    }))
  );

  const handleQuestionLayout = (questionId, y) => {
    questionRefs.current[questionId] = y;
  };

  return (
    <View style={styles.container}>
      <AudioPlayer
        audioUrl={data.audio_src}
        fallbackUrl={data.aduio_src_fallback}
        onProgressUpdate={setAudioProgress}
      />
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${audioProgress * 100}%` }]} />
      </View>

      <ScrollView ref={scrollViewRef} style={styles.scrollContainer}>
        {(data.sections || []).map((sec) => (
          <View key={sec.mondai} style={styles.mondaiSection}>
            <View style={styles.mondaiHeader}>
              <Text style={styles.mondaiTag}>SECTION</Text>
              <Text style={styles.mondaiTitle}>{sec.title}</Text>
              <View style={styles.instructionBox}>
                <Text style={styles.instructionText}>{sec.instruction}</Text>
              </View>
            </View>

            {sec.questions.map((q) => {
              const qId = `listen-${q.id}`;
              const isAudioOnly = q.type?.startsWith("audio_only");
              return (
                <View
                  key={qId}
                  onLayout={(e) => handleQuestionLayout(qId, e.nativeEvent.layout.y)}
                >
                  {isAudioOnly && (
                    <View style={styles.memoBox}>
                      <Text style={styles.memoText}>
                        🔊 Listen to the audio and select the best answer.
                      </Text>
                    </View>
                  )}
                  <QuestionCard
                    questionId={qId}
                    questionNumber={q.label || q.id}
                    questionText={isAudioOnly ? "（Audio Question）" : q.label}
                    options={q.options}
                    selectedAnswer={answers[qId]}
                    onSelectAnswer={onSelectAnswer}
                    isSubmitted={isSubmitted}
                    correctAnswer={q.answer - 1}
                    showMissedHighlight={isSubmitted}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <JumpNav
        questions={allQuestions.map((q) => ({
          id: `listen-${q.id}`,
          label: q.label || String(q.id),
          answered: answers[`listen-${q.id}`] !== undefined,
        }))}
        onJump={(id) => {
          const y = questionRefs.current[id];
          if (y != null) scrollViewRef.current?.scrollTo({ y: y - 100, animated: true });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  progressBar: { height: 3, backgroundColor: "#e5e7eb", marginBottom: 16, borderRadius: 2 },
  progressFill: { height: "100%", backgroundColor: "#2563eb", borderRadius: 2 },
  scrollContainer: { flex: 1 },
  mondaiSection: { marginBottom: 24 },
  mondaiHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#1f2937",
  },
  mondaiTag: { fontSize: 11, color: "#6b7280", letterSpacing: 1, marginBottom: 4 },
  mondaiTitle: { fontSize: 20, fontWeight: "700", marginBottom: 8, color: "#1f2937" },
  instructionBox: { backgroundColor: "#f9fafb", padding: 12, borderRadius: 8 },
  instructionText: { fontSize: 14, lineHeight: 20, color: "#374151" },
  memoBox: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#2563eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  memoText: { fontSize: 13, color: "#2563eb" },
});
