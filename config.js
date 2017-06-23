let env = process.env.NODE_ENV || 'develop';

let enablePush = false;
switch(env){
  case 'develop':
  case 'staging':
    enablePush = true;
}

if(env == 'prod'){
  env = 'production';
}

let config = {
  pushSenderId: "012345678901",
  enablePush,
  env,
  srcDir: 'src/',
  dstDir: 'dst/',
  assetsDir: 'assets/',
  version: '0.0.1',
  publicPath: '/kmv/',
  autoprefixerOption: {
    browsers: ['last 2 versions']
  },
};

module.exports = config;
