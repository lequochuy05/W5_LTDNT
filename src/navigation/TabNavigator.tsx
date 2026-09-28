import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { TabParamList } from './types';
import { BrowseNavigator } from './BrowseNavigator';
import { MyBookingsScreen } from '../screens/MyBookings/MyBookingsScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { Colors, Typography } from '../constants';

const Tab = createBottomTabNavigator<TabParamList>();

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
}

function TabIcon({ emoji, label, focused }: TabIconProps) {
  return (
    <View style={tabIconStyles.container}>
      <Text style={tabIconStyles.emoji}>{emoji}</Text>
      <Text style={[tabIconStyles.label, focused && tabIconStyles.labelActive]}>
        {label}
      </Text>
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 2,
    paddingTop: 4,
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    color: Colors.tabInactive,
  },
  labelActive: {
    color: Colors.tabActive,
    fontWeight: Typography.weight.semibold,
  },
});

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.tabBarBorder,
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 62,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Browse"
        component={BrowseNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Browse" focused={focused} />
          ),
          tabBarAccessibilityLabel: 'Browse Rooms tab',
        }}
      />
      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📋" label="Bookings" focused={focused} />
          ),
          tabBarAccessibilityLabel: 'My Bookings tab',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Profile" focused={focused} />
          ),
          tabBarAccessibilityLabel: 'Profile tab',
        }}
      />
    </Tab.Navigator>
  );
}
