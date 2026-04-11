import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useCurrentStudent } from '../../store/hooks';

export default function HomeScreen() {
  const { color, isConnected, name } = useCurrentStudent();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: color }] }>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.kicker}>Profil</Text>
            <Text style={styles.title}>Accueil</Text>
          </View>
          <Pressable
            hitSlop={10}
            style={styles.iconButton}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={22} color="#0f172a" />
          </Pressable>
        </View>

        <Text style={styles.text}>
          {isConnected && name ? `Bienvenue ${name}.` : 'Connecte-toi d\'abord depuis la page racine.'}
        </Text>
        <Text style={styles.text}>Cette vue lit les données globales depuis Redux.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    gap: 14,
    borderRadius: 28,
    padding: 24,
    backgroundColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: '#0f766e',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0f172a',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
});
