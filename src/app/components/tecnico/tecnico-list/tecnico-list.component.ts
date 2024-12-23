import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { SharedModule } from '~components/shared/shared.module';
import { TecnicoService } from '~components/tecnico/service/tecnico.service';
import { TecnicoFilterComponent } from '~components/tecnico/tecnico-filter/tecnico-filter.component';
import { Tecnico } from '~src/app/components/tecnico/entity/tecnico';
import { PasswordMaskPipe } from '~src/app/config/pipes/password-mask.pipe';



@Component({
  selector: 'app-tecnico-list',
  imports: [SharedModule, PasswordMaskPipe, TecnicoFilterComponent],
  templateUrl: './tecnico-list.component.html',
  styleUrl: './tecnico-list.component.css',
  standalone: true
})
export class TecnicoListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output()
  dataSourceList: MatTableDataSource<Tecnico>;

  dataSource: MatTableDataSource<Tecnico>;
  private destroy$ = new Subject<void>;

  constructor(
    private service: TecnicoService,
    private toastr: ToastrService,
  ) {}

  displayedColumns: string[] = ['id', 'nome', 'cpf', 'email', 'senha', 'perfis', 'dataCriacao', 'acoes'];

  ngOnInit(): void {
    this.findAll();
  }
  
  findAll(): void {
    this.service.findAll()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (tecnicos: Tecnico[]) => {               
        this.dataSource = new MatTableDataSource<Tecnico>(tecnicos);
        
        this.dataSource.paginator = this.paginator;
        this.dataSourceList = this.dataSource;
      },
      error: (error) => {
        error.status === 403
        ? this.toastr.error("A conexão expirou", "Erro de Autenticação")
        : this.toastr.error("Tecnicos unlisted", "Error");
      }
    });
  }

  ngOnDestroy(): void { 
    this.destroy$.next();
    this.destroy$.complete(); 
  }
}
