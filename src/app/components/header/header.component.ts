import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '~components/shared/shared.module';
import { DrawerService } from '~src/app/services/drawer.service';
import { LanguageService } from '~src/app/services/language.service';
import { RouteService } from '~src/app/services/route.service';
import { Router } from '@angular/router';
import { ImageService } from '~src/app/services/image.service';

@Component({
  selector: 'app-header',
  imports: [SharedModule, MatToolbarModule],
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
    private router: Router,
    private imageService: ImageService,
  ) { }

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

  account(): void {
    this.router.navigate(['/conta']);
  }

  getImageUrl(): string { return this.imageService.getImageUrl(); }

  hasImage(): boolean { return !!this.imageService.getImageUrl(); }
}
