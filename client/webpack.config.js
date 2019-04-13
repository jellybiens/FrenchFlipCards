var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: './dev/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/bundle.min.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          }
        ]
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [{
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader', 'sass-loader'
        ]
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: 'css/style.css'
    }),
    new HtmlWebpackPlugin({
      template: './dev/template.html'
    })

  ]

}
