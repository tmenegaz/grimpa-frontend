import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Tecnico } from '~src/app/components/tecnico/entity/tecnico';
import { SharedModule } from '~components/shared/shared.module';

@Component({
  selector: 'app-tecnico-filter',
  imports: [SharedModule],
  templateUrl: './tecnico-filter.component.html',
  styleUrl: './tecnico-filter.component.css',
  standalone: true
})
export class TecnicoFilterComponent {

  public dataSource: MatTableDataSource<Tecnico>;

  applyFilter(event: Event) {    
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  

}
