# 礼赞编码下载

支持浏览器：谷歌浏览器、QQ 浏览器、Edge 浏览器、360 浏览器等，请不要使用 IE 浏览器。

## 效果

原“查询奖励编码”页面，会多出一个导出按钮，选择对应的订单即可下载。如图：

![下载](../assets/lizan-code-download.png)

## 方法

### 1. 打开控制台

打开浏览器后，进入礼赞页面并登录。  
按 F12 打开开发者面板，点击 console（或叫控制台），找到输入代码的位置。

![console图](../assets/lizan-console-1.png)

### 2. 执行代码

复制以下代码到 console 区域按回车执行  
`(鼠标移入下面的代码区域，右上角有图标可点击复制)`

```js
/**
 * @author 随风
 * @date 2023-08-21
 * @version v1.2
 */
(function () {
  function tableToExcel(tableData, name) {
    // 列标题，逗号隔开，每一个逗号就是隔开一个单元格
    var str = `编码,物品\n`; // 增加\t为了不让表格显示科学计数法或者其他格式
    for (var i = 0; i < tableData.length; i++) {
      for (var key in tableData[i]) {
        str += `${tableData[i][key] + "\t"},`;
      }
      str += "\n";
    } // encodeURIComponent解决中文乱码
    var uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str); // 通过创建a标签实现
    var link = document.createElement("a");
    link.href = uri; // 对下载的文件命名
    link.download = name + ".csv";
    link.click();
  }

  var isDownloading = false;

  function getTable(id, name) {
    if (isDownloading) return alert("正在下载中");
    isDownloading = true;
    var ret = [];
    var maxPage = 1;
    function tableToRet(t) {
      $(t)
        .find("tr")
        .each(function (i, tr) {
          ret.push({
            code: $(tr).children().eq(0).text(),
            name: $(tr).children().eq(1).text(),
          });
        });
    }
    function getPageTable(page, fn) {
      if (page <= maxPage) {
        $.get(
          "https://chdact2.web.sdo.com/project/120629lz/orderlist.asp?id=" +
            id +
            "&page=" +
            page,
          function (res) {
            var pageDom = $(res);
            maxPage = pageDom.find("span").text().match(/\d+/g)?.[0];
            if (!maxPage) {
              isDownloading = false;
              return alert("暂无数据");
            }
            console.log("【" + page + "/" + maxPage + "】数据获取中");
            $("#downloadExcel").text("下载中" + page + "/" + maxPage);
            tableToRet(pageDom.find("table"));
            getPageTable(+page + 1, fn);
          }
        );
      } else {
        fn();
      }
    }
    getPageTable(1, function () {
      console.log("【获取完成】准备下载中");
      isDownloading = false;
      $("#downloadExcel").text("导出为表格");
      tableToExcel(ret, name);
    });
  }

  function initialScript() {
    var id = "downloadExcel";
    $("#" + id).remove();
    $("#tip8").append(
      '<button id="' +
        id +
        '" style="position: absolute;top: 18px;left: 450px; font-size: 16px">导出为表格</button>'
    );
    $("#" + id).click(function () {
      downLoad();
    });
  }

  function downLoad() {
    var select = $("#tip8").find(".on").text();
    var date =
      new Date().getFullYear() +
      "." +
      (new Date().getMonth() + 1) +
      "." +
      new Date().getDate();

    if (select === "历史订单") {
      getTable(2, date + "礼赞历史数据");
    } else if (select === "当前订单") {
      getTable(1, date + "礼赞最近订单");
    }
  }

  initialScript();
})();
```

### 3. 选择下载

执行完代码后，原“查询奖励编码”页面，会多出一个导出按钮，选择对应的订单即可下载。如图：

![下载](../assets/lizan-code-download.png)
