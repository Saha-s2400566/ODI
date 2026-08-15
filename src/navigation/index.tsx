import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DevicesScreen from '../screens/DevicesScreen';
import ChartScreen from '../screens/ChartScreen';
import ToolsScreen from '../screens/ToolsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import MoreScreen from '../screens/MoreScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Devices"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let name: any = 'ellipse';
          if (route.name === 'Devices') name = 'phone-portrait-outline';
          if (route.name === 'Chart') name = 'map-outline';
          if (route.name === 'Tools') name = 'construct-outline';
          if (route.name === 'Reports') name = 'document-text-outline';
          if (route.name === 'More') name = 'ellipsis-horizontal';
          return <Ionicons name={name} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Devices" component={DevicesScreen} />
      <Tab.Screen name="Chart" component={ChartScreen} />
      <Tab.Screen name="Tools" component={ToolsScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}
