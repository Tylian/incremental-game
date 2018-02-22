import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sass from 'rollup-plugin-sass';
import jsx from 'rollup-plugin-jsx';
import uglify from 'rollup-plugin-uglify';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  plugins: [
    jsx({
      include: ['**/*.js', '**.*.jsx'],
      factory: 'h'
    }),
    commonjs(),
    resolve(),
    sass({
      include: '**/*.scss',
      output: 'public/bundle.css',
      options: {
        outputStyle: production ? 'compressed' : 'expanded'
      }
    }),
    production && uglify() 
  ],

  output: {
		file: 'public/bundle.js',
		format: 'iife',
		sourcemap: true
	}
};