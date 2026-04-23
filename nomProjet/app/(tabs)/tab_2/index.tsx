import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { updateStudent } from '../../../store/studentSlice';

export default function AudioScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  
  const backgroundColor = useAppSelector((state) => state.student.color);
  const savedVoice = useAppSelector((state) => state.student.voice);
  const dispatch = useAppDispatch();

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        const permission = await requestPermission();
        if (!permission.granted) {
          Alert.alert('Permission refusée', 'Impossible d\'enregistrer l\'audio');
          return;
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', err);
      Alert.alert('Erreur', 'Impossible de démarrer l\'enregistrement');
    }
  }

  async function stopRecording() {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
      
      if (uri) {
        dispatch(updateStudent({ voice: uri }));
      }
    } catch (err) {
      console.error('Erreur lors de l\'arrêt de l\'enregistrement:', err);
      Alert.alert('Erreur', 'Impossible d\'arrêter l\'enregistrement');
    }
  }

  async function playSound(uri: string) {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
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
    } catch (err) {
      console.error('Erreur lors de la lecture:', err);
      Alert.alert('Erreur', 'Impossible de lire l\'audio');
    }
  }

  async function deleteRecording() {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setRecordingUri(null);
    setIsPlaying(false);
    dispatch(updateStudent({ voice: null }));
  }

  const currentUri = recordingUri || savedVoice;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <View style={styles.iconRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => currentUri && playSound(currentUri)}
            disabled={!currentUri || isPlaying}
          >
            <Ionicons 
              name={isPlaying ? "volume-high" : "volume-medium"} 
              size={48} 
              color={currentUri ? "#0f766e" : "#ccc"} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={deleteRecording}
            disabled={!currentUri}
          >
            <Ionicons 
              name="trash" 
              size={48} 
              color={currentUri ? "#dc2626" : "#ccc"} 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && styles.recordButtonActive
          ]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.recordButtonText}>
            {isRecording ? "ARRÊTER L'ENREGISTREMENT" : "COMMENCER L'ENREGISTREMENT"}
          </Text>
        </TouchableOpacity>

        {currentUri && (
          <View style={styles.uriContainer}>
            <Text style={styles.uriLabel}>Chemin de sauvegarde:</Text>
            <Text style={styles.uriText} numberOfLines={3}>
              {currentUri}
            </Text>
          </View>
        )}

        {!currentUri && !isRecording && (
          <Text style={styles.infoText}>
            Appuyez sur le bouton pour enregistrer votre voix
          </Text>
        )}

        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>Enregistrement en cours...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 40,
  },
  iconButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordButton: {
    backgroundColor: '#0f766e',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 20,
  },
  recordButtonActive: {
    backgroundColor: '#dc2626',
  },
  recordButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uriContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  uriLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0f766e',
  },
  uriText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#dc2626',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: 'bold',
  },
});
