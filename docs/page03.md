# Git的使用

## 安装
去git的官网下载安装包安装就行 https://git-scm.com/ 😀

## 基本使用

### 设置签名
级别优先级，就近原则 仓库 > 系统 😉
::: code-group
```bash [仓库级别签名]
git config user.name code
git config user.emali code@code.com
```

```bash [全局级别签名]
git config --global user.name code
git config --global user.emali code@code.com
```
:::

### 初始化一个git仓库
在需要创建仓库的文件夹下打开终端，执行后会在当前目录下生成一个`.git`的文件夹🤪

::: code-group
```bash
git init
```
:::

### 添加文件到暂存区
::: code-group
```bash [添加所有文件]
git add . 
```

```bash [添加指定文件]
git add 指定文件1 指定文件2 ... 
```
:::

### 查看文件状态
::: code-group
```bash [查看文件状态]
git status
```
:::

### 提交到本地仓库
如果没有`add`的话是提交不成功的，这里是在本地提交，相当于在本地存档了😉
::: code-group
```bash [提交到本地仓库]
git commit -m "提交信息"
```
:::

### 查看历史记录
::: code-group
```bash [查看历史记录]
git log
```

```bash [查看历史记录]
git reflog
```

```bash [查看一行记录]
git log --pretty=oneline
```

```bash [查看一行记录]
git log --oneline
```
:::

### 前进后退
可以回到指定的存档地点😆，只要存档了就不怕误操作了😁
::: code-group
```bash [使用局部索引值]
# 通过log查看局部索引
git reset --hard [局部索引值]
```

```bash [使用^符号]
# 一个^后退一步n个后退n步
git reset --hard HEAD^
```

```bash [使用~符号]
# 后退n步
git reset --hard HEAD~n
```
:::

### 比较文件差异
::: code-group
```bash [比较工作区和暂存区]
git diff
```

```bash [比较暂存区和本地仓库]
git diff --cached
```

```bash [比较工作区和本地仓库]
git diff HEAD
```
:::

### 分支管理
::: code-group
```bash [查看分支]
git branch
```

```bash [创建分支]
git branch 分支名
```

```bash [切换分支]
git checkout 分支名
```

```bash [创建+切换分支]
git checkout -b 分支名
```

```bash [合并分支]
git merge 分支名
```

```bash [删除分支]
git branch -d 分支名
```
:::

### 创建远程库地址别名
::: code-group
```bash [创建远程库地址别名]
git remote add [别名] [远程地址]
```

```bash [查看当前所有远程地址别名]
git remote -v
```
:::

### 推送到远程仓库
::: code-group
```bash [指定别名和分支名推送]
git push 别名 分支名
```

```bash [推送到默认的远程仓库对应的主分支]
git push
```
:::

### 从远程仓库克隆
::: code-group
```bash [克隆远程仓库]
git clone [远程仓库地址]
```
:::

### 从远程仓库拉取
::: code-group
```bash [拉取远程仓库]
git pull
```
:::

### 查看远程仓库信息
::: code-group
```bash [查看远程仓库信息]
git remote show [远程仓库别名]
```
:::

### Github设置SSH登录
::: code-group
```bash [生成SSH]
ssh-keygen -t rsa -C "邮箱地址"
```
:::
进入`.ssh`目录，复制`id_rsa.pub`文件内容，登录`Github`,点击`用户头像`->`Settings`->`SSH and GPG keys`->`New SSH Key`，然后输入复制的密钥信息，再回到`Git bash`创建远程地址别名😀

::: code-group
```bash [创建远程地址别名]
git remote add origin_ssh [ssh链接]
```
:::

推送文件进行测试😄
