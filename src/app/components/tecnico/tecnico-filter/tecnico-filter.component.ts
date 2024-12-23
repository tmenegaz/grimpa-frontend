import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '~components/shared/shared.module';
import { Tecnico } from '~src/app/components/tecnico/entity/tecnico';

@Component({
  selector: 'app-tecnico-filter',
  imports: [SharedModule],
  templateUrl: './tecnico-filter.component.html',
  styleUrl: './tecnico-filter.component.css',
  standalone: true
})
export class TecnicoFilterComponent {
  
  @Input()
  dataSourceList: MatTableDataSource<Tecnico>;
  
  public data: string[];


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceList.filter = filterValue.trim().toLowerCase();    
  }  

}
