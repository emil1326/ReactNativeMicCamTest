import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>Page introuvable</Text>
      <Text style={styles.description}>
        La route demandée n'existe pas. Retourne à l'écran de connexion pour repartir.
      </Text>

      <Link href="/" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Retour à la connexion</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  code: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#0f766e',
  },
  title: {
    marginTop: 12,
    fontSize: 30,
    fontWeight: '700',
    color: '#0f172a',
  },
  description: {
    marginTop: 10,
    marginBottom: 24,
    maxWidth: 320,
    textAlign: 'center',
    lineHeight: 22,
    color: '#475569',
  },
  button: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#0f766e',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
