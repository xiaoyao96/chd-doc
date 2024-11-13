{
  /**
   * @author 随风
   * @date 2024-11-13
   * @version v3.3
   */
  (function () {
    let c = 1;
    const delay = () => 2000 + Math.random() * 1000;
    hello();

    function hello() {
      console.log("%c礼赞自动抽取器v3.3", "font-weight: bold");
      console.log("更新时间：2024.11.13");
      console.log(
        "日志支持道具品质高亮：%c█ %c█ %c█ %c等",
        "color:" + getColorByQuality(3),
        "color:" + getColorByQuality(2),
        "color:" + getColorByQuality(1),
        "color: #000"
      );
    }

    let allCount = getCount();
    async function main() {
      if (allCount >= c) {
        const { Timestamp, Sign } = await getSign();
        const block = await getRandomBlock();
        await getAward({
          Position: block.id,
          Timestamp,
          Sign,
          allCount,
        });
        setTimeout(() => {
          main();
        }, delay());
      } else {
        console.log("%c抽奖次数已使用完毕。", "font-weight: bold");
      }
    }
    function request(url, data = {}) {
      return new Promise((resolve) => {
        getWindow()
          .$.getJSON(url, data)
          .done((json) => resolve(json));
      });
    }
    async function getSign() {
      return new Promise((resolve) => {
        getWindow()
          .$.ajax({
            url: "home.asp",
          })
          .done((html) => {
            const Timestamp = html.match(/var Timestamp="(\d+)";/)[1];
            const Sign = html.match(/var Sign="([a-zA-Z0-9]+)";/)[1];
            resolve({
              Timestamp,
              Sign,
            });
          });
      });
    }
    async function getRandomBlock() {
      const { data } = await request("Interface/getList.asp");
      const list = data.filter((item) => item.status === "block");
      const randomIndex = Math.floor(Math.random() * list.length);
      return list[randomIndex];
    }
    async function getAward({ Position, Timestamp, Sign, allCount }) {
      const json = await request("interface/getAward.asp", {
        t: Math.random(),
        ItemLevel: 1,
        Position,
        d: 1,
        Timestamp: Timestamp,
        Sign: Sign,
      });
      if (json.result >= 1) {
        consoleItem(json);
      } else if (json.result == -4) {
        console.log(
          `%c抽奖次数已使用完毕，已遗漏上报${
            allCount - c + 1
          }个奖励，请在我的订单中对比查询遗漏的奖励。`,
          "font-weight: bold"
        );
        throw new Error("脚本结束");
      }
    }
    function getCount() {
      return 5;
    }
    function getWindow() {
      const frame = document.querySelector('[name="mainFrame"]');
      if (frame) {
        return frame.contentWindow;
      }
      return window;
    }
    function getItemColor(name) {
      var qualityItem = [
        {
          quality: 3,
          list: [
            "[称号书]斗者意志",
            "[称号书]守护意志",
            "[称号书]杀手意志",
            "[称号书]均衡意志",
            "鹰隼之眼+9",
            "元素之障+9",
            "圣者之躯+9",
            "幻魔之殇+9",
            "狂战之力+9",
            "圣诞袜发夹+9",
            "圣诞袜耳环+9",
          ],
        },
        {
          quality: 2,
          list: [
            /^(.*?)\+15$/,
            /^龙晶(.*?)\+9$/,
            "龙晶[魔龙影]",
            "龙晶[金龙影]",
          ],
        },
        {
          quality: 1,
          list: [
            "白色恋人+4",
            "闪电银河+4",
            "塔罗之秘+4",
            "彩虹泡泡+4",
            "神·冰晶之护+4",
            "魔·骨龙之殇+4",
            "神·涅槃之焰+4",
            "神·圣灵之拥+4",
            "魔·沙罗双树+4",
            "魔·冥界之翼+4",
            "狂战之力+4",
            "幻魔之殇+4",
            "圣者之躯+4",
            "元素之障+4",
            "鹰隼之眼+4",
            "鬼武士的标徽x90",
          ],
        },
      ];
      var target = qualityItem.find(function (item) {
        return item.list.some(function (str) {
          if (str instanceof RegExp) {
            if (str.test(name)) {
              return true;
            }
          } else if (name === str) {
            return true;
          }
        });
      });

      return target ? getColorByQuality(target.quality) : "#000";
    }
    function getColorByQuality(quality) {
      var config = {
        1: "orange",
        2: "red",
        3: "#df03df",
      };
      return config[quality] || "#000";
    }
    function consoleItem(item) {
      var color = getItemColor(item.itemname);
      console.log(
        `${c++}/${allCount}: 恭喜您抽中了 %c${item.itemname}`,
        `color: ${color}`,
        ` ,领奖编码为 [ ${item.couponnum.split("#")[0]} ]!`
      );
    }

    function test() {
      let list = [
        {
          itemname: "鬼武士的标徽",
          couponnum: "1234567890123456#",
        },
        {
          itemname: "鹰隼之眼",
          couponnum: "1234567890123456#",
        },
        {
          itemname: "[称号书]守护意志",
          couponnum: "1234567890123456#",
        },
        {
          itemname: "玫瑰盛典",
          couponnum: "1234567890123456#",
        },
        {
          itemname: "白色恋人+4",
          couponnum: "1234567890123456#",
        },
        {
          itemname: "Lv9超级彩虹勋章(七彩)",
          couponnum: "1234567890123456#",
        },
        {
          itemname: "血焰之魂袜子+3",
          couponnum: "1234567890123456#",
        },
        {
          itemname: "龙晶[金龙影]",
          couponnum: "1234567890123456#",
        },
      ];
      allCount = list.length;
      list.forEach((json) => consoleItem(json));
    }

    return test();
  })();
}
