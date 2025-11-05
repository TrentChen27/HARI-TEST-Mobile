import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ExerciseRecord } from '../home/home.page';
import { ExerciseReport } from "../models/exercise-report.model";

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  // --- Injected Services ---
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // --- API URL from Docs ---
  private apiUrl = `${environment.apiUrl}/api/records`;

  constructor() { }

  async getTodaysExercises(): Promise<ExerciseRecord[]> {
    const user = await this.authService.getStoredUser();
    if (!user) throw new Error('No user found');

    const endpoint = `${this.apiUrl}/user/${user.id}/today`;
    return firstValueFrom(this.http.get<ExerciseRecord[]>(endpoint));
  }

  async getExerciseHistory(): Promise<ExerciseRecord[]> {
    const user = await this.authService.getStoredUser();
    if (!user) throw new Error('No user found');

    const endpoint = `${this.apiUrl}/user/${user.id}/history`;
    return firstValueFrom(this.http.get<ExerciseRecord[]>(endpoint));
  }

  async createExercise(recordData: Partial<ExerciseRecord>): Promise<ExerciseRecord> {
    const user = await this.authService.getStoredUser();
    if (!user) throw new Error('No user found');

    const endpoint = `${this.apiUrl}/${user.id}`;
    return firstValueFrom(this.http.post<ExerciseRecord>(endpoint, recordData));
  }

  async updateExercise(recordId: number, recordData: Partial<ExerciseRecord>): Promise<ExerciseRecord> {
    const endpoint = `${this.apiUrl}/${recordId}`;
    return firstValueFrom(this.http.put<ExerciseRecord>(endpoint, recordData));
  }

  async deleteExercise(recordId: number): Promise<void> {
    const endpoint = `${this.apiUrl}/${recordId}`;
    return firstValueFrom(this.http.delete<void>(endpoint));
  }

  async getSevenDayReport(): Promise<ExerciseReport> {
    const user = await this.authService.getStoredUser();
    if (!user) throw new Error('No user found');
    const endpoint = `${this.apiUrl}/user/${user.id}/report/7-days`;
    return firstValueFrom(this.http.get<ExerciseReport>(endpoint));
  }


}
