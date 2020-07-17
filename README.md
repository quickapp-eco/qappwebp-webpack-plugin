# 转换 webp 图片格式的 webpack 插件

适用快应用打包编译时，将图片格式转换为 webp 的 webpack 插件，旨在于缩小 rpk 包体积的同时，加快图片加载和渲染速度

## 使用

### 1.安装

```
npm install -D @quickapp-eco/qappwebp-webpack-plugin
```

### 2.使用

在快应用工程根目录的`hap.config.js`文件中添加如下配置（若没有`hap.config.js`文件，需要新增该配置文件）

快应用打包编译的 webpack 配置基础上会增加`hap.config.js`文件中的配置信息

```javascript
const QappWebpWebpackPlugin = require("@quickapp-eco/qappwebp-webpack-plugin");

module.exports = {
  plugins: [
    new QappWebpWebpackPlugin({
      match: /(jpe?g|png)$/,
      webp: {
        quality: 80
      },
      limit: 0,
      disable: false
    })
  ]
};
```

### QappWebpWebpackPlugin 参数

| 参数    |    类型    |       默认值        |                                         说明                                         |
| :------ | :--------: | :-----------------: | :----------------------------------------------------------------------------------: |
| match   | 正则字符串 | `/\.(png\|jpe?g)$/` |                           符合正则表达式的图片转换成 webp                            |
| limit   |   number   |          0          |                图片大小限制，大于 limit 的图片才会转换(以字节为单位)                 |
| webp    |   Object   |   `{quality: 80}`   | 是图片转换 webp 工具`sharp`的[配置](https://sharp.pixelplumbing.com/api-output#webp) |
| disable |  boolean   |       `false`       |                                   是否禁用转换处理                                   |

## License

[MIT](./LICENSE)
