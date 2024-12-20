import { Routes } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { TecnicoListComponent } from './components/tecnicos/tecnico-list/tecnico-list.component';

export const routes: Routes = [
  { path: '', component: NavComponent, children: [
    { path: 'home', component: HomeComponent },
    {path: 'tecnicos', component: TecnicoListComponent }
  ]
},
];
