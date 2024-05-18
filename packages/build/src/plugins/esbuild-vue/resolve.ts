import { createRequire } from 'node:module'
import process from 'node:process'

export function resolvePkg(pkgName: string) {
  // resolve from project root first, then fallback to peer dep (if any)
  const result = tryRequire(pkgName, process.cwd()) || tryRequire(pkgName)

  if (!result) {
    throw new Error(
      `Failed to resolve ${pkgName}`,
    )
  }

  return result
}

const _require = createRequire(import.meta.url)

export function tryRequire(id: string, from?: string) {
  try {
    return from
      ? _require(_require.resolve(id, { paths: [from] }))
      : _require(id)
  }
  catch (e) { }
}
