import React from 'react';

export type AppId = 'terminal' | 'files' | 'editor' | 'browser' | 'monitor' | 'settings' | 'calculator' | 'viewer';

export interface AppState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimised: boolean;
  isMaximised: boolean;
  zIndex: number;
}
