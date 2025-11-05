// src/app/pages/home/home.module.ts

import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Import ReactiveFormsModule
import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './home-routing.module';
import { ExerciseFormComponent } from 'src/app/modals/exercise-form/exercise-form.component'; // <-- Import the new component

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    ReactiveFormsModule // <-- Add it here
  ],
  declarations: [
    HomePage,
    ExerciseFormComponent
  ]
})
export class HomePageModule {}
