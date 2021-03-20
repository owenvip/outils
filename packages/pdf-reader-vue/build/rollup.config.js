import vue from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import less from 'rollup-plugin-less'
import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))

const config = {
  input: 'src/index.js',
  output: {
    name: 'PdfReader',
    exports: 'named',
    globals: {
      vue: 'Vue',
      'pdf-reader': 'PdfReader',
    },
  },
  plugins: [
    vue({
      target: 'browser',
      compileTemplate: true,
    }),
    css({ output: 'style/index.css' }),
    resolve({
      jsnext: true,
      main: true,
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    less(),
  ],
  external: ['vue'],
}

// Only minify browser (iife) version
if (argv.format === 'iife') {
  config.plugins.push(terser())

  // Here we remove our `external` dependency that we have in this project
  // Be careful with the index here - it has to match any dependency that
  // you want to be built into to the iife output
  config.external.splice(1)
}

export default config
