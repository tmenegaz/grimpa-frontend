import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '~components/shared/shared.module';
import { TecnicoListComponent } from '~components/tecnico/tecnico-list/tecnico-list.component';
import { DrawerService } from '~src/app/services/drawer.service';

@Component({
  selector: 'app-tecnico-filter',
  imports: [SharedModule, TecnicoListComponent],
  templateUrl: './tecnico-filter.component.html',
  styleUrl: './tecnico-filter.component.css',
  standalone: true
})
export class TecnicoFilterComponent {

  @ViewChild('input') inputElement: ElementRef;

  @Output()
  dataSourceFiltered = new EventEmitter<string>();

  filterValue: string;

  constructor(
    private router: Router,
    private drawerService: DrawerService,
  ) {}
  
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

  onEdit(): void {
    this.drawerService.closeDrawer();
    this.router.navigate(['editar']);
  }

  onDelete(): void {
    this.drawerService.closeDrawer();
    this.router.navigate(['deletar']);
  }

}
