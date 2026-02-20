import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UrlService } from '../../services/url-service';
import { RouterModule } from '@angular/router';

interface ShortResult {
  shortUrl?: string;
  shortCode?: string;
  originalUrl?: string;
}

@Component({
  selector: 'app-short-url',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './short-url.html',
  styleUrl: './short-url.css',
})
export class ShortUrl {
  form: any;
  private fb: FormBuilder;

  submitting = false;
  serverError: string | null = null;
  result: ShortResult | null = null;
  recent: ShortResult[] = [];

  constructor(fb: FormBuilder, private urlSvc: UrlService) {
    this.fb = fb;
    this.form = this.fb.group({
      url: ['', [Validators.required, Validators.pattern(/^(https?:)?\/\/[\w\-]+(\.[\w\-]+)+(:\d+)?(\/.*)?$/i)]],
      customAlias: ['']
    });
    this.loadRecent();
  }

  get f() { return this.form.controls; }

  submit() {
    this.serverError = null;
    this.result = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: any = { originalUrl: this.f['url'].value };
    const alias = this.f['customAlias'].value;
    if (alias) payload.customAlias = alias;

  this.urlSvc.shorten(payload).subscribe({
      next: (res: any) => {
        // backend may return different shapes; normalize
        const shortUrl = res?.shortUrl || res?.data?.shortUrl || (res?.shortCode ? this.normalizeShort(res.shortCode) : null);
        const shortCode = res?.shortCode || res?.data?.shortCode || null;
        const original = res?.originalUrl || res?.data?.originalUrl || payload.originalUrl;
        this.result = { shortUrl, shortCode, originalUrl: original };
        this.saveRecent(this.result);
        this.submitting = false;
      },
      error: (err: any) => {
        this.submitting = false;
        this.serverError = err?.error?.message || err?.message || 'Failed to shorten URL';
      }
    });
  }

  normalizeShort(code: string) {
    // If url service base is same host for short links, produce absolute
    if (/^https?:\/\//i.test(code)) return code;
    try {
      // if UrlService exposes api base, use it
      // fallback to relative path
      return `${location.origin}/${code}`;
    } catch {
      return `/${code}`;
    }
  }

  async copy(text?: string) {
    if (!text && this.result?.shortUrl) text = this.result.shortUrl;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      // small UX hint: we could show a toast; for now set serverError as success msg temporarily
      this.serverError = 'Copied to clipboard';
      setTimeout(()=> this.serverError = null, 1800);
    } catch {
      this.serverError = 'Copy failed';
      setTimeout(()=> this.serverError = null, 1800);
    }
  }

  open(url?: string) {
    if (!url) return;
    try {
      window.open(url, '_blank');
    } catch (e) {
      // fallback
      location.href = url;
    }
  }

  private loadRecent() {
    try {
      const raw = localStorage.getItem('recentShorts');
      if (raw) this.recent = JSON.parse(raw);
    } catch {}
  }

  private saveRecent(item: ShortResult) {
    try {
      this.recent = [item, ...this.recent].slice(0, 10);
      localStorage.setItem('recentShorts', JSON.stringify(this.recent));
    } catch {}
  }

}
