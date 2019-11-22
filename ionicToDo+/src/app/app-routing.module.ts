import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)},
  { path: 'add-task', loadChildren: './pages/add-task/add-task.module#AddTaskPageModule' },
  { path: 'edit-task/:id', loadChildren: './pages/edit-task/edit-task.module#EditTaskPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'edit-user', loadChildren: './pages/edit-user/edit-user.module#EditUserPageModule' },
  { path: 'registr', loadChildren: './pages/registr/registr.module#RegistrPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }




