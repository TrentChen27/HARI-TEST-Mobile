import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;

  constructor(private storage: Storage) {}

  async initStorage() {
    await this.storage.create();

    const savedTheme = await this.storage.get('darkMode');
    if (savedTheme !== null) {
      this.darkMode = savedTheme;
    } else {
      // Default to LIGHT mode
      this.darkMode = false;
    }
    this.applyTheme();
  }

  async toggleTheme() {
    this.darkMode = !this.darkMode;
    this.applyTheme();
    await this.storage.set('darkMode', this.darkMode);
  }

  private applyTheme() {
    if (this.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }
}
