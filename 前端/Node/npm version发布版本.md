[ pixiv: i dont know]: # "http://xlzy520.cn/Rem/illustration/Rem/6.jpg"

### version
每个npm包都有一个package.json，如果要发布包的话，package.json里面的version字段就是决定发包的版本号了。

version字段是这样一个结构： `0.0.1`，是有三位的版本号。分别是对应的version里面的：`major`, `minor`, `patch`。
也就是说当发布大版本的时候会升级为 `1.0.0`，小版本是`0.1.0`，一些小修复是`0.0.2`。

### npm version
为了方便用户更改版本号，npm有`npm version`这个命令来自动更改版本号，同时帮忙commit.
比如说 当前版本是 1.1.1，当执行 `npm version patch -m '[patch]'`的时候，会自动把package.json里面的`version`改为`1.1.2`，同时git会多一个`commit log [patch]`,这次改动便是更改package.json。

如果执行了`prepatch`，版本号会从`1.1.1`变成 `1.1.2-0`

我们称版本号的三位分别是  大号.中号.小号-预发布号

### 各个命令功能
|  newversion   | 功能                                                         |
| :-----------: | :----------------------------------------------------------- |
| Authorization | 2312321111111111111111111111111111111111111111<br>dsadasdasdsadddddddddddddddddddddddddsadadsa |
|               |                                                              |
| Authorization | input                                                        |
| Authorization | input                                                        |
| Authorization | input                                                        |



```shell
"patch": "npm version patch && git push origin master && git push origin --tags",
"minor": "npm version minor && git push origin master && git push origin --tags",
"major": "npm version major && git push origin master && git push origin --tags"
```
### 注意
需要注意的是，使用 `npm version <newversion>` 命令，需要当前工作区为`clean`状态，否则会执行失败。