import { Injectable, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteService implements OnInit {
  private currentRoute = new BehaviorSubject<string>('');
  
  constructor(
    private router: Router
  ) {
    this.currentRoute.next(this.router.url);
  
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.currentRoute.next(event.urlAfterRedirects);
    });

  }

  ngOnInit(): void {
  }
  

  getCurrentRoute() {
    return this.currentRoute.asObservable();
  }

  isLoginPage(): boolean {
    return this.currentRoute.value === '/login';
  }
}
