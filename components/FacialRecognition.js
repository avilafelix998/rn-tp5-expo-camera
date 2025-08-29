import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function FacialRecognition({ onAuthSuccess, onCancel }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const cameraRef = useRef(null);

  // Si los permisos aún están cargando
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando permisos de cámara...</Text>
      </View>
    );
  }

  // Si no se han otorgado permisos
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Permisos de Cámara</Text>
          <Text style={styles.permissionText}>
            Necesitamos acceso a tu cámara para el reconocimiento facial
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Otorgar Permisos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const simulateFacialRecognition = async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    let timeLeft = 3;
    setCountdown(timeLeft);
    
    const countdownInterval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        setIsScanning(false);
        
        const success = Math.random() > 0.1;
        
        if (success) {
          Alert.alert(
            '¡Éxito!', 
            'Reconocimiento facial completado',
            [
              {
                text: 'Continuar',
                onPress: onAuthSuccess
              }
            ]
          );
        } else {
          Alert.alert(
            'Error',
            'No se pudo reconocer el rostro. Intenta nuevamente.',
            [
              {
                text: 'Reintentar',
                onPress: () => setCountdown(0)
              },
              {
                text: 'Cancelar',
                onPress: onCancel
              }
            ]
          );
        }
      }
    }, 1000);
  };

  const onCameraReady = () => {
    console.log('Cámara lista');
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera}
        facing="front"
        onCameraReady={onCameraReady}
        ref={cameraRef}
      />
      
      {/* Overlay posicionado de forma absoluta */}
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.instruction}>
            {isScanning 
              ? `Escaneando... ${countdown}` 
              : 'Posiciona tu rostro en el círculo'
            }
          </Text>
        </View>

        <View style={styles.scanArea}>
          <View style={[
            styles.faceFrame, 
            isScanning && styles.faceFrameScanning
          ]}>
            {isScanning && (
              <View style={styles.scannerLine} />
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {!isScanning && (
            <>
              <TouchableOpacity 
                style={styles.scanButton} 
                onPress={simulateFacialRecognition}
              >
                <Text style={styles.scanButtonText}>📸 Escanear Rostro</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={onCancel}
              >
                <Text style={styles.cancelButtonText}>❌ Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
          
          {isScanning && (
            <View style={styles.scanningContainer}>
              <Text style={styles.scanningText}>
                Manténte inmóvil mientras escaneamos tu rostro...
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#666',
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
    color: '#333',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22,
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  instruction: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
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
    width: 250,
    height: 300,
    borderRadius: 125,
    borderWidth: 4,
    borderColor: 'white',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  faceFrameScanning: {
    borderColor: '#4CAF50',
    borderStyle: 'solid',
  },
  scannerLine: {
    width: '80%',
    height: 2,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    top: '50%',
    left: '10%',
  },
  buttonContainer: {
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 30,
    marginBottom: 15,
    elevation: 3,
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
  scanningContainer: {
    alignItems: 'center',
  },
  scanningText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
  },
});