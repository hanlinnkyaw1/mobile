import React from 'react';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../theme';

const MOCK_EXAM_URL = 'https://www.jlptburmese.com/jlpt-mock-exam/jlptmocktest.html';

/**
 * On native platforms (iOS, Android) we use react-native-webview.
 * On web we render a native <iframe> element because react-native-webview
 * does not support the web platform out of the box.
 */
export default function JLPTWebViewScreen() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          src={MOCK_EXAM_URL}
          style={styles.iframe}
          title="JLPT Mock Exam"
          frameBorder="0"
          allow="fullscreen"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: MOCK_EXAM_URL }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  webview: {
    flex: 1,
  },
  iframe: {
    flex: 1,
    width: '100%',
    borderWidth: 0,
  } as any,
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
});
