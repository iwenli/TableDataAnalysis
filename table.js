var data = {
  "机柜资源": {
    "机柜总数": 9,
    "可售": 9,
    "预定": 0,
    "已售": 0,
    "故障": 0,
    "U位": {
      "总数": 0,
      "U位占用机柜": {
        "总数": 0,
        "可售": 0
      },
      "可售": 0
    }
  },
  "其他资源": {
    "IP": {
      "总数": 0,
      "可售": 0
    },
    "波分": {
      "总数": 0,
      "可售": 0
    },
    "纤芯": {
      "总数": 0,
      "可售": 0
    }
  }
};

/*
4 1 1 3
4 2 1 2
4 2 2 1  index + node + row   = deep  + 1 - node - index

dataDeep index [row] nodelDeel
5 1 1 4
5 2 3 2

*/


// table 渲染数据
var table = {};
// 对象深度
var dataDeep = getDeep(data);
// 对象叶子节点
var dataLeaf = getLeaf(data);

// console.log(getDeep(data['机柜资源']));

console.log(`对象深度：${dataDeep},叶子数：${dataLeaf}`);
// convert数据
mapTableData(data, 1, dataDeep);
console.log(table);
var html = renderTable(table);
document.write(html);




function mapTableData (ojb, index, parentDeep) {
  index = index || 1
  let keys = Object.keys(ojb);
  // console.table(keys);
  keys.forEach(key => {
    let node = ojb[key]
    let nodeDeep = getDeep(node)
    let nodeLeaf = getLeaf(node)
    if (typeof node === 'object') {
      pushTableObj(index, { key: key, row: 1, col: nodeLeaf })
      mapTableData(node, index + 1, parentDeep - 1)
    } else {
      // todo: 问题在这里
      pushTableObj(index, { key: key, row: parentDeep - nodeDeep, col: nodeLeaf })
      pushTableObj(dataDeep, { key: node, row: 1, col: 1 })
    }
  });
  return keys.length;
}
/**
 * @description: 推入数据
 * @param {type}
 * @return:
 */
function pushTableObj (index, obj) {
  if (!table.hasOwnProperty(index)) {
    table[index] = [];
  }
  table[index].push(obj)
}

/**
 * @description: 渲染表格
 * @param {type}
 * @return:
 */
function renderTable (obj) {
  let html = ['  <table>'];
  let keys = Object.keys(obj);
  keys.forEach(key => {
    // let row = obj[key];
    html.push(tr(obj[key]))
    // console.log(obj[key]);
  });
  html.push('</table>')
  return html.join('')
}
function tr (array) {
  var tr = ['<tr>']
  array.forEach(tdObj => {
    tr.push(td(tdObj))
  });
  tr.push('</tr>')
  return tr.join('')

  // <tr>
  //     <td rowspan="2">机柜总数</td>
  //     <td rowspan="2">可售</td>
  //     <td rowspan="2">预售</td>
  //     <td rowspan="2">已售</td>
  //     <td rowspan="2">故障</td>
  //     <td colspan="3">U位</td>
  //     <td colspan="2">IP</td>
  //     <td colspan="2">波分</td>
  //     <td colspan="2">纤芯</td>
  //   </tr>
}
function td (obj) {
  let td = ['<td ']
  if (obj.row > 1) {
    td.push(`rowspan="${obj.row}"`)
  }
  if (obj.col > 1) {
    td.push(` colspan="${obj.col}"`)
  }
  td.push(`>${obj.key}</td>`)
  console.log(td);
  return td.join('')
}



/**
 * @description: 对象深度
 * @param {type}
 * @return:
 */
function getDeep (obj) {
  var res = 1;
  (function myDeep (obj, num) {
    if (typeof obj === 'object') {
      for (var key in obj) {
        if (typeof obj[key] === 'object') {
          myDeep(obj[key], num + 1);
        } else {
          res = res < num + 1 ? num + 1 : res;
        }
      }
    }
    else {
      res = res > num ? res : num;
    }
  })(obj, 1)
  return res;
}


/**
 * @description: 对象叶子节点数
 * @param {type}
 * @return:
 */
function getLeaf (obj) {
  var res = 0;
  (function getLeaf (obj) {
    if (typeof obj === 'object') {
      for (var key in obj) {
        if (typeof obj[key] === 'object') {
          getLeaf(obj[key]);
        } else {
          res++;
        }
      }
    }
    else {
      res++;
    }
  })(obj)
  return res;
}