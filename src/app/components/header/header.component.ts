import { Component, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '~components/shared/shared.module';
import { DrawerService } from '~src/app/services/drawer.service';
import { LanguageService } from '~src/app/services/language.service';
import { RouteService } from '~src/app/services/route.service';

@Component({
  selector: 'app-header',
  imports: [SharedModule, MatToolbarModule, MatButtonToggleModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
})
export class HeaderComponent implements OnInit {

  showButton: boolean;
  currentLanguage: string;

  constructor(
    private routeService: RouteService,
    private drawerService: DrawerService,
    private languageService: LanguageService,
  ){}

  ngOnInit(): void {
    this.routeService.getCurrentRoute().subscribe((route) => {
      this.showButton = route !== "/login";
    });
    
    this.currentLanguage = this.languageService.getCurrentLanguage() || 'pt';
  }

  toggleDrawer(): void {
    this.drawerService.toggleDrawer();
  }

  toggleLanguage(event: any): void {
    const lang = event.value;
    this.languageService.setLanguage(lang);
  }
}
