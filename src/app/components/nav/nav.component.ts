import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { HeaderComponent } from '~components/header/header.component';
import { SharedModule } from '~components/shared/shared.module';

@Component({
  standalone: true,
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  imports: [
    SharedModule,
    CommonModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    HeaderComponent
  ]
})
    export class NavComponent implements OnInit {

      isLoginPage = false;

      constructor(
        private readonly router: Router,
        private toastr: ToastrService,
      ) {}

      ngOnInit(): void {
        this.checkIfLoginPage(); 
        this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd)
        )
        .subscribe(() => {
          this.checkIfLoginPage();
        });
    }

    logout(): void {
      localStorage.clear();
      this.toastr.success("Success", "Logout")
      this.router.navigate(['login']);
    }

    checkIfLoginPage(): void {
      this.isLoginPage = this.router.url === '/login';
    }
  }
