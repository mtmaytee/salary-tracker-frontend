import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { LanguageService } from '../services/language.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">{{ langService.translate('user_management') }}</h1>
          <p class="text-gray-500 text-sm">จัดการผู้ใช้งานและสิทธิ์การเข้าถึงระบบ</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let user of users" class="hover:bg-gray-50/50 transition duration-150">
                <td class="px-6 py-4">
                  <div class="font-medium text-gray-900">{{ user.username }}</div>
                  <div class="text-xs text-gray-400">ID: {{ user.id }}</div>
                </td>
                <td class="px-6 py-4 text-gray-600">{{ user.email }}</td>
                <td class="px-6 py-4 text-gray-600">
                  {{ user.firstName }} {{ user.lastName }}
                </td>
                <td class="px-6 py-4">
                  <span [class]="getRoleClass(user.role || '')" class="px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span [class]="user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" 
                        class="px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ user.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button (click)="toggleRole(user)" 
                            class="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded transition">
                      Change Role
                    </button>
                    <button (click)="toggleStatus(user)" 
                            [class]="user.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'"
                            class="text-xs px-3 py-1 rounded transition">
                      {{ user.active ? 'Deactivate' : 'Activate' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div *ngIf="users.length === 0" class="p-12 text-center">
          <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 15.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <p class="text-gray-500">ไม่พบข้อมูลผู้ใช้งาน</p>
        </div>
      </div>
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  adminService = inject(AdminService);
  langService = inject(LanguageService);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error loading users:', err)
    });
  }

  toggleRole(user: User): void {
    const newRole = user.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    if (confirm(`ต้องการเปลี่ยนสิทธิ์ของ ${user.username} เป็น ${newRole} ใช่หรือไม่?`)) {
      this.adminService.updateUserRole(user.id, newRole).subscribe({
        next: () => {
          user.role = newRole;
        },
        error: (err) => alert('เกิดข้อผิดพลาดในการเปลี่ยนสิทธิ์')
      });
    }
  }

  toggleStatus(user: any): void {
    const newStatus = !user.active;
    const action = newStatus ? 'เปิดใช้งาน' : 'ระงับการใช้งาน';
    if (confirm(`ต้องการ${action}บัญชีของ ${user.username} ใช่หรือไม่?`)) {
      this.adminService.updateUserStatus(user.id, newStatus).subscribe({
        next: () => {
          user.active = newStatus;
        },
        error: (err) => alert(`เกิดข้อผิดพลาดในการ${action}`)
      });
    }
  }

  getRoleClass(role: string): void | string {
    switch (role) {
      case 'ROLE_ADMIN': return 'bg-purple-100 text-purple-700';
      case 'ROLE_USER': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
