import React, { useState, useEffect } from 'react';
//import { View } from 'react-native';
import MapView, { Marker, Callout }from 'react-native-maps';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';

// navigation property is injected automatically by 'createStackNavigator' in routes.js
const Main = ({ navigation }) => {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [devs, setDevs] = useState([]);
  const [techs, setTechs] = useState('');

  useEffect(() => {
    async function loadAsyncPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;
        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        });
      }
    }
    loadAsyncPosition();
  }, []);

  const handleRegionChanged = (region) => {
    console.log(region);
    setCurrentRegion(region);
  }

  const loadDevs = async () => {
    const { latitude, longitude } = currentRegion;
    const response = await api.get('search', {
      params: {
        latitude,
        longitude,
        techs
      }
    });
    setDevs(response.data);
  }

  if (!currentRegion) {
    return null; 
  }
  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChanged}
        style={style.map}
        initialRegion={currentRegion}
      >
        {
          devs.map(dev => (
            <Marker
              key={dev._id}
              coordinate={{
                latitude: dev.location.coordinates[1], 
                longitude: dev.location.coordinates[0]
              }}
            >
              <Image style={style.avatar} source={{
                uri: dev.avatar_url
              }} />
              <Callout onPress={() => {
                navigation.navigate('Profile', {
                  github_username: dev.github_username
                });
              }}>
                <View style={style.callout}>
                  <Text style={style.devName}>{dev.name}</Text>
                  <Text style={style.devBio}>{dev.bio}</Text>
                  <Text style={style.devTechs}>{dev.techs.join(',')}</Text>
                </View>
              </Callout>
            </Marker>
          ))
        }
      </MapView>
      <View style={style.searchForm}>
          <TextInput 
            style={style.searchInput}
            placeholder="Buscar devs por tecnologias..."
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
            value={techs}
            onChangeText={ (text) => setTechs(text)}
          />
          <TouchableOpacity onPress={loadDevs} style={style.loadButton}>
            <MaterialIcons name="my-location" size={20} color="#FFF" />
          </TouchableOpacity>
      </View>
    </>
  );
}

const style = StyleSheet.create({
  map: {
      flex: 1
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#FFF'
  },
  callout: {
    width: 260
  },
  devName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  devBio: {
    color:'#666',
    marginTop: 5
  },
  devTechs: {
    marginTop: 5 
  },
  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row'
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2
  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8E4DFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  }
});

export default Main;