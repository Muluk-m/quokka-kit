import { parse } from '@vue/component-compiler-utils'
import type {
  VueTemplateCompiler,
} from '@vue/component-compiler-utils/dist/types'
import { resolvePkg } from './resolve'

export const compileToDescriptorAsync = async function (compiler, scopeId, filename, source, prependStyle) {
  const templateCompiler = resolvePkg('vue-template-compiler')
  const descriptor = parse({
    source,
    filename,
    needMap: true,
    compiler: templateCompiler as VueTemplateCompiler,
  })
  const template = descriptor.template
    ? compiler.compileTemplate(filename, descriptor.template)
    : undefined

  const styles = await Promise.all(
    descriptor.styles.map(async (style) => {
      if (style.content) {
        style.content = prependStyle(
          filename,
          style.lang || 'css',
          style.content,
        ).code
      }

      const compiled = await compiler.compileStyleAsync(
        filename,
        scopeId,
        style,
      )
      if (compiled.errors.length > 0)
        throw new Error(compiled.errors[0])
      return compiled
    }),
  )

  const { script: rawScript, customBlocks } = descriptor
  const script = rawScript
    ? {
        code: rawScript.src
          ? compiler.read(rawScript.src, filename)
          : rawScript.content,
        map: rawScript.map,
        lang: rawScript.lang,
      }
    : undefined

  return {
    scopeId,
    template,
    styles,
    script,
    customBlocks,
  }
}
