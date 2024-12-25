import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  private drawer: MatDrawer;

  setDrawer(drawer: MatDrawer): void {
    this.drawer = drawer;
  }

  toggleDrawer(): void {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }

  closeDrawer(): void {    
    if (this.drawer && this.drawer.opened) {
      this.drawer.close();
    }
  }

  openDrawer(): void {    
    if (this.drawer) {
      this.drawer.open();
    }
  }
}
