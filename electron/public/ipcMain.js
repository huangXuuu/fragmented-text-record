const { dialog, ipcMain } = require('electron');
const { mainWindow } = require('./electron');
const exec = require('child_process').exec;
const fs = require('fs-extra');
const xlsx = require('node-xlsx');
const path = require('path');
const _ = require('lodash');
var os = require("os");
const {
  macUrl,
  classListFile,
  indexFile,
  elasticSearchFilePath
} = require('./config');

const title = ['分类', '标题', '内容', '创建时间', '最后更新时间'];
let classList = [];
let indexInfo = {};
let dbPath = '';


classListConversion = (list) => {
  let content = '';
  list.map(x => {
    content += `${x}\r\n`;
  })

  return content;
}

// 获取文件路径
getFilePath = (fileType) => {
  let filePath = '';
  if (os.type() === 'Darwin') {
    filePath = path.join(macUrl, fileType);
  } else {
    filePath = path.join(process.cwd(), fileType);
  }

  return filePath;
}

// 读取DB位置
readDBPath = () => {
  const filePath = getFilePath(elasticSearchFilePath);
  readDBPathFile(filePath);
};

// 读取DB文件
readDBPathFile = (filePath) => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        dbPath = '';
      } else {
        throw err;
      }
    } else {
      dbPath = data;
    }
  });
}

// 读取分类列表
readClassList = () => {
  const filePath = getFilePath(classListFile);
  readClassFile(filePath);
};

// 读取分类文件
readClassFile = (filePath) => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        classList = [];
      } else {
        throw err;
      }
    } else {
      const rows = data.split('\r\n');
      classList = rows.filter(x => !!x);
    }
  });
}

// 读取文集内容
readIndexInfo = () => {
  const filePath = getFilePath(indexFile);
  readIndexFile(filePath);
}

// 读取文集文件
readIndexFile = (filePath) => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        indexInfo = {};
      } else {
        throw err;
      }
    } else {
      const rows = data.split('\r\n');
      indexInfo.alias = rows[0];  // 索引名
      indexInfo.index = rows[1];  // 文集名
    }
  });
}

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

// 设置分类/文集文件
ipcMain.on('manage-save', (event, arg) => {
  const params = arg[0];
  if (params.indexInfo) {
    const filePath = getFilePath(indexFile);
    if (params.indexInfo.alias) {
      fs.writeFile(filePath, `${params.indexInfo.alias}\r\n${params.indexInfo.index}`, 'utf8', (err) => {
      })
    } else {
      fs.writeFile(filePath, ` \r\n `, 'utf8', (err) => {
      })
    }
  }

  if (params.classList) {
    const filePath = getFilePath(classListFile);
    const content = classListConversion(params.classList);
    fs.writeFile(filePath, content, 'utf8', (err) => {
    })
  }

  if (params.dbPath) {
    const filePath = getFilePath(elasticSearchFilePath);
    fs.writeFile(filePath, params.dbPath, 'utf8', (err) => {
    })
  }
});

// 取得分类/文集信息
ipcMain.on('manage-get', (event, arg) => {
  event.reply('manage-get-reply', {
    classList: classList,
    indexInfo: indexInfo,
    dbPath: dbPath
  });
});

// elasticSearch文件路径指定
ipcMain.on('elasticSearch-set', (event, arg) => {
  dialog.showOpenDialog(mainWindow).then(result => {
    event.reply('elasticSearch-set-reply', {
      dbPath: result.filePaths[0]
    })
    dbPath = result.filePaths[0];
  })
});

// elasticSearch起动
ipcMain.on('elasticSearch-up', (event, arg) => {
  fs.access(dbPath, (err) => {
    if (err) {
      throw err;
    } else {
      let cmd = '';
      if (os.type() === 'Darwin') {
        cmd = `sh ${dbPath}`;
      } else {
        cmd = `bat ${dbPath}`;
      }

      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          throw error;
        }
      });
    }
  });
});

readClassList();
readIndexInfo();
readDBPath();

writeXls = (datas) => {
  return xlsx.build([{
   name: '记录',
   data: datas
  }])
}

