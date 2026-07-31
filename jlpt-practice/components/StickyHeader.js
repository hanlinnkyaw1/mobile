// src/features/jlpt-practice/components/StickyHeader.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StickyHeader({ title, subtitle, time, showTimer, onBack }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const isWarning = time > 6000;

  return (
    <View style={styles.stickyBar}>
      <View style={styles.navContainer}>
        <View style={styles.leftSection}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#334155" />
            </TouchableOpacity>
          )}
          <Text style={styles.logo}>
            JLPT <Text style={styles.logoAccent}>Burmese</Text>
          </Text>
        </View>

        {showTimer && (
          <View style={[styles.timerContainer, isWarning && styles.timerWarning]}>
            <Text style={styles.timerIcon}>⏳</Text>
            <Text style={[styles.timerText, isWarning && styles.timerWarningText]}>
              {formatTime(time)}
            </Text>
          </View>
        )}

        <View style={styles.placeholder} />
      </View>

      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>JLPT N1</Text>
          </View>
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.placeholderSmall} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stickyBar: {
    backgroundColor: "#ffffff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: { elevation: 6 },
    }),
    zIndex: 1000,
  },
  navContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 65,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  leftSection: { flexDirection: "row", alignItems: "center", gap: 12 },
  backButton: { padding: 4 },
  logo: { fontSize: 20, fontWeight: "800", color: "#1e293b" },
  logoAccent: { color: "#2563eb" },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    gap: 4,
  },
  timerWarning: { backgroundColor: "#fee2e2", borderColor: "#ef4444" },
  timerIcon: { fontSize: 14 },
  timerText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    fontVariant: ["tabular-nums"],
  },
  timerWarningText: { color: "#b91c1c" },
  placeholder: { width: 40 },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexWrap: "wrap",
    gap: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  badge: {
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  titleWrap: { flex: 1, alignItems: "center", minWidth: 200 },
  title: { fontSize: 18, fontWeight: "700", color: "#1f2937", textAlign: "center" },
  subtitle: { fontSize: 13, color: "#6b7280", marginTop: 4, textAlign: "center" },
  placeholderSmall: { width: 60 },
});
