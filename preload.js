const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Información de la aplicación
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // Diálogos del sistema
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  // Notificaciones
  showNotification: (title, body) => ipcRenderer.send('show-notification', title, body),
  
  // Estado de conexión
  updateOnlineStatus: (isOnline) => ipcRenderer.send('update-online-status', isOnline),
  onOnlineStatusChanged: (callback) => ipcRenderer.on('online-status-changed', (event, isOnline) => callback(isOnline)),
  
  // Acciones del menú
  onMenuAction: (callback) => ipcRenderer.on('menu-action', (event, action) => callback(action)),
  
  // Importar/Exportar datos
  onExportData: (callback) => ipcRenderer.on('export-data', (event, filePath) => callback(filePath)),
  onImportData: (callback) => ipcRenderer.on('import-data', (event, filePath) => callback(filePath)),
  
  // Almacenamiento local
  saveToLocalStorage: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getFromLocalStorage: (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  removeFromLocalStorage: (key) => {
    localStorage.removeItem(key);
  },
  
  // Detectar si estamos en Electron
  isElectron: () => true
});