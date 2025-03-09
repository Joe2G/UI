import React from 'react';
import { Modal, View, StyleSheet, Alert } from 'react-native';
import useAppStore from '../stores/appStore';

export default function CustomModal() {
  const { modal, hideModal, user } = useAppStore();

  const handleRequestClose = () => {
    if (!user || !user.username) {
      Alert.alert("Username Required", "You must enter a username to continue.");
    } else {
      hideModal();
    }
  };

  return (
    <Modal
      visible={modal.visible}
      transparent
      animationType="slide"
      onRequestClose={handleRequestClose}
    >
      <View style={[styles.centeredView, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
        <View style={[styles.modalView, { elevation: 5 }]}>
          {modal.content}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});