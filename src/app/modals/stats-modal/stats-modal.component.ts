import { Component, OnInit, inject } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ExerciseService } from 'src/app/services/exercise.service';
import { ExerciseReport } from "../../models/exercise-report.model";

@Component({
  selector: 'app-stats-modal',
  templateUrl: './stats-modal.component.html',
  styleUrls: ['./stats-modal.component.scss'],
  standalone: false
})
export class StatsModalComponent implements OnInit {

  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  private exerciseService = inject(ExerciseService);

  reportData: ExerciseReport | null = null;
  isLoading = true;

  get formattedDuration(): string {
    if (!this.reportData) return '0 min';

    const totalMinutes = this.reportData.totalMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return `${minutes} min`;
  }

  get formattedDateRange(): string {
    if (!this.reportData) return '';
    return `${this.reportData.startDate} - ${this.reportData.endDate}`;
  }

  async ngOnInit() {
    await this.loadReport();
  }

  async loadReport() {
    this.isLoading = true;
    try {
      this.reportData = await this.exerciseService.getSevenDayReport();
      console.log('7-day report:', this.reportData);
    } catch (err: any) {
      console.error('Error loading report:', err);

      let errorMessage = 'Failed to load statistics. Please try again.';

      if (err.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err.status === 404) {
        errorMessage = 'No exercise data found for the past 7 days.';
      } else if (err.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      await this.showErrorAlert('Error', errorMessage);
      this.dismiss();
    } finally {
      this.isLoading = false;
    }
  }

  private async showErrorAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
