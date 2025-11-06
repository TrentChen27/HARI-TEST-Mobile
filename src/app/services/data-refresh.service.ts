import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataRefreshService {
  private refreshHistorySource = new Subject<void>();
  refreshHistory$ = this.refreshHistorySource.asObservable();

  triggerHistoryRefresh() {
    this.refreshHistorySource.next();
  }
}
