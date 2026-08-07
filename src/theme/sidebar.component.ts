import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { SidebarModule  } from "primeng/sidebar";
import { PIcon } from '@primeicons/angular/p-icon';
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { SidebarCollapsible } from 'primeng/types/sidebar';
import { ButtonModule } from "primeng/button";
import { AvatarModule } from "primeng/avatar";
import { filter, map } from "rxjs";
import { AuthService } from "../services/auth.service";

interface NavItem {
    icon: string;
    label: string;
    route?: string;
    badge?: string;
    subItems?: { label: string; route?: string }[];
    command?: () => void;
}

interface NavGroup {
    label: string;
    items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [SidebarModule, PIcon, RouterOutlet, AvatarModule, ButtonModule],
  template: `
    <p-sidebar-layout class="relative!">
        <p-sidebar id="sidebar" variant="floating" [collapsible]="collapsible" showCloseIcon="true" [(open)]="open">
            <p-sidebar-spacer />
            <p-sidebar-aside>
                <p-sidebar-panel>
                    <p-sidebar-header>
                        <p-sidebar-menu>
                            <p-sidebar-menu-item>
                                <button pSidebarMenuButton class="px-1!" (click)="open.set(!open())">
                                    <div class="flex size-6 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold leading-none">API</div>
                                    <span class="font-semibold text-sm">SecureAPI</span>
                                </button>
                            </p-sidebar-menu-item>
                        </p-sidebar-menu>
                    </p-sidebar-header>
                    <p-sidebar-content>
                        @for (group of navGroups; track group.label){
                            <p-sidebar-group>
                                <p-sidebar-group-label>{{group.label}}</p-sidebar-group-label>
                                <p-sidebar-group-content>
                                    @for (item of group.items; track item.label){
                                        <p-sidebar-menu-item [collapsible]="!!item.subItems" [defaultOpen]="hasActiveSub(item)">
                                            <button pSidebarMenuButton [isActive]="isItemActive(item)" (click)="item.command?.()">
                                                <svg [pIcon]="item.icon"></svg>
                                                <span>{{item.label}}</span>
                                                @if (item.subItems){
                                                <svg data-p-icon="chevron-down" class="ml-auto"></svg>
                                                }
                                            </button>
                                        </p-sidebar-menu-item>
                                    }
                                </p-sidebar-group-content>
                            </p-sidebar-group>
                        }
                    </p-sidebar-content>
                    <p-sidebar-footer>
                        <p-sidebar-menu>
                            <p-sidebar-menu-item>
                                <button pSidebarMenuButton class="p-1!">
                                    <p-avatar [label]="userInitials()" shape="circle" class="size-6 shrink-0 text-xs" />
                                    <span>{{ authService.currentUser() }}</span>
                                </button>
                                <button pSidebarMenuAction (click)="authService.logout()" aria-label="Se déconnecter">
                                    <svg data-p-icon="sign-out"></svg>
                                </button>
                            </p-sidebar-menu-item>
                        </p-sidebar-menu>
                    </p-sidebar-footer>
                </p-sidebar-panel>
            </p-sidebar-aside>
        </p-sidebar>
        <p-sidebar-main>
            <div class="container">
                <router-outlet></router-outlet>
            </div>
        </p-sidebar-main>
    </p-sidebar-layout>
  `
})
export class SideBarComponent {
    collapsible: SidebarCollapsible = 'icon';
    open = signal(true);
    readonly router = inject(Router);
    readonly authService = inject(AuthService);

    readonly userInitials = computed(() =>
        (this.authService.currentUser() ?? '').slice(0, 2).toUpperCase()
    );

    private readonly currentUrl = toSignal(
        this.router.events.pipe(
            filter((e) => e instanceof NavigationEnd),
            map((e) => (e as NavigationEnd).urlAfterRedirects)
        ),
        { initialValue: this.router.url }
    );

    navGroups: NavGroup[] = [
        {
            label: 'Home',
            items: [
                { icon: 'home', label: 'Dashboard', route: '/', command: () => this.router.navigate(['/']) },
            ]
        },
        {
            label: 'Sécurité',
            items: [
                { icon: 'user', label: 'Utilisateurs', route: '/user', command: () => this.router.navigate(['/user']) },
                { icon: 'globe', label: 'Applications', route: '/applications', command: () => this.router.navigate(['/applications']) },
            ]
        }
    ];

    isItemActive(item: NavItem): boolean {
        const url = this.currentUrl();
        return item.route ? url === item.route || url.startsWith(item.route + '/') : false;
    }

    hasActiveSub(item: NavItem): boolean {
        return !!item.subItems?.some((s) => s.route && this.currentUrl().startsWith(s.route));
    }
}