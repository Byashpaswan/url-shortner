import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { VerticalSidebarService } from './verical-sidebar-service';
import { RouteInfo } from './vertical-sidebar.metedata';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vertical-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './vertical-sidebar.html',
  styleUrl: './vertical-sidebar.css',
})
export class VerticalSidebar implements OnInit, OnDestroy {

  menuItems: RouteInfo[] = [];
  private sub?: Subscription;

  constructor(private menuService: VerticalSidebarService) {}

  ngOnInit(): void {
    this.menuItems = this.menuService.MENUITEMS;
    // subscribe if future updates are needed
    this.sub = this.menuService.items.subscribe(items => this.menuItems = items);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
