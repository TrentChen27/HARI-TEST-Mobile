import { Component, OnInit, inject } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ExerciseFormComponent } from '../modals/exercise-form/exercise-form.component';
import { ExerciseService } from '../services/exercise.service';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { DataRefreshService} from "../services/data-refresh.service";

export interface ExerciseRecord {
  id: number;
  exerciseType: string;
  exerciseDuration: string;
  exerciseLocation: 'inside' | 'outside';
  dateTime: string;
  username: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  private router = inject(Router);
  private exerciseService = inject(ExerciseService);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private dataRefreshService = inject(DataRefreshService);

  currentUser: any = null;
  todaysExercises: ExerciseRecord[] = [];
  isLoading = false;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  paginatedExercises: ExerciseRecord[] = [];

  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  async ngOnInit() {
    await this.themeService.initStorage();
    this.currentUser = await this.authService.getStoredUser();
    this.loadData();
  }

  async loadData() {
    this.isLoading = true;

    if (!this.currentUser) {
      this.currentUser = await this.authService.getStoredUser();
    }

    try {
      this.todaysExercises = await this.exerciseService.getTodaysExercises();
      // console.log('Loaded exercises:', this.todaysExercises);
      this.updatePagination();
    } catch (err) {
      console.error('Error loading exercises:', err);
    } finally {
      this.isLoading = false;
    }
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.todaysExercises.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedExercises = this.todaysExercises.slice(startIndex, endIndex);
    // console.log('Paginated exercises:', this.paginatedExercises);
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

  async openExerciseModal(exercise: ExerciseRecord | null = null) {
    const modal = await this.modalCtrl.create({
      component: ExerciseFormComponent,
      componentProps: {
        exerciseToEdit: exercise
      }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'saved') {
      await this.loadData();
      this.dataRefreshService.triggerHistoryRefresh();
    }
  }

  async deleteExercise(exercise: ExerciseRecord) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Exercise',
      message: `Are you sure you want to delete "${exercise.exerciseType}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            try {
              await this.exerciseService.deleteExercise(exercise.id);
              await this.loadData();
            } catch (err) {
              console.error('Error deleting exercise:', err);
              const errorAlert = await this.alertCtrl.create({
                header: 'Error',
                message: 'Failed to delete exercise. Please try again.',
                buttons: ['OK']
              });
              await errorAlert.present();
            }
          }
        }
      ]
    });

    await alert.present();
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

}
