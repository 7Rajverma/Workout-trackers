import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Home, Activity, History, Timer, Dumbbell } from 'lucide-react-native';

// Import Screens
import DashboardScreen from './src/screens/DashboardScreen';
import TrackScreen from './src/screens/TrackScreen';
import WorkoutHistoryScreen from './src/screens/WorkoutHistoryScreen';
import TimerScreen from './src/screens/TimerScreen';
import ExerciseLibraryScreen from './src/screens/ExerciseLibraryScreen';
import { WorkoutProvider } from './src/context/WorkoutContext';

const Tab = createBottomTabNavigator();

const COLORS = {
  primary: '#6366f1',
  background: '#f8fafc',
  card: '#ffffff',
  text: '#0f172a',
  border: '#e2e8f0',
  inactive: '#94a3b8',
};

export default function App() {
  return (
    <WorkoutProvider>
      <SafeAreaProvider>
        <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.card,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
            },
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
              color: COLORS.text,
            },
            tabBarStyle: {
              backgroundColor: COLORS.card,
              borderTopWidth: 1,
              borderTopColor: COLORS.border,
              elevation: 0,
              shadowOpacity: 0,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.inactive,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
            },
          }}
        >
          <Tab.Screen 
            name="Dashboard" 
            component={DashboardScreen} 
            options={{
              tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
            }}
          />
          <Tab.Screen 
            name="Track" 
            component={TrackScreen} 
            options={{
              tabBarIcon: ({ color, size }) => <Activity color={color} size={size} />,
            }}
          />
          <Tab.Screen 
            name="History" 
            component={WorkoutHistoryScreen} 
            options={{
              tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
            }}
          />
          <Tab.Screen 
            name="Timer" 
            component={TimerScreen} 
            options={{
              tabBarIcon: ({ color, size }) => <Timer color={color} size={size} />,
            }}
          />
          <Tab.Screen 
            name="Library" 
            component={ExerciseLibraryScreen} 
            options={{
              title: 'Exercises',
              tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    </WorkoutProvider>
  );
}
