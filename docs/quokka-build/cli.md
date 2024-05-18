# 命令行工具

Quokka-build 内置了一个轻量的命令行工具

## quokka-build -h

如果你需要查看所有可用的 CLI 命令，请在项目目录中运行以下命令：

```bash
npx quokka-build -h
```

你会得到以下输出

```bash
⚡ Fast package builder, powered by esbuild (quokka-build v0.0.7)

USAGE quokka-build [OPTIONS] [ENTRY]

ARGUMENTS

  ENTRY    Bundle files

OPTIONS

   -m, --minify    Minify bundle
     --platform    Target platform, "web" or "node"
  -d, --out-dir    Output directory
          --vue    Use vue loader
          --dts    Generate declaration file
    --sourcemap    Generate external sourcemap, or inline source: --sourcemap inline
       --format    Bundle format, "cjs", "iife", "esm"
       --config    Use a custom config file
    --no-config    Disable config file
    -w, --watch    Watch mode, if path is not specified, it watches the current folder ".". Repeat "--watch" for more than one path
  -v, --version    Show version
```

## `-m`,`--minify` 输出 minify 文件

```bash
quokka-build -m
```

你会得到使用 terser minify 后的文件

## `--platform` 指定转译目标

- 值为 `node` 输出产物会转译到 `node16`
- 值为 `web` 输出产物会转译到 `es2019`

## `-d`, `--out-dir` 指定输出目录

如果你需要在应用工程中实时调试包, 可以尝试指定输出目录

```shell
quokka-build --watch -d <.../node_modules/@klook/your-pkg-name/dist>
```

## `--vue` 开启 vue loader

开启后, 可以处理 `<=2.6.x` 版本的 .vue 文件

::: warning

❗️实验性支持, 请多做测试

当前不支持 类装饰器语法的处理

:::

## `--sourcemap` 输出 sourcemap 文件

```bash
quokka-build -sourcemap
```

## `--format` 输出格式

支持 cjs、esm、iife

## `--config` 指定配置文件的 path

```bash
quokka-build --config xxx/xx.config.ts
```

## `--no-config` 禁用配置文件

## `-w`, `--watch` 开启开发模式

开启后会监听文件目录, 有变更会重新 build
