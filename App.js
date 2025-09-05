import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet  } from 'react-native';
import LoginScreen from './components/LoginScreen';
import FacialRecognition from './components/FacialRecognition';
import RegisterScreen from './components/RegisterScreen';

export default function App() {
  const [showCamera, setShowCamera] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerCuil, setRegisterCuil] = useState(null);

  const handleStartFacialLogin = () => {
    setShowCamera(true);
    setRegisterCuil(null); 
  };

  const handleStartFacialRegister = (cuil) => {
    setRegisterCuil(cuil);
    setShowRegister(false);
    setShowCamera(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowCamera(false);
    setShowRegister(false);
    setRegisterCuil(null);
  };

  const handleCancel = () => {
    setShowCamera(false);
    setShowRegister(false);
    setRegisterCuil(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowCamera(false);
    setShowRegister(false);
    setRegisterCuil(null);
  };

  const handleNavigateToRegister = () => {
    setShowRegister(true);
    setShowCamera(false);
    setRegisterCuil(null);
  };

  return (
    <View style={styles.container}>
      {!showCamera && !isAuthenticated && !showRegister && (
        <LoginScreen 
          onStartFacialLogin={handleStartFacialLogin} 
          onNavigateToRegister={handleNavigateToRegister}
        />
      )}
      
      {showCamera && !isAuthenticated && (
        <FacialRecognition 
          mode={registerCuil ? 'register' : 'login'}
          cuil={registerCuil}
          onAuthSuccess={handleAuthSuccess}
          onCancel={handleCancel}
        />
      )}

      {showRegister && !isAuthenticated && (
        <RegisterScreen
          onStartFacialRegister={handleStartFacialRegister}
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
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});