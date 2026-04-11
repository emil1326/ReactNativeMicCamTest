import { StyleSheet, Text, View } from 'react-native';

import { useCurrentStudent } from '../../../store/hooks';

export default function TabTwoScreen() {
  const { color } = useCurrentStudent();

  return (
    <View style={[styles.container, { backgroundColor: color }] }>
      <View style={styles.card}>
        <Text style={styles.kicker}>Audio</Text>
        <Text style={styles.title}>Tab 2: Avion</Text>
        <Text style={styles.text}>Le fond d'écran suit aussi la couleur du student.</Text>
      </View>
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
  card: {
    width: '100%',
    gap: 10,
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
  kicker: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: '#0f766e',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },
});
