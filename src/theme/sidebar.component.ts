import { Component, signal } from "@angular/core";
import { SidebarModule  } from "primeng/sidebar";
import { PIcon } from '@primeicons/angular/p-icon';
import { RouterOutlet } from "@angular/router";
import { SidebarCollapsible } from 'primeng/types/sidebar';

interface NavItem {
    icon: string;
    label: string;
    isActive?: boolean;
    badge?: string;
    subItems?: { label: string; isActive?: boolean }[];
}

interface NavGroup {
    label: string;
    items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [SidebarModule, PIcon, RouterOutlet],
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
                                            <button pSidebarMenuButton [isActive]="!!item.isActive">
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

    navGroups: NavGroup[] = [
        {
            label: 'Home',
            items: [
                { icon: 'home', label: 'Dashboard', isActive: true },
            ]
        },
        {
            label: 'Sécurité',
            items: [
                { icon: 'user', label: 'Utilisateurs' },
                { icon: 'globe', label: 'Applications' },
            ]
        }
    ];

    hasActiveSub(item: NavItem): boolean {
        return !!item.subItems?.some((s) => s.isActive);
    }
}