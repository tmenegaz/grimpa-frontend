import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of, Subject } from 'rxjs';
import { HeaderComponent } from '~components/header/header.component';
import { Tecnico } from '~components/tecnico/entity/tecnico';
import { TecnicoService } from '~components/tecnico/service/tecnico.service';
import { SharedModule } from '~shared/shared.module';
import { currentDate, isAdmin } from '~shared/utils';
import { AuthService } from '~src/app/config/login/service/auth.service';
import { Perfil } from '~src/app/enums/perfil.enum';
import { Location } from '@angular/common';
import { noNumbersValidator } from '~src/app/validators/nome.validator';
import { SPINNER_CONFIG, SpinnerConfig } from '~src/app/config/spinner-config';


@Component({
  selector: 'app-tecnico-form',
  imports: [SharedModule, HeaderComponent],
  templateUrl: './tecnico-form.component.html',
  styleUrl: './tecnico-form.component.css',
  standalone: true,
})
export class TecnicoFormComponent  implements OnInit {

  tecnicoForm: FormGroup;
  selectedPefil = [];
  isAdmin: boolean;
  isLoading = false

  private destroy$ = new Subject<void>();

  perfilControl = new FormControl();
  perfis = Object.keys(Perfil).filter(key => isNaN(Number(key)) 
  && Perfil[key as keyof typeof Perfil] !== Perfil.CLIENTE
  );

  tecnico: Tecnico;

  constructor(
    private readonly router: Router,
    private toastr: ToastrService,
    private tecnicoService: TecnicoService,
    private authService: AuthService,
    private location: Location,
    @Inject(SPINNER_CONFIG) public spinnerConfig: SpinnerConfig
  ) { }

  ngOnInit(): void {
    this.tecnicoForm = this.setTecnicoForm();
    this.isAdmin = isAdmin(this.authService);
  }

  setTecnicoForm(): FormGroup {
    return new FormGroup({
      nome: new FormControl(null, [Validators.required, Validators.minLength(3), noNumbersValidator]),
      cpf: new FormControl(null, [Validators.required, Validators.minLength(14), Validators.maxLength(14)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      senha: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      perfis: new FormControl(null),
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
    let perfilValues = this.selectedPefil.map(
      perfil => Perfil[perfil as keyof typeof Perfil]);

      if (perfilValues.length === 0) {
        perfilValues = [2];
      }

    this.tecnicoForm.get("perfis").patchValue(perfilValues);

    if (
      !this.hasNomeErrors 
      && !this.hasCpfErrors 
      && !this.hasPerfisErrors
      && !this.hasEmailErrors
      && !this.hasSenhaErrors
    ) {
      this.tecnico = {... this.tecnicoForm.value};

      this.tecnicoService.create(this.tecnico)
      .pipe( 
        catchError(error => {
           console.error(error);
           this.isLoading = false;
            this.toastr.error('Erro ao cadastrar técnico', 'Erro');
             return of(null);
             }),
              finalize(() => {
                this.isLoading = false;
                this.tecnicoForm.reset(null, {
                  emitEvent: false,
                });
                this.router.navigate(["tecnicos"]);
              })
            )
            .subscribe({ 
              next: () => {
                        this.isLoading = false;
                        this.toastr.success('Success', 'Cadastro');
                       } 
                      });
                        
    }
  }

  onCancel(): void {
    this.tecnicoForm.reset(null, { emitEvent: false });
    this.location.back();
  }

  ngOnDestroy(): void { 
    this.destroy$.next();
    this.destroy$.complete(); 
  }

}
