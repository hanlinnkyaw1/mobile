import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
} from 'react-native';
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Facebook,
  Send,
  Users,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { colors } from '../theme';

export default function SettingsScreen() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [notifications, setNotifications] = useState(true);

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  const SectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <View style={styles.sectionHeader}>
      <Icon size={20} color={colors.primary} style={{ marginRight: 8 }} />
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const SocialCard = ({ title, subtitle, url, icon: Icon }: { title: string; subtitle: string; url: string; icon: any }) => (
    <TouchableOpacity style={styles.socialCard} onPress={() => openLink(url)}>
      <View style={styles.socialIconContainer}>
        <Icon size={24} color={colors.primary} />
      </View>
      <View style={styles.socialInfo}>
        <Text style={styles.socialTitle}>{title}</Text>
        <Text style={styles.socialSubtitle}>{subtitle}</Text>
        <Text style={styles.socialUrl}>{url.replace('https://', '')} →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      {/* Theme Section */}
      <View style={styles.section}>
        <SectionHeader title="Theme" icon={Sun} />
        <View style={styles.themeToggleContainer}>
          <TouchableOpacity
            style={[styles.themeButton, theme === 'light' && styles.activeTheme]}
            onPress={() => setTheme('light')}
          >
            <Sun size={18} color={theme === 'light' ? '#fff' : colors.text} />
            <Text style={[styles.themeButtonText, theme === 'light' && styles.activeThemeText]}>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, theme === 'dark' && styles.activeTheme]}
            onPress={() => setTheme('dark')}
          >
            <Moon size={18} color={theme === 'dark' ? '#fff' : colors.text} />
            <Text style={[styles.themeButtonText, theme === 'dark' && styles.activeThemeText]}>Dark</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, theme === 'auto' && styles.activeTheme]}
            onPress={() => setTheme('auto')}
          >
            <Monitor size={18} color={theme === 'auto' ? '#fff' : colors.text} />
            <Text style={[styles.themeButtonText, theme === 'auto' && styles.activeThemeText]}>Auto</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <SectionHeader title="Notifications" icon={Bell} />
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable alerts</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#d1d5db', true: colors.primary + '80' }}
            thumbColor={notifications ? colors.primary : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Connect Section */}
      <View style={styles.section}>
        <SectionHeader title="Connect" icon={Users} />
        <SocialCard
          title="Facebook"
          subtitle="Join our community"
          url="https://facebook.com/jlptburmese"
          icon={Facebook}
        />
        <SocialCard
          title="Telegram Channel"
          subtitle="Get daily tips"
          url="https://t.me/jlptburmese"
          icon={Send}
        />
        <SocialCard
          title="Join Community"
          subtitle="Connect with learners"
          url="https://t.me/jlptburmese_group"
          icon={Users}
        />
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <SectionHeader title="About" icon={Info} />
        <View style={styles.aboutInfo}>
          <Text style={styles.aboutText}>Version: 1.0.0</Text>
          <Text style={styles.aboutText}>© 2026 JLPT Burmese</Text>
        </View>
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    padding: 20,
    paddingBottom: 10,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTheme: {
    backgroundColor: colors.primary,
  },
  themeButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  activeThemeText: {
    color: '#fff',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  socialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  socialInfo: {
    flex: 1,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  socialSubtitle: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  socialUrl: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  aboutInfo: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aboutText: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
});
