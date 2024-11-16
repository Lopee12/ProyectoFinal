import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.css'],
})
export class ThemeSwitcherComponent implements OnInit {
  isDarkMode: boolean = true;

  ngOnInit() {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme() {
    const htmlElement = document.documentElement;
    if (this.isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }
}
