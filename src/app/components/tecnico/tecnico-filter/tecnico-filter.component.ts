import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class TecnicoFilterComponent implements OnChanges {
  
  @Input()
  dataSourceList: Tecnico[];

  public data: string[];

  public dataSource = new MatTableDataSource([]);

  ngOnChanges({ dataSourceList }: SimpleChanges): void {
    if (dataSourceList.currentValue) {
      this.dataSource.data = dataSourceList.currentValue;
    }
  }

  applyFilter(event: Event) {    
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.data = this.dataSource.filteredData.map(tecnico => tecnico.nome);
    
  }  

}
