import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '~app/config/login/service/auth.service';
import { HeaderComponent } from '~components/header/header.component';
import { SharedModule } from '~components/shared/shared.module';
import { Credenciais } from '~src/app/config/login/credenciais';
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

  credenciais: Credenciais = {
    email: null,
    senha: null,
  }

  constructor(
    private readonly router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.setLoginForm();
  }

  setLoginForm(): FormGroup {
    return new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      senha: new FormControl(null, [Validators.required, Validators.minLength(3)]),
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

      get hasEmailErrors(): boolean {
        return this.validateControl('email', 'E-mail obrigatório', 'E-mail inválido'); 
      }
      get hasSenhaErrors(): boolean {
        return this.validateControl('senha', 'Senha é obrigatória', ' Senha deve ter no mínimo 3 caracteres');
      }

      onSubmit(): void {
        if (
          !this.hasEmailErrors
          && !this.hasSenhaErrors
        ) {
          
          this.credenciais = { ... this.loginForm.value };

          this.authService.authenticate(this.credenciais)
          .pipe(
            takeUntil(this.destroy$)
          )
          .subscribe({
            next: (response: HttpResponse<string>) => {
                const token = response.headers.get('Authorization');

                this.authService.succesFullLogin(token.substring(7));

                this.toastr.success('Success', 'Login');

                this.loginForm.get('email').setValidators(null);
                this.loginForm.get('senha').setValidators(null);

                this.loginForm.reset(null, { emitEvent: true });

                localStorage.setItem('language', this.languageService.getCurrentLanguage() || 'pt')
                this.router.navigate(["home"]);
              },
              error: () => {
                this.toastr.error("Login: fail");
              }
            });          
        } 
    }

  onCancel(): void {
    this.loginForm.reset(null, { emitEvent: false });
  }

  ngOnDestroy(): void { 
    this.destroy$.next();
    this.destroy$.complete(); 
  }
}
