---
title: slice vs. splice
date: 2018-05-13T20:00:00.000+08:00
---

这俩都是 `JavaScript` 中 **字符串** 和 **数组** 操作中既基础又常用的，可以理解成是用来进行“切割”操作的。可能是它们之间的命名确实有点相似，所以特地出一篇来总结写写它们各自的用法以及之间的区别。

---

## slice

`slice()` 是一个非常高频且优雅的方法。它是 **“纯函数”**，所以它 **不会改变** 原数组或原字符串，返回值是一个全新的浅拷贝副本。

无论是在处理数组还是字符串，`slice(start, end)` 的逻辑是一致的。我们可以通过不同的参数组合来拆解它的用法：

1. 不传参数：`slice()`

如果不传任何参数，它会从索引 `0` 开始一直截取到最后。

- **作用：** 最简单、最快捷的**浅拷贝**（Shallow Copy）方法，等于直接复制了一个新的数组或字符串。

```javascript
const original = ['Vue', 'React', 'Angular'];
const copy = original.slice(); 

console.log(copy); // ['Vue', 'React', 'Angular']
console.log(copy === original); // false (内存地址不同)
```

2. 只传一个参数：`slice(start)`

只传一个参数时，它表示从该索引位置开始，**一直截取到末尾**。

- **为正数：** 顺数，从 `start` 开始一直到最后。
- **为负数：** 倒数，负几就是从倒数第几个开始，或者说负多少就是最后的那多少个。

```javascript
const tools = ['Vue', 'React', 'Angular', 'jQuery'];

console.log(tools.slice(2));  // ['Angular', 'jQuery'] (从索引2开始)
console.log(tools.slice(-1)); // ['jQuery'] (截取最后一个元素)
```

3. 传两个参数：`slice(start, end)`

截取 `start` 到 `end` 之间的范围，但要注意：截取的范围<b style="color: crimson">包含</b> `start`，但<b style="color: crimson">不包含</b> `end`。

```javascript
const frameworks = ['Vue', 'AngularJS', 'Angular', 'React'];

// 截取中间的 Angular 系列
const ngVersions = frameworks.slice(1, 3); 
console.log(ngVersions); // ['AngularJS', 'Angular'] (不包含索引3的React)
```

4. 特殊参数情况（边界处理）

- `start > 数组长度`：返回空数组 []。
- `end > 数组长度`：会一直截取到末尾（等同于只传一个参数）。
- `start > end` **(且均为正数)**：返回空数组 []。
- **负数索引配合：**

```javascript
const arr = [1, 2, 3, 4, 5];
// 从倒数第3个开始，截取到倒数第1个之前
console.log(arr.slice(-3, -1)); // [3, 4]
```

---

## splice

与 `slice()` 不同，`splice()` **只适用于数组**，也就是说字符串并没有这个方法。并且它会 **直接修改** 原数组，返回值是被删除元素组成的数组。

1. **基础语法**

 `splice(start, deleteCount, item1, item2, ...)` 它的参数逻辑可以概括为：**“从哪开始，删几个，加什么”**：

- `start`：必需，指定开始的索引（包含） 。
- `deleteCount`: 可选，规定应该删除的个数。
- `item1, item2, ...`：可选，表示要添加进数组的元素。

2. **不同参数的作用**

**情况 A：只传一个参数** `splice(start)`

从 `start` 位置开始，删除 **后面所有** 的元素。

- **作用：** 截断数组。

```javascript
const arr = ['Vue', 'React', 'Angular', 'jQuery'];
arr.splice(2); 
console.log(arr); // ['Vue', 'React'] （从索引2开始全删了）
```

**情况 B：传两个参数** `splice(start, deleteCount)`

从 `start` 位置开始，删除指定数量的元素。

**作用：** 纯删除。

```javascript
const tools = ['Vue', 'React', 'Angular', 'jQuery'];
tools.splice(1, 2); 
console.log(tools); // ['Vue', 'jQuery'] （删除了索引1和2两个元素）
```

**情况 C：三个及以上参数** `splice(start, deleteCount, item1...)`
这是 `splice` 的完全体，可以实现 **替换** 或 **插入**。

- **替换**（`deleteCount > 0`）：

```javascript
const libs = ['Angular', 'Vue'];
libs.splice(0, 1, 'React'); 
console.log(libs); // ['React', 'Vue'] （删掉Angular并原地插入React）
```

- **纯插入**（`deleteCount === 0`）：

```javascript
const list = ['x', 'z'];
list.splice(1, 0, 'y'); 
console.log(list); // ['x', 'y', 'z'] （在索引1的位置“挤”进去一个 'y'）
```

3. **特殊参数的处理（边界情况）**

- `start < 0` : 从数组末尾开始算起（-1 是最后一个）。
- `start > length` ： 从数组末尾开始添加（不删除任何内容），返回空数组 []。
- `deleteCount <= 0` ： 不删除元素，在这种情况下，至少应指定一个新元素，返回空数组 []。
- `deleteCount > length` ： 如果超过了从 `start` 到末尾的长度，则删除后面所有内容。

---

## 总结

|      特性     |      slice           | splice           |
| ------------- | -----------          | -----            |
| 主要目的      | 复制、提取           | 删除、插入、替换 |
| 参数 1        | 开始索引             | 开始索引         |
| 参数 2        | 结束索引 (不包含)    | 删除的数量       |
| 参数 3...     | 无                   | 要插入的新元素   |
| 对原数组影响  | 无                   | 直接修改原数组   |

### 题外话 - substring

`substring(start, end)`是字符串操作的函数，用于返回截取的字符串，也是包含 `start`，不包含 `end`。

- 它没有对负数参数进行处理，例如 `substring(-3)` 会被处理成 `substring(0)` 然后返回原本的整串字符串。
- 当 `start > end` ，会自动调转两个参数，比如 `substring(3, 0)` 会被处理成 `substring(0, 3)`
- `slice` 可以处理 **字符串和数组**，而 `substring` 正如其名**只能字符串**

因此，在不知道 `start` 和 `end` 谁大谁小的时候可以用 `substring`，其他时候都用 `slice`。