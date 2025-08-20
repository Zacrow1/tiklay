import { securityService } from './security';

// Interfaz para acción de auditoría
export interface AuditAction {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  timestamp: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

// Interfaz para filtros de auditoría
export interface AuditFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: string;
  entityType?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  sessionId?: string;
  limit?: number;
  offset?: number;
}

// Interfaz para resumen de auditoría
export interface AuditSummary {
  totalActions: number;
  actionsByType: Record<string, number>;
  actionsByUser: Record<string, number>;
  actionsByRiskLevel: Record<string, number>;
  topActions: Array<{
    action: string;
    count: number;
  }>;
  suspiciousActivities: Array<{
    action: string;
    userId: string;
    timestamp: string;
    details: any;
  }>;
}

// Servicio de auditoría
export class AuditService {
  private readonly STORAGE_KEY = 'tiklay_audit_logs';
  private readonly MAX_LOGS = 10000;
  private readonly RETENTION_DAYS = 365;

  // Registrar acción de auditoría
  async logAction(action: Omit<AuditAction, 'timestamp'>): Promise<void> {
    try {
      const auditAction: AuditAction = {
        ...action,
        timestamp: new Date().toISOString(),
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
        sessionId: this.getSessionId()
      };

      // Obtener logs existentes
      const existingLogs = this.getStoredLogs();
      
      // Agregar nuevo log
      const updatedLogs = [...existingLogs, auditAction];
      
      // Limitar cantidad de logs
      const limitedLogs = updatedLogs.slice(-this.MAX_LOGS);
      
      // Guardar logs
      this.storeLogs(limitedLogs);
      
      // Si es una acción de alto riesgo, generar alerta
      if (action.riskLevel === 'high' || action.riskLevel === 'critical') {
        await this.generateSecurityAlert(auditAction);
      }
      
      // Limpiar logs antiguos periódicamente
      this.cleanupOldLogs();
      
    } catch (error) {
      console.error('Error logging audit action:', error);
    }
  }

  // Obtener logs con filtros
  async getLogs(filters?: AuditFilters): Promise<AuditAction[]> {
    try {
      let logs = this.getStoredLogs();
      
      // Aplicar filtros
      if (filters) {
        if (filters.startDate) {
          logs = logs.filter(log => new Date(log.timestamp) >= new Date(filters.startDate!));
        }
        
        if (filters.endDate) {
          logs = logs.filter(log => new Date(log.timestamp) <= new Date(filters.endDate!));
        }
        
        if (filters.userId) {
          logs = logs.filter(log => log.userId === filters.userId);
        }
        
        if (filters.action) {
          logs = logs.filter(log => log.action === filters.action);
        }
        
        if (filters.entityType) {
          logs = logs.filter(log => log.entityType === filters.entityType);
        }
        
        if (filters.riskLevel) {
          logs = logs.filter(log => log.riskLevel === filters.riskLevel);
        }
        
        if (filters.sessionId) {
          logs = logs.filter(log => log.sessionId === filters.sessionId);
        }
        
        // Paginación
        if (filters.offset !== undefined) {
          logs = logs.slice(filters.offset);
        }
        
        if (filters.limit !== undefined) {
          logs = logs.slice(0, filters.limit);
        }
      }
      
      // Ordenar por timestamp descendente
      logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return logs;
    } catch (error) {
      console.error('Error getting audit logs:', error);
      return [];
    }
  }

  // Obtener resumen de auditoría
  async getSummary(dateRange?: { start: string; end: string }): Promise<AuditSummary> {
    try {
      const filters: AuditFilters = {
        startDate: dateRange?.start,
        endDate: dateRange?.end
      };
      
      const logs = await this.getLogs(filters);
      
      // Calcular estadísticas
      const actionsByType: Record<string, number> = {};
      const actionsByUser: Record<string, number> = {};
      const actionsByRiskLevel: Record<string, number> = {};
      
      logs.forEach(log => {
        actionsByType[log.action] = (actionsByType[log.action] || 0) + 1;
        actionsByUser[log.userId] = (actionsByUser[log.userId] || 0) + 1;
        actionsByRiskLevel[log.riskLevel] = (actionsByRiskLevel[log.riskLevel] || 0) + 1;
      });
      
      // Obtener acciones más comunes
      const topActions = Object.entries(actionsByType)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([action, count]) => ({ action, count }));
      
      // Detectar actividades sospechosas
      const suspiciousActivities = logs.filter(log => 
        log.riskLevel === 'high' || log.riskLevel === 'critical'
      ).slice(0, 20);
      
      return {
        totalActions: logs.length,
        actionsByType,
        actionsByUser,
        actionsByRiskLevel,
        topActions,
        suspiciousActivities
      };
    } catch (error) {
      console.error('Error getting audit summary:', error);
      return {
        totalActions: 0,
        actionsByType: {},
        actionsByUser: {},
        actionsByRiskLevel: {},
        topActions: [],
        suspiciousActivities: []
      };
    }
  }

  // Exportar logs
  async exportLogs(filters?: AuditFilters, format: 'json' | 'csv' = 'json'): Promise<string> {
    try {
      const logs = await this.getLogs(filters);
      
      if (format === 'json') {
        return JSON.stringify(logs, null, 2);
      } else if (format === 'csv') {
        return this.convertToCSV(logs);
      } else {
        throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      throw new Error('Failed to export logs');
    }
  }

  // Limpiar logs antiguos
  async cleanupOldLogs(): Promise<void> {
    try {
      const logs = this.getStoredLogs();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.RETENTION_DAYS);
      
      const filteredLogs = logs.filter(log => 
        new Date(log.timestamp) > cutoffDate
      );
      
      if (filteredLogs.length !== logs.length) {
        this.storeLogs(filteredLogs);
      }
    } catch (error) {
      console.error('Error cleaning up old logs:', error);
    }
  }

  // Generar alerta de seguridad
  private async generateSecurityAlert(action: AuditAction): Promise<void> {
    try {
      // Enviar notificación al sistema
      const alert = {
        type: 'security_alert',
        severity: action.riskLevel,
        message: `Suspicious activity detected: ${action.action}`,
        details: action,
        timestamp: action.timestamp
      };
      
      // Almacenar alerta
      const alerts = this.getStoredAlerts();
      alerts.push(alert);
      
      // Limitar cantidad de alertas
      const limitedAlerts = alerts.slice(-1000);
      this.storeAlerts(limitedAlerts);
      
      // Enviar notificación si está disponible
      if (typeof window !== 'undefined' && 'Notification' in window) {
        new Notification('Security Alert', {
          body: alert.message,
          icon: '/icon.png'
        });
      }
      
    } catch (error) {
      console.error('Error generating security alert:', error);
    }
  }

  // Obtener IP del cliente
  private async getClientIP(): Promise<string> {
    try {
      // En una implementación real, esto obtendría la IP del servidor
      // Para cliente, usamos una aproximación
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting client IP:', error);
      return 'unknown';
    }
  }

  // Obtener ID de sesión
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('tiklay_session_id');
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('tiklay_session_id', sessionId);
    }
    
    return sessionId;
  }

  // Métodos de almacenamiento
  private getStoredLogs(): AuditAction[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting stored logs:', error);
      return [];
    }
  }

  private storeLogs(logs: AuditAction[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Error storing logs:', error);
    }
  }

  private getStoredAlerts(): any[] {
    try {
      const stored = localStorage.getItem('tiklay_security_alerts');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting stored alerts:', error);
      return [];
    }
  }

  private storeAlerts(alerts: any[]): void {
    try {
      localStorage.setItem('tiklay_security_alerts', JSON.stringify(alerts));
    } catch (error) {
      console.error('Error storing alerts:', error);
    }
  }

  // Convertir a CSV
  private convertToCSV(logs: AuditAction[]): string {
    const headers = [
      'timestamp',
      'action',
      'entityType',
      'entityId',
      'userId',
      'riskLevel',
      'ipAddress',
      'userAgent',
      'sessionId'
    ];
    
    const csvRows = [
      headers.join(','),
      ...logs.map(log => [
        log.timestamp,
        `"${log.action}"`,
        `"${log.entityType}"`,
        `"${log.entityId}"`,
        `"${log.userId}"`,
        log.riskLevel,
        `"${log.ipAddress || ''}"`,
        `"${log.userAgent || ''}"`,
        `"${log.sessionId || ''}"`
      ].join(','))
    ];
    
    return csvRows.join('\n');
  }

  // Obtener alertas de seguridad
  async getSecurityAlerts(): Promise<any[]> {
    try {
      return this.getStoredAlerts();
    } catch (error) {
      console.error('Error getting security alerts:', error);
      return [];
    }
  }

  // Marcar alerta como leída
  async markAlertAsRead(alertId: string): Promise<void> {
    try {
      const alerts = this.getStoredAlerts();
      const alertIndex = alerts.findIndex(alert => alert.timestamp === alertId);
      
      if (alertIndex !== -1) {
        alerts[alertIndex].read = true;
        this.storeAlerts(alerts);
      }
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  }
}

// Exportar instancia del servicio
export const auditService = new AuditService();

// Hook de React para usar el servicio de auditoría
import { useState, useEffect } from 'react';

export function useAudit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logAction = async (action: Omit<AuditAction, 'timestamp'>) => {
    try {
      await auditService.logAction(action);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const getLogs = async (filters?: AuditFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const logs = await auditService.getLogs(filters);
      return logs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getSummary = async (dateRange?: { start: string; end: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const summary = await auditService.getSummary(dateRange);
      return summary;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const exportLogs = async (filters?: AuditFilters, format: 'json' | 'csv' = 'json') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const exported = await auditService.exportLogs(filters, format);
      return exported;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getSecurityAlerts = async () => {
    try {
      return await auditService.getSecurityAlerts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return [];
    }
  };

  const markAlertAsRead = async (alertId: string) => {
    try {
      await auditService.markAlertAsRead(alertId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return {
    isLoading,
    error,
    logAction,
    getLogs,
    getSummary,
    exportLogs,
    getSecurityAlerts,
    markAlertAsRead
  };
}