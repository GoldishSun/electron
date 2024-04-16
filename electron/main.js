const { app, BrowserWindow } = require('electron')
const path = require('path');
 
let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  })
 
  // and load the index.html of the app.
  
  mainWindow.loadURL(`file://${path.join(__dirname, '../dist/electron/index.html')}`);
  // mainWindow.loadFile('./dist/index.html') // <-- 요기에 './dist/'를 추가!
  // mainWindow.loadURL(`file://${path.join(__dirname, './dist/index.html')}`);
  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, './dist/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));
 
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}
 
app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
  app.on('close', function() {
    mainWindow = null;
    app.quit();
  });
})
 
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})