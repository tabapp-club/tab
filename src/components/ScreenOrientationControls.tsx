'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { RotateCcw, RotateCw, Lock, Unlock, Smartphone, Monitor } from 'lucide-react';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';

interface ScreenOrientationControlsProps {
  className?: string;
  showOnMobile?: boolean;
  showOnTablet?: boolean;
  showOnDesktop?: boolean;
}

export function ScreenOrientationControls({
  className = '',
  showOnMobile = false,
  showOnTablet = true,
  showOnDesktop = false,
}: ScreenOrientationControlsProps) {
  const {
    orientation,
    angle,
    isPortrait,
    isLandscape,
    isSupported,
    canRotate,
    lockOrientation,
    unlockOrientation,
  } = useScreenOrientation();

  const [isLocked, setIsLocked] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect if device is a tablet
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isTabletDevice = /tablet|ipad|android(?!.*mobile)/i.test(userAgent) || 
                            (window.innerWidth >= 768 && window.innerWidth <= 1024);
      setIsTablet(isTabletDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Don't show controls if not supported or not on appropriate device
  if (!isSupported || !canRotate) {
    return null;
  }

  // Check if should show based on device type
  const shouldShow = (isTablet && showOnTablet) || 
                    (!isTablet && window.innerWidth < 768 && showOnMobile) ||
                    (!isTablet && window.innerWidth >= 1024 && showOnDesktop);

  if (!shouldShow) {
    return null;
  }

  const handleRotatePortrait = async () => {
    const success = await lockOrientation('portrait');
    if (success) {
      setIsLocked(true);
    }
  };

  const handleRotateLandscape = async () => {
    const success = await lockOrientation('landscape');
    if (success) {
      setIsLocked(true);
    }
  };

  const handleUnlock = async () => {
    const success = await unlockOrientation();
    if (success) {
      setIsLocked(false);
    }
  };

  const handleRotate90 = () => {
    // Rotate 90 degrees clockwise
    if (isPortrait) {
      handleRotateLandscape();
    } else {
      handleRotatePortrait();
    }
  };

  const getOrientationIcon = () => {
    if (isPortrait) {
      return <Smartphone className="w-4 h-4" />;
    } else {
      return <Monitor className="w-4 h-4" />;
    }
  };

  const getOrientationText = () => {
    if (isPortrait) {
      return 'Portrait';
    } else {
      return 'Landscape';
    }
  };

  return (
    <div className={`flex items-center space-x-2 screen-orientation-controls rounded-lg px-3 py-2 ${className}`}>
      {/* Orientation Status */}
      <div className="flex items-center space-x-1 text-sm text-gray-600">
        {getOrientationIcon()}
        <span className="hidden sm:inline">{getOrientationText()}</span>
        <span className="sm:hidden">{angle}°</span>
      </div>

      {/* Rotation Controls */}
      <div className="flex items-center space-x-1">
        {!isLocked ? (
          <>
            <Button
              onClick={handleRotate90}
              size="sm"
              variant="outline"
              className="p-2"
              title={`Rotate to ${isPortrait ? 'landscape' : 'portrait'}`}
            >
              {isPortrait ? <RotateCw className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={handleRotatePortrait}
              size="sm"
              variant="outline"
              className="p-2"
              title="Lock to portrait"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleRotateLandscape}
              size="sm"
              variant="outline"
              className="p-2"
              title="Lock to landscape"
            >
              <Monitor className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Button
            onClick={handleUnlock}
            size="sm"
            variant="outline"
            className="p-2"
            title="Unlock orientation"
          >
            <Unlock className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Hook for components that need orientation info
export function useOrientationInfo() {
  const orientation = useScreenOrientation();
  
  return {
    isPortrait: orientation.isPortrait,
    isLandscape: orientation.isLandscape,
    orientation: orientation.orientation,
    angle: orientation.angle,
    isTablet: typeof window !== 'undefined' && 
              (/tablet|ipad|android(?!.*mobile)/i.test(navigator.userAgent) || 
               (window.innerWidth >= 768 && window.innerWidth <= 1024)),
  };
}
