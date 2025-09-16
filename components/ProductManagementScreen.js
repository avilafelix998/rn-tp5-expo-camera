import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import BarcodeScannerScreen from './BarcodeScannerScreen';

export default function ProductManagementScreen({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onLogout }) {
  const [view, setView] = useState('list'); // 'list', 'scanner', 'edit'
  const [editingProduct, setEditingProduct] = useState(null);
  const [tempName, setTempName] = useState('');

  const handleScanSuccess = (scannedData) => {
    onAddProduct(scannedData);
    setView('list'); 
  };
  
  const startEditing = (product) => {
    setEditingProduct(product);
    setTempName(product.name);
    setView('edit');
  };

  const confirmDelete = (product) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de que quieres eliminar "${product.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => onDeleteProduct(product.id), style: 'destructive' },
      ]
    );
  };
  
  const saveChanges = () => {
    if (tempName.trim() === '') {
        Alert.alert('Error', 'El nombre del producto no puede estar vacío.');
        return;
    }
    onUpdateProduct(editingProduct.id, tempName);
    setView('list');
    setEditingProduct(null);
  };

  if (view === 'scanner') {
    return (
      <BarcodeScannerScreen
        onScanSuccess={handleScanSuccess}
        onCancel={() => setView('list')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Productos</Text>
        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productCode}>Código: {item.code}</Text>
            </View>
            <View style={styles.productActions}>
              <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => startEditing(item)}>
                <Text style={styles.actionButtonText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => confirmDelete(item)}>
                <Text style={styles.actionButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyList}>No hay productos en la lista.</Text>}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setView('scanner')}>
        <Text style={styles.addButtonText}>+ Agregar Producto por Código</Text>
      </TouchableOpacity>

      {/* Modal para editar producto */}
      <Modal
        visible={view === 'edit'}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setView('list')}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Producto</Text>
            <TextInput
              style={styles.input}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Nombre del producto"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelModalButton]} onPress={() => setView('list')}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveModalButton]} onPress={saveChanges}>
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  logoutText: { fontSize: 16, color: '#007AFF' },
  addButton: { backgroundColor: '#007AFF', padding: 18, margin: 20, borderRadius: 10, alignItems: 'center' },
  addButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  productItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, marginVertical: 8, marginHorizontal: 20, borderRadius: 10, elevation: 2 },
  productInfo: { flex: 1 },
  productName: { fontSize: 18, fontWeight: '600' },
  productCode: { fontSize: 14, color: '#666', marginTop: 4 },
  productActions: { flexDirection: 'row' },
  actionButton: { padding: 10, borderRadius: 5, marginLeft: 10 },
  editButton: { backgroundColor: '#FFC107' },
  deleteButton: { backgroundColor: '#F44336' },
  actionButtonText: { fontSize: 16 },
  emptyList: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
  // Estilos del Modal
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '85%', backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 5, fontSize: 16, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, marginLeft: 10 },
  saveModalButton: { backgroundColor: '#4CAF50' },
  cancelModalButton: { backgroundColor: '#aaa' },
  modalButtonText: { color: 'white', fontWeight: 'bold' },
});