import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../constants';
import { MOCK_USER } from '../../services/mockData';
import { useBookings } from '../../features/bookings/useBookings';

interface SettingRowProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
}

function SettingRow({
  icon,
  label,
  value,
  onPress,
  showArrow = true,
  showSwitch = false,
  switchValue,
  onSwitchChange,
}: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress && !showSwitch}
      style={({ pressed }) => [styles.settingRow, pressed && onPress && { opacity: 0.7 }]}
      accessibilityRole={showSwitch ? 'switch' : onPress ? 'button' : 'none'}
      accessibilityLabel={label}
      accessibilityState={showSwitch ? { checked: switchValue } : undefined}
    >
      <View style={styles.settingIcon}>
        <Text style={styles.settingIconText}>{icon}</Text>
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {value && <Text style={styles.settingValue}>{value}</Text>}
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: Colors.border, true: Colors.accent }}
          thumbColor={Colors.white}
          accessibilityLabel={`Toggle ${label}`}
        />
      ) : showArrow ? (
        <Text style={styles.settingArrow}>›</Text>
      ) : null}
    </Pressable>
  );
}

export function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const { data: bookings = [] } = useBookings();

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Profile</Text>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: MOCK_USER.avatarUrl }}
              style={styles.avatar}
              contentFit="cover"
              accessibilityLabel={`Avatar of ${MOCK_USER.name}`}
            />
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>🎓</Text>
            </View>
          </View>

          <Text style={styles.userName}>{MOCK_USER.name}</Text>
          <Text style={styles.userFaculty}>{MOCK_USER.faculty}</Text>

          <View style={styles.profileInfoRow}>
            <View style={styles.profileInfoChip}>
              <Text style={styles.profileInfoLabel}>Student ID</Text>
              <Text style={styles.profileInfoValue}>{MOCK_USER.studentId}</Text>
            </View>
            <View style={styles.profileInfoDivider} />
            <View style={styles.profileInfoChip}>
              <Text style={styles.profileInfoLabel}>Bookings</Text>
              <Text style={styles.profileInfoValue}>{bookings.length}</Text>
            </View>
            <View style={styles.profileInfoDivider} />
            <View style={styles.profileInfoChip}>
              <Text style={styles.profileInfoLabel}>Active</Text>
              <Text style={styles.profileInfoValue}>{confirmedBookings.length}</Text>
            </View>
          </View>
        </View>

        {/* Account info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="👤"
              label="Full Name"
              value={MOCK_USER.name}
              showArrow={false}
            />
            <View style={styles.groupDivider} />
            <SettingRow
              icon="📧"
              label="Email"
              value={MOCK_USER.email}
              showArrow={false}
            />
            <View style={styles.groupDivider} />
            <SettingRow
              icon="🎓"
              label="Faculty"
              value={MOCK_USER.faculty}
              showArrow={false}
            />
            <View style={styles.groupDivider} />
            <SettingRow
              icon="🪪"
              label="Student ID"
              value={MOCK_USER.studentId}
              showArrow={false}
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="🔔"
              label="Notifications"
              showSwitch
              switchValue={notificationsEnabled}
              onSwitchChange={setNotificationsEnabled}
            />
            <View style={styles.groupDivider} />
            <SettingRow
              icon="🌙"
              label="Dark Mode"
              showSwitch
              switchValue={darkModeEnabled}
              onSwitchChange={setDarkModeEnabled}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingsGroup}>
            <SettingRow
              icon="ℹ️"
              label="About App"
              onPress={() => {}}
            />
            <View style={styles.groupDivider} />
            <SettingRow
              icon="📋"
              label="Terms of Service"
              onPress={() => {}}
            />
            <View style={styles.groupDivider} />
            <SettingRow
              icon="🔒"
              label="Privacy Policy"
              onPress={() => {}}
            />
            <View style={styles.groupDivider} />
            <SettingRow
              icon="🔄"
              label="Version"
              value="1.0.0"
              showArrow={false}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <Pressable
              style={({ pressed }) => [styles.signOutButton, pressed && { opacity: 0.8 }]}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
            >
              <Text style={styles.signOutIcon}>🚪</Text>
              <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.footer}>Study Room Booking · v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  pageHeader: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  pageTitle: {
    fontSize: Typography.size.xxxl,
    fontWeight: Typography.weight.extrabold,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.tight,
  },

  // Profile card
  profileCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadow.md,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.xs,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarBadgeText: {
    fontSize: 12,
  },
  userName: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
    letterSpacing: Typography.letterSpacing.tight,
  },
  userFaculty: {
    fontSize: Typography.size.sm,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    fontWeight: Typography.weight.medium,
  },
  profileInfoRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
  },
  profileInfoChip: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  profileInfoDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 4,
  },
  profileInfoLabel: {
    fontSize: Typography.size.xs,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: Typography.weight.medium,
  },
  profileInfoValue: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
  },

  // Sections
  section: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wider,
    paddingLeft: Spacing.xs,
  },
  settingsGroup: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconText: {
    fontSize: 18,
  },
  settingContent: {
    flex: 1,
    gap: 1,
  },
  settingLabel: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.medium,
    color: Colors.textPrimary,
  },
  settingValue: {
    fontSize: Typography.size.sm,
    color: Colors.textTertiary,
    numberOfLines: 1,
  } as any,
  settingArrow: {
    fontSize: 20,
    color: Colors.textTertiary,
    fontWeight: Typography.weight.medium,
  },
  groupDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: Spacing.base + 34 + Spacing.md,
  },

  // Sign out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
  },
  signOutIcon: {
    fontSize: 18,
  },
  signOutText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semibold,
    color: Colors.error,
  },

  footer: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: Typography.size.xs,
    color: Colors.textTertiary,
  },
});
