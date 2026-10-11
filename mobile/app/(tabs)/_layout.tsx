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
          title: 'Profil',
          tabBarIcon: createIcon('person-outline'),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="tab_1/index"
        options={{
          title: 'Camera',
          tabBarIcon: createIcon('camera-outline'),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="tab_2/index"
        options={{
          title: 'Audio',
          tabBarIcon: createIcon('mic-outline'),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
