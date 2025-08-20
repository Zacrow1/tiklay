'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: {
    used: number;
    total: number;
    percentage: number;
  };
  fps: number;
  loadTime: number;
}

interface PerformanceConfig {
  enableMetrics: boolean;
  enableProfiling: boolean;
  sampleRate: number;
  maxSamples: number;
}

export function usePerformance(config: Partial<PerformanceConfig> = {}) {
  const {
    enableMetrics = true,
    enableProfiling = false,
    sampleRate = 1000,
    maxSamples = 100
  } = config;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    fps: 0,
    loadTime: 0
  });

  const [isProfiling, setIsProfiling] = useState(false);
  const [profileData, setProfileData] = useState<any[]>([]);
  
  const renderStartTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastFpsUpdate = useRef<number>(0);
  const mountTime = useRef<number>(Date.now());

  // Medir tiempo de renderizado
  const measureRenderTime = useCallback(() => {
    if (!enableMetrics) return;
    
    renderStartTime.current = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      setMetrics(prev => ({ ...prev, renderTime }));
    };
  }, [enableMetrics]);

  // Medir FPS
  useEffect(() => {
    if (!enableMetrics) return;

    let animationFrameId: number;
    
    const updateFps = () => {
      frameCount.current++;
      const now = performance.now();
      
      if (now - lastFpsUpdate.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (now - lastFpsUpdate.current));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount.current = 0;
        lastFpsUpdate.current = now;
      }
      
      animationFrameId = requestAnimationFrame(updateFps);
    };

    animationFrameId = requestAnimationFrame(updateFps);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [enableMetrics]);

  // Medir uso de memoria (solo en navegadores que lo soportan)
  useEffect(() => {
    if (!enableMetrics || !('memory' in performance)) return;

    const intervalId = setInterval(() => {
      const memory = (performance as any).memory;
      if (memory) {
        const used = memory.usedJSHeapSize;
        const total = memory.totalJSHeapSize;
        const percentage = Math.round((used / total) * 100);
        
        setMetrics(prev => ({
          ...prev,
          memoryUsage: { used, total, percentage }
        }));
      }
    }, sampleRate);

    return () => clearInterval(intervalId);
  }, [enableMetrics, sampleRate]);

  // Medir tiempo de carga
  useEffect(() => {
    if (!enableMetrics) return;
    
    const loadTime = Date.now() - mountTime.current;
    setMetrics(prev => ({ ...prev, loadTime }));
  }, [enableMetrics]);

  // Funciones de profiling
  const startProfiling = useCallback(() => {
    if (!enableProfiling) return;
    
    setIsProfiling(true);
    setProfileData([]);
    
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark('profile-start');
    }
  }, [enableProfiling]);

  const stopProfiling = useCallback(() => {
    if (!enableProfiling || !isProfiling) return;
    
    setIsProfiling(false);
    
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark('profile-end');
      performance.measure('profile', 'profile-start', 'profile-end');
      
      const measures = performance.getEntriesByName('profile');
      if (measures.length > 0) {
        const measure = measures[measures.length - 1];
        const data = {
          duration: measure.duration,
          startTime: measure.startTime,
          entries: performance.getEntriesByType('measure').slice(-maxSamples)
        };
        
        setProfileData(prev => [...prev.slice(-maxSamples + 1), data]);
        performance.clearMarks();
        performance.clearMeasures();
      }
    }
  }, [enableProfiling, isProfiling, maxSamples]);

  const addProfileMarker = useCallback((name: string) => {
    if (!enableProfiling || !isProfiling) return;
    
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(name);
    }
  }, [enableProfiling, isProfiling]);

  // Optimización de carga diferida
  const useLazyLoad = useCallback(<T,>(
    loader: () => Promise<T>,
    deps: any[] = []
  ) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      let isMounted = true;
      
      const loadData = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const result = await loader();
          if (isMounted) {
            setData(result);
          }
        } catch (err) {
          if (isMounted) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      loadData();

      return () => {
        isMounted = false;
      };
    }, deps);

    return { data, loading, error };
  }, []);

  // Optimización de debounce
  const useDebounce = useCallback(<T extends any[]>(
    callback: (...args: T) => void,
    delay: number
  ) => {
    const timeoutRef = useRef<NodeJS.Timeout>();

    return useCallback((...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }, [callback, delay]);
  }, []);

  // Optimización de throttle
  const useThrottle = useCallback(<T extends any[]>(
    callback: (...args: T) => void,
    delay: number
  ) => {
    const lastCall = useRef<number>(0);

    return useCallback((...args: T) => {
      const now = Date.now();
      
      if (now - lastCall.current >= delay) {
        callback(...args);
        lastCall.current = now;
      }
    }, [callback, delay]);
  }, []);

  // Optimización de memoización
  const useMemoizedCallback = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
    deps: any[]
  ) => {
    return useCallback(callback, deps);
  }, []);

  // Optimización de caché
  const useCache = useCallback(<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 5 * 60 * 1000 // 5 minutos por defecto
  ) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      const cacheKey = `cache_${key}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        try {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < ttl) {
            setData(cachedData);
            return;
          }
        } catch (err) {
          console.error('Error reading cache:', err);
        }
      }

      const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const result = await fetcher();
          setData(result);
          
          // Guardar en caché
          localStorage.setItem(cacheKey, JSON.stringify({
            data: result,
            timestamp: Date.now()
          }));
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [key, fetcher, ttl]);

    const invalidate = useCallback(() => {
      const cacheKey = `cache_${key}`;
      localStorage.removeItem(cacheKey);
      setData(null);
    }, [key]);

    return { data, loading, error, invalidate };
  }, []);

  return {
    metrics,
    isProfiling,
    profileData,
    measureRenderTime,
    startProfiling,
    stopProfiling,
    addProfileMarker,
    useLazyLoad,
    useDebounce,
    useThrottle,
    useMemoizedCallback,
    useCache
  };
}

// Hook para optimizar renderizados condicionales
export function useConditionalRender<T>(
  condition: boolean,
  component: React.ComponentType<T>,
  props: T
) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (condition && !shouldRender) {
      setShouldRender(true);
    }
  }, [condition, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  const Component = component;
  return <Component {...props} />;
}

// Hook para optimizar listas grandes
export function useOptimizedList<T>(
  items: T[],
  options: {
    itemHeight?: number;
    containerHeight?: number;
    overscan?: number;
  } = {}
) {
  const {
    itemHeight = 50,
    containerHeight = 400,
    overscan = 3
  } = options;

  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    scrollTop,
    setScrollTop,
    visibleRange
  };
}