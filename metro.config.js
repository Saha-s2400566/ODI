const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
const rnScreensLib = path.resolve(__dirname, 'node_modules/react-native-screens/lib/commonjs/index.js');

config.resolver = {
  ...(config.resolver || {}),
  resolveRequest: (context, moduleName, platform, ...rest) => {
    if (moduleName === 'react-native-screens') {
      return context.resolveRequest(context, rnScreensLib, platform, ...rest);
    }

    return context.resolveRequest(context, moduleName, platform, ...rest);
  },
};

module.exports = config;
