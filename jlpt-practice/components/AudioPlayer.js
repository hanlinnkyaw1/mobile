// src/features/jlpt-practice/components/AudioPlayer.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

export default function AudioPlayer({ audioUrl, fallbackUrl, onProgressUpdate }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const loadAudio = async (url) => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }

    setIsLoading(true);
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
      });

      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, volume },
        onPlaybackStatusUpdate
      );

      if (isMounted.current) {
        setSound(newSound);
        setIsPlaying(true);
        if (status.isLoaded) setDuration(status.durationMillis || 0);
      } else {
        newSound.unloadAsync();
      }
    } catch (error) {
      console.error("Audio load error:", error);
      if (fallbackUrl && url !== fallbackUrl) {
        Alert.alert("Audio Error", "Primary source failed. Trying fallback...");
        loadAudio(fallbackUrl);
      }
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!isMounted.current) return;
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
      if (onProgressUpdate && status.durationMillis > 0) {
        onProgressUpdate(status.positionMillis / status.durationMillis);
      }
      if (status.didJustFinish) setIsPlaying(false);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) {
      await loadAudio(audioUrl);
      return;
    }
    if (isPlaying) await sound.pauseAsync();
    else await sound.playAsync();
  };

  const skip = async (amount) => {
    if (!sound) return;
    const newPosition = Math.max(0, Math.min(duration, position + amount * 1000));
    await sound.setPositionAsync(newPosition);
  };

  const seek = async (value) => {
    if (!sound || duration === 0) return;
    await sound.setPositionAsync(value * duration);
  };

  const changeVolume = async (value) => {
    setVolume(value);
    if (sound) await sound.setVolumeAsync(value);
  };

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.playButton} onPress={togglePlayPause} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name={isPlaying ? "pause" : "play"} size={18} color="#fff" />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={() => skip(-5)}>
        <Text style={styles.skipText}>-5</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={() => skip(5)}>
        <Text style={styles.skipText}>+5</Text>
      </TouchableOpacity>

      <Text style={styles.timeText}>{formatTime(position)}</Text>

      <View style={styles.trackContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={progress}
          onSlidingComplete={seek}
          minimumTrackTintColor="#2563eb"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#2563eb"
        />
      </View>

      <Text style={styles.timeText}>{duration > 0 ? formatTime(duration) : "--:--"}</Text>

      <View style={styles.volumeWrap}>
        <Text style={{ fontSize: 14 }}>🔊</Text>
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={1}
          step={0.05}
          value={volume}
          onValueChange={changeVolume}
          minimumTrackTintColor="#2563eb"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#2563eb"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
  },
  skipButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: { fontSize: 12, fontWeight: "700", color: "#374151" },
  timeText: { fontSize: 13, color: "#1f2937", minWidth: 40, fontVariant: ["tabular-nums"] },
  trackContainer: { flex: 1, minWidth: 100 },
  slider: { width: "100%", height: 20 },
  volumeWrap: { flexDirection: "row", alignItems: "center", gap: 4 },
  volumeSlider: { width: 80, height: 20 },
});
