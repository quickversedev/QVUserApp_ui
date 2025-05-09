import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ProfileScreen: React.FC = () => {
  const handleEditProfile = () => {
    // Handle edit profile action
    console.log('Edit Profile Pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profileContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>John Doe</Text>
      </View>
      <View style={styles.profileContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>johndoe@example.com</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  value: {
    color: '#555',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
