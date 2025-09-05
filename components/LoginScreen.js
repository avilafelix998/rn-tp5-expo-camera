
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ onStartFacialLogin, onNavigateToRegister }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>
            Accede a tu cuenta de forma segura.
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.faceIcon}>
            <Text style={styles.faceEmoji}>👤</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={onStartFacialLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Ingresar con Rostro</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={onNavigateToRegister}
        >
          <Text style={styles.registerButtonText}>
            ¿No tienes cuenta? Registra tu rostro
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  iconContainer: {
    marginBottom: 50,
  },
  faceIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2196F3',
  },
  faceEmoji: {
    fontSize: 50,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 3,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 25,
    padding: 10,
  },
  registerButtonText: {
    color: '#2196F3',
    fontSize: 15,
    fontWeight: '600',
  },
});