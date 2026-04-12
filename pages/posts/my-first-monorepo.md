---
title: 我第一个monorepo
date: 2026-03-26T22:00:00.000+08:00
---

是这样的，我最初用 **Vue** 做了个叫做“[**OneQuote**](https://onequote.notosleung.com/)”的网站，然后呢，尝试着用 **React Router V7** 也做一个出来，毕竟不难，没用什么深奥的 `Hooks`，它的名字也很直白，就叫做“[**OneQuote-React**](https://onequote-react.notosleung.com/)”。由于这两个项目所用到的数据就在各自项目的内部，因此如果我想更新数据，就得同步更新两个项目，我觉得这样不好，所以就诞生了这个“[**OneQuote-monorepo**](https://github.com/notosleung/onequote-monorepo)”。

## 简介

项目结构大概就是这样：
```
/onequote-monorepo
  ├── package.json
  ├── pnpm-workspace.yaml
  ├── packages/
  │   ├── shared/            # 存放公共数据 quotes.ts
  │   │   ├── index.ts
  │   │   └── package.json
  │   ├── onequote-vue/     # 原 Vue 项目
  │   └── onequote-react/   # 原 React 项目
```

## 基本原则

为了做到尽量 **统一且复用** 的原则，根目录还包含了一些配置文件，例如用于规范代码和提交格式的 `commitlint.config.js` 和 `eslint.config.js`；用于样式相关的 `postcss.config.js` 和 `uno.config.ts`；资源文件如 **css文件**、**字体文件**、**图片** 等，则是放在 `shared/` 目录中。如此一来，项目整体的配置以及呈现出来的样子应该是一致的，当有什么变动的时候，只需要改动一个即可。

## 字体差异

这是个小问题，但我又确实排查了相当长的时间，因此记录一下。

最初 **Vue** 那边渲染的字体，在浏览器里看到的是：
```
PostScript name: Inter-Regular
```
而 **React** 那边看到的却是：
```
PostScript name: Inter-28pt-ExtraBold
```

没错，**React** 那边“莫名其妙”地加粗了。

最后左翻翻右翻翻，原来是 **React Router V7框架** 中，在 `root.tsx` 里加载了网络字体：
```typescript
export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]
```
注释掉以后，两边的字体就长一样了。

## 页面滚动

因为我希望在重返 `/about` 页面时，能自动滚动到我之前看到的位置，神奇的是 **React** 那边竟然自带了这样的功能，但可惜 **Vue** 这边并没有。

先说说 **React** 这边为什么会有这个功能，也是因为 **框架**，在 `root.tsx` 的 `Layout` 中有一个叫“`ScrollRestoration`”的组件，正是这个组件提供了自动滚动的能力。

**Vue** 官方其实也有解决方案，是由 `vue-router` 提供的[滚动行为](https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html)功能。一开始我是用官方方法的，但没有实际解决我的问题。然后找到了另外的一个库：[@antfu/vue-router-better-scroller](https://github.com/antfu/vue-router-better-scroller)，但我用下来发现也一样是滚动得不准...查看issue发现也有人报，并且还有另一个大佬提了 **PR**。

我排查了下，发现是因为文章用到了图片文件，而图片未渲染之前高度是未撑开的，在我尝试直接用那个大佬的版本后，发现确实能滚动到正确的位置了，但是新的问题出现：**频闪**。看源码发现是频繁地设置 `Storage` 了，我便自己用 **AI** 辅助一下，修改成用 `EventListenter` 的版本，这是我自己版本的源码地址：[@notosleung/vue-router-better-scroller](https://github.com/notosleung/vue-router-better-scroller)，在 `README.md` 中有举例说明我实际的用法。

> 写到这里我突然发现，是不是直接用官方方法也可以...只是刚开始用官方做法尝试的时候还没有排查出实际问题罢了。