// // import {
// //   Alert,
// //   PermissionsAndroid,
// //   Platform,
// //   StyleSheet,
// //   Text,
// //   TouchableOpacity,
// //   View,
// // } from 'react-native';
// // import React, {useEffect} from 'react';
// // import {
// //   check,
// //   openSettings,
// //   PERMISSIONS,
// //   request,
// //   RESULTS,
// // } from 'react-native-permissions';

// // const PermissionsScreen = () => {
// //   const requestLocationPermission = async () => {
// //     if (Platform.OS === 'ios') {
// //       const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
// //       if (status === RESULTS.GRANTED) {
// //         console.log('Location permission granted.');
// //       } else {
// //         console.log('Location permission denied.');
// //       }
// //     } else if (Platform.OS === 'android') {
// //       const granted = await PermissionsAndroid.request(
// //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //       );
// //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
// //         console.log('Location permission granted.');
// //       } else {
// //         console.log('Location permission denied.');
// //       }
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <TouchableOpacity
// //         onPress={requestLocationPermission}
// //         style={styles.buttonContainer}>
// //         <Text style={{color: '#000'}}>Ask Location permission</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // export default PermissionsScreen;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#fff',
// //   },
// //   buttonContainer: {
// //     width: '50%',
// //     borderColor: '#888',
// //     borderWidth: 1,
// //     alignItems: 'center',
// //     borderRadius: 50,
// //     paddingVertical: 10,
// //   },
// // });
// // function checkLocationPermission() {
// //   throw new Error('Function not implemented.');
// // }
// import React from 'react';
// import {View, Text, StyleSheet, Button} from 'react-native';

// interface PermissionsScreenProps {
//   onSkip: () => void;
//   onRequestPermission: () => void;
// }

// const PermissionsScreen: React.FC<PermissionsScreenProps> = ({
//   onSkip,
//   onRequestPermission,
// }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Location Permission Required</Text>
//       <Text style={styles.description}>
//         This app needs location permissions to provide you with the best
//         experience.
//       </Text>

//       <Button title="Allow Location Access" onPress={onRequestPermission} />

//       <Button title="Skip for Now" onPress={onSkip} color="#cccccc" />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   description: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 30,
//   },
// });

// export default PermissionsScreen;
import {RouteProp} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const {height} = Dimensions.get('window');

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
      <ImageBackground
        source={require('../../assets/images/bg_1.png')}
        style={styles.topBackground}
        resizeMode="cover"
      />

      <View style={styles.logoContainer}>
        <Image
          style={styles.topLogo}
          source={require('../../assets/images/logo_qv.png')}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitle}>
          // This app needs location permissions to provide you with the best //
          experience. //{' '}
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={onRequestPermission}>
          <Text style={styles.permissionText}>Give Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipContainer} onPress={onSkip}>
          <Text style={{color: '#E5E7EB', fontSize: 14}}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PermissionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  topBackground: {
    height: height * 0.6,
    width: '100%',
    position: 'absolute',
    top: -80,
  },
  logoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 70,
  },
  topLogo: {width: 90, objectFit: 'contain'},

  card: {
    width: '90%',
    // height: '20%',
    marginTop: 100,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'yellow',
    shadowColor: '#FAE588',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 22,
    color: '#F3F4F6',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 5,
    marginBottom: 16,
  },

  skipContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#4B5563',
    alignSelf: 'center',
    marginRight: 16,
    marginTop: 16,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Shadow for Android
    elevation: 3,
  },

  // button
  permissionButton: {
    backgroundColor: '#FFE885',
    borderRadius: 8,
    paddingVertical: 14,
    // marginTop: "auto",
  },
  permissionText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});
