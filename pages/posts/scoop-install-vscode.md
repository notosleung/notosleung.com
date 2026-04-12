---
title: 用Scoop重装VSCode
date: 2026-04-01T10:00:00.000+08:00
---

先说明一下, [Scoop](https://scoop.sh/) 是适用于 **Windows** 平台的命令行软件管理工具, 但目前来说主要用来下载各种 `Windows` 的软件, 因此如果你是 **Mac** 或者 **Linux** 用户, 本文中 [在Scoop上安装VSCode](#在Scoop上安装VSCode) 的部分是可以 **跳过** 的

## 前情提要

我当然原本就有个 `VSCode`, 并且跟着官方发布的更新, 所以一直是保持使用最新版

然而在3月24日发布的最新版 `1.113.0` 中，`Copilot Chat` 出现了比较离谱的bug

步骤和现象是这样的:
1. 在 `Chat` 中输入想搜索的内容，比如想让 `Copilot` 展示些代码例子
2. `Copilot` 如常地根据输入的内容"思考"一番
3. 展示它思考的结果，照理说应该会给出几套代码, 但是从 `Chat` 中只能看到最后一个 `blockquote`, 而之前的 `blockquote` 则是全部都没成功渲染出来, 比如在前边应该出现 `blockquote` 的地方能看到它说"**代码如下：**", 但实际下边并没有对应的代码...

`GitHub` 上 [vscode的仓库](https://github.com/microsoft/vscode) 已经有好几条类似的 `issue` 了:

- [Copilot chat responses doesn't render as expected #306190](https://github.com/microsoft/vscode/issues/306190)
- [Github Copilot doesn't render code as expected #306877](https://github.com/microsoft/vscode/issues/306877)
- [Render problems #306904](https://github.com/microsoft/vscode/issues/306904)
- ...

这几天我都是在网页上用 `Gemini` 或 `ChatGPT` 之类的, 但这实在太不方便了, 等官方修复又不知道要等到什么时候, 那我干脆回退一下吧

## 备份原配置

原本的 `VSCode` 用的时间久了, 自然就形成了适合自己的配置和插件, 这回我还是第一次尝试回退版本, 总得需要备份一下配置和插件的

根据朋友的推荐, 决定使用 `Syncing + GitHub Gist` 的方案

1. 在 `VSCode` 的扩展管理中搜索 "**Syncing**", 然后安装以下插件
![Syncing](/images/scoop-install-vscode/syncing.png)

2. 生成 `GitHub Personal Acess Token`:
   1. 前往 [GitHub Personal Acess Token 页面](https://github.com/settings/tokens), 然后选择 **Generate new token (classic)**, 在 `Note` 处填入一个名字, 然后下拉, 找到 `gist` 选项并选上, 拉到最下, 点击 **Generate token** 按钮
   2. 页面跳转后, 有一串 `token`, **一定要复制下来**, 这个页面刷新或者关闭后, 这串 `token` 就再也找不到了 (放心, 图里这串 `token` 已经被我销毁了)
  ![Make sure to copy](/images/scoop-install-vscode/make-sure-copy.png)
3. 上传配置
   1. 回到 `VSCode`, 打开命令面板(`ctrl + shift + p`), 输入 **upload**, 选择 **Syncing: Upload Settings**
   ![Type upload in vscode](/images/scoop-install-vscode/type-upload-in-vscode.png)
   2. 输入刚才复制的那串 `token`, 按回车
   3. 选择现有的, 或者手动输入一个 `Gist ID`, 也可以留空, `Syncing` 会自动创建一个新的 `Gist`, 回车即可

至此, 当前 `VSCode` 的配置就上传到 [GitHub Gist](https://gist.github.com) 上了, 点击 **View your gists**, 点击 **your-github/extensions.json** 即可查看详细的配置文件, 而 `url` 最后的那串东西就是 `Gist ID`

## 在Scoop上安装VSCode

终于进入主题, 接着上边的步骤编号

4. 安装 `Scoop`: 访问[Scoop安装](https://github.com/ScoopInstaller/Install#readme), 按照 **Prerequisites** 和 **Typical Installation** 执行脚本, 执行完成后就已经安装好 `Scoop` 了
   - 或者有个更简单的方法, 打开 **PowerShell** 后执行以下脚本 (此脚本就在 [Scoop官网](https://scoop.sh/) 上)
   ```bash
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
   ```
5. 在 [Scoop官网](https://scoop.sh/) 搜索 **vscode**, 按照右侧的指令来执行, 便可从 `Scoop` 上安装 `VSCode` 了
![Scoop VSCode](/images/scoop-install-vscode/scoop-vscode.png)
   - 但是默认安装的会是官方最新发布版, 也就是说我如果安装默认版本, 那跟我原来的 `VSCode` 是一样的, 想要安装指定版本, 可以在这样:
   ```bash
   scoop install vscode@1.110.1
   ```
6. 安装完成后, 具体的安装目录以及生成右键菜单之类的都写在 **PowerShell** 中
7. 到这里已经是把 `VSCode` 安装好了, 可以进入安装目录, 找到软件然后 **右键-属性** 查看版本信息, 确认是否安装了指定的版本

## 在新的VSCode中加载配置文件

这里非常简单, 就一步

8. `ctrl + shift + p` 召唤命令面板, 输入 **download**, 选择 **Syncing: Download Settings**, 回车即可
![Type download in vscode](/images/scoop-install-vscode/type-download-in-vscode.png)

我的情况是按回车后就自动给我应用那些配置了, 可能是我的 `Gist` 中只有这么一个配置文件所以识别出来就直接帮我应用了吧

## 总结

折腾总是有用的, 至少让我知道了三个工具

- `Syncing`: 现在即便在别的电脑上使用 `VSCode`, 也不用每次都重新调整那些繁琐的配置了
- `GitHub Gist`: 以前我会在 `GitHub` 上建个 `private` 的仓库, 然后上传自己的一些零散的配置文件, 现在知道了有 `Gist` 这个东西后（信我，我真的是个 **GitHub超级新手**）, 我就不用特地为那些简单的配置文件而去建个仓库了, 杀鸡焉用牛刀, XD
- `Scoop`: 简直是软件管理和软件版本管理的利器! 这上边还有很多很多我有在用的工具(比如 `nvm`), 后续可能慢慢都迁移到这上边吧, 方便统一管理

最后, 希望微软团队尽快修复 `VSCode` 的这个bug...

### 参考资料

- [Syncing 中文文档](https://github.com/nonoroazoro/vscode-syncing/blob/HEAD/README.zh-CN.md)
- [Scoop Installer's Readme](https://github.com/ScoopInstaller/Install#readme)