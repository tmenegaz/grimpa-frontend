import { Component, inject, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { TabFooterComponent } from '~components/footers/tab-footer.component';
import { SharedModule } from '~components/shared/shared.module';
import { TecnicoService } from '~components/tecnico/service/tecnico.service';
import { Page } from '~interfaces/page.interface';
import { className, formatProfiles, isRoleAdmin, translateProfiles } from '~shared/utils';
import { Tecnico } from '~src/app/components/tecnico/entity/tecnico.model';
import { DeleteDialogComponent } from '~src/app/config/dialog/delete-dialog.component';
import { PasswordMaskPipe } from '~src/app/config/pipes/password-mask.pipe';
import { SPINNER_CONFIG, SpinnerConfig } from '~src/app/config/spinner-config';
import { LanguageService } from '~src/app/services/language.service';
import { PaginationService } from '~src/app/services/pagination.service';
import { RolesService } from '~src/app/services/roles.service';
import { TecnicoDto } from '../entity/tecnico.dto';
import { TecnicoResolver } from '~src/app/app.routes';

@Component({
  selector: 'app-tecnico-list',
  imports: [SharedModule, PasswordMaskPipe, TabFooterComponent],
  templateUrl: './tecnico-list.component.html',
  styleUrl: './tecnico-list.component.css',
  standalone: true
})
export class TecnicoListComponent implements OnInit, OnChanges {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @Input()
  dataSourceFiltered: string;

  @Input()
  editStatusChanged: string[];

  readonly dialog = inject(MatDialog);

  isLoading = true;
  showIdColumn = false;
  isEditMode = false;

  dataSource: MatTableDataSource<Tecnico>;
  private destroy$ = new Subject<void>;

  constructor(
    private service: TecnicoService,
    private toastr: ToastrService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private paginationService: PaginationService,
    private router: Router,
    private rolesService: RolesService,
    public tecnicoResolver: TecnicoResolver,
    @Inject(SPINNER_CONFIG) public spinnerConfig: SpinnerConfig
  ) { }

  displayedColumns: string[] = ['nome', 'cpf', 'email', 'senha', 'perfis', 'dataCriacao', 'acoes'];

  ngOnInit(): void {
    this.loadTecnicos();

    this.languageService
      .language$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ((lang) => {
          this.translate.use(lang);
          this.loadTecnicos();
        })
      });

    this.paginationService.pageIndex$
      .pipe(takeUntil(this.destroy$)).subscribe(
        () => this.loadTecnicos());
    this.paginationService.pageSize$
      .pipe(takeUntil(this.destroy$)).subscribe(
        () => this.loadTecnicos());

    this.updateDisplayedColumns();
  }

  ngOnChanges({ ...changes }: SimpleChanges): void {
    if (changes['dataSourceFiltered'] && this.dataSource) {
      this.dataSource.filter = changes['dataSourceFiltered'].currentValue;
    }

    if (changes['editStatusChanged'] && changes['editStatusChanged'].currentValue) {
      this.updateDisplayedColumns();
    }
  }

  loadTecnicos(): void {
    this.isLoading = true;

    const pageIndex = this.paginationService.getPageIndex();
    const pageSize = this.paginationService.getPageSize();

    this.service.findAll(pageIndex, pageSize)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (tecnicosDto: Page<TecnicoDto>) => {
          const tecnicos = tecnicosDto.content.map(Tecnico.fromDto);

          tecnicos.forEach(tecnico => {
            tecnico.perfis = translateProfiles(tecnico.perfis, this.translate);
          });
          this.dataSource = new MatTableDataSource<Tecnico>(tecnicos);
          this.dataSource.sort = this.sort;

          this.paginationService.setTotalElements(tecnicosDto.totalElements);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          const erroMessage = error || 'Erro ao listar técnico';
          error.status === 403
            ? this.toastr.error(erroMessage, "Erro de Autenticação")
            : this.toastr.error(erroMessage, "Erro");
        }
      });
  }

  formatProfiles(profiles: string[]): string {
    return formatProfiles(profiles);
  }

  editTecnico(tecnico: Tecnico): void {
    if (this.tecnicoResolver) {
      this.tecnicoResolver.isLoading = true;
      this.router.navigate(['tecnicos/editar', tecnico.id]);
    }
  }

  deleteTecnico(tecnico: Tecnico): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { nome: tecnico?.nome }
    })

    dialogRef.afterClosed().subscribe(
      (result: boolean) => {
        if (result) {
          this.isLoading = true;
          this.service.delete(tecnico.id)
            .pipe(
              takeUntil(this.destroy$)
            )
            .subscribe({
              next: (() => {
                this.isLoading = false;
                this.toastr.success('Success', 'Cadastro');
                this.loadTecnicos();

              }),
              error: (error) => {
                this.isLoading = false;
                const erroMessage = error || 'Erro ao cadastrar técnico';
                this.toastr.error(erroMessage, 'Erro');
              },
            });
        }
      }
    )
  }

  updateDisplayedColumns(): void {
    this.isEditMode = isRoleAdmin(this.rolesService, className(Tecnico.name));
    this.displayedColumns = this.isEditMode
      ? ['nome', 'cpf', 'email', 'senha', 'perfis', 'dataCriacao', 'acoes']
      : ['nome', 'cpf', 'email', 'perfis', 'dataCriacao'];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
