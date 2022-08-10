const { app, BrowserWindow, ipcMain , Menu} = require('electron'); 
const isDev = require('electron-is-dev'); 
const path = require('path');
const sqlite3 = require('sqlite3');  
require('v8-compile-cache');
const moment = require('moment');
const axios = require('axios');
const  {machineId} = require('node-machine-id');
let mainWindow;  

app.disableHardwareAcceleration();
const { PosPrinter } = require("electron-pos-printer");

const db = new sqlite3.Database(
  isDev
    ? path.join(__dirname, '../db/salon.sqlite3') 
    : path.join(process.resourcesPath, 'db/salon.sqlite3'),
  (err) => {
    if (err) {
    
    } else {
     
    }
  }
);

Menu.setApplicationMenu(null);
var splash;

const createWindow = () => {

  splash = new BrowserWindow({width: 600, height: 300, alwaysOnTop: true, frame: false});
  splash.loadURL(`file://${path.join(__dirname, '../build/splash.html')}`);
  // splash.setMenu(null);
  // splash.setMenuBarVisibility(false);
  // splash.removeMenu();
  splash.show()

  mainWindow = new BrowserWindow({
    width: 600,
    height: 600, 
    show: false, 
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {   
      nodeIntegration: true,
      enableRemoteModule: true, 
      contextIsolation: true,
      preload: isDev 
        ? path.join(__dirname, './preload.js')
        : path.join(app.getAppPath(), './build/preload.js'),
    },
  });  
  mainWindow.webContents.on('did-finish-load', function() {
    console.log("public-did-finish-load")
    splash.destroy();
    mainWindow.show();
  });  
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:9000' 
      : `file://${path.join(__dirname, '../build/index.html')}`
  ); 
  // mainWindow.setIcon(path.join(__dirname, '/icon.png'));
  mainWindow.maximize();
  // mainWindow.setSize(1024, 768);
  mainWindow.setMenuBarVisibility(false);
  // mainWindow.setApplicationMenu(null);
    mainWindow.removeMenu();
  if (isDev) {
    mainWindow.webContents.on('did-frame-finish-load', () => {
      mainWindow.webContents.openDevTools();
    });
  } 
  /**app quit */
  mainWindow.on('quit', function(e){
    console.log("before-quit")
  }); 
  mainWindow.once('ready-to-show', () => {
    console.log("public-ready-to-show")
    
  }); 

  mainWindow.on('close', function(e){
    db.close();
    console.log("Closed event");
  })

};  

app.setPath(
  'userData',
  isDev
    ? path.join(app.getAppPath(), 'userdata/') 
    : path.join(process.resourcesPath, 'userdata/')
);

app.on('quit', ()=>{
  db.close();
  // window.localStorage.setItem("lastClosedOn", new Date().toISOString())
})

app.whenReady().then(async () => {
  createWindow(); 
});

// Exiting the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Activating the app
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Logging any exceptions
process.on('uncaughtException', (error) => {

  if (process.platform !== 'darwin') {
    app.quit();
  }
});


/// IPC METHODS

ipcMain.handle('checkdatabase',async () => { 
  return new Promise((resolve, reject) => { 
    new sqlite3.Database(
      isDev
        ? path.join(__dirname, '../db/salon.sqlite3') // my root folder if in dev mode
        : path.join(process.resourcesPath, 'db/salon.sqlite3'), // the resources path if in production build
          (err) => {
            
            if (err) {
              reject(err);
              return;
            } else { 
              resolve({asdasdasd:`Database opened`}) ;
            }
          }
    ); 
})
});

ipcMain.handle('getData',async (event, sql) => {  
  return new Promise((resolve, reject) => {    
    db.all( sql, (err , rows) => {
        resolve((err && err.message) || rows);
      }); 
  });
})

ipcMain.handle('saveData', async(event, sql)=>{ 
  return new Promise((resolve, reject) => {    
      var stmt = db.prepare(sql);
      console.log(sql);
      stmt.run();
      stmt.finalize();
      if(sql.toLowerCase().indexOf("insert")==0){
          db.all("SELECT last_insert_rowid() as id", (err, rows) => { 
            // console.log("####");
            // console.log(rows); 
            // console.log("####");
            resolve((err && err.message) || rows);
          });
      }
      else{
        // console.log("$$$$");
        // console.log("Saved successfully"); 
        // console.log("$$$$");
        resolve({msg:"Saved successfully"});
      }
  });
})

ipcMain.handle('getprinters', async(event)=>{
console.log("get printers called")
  return new Promise((resolve, reject) => {  
    let webContents = mainWindow.webContents;
    let printers = webContents.getPrinters() 
    resolve({printers:printers});
  });
})

ipcMain.handle('printData', async(event, input)=>{
  console.log(input);   
  var printerName = input.printername
  const data = input.data;
  return new Promise((resolve, reject) => {  
  var widthPage = '300px';
  console.log("printerName::",printerName)
  console.log("data::",data)
  let printerNameu = printerName
  const options = {
      preview: false, 
      width: widthPage, 
      margin: "100 100 100 100", 
      copies: 1, 
      printerName: printerNameu, 
      silent: true,
      pageSize: { height: 301000, width: 71000 } 
  }; 
  const d = [...data];

  if (printerNameu && widthPage) {
    console.log("asdads")
      PosPrinter.print(d, options)
      .then(() => {})
      .catch((error) => {
          console.error(error);
      });
  }  
  resolve({msg:"Printed successfully"}); 
});
})


ipcMain.handle('getTicketCode', async(event)=>{
var date = (await axios('/', {'method': 'HEAD'})).headers.get('date');
 console.log("Date now :::: ", new Date().toISOString(), moment().toISOString(), date);
  return new Promise((resolve, reject) => {     
      db.all("SELECT *  from ticket order by ticket_code desc", (err, rows) => {
          if(rows.length > 0){
            console.log(rows[0].ticket_code)
            var ticketcode = rows[0].ticket_code != '' && rows[0].ticket_code !== undefined &&rows[0].ticket_code!==null ? rows[0].ticket_code : 0;
            var count = Number(ticketcode)+1;
            console.log(count);
            resolve({ticketid: String(count).padStart(4, '0'), res:rows});
          }
          else{
            var count = 1;
            resolve({ticketid: String(count).padStart(4, '0'), res:rows});
            // resolve((err && err.message) || rows);
          }
      }); 
  });
})

ipcMain.handle('getSyncUniqueId', async(event)=>{    
  let id = await machineId(); 
  return new Promise((resolve, reject) => {  
    var syncid =  id + new Date().valueOf()
    resolve({syncid:syncid});
});
}) 


ipcMain.handle('evantcall', async(event,msg)=>{    
  console.log('evantcall', msg);
  return new Promise((resolve, reject) => {   
    resolve("suiccess");
});
}) 