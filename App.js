import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import LoginScreen from './components/LoginScreen';
import FacialRecognition from './components/FacialRecognition';

export default function App() {
  const [showCamera, setShowCamera] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleStartFacialLogin = () => {
    setShowCamera(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowCamera(false);
  };

  const handleCancel = () => {
    setShowCamera(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowCamera(false);
  };

  return (
    <View style={styles.container}>
      {!showCamera && !isAuthenticated && (
        <LoginScreen onStartFacialLogin={handleStartFacialLogin} />
      )}
      
      {showCamera && !isAuthenticated && (
        <FacialRecognition 
          onAuthSuccess={handleAuthSuccess}
          onCancel={handleCancel}
        />
      )}
      
      {isAuthenticated && (
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>¡Bienvenido!</Text>
          <Text style={styles.successSubtitle}>Login exitoso con reconocimiento facial</Text>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});