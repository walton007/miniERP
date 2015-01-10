var assetmanager = require('assetmanager');

var assets = assetmanager.process({
    assets: require('./config/assets.json'),
    debug: process.env.NODE_ENV !== 'production',
    webroot: /public\/|packages\//g,
    cachebust: false,
  });

console.log('assets:', assets);