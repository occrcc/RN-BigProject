import { AppRegistry } from 'react-native';
import App from './Pages/Componnet/root';

import './common/GlobalContants'
import './Pages/RNAsyncStorage'

import { Sentry } from 'react-native-sentry';
Sentry.config('https://3afcf1e575c54a29b4f0d266d94db924:d3a86f10b6194dd5b5ecd014e4161bdb@sentry.io/1187679').install();

AppRegistry.registerComponent('ejiaren_app', () => App);
