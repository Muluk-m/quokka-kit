import type {
  ScriptOptions,
  StyleOptions,
  TemplateOptions,
} from '@vue/component-compiler'
import type {
  VueTemplateCompilerOptions,
} from '@vue/component-compiler-utils/dist/types'
import {
  compileToDescriptorAsync,
} from './compiler'
import { resolvePkg } from './resolve'

const { assemble, createDefaultCompiler } = resolvePkg('@vue/component-compiler')

interface TemplateOptionsEsbuild extends TemplateOptions {
  compilerOptions: VueTemplateCompilerOptions & {
    scopeId?: string
  }
}

interface VueCompilerOptions {
  script?: ScriptOptions
  style?: StyleOptions
  template?: TemplateOptionsEsbuild
}

export default async function ({
  scopeId,
  filename,
  source,
  extractCss,
  compilerOptions,
  assembleOptions = {},
  prependStyle,
}) {
  const getCompiler = ({ scopeId }: { scopeId?: string }) => {
    const options: VueCompilerOptions = { ...compilerOptions }

    options.template = {
      ...options.template!,
      compilerOptions: {
        ...(options.template!.compilerOptions
          ? options.template!.compilerOptions
          : {}),
        scopeId,
      },
    }

    return createDefaultCompiler(options)
  }

  const compiler = getCompiler({ scopeId })

  try {
    if (/^\s*$/.test(source))
      throw new Error('File is empty')

    const result = await compileToDescriptorAsync(compiler, scopeId, filename, source, prependStyle)
    let styles: { code: string }[] = []

    const resultErrors = getErrors(result)
    if (resultErrors.length > 0)
      return { errors: resultErrors }

    if (extractCss) {
      styles = result.styles.map(({ code }) => ({ code }))
      // Remove the style code to prevent it from being injected
      // in the JS bundle, but keep it as reference to preserve scopeId value.
      for (const style of result.styles)
        style.code = ''
    }

    const { code } = assemble(
      compiler,
      filename,
      result,
      assembleOptions,
    )

    return {
      code,
      styles,
      loader: result.script ? result.script.lang : undefined,
    }
  }
  catch (e) {
    return {
      errors: [
        {
          text: `Could not compile Vue single-file component: ${e}`,
          detail: e,
        },
      ],
    }
  }
}

function getErrors(result) {
  let errors = []
  if (result.template && result.template.errors)
    errors = errors.concat(getTemplateErrors(result.template))

  if (result.styles)
    errors = errors.concat(combineErrors(result.styles))

  return errors
}

function getTemplateErrors(template) {
  const { generateCodeFrame } = resolvePkg('vue-template-compiler')

  if (!template.errors)
    return []

  return template.errors.map(e => ({
    text: `${e.msg}\n\n${generateCodeFrame(template.source, e.start, e.end)}`,
    detail: e,
  }))
}

function combineErrors(outputs) {
  return outputs
    .map((o) => {
      if (!o || !o.errors)
        return []

      return o.errors.map(e => convertError(e))
    })
    .flat()
}

function convertError(e) {
  if (typeof e === 'string')
    return { text: e }

  if (e instanceof Error)
    return { text: e.message, detail: e }

  throw new Error(`Cannot convert Vue compiler error: ${e}`)
}
