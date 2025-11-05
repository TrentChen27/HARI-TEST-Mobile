import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { ExerciseService } from '../services/exercise.service';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { StatsModalComponent } from '../modals/stats-modal/stats-modal.component';
import { DataRefreshService } from "../services/data-refresh.service";
import { Subscription } from "rxjs";

type SortColumn = 'duration' | 'date';
type SortDirection = 'asc' | 'desc' | null;

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false,
})
export class HistoryPage implements OnInit {

  private router = inject(Router);
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  private exerciseService = inject(ExerciseService);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private dataRefreshService = inject(DataRefreshService);
  private refreshSubscription?: Subscription;

  historyExercises: any[] = [];
  paginatedExercises: any[] = [];
  isLoading = false;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  sortColumn: SortColumn | null = null;
  sortDirection: SortDirection = null;

  async ionViewWillEnter() {
    await this.loadData();

    this.refreshSubscription = this.dataRefreshService.refreshHistory$.subscribe(() => {
      console.log('Received refresh trigger');
      this.loadData();
    });
  }

  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    try {
      this.historyExercises = await this.exerciseService.getExerciseHistory();
      this.currentPage = 1;
      this.applySorting();
      this.updatePagination();
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      this.isLoading = false;
    }
  }

  sortBy(column: SortColumn) {
    if (this.sortColumn === column) {
      // Toggle through: asc -> desc -> null
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        this.sortDirection = null;
        this.sortColumn = null;
      }
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.currentPage = 1;
    this.applySorting();
    this.updatePagination();
  }

  private applySorting() {
    if (!this.sortColumn || !this.sortDirection) {
      // Reset to original order (you might want to reload from service)
      return;
    }

    this.historyExercises.sort((a, b) => {
      let compareValue = 0;

      if (this.sortColumn === 'duration') {
        compareValue = a.exerciseDuration - b.exerciseDuration
      } else if (this.sortColumn === 'date') {
        const dateA = new Date(a.dateTime).getTime();
        const dateB = new Date(b.dateTime).getTime();
        compareValue = dateA - dateB;
      }

      return this.sortDirection === 'asc' ? compareValue : -compareValue;
    });
  }

  // private parseDuration(duration: string): number {
  //   if (!duration) return 0;
  //
  //   // Parse duration string (e.g., "30 minutes", "1 hour 30 minutes", "1h 30min")
  //   const hourMatch = duration.match(/(\d+)\s*(h|hour)/i);
  //   const minMatch = duration.match(/(\d+)\s*(m|min)/i);
  //
  //   const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  //   const minutes = minMatch ? parseInt(minMatch[1]) : 0;
  //
  //   return hours * 60 + minutes;
  // }

  getSortIcon(column: SortColumn): string {
    if (this.sortColumn !== column) {
      return 'swap-vertical-outline';
    }
    return this.sortDirection === 'asc' ? 'chevron-up' : 'chevron-down';
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.historyExercises.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedExercises = this.historyExercises.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  async openStatsModal() {
    const modal = await this.modalCtrl.create({
      component: StatsModalComponent
    });
    await modal.present();
  }

  async signOut() {
    const alert = await this.alertCtrl.create({
      header: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Sign Out',
          role: 'destructive',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  async handleRefresh(event: any) {
    await this.loadData();
    event.target.complete();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  ionViewWillLeave() {
    this.refreshSubscription?.unsubscribe();
  }
}
