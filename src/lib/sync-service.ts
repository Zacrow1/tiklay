import { offlineService, OfflineEntity, SyncOperation, Conflict } from './offline-db';
import { appServices } from './services';

// Interfaz para el resultado de sincronización
export interface SyncResult {
  success: boolean;
  syncedRecords: number;
  conflicts: number;
  errors: string[];
  duration: number;
  details: {
    uploaded: number;
    downloaded: number;
    conflictsResolved: number;
  };
}

// Interfaz para el estado de sincronización
export interface SyncStatus {
  lastSync: string;
  isOnline: boolean;
  isSyncing: boolean;
  pendingUploads: number;
  pendingDownloads: number;
  conflicts: number;
  lastError?: string;
}

// Servicio de sincronización
export class SyncService {
  private isSyncing = false;
  private syncInterval?: NodeJS.Timeout;
  private listeners: Set<(status: SyncStatus) => void> = new Set();

  constructor() {
    // Escuchar cambios de conexión
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
    }
  }

  // Iniciar sincronización automática
  startAutoSync(intervalMinutes: number = 5): void {
    this.stopAutoSync();
    this.syncInterval = setInterval(() => {
      if (navigator.onLine && !this.isSyncing) {
        this.syncNow().catch(console.error);
      }
    }, intervalMinutes * 60 * 1000);
  }

  // Detener sincronización automática
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }
  }

  // Sincronizar ahora
  async syncNow(): Promise<SyncResult> {
    if (this.isSyncing) {
      throw new Error('Sync already in progress');
    }

    const startTime = Date.now();
    this.isSyncing = true;
    this.notifyListeners();

    try {
      const result: SyncResult = {
        success: false,
        syncedRecords: 0,
        conflicts: 0,
        errors: [],
        duration: 0,
        details: {
          uploaded: 0,
          downloaded: 0,
          conflictsResolved: 0
        }
      };

      // 1. Subir cambios locales
      const uploadResult = await this.uploadChanges();
      result.details.uploaded = uploadResult.uploaded;
      result.errors.push(...uploadResult.errors);

      // 2. Descargar cambios remotos
      const downloadResult = await this.downloadChanges();
      result.details.downloaded = downloadResult.downloaded;
      result.errors.push(...downloadResult.errors);

      // 3. Resolver conflictos automáticamente si es posible
      const conflictsResolved = await this.resolveAutoConflicts();
      result.details.conflictsResolved = conflictsResolved;

      // 4. Obtener estadísticas actualizadas
      const stats = await offlineService.getStats();
      result.syncedRecords = result.details.uploaded + result.details.downloaded;
      result.conflicts = stats.conflicts;
      result.success = result.errors.length === 0;
      result.duration = Date.now() - startTime;

      return result;
    } catch (error) {
      const result: SyncResult = {
        success: false,
        syncedRecords: 0,
        conflicts: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        duration: Date.now() - startTime,
        details: {
          uploaded: 0,
          downloaded: 0,
          conflictsResolved: 0
        }
      };

      return result;
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }
  }

  // Subir cambios locales al servidor
  private async uploadChanges(): Promise<{ uploaded: number; errors: string[] }> {
    const operations = await offlineService.getPendingOperations();
    const errors: string[] = [];
    let uploaded = 0;

    for (const operation of operations) {
      try {
        await this.processOperation(operation);
        await offlineService.markOperationCompleted(operation.id!);
        uploaded++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to sync ${operation.operation} ${operation.entityType}: ${errorMessage}`);
        await offlineService.markOperationFailed(operation.id!, errorMessage);
      }
    }

    return { uploaded, errors };
  }

  // Procesar una operación individual
  private async processOperation(operation: SyncOperation): Promise<void> {
    switch (operation.operation) {
      case 'create':
        await this.createRemoteEntity(operation);
        break;
      case 'update':
        await this.updateRemoteEntity(operation);
        break;
      case 'delete':
        await this.deleteRemoteEntity(operation);
        break;
    }
  }

  // Crear entidad remota
  private async createRemoteEntity(operation: SyncOperation): Promise<void> {
    let service;
    switch (operation.entityType) {
      case 'student':
        service = appServices.students;
        break;
      case 'class':
        service = appServices.classes;
        break;
      case 'payment':
        service = appServices.payments;
        break;
      default:
        throw new Error(`Unknown entity type: ${operation.entityType}`);
    }

    const result = await service.create(operation.data);
    
    // Actualizar el UUID local con el ID remoto
    await offlineService.updateEntity(operation.entityType, operation.entityId, {
      ...operation.data,
      id: result.id
    });
  }

  // Actualizar entidad remota
  private async updateRemoteEntity(operation: SyncOperation): Promise<void> {
    let service;
    switch (operation.entityType) {
      case 'student':
        service = appServices.students;
        break;
      case 'class':
        service = appServices.classes;
        break;
      case 'payment':
        service = appServices.payments;
        break;
      default:
        throw new Error(`Unknown entity type: ${operation.entityType}`);
    }

    await service.update(operation.entityId, operation.data);
  }

  // Eliminar entidad remota
  private async deleteRemoteEntity(operation: SyncOperation): Promise<void> {
    let service;
    switch (operation.entityType) {
      case 'student':
        service = appServices.students;
        break;
      case 'class':
        service = appServices.classes;
        break;
      case 'payment':
        service = appServices.payments;
        break;
      default:
        throw new Error(`Unknown entity type: ${operation.entityType}`);
    }

    await service.delete(operation.entityId);
  }

  // Descargar cambios remotos
  private async downloadChanges(): Promise<{ downloaded: number; errors: string[] }> {
    const errors: string[] = [];
    let downloaded = 0;

    try {
      // Descargar estudiantes
      const remoteStudents = await appServices.students.getAll();
      for (const student of remoteStudents) {
        await offlineService.saveEntity('student', student, student.id);
        downloaded++;
      }

      // Descargar clases
      const remoteClasses = await appServices.classes.getAll();
      for (const classData of remoteClasses) {
        await offlineService.saveEntity('class', classData, classData.id);
        downloaded++;
      }

      // Descargar pagos
      const remotePayments = await appServices.payments.getAll();
      for (const payment of remotePayments) {
        await offlineService.saveEntity('payment', payment, payment.id);
        downloaded++;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Failed to download remote changes: ${errorMessage}`);
    }

    return { downloaded, errors };
  }

  // Resolver conflictos automáticamente
  private async resolveAutoConflicts(): Promise<number> {
    const conflicts = await offlineService.getPendingConflicts();
    let resolved = 0;

    for (const conflict of conflicts) {
      try {
        const resolution = await this.autoResolveConflict(conflict);
        if (resolution) {
          await offlineService.resolveConflict(conflict.id!, resolution.type, resolution.mergedData);
          resolved++;
        }
      } catch (error) {
        console.error('Failed to auto-resolve conflict:', error);
      }
    }

    return resolved;
  }

  // Resolver automáticamente un conflicto
  private async autoResolveConflict(conflict: Conflict): Promise<{ type: 'local' | 'remote' | 'merge'; mergedData?: any } | null> {
    const localTimestamp = new Date(conflict.localData.lastModified || conflict.localData.createdAt || Date.now());
    const remoteTimestamp = new Date(conflict.remoteData.lastModified || conflict.remoteData.createdAt || Date.now());

    // Estrategia simple: última modificación gana
    if (localTimestamp > remoteTimestamp) {
      return { type: 'local' };
    } else if (remoteTimestamp > localTimestamp) {
      return { type: 'remote' };
    } else {
      // Si tienen la misma marca de tiempo, intentar fusionar
      return this.mergeData(conflict.localData, conflict.remoteData);
    }
  }

  // Fusionar datos
  private mergeData(local: any, remote: any): { type: 'merge'; mergedData: any } | null {
    try {
      // Estrategia simple: priorizar datos remotos pero mantener campos locales que no existen en remoto
      const merged = { ...remote };
      
      Object.keys(local).forEach(key => {
        if (!(key in remote)) {
          merged[key] = local[key];
        }
      });

      return { type: 'merge', mergedData: merged };
    } catch (error) {
      console.error('Failed to merge data:', error);
      return null;
    }
  }

  // Obtener estado de sincronización
  async getStatus(): Promise<SyncStatus> {
    const stats = await offlineService.getStats();
    
    return {
      lastSync: new Date().toISOString(), // Esto debería obtenerse de un almacenamiento persistente
      isOnline: navigator.onLine,
      isSyncing: this.isSyncing,
      pendingUploads: stats.pendingSync,
      pendingDownloads: 0, // Esto podría calcularse comparando con el servidor
      conflicts: stats.conflicts
    };
  }

  // Manejar conexión online
  private handleOnline(): void {
    // Iniciar sincronización cuando se recupera la conexión
    if (!this.isSyncing) {
      this.syncNow().catch(console.error);
    }
    this.notifyListeners();
  }

  // Manejar conexión offline
  private handleOffline(): void {
    this.notifyListeners();
  }

  // Notificar a los listeners
  private notifyListeners(): void {
    this.getStatus().then(status => {
      this.listeners.forEach(listener => listener(status));
    });
  }

  // Suscribirse a cambios de estado
  onStatusChange(callback: (status: SyncStatus) => void): () => void {
    this.listeners.add(callback);
    
    // Enviar estado actual inmediatamente
    this.getStatus().then(callback);
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Forzar resolución de conflicto
  async resolveConflictManually(
    conflictId: number,
    resolution: 'local' | 'remote' | 'merge',
    mergedData?: any
  ): Promise<void> {
    await offlineService.resolveConflict(conflictId, resolution, mergedData);
  }

  // Obtener conflictos pendientes
  async getConflicts(): Promise<Conflict[]> {
    return await offlineService.getPendingConflicts();
  }

  // Limpiar datos antiguos
  async cleanup(): Promise<void> {
    await offlineService.cleanup();
  }
}

// Exportar instancia del servicio
export const syncService = new SyncService();

// Hook de React para usar el servicio de sincronización
import { useEffect, useState } from 'react';

export function useSyncService() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);

  useEffect(() => {
    const unsubscribe = syncService.onStatusChange(setSyncStatus);
    return unsubscribe;
  }, []);

  const syncNow = async () => {
    return await syncService.syncNow();
  };

  return {
    syncStatus,
    syncNow,
    startAutoSync: syncService.startAutoSync.bind(syncService),
    stopAutoSync: syncService.stopAutoSync.bind(syncService),
    getConflicts: syncService.getConflicts.bind(syncService),
    resolveConflictManually: syncService.resolveConflictManually.bind(syncService)
  };
}