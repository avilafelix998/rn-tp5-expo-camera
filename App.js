import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import LoginScreen from './components/LoginScreen';
import FacialRecognition from './components/FacialRecognition';
import ProductManagementScreen from './components/ProductManagementScreen'; 

export default function App() {
  const [showCamera, setShowCamera] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [products, setProducts] = useState([
    { id: '1', name: 'Producto de Ejemplo 1', code: '9780201379624' },
    { id: '2', name: 'Producto de Ejemplo 2', code: '9780321125217' },
  ]);

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

  const handleAddProduct = (scannedCode) => {
    if (products.some(p => p.code === scannedCode)) {
      Alert.alert('Error', 'Este producto ya existe en la lista.');
      return;
    }
    const newProduct = {
      id: Date.now().toString(), // ID único basado en el timestamp
      name: `Nuevo Producto ${products.length + 1}`,
      code: scannedCode,
    };
    setProducts(prevProducts => [...prevProducts, newProduct]);
    Alert.alert('Éxito', `Producto con código ${scannedCode} agregado.`);
  };

  const handleUpdateProduct = (productId, newName) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === productId ? { ...p, name: newName } : p))
    );
    Alert.alert('Éxito', 'El nombre del producto ha sido actualizado.');
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    Alert.alert('Éxito', 'El producto ha sido eliminado.');
  };

  const renderContent = () => {
    if (isAuthenticated) {
      return (
        <ProductManagementScreen
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onLogout={handleLogout}
        />
      );
    }
    if (showCamera) {
      return (
        <FacialRecognition 
          onAuthSuccess={handleAuthSuccess}
          onCancel={handleCancel}
        />
      );
    }
    return <LoginScreen onStartFacialLogin={handleStartFacialLogin} />;
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});