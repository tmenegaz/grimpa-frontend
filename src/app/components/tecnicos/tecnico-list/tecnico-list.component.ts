import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Tecnico } from '../../../entities/tecnico/tecnico';


@Component({
  selector: 'app-tecnico-list',
  imports: [
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './tecnico-list.component.html',
  styleUrl: './tecnico-list.component.css',
  standalone: true
})
export class TecnicoListComponent implements AfterViewInit {

  ELEMENT_DATA: Tecnico[]  = [
    {
      id: "1",
      nome: "Tiago",
      cpf: "123.456.789-11",
      email: "tmenegaz77@gmail.com",
      senha: "280577Tam",
      perfil: ["0"],
      dataCriacao: "19/12/2024",
    }
  ];
  displayedColumns: string[] = ['id', 'nome', 'cpf', 'email', 'senha', 'perfil', 'dataCriacao', 'acoes'];
  dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
