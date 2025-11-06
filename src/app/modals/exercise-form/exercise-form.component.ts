import { Component, Input, OnInit, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonPopover, ModalController, AlertController } from '@ionic/angular';
import { ExerciseService } from 'src/app/services/exercise.service';
import { ExerciseRecord } from 'src/app/home/home.page';
import { DateUtils } from 'src/app/utils/date.utils';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss'],
  standalone: false
})
export class ExerciseFormComponent implements OnInit {

  @Input() exerciseToEdit: ExerciseRecord | null = null;
  @ViewChild('dateTimePopover') dateTimePopover!: IonPopover;

  private fb = inject(FormBuilder);
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  private exerciseService = inject(ExerciseService);

  exerciseForm!: FormGroup;
  isSubmitting = false;
  maxDate: string = new Date().toISOString();

  get isEditMode(): boolean {
    return !!this.exerciseToEdit;
  }

  constructor() {}

  ngOnInit() {
    this.exerciseForm = this.fb.group({
      exerciseType: [
        this.exerciseToEdit?.exerciseType || '',
        Validators.required
      ],
      exerciseDuration: [
        this.exerciseToEdit?.exerciseDuration || '',
        Validators.required
      ],
      dateTime: [
        this.exerciseToEdit?.dateTime || new Date().toISOString(),
        [Validators.required, this.futureDateValidator.bind(this)]
      ],
      exerciseLocation: [
        this.exerciseToEdit?.exerciseLocation || 'inside',
        Validators.required
      ],
    });
  }

  futureDateValidator(control: any) {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const now = new Date();

    if (selectedDate > now) {
      return { futureDate: true };
    }

    return null;
  }

  onDateTimeChange(event: any) {
    const selectedDateTime = event.detail.value;
    this.exerciseForm.patchValue({
      dateTime: selectedDateTime
    });
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancelled');
  }

  async onSubmit() {
    if (this.exerciseForm.invalid) {
      if (this.exerciseForm.get('dateTime')?.hasError('futureDate')) {
        await this.showErrorAlert('Invalid Date', 'You cannot log exercises for future dates.');
        return;
      }
      await this.showErrorAlert('Invalid Form', 'Please fill in all required fields correctly.');
      return;
    }

    this.isSubmitting = true;
    const formData = this.exerciseForm.value;

    const payload = {
      ...formData,
      dateTime: DateUtils.toLocalDateTime(formData.dateTime)
    };

    try {
      if (this.isEditMode && this.exerciseToEdit) {
        await this.exerciseService.updateExercise(this.exerciseToEdit.id, payload);
      } else {
        await this.exerciseService.createExercise(payload);
      }
      this.modalCtrl.dismiss(null, 'saved');
    } catch (err: any) {
      console.error('Error saving exercise:', err);

      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (err.status === 400) {
        errorMessage = err.error?.message || err.error?.error || 'Invalid data. Please check your input and try again.';

        if (errorMessage.toLowerCase().includes('future')) {
          errorMessage = 'You cannot log exercises for future dates.';
        }
      } else if (err.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err.status === 404) {
        errorMessage = 'Exercise not found.';
      } else if (err.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      await this.showErrorAlert('Error', errorMessage);
    } finally {
      this.isSubmitting = false;
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
}
