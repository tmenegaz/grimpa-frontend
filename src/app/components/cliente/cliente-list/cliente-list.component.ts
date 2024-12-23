import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from '../entity/cliente';


@Component({
  selector: 'app-cliente-list',
  imports: [SharedModule],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css'
})
export class ClienteListComponent implements AfterViewInit {
  ELEMENT_DATA: Cliente[]  = [
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
  dataSource = new MatTableDataSource<Cliente>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
