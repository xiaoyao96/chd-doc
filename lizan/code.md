# 礼赞编码下载 v1.3

支持浏览器：谷歌浏览器、QQ 浏览器、Edge 浏览器、360 浏览器等，请不要使用 IE 浏览器。  
功能：下载导出为excel、复制编码  
更新时间：2024.11.21

## 效果

原“查询奖励编码”页面，会多出两个按钮。  
`下载全页`：将当前订单所有页导出到一个excel文件表格中。  
`复制编码`：将当前订单所有页的编码全部复制到剪切板。  

![下载](../assets/lizan-code-download.jpg)

## 方法

### 1. 打开控制台

打开浏览器后，进入礼赞页面并登录。  
按 F12 打开开发者面板，点击 console（或叫控制台），找到输入代码的位置。

![console图](../assets/lizan-console-1.png)

### 2. 执行代码

复制以下代码到 console 区域按回车执行  
`(鼠标移入下面的代码区域，右上角有图标可点击复制)`

<<< @/snippets/lizan/export.js

### 3. 选择下载

执行完代码后，点击“查询奖励编码”页面，选择相应订单后，再点击下载或复制按钮。如图：

![下载](../assets/lizan-code-download.jpg)
