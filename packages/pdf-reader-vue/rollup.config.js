import vue from 'rollup-plugin-vue'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import commonjs from 'rollup-plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import css from 'rollup-plugin-css-only'
import filesize from 'rollup-plugin-filesize'
import minimist from 'minimist'

import pkg from './package.json'

const argv = minimist(process.argv.slice(2))

const baseConfig = {
	input: 'src/index.js',
	plugins: {
		preVue: [
			replace({
				'process.env.NODE_ENV': JSON.stringify('production'),
				preventAssignment: true
			}),
			css({
				output: pkg.style
			})
		],
		vue: {
			css: true,
			template: {
				isProduction: true
			}
		},
		postVue: [babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      presets: ['@babel/env', '@babel/preset-react'],
    }), commonjs(),filesize()]
	}
}

// Customize configs for individual targets
const buildFormats = []
if (!argv.format || argv.format === 'es') {
	const esConfig = {
		...baseConfig,
		output: {
			file: pkg.module,
			format: 'esm',
			exports: 'named',
			sourcemap: true
		},
		plugins: [
			...baseConfig.plugins.preVue,
			vue({
				...baseConfig.plugins.vue,
				css: false
			}),
			...baseConfig.plugins.postVue,
			terser({
				output: {
					ecma: 6
				}
			}),
			resolve()
		]
	}
	buildFormats.push(esConfig)
}

if (!argv.format || argv.format === 'cjs') {
	const umdConfig = {
		...baseConfig,
		output: {
			compact: true,
			file: pkg.main,
			format: 'cjs',
			name: 'VuePlyr',
			exports: 'named',
			sourcemap: true
		},
		plugins: [
			...baseConfig.plugins.preVue,
			vue({
				...baseConfig.plugins.vue,
				template: {
					...baseConfig.plugins.vue.template,
					optimizeSSR: true
				},
				css: false
			}),
			...baseConfig.plugins.postVue,
			resolve()
		]
	}
	buildFormats.push(umdConfig)
}

if (!argv.format || argv.format === 'iife') {
	const unpkgConfig = {
		...baseConfig,
		output: {
			compact: true,
			file: pkg.unpkg,
			format: 'iife',
			name: 'VuePlyr',
			sourcemap: true
		},
		plugins: [
			...baseConfig.plugins.preVue,
			vue(baseConfig.plugins.vue),
			...baseConfig.plugins.postVue,
			terser({
				output: {
					ecma: 5
				}
			}),
			resolve()
		]
	}
	buildFormats.push(unpkgConfig)
}

const copy = obj => {
	if (!obj) {
		return obj
	}

	let v
	let copied = Array.isArray(obj) ? [] : {}
	for (const k in obj) {
		v = obj[k]
		copied[k] = typeof v === 'object' ? copy(v) : v
	}

	return copied
}

if (!argv.format) {
	buildFormats.forEach(format => {
		const polyfilled = copy(format)
		polyfilled.output.file = format.output.file.replace(
			/vue-plyr\./,
			'vue-plyr.polyfilled.'
		)
		polyfilled.plugins.unshift(
			replace({
				"import Plyr from 'plyr'":
					"import Plyr from 'plyr/dist/plyr.polyfilled'",
				delimiters: ['', ''],
				preventAssignment: true
			})
		)
		buildFormats.push(polyfilled)
	})
}

// Export config
export default buildFormats
