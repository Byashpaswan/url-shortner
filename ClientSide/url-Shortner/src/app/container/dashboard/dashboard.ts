import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UrlService } from '../../services/url-service';

interface UrlAnalytics {
  _id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

interface AnalyticsResponse {
  totalUrls: number;
  totalClicks: number;
  avgClicks: number;
  urls: UrlAnalytics[];
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  loading = true;
  error: string | null = null;
  successMessage: string | null = null;
  
  totalUrls = 0;
  totalClicks = 0;
  avgClicks = 0;
  urls: UrlAnalytics[] = [];

  deletingCode: string | null = null; // tracking which url is in delete-confirmation state

  constructor(private urlSvc: UrlService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading = true;
    this.error = null;
    this.urlSvc.analytics().subscribe({
      next: (res: any) => {
        const data = res as AnalyticsResponse;
        this.totalUrls = data.totalUrls || 0;
        this.totalClicks = data.totalClicks || 0;
        this.avgClicks = data.avgClicks || 0;
        this.urls = data.urls || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load analytics', err);
        this.error = err?.error?.message || err?.message || 'Failed to load URL analytics dashboard.';
        this.loading = false;
      }
    });
  }

  copy(text: string) {
    navigator.clipboard.writeText(text).then(
      () => {
        this.showSuccess('Copied to clipboard!');
      },
      () => {
        this.error = 'Failed to copy';
        setTimeout(() => this.error = null, 2000);
      }
    );
  }

  open(url: string) {
    window.open(url, '_blank', 'noopener');
  }

  confirmDelete(code: string) {
    this.deletingCode = code;
  }

  cancelDelete() {
    this.deletingCode = null;
  }

  deleteLink(code: string) {
    this.urlSvc.delete(code).subscribe({
      next: () => {
        this.deletingCode = null;
        this.showSuccess('Short URL deleted successfully!');
        this.loadAnalytics(); // Reload updated stats & link table
      },
      error: (err) => {
        this.deletingCode = null;
        this.error = err?.error?.message || 'Failed to delete URL link.';
        setTimeout(() => this.error = null, 3000);
      }
    });
  }

  private showSuccess(msg: string) {
    this.successMessage = msg;
    setTimeout(() => this.successMessage = null, 2500);
  }
}
