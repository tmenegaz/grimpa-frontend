import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ClienteDto } from '~components/cliente/entity/cliente.dto';
import { Cliente } from '~components/cliente/entity/cliente.model';
import { ClienteService } from '~components/cliente/service/cliente.service';
import { TecnicoDto } from '~components/tecnico/entity/tecnico.dto';
import { Tecnico } from '~components/tecnico/entity/tecnico.model';
import { TecnicoService } from '~components/tecnico/service/tecnico.service';
import { SharedModule } from '~shared/shared.module';
import { currentDate, getFileName, isAdmin, isUser } from '~shared/utils';
import { AuthService } from '~src/app/config/login/service/auth.service';
import { Perfil } from '~src/app/enums/perfil.enum';
import { FileUploadService } from '~src/app/services/file-upload.service';
import { noNumbersValidator } from '~src/app/validators/nome.validator';
import { FilePathDto } from './entity/file-path.dto';
import { ImageService } from '~src/app/services/image.service';

@Component({
  selector: 'app-conta',
  imports: [SharedModule],
  templateUrl: './conta.component.html',
  styleUrl: './conta.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class ContaComponent implements OnInit {

  isUser = false
  isAdmin = false;
  isLoading = false;
  perfil: string[];
  sub: string;
  imageUrl: string;

  selectedFile: File;
  contaForm: FormGroup;

  tecnico: Tecnico;
  cliente: Cliente;
  filePathDto: FilePathDto;

  step = signal(0);
  stepSubcribes = signal(0);

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService,
    private toastr: ToastrService,
    private fileUploadService: FileUploadService,
    private cdr: ChangeDetectorRef,
    private imageService: ImageService,
  ) { }

  ngOnInit(): void {

    this.contaForm = this.setContaForm();
    this.isAdmin = isAdmin(this.authService);
    this.isUser = isUser(this.authService);
    this.sub = this.authService.getSub();

    this.findByPerfilTecnico();
    this.findByPerfilCliente();

  }

  setContaForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(null, []),
      nome: new FormControl(null, [Validators.required, Validators.minLength(3), noNumbersValidator]),
      cpf: new FormControl(null, [Validators.required, Validators.minLength(14), Validators.maxLength(14)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      filePath: new FormControl(null, []),
      senha: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      perfis: new FormControl(null, []),
      roles: new FormControl(null, []),
      dataCriacao: new FormControl(currentDate),
    });

    this.contaForm.get('id').disable();
    this.contaForm.get('filePath').disable();
    this.contaForm.get('roles').disable();
  }

  findByPerfilCliente() {
    this.isLoading = true;
    this.clienteService.findAllByPerfil(Perfil.CLIENTE)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: ((clienteDto: ClienteDto[]) => {
          const clientes: Cliente[] = clienteDto.map(dto => Cliente.fromDto(dto));

          this.cliente = clientes.find(cliente => cliente.email === this.sub);
          this.contaForm.patchValue(this.cliente);

          this.stepSubcribes.set(3);
          if (this.cliente.filePath) {
            this.fetchImageUrl(getFileName(this.cliente.filePath.path));
            localStorage.setItem('fileName', getFileName(this.cliente.filePath.path));
          }

        }),
        error: (error) => {
          this.isLoading = false;
          const erroMessage = error.message || 'Erro ao consultar cliente';
          this.toastr.error(erroMessage, 'Erro');
        },
      })
  }

  findByPerfilTecnico() {
    this.isLoading = true;
    this.tecnicoService.findAllByPerfil(Perfil.TECNICO)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: ((tecnicoDto: TecnicoDto[]) => {
          const tecnicos: Tecnico[] = tecnicoDto.map(dto => Tecnico.fromDto(dto));

          this.tecnico = tecnicos.find(tecnico => tecnico.email === this.sub);
          this.contaForm.patchValue(this.tecnico);
        }),
        error: (error) => {
          this.isLoading = false;
          const erroMessage = error.message || 'Erro ao consultar técnico';
          this.toastr.error(erroMessage, 'Erro');
        },
      })
  }

  onUpload() {
    this.isLoading = true;
    if (!this.selectedFile) return;

    this.fileUploadService.uploadFile(this.selectedFile)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (() => {
          localStorage.setItem('fileName', this.selectedFile.name);
          this.stepSubcribes.set(1);
          this.findByPath(this.selectedFile.name);
        }),
        error: (error) => {
          this.isLoading = false;
          const erroMessage = error.message || 'Erro ao atualizar a imagem';
          this.toastr.error(erroMessage, 'Erro');
        },
      })
  }

  findByPath(fileName: string) {
    if (this.stepSubcribes() !== 1) return;
    this.isLoading = true;
    this.fileUploadService.findByPath(fileName)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: ((filePathDto: FilePathDto) => {
          this.filePathDto = filePathDto;
          this.stepSubcribes.set(2);
          this.editCliente();


        }),
        error: (error) => {
          this.isLoading = false;
          const erroMessage = error.message || 'Erro ao tentar localizar a imagem';
          this.toastr.error(erroMessage, 'Erro');
        },
      })
  }

  editCliente(): void {
    if (this.stepSubcribes() !== 2) return;
    this.clienteService.updateFilePath(this.cliente.id, this.filePathDto)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: ((clienteDto: ClienteDto) => {
          this.contaForm.patchValue(clienteDto);
          this.stepSubcribes.set(3);
          this.fetchImageUrl(localStorage.getItem('fileName'));
        }),
        error: (error) => {
          this.isLoading = false;
          const erroMessage = error.message || 'Erro ao mudificar cliente';
          this.toastr.error(erroMessage, 'Erro');
        },
      });
  }

  fetchImageUrl(fileName: string) {
    if (this.stepSubcribes() !== 3) return;
    this.isLoading = true;
    this.fileUploadService.getFileUrl(fileName)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: ((blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          this.imageUrl = url;
          this.imageService.setImageUrl(url);
          this.stepSubcribes.set(0);
          this.cdr.detectChanges();
        }),
        error: (error) => {
          this.isLoading = false;
          const erroMessage = error.message || 'Erro para apresentar a imagem';
          this.toastr.error(erroMessage, 'Erro');
        },
      })
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  private onDeleteFile() {
    if (localStorage.getItem('fileName') === null) return;
    if (this.stepSubcribes() !== 1) return;
    this.isLoading = true;
    this.fileUploadService.deleteFile(localStorage.getItem('fileName'))
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (() => {
          localStorage.removeItem('fileName');
          this.toastr.success("Aquivo deletado", 'Sucesso');
          this.imageUrl = null;
          this.selectedFile = null;
          this.stepSubcribes.set(0);
          this.imageService.setImageUrl(null);
          this.cdr.detectChanges();
        }),
        error: (err) => {
          this.isLoading = false;
          const erroMessage = err.message || 'Erro ao deletera arquivo';
          this.toastr.error(erroMessage, 'Erro');
        }
      })
  }

  onDelete(): void {
    this.isLoading = true;

    const clienteDto = this.cliente.toDto();
    clienteDto.filePath = null;
    this.filePathDto = {
      id: null,
      path: null
    };

    this.clienteService.updateFilePath(clienteDto.id, this.filePathDto)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: ((clienteDto: ClienteDto) => {
          this.cliente = Cliente.fromDto(clienteDto);
          this.contaForm.patchValue(clienteDto);
          this.stepSubcribes.set(1);
          this.onDeleteFile();
        }),
        error: (error) => {
          this.isLoading = false;
          const erroMessage = error.message || 'Erro ao cadastrar técnico';
          this.toastr.error(erroMessage, 'Erro');
        },
      });
  }


  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update(i => i + 1);
  }

  prevStep() {
    this.step.update(i => i - 1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getImageUrl(): string { return this.imageService.getImageUrl(); }

  hasImage(): boolean { return !!this.imageService.getImageUrl(); }
}
