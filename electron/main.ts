import { app, BrowserWindow, Menu, ipcMain, dialog, nativeTheme } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { PDFHandler } from './handlers/pdfHandler';
import { AnnotationHandler } from './handlers/annotationHandler';
import { SecurityHandler } from './handlers/securityHandler';
import { PrintHandler } from './handlers/printHandler';
import { registerDocProcessingHandler } from './handlers/docProcessingHandler';
import { registerRecognitionHandler } from './handlers/recognitionHandler';
import { registerAutomationHandler } from './handlers/automationHandler';
import { registerIntegrationHandler } from './handlers/integrationHandler';

let mainWindow: BrowserWindow | null = null;
const isDev = process.env.NODE_ENV === 'development';

const pdfHandler = new PDFHandler();
const annotationHandler = new AnnotationHandler();
const securityHandler = new SecurityHandler();
const printHandler = new PrintHandler();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true,
      webSecurity: true
    },
    icon: path.join(__dirname, '../assets/icon.png')
  });

  mainWindow.setTitle('Escaneando Reader - Leitor de PDF com Privacidade Local');

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  setupMenu();
}

function setupMenu() {
  const template: any[] = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Abrir PDF',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow!, {
              properties: ['openFile'],
              filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
            });
            if (!result.canceled && mainWindow) {
              mainWindow.webContents.send('file:open', result.filePaths[0]);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Sair',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { label: 'Desfazer', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Refazer', accelerator: 'CmdOrCtrl+Shift+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Recortar', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copiar', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Colar', accelerator: 'CmdOrCtrl+V', role: 'paste' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        {
          label: 'Tema Escuro',
          click: () => {
            nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'light' : 'dark';
            mainWindow?.webContents.send('theme:change', nativeTheme.shouldUseDarkColors ? 'light' : 'dark');
          }
        },
        { type: 'separator' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+=', click: () => mainWindow?.webContents.send('zoom:in') },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: () => mainWindow?.webContents.send('zoom:out') },
        { label: 'Zoom Reset', accelerator: 'CmdOrCtrl+0', click: () => mainWindow?.webContents.send('zoom:reset') }
      ]
    },
    {
      label: 'Ferramentas',
      submenu: [
        {
          label: 'Imprimir',
          accelerator: 'CmdOrCtrl+P',
          click: () => mainWindow?.webContents.send('print:open')
        },
        { type: 'separator' },
        {
          label: 'Proteger Documento',
          click: () => mainWindow?.webContents.send('security:protect')
        }
      ]
    }
  ];

  if (isDev) {
    template.push({
      label: 'Dev',
      submenu: [
        { label: 'Dev Tools', accelerator: 'F12', role: 'toggleDevTools' }
      ]
    });
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// IPC Handlers
ipcMain.handle('pdf:load', async (event, filePath: string) => {
  try {
    const data = fs.readFileSync(filePath);
    return { success: true, data: data.toString('base64') };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('pdf:getMetadata', async (event, filePath: string) => {
  return pdfHandler.getMetadata(filePath);
});

ipcMain.handle('pdf:decrypt', async (event, filePath: string, password: string) => {
  return securityHandler.decryptFile(filePath, password);
});

ipcMain.handle('annotation:save', async (event, pdfPath: string, annotations: any[]) => {
  return annotationHandler.saveAnnotations(pdfPath, annotations);
});

ipcMain.handle('annotation:load', async (event, pdfPath: string) => {
  return annotationHandler.loadAnnotations(pdfPath);
});

ipcMain.handle('security:protect', async (event, filePath: string, password: string, options: any) => {
  return securityHandler.protectFile(filePath, password, options);
});

ipcMain.handle('print:preview', async (event, pdfPath: string) => {
  return printHandler.generatePreview(pdfPath);
});

ipcMain.handle('print:execute', async (event, printOptions: any) => {
  return printHandler.print(mainWindow!, printOptions);
});

// Register New Handlers for 16 Features
registerDocProcessingHandler();
registerRecognitionHandler();
registerAutomationHandler();
registerIntegrationHandler();

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
