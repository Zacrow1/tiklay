'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { useSyncService } from '@/lib/sync-service';
import { usePlatformAPI } from '@/lib/platform';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
  showDetails?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function OfflineIndicator({ 
  className, 
  showDetails = false, 
  position = 'top-right' 
}: OfflineIndicatorProps) {
  const { api, isOnline } = usePlatformAPI();
  const { syncStatus, syncNow, startAutoSync, stopAutoSync } = useSyncService();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [showSyncDetails, setShowSyncDetails] = useState(false);

  useEffect(() => {
    if (syncStatus) {
      setLastSyncTime(syncStatus.lastSync);
      setIsSyncing(syncStatus.isSyncing);
    }
  }, [syncStatus]);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      await syncNow();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSyncTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'never';
    }
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <div className={cn(
      'fixed z-50 flex flex-col gap-2',
      positionClasses[position],
      className
    )}>
      {/* Indicador principal */}
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-all duration-300',
        isOnline 
          ? 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-800 dark:text-green-200'
          : 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-800 dark:text-red-200'
      )}>
        {isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        
        <span className="text-sm font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>
        
        {isOnline && syncStatus && (
          <div className="flex items-center gap-1">
            {isSyncing ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <div className={cn(
                'w-2 h-2 rounded-full',
                syncStatus.conflicts > 0 ? 'bg-yellow-500' : 'bg-green-500'
              )} />
            )}
          </div>
        )}
        
        {showDetails && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setShowSyncDetails(!showSyncDetails)}
          >
            <span className="text-xs">
              {showSyncDetails ? '▲' : '▼'}
            </span>
          </Button>
        )}
      </div>

      {/* Detalles de sincronización */}
      {showDetails && showDetails && syncStatus && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 min-w-[200px]">
          <div className="space-y-2">
            {/* Estado de sincronización */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Sync Status:
              </span>
              <Badge variant={isSyncing ? 'default' : 'secondary'} className="text-xs">
                {isSyncing ? 'Syncing...' : 'Idle'}
              </Badge>
            </div>

            {/* Última sincronización */}
            {lastSyncTime && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Last Sync:
                </span>
                <span className="text-xs text-gray-800 dark:text-gray-200">
                  {formatLastSyncTime(lastSyncTime)}
                </span>
              </div>
            )}

            {/* Pendientes */}
            {(syncStatus.pendingUploads > 0 || syncStatus.pendingDownloads > 0) && (
              <div className="space-y-1">
                {syncStatus.pendingUploads > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Pending Upload:
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {syncStatus.pendingUploads}
                    </Badge>
                  </div>
                )}
                {syncStatus.pendingDownloads > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Pending Download:
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {syncStatus.pendingDownloads}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Conflictos */}
            {syncStatus.conflicts > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Conflicts:
                </span>
                <Badge variant="destructive" className="text-xs">
                  {syncStatus.conflicts}
                </Badge>
              </div>
            )}

            {/* Acciones */}
            <div className="flex gap-1 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-7 text-xs"
                onClick={handleSyncNow}
                disabled={isSyncing || !isOnline}
              >
                {isSyncing ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  'Sync Now'
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => {
                  if (syncStatus.isSyncing) {
                    stopAutoSync();
                  } else {
                    startAutoSync();
                  }
                }}
              >
                <span className="text-xs">
                  {syncStatus.isSyncing ? '⏸' : '▶'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de conflictos */}
      {syncStatus && syncStatus.conflicts > 0 && (
        <div className="bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-800 dark:text-yellow-200 px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">
            {syncStatus.conflicts} conflict{syncStatus.conflicts > 1 ? 's' : ''} need resolution
          </span>
        </div>
      )}
    </div>
  );
}

// Componente para banner de modo offline
export function OfflineBanner({ className }: { className?: string }) {
  const { isOnline } = usePlatformAPI();
  const { syncStatus } = useSyncService();

  if (isOnline) return null;

  return (
    <div className={cn(
      'w-full bg-orange-100 border-b border-orange-200 text-orange-800 dark:bg-orange-900 dark:border-orange-800 dark:text-orange-200 px-4 py-3',
      className
    )}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">
            You're currently offline. Some features may be limited.
          </span>
        </div>
        
        {syncStatus && syncStatus.pendingUploads > 0 && (
          <span className="text-xs">
            {syncStatus.pendingUploads} changes will sync when you're back online
          </span>
        )}
      </div>
    </div>
  );
}

// Hook para usar el indicador offline
export function useOfflineIndicator() {
  const { api, isOnline } = usePlatformAPI();
  const { syncStatus, syncNow } = useSyncService();

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const showOfflineNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Offline Mode', {
        body: 'You are now offline. Changes will be synced when you reconnect.',
        icon: '/icon.png'
      });
    }
  };

  const showOnlineNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Back Online', {
        body: 'You are now online. Syncing your changes...',
        icon: '/icon.png'
      });
    }
  };

  return {
    isOnline,
    syncStatus,
    syncNow,
    requestNotificationPermission,
    showOfflineNotification,
    showOnlineNotification
  };
}