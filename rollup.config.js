import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sass from 'rollup-plugin-sass';
import uglify from 'rollup-plugin-uglify';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  plugins: [
    resolve(),
    sass({
      output: 'public/bundle.css',
      options: {
        outputStyle: production ? 'compressed' : 'expanded'
      }
    }),
    commonjs(),
    production && uglify() 
  ],

  output: {
		file: 'public/bundle.js',
		format: 'iife',
		sourcemap: true
	}
};