import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = 0;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: Observable<boolean> = this.loading$.asObservable();
  constructor() { }

  show() {
    this.activeRequests++;
    if (!this.loading$.value) {
      setTimeout(() => {
        this.loading$.next(true);
      });
    }
  }

  hide() {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      setTimeout(() => {
        this.loading$.next(false);
      });
    }
  }

  setLoading(state: boolean): void {
    setTimeout(() => {
      this.loading$.next(state);
    });
  }

  getLoading(): boolean {
    return this.loading$.getValue();
  }
}
