---
title: Git常用命令
date: 2020-08-08T22:00:00.000+08:00
---

其实我所在的组负责的项目是用 `SVN` 的，但也挺羡慕隔壁组的工作，用的 `Vue2` 技术栈， `Git` 代码管理工具，不过偶尔需要参考他们的东西，也是会用到 `Git`。想起多年以前在实习的公司里也是用 `Git`，现在借此机会趁机拾起来吧

## 基础配置与初始化

- **配置用户信息**
```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

- **初始化仓库：** 在当前目录创建一个新的 `Git` 仓库
```bash
git init
```

- **克隆远程仓库：** 下载一个现有的项目
```bash
git clone <远程仓库URL>
```

## 常用操作流程（最核心）

- **查看状态：** 看看哪些文件被修改了，哪些还没提交
```bash
git status
```

- **添加暂存：** 将修改过的文件加入“待提交名单”
```bash
git add <文件名>    # 添加单个文件
git add .           # 添加当前目录下所有修改
```

- **提交保存：** 将暂存区的内容正式存入本地仓库
```bash
git commit -m "提交说明信息"
```

- **推送远程：** 将本地的提交推送到服务器
```bash
git push -u origin <分支名>     # 首次推送需加 -u 建立关联
git push                        # 后续直接push
git push origin <分支名>        # 推送指定分支
```

## 分支管理（协作核心）

- **查看分支**
```bash
git branch
```

- **创建并切换分支**
```bash
git checkout -b <新分支名>

# 等价于
git branch <新分支名>    # 创建分支
git checkout <新分支名>  # 切换到 <新分支名> 这个分支
```

- **合并分支：** 将指定分支合并到当前分支
```bash
git merge <目标分支名>
```

- **删除分支**
```bash
git branch -d <分支名>
```

- **重命名分支**
```bash
git branch -m <原分支名> <新分支名>
```

## 远程协作

- **拉取更新：** 获取远程仓库的最新代码并自动合并到本地
```bash
git pull
```

- **获取但不合并：** 只下载远程更新，不改动本地代码（更安全，方便检查后再合并）
```bash
git fetch
```

## 撤销与回退

- **工作区撤销**（未add）
```bash
git checkout -- <文件名>     # 丢弃工作区修改
git checkout -- .            # 丢弃所有修改
```

- **暂存区撤销**（已add未commit）
```bash
git reset HEAD <文件名>      # 撤销add
git reset HEAD               # 撤销所有add
```

- **回退版本**（已commit）
```bash
git reset --soft HEAD~1         # 回退到上一个版本，保留工作区和暂存区
git reset --mixed HEAD~1        # 默认，回退并清空暂存区
git reset --hard HEAD~1         # 彻底回退（危险，会丢失修改）
git reset --hard <commit_id>    # 回退到指定版本
```

- **远程回退**（已push）
```bash
# 生成新提交抵消旧提交（安全）
git revert <commit-id>

# 批量回退连续的多次提交
git revert -n <最老的那次要回退的commit_id>^..<最新的那次要回退的commit_id>
```

- **在本地停止追踪某个tracked文件**（已提交过远程）
```bash
# 停止追踪
git update-index --skip-worktree <file-path>

# 恢复追踪
git update-index --no-skip-worktree <file-path>

# 查看哪些文件被设置了该状态
git ls-files -v | grep '^S'
```

- **要切换分支，但当前修改又不想提交**
```bash
# 暂存当前的修改
git stash

# 执行一些切换分支的操作。。。

# 恢复之前的修改
git stash pop
```

### 一些注意事项

如果不小心执行了 `git reset --hard` 导致代码丢失，先别惊慌。只要之前提交过，`Git` 就会记录下每一次 `HEAD` 的变动
1. 输入 `git reflog` 查看所有的历史操作记录
2. 找到丢失代码前的那个 `commit_id`
3. 再次执行 `git reset --hard <commit_id>` 即可“穿越”回去

这些都是日常用到的命令，对于日常工作应该也够用了，实际操作比较麻烦的地方就是解决冲突之类。一般只要按照正常流程提交，其实不太会出错，除非实在有需要回退版本，这个也是比较容易混淆的，此文也针对不同阶段作了举例
