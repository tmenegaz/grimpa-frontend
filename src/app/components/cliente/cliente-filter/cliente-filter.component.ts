import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteListComponent } from '~components/cliente/cliente-list/cliente-list.component';
import { SharedModule } from '~components/shared/shared.module';
import { className, isAdmin } from '~shared/utils';
import { AuthService } from '~src/app/config/login/service/auth.service';
import { Roles } from '~src/app/enums/roles.enum';
import { DrawerService } from '~src/app/services/drawer.service';
import { RolesService } from '~src/app/services/roles.service';
import { Cliente } from '../entity/cliente.model';

@Component({
  selector: 'app-cliente-filter',
  imports: [SharedModule, ClienteListComponent],
  templateUrl: './cliente-filter.component.html',
  styleUrl: './cliente-filter.component.css',
  standalone: true
})
export class ClienteFilterComponent implements OnInit {

  @ViewChild('input') inputElement: ElementRef;

  @Output()
  dataSourceFiltered = new EventEmitter<string>();

  editStatusChanged: string[] = [];

  currentEditMode: string;
  filterValue: string;
  isAdmin: boolean;
  name = className(Cliente.name);

  constructor(
    private router: Router,
    private drawerService: DrawerService,
    private authService: AuthService,
    private rolesService: RolesService
  ) { }

  ngOnInit(): void {
    this.isAdmin = isAdmin(this.authService);
    [this.currentEditMode] = this.rolesService.getCurrentRoles(className(Cliente.name)) || [''];
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
    this.router.navigate(['clientes/criar']);
  }

  onEditMode(event: any): void {
    const name = event.source.name;
    const roles = event.value.includes(Roles.ADMIN)
      ? [Roles.ADMIN]
      : [Roles.USER];

    this.editStatusChanged = roles;
    this.rolesService.setRoles(name, roles);
  }

}
