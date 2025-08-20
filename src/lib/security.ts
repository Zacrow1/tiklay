import CryptoJS from 'crypto-js';

// Configuración de seguridad
const SECURITY_CONFIG = {
  // Clave de encriptación (en producción, esto debería venir de variables de entorno)
  ENCRYPTION_KEY: process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'tiklay-secure-key-2024',
  
  // Algoritmo de encriptación
  ENCRYPTION_ALGORITHM: 'AES-256-GCM',
  
  // Configuración de hashing
  HASH_ITERATIONS: 10000,
  HASH_KEY_LENGTH: 64,
  HASH_ALGORITHM: 'SHA-512',
  
  // Configuración de tokens
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 horas
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 días
  
  // Configuración de auditoría
  AUDIT_RETENTION_DAYS: 365,
  
  // Configuración de privacidad
  DATA_RETENTION_DAYS: 365 * 2, // 2 años
  ANONYMIZATION_DELAY_DAYS: 90
};

// Interfaz para datos sensibles
export interface SensitiveData {
  data: any;
  metadata?: {
    dataType: string;
    ownerId?: string;
    expiration?: string;
    accessLevel: 'public' | 'private' | 'restricted';
  };
}

// Interfaz para política de privacidad
export interface PrivacyPolicy {
  dataCollection: {
    purpose: string;
    dataTypes: string[];
    retentionPeriod: string;
  };
  dataUsage: {
    purposes: string[];
    thirdPartySharing: boolean;
    thirdParties?: string[];
  };
  userRights: {
    access: boolean;
    rectification: boolean;
    erasure: boolean;
    portability: boolean;
    objection: boolean;
  };
  securityMeasures: string[];
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
  };
}

// Servicio de seguridad
export class SecurityService {
  private config = SECURITY_CONFIG;

  // Encriptar datos
  async encryptData(data: any, metadata?: SensitiveData['metadata']): Promise<string> {
    try {
      const dataString = JSON.stringify({
        data,
        metadata: metadata || {
          dataType: 'unknown',
          accessLevel: 'private'
        },
        timestamp: new Date().toISOString()
      });

      const encrypted = CryptoJS.AES.encrypt(
        dataString,
        this.config.ENCRYPTION_KEY
      ).toString();

      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  // Desencriptar datos
  async decryptData(encryptedData: string): Promise<any> {
    try {
      const decrypted = CryptoJS.AES.decrypt(
        encryptedData,
        this.config.ENCRYPTION_KEY
      );

      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
        throw new Error('Invalid encrypted data');
      }

      const parsed = JSON.parse(decryptedString);
      
      // Verificar expiración
      if (parsed.metadata?.expiration) {
        const expirationDate = new Date(parsed.metadata.expiration);
        if (expirationDate < new Date()) {
          throw new Error('Data has expired');
        }
      }

      return parsed.data;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Generar hash de contraseña
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = CryptoJS.lib.WordArray.random(128 / 8);
      const key = CryptoJS.PBKDF2(password, salt, {
        keySize: this.config.HASH_KEY_LENGTH / 32,
        iterations: this.config.HASH_ITERATIONS
      });

      return CryptoJS.enc.Base64.stringify(salt.concat(key));
    } catch (error) {
      console.error('Password hashing error:', error);
      throw new Error('Failed to hash password');
    }
  }

  // Verificar contraseña
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const decoded = CryptoJS.enc.Base64.parse(hashedPassword);
      const salt = CryptoJS.lib.WordArray.create(decoded.words.slice(0, 4));
      const key = CryptoJS.lib.WordArray.create(decoded.words.slice(4));

      const derivedKey = CryptoJS.PBKDF2(password, salt, {
        keySize: this.config.HASH_KEY_LENGTH / 32,
        iterations: this.config.HASH_ITERATIONS
      });

      return derivedKey.toString() === key.toString();
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  // Generar API key
  async generateApiKey(): Promise<string> {
    try {
      const timestamp = Date.now().toString();
      const random = CryptoJS.lib.WordArray.random(32);
      const combined = timestamp + random.toString();
      
      const apiKey = CryptoJS.SHA256(combined).toString();
      
      return `tk_${apiKey.substring(0, 32)}`;
    } catch (error) {
      console.error('API key generation error:', error);
      throw new Error('Failed to generate API key');
    }
  }

  // Validar API key
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      // Verificar formato
      if (!apiKey.startsWith('tk_') || apiKey.length !== 35) {
        return false;
      }

      // Aquí podrías verificar contra una base de datos de API keys válidas
      // Por ahora, solo validamos el formato
      return true;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  }

  // Generar token JWT simplificado
  async generateToken(payload: any): Promise<string> {
    try {
      const header = {
        alg: 'HS256',
        typ: 'JWT'
      };

      const now = Math.floor(Date.now() / 1000);
      const tokenPayload = {
        ...payload,
        iat: now,
        exp: now + Math.floor(this.config.TOKEN_EXPIRY / 1000)
      };

      const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
      const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));

      const signature = CryptoJS.HmacSHA256(
        `${encodedHeader}.${encodedPayload}`,
        this.config.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Base64url);

      return `${encodedHeader}.${encodedPayload}.${signature}`;
    } catch (error) {
      console.error('Token generation error:', error);
      throw new Error('Failed to generate token');
    }
  }

  // Verificar token
  async verifyToken(token: string): Promise<any> {
    try {
      const [encodedHeader, encodedPayload, signature] = token.split('.');

      // Verificar firma
      const expectedSignature = CryptoJS.HmacSHA256(
        `${encodedHeader}.${encodedPayload}`,
        this.config.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Base64url);

      if (signature !== expectedSignature) {
        throw new Error('Invalid token signature');
      }

      // Decodificar payload
      const payload = JSON.parse(this.base64UrlDecode(encodedPayload));

      // Verificar expiración
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token has expired');
      }

      return payload;
    } catch (error) {
      console.error('Token verification error:', error);
      throw new Error('Invalid token');
    }
  }

  // Sanitizar datos para prevenir XSS
  sanitizeData(data: any): any {
    if (typeof data === 'string') {
      return data
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    } else if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    } else if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeData(value);
      }
      return sanitized;
    }
    return data;
  }

  // Validar entrada
  validateInput(input: string, type: 'email' | 'phone' | 'name' | 'text'): boolean {
    const patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\+?[\d\s\-\(\)]+$/,
      name: /^[a-zA-Z\s\-\']{2,50}$/,
      text: /^[\w\s\-\.\,\!\?]{1,500}$/
    };

    return patterns[type].test(input);
  }

  // Generar contraseña segura
  generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }

  // Anonimizar datos
  anonymizeData(data: any): any {
    if (typeof data === 'string') {
      // Anonimizar email
      if (data.includes('@')) {
        const [local, domain] = data.split('@');
        return `${local.substring(0, 2)}***@${domain}`;
      }
      // Anonimizar teléfono
      if (/[\d]/.test(data)) {
        return data.replace(/\d(?=\d{4})/g, '*');
      }
      // Anonimizar nombre
      return data.substring(0, 1) + '***';
    } else if (Array.isArray(data)) {
      return data.map(item => this.anonymizeData(item));
    } else if (typeof data === 'object' && data !== null) {
      const anonymized: any = {};
      for (const [key, value] of Object.entries(data)) {
        anonymized[key] = this.anonymizeData(value);
      }
      return anonymized;
    }
    return data;
  }

  // Métodos auxiliares
  private base64UrlEncode(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private base64UrlDecode(str: string): string {
    str += '='.repeat((4 - str.length % 4) % 4);
    return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
  }
}

// Exportar instancia del servicio
export const securityService = new SecurityService();

// Hook de React para usar el servicio de seguridad
import { useState, useEffect } from 'react';

export function useSecurity() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Verificar estado de conexión segura
    const checkSecureConnection = () => {
      setIsOnline(window.location.protocol === 'https:' || window.location.hostname === 'localhost');
    };

    checkSecureConnection();
    window.addEventListener('online', checkSecureConnection);
    window.addEventListener('offline', checkSecureConnection);

    return () => {
      window.removeEventListener('online', checkSecureConnection);
      window.removeEventListener('offline', checkSecureConnection);
    };
  }, []);

  const encryptData = async (data: any, metadata?: SensitiveData['metadata']) => {
    return await securityService.encryptData(data, metadata);
  };

  const decryptData = async (encryptedData: string) => {
    return await securityService.decryptData(encryptedData);
  };

  const hashPassword = async (password: string) => {
    return await securityService.hashPassword(password);
  };

  const verifyPassword = async (password: string, hash: string) => {
    return await securityService.verifyPassword(password, hash);
  };

  const generateApiKey = async () => {
    return await securityService.generateApiKey();
  };

  const validateApiKey = async (apiKey: string) => {
    return await securityService.validateApiKey(apiKey);
  };

  const generateToken = async (payload: any) => {
    return await securityService.generateToken(payload);
  };

  const verifyToken = async (token: string) => {
    return await securityService.verifyToken(token);
  };

  const sanitizeData = (data: any) => {
    return securityService.sanitizeData(data);
  };

  const validateInput = (input: string, type: 'email' | 'phone' | 'name' | 'text') => {
    return securityService.validateInput(input, type);
  };

  const generateSecurePassword = (length?: number) => {
    return securityService.generateSecurePassword(length);
  };

  const anonymizeData = (data: any) => {
    return securityService.anonymizeData(data);
  };

  return {
    isOnline,
    encryptData,
    decryptData,
    hashPassword,
    verifyPassword,
    generateApiKey,
    validateApiKey,
    generateToken,
    verifyToken,
    sanitizeData,
    validateInput,
    generateSecurePassword,
    anonymizeData
  };
}