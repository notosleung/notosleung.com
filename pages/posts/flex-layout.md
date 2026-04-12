---
title: Flex 布局基础
date: 2018-03-29T22:00:00.000+08:00
---

> 实不相瞒，css一直是鄙人的短板...工作的项目需要固定使用IE6，因此一直未有机会接触一些新的东西(也不新了)，此文旨在稍稍总结一下 **Flex 布局** 常用的属性和简单的适用场景，大佬勿喷。

在 **Flexbox** 出现之前，我们通常依赖 `float` 或 `position` 进行布局，但这些方法往往伴随着复杂的清除浮动和计算偏移。**Flex 布局（Flexible Box）** 的出现，让我们能够以更加直观、灵活的方式管理页面元素的排列。

## 基本概念

- **Flex Container（容器）：** 采用 `display: flex;` 的父元素
- **Flex Item（项目）：** 容器内部的直接子元素

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>

<style>
.container {
  display: flex; /* 开启 Flex 布局 */
  background-color: #f5f5f5;
  padding: 10px;
}
.item {
  background-color: #333;
  color: white;
  padding: 20px;
  margin: 5px;
}
</style>
```

## 容器的常用属性

- **flex-direction：** 决定主轴的方向（即项目的排列方向）
   - `row`：主轴为水平方向，起点在左端（默认）
   - `row-reverse`：主轴为水平方向，起点在右端
   - `column`：主轴为垂直方向，起点在上沿
   - `column-reverse`：主轴为垂直方向，起点在下沿

- **flex-wrap：** 空间不足时是否换行`
   - `nowrap`: 不换行（默认）
   - `wrap`: 换行，第一行在上方
   - `wrap-reverse`：换行，第一行在下方

- **flex-flow：** 这个属性其实是 **flex-direction** 属性和 **flex-wrap** 属性的简写形式，默认值为 `row nowrap`

- **justify-content（主轴对齐）:** 决定项目在 **主轴方向（默认水平方向）** 上的排列方式
   - `flex-start`：左对齐（默认）
   - `flex-end`: 右对齐
   - `center`：居中对齐
   - `space-between`：两端对齐，项目之间间隔相等
   - `space-around`: 每个项目两侧的间隔相等

- **align-items（交叉轴对齐）:** 决定项目在 **交叉轴方向（默认垂直方向）** 上的排列方式
   - `stretch`：如果项目未设置高度，将占满整个容器高度（默认）
   - `flex-start`：交叉轴的起点对齐
   - `flex-end`：交叉轴的终点对齐
   - `center`：垂直居中（**最常用的垂直居中方案**）
   - `baseline`: 项目的第一行文字的基线对齐

在 Flex 出现之前，垂直居中是前端的痛点。现在只需要三行代码：
```css
.center-box {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  height: 200px;           /* 给定容器高度 */
  border: 2px solid #ddd;
}
```

## 项目的常用属性

- **order：** 定义项目的排列顺序：数值越小，排列越靠前，默认为0，负数亦可
- **flex-grow：** 定义放大比例（默认 0，即不放大）
- **flex-shrink：** 定义缩小比例（默认 1，即空间不足时自动缩小）
- **flex-basis：** 在分配空间前，项目占据的主轴空间
- **flex：** 以上三个属性的简写（常用 flex: 1 来让子元素平分剩余空间）
- **align-self：** 允许单个项目有与其他项目不同的对齐方式，可覆盖 `align-items`

## 常见的应用场景

- **响应式导航栏（Logo 在左，菜单在右）**

利用 `justify-content: space-between` 可以非常优雅地推开两端元素

<nav style="display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background: #f8f9fa; border-bottom: 1px solid #ddd;">
  <div style="font-weight: bold; font-size: 20px;">BrandLogo</div>
  <ul style="display: flex; list-style: none; gap: 20px; margin: 0;">
    <li>首页</li>
    <li>产品</li>
    <li>关于我们</li>
  </ul>
</nav>

```html
<nav style="display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background: #f8f9fa; border-bottom: 1px solid #ddd;">
  <div style="font-weight: bold; font-size: 20px;">BrandLogo</div>
  <ul style="display: flex; list-style: none; gap: 20px; margin: 0;">
    <li>首页</li>
    <li>产品</li>
    <li>关于我们</li>
  </ul>
</nav>
```

- **经典三栏布局（圣杯布局）**

中间内容区自动填满剩余空间，左右两栏固定宽度。这是 `flex: 1`（即 `flex-grow: 1`）最常见的用法。

<div style="display: flex; height: 200px; text-align: center; color: white;">
  <aside style="width: 150px; background: #3498db;">左侧边栏 (150px)</aside>
  
  <main style="flex: 1; background: #ecf0f1; color: #333;">中间核心内容（自适应）</main>
  
  <aside style="width: 150px; background: #3498db;">右侧边栏 (150px)</aside>
</div>

```html
<div style="display: flex; height: 200px; text-align: center; color: white;">
  <aside style="width: 150px; background: #3498db;">左侧边栏 (150px)</aside>
  
  <main style="flex: 1; background: #ecf0f1; color: #333;">中间核心内容（自适应）</main>
  
  <aside style="width: 150px; background: #3498db;">右侧边栏 (150px)</aside>
</div>
```

- **响应式卡片流（自动换行）**

利用 `flex-wrap: wrap` 让卡片在屏幕变窄时自动排到下一行，而不是被挤扁

<div style="display: flex; flex-wrap: wrap; gap: 15px; padding: 10px;">
  <div style="flex: 1 0 200px; height: 100px; background: #2ecc71; border-radius: 8px;"></div>
  <div style="flex: 1 0 200px; height: 100px; background: #e67e22; border-radius: 8px;"></div>
  <div style="flex: 1 0 200px; height: 100px; background: #9b59b6; border-radius: 8px;"></div>
  <div style="flex: 1 0 200px; height: 100px; background: #34495e; border-radius: 8px;"></div>
</div>

```html
<div style="display: flex; flex-wrap: wrap; gap: 15px; padding: 10px;">
  <div style="flex: 1 0 200px; height: 100px; background: #2ecc71; border-radius: 8px;"></div>
  <div style="flex: 1 0 200px; height: 100px; background: #e67e22; border-radius: 8px;"></div>
  <div style="flex: 1 0 200px; height: 100px; background: #9b59b6; border-radius: 8px;"></div>
  <div style="flex: 1 0 200px; height: 100px; background: #34495e; border-radius: 8px;"></div>
</div>
```

- **垂直水平居中**

在 Flex 出现之前，垂直居中是前端的痛点。现在只需要三行代码，仅需给父元素设置

```css
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  height: 300px;           /* 必须有高度才能看到垂直居中效果 */
  background: #eee;
}
```

### 参考资料

- [阮一峰的 Flex 布局教程：语法篇](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)