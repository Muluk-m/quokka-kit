#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import type { Format } from 'tsup'
import { description, engines, version } from '../package.json'
import { builderName } from './constants'
import { build } from './build'
import type { BuildOptions } from './config'
import { slash } from './utils'

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
    'platform': {
      type: 'string',
      description: 'Target platform, "web" or "node"',
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
    const files = args._

    if (args.version) {
      // eslint-disable-next-line no-console
      console.log(`${builderName}/${version} node: ${engines.node}`)
      return
    }

    const options = {
      tsup: {},
    } as BuildOptions

    if (!options.entry && files.length > 0)
      options.entry = files.map(slash)

    if (args.dts)
      options.dts = true

    if (args.format) {
      const format = args.format.split(',') as Format[]
      options.format = format
    }

    if (args.minify)
      options.minify = true

    if (args.platform)
      options.platform = args.platform as 'web' | 'node'

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
