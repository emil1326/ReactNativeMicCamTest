import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, Image, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { useState } from 'react';

import { useCurrentStudent } from '../../store/hooks';

export default function HomeScreen() {
  const { color, isConnected, name, image, voice } = useCurrentStudent();
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function playVoice() {
    if (!voice) {
      Alert.alert('Aucun audio', 'Enregistrez d\'abord un message audio');
      return;
    }

    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: voice },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });

      await newSound.playAsync();
    } catch (error) {
      console.error('Erreur lors de la lecture:', error);
      Alert.alert('Erreur', 'Impossible de lire l\'audio');
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: color }] }>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.kicker}>Profil</Text>
            <Text style={styles.title}>Accueil</Text>
          </View>
        </View>

        {/* Photo de profil */}
        <View style={styles.profileImageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="person" size={60} color="#94a3b8" />
            </View>
          )}
        </View>

        <Text style={styles.text}>
          {isConnected && name ? `Bienvenue ${name}.` : 'Connecte-toi d\'abord depuis la page racine.'}
        </Text>
        
        {/* Icônes audio et paramètres */}
        <View style={styles.iconRow}>
          <Pressable
            hitSlop={10}
            style={[styles.actionButton, !voice && styles.actionButtonDisabled]}
            onPress={playVoice}
            disabled={!voice || isPlaying}
          >
            <Ionicons 
              name={isPlaying ? "volume-high" : "volume-medium"} 
              size={32} 
              color={voice ? "#0f766e" : "#cbd5e1"} 
            />
          </Pressable>
          
          <Pressable
            hitSlop={10}
            style={styles.actionButton}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings" size={32} color="#0f766e" />
          </Pressable>
        </View>
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
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#0f766e',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginTop: 16,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  actionButtonDisabled: {
    backgroundColor: '#f1f5f9',
  },
});
