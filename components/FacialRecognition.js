import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const API_URL = 'https://ixk9cqrvwl5t.share.zrok.io';

export default function FacialRecognition({ mode, cuil, onAuthSuccess, onCancel }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Permisos de Cámara</Text>
        <Text style={styles.permissionText}>
          Necesitamos acceso a tu cámara para el reconocimiento facial.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Otorgar Permisos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleTakePicture = async () => {
    if (isProcessing || !cameraRef.current) return;
    
    setIsProcessing(true);
    
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: false });
      
      const formData = new FormData();
      const uriParts = photo.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('image', {
        uri: photo.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      let endpoint = '';
      if (mode === 'register') {
        if (!cuil) {
          throw new Error('El CUIL es requerido para el registro.');
        }
        formData.append('cuil', cuil);
        endpoint = `${API_URL}/register`;
      } else {
        endpoint = `${API_URL}/recognize`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'skip_zrok_interstitial': 'true', 
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Alert.alert('¡Éxito!', mode === 'register' ? 'Rostro registrado correctamente.' : 'Login exitoso.', [
          { text: 'OK', onPress: onAuthSuccess }
        ]);
      } else {
        throw new Error(result.message || 'No se pudo reconocer el rostro.');
      }

    } catch (error) {
      console.error('Error en el proceso facial:', error);
      Alert.alert('Error', error.message || 'Ocurrió un problema. Intenta nuevamente.', [
        { text: 'Reintentar', onPress: () => setIsProcessing(false) },
        { text: 'Cancelar', onPress: onCancel, style: 'cancel' }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera}
        facing="front"
        ref={cameraRef}
      />
      
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.instruction}>
            {isProcessing ? 'Procesando...' : 'Posiciona tu rostro en el círculo'}
          </Text>
        </View>

        <View style={styles.scanArea}>
          <View style={styles.faceFrame} />
        </View>

        <View style={styles.buttonContainer}>
          {isProcessing ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <>
              <TouchableOpacity style={styles.scanButton} onPress={handleTakePicture}>
                <Text style={styles.scanButtonText}> Capturar y {mode === 'register' ? 'Registrar' : 'Acceder'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}> Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#fff',
    },
    permissionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    permissionText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 30,
    },
    permissionButton: {
      backgroundColor: '#2196F3',
      paddingHorizontal: 30,
      paddingVertical: 15,
      borderRadius: 25,
      marginBottom: 15,
    },
    permissionButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    camera: {
      flex: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
    },
    header: {
      paddingTop: 60,
      alignItems: 'center',
    },
    instruction: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    scanArea: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    faceFrame: {
      width: 280,
      height: 350,
      borderRadius: 150,
      borderWidth: 4,
      borderColor: 'white',
      borderStyle: 'dashed',
    },
    buttonContainer: {
      paddingBottom: 50,
      paddingHorizontal: 20,
      minHeight: 150,
      justifyContent: 'center',
    },
    scanButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 18,
      borderRadius: 30,
      marginBottom: 15,
    },
    scanButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    cancelButton: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingVertical: 15,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: 'white',
    },
    cancelButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
});