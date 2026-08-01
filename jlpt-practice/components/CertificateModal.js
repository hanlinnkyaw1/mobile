// src/features/jlpt-practice/components/CertificateModal.js
import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function CertificateModal({ visible, onClose, result, time }) {
  if (!result) return null;

  const percentage = ((result.total.score / result.total.max) * 100).toFixed(1);
  const passStatus = result.passed ? "合格 (Passed)" : "不合格 (Failed)";
  const dateStr = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: "Noto Serif JP", serif; background: #f5f5f0; margin: 0; padding: 40px; }
        .cert { max-width: 700px; margin: 0 auto; background: #fffef8; border: 8px double #8b0000; padding: 48px; text-align: center; }
        .title { font-size: 28px; color: #8b0000; margin-bottom: 8px; letter-spacing: 4px; }
        .subtitle { font-size: 18px; color: #333; margin-bottom: 32px; }
        .name { font-size: 32px; color: #1a1a1a; margin: 24px 0; font-weight: bold; }
        .level { font-size: 24px; color: #8b0000; margin-bottom: 16px; }
        .message { font-size: 16px; color: #444; line-height: 1.8; margin-bottom: 32px; }
        table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        th, td { border: 1px solid #8b0000; padding: 12px; font-size: 15px; }
        th { background: #8b0000; color: #fff; }
        .seal { margin-top: 32px; font-size: 48px; color: #8b0000; }
        .footer { margin-top: 24px; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="cert">
        <div class="title">日本語能力試験</div>
        <div class="subtitle">模擬テスト 合格証書</div>
        <div class="name">Your Name 様</div>
        <div class="level">JLPT ${result.level}</div>
        <div class="message">
          あなたは当プラットフォーム主催の模擬試験において<br>
          頭書の成績を収め見事合格されました
        </div>
        <table>
          <tr><th>Section</th><th>Score</th></tr>
          <tr><td>言語知識（文字・語彙・文法）</td><td>${result.vocabGrammar.score} / ${result.vocabGrammar.max}</td></tr>
          <tr><td>読解</td><td>${result.reading.score} / ${result.reading.max}</td></tr>
          <tr><td>聴解</td><td>${result.listening.score} / ${result.listening.max}</td></tr>
          <tr><td>総合得点 (${percentage}%)</td><td>${result.total.score} / ${result.total.max} — ${passStatus}</td></tr>
        </table>
        <div class="seal">之印</div>
        <div class="footer">${dateStr}<br>JLPT Burmese</div>
      </div>
    </body>
    </html>
  `;

  const handleShare = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (Platform.OS === "ios") {
        await Share.share({ url: uri, title: "JLPT Certificate" });
      } else {
        await Sharing.shareAsync(uri, { mimeType: "application/pdf", dialogTitle: "Share Certificate" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Certificate</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
            <Ionicons name="share-outline" size={24} color="#2563eb" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.certScroll}>
          <View style={styles.certCard}>
            <Text style={styles.certTitle}>日本語能力試験</Text>
            <Text style={styles.certSubtitle}>模擬テスト 合格証書</Text>

            <View style={styles.divider} />

            <Text style={styles.certName}>Your Name 様</Text>
            <Text style={styles.certLevel}>JLPT {result.level}</Text>

            <Text style={styles.certMessage}>
              あなたは当プラットフォーム主催の模擬試験において{"\n"}
              頭書の成績を収め見事合格されました
            </Text>

            <View style={styles.scoreTable}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeaderCell}>Section</Text>
                <Text style={styles.tableHeaderCell}>Score</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>言語知識（文字・語彙・文法）</Text>
                <Text style={styles.tableCell}>
                  {result.vocabGrammar.score} / {result.vocabGrammar.max}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>読解</Text>
                <Text style={styles.tableCell}>
                  {result.reading.score} / {result.reading.max}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>聴解</Text>
                <Text style={styles.tableCell}>
                  {result.listening.score} / {result.listening.max}
                </Text>
              </View>
              <View style={[styles.tableRow, styles.totalRow]}>
                <Text style={[styles.tableCell, styles.totalCell]}>
                  総合得点 ({percentage}%)
                </Text>
                <Text style={[styles.tableCell, styles.totalCell]}>
                  {result.total.score} / {result.total.max} — {passStatus}
                </Text>
              </View>
            </View>

            <View style={styles.sealBox}>
              <Text style={styles.sealText}>之印</Text>
            </View>

            <Text style={styles.certFooter}>
              {dateStr}
              {"\n"}JLPT Burmese
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: "#f5f5f0" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  closeBtn: { padding: 4 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#1f2937" },
  shareBtn: { padding: 4 },
  certScroll: { flex: 1, padding: 20 },
  certCard: {
    backgroundColor: "#fffef8",
    borderWidth: 4,
    borderColor: "#8b0000",
    padding: 32,
    alignItems: "center",
  },
  certTitle: { fontSize: 26, color: "#8b0000", fontWeight: "700", letterSpacing: 4 },
  certSubtitle: { fontSize: 16, color: "#333", marginTop: 4, marginBottom: 24 },
  divider: { width: 60, height: 2, backgroundColor: "#8b0000", marginVertical: 16 },
  certName: { fontSize: 28, fontWeight: "bold", color: "#1a1a1a", marginVertical: 12 },
  certLevel: { fontSize: 22, color: "#8b0000", fontWeight: "600", marginBottom: 16 },
  certMessage: { fontSize: 14, color: "#444", lineHeight: 22, textAlign: "center", marginBottom: 24 },
  scoreTable: { width: "100%", borderWidth: 1, borderColor: "#8b0000", marginVertical: 16 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#8b0000" },
  tableHeaderCell: {
    flex: 1,
    backgroundColor: "#8b0000",
    color: "#fff",
    padding: 10,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 13,
    color: "#333",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#8b0000",
  },
  totalRow: { backgroundColor: "#fef2f2" },
  totalCell: { fontWeight: "700", color: "#8b0000" },
  sealBox: { marginTop: 24, marginBottom: 12 },
  sealText: { fontSize: 48, color: "#8b0000", fontWeight: "bold" },
  certFooter: { fontSize: 13, color: "#666", textAlign: "center", lineHeight: 20 },
});
