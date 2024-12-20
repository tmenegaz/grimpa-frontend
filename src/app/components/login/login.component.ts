import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { Credenciais } from '../../entities/login/credenciais';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [SharedModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  credenciais: Credenciais = {
    email: null,
    senha: null,
  }

  constructor(
    private readonly router: Router,
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

  get emailErrors(): string {
    const emailControl = this.loginForm.get('email');
    if (emailControl.touched && emailControl.invalid) {
      return emailControl.hasError('required') ? 'E-mail é obrigatório.' : 'E-mail inválido.'; }
      return '';
    }
      
  get senhaErrors(): string {
    const senhaControl = this.loginForm.get('senha');
    if (senhaControl.touched && senhaControl.invalid) {
      return senhaControl.hasError('required') ? 'Senha é obrigatória.' : 'Senha deve ter no mínimo 3 caracteres.'; }
      return '';
    }

  onSubmit(): void {
    this.credenciais.email = this.loginForm.get("email").value;
    this.credenciais.senha = this.loginForm.get("senha").value;
    console.log(this.credenciais);
    
  }

  onCancel(): void {
    this.loginForm.reset({ emitEven: false });
    this.router.navigate(["home"]);
  }

}
