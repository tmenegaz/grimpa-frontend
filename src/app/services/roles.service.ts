import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cliente } from '~components/cliente/entity/cliente.model';
import { className, convertRolesToKey, getRolesKey } from '~components/shared/utils';
import { Tecnico } from '~components/tecnico/entity/tecnico.model';
import { Roles } from '../enums/roles.enum';

@Injectable({
  providedIn: 'root'
})
export class RolesService implements OnInit {

  private rolesSubjects: { [value: string]: BehaviorSubject<string> } = {};
  // roles$: { [value: string]: Observable<string> } = {};

  constructor() { }

  ngOnInit(): void {
    this.initializeRoles(className(Tecnico.name));
    this.initializeRoles(className(Cliente.name));
    this.initializeRoles('sudo');
  }

  private initializeRoles(entity: string): void {
    const savedRole = this.getSavedRoles(entity);
    this.rolesSubjects[entity] = new BehaviorSubject<string>(savedRole || Roles.ROLE_USER.toString());
    // this.roles$[entity] = this.rolesSubjects[entity].asObservable();
  }

  setRoles(entity: string, roles: Roles[]): void {
    if (!this.rolesSubjects[entity]) {
      this.initializeRoles(entity);
    }
    var roleKey = getRolesKey(roles[0]);

    this.rolesSubjects[entity].next(roleKey);

    localStorage.setItem(`role-toggle-${entity}`, JSON.stringify(roleKey));
  }

  getCurrentRoles(entity: string): string {
    if (!this.rolesSubjects[entity]) {
      this.initializeRoles(entity);
    }
    return this.rolesSubjects[entity].getValue();
  }

  getSavedRoles(entity: string): string | null {
    const roles = localStorage.getItem(`role-toggle-${entity}`);
    return roles ? roles : null;
  }
}