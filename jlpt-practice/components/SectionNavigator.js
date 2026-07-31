// src/features/jlpt-practice/components/SectionNavigator.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const SECTION_LABELS = {
  mojiGoi: "MojiGoi",
  reading: "Reading",
  listening: "Listening",
};

export default function SectionNavigator({ activeSection, onSelectSection, sections }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {Object.values(sections).map((section) => (
        <TouchableOpacity
          key={section}
          style={[styles.tab, activeSection === section && styles.activeTab]}
          onPress={() => onSelectSection(section)}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeSection === section && styles.activeTabText]}>
            {SECTION_LABELS[section]}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "transparent",
    marginRight: 8,
  },
  activeTab: { backgroundColor: "#eff6ff", borderColor: "#bfdbfe" },
  tabText: { fontWeight: "700", fontSize: 14, color: "#374151" },
  activeTabText: { color: "#1e40af" },
});
