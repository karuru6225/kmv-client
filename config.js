let env = process.env.NODE_ENV || 'develop';

if(env == 'prod'){
  env = 'production';
}

let config = {
  env,
  srcDir: 'src/',
  dstDir: 'dst/',
  assetsDir: 'assets/',
  version: '0.0.1',
  publicPath: '/kmv/',
};

module.exports = config;
