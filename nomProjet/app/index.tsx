import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getStudentFromFirestore, saveStudentToFirestore } from '../firebase/students';
import { useAppDispatch } from '../store/hooks';
import { setStudent } from '../store/studentSlice';
import { createStudent } from '../types/student';
import { normalizePasswordForStorage, passwordMatches } from '../utils/password';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleConnect = async () => {
    const trimmedName = name.trim();
    const enteredPassword = password;

    if (!trimmedName) {
      setStatusMessage('Entre un nom avant de te connecter.');
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const existingStudent = await getStudentFromFirestore(trimmedName);

      if (existingStudent && !(await passwordMatches(existingStudent.password, enteredPassword))) {
        setStatusMessage('Mot de passe incorrect.');
        return;
      }

      const nextPassword = await normalizePasswordForStorage(enteredPassword, existingStudent?.password);

      const nextStudent = createStudent({
        ...(existingStudent ?? {}),
        name: trimmedName,
        password: nextPassword,
        isConnected: true,
      });

      dispatch(setStudent(nextStudent));
      await saveStudentToFirestore(nextStudent);
      router.replace('/home');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue Firebase.';
      setStatusMessage(`Impossible de charger le compte: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.kicker}>KBK Projet 2026</Text>
          <Text style={styles.title}>Connexion</Text>
          <TextInput
            placeholder="Nom"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            onChangeText={setName}
            value={name}
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <Pressable style={styles.button} onPress={handleConnect}>
            <Text style={styles.buttonText}>{isSaving ? 'Chargement...' : 'Se connecter / créer un compte'}</Text>
          </Pressable>

          {statusMessage ? <Text style={styles.status}>{statusMessage}</Text> : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#e2e8f0',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
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
  kicker: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: '#0f766e',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  button: {
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: '#0f766e',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  status: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: '#b91c1c',
  },
});
