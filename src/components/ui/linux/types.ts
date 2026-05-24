import React from 'react';

export type AppId = 'terminal' | 'files' | 'viewer' | 'trash';

export interface AppState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimised: boolean;
  isMaximised: boolean;
  zIndex: number;
}
