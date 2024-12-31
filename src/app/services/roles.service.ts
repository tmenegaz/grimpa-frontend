import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService implements OnInit {

  private rolesSubject = new BehaviorSubject<string[]>(this.getSavedRoles() || ['ROLE_USER']);
  roles$ = this.rolesSubject.asObservable();

  constructor() { }

  ngOnInit(): void {
    const savedRoles = this.getSavedRoles();
    if (savedRoles) {
      this.rolesSubject.next(savedRoles);
    } else {
      this.setRoles(['ROLE_USER']);
    }
  }

  setRoles(roles: string[]): void {
    this.rolesSubject.next(roles);
    localStorage.setItem('role-toggle', JSON.stringify(roles));
  }

  getCurrentRoles(): string[] {
    return this.rolesSubject.getValue();
  }

  getSavedRoles(): string[] | null {
    const roles = localStorage.getItem('role-toggle');
    return roles ? JSON.parse(roles) : null;
  }
}
