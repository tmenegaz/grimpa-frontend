import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '~components/shared/shared.module';
import { TecnicoListComponent } from '~components/tecnico/tecnico-list/tecnico-list.component';
import { className, getRolesKey, isAdmin } from '~shared/utils';
import { AuthService } from '~src/app/config/login/service/auth.service';
import { Roles } from '~src/app/enums/roles.enum';
import { DrawerService } from '~src/app/services/drawer.service';
import { RolesService } from '~src/app/services/roles.service';
import { Tecnico } from '../entity/tecnico.model';

@Component({
  selector: 'app-tecnico-filter',
  imports: [SharedModule, TecnicoListComponent],
  templateUrl: './tecnico-filter.component.html',
  styleUrl: './tecnico-filter.component.css',
  standalone: true
})
export class TecnicoFilterComponent implements OnInit {

  @ViewChild('input') inputElement: ElementRef;

  @Output()
  dataSourceFiltered = new EventEmitter<string>();

  editStatusChanged: string[] = [];

  currentEditMode: string;
  filterValue: string;
  isAdmin: boolean;
  name = className(Tecnico.name);

  constructor(
    private router: Router,
    private drawerService: DrawerService,
    private authService: AuthService,
    private rolesService: RolesService
  ) { }

  ngOnInit(): void {
    this.isAdmin = isAdmin(this.authService);
    [this.currentEditMode] = this.rolesService.getCurrentRoles(className(Tecnico.name)) || [''];
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFiltered.emit(this.filterValue.trim().toLowerCase());
  }

  ableClearFilter(): boolean {
    return this.filterValue ? true : false;
  }

  onClearFilter(): void {
    this.filterValue = null;
    this.inputElement.nativeElement.value = null;
    this.dataSourceFiltered.emit(null);
  }

  onAdd(): void {
    this.drawerService.closeDrawer();
    this.router.navigate(['tecnicos/criar']);
  }

  onEditMode(event: any): void {
    const name = event.source.name;
    const roles = event.value.includes("ROLE_ADMIN")
      ? [Roles.ROLE_ADMIN]
      : [Roles.ROLE_USER];

    this.editStatusChanged = roles.map(role => getRolesKey(role));
    this.rolesService.setRoles(name, roles);
  }

}
