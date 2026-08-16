import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ToolsIndexScreen from '../screens/ToolsIndexScreen';
import MoreIndexScreen from '../screens/MoreIndexScreen';
import ReachabilityScreen from '../screens/ReachabilityScreen';
import DnsLookupScreen from '../screens/DnsLookupScreen';
import PortCheckScreen from '../screens/PortCheckScreen';
import SavedResultsScreen from '../screens/SavedResultsScreen';
import SaveResultDetailScreen from '../screens/SaveResultDetailScreen';
import SubnetCalculatorScreen from '../screens/SubnetCalculatorScreen';
import IpConverterScreen from '../screens/IpConverterScreen';
import LearningHubScreen from '../screens/LearningHubScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';

export type RootStackParamList = {
  Root: undefined;
  SaveResultDetail: { resultId: string };
};

export type ToolsStackParamList = {
  ToolsList: undefined;
  Reachability: undefined;
  DnsLookup: undefined;
  PortCheck: undefined;
};

export type MoreStackParamList = {
  MoreList: undefined;
  SubnetCalculator: undefined;
  IpConverter: undefined;
  LearningHub: undefined;
  Settings: undefined;
  About: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const ToolsStack = createNativeStackNavigator<ToolsStackParamList>();
const MoreStack = createNativeStackNavigator<MoreStackParamList>();

function ToolsNavigator() {
  const { isDark } = useTheme();

  return (
    <ToolsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: isDark ? '#0f172a' : '#ffffff' },
        headerTintColor: isDark ? '#fff' : '#0f172a',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <ToolsStack.Screen
        name="ToolsList"
        component={ToolsIndexScreen}
        options={{ title: 'Network Tools' }}
      />
      <ToolsStack.Screen
        name="Reachability"
        component={ReachabilityScreen}
        options={{ title: 'Reachability Check' }}
      />
      <ToolsStack.Screen
        name="DnsLookup"
        component={DnsLookupScreen}
        options={{ title: 'DNS Lookup' }}
      />
      <ToolsStack.Screen
        name="PortCheck"
        component={PortCheckScreen}
        options={{ title: 'Port Check' }}
      />
    </ToolsStack.Navigator>
  );
}

function MoreNavigator() {
  const { isDark } = useTheme();

  return (
    <MoreStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: isDark ? '#0f172a' : '#ffffff' },
        headerTintColor: isDark ? '#fff' : '#0f172a',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <MoreStack.Screen
        name="MoreList"
        component={MoreIndexScreen}
        options={{ title: 'More' }}
      />
      <MoreStack.Screen
        name="SubnetCalculator"
        component={SubnetCalculatorScreen}
        options={{ title: 'Subnet Calculator' }}
      />
      <MoreStack.Screen
        name="IpConverter"
        component={IpConverterScreen}
        options={{ title: 'IP Converter' }}
      />
      <MoreStack.Screen
        name="LearningHub"
        component={LearningHubScreen}
        options={{ title: 'Learning Hub' }}
      />
      <MoreStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <MoreStack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'About ODI' }}
      />
    </MoreStack.Navigator>
  );
}

function TabNavigator() {
  const { isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon: any = 'home';
          if (route.name === 'Home') icon = 'home';
          else if (route.name === 'Tools') icon = 'wrench';
          else if (route.name === 'Saved') icon = 'content-save';
          else if (route.name === 'More') icon = 'dots-horizontal';

          return <MaterialCommunityIcons name={icon} size={size} color={color} />
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          borderTopColor: isDark ? '#1e293b' : '#dbeafe',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tools" component={ToolsNavigator} />
      <Tab.Screen name="Saved" component={SavedResultsScreen} />
      <Tab.Screen name="More" component={MoreNavigator} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  const { isDark } = useTheme();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Root" component={TabNavigator} />
        <RootStack.Screen
          name="SaveResultDetail"
          component={SaveResultDetailScreen}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: isDark ? '#0f172a' : '#ffffff' },
            headerTintColor: isDark ? '#fff' : '#0f172a',
            title: 'Result Detail',
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
