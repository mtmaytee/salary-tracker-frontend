import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login';
import { RegisterComponent } from './auth/register';
import { LayoutComponent } from './layout/layout';
import { DashboardComponent } from './dashboard/dashboard';
import { CompanyManagementComponent } from './pages/company-management';
import { TaxSettingsComponent } from './pages/tax-settings';
import { ProfileComponent } from './pages/profile';
import { UserManagementComponent } from './pages/user-management';
import { ReportManagementComponent } from './pages/report-management';
import { NotFoundComponent } from './pages/not-found';
import { authGuard } from './guards/auth.guard';

import { SalaryManagementComponent } from './dashboard/salary-management';

import { EmploymentManagementComponent } from './pages/employment-management';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'salary', component: SalaryManagementComponent },
      { path: 'employments', component: EmploymentManagementComponent },
      { path: 'companies', component: CompanyManagementComponent },
      { path: 'tax-settings', component: TaxSettingsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'admin/users', component: UserManagementComponent },
      { path: 'admin/reports', component: ReportManagementComponent },
    ],
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];
