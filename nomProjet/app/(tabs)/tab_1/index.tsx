import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { updateStudent } from '../../../store/studentSlice';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>('off');
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef<CameraView>(null);
  
  const backgroundColor = useAppSelector((state) => state.student.color);
  const dispatch = useAppDispatch();

  if (!permission) {
    return <View style={[styles.container, { backgroundColor }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={styles.message}>Permission caméra requise</Text>
        <Button onPress={requestPermission} title="Autoriser la caméra" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function toggleFlash() {
    setFlash(current => current === 'off' ? 'on' : 'off');
  }

  function increaseZoom() {
    setZoom(current => Math.min(current + 0.1, 1));
  }

  function decreaseZoom() {
    setZoom(current => Math.max(current - 0.1, 0));
  }

  async function takePicture() {
    if (!cameraRef.current) {
      Alert.alert('Erreur', 'Caméra non prête');
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      
      if (photo && photo.uri) {
        // Sauvegarder l'URI de la photo directement dans le store Redux
        // La photo est automatiquement sauvegardée dans le cache de l'app
        dispatch(updateStudent({ image: photo.uri }));
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', `Impossible de prendre la photo: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
        flash={flash}
        zoom={zoom}
      >
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
            <Ionicons 
              name={flash === 'off' ? 'flash-off' : 'flash'} 
              size={32} 
              color="white" 
            />
          </TouchableOpacity>
          
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.iconButton} onPress={increaseZoom}>
              <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
            <Text style={styles.zoomText}>{Math.round(zoom * 10)}x</Text>
            <TouchableOpacity style={styles.iconButton} onPress={decreaseZoom}>
              <Ionicons name="remove" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={32} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <View style={styles.flipButton} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  zoomControls: {
    alignItems: 'center',
  },
  zoomText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
    paddingBottom: 40,
  },
  iconButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
  },
  flipButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'white',
  },
});
