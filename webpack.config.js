const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/content.js',
  devtool: "eval-source-map",
  watch: true,
  output: {
    filename: 'content.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    // new CleanWebpackPlugin({
    //   root: path.resolve(__dirname, './dist')
    // }),
    new CopyWebpackPlugin([
      { from: './manifest.json', to: './' },
      { from: './style.css', to: './' },
      { from: './popup.html', to: './' },
      { from: './icon.png', to: './' },
      { from: './src/popup.js', to: './' },
    ]),
  ]
};