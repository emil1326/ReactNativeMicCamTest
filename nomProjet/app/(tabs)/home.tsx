import { StyleSheet, Text, View } from 'react-native';

import { useAppSelector } from '../../store/hooks';

export default function HomeScreen() {
  const { color, isConnected, name } = useAppSelector((state) => state.student);

  return (
    <View style={[styles.container, { backgroundColor: color }] }>
      <Text style={styles.title}>Accueil</Text>
      <Text style={styles.text}>
        {isConnected && name ? `Bienvenue ${name}.` : 'Connecte-toi d\'abord depuis la page racine.'}
      </Text>
      <Text style={styles.text}>Cette vue lit les données globales depuis Redux.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    color: '#0f172a',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#334155',
    marginTop: 6,
  },
});
