import consola from 'consola'

export function errorAndExit(err: Error): never {
  consola.error(err)
  // eslint-disable-next-line node/prefer-global/process
  process.exit(1)
}
