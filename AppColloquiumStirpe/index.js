import {AppRegistry} from 'react-native';
import App from './src/pages/App';
import {name as appName} from './app.json';
import React from 'react';

AppRegistry.registerComponent(appName, () => () => <App />);
