import { defineCommand, runMain, showUsage } from 'citty'
import type { Format } from 'tsup'
import { description, engines, version } from '../package.json'
import { builderName } from './constants'
import { build } from './build'
import type { BuildOptions } from './config'

const main = defineCommand({
  meta: {
    name: builderName,
    version,
    description,
  },
  args: {
    'entry': {
      type: 'positional',
      description: 'Bundle files',
      required: false,
    },
    'minify': {
      type: 'boolean',
      alias: 'm',
      description: 'Minify bundle',
    },
    'out-dir': {
      type: 'string',
      alias: 'd',
      description: 'Output directory',
    },
    'vue': {
      type: 'boolean',
      description: 'Use vue loader',
    },
    'dts': {
      type: 'boolean',
      description: 'Generate declaration file',
    },
    'sourcemap': {
      type: 'boolean',
      description: 'Generate external sourcemap, or inline source: --sourcemap inline',
    },
    'format': {
      type: 'string',
      description: 'Bundle format, "cjs", "iife", "esm"',
    },
    'config': {
      type: 'string',
      description: 'Use a custom config file',
    },
    'no-config': {
      type: 'boolean',
      description: 'Disable config file',
    },
    'watch': {
      type: 'boolean',
      alias: 'w',
      description: 'Watch mode, if path is not specified, it watches the current folder ".". Repeat "--watch" for more than one path',
    },
    'version': {
      type: 'boolean',
      alias: 'v',
      description: 'Show version',
    },
  },
  async run({ args }) {
    if (args.version) {
      // eslint-disable-next-line no-console
      console.log(`${builderName}/${version} node: ${engines.node}`)
      return
    }

    const options = {
      tsup: {},
    } as BuildOptions
    if (args.entry)
      options.entry = args.entry.split(',')

    if (args.dts)
      options.dts = true

    if (args.format) {
      const format = args.format.split(',') as Format[]
      options.format = format
    }

    if (args.minify)
      options.minify = true

    if (args.vue)
      options.vue = true

    if (args.config)
      options.config = args.config

    if (args.sourcemap)
      options.tsup!.sourcemap = args.sourcemap

    if (args.watch)
      options.tsup!.watch = args.watch

    if (args['out-dir'])
      options.outDir = args['out-dir']

    if (args['no-config'])
      options.config = false

    await build(options)
  },
})

runMain(main)
