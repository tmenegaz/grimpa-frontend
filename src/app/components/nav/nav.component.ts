import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '~components/header/header.component';
import { SharedModule } from '~components/shared/shared.module';
import { DrawerService } from '~src/app/services/drawer.service';

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
    HeaderComponent
  ]
})
    export class NavComponent implements OnInit, AfterViewInit {

      @ViewChild('drawer') drawer: MatDrawer;
      
      constructor(
        private readonly router: Router,
        private toastr: ToastrService,
        private drawerService: DrawerService,
      ) {}
      
      ngOnInit(): void {
    }
    
    ngAfterViewInit(): void {
      this.drawerService.setDrawer(this.drawer)
    }


    

    logout(): void {
      localStorage.removeItem('token');
      this.toastr.success("Success", "Logout")
      this.router.navigate(['login']);
    }
  }
