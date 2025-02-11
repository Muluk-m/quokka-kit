export interface PromItem<T> {
  label: string
  value: T
  hint?: string
}

export type FrameworkOption = 'vue' | 'react'

export type ExtraLibrariesOption = 'formatter' | 'unocss'

export interface PromtResult {
  uncommittedConfirmed: boolean
  frameworks: FrameworkOption[]
  stylelint: boolean
  extra: ExtraLibrariesOption[]
  updateVscodeSettings: unknown
}
