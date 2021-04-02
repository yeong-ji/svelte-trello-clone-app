import path from 'path'
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import alias from "@rollup/plugin-alias";
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import globals from "rollup-plugin-node-globals";
import builtins from 'rollup-plugin-node-builtins';
import replace from "rollup-plugin-replace";
import css from 'rollup-plugin-css-only';
import sveltePreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			},
			preprocess: sveltePreprocess({
				//svelte 컴퍼넌트를 전처리 할 때 scss가 있다면 prependData가 실행됨
				scss: {
					prependData: '@import "./src/scss/main.scss";'
				},
				postcss: {
					plugins: [
						require('autoprefixer')()
					]
				}
			})
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		replace({
			values: {
				//key - value를 모두 문자형태로
				'crypto.randomBytes': 'require("randombytes")'
			}
		}),
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		//resolve 부터 외부모듈이 번들에 포함되기 시작한다.
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		globals(),
		builtins(),

		//경로 별칭 지정하기
		alias({
			entries: [
				{
					find: '~', replacement: path.resolve(__dirname, 'src/'),
				}
			]
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
