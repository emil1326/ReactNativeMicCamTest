import { Ionicons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { Tabs } from 'expo-router';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const createIcon = (name: IoniconName) =>
  ({ color, size }: { color: string; size: number }) =>
    <Ionicons name={name} color={color} size={size} />;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#0f766e',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: 'Accueil',
          title: 'Accueil',
          tabBarIcon: createIcon('home-outline'),
        }}
      />
      <Tabs.Screen
        name="tab_1/index"
        options={{
          headerTitle: 'Tab 1',
          title: 'Tab 1',
          tabBarIcon: createIcon('bus-outline'),
        }}
      />
      <Tabs.Screen
        name="tab_2/index"
        options={{
          headerTitle: 'Tab 2',
          title: 'Tab 2',
          tabBarIcon: createIcon('airplane-outline'),
        }}
      />
    </Tabs>
  );
}
