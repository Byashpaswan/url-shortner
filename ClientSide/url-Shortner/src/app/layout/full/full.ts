import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { HorizontalHeader } from '../../shared/horizontal-header/horizontal-header';
import { VerticalSidebar } from '../../shared/vertical-sidebar/vertical-sidebar';


@Component({
  selector: 'app-full',
  imports: [CommonModule,RouterOutlet,HorizontalHeader,RouterModule,VerticalSidebar],
  templateUrl: './full.html',
  styleUrls: ['./full.css'],
})
export class Full implements OnInit {
  breadcrumbs: Array<{ label: string; url: string }> = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // rebuild breadcrumbs on navigation end
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      const root = this.activatedRoute.root;
      this.breadcrumbs = this.getBreadcrumbs(root);
    });
    // compute initial breadcrumbs
    this.breadcrumbs = this.getBreadcrumbs(this.activatedRoute.root);
  }

  private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Array<{ label: string; url: string }> = []): Array<{ label: string; url: string }> {
    const children = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      if (!child.snapshot) continue;

      const routeConfig = child.snapshot.routeConfig;
      if (!routeConfig) {
        // dive deeper
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      const routeURL = child.snapshot.url.map(segment => segment.path).join('/');
      const nextUrl = routeURL ? `${url}/${routeURL}` : url;
      const label = child.snapshot.data && child.snapshot.data['breadcrumb'] ? child.snapshot.data['breadcrumb'] : (routeConfig.path || '');

      if (label) {
        breadcrumbs.push({ label, url: nextUrl || '/' });
      }

      return this.getBreadcrumbs(child, nextUrl, breadcrumbs);
    }

    return breadcrumbs;
  }
    
}
