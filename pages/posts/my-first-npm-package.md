---
title: npm发包初体验
date: 2026-03-18T22:00:00.000+08:00
---

先上地址：

[~~vite-plugin-react-mdx-wrapper~~](https://www.npmjs.com/package/vite-plugin-react-mdx-wrapper)（已弃用）

[vite-plugin-react-mdx-layout](https://www.npmjs.com/package/vite-plugin-react-mdx-layout)

## 开发初衷

前段时间我用 **Vue3** 开发了一个小小的应用，里边需要用到 `Markdown` 文件作为页面组件，在 **Vue** 技术栈下，有一个叫 [unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown) 的包，它主要是功能 **把 `Markdown` 编译成Vue组件**，在这其中有一个叫 `wrapperComponent` 的选项，支持自己构造一个组件来作为显示 `Markdown` 的 **容器**，这是个非常方便又灵活的功能，能让我完全按照自己所想的方式来显示 `Markdown` 页面。

后边我尝试用 **React** 复刻了这个小应用，但有个问题是在 **React** 技术栈下，并没有这种“配置一个组件来作为 `Markdown` 容器”的轮子，于是便决定自己造一个。

## 原理

一开始想着，按照正常的思路，那应该是做一个父组件，里边用 `<Outlet />` 来显示这个 `MDX` 文件，但这样做的话，原本通过路由地址访问对应 `MDX` 文件的方式就行不通了（也可能是可以搞掂的，只是当时的我菜，此时此刻又好像有个新的想法，有空试试）。

最终是有点曲线救国的意味，继续让路由地址直接对应 `MDX` 文件，但我写一个插件，在每个 `MDX` 文件中 **import** 一下配置的那个组件。方式是通过 **Vite** 的 `transform` 钩子直接改写 `MDX` 源码，提前注入 `import + default export Layout + meta export`，从而让所有 `MDX` 自动走同一套 **React Wrapper**。

## 发包流程

### 编译

用的是 `tsup`，**一行命令就能搞定 ESM、CommonJS 和 类型定义 (.d.ts)：**
```bash
"build": "tsup src/index.ts --format cjs,esm --dts --clean"
```

### 单元测试

我用的 **Vitest**，测试用例是用 **AI** 生成的（真是好帮手），通过 `vitest.config.ts` 配置相关的信息后，在 `package.json` 中添加用于测试的脚本
```bash
"test": "vitest",
"test:run": "vitest run"
```

### 确认文件

```bash
pnpm pack              # 会生成一个真实的 .tgz 文件，可以直接用来安装测试
pnpm pack --dry-run    # 不会生成文件，只是告诉我包里会有这些东西
```

### 本地验证

```bash
cd xxx/xxx  # 用来测试插件的项目路径
pnpm add foo/bar/vite-plugin-react-mdx-layout # 插件文件所在的实际路径
```
然后在 **测试项目** 中像正常使用 **npm包** 一样即可

### 发布

1. 先去npm官网登录一下，然后点击右上角的头像，生成一个 `Access Token`，记得要立即复制/保存生成出来的 `token`，否则之后就看不到了！
2. 回到插件目录，在根目录新建一个 `.npmrc` 文件（记得添加进 `.gitignore`），在里边填上：
```
//registry.npmjs.org/:_authToken=xxxxxx（实际的token，前边的双斜杠也是要加上的）
```
3. 发布到npm上：
```bash
pnpm publish --access public
```
4. 更新npm包：
```bash
# 更新版本
pnpm version patch

# 重新打包，确保 dist 文件夹里的内容是最新的
pnpm build

# 推送代码和 commit
git push origin main

# 推送版本标签 (例如 v1.0.1)
git push origin --tags

# 执行发布
pnpm publish --access public
```

### 自动发布

如果有上传到 **GitHub**，先给项目打上一个初始的 `tag`：
```bash
git tag v0.0.0
git push origin v0.0.0
```

然后在仓库的 `Setting`--`Secrets and variables`--`Actions` 里添加 `Repository secrets`，名称随便取，内容就是刚刚复制的那个 `token`，然后在自动化脚本中应用上，我的是这样（仅供参考）：
```yml
name: Publish to npm

on:
  push:
    tags:
      - "v*" # 当你 push 一个以 v 开头的标签时触发（如 v1.0.2）

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: 9 # 确保版本与你本地一致

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: "https://registry.npmjs.org"
          # 这步很关键，它会自动处理 .npmrc 的基础配置
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Build project
        run: pnpm build

      - name: Publish to npm
        run: pnpm publish --access public --no-git-checks
        env:
          # 核心：将 GitHub Secret 注入为环境变量，NPM_TOKEN 就是 Repository secrets 名称
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```
执行 `pnpm version patch` 更新版本（`patch` 也可以换成 `main` 或 `minor`，看需要更新的是哪个数字），然后在每次 **push** 一个 **以 v 开头的 tag** 时触发这个发布脚本
```bash
# 发布前都必须重新打包，确保 dist 文件夹里的内容是最新的
pnpm build

# 更新版本，且会自动在本地生成一个 Git Commit 和一个 Tag
pnpm version patch

# 推送代码和 commit
git push origin main

# 推送版本标签 (例如 v0.0.1)，然后就会触发 GitHub Actions，自动发布到 npm 上
git push origin --tags
```

## 小插曲

我尝试推送 `GitHub` 更新版本来触发发布时，出现了 `package.json` 版本与 `pnpm-lock.yaml` 不一致导致发布失败的情况，我的解决办法比较简单粗暴，在 `pnpm version patch` 之后直接执行一下 `pnpm install`，强行同步版本，然后 **add** 一下 `pnpm-lock.yaml`，当然，我也写成了一个脚本：
```bash
"version": "pnpm install && git add pnpm-lock.yaml"
```
这样每次执行 `pnpm version patch` 时也会同时执行上边这条指令，后续只需要继续 **推送代码** 和 **推送版本标签** 即可。