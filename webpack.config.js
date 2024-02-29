/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const envPlugin = require('./plugins/envPlugin');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: './src/index.ts',
  bail: true, // exit if it fk's up
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'micro-ui.js'
  },
  devServer: {
    open: true,
    host: 'localhost',
    port: 9090,
    hot: true,
    watchFiles: ['src/**/*.ts'],
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: 'sdk.js' }
      ]
    }
  },
  devtool: 'source-map',
  plugins: [envPlugin],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
        options: {
          transpileOnly: true // enables builds to be faster
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
    config.plugins.push(new ForkTsCheckerWebpackPlugin()); // performs type checks on bundle
  }
  return config;
};
