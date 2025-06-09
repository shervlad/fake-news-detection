const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',
    entry: {
      background: './background/background.js',
      content: './content/content.js',
      popup: './popup/popup.js',
      options: './options/options.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name]/[name].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'manifest.json' },
          { from: 'images', to: 'images' },
          { from: 'content/content.css', to: 'content' }
        ]
      }),
      new HtmlWebpackPlugin({
        template: './popup/popup.html',
        filename: 'popup/popup.html',
        chunks: ['popup']
      }),
      new HtmlWebpackPlugin({
        template: './options/options.html',
        filename: 'options/options.html',
        chunks: ['options']
      }),
      new MiniCssExtractPlugin({
        filename: '[name]/[name].css'
      }),
      ...(isProduction ? [
        new ZipPlugin({
          filename: 'fake-news-detector-extension.zip'
        })
      ] : [])
    ],
    optimization: {
      minimize: isProduction
    }
  };
};

