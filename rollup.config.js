// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'blargh.js',
  output: {
    file: 'dist/blargh.js',
    format: 'iife'
  },
  name: 'blargh',
  plugins: [
    resolve({
      // use "jsnext:main" if possible
      // – see https://github.com/rollup/rollup/wiki/jsnext:main
      jsnext: true,  // Default: false
      browser: true,  // Default: false
    })
  ]
};
