---
title: React Router V7
date: 2025-03-15T22:00:00.000+08:00
---

**React Router** 在去年发布了 `V7` 版本，看起来从一个简单的路由工具变成了框架级别的东西，挺有意思的，所以特地研究一下。

## 整合更新

从官网的 `changelog` 看到，开发团队把 `react-router-dom`、 `@remix-run/react`、`@remix-run/server-runtime` 以及 `@remix-run/router` 整合进了 `react-router`，并且支持了 `Vite` 作为构建工具。

这种整合对于已经使用或将要学习使用 `react-router` 的人来说是极好的更新了，首先就省略了各种不同包的安装和管理，其次支持 `Vite` ，那在开发时的热更新以及 `SSR` 开发那是极好的提升了。

整合后的 `react-router` 提供了三种模式，这三种模式各有所长吧，分别适用不同的场景

---

## Declarative Mode

即 **声明模式**，这应该是从 `V6` 早期版本（`V6.0~V6.3`）升上来后所需修改最小的版本，安装方式：
```bash
# 通过 Vite，然后根据提示步骤创建项目
npx create-vite@latest

# 或者直接通过 Vite 提供的模板预设安装，有 react 和 react-ts
npm create vite@latest my-react-router-app -- --template react-ts

# 然后下载 react-router 包
npm i react-router
```

路由定义文件大概长这样子：
```typescript
import { BrowserRouter } from "react-router";

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
```

这种通过 `BrowserRouter` 、 `Routes` 和 `Route` 的方式配置路由，对于 `V6` 早期版本（`V6.0~V6.3`）的项目来说是十分友好的，所需要的改动大概就是修改一下包名，例如 `react-router-dom` 改成 `react-router` 等。硬要说有什么缺点的话，用这种模式，升了也可能跟 **没升** 一样...（纯粹是我个人见解）

---

## Data Mode

即 **数据模式**，安装方式与 [声明模式](#declarative-mode) 的一样，区别在于它通过把 `router` 传给 `RouterProvider` 来渲染路由的，路由定义和渲染路由方式如下：
```typescript
import { createBrowserRouter, RouterProvider } from "react-router";

let router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    loader: loadRootData,
  },
]);

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />,
);
```

不难发现，**数据模式** 与原本 `v6.4` 之后几乎是一样的。跟 **声明模式** 的区别大概就是 **声明模式** 是只管页面跳转的，而 **数据模式** 既管页面跳转，也管数据请求（`loader`选项）

不管怎样，如果升级后仍打算采用这两种模式之一，都建议去看一看官方提供的[升级指南](https://reactrouter.com/upgrading/v6)，按照步骤慢慢改成适用 `V7` 的 `API` 后再把包升到最新版吧，毕竟本文其实写得很粗糙，很多官方文档中的内容这里都没提及。

> 需要注意的是，虽然本文例子给出的这两种模式的安装方式都是 `Vite`，但其实这不是硬性要求的，你仍然可以用 `Webpack` 之类的构建工具来进行构建

---

## Framework Mode

嘿！还没完呢，说了有三种模式，这就是第三种模式——**框架模式**。这是 `V7` 最进阶的部分，它让 **React Router** 更接近 **Next.js**。

相比前两种模式，**框架模式** 有自己的安装方式：
```bash
npx create-react-router@latest my-react-router-app
```

当然，官方也有提供几种现成的可部署模板：
```bash
# 模板地址：https://github.com/remix-run/react-router-templates
npx create-react-router@latest --template remix-run/react-router-templates/<template-name>
```

安装后进入目录，会发现：
1. 缺少了常见的 `index.html`，这是因为这个框架的入口都被根目录中的 `root.tsx` 包揽了
2. 自带 `vite.config.ts`，说明它默认使用 `Vite` 来进行构建
3. 多了个 `react-router.config.ts`，能看到里边的配置中，`SSR` 选项为 `true`，但即便不配置这项，它天生就是开启 `SSR` 的。还可以添加 `async prerender(){...}`：
```typescript
import type { Config } from "@react-router/dev/config";

export default {
  // 如果应用一共只有这三个页面，这就等同于 SSG 了
  async prerender() {
    return ["/", "/about", "/contact"];
  },
} satisfies Config;

```

它的路由方式长这样:
```typescript
import { type RouteConfig, route, index, layout, prefix } from "@react-router/dev/routes";

export default [
  index("./home.tsx"),
  route("about", "./about.tsx"),

  layout("./auth/layout.tsx", [
    route("login", "./auth/login.tsx"),
    route("register", "./auth/register.tsx"),
  ]),

  ...prefix("concerts", [
    index("./concerts/home.tsx"),
    route(":city", "./concerts/city.tsx"),
    route("trending", "./concerts/trending.tsx"),
  ]),
] satisfies RouteConfig;
```

这样的配置方式十分简单直观，只有配置路径和文件的对应关系。当然，**框架模式** 也提供了 `loader` 和 `action`，只是说它们不是在路由配置文件中配置，而是写在了组件中：

### Data Loading

有两种：**loader** 和 **clientLoader**
- 客户端数据加载
```typescript
// route("products/:pid", "./product.tsx");
import type { Route } from "./+types/product";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs) {
  const res = await fetch(`/api/products/${params.pid}`);
  const product = await res.json();
  return product;
}

// HydrateFallback 会在客户端数据请求期间渲染
export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Product({
  loaderData,
}: Route.ComponentProps) {
  const { name, description } = loaderData;
  return (
    <div>
      <h1>{name}</h1>
      <p>{description}</p>
    </div>
  );
}
```

- 服务端数据加载
```typescript
// route("products/:pid", "./product.tsx");
import type { Route } from "./+types/product";
import { fakeDb } from "../db";

export async function loader({ params }: Route.LoaderArgs) {
  const product = await fakeDb.getProduct(params.pid);
  return product;
}

export default function Product({
  loaderData,
}: Route.ComponentProps) {
  const { name, description } = loaderData;
  return (
    <div>
      <h1>{name}</h1>
      <p>{description}</p>
    </div>
  );
}
```

- 静态数据加载（需要配置预渲染，即前边说的 `prerender`）：
```typescript
// route("products/:pid", "./product.tsx");
import type { Route } from "./+types/product";

export async function loader({ params }: Route.LoaderArgs) {
  let product = await getProductFromCSVFile(params.pid);
  return product;
}

export default function Product({
  loaderData,
}: Route.ComponentProps) {
  const { name, description } = loaderData;
  return (
    <div>
      <h1>{name}</h1>
      <p>{description}</p>
    </div>
  );
}

// 配置文件 react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  async prerender() {
    let products = await readProductsFromCSVFile();
    return products.map(
      (product) => `/products/${product.id}`,
    );
  },
} satisfies Config;
```

- 同时使用两种数据加载，这里学问比较大，配合不同场景有不同使用方式：
   1. `SSR` 用数据库，客户端用 `API`, 同一页面，两种运行环境，不同数据源
    ```typescript
    // server loader
    export async function loader({ params }) {
      return db.getProduct(params.id); // 直接查数据库
    }

    // client loader
    export async function clientLoader({ params }) {
      return fetch(`/api/products/${params.id}`);
    }
    ```
   2. `SSR` 给“基础数据”，客户端补充数据，官方文档的示例就是这种场景
    ```typescript
    export async function clientLoader({ serverLoader }) {
      const serverData = await serverLoader();
      const extra = await fetch("/api/extra");

      return {
        ...serverData,
        ...extra,
      };
    }
    ```
   3. 利用 `SSR` 数据，避免重复请求
    ```typescript
    export function clientLoader({ serverLoader }) {
      const data = await serverLoader(); // 复用已有数据
    }
    ```
   4. 希望客户端在挂载期间和页面渲染之前也加载数据时，在客户端的数据加载函数上设置 `hydrate` 属性为 `true` 即可，一般用于刷新缓存、获取最新数据等场景
    ```typescript
    export async function loader() {
      /* ... */
    }

    export async function clientLoader() {
      /* ... */
    }

    clientLoader.hydrate = true as const;
    ```
   
### Actions

也有两种：**action** 和 **clientAction**
```typescript
// 服务端
export async function action({ request }) {
  const formData = await request.formData();
  // 处理数据
  return { ok: true };  // 或别的什么数据，处理过程也可以抛出错误
}

// 客户端
export async function clientAction({ request }) {
  const formData = await request.formData();
  // 处理数据
  return { ok: true };  // 或别的什么数据，处理过程也可以抛出错误
}
```

**action** 的调用：

> 只要数据的变化是通过调用 `action` 产生的，那页面上的所有 `loader` 都会被重新验证，保持用户界面与数据一致，无需编写任何代码

```
用户提交表单
   ↓
<Form method="post">
   ↓
action()
   ↓
修改数据（DB / API）
   ↓
自动重新执行 loader
   ↓
UI 更新
```

1. 用表单
```typescript
// 不传 action 就是默认当前路由地址
import { Form } from "react-router";

<Form method="post" action="/projects/123">
  ...
</Form>
```
这就类似于原生的表单行为，通过 `type="submit"` 按钮提交，这种方式会自动导航

>`Form` 这里可以不传 `action`，这表示默认提交到当前路由的地址

2. 用 `useSubmit`，官方例子：
```typescript
import { useCallback } from "react";
import { useSubmit } from "react-router";
import { useFakeTimer } from "fake-lib";

function useQuizTimer() {
  let submit = useSubmit();

  let cb = useCallback(() => {
    submit(
      { quizTimedOut: true },
      { action: "/end-quiz", method: "post" },
    );
  }, []);

  let tenMinutes = 10 * 60 * 1000;
  useFakeTimer(tenMinutes, cb);
}
```

这例子实现了一个计时结束后就调用 `action` 的功能，这种方式适合非表单的场景，而且也会自动导航。

> 需要注意的是：这里和上边所说的“**自动导航**”是指自动跳转到 `action函数` 中写好的要跳转的路由，并不是指跳转到 `<Form action="xxx">` 或 `action: "xxx"` 里的地址。 

3. 用 `fetcher`
```typescript
// 两种方式
import { useFetcher } from "react-router";

function Task() {
  let fetcher = useFetcher();
  let busy = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post" action="/update-task/123">
      <input type="text" name="title" />
      <button type="submit">
        {busy ? "Saving..." : "Save"}
      </button>
    </fetcher.Form>
  );
}

// 或者
fetcher.submit(
  { title: "New Title" },
  { action: "/update-task/123", method: "post" },
);
```

这种方式不会自动导航，有点类似于原生中的 `ajax`，适合用在不需要跳转页面的情况。

---

## 总结


|             模式            |            核心 API           |   特点   |  适用场景   |
|-----------------------------|-------------------------------|----------|-------------|
| Declarative Router（声明式）| `<BrowserRouter>`、`<Routes>` |   最简单 |小项目 / 学习|
|     Data Router（数据模式） |         `createBrowserRouter` | 数据驱动 | 中大型 SPA  |
| Framework Router（框架模式）|       文件路由 / 全栈能力     |  类框架  | SSR / 全栈  |

总体来说，新版本并不是那种破坏性的更新，从旧版本升上来其实需要改动的地方并不多，好好跟着官方文档去修改原本的代码即可。这三种模式其实各有千秋，如果实在不知道怎么选，可以参考 [官方的选择建议](https://reactrouter.com/start/modes#decision-advice) 后根据自身和项目的实际情况选择。

我个人的话会更倾向于 **框架模式**，毕竟作为目前偏向 `Vue` 的我来说，也没有什么能升级的旧项目，并且 **框架模式** 的预设配置很齐全，省掉了很多配置上的麻烦。

### Vue Router vs. React Router

- **Vue Router**：声明式的路由，单纯是个路由库，只负责 URL -> Component，数据层在组件内获取，或者用状态管理（如 **Pinia** ）

- **React Router**：三种模式，路由库 -> 数据路由 -> 类框架，且每种模式的功能都是累加的，但代价是更受架构的控制