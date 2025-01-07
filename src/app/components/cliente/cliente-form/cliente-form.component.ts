import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '~components/header/header.component';
import { ClienteService } from '~components/cliente/service/cliente.service';
import { SharedModule } from '~shared/shared.module';
import { currentDate, isAdmin, setPerfisValue } from '~shared/utils';
import { Cliente } from '~src/app/components/cliente/entity/cliente.model';
import { AuthService } from '~src/app/config/login/service/auth.service';
import { SPINNER_CONFIG, SpinnerConfig } from '~src/app/config/spinner-config';
import { Perfil } from '~src/app/enums/perfil.enum';
import { noNumbersValidator } from '~src/app/validators/nome.validator';
import { ClienteDto } from '../entity/cliente.dto';
import { PasswordMaskPipe } from '~src/app/config/pipes/password-mask.pipe';



@Component({
  selector: 'app-cliente-form',
  imports: [SharedModule, HeaderComponent, PasswordMaskPipe],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css',
  standalone: true,
})
export class ClienteFormComponent implements OnInit {

  clienteForm: FormGroup;
  isAdmin = false;
  isLoading = false;
  hide = true;

  private destroy$ = new Subject<void>();

  perfis = Object.keys(Perfil).filter(key => isNaN(Number(key))
    && Perfil[key as keyof typeof Perfil] !== Perfil.CLIENTE
  );

  isEdit = false;

  cliente: Cliente;
  clienteId: Partial<Cliente> = { id: null };

  constructor(
    private readonly router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private clienteService: ClienteService,
    private authService: AuthService,
    @Inject(SPINNER_CONFIG) public spinnerConfig: SpinnerConfig
  ) { }

  ngOnInit(): void {
    this.clienteForm = this.setClienteForm();
    this.isAdmin = isAdmin(this.authService);

    this.route.params
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (params) => {
          if (params['id'] && !this.cliente) {
            this.clienteId.id = params['id'];
            this.isEdit = true;
          }
        },
      });

    this.route.data
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          const clienteDto: ClienteDto = data['cliente'];

          if (clienteDto) {
            this.cliente = Cliente.fromDto(clienteDto);
            this.clienteForm.patchValue(this.cliente);
          }
        },
        error: (error) => {
          const erroMessage = error.message || 'Erro ao buscar técnico'
          this.toastr.error(erroMessage, 'Erro');
        }
      });
  }

  setClienteForm(): FormGroup {
    return new FormGroup({
      nome: new FormControl(null, [Validators.required, Validators.minLength(3), noNumbersValidator]),
      cpf: new FormControl(null, [Validators.required, Validators.minLength(14), Validators.maxLength(14)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      senha: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      perfis: new FormControl([]),
      dataCriacao: new FormControl(currentDate),
    });
  }

  validateControl(controlName: string, requiredMessage: string, invalidMessage: string): boolean {
    const control = this.clienteForm.get(controlName);

    if (!control.value || (control.touched && control.invalid)) {
      const errorMessage = control.hasError('required')
        ? requiredMessage
        : invalidMessage;

      control.reset(null, { emitEvent: false });
      this.toastr.error(errorMessage);
      return true;
    }
    return false;
  }

  get hasNomeErrors(): boolean {
    return this.validateControl('nome', 'Nome obrigatório', 'Nome inválido');
  }
  get hasCpfErrors(): boolean {
    return this.validateControl('cpf', 'CPF obrigatório', 'CPF inválido');
  }
  get hasPerfisErrors(): boolean {
    return this.validateControl('perfis', 'Perfil obrigatório', 'Perfil inválido');
  }
  get hasEmailErrors(): boolean {
    return this.validateControl('email', 'E-mail obrigatório', 'E-mail inválido');
  }
  get hasSenhaErrors(): boolean {
    return this.validateControl('senha', 'Senha é obrigatória', ' Senha deve ter no mínimo 3 caracteres');
  }

  onSubmit(): void {
    this.isLoading = true;

    setPerfisValue(this.clienteForm);

    if (
      !this.hasNomeErrors
      && !this.hasCpfErrors
      && !this.hasPerfisErrors
      && !this.hasEmailErrors
      && !this.hasSenhaErrors
    ) {
      this.cliente = { ... this.clienteForm.value };

      this.clienteService.create(this.cliente)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (() => {
            this.isLoading = false;
            this.toastr.success('Success', 'Cadastro');
            this.clienteForm.reset(null, {
              emitEvent: false,
            });
            this.router.navigate(["clientes"]);
          }),
          error: (error) => {
            this.isLoading = false;
            const erroMessage = error.message || 'Erro ao cadastrar técnico';
            this.toastr.error(erroMessage, 'Erro');

          },
        });
    }
  }

  onEdit(): void {
    this.isLoading = true;

    setPerfisValue(this.clienteForm);

    if (
      !this.hasNomeErrors
      && !this.hasCpfErrors
      && !this.hasPerfisErrors
      && !this.hasEmailErrors
      && !this.hasSenhaErrors
    ) {
      this.cliente = { ... this.clienteForm.value };
      const clienteDto = this.cliente.toDto();

      this.clienteService.update(this.clienteId.id, clienteDto)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (() => {
            this.isLoading = false;
            this.toastr.success('Success', 'Cadastro');
            this.clienteForm.reset(null, {
              emitEvent: false,
            });
            this.router.navigate(["clientes"]);
          }),
          error: (error) => {
            this.isLoading = false;
            const erroMessage = error.message || 'Erro ao cadastrar técnico';
            this.toastr.error(erroMessage, 'Erro');
          },
        });

    }
  }

  onCancel(): void {
    this.clienteForm.reset(null, { emitEvent: false });
    this.router.navigate(['clientes']);
  }

  onHide(): void {
    this.hide = !this.hide;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
