import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { resolveCmsPageKey } from '../../config/page-seo.config';
import { DataService } from './data.service';

export interface SeoData {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_card?: string;
  twitter_image?: string;
  canonical?: string;
  robots?: string;
  structure_schema?: string;
}

export interface SeoFallbacks {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  structure_schema?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private defaultTitle = environment.seo.defaultTitle;
  private defaultDescription = environment.seo.defaultDescription;
  private defaultImage = environment.seo.defaultImage;
  private siteUrl = environment.siteUrl;

  private pagesCache$: Observable<any[]> | null = null;
  private settingsCache$: Observable<any[]> | null = null;

  constructor(
    private meta: Meta,
    private title: Title,
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  applyHomeSeo(fallbacks?: SeoFallbacks): void {
    this.getSettings().subscribe({
      next: (settings) => {
        const seoData = this.extractSeoFromSettings(
          settings,
          this.getCurrentLanguage()
        );
        this.applySeoWithFallbacks(seoData, fallbacks);
      },
      error: () => this.applySeoWithFallbacks({}, fallbacks),
    });
  }

  applyPageSeoByRoute(routePath: string, fallbacks?: SeoFallbacks): void {
    const pageKey = resolveCmsPageKey(routePath);
    this.applyPageSeo(pageKey, fallbacks);
  }

  applyPageSeo(pageKey: string, fallbacks?: SeoFallbacks): void {
    this.getPages().subscribe({
      next: (pages) => {
        const page = this.findPageByKey(pages, pageKey);
        if (page?.seo) {
          const seoData = this.normalizeApiSeo(page.seo);
          this.applySeoWithFallbacks(seoData, fallbacks);
          return;
        }

        this.applySettingsSeo(fallbacks);
      },
      error: () => this.applySettingsSeo(fallbacks),
    });
  }

  applySettingsSeo(fallbacks?: SeoFallbacks): void {
    this.getSettings().subscribe({
      next: (settings) => {
        const seoData = this.extractSeoFromSettings(
          settings,
          this.getCurrentLanguage()
        );
        this.applySeoWithFallbacks(seoData, fallbacks);
      },
      error: () => this.applySeoWithFallbacks({}, fallbacks),
    });
  }

  applyEntitySeo(rawSeo: SeoData | null | undefined, fallbacks?: SeoFallbacks): void {
    const seoData = this.normalizeApiSeo(rawSeo);
    this.applySeoWithFallbacks(seoData, fallbacks);
  }

  updateSeoData(
    seoData: SeoData,
    fallbackTitle?: string,
    fallbackDescription?: string,
    fallbackImage?: string
  ): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const title =
      seoData.meta_title ||
      seoData.og_title ||
      fallbackTitle ||
      this.defaultTitle;
    const description =
      seoData.meta_description ||
      seoData.og_description ||
      fallbackDescription ||
      this.defaultDescription;
    const image =
      seoData.og_image ||
      seoData.twitter_image ||
      fallbackImage ||
      this.defaultImage;
    const keywords = seoData.meta_keywords || '';
    const canonical = seoData.canonical || this.getCurrentUrl();
    const robots = seoData.robots || 'index, follow';

    this.title.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    this.meta.updateTag({ name: 'robots', content: robots });

    this.meta.updateTag({
      property: 'og:title',
      content: seoData.og_title || title,
    });
    this.meta.updateTag({
      property: 'og:description',
      content: seoData.og_description || description,
    });
    this.meta.updateTag({
      property: 'og:image',
      content: this.getFullImageUrl(image),
    });
    this.meta.updateTag({
      property: 'og:type',
      content: seoData.og_type || 'website',
    });
    this.meta.updateTag({ property: 'og:url', content: canonical });

    this.meta.updateTag({
      name: 'twitter:card',
      content: seoData.twitter_card || 'summary_large_image',
    });
    this.meta.updateTag({
      name: 'twitter:title',
      content: seoData.twitter_title || title,
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content: seoData.twitter_description || description,
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: this.getFullImageUrl(seoData.twitter_image || image),
    });

    this.updateCanonicalUrl(canonical);

    if (seoData.structure_schema) {
      this.updateStructuredData(seoData.structure_schema);
    }
  }

  normalizeApiSeo(raw: SeoData | null | undefined): SeoData {
    if (!raw || typeof raw !== 'object') {
      return {};
    }

    const seoData: SeoData = {};
    const fields: (keyof SeoData)[] = [
      'meta_title',
      'meta_description',
      'meta_keywords',
      'og_title',
      'og_description',
      'og_image',
      'og_type',
      'twitter_title',
      'twitter_description',
      'twitter_card',
      'twitter_image',
      'canonical',
      'robots',
      'structure_schema',
    ];

    for (const field of fields) {
      const value = raw[field];
      if (value !== null && value !== undefined && value !== '') {
        seoData[field] = value;
      }
    }

    return seoData;
  }

  extractSeoFromSettings(
    settingsResponse: any[],
    language: string = 'en'
  ): SeoData {
    if (!settingsResponse || !Array.isArray(settingsResponse)) {
      return {};
    }

    const seoSetting = settingsResponse.find(
      (item: any) => item.option_key === 'seo'
    );

    if (!seoSetting?.option_value) {
      return {};
    }

    const seoValue = seoSetting.option_value;
    const langData = seoValue[language] || seoValue['en'] || {};
    const seoData: SeoData = {};

    if (langData.meta_title) seoData.meta_title = langData.meta_title;
    if (langData.meta_description)
      seoData.meta_description = langData.meta_description;
    if (langData.meta_keywords) seoData.meta_keywords = langData.meta_keywords;
    if (langData.og_title) seoData.og_title = langData.og_title;
    if (langData.og_description)
      seoData.og_description = langData.og_description;
    if (langData.twitter_title) seoData.twitter_title = langData.twitter_title;
    if (langData.twitter_description)
      seoData.twitter_description = langData.twitter_description;
    if (langData.canonical) seoData.canonical = langData.canonical;
    if (langData.structure_schema)
      seoData.structure_schema = langData.structure_schema;

    if (seoValue.robots) seoData.robots = seoValue.robots;
    if (seoValue.og_type) seoData.og_type = seoValue.og_type;
    if (seoValue.twitter_card) seoData.twitter_card = seoValue.twitter_card;

    return seoData;
  }

  findPageByKey(pages: any[], key: string): any | undefined {
    if (!pages?.length || !key) {
      return undefined;
    }

    const normalizedKey = key.toLowerCase();
    return pages.find(
      (page) => String(page?.key ?? '').toLowerCase() === normalizedKey
    );
  }

  getCurrentLanguage(): string {
    if (!isPlatformBrowser(this.platformId)) {
      return 'en';
    }
    return localStorage.getItem('language') || 'en';
  }

  getCmsPageKeys(): Observable<string[]> {
    return this.getPages().pipe(
      map((pages) =>
        pages
          .map((page) => page?.key)
          .filter((key): key is string => Boolean(key))
      )
    );
  }

  clearPagesCache(): void {
    this.pagesCache$ = null;
  }

  clearSettingsCache(): void {
    this.settingsCache$ = null;
  }

  resetToDefaults(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.updateSeoData({});
  }

  updateSeoFromSettings(
    settingsResponse: any[],
    language: string = 'en',
    fallbackTitle?: string,
    fallbackDescription?: string,
    fallbackImage?: string
  ): void {
    const seoData = this.extractSeoFromSettings(settingsResponse, language);
    this.updateSeoData(
      seoData,
      fallbackTitle,
      fallbackDescription,
      fallbackImage
    );
  }

  private applySeoWithFallbacks(seoData: SeoData, fallbacks?: SeoFallbacks): void {
    const merged: SeoData = { ...seoData };

    if (fallbacks?.keywords && !merged.meta_keywords) {
      merged.meta_keywords = fallbacks.keywords;
    }
    if (fallbacks?.canonical && !merged.canonical) {
      merged.canonical = fallbacks.canonical;
    }
    if (fallbacks?.robots && !merged.robots) {
      merged.robots = fallbacks.robots;
    }
    if (fallbacks?.structure_schema && !merged.structure_schema) {
      merged.structure_schema = fallbacks.structure_schema;
    }

    this.updateSeoData(
      merged,
      fallbacks?.title,
      fallbacks?.description,
      fallbacks?.image
    );
  }

  private getPages(): Observable<any[]> {
    if (!this.pagesCache$) {
      this.pagesCache$ = this.dataService.getPages().pipe(
        map((res) => res?.data?.data ?? []),
        catchError(() => of([])),
        shareReplay(1)
      );
    }

    return this.pagesCache$;
  }

  private getSettings(): Observable<any[]> {
    if (!this.settingsCache$) {
      this.settingsCache$ = this.dataService.getSetting().pipe(
        map((res) => (Array.isArray(res?.data) ? res.data : [])),
        catchError(() => of([])),
        shareReplay(1)
      );
    }

    return this.settingsCache$;
  }

  private updateCanonicalUrl(url: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    let link: HTMLLinkElement | null = document.querySelector(
      "link[rel='canonical']"
    );
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private updateStructuredData(schema: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    try {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = schema;
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error adding structured data:', error);
    }
  }

  private getFullImageUrl(image: string): string {
    if (!image) {
      return `${this.siteUrl}${this.defaultImage}`;
    }
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }
    if (image.startsWith('/')) {
      return `${this.siteUrl}${image}`;
    }
    return `${this.siteUrl}/${image}`;
  }

  private getCurrentUrl(): string {
    if (!isPlatformBrowser(this.platformId)) {
      return `${this.siteUrl}/`;
    }
    return window.location.href;
  }
}
