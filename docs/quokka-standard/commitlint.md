# commitlint

## Install

```bash
pnpm i -D @klook/quokka-standard
```

## Usage

### 配置 commitlint 规则

package.json

```diff
{
 "commitlint": {
+    "extends": [ "@klook/quokka-standard/commitlint.config"]
  }
}
```

### 配置 git hook

package.json

```diff
{
  "simple-git-hooks": {
+    "commit-msg": "pnpm quokka-standard commitlint"
  }
}
```
