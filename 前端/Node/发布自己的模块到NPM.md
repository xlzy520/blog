# 发布自己的模块到NPM

发布自己的npm插件时，或者fork了他人的项目，需要改动之后及时使用的情况下，可以发布自己的模块到npm。

## 注册npm

打开[NPM](https://www.npmjs.com/)，然后注册、登录。

## 修改配置文件package.json

**1)name：**
名称，发布的模块名称，发布线上后，可以通过npm install xxxx来引用该模块
**2)description**
描述，该模块的简单描述
**3)version：**
版本号，版本号分为A.B.C三位
A表示主版本号，如果有较大变动，且向下不兼容，需要更新，A为零时表示软件还在开发阶段
B表示次版本号，如果是新增了功能，而且向下兼容，需要更新
C表示补丁版本号，如修复bug
**4)author**
作者信息
**5）license**
代码授权许可，[具体编写可参考这里](https://links.jianshu.com/go?to=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FCategory%3A%25E8%2587%25AA%25E7%2594%25B1%25E8%25BB%259F%25E9%25AB%2594%25E6%258E%2588%25E6%25AC%258A)
**6）main**
主入口文件，该属性指定了程序的主入口文件。即如果你的模块被命名为foo，用户安装了这个模块并通过require("foo")来使用这个模块，那么require返回的内容就是main属性指定的文件中 module.exports指向的对象。
**7）keywords**
关键词，可以通过npm搜索你填写的关键词找到你的模块
**8）bugs**
填写一个bug提交地址或者一个邮箱，被你的模块坑到的人可以通过这里吐槽

## 发布

```shell
npm login // 登陆 
npm publish // 发布
// 如果使用淘宝镜像 登陆会报错
// code E409
// npm ERR! 409 Conflict - PUT https://registry.npm.taobao.org/-/user/org.couchdb.user:XXX - conflict
//请使用如下命令
npm login --registry http://registry.npmjs.org
npm publish --registry http://registry.npmjs.org
```

然后就可以使用npm install安装了，登录npm可以查看该模块的详细情况。