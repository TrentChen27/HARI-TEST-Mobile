import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    // 1. The main path is now '', which is what app-routing.module.ts
    //    expects when it lazy-loads this module.
    path: '',
    component: TabsPage,
    children: [
      {
        // 2. Map the 'home' path to your 'home' page folder
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        // 3. Map the 'history' path to your 'history' page folder
        path: 'history',
        loadChildren: () => import('../history/history.module').then(m => m.HistoryPageModule)
      },
      {
        // 4. Map the 'report' path to your 'report-7-days' folder
        path: 'report',
        loadChildren: () => import('../report/report.module').then(m => m.ReportPageModule)
      },
      {
        // 5. Default redirect: If someone just lands on /tabs,
        //    send them to the 'home' page.
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  // We remove the old '/tabs' redirect as it's no longer needed.
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
