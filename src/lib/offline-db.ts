import Dexie, { Table } from 'dexie';

// Interfaz para entidades offline
export interface OfflineEntity {
  id?: number;
  uuid: string;
  entityType: string;
  data: any;
  lastModified: string;
  syncStatus: 'pending' | 'synced' | 'conflict' | 'error';
  version: number;
}

export interface SyncOperation {
  id?: number;
  uuid: string;
  operation: 'create' | 'update' | 'delete';
  entityType: string;
  entityId: string;
  data: any;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  lastError?: string;
}

export interface Conflict {
  id?: number;
  uuid: string;
  entityType: string;
  entityId: string;
  localData: any;
  remoteData: any;
  timestamp: string;
  resolution?: 'local' | 'remote' | 'merge';
  resolvedAt?: string;
}

// Base de datos offline usando Dexie
export class OfflineDatabase extends Dexie {
  entities: Table<OfflineEntity, number>;
  operations: Table<SyncOperation, number>;
  conflicts: Table<Conflict, number>;

  constructor() {
    super('TiklayOfflineDB');
    
    this.version(1).stores({
      entities: '++id, uuid, entityType, syncStatus, lastModified',
      operations: '++id, uuid, operation, entityType, entityId, status, timestamp',
      conflicts: '++id, uuid, entityType, entityId, timestamp, resolution'
    });
  }
}

// Instancia de la base de datos
export const offlineDb = new OfflineDatabase();

// Servicio de gestión offline
export class OfflineService {
  private db = offlineDb;

  // Guardar entidad localmente
  async saveEntity(entityType: string, data: any, uuid?: string): Promise<string> {
    const entityUuid = uuid || this.generateUuid();
    const now = new Date().toISOString();
    
    const entity: OfflineEntity = {
      uuid: entityUuid,
      entityType,
      data,
      lastModified: now,
      syncStatus: 'pending',
      version: 1
    };

    await this.db.entities.put(entity);
    
    // Registrar operación de sincronización
    await this.queueOperation('create', entityType, entityUuid, data);
    
    return entityUuid;
  }

  // Actualizar entidad localmente
  async updateEntity(entityType: string, uuid: string, data: any): Promise<void> {
    const existing = await this.db.entities.where('uuid').equals(uuid).first();
    
    if (!existing) {
      throw new Error(`Entity not found: ${uuid}`);
    }

    const updatedEntity: OfflineEntity = {
      ...existing,
      data: { ...existing.data, ...data },
      lastModified: new Date().toISOString(),
      syncStatus: 'pending',
      version: existing.version + 1
    };

    await this.db.entities.put(updatedEntity);
    
    // Registrar operación de actualización
    await this.queueOperation('update', entityType, uuid, data);
  }

  // Eliminar entidad localmente
  async deleteEntity(entityType: string, uuid: string): Promise<void> {
    await this.db.entities.where('uuid').equals(uuid).delete();
    
    // Registrar operación de eliminación
    await this.queueOperation('delete', entityType, uuid, null);
  }

  // Obtener entidad por UUID
  async getEntity(entityType: string, uuid: string): Promise<any | null> {
    const entity = await this.db.entities
      .where('uuid')
      .equals(uuid)
      .and(e => e.entityType === entityType)
      .first();
    
    return entity?.data || null;
  }

  // Obtener todas las entidades de un tipo
  async getAllEntities(entityType: string): Promise<any[]> {
    const entities = await this.db.entities
      .where('entityType')
      .equals(entityType)
      .toArray();
    
    return entities.map(e => e.data);
  }

  // Buscar entidades
  async searchEntities(entityType: string, query: string, fields: string[] = []): Promise<any[]> {
    const entities = await this.db.entities
      .where('entityType')
      .equals(entityType)
      .toArray();
    
    return entities.filter(entity => {
      const data = entity.data;
      const searchText = query.toLowerCase();
      
      if (fields.length === 0) {
        // Buscar en todos los campos de texto
        return Object.values(data).some(value => 
          typeof value === 'string' && value.toLowerCase().includes(searchText)
        );
      } else {
        // Buscar solo en campos específicos
        return fields.some(field => {
          const value = data[field];
          return typeof value === 'string' && value.toLowerCase().includes(searchText);
        });
      }
    }).map(e => e.data);
  }

  // Obtener entidades pendientes de sincronización
  async getPendingEntities(): Promise<OfflineEntity[]> {
    return await this.db.entities
      .where('syncStatus')
      .equals('pending')
      .toArray();
  }

  // Marcar entidad como sincronizada
  async markAsSynced(entityType: string, uuid: string): Promise<void> {
    await this.db.entities
      .where('uuid')
      .equals(uuid)
      .modify({ syncStatus: 'synced' });
  }

  // Registrar operación de sincronización
  private async queueOperation(
    operation: 'create' | 'update' | 'delete',
    entityType: string,
    entityId: string,
    data: any
  ): Promise<void> {
    const syncOperation: SyncOperation = {
      uuid: this.generateUuid(),
      operation,
      entityType,
      entityId,
      data,
      timestamp: new Date().toISOString(),
      status: 'pending',
      retryCount: 0
    };

    await this.db.operations.put(syncOperation);
  }

  // Obtener operaciones pendientes
  async getPendingOperations(): Promise<SyncOperation[]> {
    return await this.db.operations
      .where('status')
      .equals('pending')
      .toArray();
  }

  // Marcar operación como completada
  async markOperationCompleted(operationId: number): Promise<void> {
    await this.db.operations
      .where('id')
      .equals(operationId)
      .modify({ status: 'completed' });
  }

  // Marcar operación como fallida
  async markOperationFailed(operationId: number, error: string): Promise<void> {
    await this.db.operations
      .where('id')
      .equals(operationId)
      .modify({ 
        status: 'failed',
        lastError: error,
        retryCount: Dexie.get('retryCount') + 1
      });
  }

  // Registrar conflicto
  async registerConflict(
    entityType: string,
    entityId: string,
    localData: any,
    remoteData: any
  ): Promise<void> {
    const conflict: Conflict = {
      uuid: this.generateUuid(),
      entityType,
      entityId,
      localData,
      remoteData,
      timestamp: new Date().toISOString()
    };

    await this.db.conflicts.put(conflict);
  }

  // Obtener conflictos pendientes
  async getPendingConflicts(): Promise<Conflict[]> {
    return await this.db.conflicts
      .where('resolution')
      .equals(undefined)
      .toArray();
  }

  // Resolver conflicto
  async resolveConflict(
    conflictId: number,
    resolution: 'local' | 'remote' | 'merge',
    mergedData?: any
  ): Promise<void> {
    const conflict = await this.db.conflicts.get(conflictId);
    if (!conflict) return;

    await this.db.conflicts.update(conflictId, {
      resolution,
      resolvedAt: new Date().toISOString()
    });

    // Aplicar la resolución según el tipo
    if (resolution === 'local') {
      await this.updateEntity(conflict.entityType, conflict.entityId, conflict.localData);
    } else if (resolution === 'remote') {
      await this.updateEntity(conflict.entityType, conflict.entityId, conflict.remoteData);
    } else if (resolution === 'merge' && mergedData) {
      await this.updateEntity(conflict.entityType, conflict.entityId, mergedData);
    }
  }

  // Limpiar datos antiguos
  async cleanup(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Limpiar operaciones completadas antiguas
    await this.db.operations
      .where('status')
      .equals('completed')
      .and(op => new Date(op.timestamp) < thirtyDaysAgo)
      .delete();

    // Limpiar conflictos resueltos antiguos
    await this.db.conflicts
      .where('resolution')
      .notEqual(undefined)
      .and(conflict => new Date(conflict.resolvedAt!) < thirtyDaysAgo)
      .delete();
  }

  // Obtener estadísticas
  async getStats(): Promise<{
    totalEntities: number;
    pendingSync: number;
    pendingOperations: number;
    conflicts: number;
  }> {
    const [totalEntities, pendingSync, pendingOperations, conflicts] = await Promise.all([
      this.db.entities.count(),
      this.db.entities.where('syncStatus').equals('pending').count(),
      this.db.operations.where('status').equals('pending').count(),
      this.db.conflicts.where('resolution').equals(undefined).count()
    ]);

    return {
      totalEntities,
      pendingSync,
      pendingOperations,
      conflicts
    };
  }

  // Generar UUID
  private generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Exportar instancia del servicio
export const offlineService = new OfflineService();