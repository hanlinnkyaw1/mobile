import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

export default function AudioPlayer({ audioUrl, fallbackUrl, onProgressUpdate }) {
  const soundRef = useRef(null);
  const mountedRef = useRef(true);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [error, setError] = useState(null);

  const unloadSound = useCallback(async () => {
    const activeSound = soundRef.current;
    soundRef.current = null;
    setSound(null);
    setIsPlaying(false);
    if (activeSound) {
      try {
        await activeSound.unloadAsync();
      } catch (_) {
        // The sound may already be unloaded by the platform.
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      const activeSound = soundRef.current;
      soundRef.current = null;
      if (activeSound) activeSound.unloadAsync().catch(() => {});
    };
  }, []);

  const onPlaybackStatusUpdate = useCallback((status) => {
    if (!mountedRef.current || !status.isLoaded) return;
    setPosition(status.positionMillis || 0);
    setDuration(status.durationMillis || 0);
    setIsPlaying(status.isPlaying);
    if (onProgressUpdate && status.durationMillis > 0) {
      onProgressUpdate(status.positionMillis / status.durationMillis);
    }
    if (status.didJustFinish) setIsPlaying(false);
  }, [onProgressUpdate]);

  const loadAudio = useCallback(async (url, allowFallback = true) => {
    if (!url) {
      setError("No audio source is available for this test.");
      return;
    }
    setIsLoading(true);
    setError(null);
    await unloadSound();
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
      });
      const result = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, volume },
        onPlaybackStatusUpdate
      );
      if (!mountedRef.current) {
        await result.sound.unloadAsync();
        return;
      }
      soundRef.current = result.sound;
      setSound(result.sound);
      setIsPlaying(true);
      if (result.status.isLoaded) setDuration(result.status.durationMillis || 0);
    } catch (loadError) {
      if (allowFallback && fallbackUrl && url !== fallbackUrl) {
        await loadAudio(fallbackUrl, false);
      } else if (mountedRef.current) {
        setError(Platform.OS === "web"
          ? "Listening audio could not load in the browser. Try the mobile app or check your connection."
          : "Listening audio could not load. Check your connection and try again.");
      }
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, [fallbackUrl, onPlaybackStatusUpdate, unloadSound, volume]);

  const togglePlayPause = async () => {
    if (!soundRef.current) {
      await loadAudio(audioUrl);
      return;
    }
    if (isPlaying) await soundRef.current.pauseAsync();
    else await soundRef.current.playAsync();
  };

  const skip = async (amount) => {
    if (!soundRef.current) return;
    const newPosition = Math.max(0, Math.min(duration, position + amount * 1000));
    await soundRef.current.setPositionAsync(newPosition);
  };

  const seek = async (value) => {
    if (!soundRef.current || duration === 0) return;
    await soundRef.current.setPositionAsync(value * duration);
  };

  const changeVolume = async (value) => {
    setVolume(value);
    if (soundRef.current) await soundRef.current.setVolumeAsync(value);
  };

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
  };

  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.playButton} onPress={togglePlayPause} disabled={isLoading} accessibilityRole="button">
          {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name={isPlaying ? "pause" : "play"} size={18} color="#fff" />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={() => skip(-5)} accessibilityLabel="Back five seconds">
          <Text style={styles.skipText}>-5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={() => skip(5)} accessibilityLabel="Forward five seconds">
          <Text style={styles.skipText}>+5</Text>
        </TouchableOpacity>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <View style={styles.trackContainer}>
          <Slider style={styles.slider} minimumValue={0} maximumValue={1} value={progress} onSlidingComplete={seek} minimumTrackTintColor="#2563eb" maximumTrackTintColor="#e5e7eb" thumbTintColor="#2563eb" />
        </View>
        <Text style={styles.timeText}>{duration > 0 ? formatTime(duration) : "--:--"}</Text>
        <View style={styles.volumeWrap}>
          <Text style={{ fontSize: 14 }}>🔊</Text>
          <Slider style={styles.volumeSlider} minimumValue={0} maximumValue={1} step={0.05} value={volume} onValueChange={changeVolume} minimumTrackTintColor="#2563eb" maximumTrackTintColor="#e5e7eb" thumbTintColor="#2563eb" />
        </View>
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => loadAudio(audioUrl)} accessibilityRole="button">
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 8 },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
  },
  playButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#1f2937", alignItems: "center", justifyContent: "center" },
  skipButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#f3f4f6", borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center" },
  skipText: { fontSize: 12, fontWeight: "700", color: "#374151" },
  timeText: { fontSize: 13, color: "#1f2937", minWidth: 40, fontVariant: ["tabular-nums"] },
  trackContainer: { flex: 1, minWidth: 100 },
  slider: { width: "100%", height: 20 },
  volumeWrap: { flexDirection: "row", alignItems: "center", gap: 4 },
  volumeSlider: { width: 80, height: 20 },
  errorRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, paddingHorizontal: 8, paddingTop: 8 },
  errorText: { flex: 1, color: "#b91c1c", fontSize: 12 },
  retryText: { color: "#2563eb", fontSize: 13, fontWeight: "700" },
});
