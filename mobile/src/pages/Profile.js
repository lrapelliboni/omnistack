import React from 'react';
//import { View } from 'react-native';
import { WebView } from 'react-native-webview';

// navigation property is injected automatically by 'createStackNavigator' in routes.js
const Profile = ({ navigation }) => {
  const githubUsername = navigation.getParam('github_username')
  return <WebView source={{ uri: `https://github.com/${githubUsername}` }} style={{ flex: 1 }} />
}

export default Profile; 