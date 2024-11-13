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
