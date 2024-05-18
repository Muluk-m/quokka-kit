# quokka-create

## Scaffolding Your First Quokka Project

> **Compatibility Note:**
> Quokka requires [Node.js](https://nodejs.org/en/) version 16+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.

With NPM:

```bash
$ npm create quokka@latest
```

With Yarn:

```bash
$ yarn create quokka
```

With PNPM:

```bash
$ pnpm create quokka
```

With Bun:

```bash
$ bun create quokka
```

Then follow the prompts!

You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold a Vite + Vue project, run:

```bash
# npm 7+, extra double-dash is needed:
npm create quokka@latest my-vue-app -- --template vue

# yarn
yarn create quokka my-vue-app --template vue

# pnpm
pnpm create quokka my-vue-app --template vue

# Bun
bun create quokka my-vue-app --template vue
```

Currently supported template presets include:

- `vue-app`
- `vue-components`
- `vue-components-docs`
- `react-app`
- `react-components`
- `react-components-docs`
- `api-docs`
- `typescript`
- `typescript-docs`

You can use `.` for the project name to scaffold in the current directory.
