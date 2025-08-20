import { getPlatformAPI } from './platform';

// Interfaz para los servicios de la aplicación
export interface AppServices {
  // Servicio de estudiantes
  students: StudentService;
  // Servicio de clases
  classes: ClassService;
  // Servicio de pagos
  payments: PaymentService;
  // Servicio de finanzas
  finances: FinanceService;
  // Servicio de sincronización
  sync: SyncService;
  // Servicio de seguridad
  security: SecurityService;
  // Servicio de auditoría
  audit: AuditService;
}

// Interfaz para el servicio de estudiantes
export interface StudentService {
  getAll(): Promise<Student[]>;
  getById(id: string): Promise<Student | null>;
  create(student: Omit<Student, 'id'>): Promise<Student>;
  update(id: string, student: Partial<Student>): Promise<Student>;
  delete(id: string): Promise<boolean>;
  search(query: string): Promise<Student[]>;
}

// Interfaz para el servicio de clases
export interface ClassService {
  getAll(): Promise<Class[]>;
  getById(id: string): Promise<Class | null>;
  create(classData: Omit<Class, 'id'>): Promise<Class>;
  update(id: string, classData: Partial<Class>): Promise<Class>;
  delete(id: string): Promise<boolean>;
  getStudentClasses(studentId: string): Promise<Class[]>;
}

// Interfaz para el servicio de pagos
export interface PaymentService {
  getAll(): Promise<Payment[]>;
  getById(id: string): Promise<Payment | null>;
  create(payment: Omit<Payment, 'id'>): Promise<Payment>;
  update(id: string, payment: Partial<Payment>): Promise<Payment>;
  delete(id: string): Promise<boolean>;
  getStudentPayments(studentId: string): Promise<Payment[]>;
}

// Interfaz para el servicio de finanzas
export interface FinanceService {
  getSummary(): Promise<FinanceSummary>;
  getTransactions(period: 'day' | 'week' | 'month' | 'year'): Promise<Transaction[]>;
  generateReport(type: 'income' | 'expense' | 'balance', period: string): Promise<Report>;
}

// Interfaz para el servicio de sincronización
export interface SyncService {
  syncNow(): Promise<SyncResult>;
  getSyncStatus(): Promise<SyncStatus>;
  enableAutoSync(): void;
  disableAutoSync(): void;
  isOnline(): boolean;
}

// Interfaz para el servicio de seguridad
export interface SecurityService {
  encryptData(data: any): Promise<string>;
  decryptData(encryptedData: string): Promise<any>;
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
  generateApiKey(): Promise<string>;
}

// Interfaz para el servicio de auditoría
export interface AuditService {
  logAction(action: AuditAction): Promise<void>;
  getLogs(filters?: AuditFilters): Promise<AuditLog[]>;
  exportLogs(filters?: AuditFilters): Promise<string>;
}

// Tipos de datos
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  medicalInfo: string;
  membershipType: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  photo?: string;
  notes?: string;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  instructor: string;
  schedule: ClassSchedule;
  capacity: number;
  enrolled: number;
  price: number;
  duration: number;
  location: string;
  requirements: string[];
  status: 'active' | 'cancelled' | 'completed';
}

export interface ClassSchedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  recurring: boolean;
  endDate?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  type: 'membership' | 'class' | 'workshop' | 'other';
  method: 'cash' | 'card' | 'transfer' | 'online';
  date: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description: string;
  reference?: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  pendingPayments: number;
  overduePayments: number;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  reference?: string;
}

export interface Report {
  id: string;
  type: string;
  period: string;
  data: any;
  generatedAt: string;
  totalRecords: number;
}

export interface SyncResult {
  success: boolean;
  syncedRecords: number;
  conflicts: number;
  errors: string[];
  duration: number;
}

export interface SyncStatus {
  lastSync: string;
  isOnline: boolean;
  pendingUploads: number;
  pendingDownloads: number;
  conflicts: number;
}

export interface AuditAction {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  timestamp: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  action?: string;
  entityType?: string;
  limit?: number;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  timestamp: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
}

// Implementación de los servicios
class AppServicesImpl implements AppServices {
  private api = getPlatformAPI();
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  students: StudentService = {
    async getAll(): Promise<Student[]> {
      const response = await fetch(`${this.baseUrl}/api/students`);
      if (!response.ok) throw new Error('Failed to fetch students');
      return response.json();
    },

    async getById(id: string): Promise<Student | null> {
      const response = await fetch(`${this.baseUrl}/api/students/${id}`);
      if (!response.ok) return null;
      return response.json();
    },

    async create(student: Omit<Student, 'id'>): Promise<Student> {
      const response = await fetch(`${this.baseUrl}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });
      if (!response.ok) throw new Error('Failed to create student');
      return response.json();
    },

    async update(id: string, student: Partial<Student>): Promise<Student> {
      const response = await fetch(`${this.baseUrl}/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });
      if (!response.ok) throw new Error('Failed to update student');
      return response.json();
    },

    async delete(id: string): Promise<boolean> {
      const response = await fetch(`${this.baseUrl}/api/students/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    },

    async search(query: string): Promise<Student[]> {
      const response = await fetch(`${this.baseUrl}/api/students/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search students');
      return response.json();
    }
  };

  classes: ClassService = {
    async getAll(): Promise<Class[]> {
      const response = await fetch(`${this.baseUrl}/api/classes`);
      if (!response.ok) throw new Error('Failed to fetch classes');
      return response.json();
    },

    async getById(id: string): Promise<Class | null> {
      const response = await fetch(`${this.baseUrl}/api/classes/${id}`);
      if (!response.ok) return null;
      return response.json();
    },

    async create(classData: Omit<Class, 'id'>): Promise<Class> {
      const response = await fetch(`${this.baseUrl}/api/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData)
      });
      if (!response.ok) throw new Error('Failed to create class');
      return response.json();
    },

    async update(id: string, classData: Partial<Class>): Promise<Class> {
      const response = await fetch(`${this.baseUrl}/api/classes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData)
      });
      if (!response.ok) throw new Error('Failed to update class');
      return response.json();
    },

    async delete(id: string): Promise<boolean> {
      const response = await fetch(`${this.baseUrl}/api/classes/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    },

    async getStudentClasses(studentId: string): Promise<Class[]> {
      const response = await fetch(`${this.baseUrl}/api/students/${studentId}/classes`);
      if (!response.ok) throw new Error('Failed to fetch student classes');
      return response.json();
    }
  };

  payments: PaymentService = {
    async getAll(): Promise<Payment[]> {
      const response = await fetch(`${this.baseUrl}/api/payments`);
      if (!response.ok) throw new Error('Failed to fetch payments');
      return response.json();
    },

    async getById(id: string): Promise<Payment | null> {
      const response = await fetch(`${this.baseUrl}/api/payments/${id}`);
      if (!response.ok) return null;
      return response.json();
    },

    async create(payment: Omit<Payment, 'id'>): Promise<Payment> {
      const response = await fetch(`${this.baseUrl}/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      });
      if (!response.ok) throw new Error('Failed to create payment');
      return response.json();
    },

    async update(id: string, payment: Partial<Payment>): Promise<Payment> {
      const response = await fetch(`${this.baseUrl}/api/payments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      });
      if (!response.ok) throw new Error('Failed to update payment');
      return response.json();
    },

    async delete(id: string): Promise<boolean> {
      const response = await fetch(`${this.baseUrl}/api/payments/${id}`, {
        method: 'DELETE'
      });
      return response.ok;
    },

    async getStudentPayments(studentId: string): Promise<Payment[]> {
      const response = await fetch(`${this.baseUrl}/api/students/${studentId}/payments`);
      if (!response.ok) throw new Error('Failed to fetch student payments');
      return response.json();
    }
  };

  finances: FinanceService = {
    async getSummary(): Promise<FinanceSummary> {
      const response = await fetch(`${this.baseUrl}/api/finances/summary`);
      if (!response.ok) throw new Error('Failed to fetch finance summary');
      return response.json();
    },

    async getTransactions(period: 'day' | 'week' | 'month' | 'year'): Promise<Transaction[]> {
      const response = await fetch(`${this.baseUrl}/api/finances/transactions?period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },

    async generateReport(type: 'income' | 'expense' | 'balance', period: string): Promise<Report> {
      const response = await fetch(`${this.baseUrl}/api/finances/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, period })
      });
      if (!response.ok) throw new Error('Failed to generate report');
      return response.json();
    }
  };

  sync: SyncService = {
    async syncNow(): Promise<SyncResult> {
      const response = await fetch(`${this.baseUrl}/api/sync`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to sync');
      return response.json();
    },

    async getSyncStatus(): Promise<SyncStatus> {
      const response = await fetch(`${this.baseUrl}/api/sync/status`);
      if (!response.ok) throw new Error('Failed to get sync status');
      return response.json();
    },

    enableAutoSync(): void {
      // Implementar auto-sync
      console.log('Auto-sync enabled');
    },

    disableAutoSync(): void {
      // Implementar deshabilitar auto-sync
      console.log('Auto-sync disabled');
    },

    isOnline(): boolean {
      return navigator.onLine;
    }
  };

  security: SecurityService = {
    async encryptData(data: any): Promise<string> {
      const response = await fetch(`${this.baseUrl}/api/security/encrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      if (!response.ok) throw new Error('Failed to encrypt data');
      const result = await response.json();
      return result.encryptedData;
    },

    async decryptData(encryptedData: string): Promise<any> {
      const response = await fetch(`${this.baseUrl}/api/security/decrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedData })
      });
      if (!response.ok) throw new Error('Failed to decrypt data');
      const result = await response.json();
      return result.data;
    },

    async hashPassword(password: string): Promise<string> {
      const response = await fetch(`${this.baseUrl}/api/security/hash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!response.ok) throw new Error('Failed to hash password');
      const result = await response.json();
      return result.hash;
    },

    async verifyPassword(password: string, hash: string): Promise<boolean> {
      const response = await fetch(`${this.baseUrl}/api/security/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, hash })
      });
      if (!response.ok) throw new Error('Failed to verify password');
      const result = await response.json();
      return result.valid;
    },

    async generateApiKey(): Promise<string> {
      const response = await fetch(`${this.baseUrl}/api/security/api-key`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to generate API key');
      const result = await response.json();
      return result.apiKey;
    }
  };

  audit: AuditService = {
    async logAction(action: AuditAction): Promise<void> {
      await fetch(`${this.baseUrl}/api/audit/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action)
      });
    },

    async getLogs(filters?: AuditFilters): Promise<AuditLog[]> {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`${this.baseUrl}/api/audit/logs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      return response.json();
    },

    async exportLogs(filters?: AuditFilters): Promise<string> {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
      }
      
      const response = await fetch(`${this.baseUrl}/api/audit/export?${params}`);
      if (!response.ok) throw new Error('Failed to export audit logs');
      return response.text();
    }
  };

  constructor() {
    this.api = getPlatformAPI();
  }
}

// Exportar la instancia de servicios
export const appServices = new AppServicesImpl();

// Hook de React para usar los servicios
import { useContext, createContext } from 'react';

const ServicesContext = createContext<AppServices>(appServices);

export function useServices() {
  return useContext(ServicesContext);
}

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  return (
    <ServicesContext.Provider value={appServices}>
      {children}
    </ServicesContext.Provider>
  );
}