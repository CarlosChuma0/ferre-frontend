import { Component, signal } from '@angular/core';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var gtag: Function;  // <- para que TS conozca gtag()

@Component({
  selector: 'app-root',
  imports: [ Header, Footer, RouterOutlet ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-hia');

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('config', 'G-0SEYBSS7CH', {
          page_path: event.urlAfterRedirects
          // opcional:
          // page_title: document.title
        });
      });
  }
}