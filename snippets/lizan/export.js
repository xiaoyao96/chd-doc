/**
 * @author 随风
 * @date 2024-11-21
 * @version v1.3
 */
(function () {
  var id = "sf-chd-tool";
  var version = "v1.3";
  function loadScript(src, id) {
    return new Promise((resolve, reject) => {
      window.define = undefined;
      if (id && document.getElementById(id)) {
        resolve(`Script with id ${id} already exists.`);
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.type = "text/javascript";
      if (id) {
        script.id = id;
      }
      script.onload = () => {
        resolve(`Script loaded: ${src}`);
      };
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${src}`));
      };
      document.body.appendChild(script);
    });
  }
  async function tableToExcel(tableData, filename) {
    await loadScript(
      "https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.mini.min.js",
      "xlsx"
    );
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      tableData.map((item) => ({
        编码: item.code, // 自定义列名
        名称: item.name, // 自定义列名
      }))
    );
    const wscols = [
      { wch: 30 }, // code 列宽度
      { wch: 30 }, // name 列宽度
    ];
    ws["!cols"] = wscols;
    ws["A1"].s = { numFmt: "@" }; // A1 为 code 列的单元格，设置为文本格式
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, filename + ".xlsx");
  }

  async function tableToCopy(tableData, filename) {
    const content = tableData.map((item) => item.code).join("\n");
    const input = document.createElement("textarea");
    input.value = content;
    document.body.appendChild(input);
    input.style.userSelect = "auto";
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    alert(``);
  }

  var isDownloading = false;

  function getTable(id, callback) {
    if (isDownloading) return alert("正在下载中");
    isDownloading = true;
    var ret = [];
    var maxPage = 1;
    function tableToRet(t) {
      getWindow()
        .$(t)
        .find("tr")
        .each(function (i, tr) {
          ret.push({
            code: getWindow().$(tr).children().eq(0).text(),
            name: getWindow().$(tr).children().eq(1).text(),
          });
        });
    }
    function getPageTable(page, fn) {
      if (page <= maxPage) {
        getWindow().$.get(
          "https://chdact2.web.sdo.com/project/120629lz/orderlist.asp?id=" +
            id +
            "&page=" +
            page,
          function (res) {
            var pageDom = getWindow().$(res);
            maxPage = pageDom.find("span").text().match(/\d+/g)?.[0];
            if (!maxPage) {
              isDownloading = false;
              return alert("暂无数据");
            }
            console.log("【" + page + "/" + maxPage + "】数据获取中");
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
      callback(ret);
    });
  }

  function initialScript() {
    getWindow()
      .$("#" + id)
      .remove();
    getWindow()
      .$("#tip8")
      .append(
        `<div id="${id}" style="position: absolute;top: 18px;left: 430px; font-size: 16px">
      <button>下载全页</button>
      <button>复制编码</button>
      </div>`
      );
    getWindow()
      .$("#" + id)
      .children("button")
      .eq(0)
      .click(function () {
        downLoad().then(({ ret, date }) => {
          tableToExcel(ret, date + "礼赞历史数据");
        });
      });
    getWindow()
      .$("#" + id)
      .children("button")
      .eq(1)
      .click(function () {
        downLoad().then(({ ret, date }) => {
          tableToCopy(ret, date + "礼赞历史数据");
        });
      });
    console.log("礼赞编码下载器" + version + "已加载，请点击页面内“查询奖励编码”");
  }

  function downLoad() {
    return new Promise((resolve) => {
      var select = getWindow().$("#tip8").find(".on").text();
      var date =
        new Date().getFullYear() +
        "." +
        (new Date().getMonth() + 1) +
        "." +
        new Date().getDate();

      if (select === "历史订单") {
        getTable(2, (ret) => resolve({ date, ret }));
      } else if (select === "当前订单") {
        getTable(1, (ret) => resolve({ date, ret }));
      }
    });
  }
  function getWindow() {
    const frame = document.querySelector('[name="mainFrame"]');
    if (frame) {
      return frame.contentWindow;
    }
    return window;
  }
  initialScript();
})();
