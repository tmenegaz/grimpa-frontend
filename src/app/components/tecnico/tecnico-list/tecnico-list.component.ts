import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Tecnico } from '../../../entities/tecnico/tecnico';
import { SharedModule } from '../../shared/shared.module';


@Component({
  selector: 'app-tecnico-list',
  imports: [SharedModule],
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
