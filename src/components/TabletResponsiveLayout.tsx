'use client';

import { ReactNode } from 'react';
import { useOrientationInfo } from './ScreenOrientationControls';

interface TabletResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
  portraitClassName?: string;
  landscapeClassName?: string;
  enableTabletOptimization?: boolean;
}

export function TabletResponsiveLayout({
  children,
  className = '',
  portraitClassName = '',
  landscapeClassName = '',
  enableTabletOptimization = true,
}: TabletResponsiveLayoutProps) {
  const { isPortrait, isLandscape, isTablet } = useOrientationInfo();

  if (!enableTabletOptimization || !isTablet) {
    return <div className={className}>{children}</div>;
  }

  const getResponsiveClasses = () => {
    let responsiveClasses = className;
    
    if (isPortrait) {
      responsiveClasses += ` tablet-portrait-optimized ${portraitClassName}`;
    } else if (isLandscape) {
      responsiveClasses += ` tablet-landscape-optimized ${landscapeClassName}`;
    }
    
    return responsiveClasses;
  };

  return (
    <div className={getResponsiveClasses()}>
      {children}
    </div>
  );
}

// Grid component optimized for tablet rotation
interface TabletResponsiveGridProps {
  children: ReactNode;
  className?: string;
  portraitColumns?: number;
  landscapeColumns?: number;
  enableTabletOptimization?: boolean;
}

export function TabletResponsiveGrid({
  children,
  className = '',
  portraitColumns = 1,
  landscapeColumns = 2,
  enableTabletOptimization = true,
}: TabletResponsiveGridProps) {
  const { isPortrait, isLandscape, isTablet } = useOrientationInfo();

  if (!enableTabletOptimization || !isTablet) {
    return <div className={`grid ${className}`}>{children}</div>;
  }

  const getGridClasses = () => {
    let gridClasses = 'grid';
    
    if (isPortrait) {
      gridClasses += ` tablet-portrait-grid grid-cols-${portraitColumns}`;
    } else if (isLandscape) {
      gridClasses += ` tablet-landscape-grid grid-cols-${landscapeColumns}`;
    }
    
    gridClasses += ` ${className}`;
    return gridClasses;
  };

  return (
    <div className={getGridClasses()}>
      {children}
    </div>
  );
}

// Flex component optimized for tablet rotation
interface TabletResponsiveFlexProps {
  children: ReactNode;
  className?: string;
  portraitDirection?: 'row' | 'column';
  landscapeDirection?: 'row' | 'column';
  enableTabletOptimization?: boolean;
}

export function TabletResponsiveFlex({
  children,
  className = '',
  portraitDirection = 'column',
  landscapeDirection = 'row',
  enableTabletOptimization = true,
}: TabletResponsiveFlexProps) {
  const { isPortrait, isLandscape, isTablet } = useOrientationInfo();

  if (!enableTabletOptimization || !isTablet) {
    return <div className={`flex ${className}`}>{children}</div>;
  }

  const getFlexClasses = () => {
    let flexClasses = 'flex';
    
    if (isPortrait) {
      flexClasses += ` tablet-portrait-optimized flex-${portraitDirection}`;
    } else if (isLandscape) {
      flexClasses += ` tablet-landscape-optimized flex-${landscapeDirection}`;
    }
    
    flexClasses += ` ${className}`;
    return flexClasses;
  };

  return (
    <div className={getFlexClasses()}>
      {children}
    </div>
  );
}
