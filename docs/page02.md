# Vscode插件开发

## 安装脚手架

::: code-group
```sh [npm]
npm install -g yo generator-code
```
:::

## 使用脚手架创建一个插件模板

::: code-group
```sh [npm]
yo code
```
:::

根据下图选择创建一个ts的插件模板,一定要使用`npm`，不然打包会失败(当前时间是`2024/07/25`以后不知道还会不会有这样的问题🙃)
![创建插件模板](/images/创建插件模板.png "创建插件模板")

## 安装一下依赖

::: code-group
```sh [npm]
npm install
```
:::

## 运行一下默认生成的插件
`ctrl`+`shift`+`p`打开命令输入栏，输入`hello`，选择插件对应的`Hello World`,右下角会出现弹窗，恭喜你已经成功的开发了一个Vscode插件了😆
![运行模板插件](/images/运行模板插件.png "运行模板插件")

## 打包插件
为什么现在就打包呢？🧐因为后面就是修改模板中的内容，先把打包学了，之后写完插件之后就有印象怎么去打包插件了。当然，你也可以先跳过这个步骤。😀

### 安装打包需要的库
还记得之前创建模板时说过的话吗？🧐如果不是用`npm`安装依赖的话，打包可能会失败，可以把`node_modules`目录删除，重新使用`npm`去安装依赖。😀

::: code-group
```sh [npm]
npm i vsce -g
```
:::
### 本地打包
本地打包成vsix文件，然后在本地安装，这种方式非常快捷😀，在当前项目的根目录下执行下面的命令就会在当前目录下生成一个`.vsix`文件，右键就可以在本地安装了。🧐

::: code-group
```sh [npm]
vsce package
```
:::

### 发布到应用市场
`Visual Studio Code`的应用市场基于微软自己的`Azure DevOps`，插件的身份验证、托管和管理都是在这里。首先访问 https://login.live.com/ 登录或者注册Microsoft账号，然后访问： https://aka.ms/SignupAzureDevOps ，如果你从来没有使用过Azure，默认会创建一个以邮箱前缀为名的组织，然后再生成一个Token，Token的配置按照下面的图片去选择，这个Token在发布的时候需要。😉

![注册插件发布页面](/images/注册插件发布页面.png "注册插件发布页面")

要注意保存好生成的Token信息，然后通过访问
https://marketplace.visualstudio.com/manage
创建发布账号，然后在插件开发的根目录执行下面的命令，登录的时候就会让你输入刚刚创建的Token信息。😉

::: code-group
```sh [npm]
vsce login 刚刚创建的账号名字
```
:::

### 发布插件到插件市场
在插件开发的根目录执行下面的命令，就会把插件发布到插件市场，需要等待一会，然后就可以在插件市场搜索到你的插件了。😉

::: code-group
```sh [发布插件]
vsce publish
```

```sh [发布插件时版本自增]
vsce publish patch
```

```sh [取消发布]
vsce unpublish (publisher name).(extension name)
```
:::

## 注册指令
修改`src/extension.ts`文件的内容🧐
```ts
import * as vscode from 'vscode';

/**
 * 插件被激活时触发，所有代码总入口
 * @param context 插件上下文
 */
export function activate(context: vscode.ExtensionContext) {

	// 弹出提示信息
	vscode.window.showInformationMessage('插件已被激活');
	// 注册指令 say.Hello 是指令名字
	let disposable = vscode.commands.registerCommand('say.Hello', () => {
		// 调用指令会做的事情
		vscode.window.showInformationMessage('Hello');
	});
	context.subscriptions.push(disposable);
}

/**
 * 插件被释放时触发
 */
export function deactivate() {
	vscode.window.showInformationMessage('插件已被释放');

}
```

然后再修改`package.json`文件🧐,测试运行一下看看，正常的话，你应该会看到右键菜单中多了一个`say`的选项，按下快捷键`ctrl`+`alt`+`s`，会弹出一个提示框，提示`Hello`。😉
```json
{
    "contributes": {
    "commands": [
      // command 是指令名字
      // title 是菜单名字
      {
        "command": "say.Hello",
        "title": "say"
      }
    ],
    "keybindings": [
      // command 是指令名字
      // key 是快捷键
      {
        "command": "say.Hello",
        "key": "ctrl+alt+s",
        "when": "editorTextFocus"
      }
    ],
    "menus": {
      // 右键菜单
      "editor/context": [
        {
          "when": "editorFocus",
          "command": "say.Hello",
          "group": "navigation"
        }
      ]
    }
  }
}
```
## `package.json`详细配置
插件的配置都在这里，好好看看这个说不定对你很有帮助呢🤔
```json
{
	// 插件的名字，应全部小写，不能有空格
    "name": "vscode-plugin-demo",
	// 插件的友好显示名称，用于显示在应用市场，支持中文
    "displayName": "VSCode插件demo",
	// 描述
    "description": "VSCode插件学习",
	// 关键字，用于应用市场搜索
    "keywords": ["vscode", "plugin", "demo"],
	// 版本号
    "version": "1.0.0",
	// 发布者，如果要发布到应用市场的话，这个名字必须与发布者一致
    "publisher": "da",
	// 表示插件最低支持的vscode版本
    "engines": {
        "vscode": "^1.27.0"
    },
	// 插件应用市场分类，可选值： [Programming Languages, Snippets, Linters, Themes, Debuggers, Formatters, Keymaps, SCM Providers, Other, Extension Packs, Language Packs]
    "categories": [
        "Other"
    ],
	// 插件图标，至少128x128像素
    "icon": "images/icon.png",
	// 扩展的激活事件数组，可以被哪些事件激活扩展，后文有详细介绍
    "activationEvents": [
        "onCommand:extension.sayHello"
    ],
	// 插件的主入口
    "main": "./out/extension.js",
	// 贡献点，整个插件最重要最多的配置项
    "contributes": {
		// 插件配置项
		"configuration": {
            "type": "object",
			// 配置项标题，会显示在vscode的设置页
            "title": "vscode-plugin-demo",
            "properties": {
				// 这里我随便写了2个设置，配置你的昵称
                "vscodePluginDemo.yourName": {
                    "type": "string",
                    "default": "guest",
                    "description": "你的名字"
                },
				// 是否在启动时显示提示
                "vscodePluginDemo.showTip": {
                    "type": "boolean",
                    "default": true,
                    "description": "是否在每次启动时显示欢迎提示！"
                }
            }
        },
		// 命令
        "commands": [
            {
                "command": "extension.sayHello",
                "title": "Hello World"
            }
        ],
		// 快捷键绑定
        "keybindings": [
            {
                "command": "extension.sayHello",
                "key": "ctrl+f10",
                "mac": "cmd+f10",
                "when": "editorTextFocus"
            }
        ],
		// 菜单
        "menus": {
			// 编辑器右键菜单
            "editor/context": [
                {
					// 表示只有编辑器具有焦点时才会在菜单中出现
                    "when": "editorFocus",
                    "command": "extension.sayHello",
					// navigation是一个永远置顶的分组，后面的@6是人工进行组内排序
                    "group": "navigation@6"
                },
                {
                    "when": "editorFocus",
                    "command": "extension.demo.getCurrentFilePath",
                    "group": "navigation@5"
                },
                {
					// 只有编辑器具有焦点，并且打开的是JS文件才会出现
                    "when": "editorFocus && resourceLangId == javascript",
                    "command": "extension.demo.testMenuShow",
                    "group": "z_commands"
                },
                {
                    "command": "extension.demo.openWebview",
                    "group": "navigation"
                }
            ],
			// 编辑器右上角图标，不配置图片就显示文字
            "editor/title": [
                {
                    "when": "editorFocus && resourceLangId == javascript",
                    "command": "extension.demo.testMenuShow",
                    "group": "navigation"
                }
            ],
			// 编辑器标题右键菜单
            "editor/title/context": [
                {
                    "when": "resourceLangId == javascript",
                    "command": "extension.demo.testMenuShow",
                    "group": "navigation"
                }
            ],
			// 资源管理器右键菜单
            "explorer/context": [
                {
                    "command": "extension.demo.getCurrentFilePath",
                    "group": "navigation"
                },
                {
                    "command": "extension.demo.openWebview",
                    "group": "navigation"
                }
            ]
        },
		// 代码片段
        "snippets": [
            {
                "language": "javascript",
                "path": "./snippets/javascript.json"
            },
            {
                "language": "html",
                "path": "./snippets/html.json"
            }
        ],
		// 自定义新的activitybar图标，也就是左侧侧边栏大的图标
        "viewsContainers": {
            "activitybar": [
                {
                    "id": "beautifulGirl",
                    "title": "美女",
                    "icon": "images/beautifulGirl.svg"
                }
            ]
        },
		// 自定义侧边栏内view的实现
        "views": {
			// 和 viewsContainers 的id对应
            "beautifulGirl": [
                {
                    "id": "beautifulGirl1",
                    "name": "国内美女"
                },
                {
                    "id": "beautifulGirl2",
                    "name": "国外美女"
                },
                {
                    "id": "beautifulGirl3",
                    "name": "人妖"
                }
            ]
        },
		// 图标主题
        "iconThemes": [
            {
                "id": "testIconTheme",
                "label": "测试图标主题",
                "path": "./theme/icon-theme.json"
            }
        ]
    },
	// 同 npm scripts
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "pretest": "npm run compile && npm run lint",
    "lint": "eslint src --ext ts",
    "test": "vscode-test"
  },
	// 开发依赖
  "devDependencies": {
    "@types/vscode": "^1.89.0",
    "@types/mocha": "^10.0.6",
    "@types/node": "18.x",
    "@typescript-eslint/eslint-plugin": "^7.7.1",
    "@typescript-eslint/parser": "^7.7.1",
    "eslint": "^8.57.0",
    "typescript": "^5.4.5",
    "@vscode/test-cli": "^0.0.9",
    "@vscode/test-electron": "^2.3.9"
  },
	// 后面这几个应该不用介绍了
    "license": "开源协议",
    "bugs": {
        "url": "地址/issues"
    },
    "repository": {
        "type": "git",
        "url": "仓库地址"
    },
	// 主页
    "homepage": "地址/README.md"
}
```