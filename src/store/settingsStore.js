import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const syncDomAttribute = (show) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-furigana', show ? 'visible' : 'hidden');
  }
};

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      showFurigana: true,

      toggleFurigana: () => {
        const nextState = !get().showFurigana;
        syncDomAttribute(nextState);
        set({ showFurigana: nextState });
      },

      setFurigana: (show) => {
        syncDomAttribute(show);
        set({ showFurigana: Boolean(show) });
      },
    }),
    {
      name: 'nihongo_app_settings_v1',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          syncDomAttribute(state.showFurigana);
        }
      },
    }
  )
);
