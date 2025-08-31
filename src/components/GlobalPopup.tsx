"use client";

import React from 'react';
import { Popup } from '@/components/ui/Popup';
import { usePopup } from '@/contexts/PopupContext';

export function GlobalPopup() {
  const { popup, hidePopup } = usePopup();

  return (
    <Popup
      type={popup.type}
      title={popup.title}
      message={popup.message}
      isVisible={popup.isVisible}
      onClose={hidePopup}
    />
  );
}
