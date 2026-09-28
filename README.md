# 🎓 Study Room Booking App

A modern, mobile-first campus study room and laboratory booking application built with **React Native** and **Expo**. 

This application allows students to browse available rooms across campus, filter by room types and availability, view detailed facilities, and seamlessly book time slots.

---

## ✨ Features

- **Browse & Search:** Discover 20+ study rooms, labs, and library zones across campus. Search by room name, building, or location.
- **Smart Filtering:** Filter rooms instantly by type (Lab, Study Room, Library) or availability status.
- **Room Details:** View high-quality images, capacity, floor numbers, and specific facilities (e.g., projectors, smartboards, Mac workstations).
- **Time Slot Booking:** Interactive time slot picker that prevents double-booking and visually indicates occupied slots.
- **My Bookings Management:** View upcoming and past bookings. Easily cancel confirmed reservations.
- **Profile & Settings:** View user profile stats and toggle preferences like notifications and dark mode (UI switch ready).
- **Responsive Layout:** Adaptive grid system that automatically scales from 1 column on phones to 2-3 columns on tablets and landscape modes.

---

## 🛠 Tech Stack

- **Framework:** React Native + [Expo SDK 57](https://expo.dev/) (Managed Workflow)
- **Language:** TypeScript (Strict Mode)
- **Navigation:** [React Navigation 7](https://reactnavigation.org/) (Bottom Tabs + Native Stack)
- **Client State:** [Zustand](https://github.com/pmndrs/zustand)
- **Server State:** [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **Styling:** React Native `StyleSheet` & Flexbox (No third-party UI libraries used, pure custom design)
- **Image Handling:** `expo-image` (High performance, caching, blurhash placeholders)
- **Safe Areas:** `react-native-safe-area-context` (Handles iPhone Dynamic Island and Android notches)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm, yarn, or bun
- **Expo Go** app installed on your physical device (iOS / Android)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd W5
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```
   *(If you face network issues with Expo Go, use `npx expo start --tunnel`)*

4. Open the App:
   - **On your phone:** Open the Expo Go app and scan the QR code shown in the terminal.
   - **On Android Emulator:** Press `a` in the terminal.
   - **On iOS Simulator:** Press `i` in the terminal (Requires macOS + Xcode).

---

## 📁 Folder Structure

```text
src/
├── components/         # Reusable UI components (RoomCard, SearchBar, Badge, etc.)
├── constants/          # Design tokens (Colors, Typography, Spacing)
├── features/           # TanStack Query hooks for specific domains (rooms, bookings)
├── hooks/              # Custom React hooks (useResponsiveLayout)
├── navigation/         # React Navigation configuration and types
├── screens/            # Main screen components separated by tabs
├── services/           # API mock services and mock data
├── store/              # Zustand global state stores
└── types/              # Global TypeScript interfaces and types
```

---

## 🔮 Future Enhancements

While this app is fully functional with a mock backend, future updates could include:
- Integration with a real REST API backend (Node.js/Express or Firebase).
- Real-time slot availability using WebSockets.
- Authentication (Login/Signup).
- Push notifications via `expo-notifications` for booking reminders.
- QR code generation for room check-in.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
