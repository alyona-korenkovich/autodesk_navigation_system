module.exports = {
  mode: 'production',
  optimization: {
    splitChunks: { chunks: 'all' },
  },
};

const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, '../src'),
  mode: 'production',
  optimization: {
    splitChunks: { chunks: 'all' },
  },
  entry: './index.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss', '.css'],
  },
  output: {
    filename: 'assets/js/[name].[contenthash:8].js',
    chunkFilename: 'assets/js/[name].[contenthash:8].js',
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
    }),
    new CleanWebpackPlugin(),
    new ESLintPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'singletonStyleTag',
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.svg$/,
        use: ['svg-url-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|jp2|webp|pdf)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(xml)$/,
        use: ['xml-loader'],
      },
      {
        test: /\.(csv)$/,
        use: ['csv-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};
