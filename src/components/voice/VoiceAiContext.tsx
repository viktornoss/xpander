'use client';

import React, { createContext, useContext, useState } from 'react';
import VoiceAiModal from './VoiceAiModal';

interface VoiceAiContextType {
  isVoiceModalOpen: boolean;
  openVoiceAi: () => void;
  closeVoiceAi: () => void;
  toggleVoiceAi: () => void;
}

const VoiceAiContext = createContext<VoiceAiContextType | undefined>(undefined);

export function VoiceAiProvider({ children }: { children: React.ReactNode }) {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const openVoiceAi = () => setIsVoiceModalOpen(true);
  const closeVoiceAi = () => setIsVoiceModalOpen(false);
  const toggleVoiceAi = () => setIsVoiceModalOpen(prev => !prev);

  return (
    <VoiceAiContext.Provider value={{ isVoiceModalOpen, openVoiceAi, closeVoiceAi, toggleVoiceAi }}>
      {children}
      <VoiceAiModal isOpen={isVoiceModalOpen} onClose={closeVoiceAi} />
    </VoiceAiContext.Provider>
  );
}

export function useVoiceAi() {
  const context = useContext(VoiceAiContext);
  if (!context) {
    throw new Error('useVoiceAi must be used within a VoiceAiProvider');
  }
  return context;
}

