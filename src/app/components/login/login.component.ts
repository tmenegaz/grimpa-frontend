import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject, takeUntil } from 'rxjs';
import { AuthService } from '~app/config/login/service/auth.service';
import { HeaderComponent } from '~components/header/header.component';
import { SharedModule } from '~components/shared/shared.module';
import { Credenciais } from '~src/app/config/login/credenciais';
import { SPINNER_CONFIG, SpinnerConfig } from '~src/app/config/spinner-config';
import { PessoaDto } from '~src/app/services/entities/pessoa/pessoa.dto';
import { PessoaService } from '~src/app/services/entities/pessoa/pessoa.service';
import { ImageService } from '~src/app/services/image.service';
import { LanguageService } from '~src/app/services/language.service';


@Component({
  selector: 'app-login',
  imports: [SharedModule, HeaderComponent,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  private destroy$ = new Subject<void>();
  isLoading = false;

  credenciais: Credenciais = {
    username: null,
    password: null,
  }

  constructor(
    private readonly router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private languageService: LanguageService,
    private imageService: ImageService,
    private pessoaService: PessoaService,
    @Inject(SPINNER_CONFIG) public spinnerConfig: SpinnerConfig
  ) { }

  ngOnInit(): void {
    this.loginForm = this.setLoginForm();
  }

  setLoginForm(): FormGroup {
    return new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    });
  }

  validateControl(controlName: string, requiredMessage: string, invalidMessage: string): boolean {
    const control = this.loginForm.get(controlName);

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

  get hasUsernameErrors(): boolean {
    return this.validateControl('username', 'E-mail obrigatório', 'E-mail inválido');
  }
  get hasPasswordErrors(): boolean {
    return this.validateControl('password', 'Senha é obrigatória', ' Senha deve ter no mínimo 3 caracteres');
  }

  onSubmit(): void {
    this.isLoading = true;
    if (
      !this.hasUsernameErrors
      && !this.hasPasswordErrors
    ) {

      this.credenciais = { ... this.loginForm.value };

      this.authService.authenticate(this.credenciais)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isLoading = false
          ),
        )
        .subscribe({
          next: (response: HttpResponse<string>) => {
            const responseBody = response.body as unknown as { token: string };
            const token = responseBody.token;

            this.authService.succesFullLogin(token);

            this.onPerfilByEmail();
          },
          error: () => {
            this.isLoading = false;
            this.toastr.error("Login: fail");
          }
        });
    }
  }

  private onPerfilByEmail(): void {
    this.isLoading = true;
    this.pessoaService.findByEmail(this.credenciais.username)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false),
      )
      .subscribe({
        next: (pessoaDto: PessoaDto) => {
          localStorage.setItem("perfis", JSON.stringify(pessoaDto.perfis));
          this.toastr.success('Success', 'Login');

          this.loginForm.get('username').setValidators(null);
          this.loginForm.get('password').setValidators(null);

          this.loginForm.reset(null, { emitEvent: true });

          this.isLoading = false;
          this.imageService.getImageUrl()
          localStorage.setItem('language', this.languageService.getCurrentLanguage() || 'pt');
          this.router.navigate(["home"]);

        }, error: (error) => {
          this.isLoading = false;
          const erroMessage = error.message || 'Erro ao consultar Perfil';
          this.toastr.error(erroMessage, 'Erro');
        }
      });
  }

  onCancel(): void {
    this.loginForm.reset(null, { emitEvent: false });
    this.router.navigate(["login"]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
