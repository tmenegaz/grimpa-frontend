import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { SharedModule } from '~components/shared/shared.module';
import { TecnicoService } from '~components/tecnico/service/tecnico.service';
import { formatProfiles, translateProfiles } from '~shared/utils';
import { Tecnico } from '~src/app/components/tecnico/entity/tecnico';
import { PasswordMaskPipe } from '~src/app/config/pipes/password-mask.pipe';
import { LanguageService } from '~src/app/services/language.service';

@Component({
  selector: 'app-tecnico-list',
  imports: [SharedModule, PasswordMaskPipe],
  templateUrl: './tecnico-list.component.html',
  styleUrl: './tecnico-list.component.css',
  standalone: true
})
export class TecnicoListComponent implements OnInit, OnChanges {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input()
  dataSourceFiltered: string;

  dataSource: MatTableDataSource<Tecnico>;
  private destroy$ = new Subject<void>;

  constructor(
    private service: TecnicoService,
    private toastr: ToastrService,
    private languageService: LanguageService,
    private translate: TranslateService,
  ) {}

  displayedColumns: string[] = ['id', 'nome', 'cpf', 'email', 'senha', 'perfis', 'dataCriacao', 'acoes'];

  ngOnInit(): void {
    this.findAll();
    this.languageService
    .language$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ((lang) => {
        this.translate.use(lang);
        this.findAll();
      })
    });
  }
  
  ngOnChanges({ dataSourceFiltered }: SimpleChanges): void {    
    if (dataSourceFiltered && this.dataSource) {
      this.dataSource.filter = dataSourceFiltered.currentValue;           
    }
  }
  
  findAll(): void {
    this.service.findAll()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (tecnicos: Tecnico[]) => {
        tecnicos.forEach(tecnico => {
          tecnico.perfis = translateProfiles(tecnico.perfis, this.translate);
        });
        this.dataSource = new MatTableDataSource<Tecnico>(tecnicos);
        
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        error.status === 403
        ? this.toastr.error("A conexão expirou", "Erro de Autenticação")
        : this.toastr.error("Tecnicos unlisted", "Error");
      }
    });
  }
  
  formatProfiles(profiles: string[]): string {
    return formatProfiles(profiles); 
  }

  ngOnDestroy(): void { 
    this.destroy$.next();
    this.destroy$.complete(); 
  }
}
