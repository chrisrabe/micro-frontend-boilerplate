/* eslint-disable @typescript-eslint/no-var-requires */

// Note:
// This injects env variables to the bundle in PLAIN TEXT
// ONLY PUT PUBLICLY ACCESSIBLE VALUES

const dotenv = require('dotenv');
const { DefinePlugin } = require('webpack');

dotenv.config();

const env = Object.keys(process.env).reduce((acc, key) => {
  acc[`process.env.${key}`] = JSON.stringify(process.env[key]);
  return acc;
}, {});

module.exports = new DefinePlugin(env);
