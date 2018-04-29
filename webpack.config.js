const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const config = require('./config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

const cssBaseExtractor =  new ExtractTextPlugin('css/base.css');
const cssModuleExtractor = new ExtractTextPlugin('css/modules.css');

console.log('environment: ' + config.env);

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
        enforce: "pre",
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          configFile: './.eslintrc.js',
        }
      },
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        include: path.resolve(__dirname, config.srcDir + 'js'),
        use: [
          { loader: 'babel-loader' },
        ],
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
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' },
          ]
        })
      },
      {
        test: /\.scss$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, config.srcDir + 'css')
        ],
        use: cssModuleExtractor.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                minimize: true,
              }

            },
            { loader: 'postcss-loader' },
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
    // host: '0.0.0.0',
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
      APPNAME: JSON.stringify('kmv'),
      API_ENTRY: JSON.stringify('https://karuru.info/kmv/api/'),
      PUBLIC_PATH: JSON.stringify(config.publicPath)
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.HotModuleReplacementPlugin(),
    cssBaseExtractor,
    cssModuleExtractor,
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
    webpackConfig.entry[`./js/${page}.js`] = `./js/${page}.jsx`;
});

if(config.env == 'production'){
  webpackConfig['plugins'].push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  );
}

module.exports = webpackConfig;
