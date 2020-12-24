const {app,BrowserWindow}= require('electron');

let mainwindow = null;

app.on('ready',()=>{
    console.log("I'm ready!");
    mainwindow=new BrowserWindow({
        webPreferences:{
            nodeIntegration:true
        }
    });//新建一个窗口
    mainwindow.webContents.loadFile('./app/index.html');
})