const { dialog, ipcMain } = require('electron');
const { mainWindow } = require('./electron');
const fs = require('fs-extra');
const xlsx = require('node-xlsx');
const path = require('path');
const _ = require('lodash');
var os = require("os");
const {
  macUrl,
  classListFile
} = require('./config');

const title = ['分类', '标题', '内容', '创建时间', '最后更新时间'];
const classList = [];

// 读取分类列表
readClassList = () => {
  let filePath = '';
  if (os.type() === 'Darwin') {
    filePath = path.join(macUrl, classListFile);
  } else {
    filePath = path.join(process.cwd(), classListFile);
  }

  fs.readFile(filePath, 'utf-8', (err, data) => {
    try {
      const rows = data.split('\r\n');
      for (let i = 0; i < rows.length; i++) {
        classList.push(rows[i]);
      }
    } catch (err) {
      throw err;
    }
  });

};
readClassList();

// 读取分类选项
ipcMain.on('get-class-list', (event, arg) => {
  event.reply('get-class-list-reply', classList);
})

// 导出文件
ipcMain.on('export', (event, arg) => {
  dialog
    .showSaveDialog(mainWindow, {
      title: 'save',
      filters: [
        {
          name: '文件',
          extensions: ['xlsx']
        }
      ],
    })
    .then(result => {
      const filename = result.filePath;
      const data = arg[0];
      const list = [title];
      data.map(item => {
        list.push([item.class, item.title, item.content, item.createDate, item.updateDate]);
      });

      if (filename) {
        fs.writeFile(filename, writeXls(list), 'utf8', (err) => {
          if (err) throw err;
        });
        event.reply('export-file-reply', true);
      }
    })
    .catch(err => {
      console.log(err);
    });
});

writeXls = (datas) => {
  return xlsx.build([{
   name: '记录',
   data: datas
  }])
}

