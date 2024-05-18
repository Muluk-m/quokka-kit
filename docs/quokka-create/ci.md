# 关于 CI 配置

:::tip
`Add CI config?` 选项为 Yes 时开启
:::

- 模板工程的项目在运行打包命令时, 使用 docker 镜像运行
- 此时我们可以使用镜像的 Node 版本
- 这样的好处时, 每次运行时大家都是在隔离的环境中进行文件操作, 避免因为不同工程文件的 I/O 引起冲突

## 开启 CI 选项后生成的目录结构如下

```bash
.
├─ bin
│  ├─ preinstall.sh
│  └─ prepublischOnly.sh
└─ package.json
```

### `package.json`

```json
{
  "scripts": {
    "prepublishOnly": "bash ./bin/prepublishOnly.sh"
  }
}
```

### `/prepublischOnly.sh`

```sh
#!/bin/bash

docker run --rm --privileged \
  -v $(pwd):/app \
  -v $HOME/.npmrc:/root/.npmrc \
  -w /app \
  node:16-slim bash -c "bash ./bin/preinstall.sh"
```

### `/preinstall.sh`

```sh
#!/bin/bash
set -eo pipefail

readonly PNPM_VERSION=8.15.4

display_info() {
  echo "npm registry: $(npm config get registry)"
  echo "node version: $(node -v)"
  echo "pnpm version: $(npx pnpm -v)"
  echo "$(whoami)"
}

main() {
  display_info

  npm install -g pnpm@"$PNPM_VERSION"
  pnpm install
  pnpm run build
}

main "$1"
```
