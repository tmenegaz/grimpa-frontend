import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SharedModule } from '../shared/shared.module';

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
  
  
      constructor(
        private readonly router: Router,
      ) {}

      ngOnInit(): void {
    this.router.navigate([]);
  }

}
