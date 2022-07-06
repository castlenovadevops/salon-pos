// const { ipcRenderer, contextBridge } = require('electron');
// window.ipcRenderer = require('electron').ipcRenderer;
// //console.log('preload.js loaded');
// contextBridge.exposeInMainWorld('api', {
//   // Invoke Methods
//   // testInvoke: (args) => ipcRenderer.invoke('test-invoke', args),
//   // // Send Methods
//   // testSend: (args) => ipcRenderer.send('test-send', args),
//   // // Receive Methods
//   // testReceive: (callback) => ipcRenderer.on('test-receive', (event, data) => { callback(data) }),
//   checkdatabase: (args) =>ipcRenderer.invoke("checkdatabase", args),
//   getprinters: (args) =>ipcRenderer.invoke("getprinters", args),
//   printdata: (args) =>ipcRenderer.invoke("printData", args),
//   getData: (sql) => ipcRenderer.invoke("getData", sql),
//   saveData: (sql) => ipcRenderer.invoke("saveData", sql),
//   getTicketCode: () => ipcRenderer.invoke("getTicketCode"),
//   windowClose: (args) => ipcRenderer.invoke('windowClose', args)
  
// });
process.once('loaded', () => {
  const { contextBridge, ipcRenderer, shell } = require('electron')
  
  contextBridge.exposeInMainWorld('api', {
    on (eventName, callback) {
      ipcRenderer.on(eventName, callback)
    },

    async invoke (eventName, ...params) {
      return await ipcRenderer.invoke(eventName, ...params)
    },

    async checkdatabase (args) {
      return await ipcRenderer.invoke("checkdatabase", args)
    }, 

    async getprinters (args) {
      return await ipcRenderer.invoke("getprinters", args)
    }, 

    async printdata (args) {
      return await ipcRenderer.invoke("printData", args)
    }, 

    async getData (args) {
      return await ipcRenderer.invoke("getData", args)
    }, 

    async saveData (args) {
      return await ipcRenderer.invoke("saveData", args)
    }, 

    async getTicketCode (args) {
      return await ipcRenderer.invoke("getTicketCode", args)
    },

    async getSyncUniqueId(args){
      return await ipcRenderer.invoke("getSyncUniqueId", args)
    },

    async closeWindow (args) {
      return await ipcRenderer.invoke("closeWindow", args)
    },

    async afterWindowCloseOption (args) {
      return await ipcRenderer.invoke("afterWindowCloseOption", args)
    },

    
  })
})