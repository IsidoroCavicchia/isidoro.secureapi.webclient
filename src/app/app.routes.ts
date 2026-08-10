import { Routes } from '@angular/router';
import { Home } from './home/home';
import { LoginComponent } from './login/login';
import { UserListComponent } from './user/user-list-component/user-list-component';
import { SideBarComponent } from '../theme/sidebar.component';
import { authGuard } from './guards/auth.guard';
import { CreateUserComponent } from './user/create-user-component/create-user-component';
import { UpdateUserComponent } from './user/update-user-component/update-user-component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: SideBarComponent,
        canActivate: [authGuard],
        children: [
            { path: '', component: Home },
            { path: 'user', component: UserListComponent },
            { path: 'user/create', component: CreateUserComponent },
            { path: 'user/:id', component: UpdateUserComponent }
        ]
    },
    { path: '**', redirectTo: '' }
];
