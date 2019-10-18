# Proxy代理

代理在前端开发中经常需要使用，一般用于解决前端开发的跨域问题。

## 示例

```js
 '/test': {
        target: 'http://192.168.0.237',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/test': '/'
        }
      },
```

实际请求为：`http://192.168.0.237/test`

假如后端接口中并没有test模块，那么需要`pathRewrite`改变url

|    target    | 代理对象                     |
| :----------: | :--------------------------- |
|    target    | 代理对象的目标地址           |
|      ws      | websocket代理                |
| changeOrigin | 改变发送请求头中host为target |
| pathRewrite  | 重写path                     |

