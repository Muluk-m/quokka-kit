import { antfu } from '@antfu/eslint-config'
import defu from 'defu'
import type {
  Awaitable,
  OptionsConfig,
  TypedFlatConfigItem,
} from '@antfu/eslint-config'
import type { Linter } from 'eslint'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function eslint(
  options: OptionsConfig & TypedFlatConfigItem = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any>>[]
): FlatConfigComposer<TypedFlatConfigItem> {
  const merged = defu(
    options,
    {
      // Custom Base Config
      astro: false,
      solid: false,
      svelte: false,
    } satisfies OptionsConfig,
  )

  return antfu(merged, {
    rules: {
      'no-console': 'warn',
      'node/prefer-global/buffer': 'off',
      'perfectionist/sort-objects': 'off',
      'react/no-children-prop': 'off',
      'ts/ban-types': 'off',
      'unicorn/prefer-number-properties': 'off',
      'unicorn/prefer-node-protocol': 'off',
      'antfu/top-level-function': 'off',
    },
  }, ...userConfigs)
}

export * from '@antfu/eslint-config'
