import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BrowseStackParamList } from './types';
import { BrowseRoomsScreen } from '../screens/BrowseRooms/BrowseRoomsScreen';
import { RoomDetailsScreen } from '../screens/RoomDetails/RoomDetailsScreen';
import { BookingConfirmationScreen } from '../screens/BookingConfirmation/BookingConfirmationScreen';
import { Colors, Typography } from '../constants';

const Stack = createNativeStackNavigator<BrowseStackParamList>();

export function BrowseNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          fontSize: Typography.size.base,
          fontWeight: Typography.weight.semibold,
          color: Colors.textPrimary,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen
        name="BrowseRooms"
        component={BrowseRoomsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RoomDetails"
        component={RoomDetailsScreen}
        options={{ title: 'Room Details' }}
      />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmationScreen}
        options={{
          title: 'Booking Confirmed',
          headerLeft: () => null, // prevent back nav after booking
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
