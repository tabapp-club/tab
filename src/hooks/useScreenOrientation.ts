'use client';

import { useState, useEffect, useCallback } from 'react';

export type OrientationType = 'portrait' | 'landscape' | 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary';

export interface ScreenOrientationState {
  orientation: OrientationType;
  angle: number;
  isPortrait: boolean;
  isLandscape: boolean;
  isSupported: boolean;
  canRotate: boolean;
}

export function useScreenOrientation() {
  const [orientationState, setOrientationState] = useState<ScreenOrientationState>({
    orientation: 'portrait',
    angle: 0,
    isPortrait: true,
    isLandscape: false,
    isSupported: false,
    canRotate: false,
  });

  const updateOrientation = useCallback(() => {
    if (typeof window === 'undefined') return;

    const isSupported = 'orientation' in screen && 'onorientationchange' in window;
    const canRotate = isSupported && 'lock' in screen.orientation;

    let orientation: OrientationType = 'portrait';
    let angle = 0;
    let isPortrait = true;
    let isLandscape = false;

    if (isSupported) {
      // Use Screen Orientation API if available
      const screenOrientation = screen.orientation;
      orientation = screenOrientation.type as OrientationType;
      angle = screenOrientation.angle;
    } else {
      // Fallback to window.orientation for older browsers
      const windowOrientation = window.orientation;
      if (windowOrientation !== undefined) {
        angle = windowOrientation;
        if (angle === 0 || angle === 180) {
          orientation = 'portrait';
          isPortrait = true;
          isLandscape = false;
        } else {
          orientation = 'landscape';
          isPortrait = false;
          isLandscape = true;
        }
      } else {
        // Fallback to window dimensions
        const { innerWidth, innerHeight } = window;
        if (innerWidth > innerHeight) {
          orientation = 'landscape';
          isPortrait = false;
          isLandscape = true;
        } else {
          orientation = 'portrait';
          isPortrait = true;
          isLandscape = false;
        }
      }
    }

    setOrientationState({
      orientation,
      angle,
      isPortrait,
      isLandscape,
      isSupported,
      canRotate,
    });
  }, []);

  const lockOrientation = useCallback(async (orientation: OrientationLockType) => {
    if (!orientationState.isSupported || !orientationState.canRotate) {
      console.warn('Screen orientation lock not supported');
      return false;
    }

    try {
      await screen.orientation.lock(orientation);
      return true;
    } catch (error) {
      console.error('Failed to lock orientation:', error);
      return false;
    }
  }, [orientationState.isSupported, orientationState.canRotate]);

  const unlockOrientation = useCallback(async () => {
    if (!orientationState.isSupported || !orientationState.canRotate) {
      console.warn('Screen orientation unlock not supported');
      return false;
    }

    try {
      screen.orientation.unlock();
      return true;
    } catch (error) {
      console.error('Failed to unlock orientation:', error);
      return false;
    }
  }, [orientationState.isSupported, orientationState.canRotate]);

  useEffect(() => {
    updateOrientation();

    // Listen for orientation changes
    const handleOrientationChange = () => {
      // Small delay to ensure the orientation has actually changed
      setTimeout(updateOrientation, 100);
    };

    const handleResize = () => {
      // Update orientation on resize as well
      updateOrientation();
    };

    // Add event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('orientationchange', handleOrientationChange);
      window.addEventListener('resize', handleResize);
      
      // Screen Orientation API events
      if ('orientation' in screen) {
        screen.orientation.addEventListener('change', handleOrientationChange);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('orientationchange', handleOrientationChange);
        window.removeEventListener('resize', handleResize);
        
        if ('orientation' in screen) {
          screen.orientation.removeEventListener('change', handleOrientationChange);
        }
      }
    };
  }, [updateOrientation]);

  return {
    ...orientationState,
    lockOrientation,
    unlockOrientation,
    updateOrientation,
  };
}
