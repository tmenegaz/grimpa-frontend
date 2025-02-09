import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '~components/header/header.component';
import { TecnicoService } from '~components/tecnico/service/tecnico.service';
import { SharedModule } from '~shared/shared.module';
import { currentDate, isAdmin, setPerfisValue } from '~shared/utils';
import { Tecnico } from '~src/app/components/tecnico/entity/tecnico.model';
import { AuthService } from '~src/app/config/login/service/auth.service';
import { SPINNER_CONFIG, SpinnerConfig } from '~src/app/config/spinner-config';
import { Perfil } from '~src/app/enums/perfil.enum';
import { noNumbersValidator } from '~src/app/validators/nome.validator';
import { TecnicoDto } from '../entity/tecnico.dto';
import { PasswordMaskPipe } from '~src/app/config/pipes/password-mask.pipe';



@Component({
  selector: 'app-tecnico-form',
  imports: [SharedModule, HeaderComponent, PasswordMaskPipe],
  templateUrl: './tecnico-form.component.html',
  styleUrl: './tecnico-form.component.css',
  standalone: true,
})
export class TecnicoFormComponent implements OnInit {

  tecnicoForm: FormGroup;
  isAdmin: boolean;
  isLoading = false;
  hide = true;

  private destroy$ = new Subject<void>();

  perfis = Object.keys(Perfil).filter(key => isNaN(Number(key))
    && Perfil[key as keyof typeof Perfil] !== Perfil.CLIENTE
  );

  isEdit = false;

  tecnico: Tecnico;
  tecnicoId: Partial<Tecnico> = { id: null };

  constructor(
    private readonly router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private tecnicoService: TecnicoService,
    private authService: AuthService,
    @Inject(SPINNER_CONFIG) public spinnerConfig: SpinnerConfig
  ) { }

  ngOnInit(): void {
    this.tecnicoForm = this.setTecnicoForm();
    this.isAdmin = isAdmin(this.authService);

    this.route.params
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (params) => {
          if (params['id'] && !this.tecnico) {
            this.tecnicoId.id = params['id'];
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
          const tecnicoDto: TecnicoDto = data['tecnico'];
          if (tecnicoDto) {
            this.tecnico = Tecnico.fromDto(tecnicoDto);
            this.tecnicoForm.patchValue(this.tecnico);
          }
        },
        error: (error) => {
          const erroMessage = error.message || 'Erro ao buscar técnico'
          this.toastr.error(erroMessage, 'Erro');
        }
      });
  }

  setTecnicoForm(): FormGroup {
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
    const control = this.tecnicoForm.get(controlName);

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

    setPerfisValue(this.tecnicoForm);

    if (
      !this.hasNomeErrors
      && !this.hasCpfErrors
      && !this.hasPerfisErrors
      && !this.hasEmailErrors
      && !this.hasSenhaErrors
    ) {
      this.tecnico = { ... this.tecnicoForm.value };

      this.tecnicoService.create(this.tecnico)
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
            this.tecnicoForm.reset(null, {
              emitEvent: false,
            });
            this.router.navigate(["tecnicos"]);
          }),
          error: (error) => {
            this.isLoading = false;
            const erroMessage = error || 'Erro ao cadastrar técnico';
            this.toastr.error(erroMessage, 'Erro');

          },
        });
    }
  }

  onEdit(): void {
    this.isLoading = true;

    setPerfisValue(this.tecnicoForm);

    if (
      !this.hasNomeErrors
      && !this.hasCpfErrors
      && !this.hasPerfisErrors
      && !this.hasEmailErrors
      && !this.hasSenhaErrors
    ) {
      this.tecnico = { ... this.tecnicoForm.value };
      const tecnicoDto = this.tecnico.toDto();

      this.tecnicoService.update(this.tecnicoId.id, tecnicoDto)
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
            this.tecnicoForm.reset(null, {
              emitEvent: false,
            });
            this.router.navigate(["tecnicos"]);
          }),
          error: (error) => {
            this.isLoading = false;
            const erroMessage = error || 'Erro ao atualizar técnico';
            this.toastr.error(erroMessage, 'Erro');
          },
        });

    }
  }

  onCancel(): void {
    this.tecnicoForm.reset(null, { emitEvent: false });
    this.router.navigate(['tecnicos']);
  }

  onHide(): void {
    this.hide = !this.hide;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
