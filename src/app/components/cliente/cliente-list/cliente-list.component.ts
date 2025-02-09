import { Component, inject, Inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { filter, finalize, Subject, takeUntil } from 'rxjs';
import { ClienteService } from '~components/cliente/service/cliente.service';
import { TabFooterComponent } from '~components/footers/tab-footer.component';
import { SharedModule } from '~components/shared/shared.module';
import { Page } from '~interfaces/page.interface';
import { className, formatProfiles, isRoleAdmin, translateProfilesCliente } from '~shared/utils';
import { ClienteResolver } from '~src/app/app.routes';
import { Cliente } from '~src/app/components/cliente/entity/cliente.model';
import { DeleteDialogComponent } from '~src/app/config/dialog/delete-dialog.component';
import { PasswordMaskPipe } from '~src/app/config/pipes/password-mask.pipe';
import { SPINNER_CONFIG, SpinnerConfig } from '~src/app/config/spinner-config';
import { LanguageService } from '~src/app/services/language.service';
import { PaginationService } from '~src/app/services/pagination.service';
import { RolesService } from '~src/app/services/roles.service';
import { ClienteDto } from '../entity/cliente.dto';
import { Perfil } from '~src/app/enums/perfil.enum';

@Component({
  selector: 'app-cliente-list',
  imports: [SharedModule, PasswordMaskPipe, TabFooterComponent],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css',
  standalone: true
})
export class ClienteListComponent implements OnInit, OnChanges {

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

  dataSource: MatTableDataSource<Cliente>;
  private destroy$ = new Subject<void>;

  constructor(
    private service: ClienteService,
    private toastr: ToastrService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private paginationService: PaginationService,
    private router: Router,
    private rolesService: RolesService,
    public clienteResolver: ClienteResolver,
    @Inject(SPINNER_CONFIG) public spinnerConfig: SpinnerConfig
  ) { }

  displayedColumns: string[] = ['nome', 'cpf', 'email', 'senha', 'perfis', 'dataCriacao', 'acoes'];

  ngOnInit(): void {
    this.loadClientes();

    this.languageService
      .language$
      .pipe(takeUntil(this.destroy$),
        finalize(() => this.isLoading = false))
      .subscribe({
        next: ((lang) => {
          this.translate.use(lang);
          this.loadClientes();
        })
      });

    this.paginationService.pageIndex$
      .pipe(takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)).subscribe(
          () => this.loadClientes());
    this.paginationService.pageSize$
      .pipe(takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)).subscribe(
          () => this.loadClientes());

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

  loadClientes(): void {
    this.isLoading = true;

    const pageIndex = this.paginationService.getPageIndex();
    const pageSize = this.paginationService.getPageSize();

    this.service.findAll(pageIndex, pageSize)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (clientesDto: Page<ClienteDto>) => {
          const clientes = clientesDto.content.map(dto => Cliente.fromDto(dto, this.translate));

          this.dataSource = new MatTableDataSource<Cliente>(clientes);
          this.dataSource.sort = this.sort;

          this.paginationService.setTotalElements(clientesDto.totalElements);
        },
        error: (error) => {
          this.isLoading = false;
          error.status === 403
            ? this.toastr.error("A conexão expirou", "Erro de Autenticação")
            : this.toastr.error("Clientes unlisted", "Error");
        }
      });
  }

  formatProfiles(profiles: string[]): string {
    return formatProfiles(profiles);
  }

  editCliente(cliente: Cliente): void {
    if (this.clienteResolver) {
      this.clienteResolver.isLoading = true;
      this.router.navigate(['clientes/editar', cliente.id]);
    }
    this.router.navigate(['clientes/editar', cliente.id]);
  }

  deleteCliente(cliente: Cliente): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { nome: cliente?.nome }
    })

    dialogRef.afterClosed().subscribe(
      (result: boolean) => {
        if (result) {
          this.isLoading = true;
          this.service.delete(cliente.id)
            .pipe(
              takeUntil(this.destroy$),
              finalize(() => this.isLoading = false)
            )
            .subscribe({
              next: (() => {
                this.toastr.success('Success', 'Cadastro');
                this.loadClientes();

              }),
              error: (error) => {
                this.isLoading = false;
                const erroMessage = error.message || 'Erro ao cadastrar técnico';
                this.toastr.error(erroMessage, 'Erro');
              },
            });
        }
      }
    )
  }

  updateDisplayedColumns(): void {
    this.isEditMode = isRoleAdmin(this.rolesService, className(Cliente.name));
    this.displayedColumns = this.isEditMode
      ? ['nome', 'cpf', 'email', 'senha', 'perfis', 'dataCriacao', 'acoes']
      : ['nome', 'cpf', 'email', 'perfis', 'dataCriacao'];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
