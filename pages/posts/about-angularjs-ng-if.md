---
title: AngularJs的一点事：ng-if
date: 2019-06-27T20:00:00.000+08:00
---

用 `AngularJs` 有一年多了，一直有些什么小问题小知识，但是都没记下来，今天又重新遇到同一个小问题，同时又在一位同事的指点下，重新认识了这个问题，于是决定写写。（这里需要注明一下，`AngularJs` 是指 `1.x` 的版本，一般都是旧项目会用到）

## 先说说遇到的问题

昨天一个同事（后文称为“Z”）签入了一个Directive的更改，然后今天获取后，发现平时能用的一个面板展开功能失效了，我看了下代码，是这样的：

```html
<span class="input-group-btn" ng-if="grid.enableAdvSearch">
    <button type="button"
            class="btn btn-white btn-primary btn-sm advSearchbtn"
            ng-click="showAdvSearch=!showAdvSearch"
            style="border-right: 0;">
        高级搜索&nbsp;
        <span class="ace-icon fa fa-chevron-down"></span>
    </button>
</span>
<div class="advsearch" uib-collapse="!showAdvSearch" style="z-index: 1; height: 0; position: relative">
    <div class="well" style="background-color: #fff; min-width: 300px;">
        <div ng-repeat="advSearchcolumn in advSearchcolumns">
            <searchfield index="$index" grid-id="gridId" field="advSearchcolumn"></searchfield>
        </div>
        <div class="searchBtn">
            <span class="btn btn-info btn-sm btn-round" ng-click="advSearch()">
              查询
            </span>
            <span class="btn btn-danger btn-sm btn-round" ng-click="ResetadvSearch()">
              清空
            </span>
        </div>
    </div>
</div>
```

`grid.enableAdvSearch` 这个是用来控制第一层的 `span` 显示，它的默认值就是 `true`；`showAdvSearch` 通过 `ng-click` 来置反以实现下边那个 `div` 的显示与隐藏。
光是这么看代码的话，没问题，同事Z也是个很厉害的家伙，应该不会出什么错。但实际上，就是不论如何点击那个“高级搜索”的按钮，面板也不会展开，看 `console` 也没有报错，这时候我想起来，以前也处理过这种BUG，这种BUG就是由于在 `ng-if` 下，`ng-click` 如果是直接操作变量的话，会失效；并且跟他说，把 `ng-if` 改成 `ng-show` 就好了。

## 真正的问题
我把代码截图给同事Z，并告诉他 `ng-if` 下，`ng-click` 会失效。过一会儿后，同事Z指正我说：

> 你搞错知识点了，ng-if并不会使ng-click失效，而是它会有自己的作用域

之后，他还提示我：

> 只要给showAdvSearch一个对象，比如也放到grid.showAdvSearch，就好了吧

我按照他给的提示操作了一遍，确实是这样（这时我默默地给了他一阵掌声）。

## 问题的解决与扩展
问题就按照上边的办法解决了，但我想起了之前的解决办法。`ng-click` 中不直接操作变量，而是传入函数，通过函数来改变需要的变量。

但是如今我知道了真正的问题是 `ng-if` 自己有个子作用域，所以才导致传入的变量其实没有直接绑定到 `$scope` 上。而要解决这个作用域的问题也很简单，在 `html` 文件中，在变量前加上 `$parent` 就可以了，比如 `ng-click="$parent.showAdvSearch=!$parent.showAdvSearch"`。

## 总结
`ng-if` 会产生自己的自作用域，因为在 `ng-if` 的作用范围内，绑定的变量实际上是与 `$scope` 相差了一层的，可以用一些办法来回避或解决这个问题：
- 改用 `ng-show` 来代替 `ng-if`
- `ng-if` 下的 `ng-click` 和 `ng-model` 如果要直接绑定 `$scope` 的变量，可以在绑定时，在变量名前加上 `$parent`
- `ng-if` 下的 `ng-click` 也可以改用直接传递函数的方式来代替直接操作变量
