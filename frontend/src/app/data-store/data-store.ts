import { computed, effect, Injectable, signal } from '@angular/core';
import { AppState, INITIAL_STATE } from './data-store.model';

const STORAGE_KEY = 'mobile_dog_grooming_global_state';

@Injectable({
  providedIn: 'root',
})
export class DataStore {
  // 1. Private writable signal initialized from localStorage
  private readonly _state = signal<AppState>(this.loadInitialState());

  // 2. Public read-only selectors using computed()
  readonly isLoggedIn = computed(() => this._state().loginKey !== '');
  readonly loginKey = computed(() => this._state().loginKey);

  constructor() {
    // 3. Automatically sync state changes to localStorage
    effect(() => {
      try {
        const currentState = JSON.stringify(this._state());
        localStorage.setItem(STORAGE_KEY, currentState);
      } catch (error) {
        console.error('Failed to save state to localStorage:', error);
      }
    });
  }

  setLoginKey(key: string): void {
    this._state.update(state => ({...state, loginKey: key}));
  }

  resetStore(): void {
    this._state.set(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }

  // Helper to safely hydrate state on page load
  private loadInitialState(): AppState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Merge with INITIAL_STATE to prevent missing keys after app updates
        return { ...INITIAL_STATE, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
    }
    return INITIAL_STATE;
  }
}
