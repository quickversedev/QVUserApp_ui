// import {
//   Alert,
//   PermissionsAndroid,
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect} from 'react';
// import {
//   check,
//   openSettings,
//   PERMISSIONS,
//   request,
//   RESULTS,
// } from 'react-native-permissions';

// const PermissionsScreen = () => {
//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'ios') {
//       const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
//       if (status === RESULTS.GRANTED) {
//         console.log('Location permission granted.');
//       } else {
//         console.log('Location permission denied.');
//       }
//     } else if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('Location permission granted.');
//       } else {
//         console.log('Location permission denied.');
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         onPress={requestLocationPermission}
//         style={styles.buttonContainer}>
//         <Text style={{color: '#000'}}>Ask Location permission</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default PermissionsScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   buttonContainer: {
//     width: '50%',
//     borderColor: '#888',
//     borderWidth: 1,
//     alignItems: 'center',
//     borderRadius: 50,
//     paddingVertical: 10,
//   },
// });
// function checkLocationPermission() {
//   throw new Error('Function not implemented.');
// }
import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

interface PermissionsScreenProps {
  onSkip: () => void;
  onRequestPermission: () => void;
}

const PermissionsScreen: React.FC<PermissionsScreenProps> = ({
  onSkip,
  onRequestPermission,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Permission Required</Text>
      <Text style={styles.description}>
        This app needs location permissions to provide you with the best
        experience.
      </Text>

      <Button title="Allow Location Access" onPress={onRequestPermission} />

      <Button title="Skip for Now" onPress={onSkip} color="#cccccc" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default PermissionsScreen;
