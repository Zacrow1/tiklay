// Detectar si estamos en entorno Electron o web
export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && (window as any).electronAPI;
};

// Interfaz para la API de plataforma
export interface PlatformAPI {
  // Información del sistema
  getAppVersion(): Promise<string>;
  getPlatform(): Promise<string>;
  
  // Diálogos
  showSaveDialog(options: any): Promise<any>;
  showOpenDialog(options: any): Promise<any>;
  showMessageBox(options: any): Promise<any>;
  
  // Notificaciones
  showNotification(title: string, body: string): void;
  
  // Estado de conexión
  updateOnlineStatus(isOnline: boolean): void;
  onOnlineStatusChanged(callback: (isOnline: boolean) => void): () => void;
  
  // Almacenamiento local
  saveToLocalStorage(key: string, value: any): void;
  getFromLocalStorage(key: string): any;
  removeFromLocalStorage(key: string): void;
  
  // Acciones del menú
  onMenuAction(callback: (action: string) => void): () => void;
  
  // Importar/Exportar
  onExportData(callback: (filePath: string) => void): () => void;
  onImportData(callback: (filePath: string) => void): () => void;
}

// Implementación para Electron
class ElectronPlatform implements PlatformAPI {
  private api = (window as any).electronAPI;

  async getAppVersion(): Promise<string> {
    return this.api.getAppVersion();
  }

  async getPlatform(): Promise<string> {
    return this.api.getPlatform();
  }

  async showSaveDialog(options: any): Promise<any> {
    return this.api.showSaveDialog(options);
  }

  async showOpenDialog(options: any): Promise<any> {
    return this.api.showOpenDialog(options);
  }

  async showMessageBox(options: any): Promise<any> {
    return this.api.showMessageBox(options);
  }

  showNotification(title: string, body: string): void {
    this.api.showNotification(title, body);
  }

  updateOnlineStatus(isOnline: boolean): void {
    this.api.updateOnlineStatus(isOnline);
  }

  onOnlineStatusChanged(callback: (isOnline: boolean) => void): () => void {
    this.api.onOnlineStatusChanged(callback);
    return () => {
      // Cleanup function would be implemented with proper event removal
    };
  }

  saveToLocalStorage(key: string, value: any): void {
    this.api.saveToLocalStorage(key, value);
  }

  getFromLocalStorage(key: string): any {
    return this.api.getFromLocalStorage(key);
  }

  removeFromLocalStorage(key: string): void {
    this.api.removeFromLocalStorage(key);
  }

  onMenuAction(callback: (action: string) => void): () => void {
    this.api.onMenuAction(callback);
    return () => {
      // Cleanup function
    };
  }

  onExportData(callback: (filePath: string) => void): () => void {
    this.api.onExportData(callback);
    return () => {
      // Cleanup function
    };
  }

  onImportData(callback: (filePath: string) => void): () => void {
    this.api.onImportData(callback);
    return () => {
      // Cleanup function
    };
  }
}

// Implementación para Web
class WebPlatform implements PlatformAPI {
  async getAppVersion(): Promise<string> {
    return 'Web Version';
  }

  async getPlatform(): Promise<string> {
    return navigator.platform;
  }

  async showSaveDialog(options: any): Promise<any> {
    // En web, usamos una implementación simplificada
    const element = document.createElement('a');
    element.href = options.defaultPath || '#';
    element.download = options.defaultPath?.split('/').pop() || 'download';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    return { filePath: options.defaultPath };
  }

  async showOpenDialog(options: any): Promise<any> {
    // En web, creamos un input file
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = options.filters?.map((f: any) => `.${f.extensions[0]}`).join(',') || '*/*';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          resolve({ filePaths: [file.name] });
        } else {
          resolve({ filePaths: [] });
        }
      };
      
      input.click();
    });
  }

  async showMessageBox(options: any): Promise<any> {
    // En web, usamos alert/confirm/prompt
    if (options.type === 'question') {
      const result = confirm(options.message);
      return { response: result ? 0 : 1 };
    } else {
      alert(options.message);
      return { response: 0 };
    }
  }

  showNotification(title: string, body: string): void {
    if ('Notification' in window) {
      new Notification(title, { body });
    } else {
      alert(`${title}: ${body}`);
    }
  }

  updateOnlineStatus(isOnline: boolean): void {
    // En web, el estado se maneja automáticamente
    console.log('Online status:', isOnline);
  }

  onOnlineStatusChanged(callback: (isOnline: boolean) => void): () => void {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }

  saveToLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  onMenuAction(callback: (action: string) => void): () => void {
    // En web, no hay menú nativo, pero podemos escuchar eventos personalizados
    const handleMenuAction = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('menu-action', handleMenuAction as EventListener);
    
    return () => {
      window.removeEventListener('menu-action', handleMenuAction as EventListener);
    };
  }

  onExportData(callback: (filePath: string) => void): () => void {
    const handleExportData = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('export-data', handleExportData as EventListener);
    
    return () => {
      window.removeEventListener('export-data', handleExportData as EventListener);
    };
  }

  onImportData(callback: (filePath: string) => void): () => void {
    const handleImportData = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener('import-data', handleImportData as EventListener);
    
    return () => {
      window.removeEventListener('import-data', handleImportData as EventListener);
    };
  }
}

// Factory para obtener la implementación correcta
export function getPlatformAPI(): PlatformAPI {
  if (isElectron()) {
    return new ElectronPlatform();
  } else {
    return new WebPlatform();
  }
}

// Hook de React para usar la API de plataforma
import { useEffect, useState } from 'react';

export function usePlatformAPI() {
  const [api] = useState(() => getPlatformAPI());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const cleanup = api.onOnlineStatusChanged(setIsOnline);
    return cleanup;
  }, [api]);

  return { api, isOnline };
}