const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const config = require('./config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

const cssBaseExtractor =  new ExtractTextPlugin('css/base.css');

console.log('environment: ' + config.env);

const strips = config.env == 'production' ?  [
    'console.log',
    'console.info',
    'console.warn',
    'console.error',
    'console.assert'
  ] : [];

let webpackConfig = {
  context: path.resolve(__dirname, config.srcDir),
  entry: { },
  output: {
    path: path.resolve(__dirname, config.dstDir),
    publicPath: config.publicPath,
    filename: '[name]',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              postcss: [require('autoprefixer')(config.autoprefixerOption)],
              cssModules: {
                localIdentName: '[path][name]--[hash:base64:5]',
                camelCase: true
              },
              loaders: {
                sass: 'vue-style-loader!css-loader!sass-loader?'+
                    '{"includePaths":["src"]}'
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: [
          /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//
        ],
        use: [
          {
            loader: 'babel-loader',
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, config.srcDir + 'css'),
        use: cssBaseExtractor.extract({
          use: [
            { loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')(config.autoprefixerOption)
                ]
              }
            },
            { loader: 'sass-loader' },
          ]
        })
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf|png|jpg)$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, config.srcDir + 'css'),
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: config.assetsDir + '[name].[hash].[ext]',
              context: path.resolve(__dirname, config.srcDir),
              path: config.publicPath
            },
          },
        ]
      },
      {
        test: /\.(ico)$/,
        exclude: [
          /node_modules/,
        ],
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      Scss: path.resolve(__dirname, config.srcDir, 'css/'),
      css: path.resolve(__dirname, config.srcDir, 'css/'),
      vue$: 'vue/dist/vue.esm.js',
    },
    modules: [
      path.resolve(__dirname, config.srcDir, 'js/'),
      path.resolve(__dirname, config.srcDir),
      'node_modules'
    ]
  },
  devServer: {
    inline: true,
    hot: true,
    publicPath: config.publicPath,
    contentBase: config.dstDir,
    headers: { "Access-Control-Allow-Origin": "*" },
    historyApiFallback: {
      index: config.publicPath
    }
  },
  devtool: config.env != 'production' ? '#inline-source-map' : false,
  node: {
    fs: 'empty'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(config.env),
      VERSION: JSON.stringify(config.version),
      PushSenderId: JSON.stringify(config.pushSenderId),
      EnablePush: JSON.stringify(config.enablePush),
      ApiEntry: JSON.stringify('https://karuru.info/kmv/api/'),
      PublicPath: JSON.stringify(config.publicPath)
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.HotModuleReplacementPlugin(),
    cssBaseExtractor,
    new HtmlWebpackExcludeAssetsPlugin()
  ],
}

const pages = [
  "index",
];

pages.forEach( page => {
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, config.srcDir, 'html/index.html'),
        filename: `${page}.html`,
        "files": {
          "js": [`js/${page}.js`]
        },
        //excludeAssets: [/.*\.css/]
        //inject: false,
      })
    );
    webpackConfig.entry[`js/${page}.js`] = `./js/pages/${page}.js`;
});

if(config.env == 'production'){
  webpackConfig['plugins'].push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  );
}

module.exports = webpackConfig;
