import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '~components/shared/shared.module';

@Component({
  selector: 'app-header',
  imports: [SharedModule, MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnChanges {
  
  @Input()
  isLoginPage = true;
  @Input()
  drawer: MatDrawer;
  
  showButton: boolean;
  
  
  
  ngOnChanges(isLoginPage: SimpleChanges): void {
    if (isLoginPage) {
      this.showButton = !this.isLoginPage   
    }

  }
    
}
