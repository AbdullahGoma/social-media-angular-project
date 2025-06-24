import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  private router = inject(Router);
  onClick() {
    this.router.navigate([''], {
      replaceUrl: true,
    });
  }

  // Handle search functionality
  onSearch(searchTerm: string) {
    // For now, just navigate home
    // we could implement actual search functionality here later
    this.router.navigate([''], {
      replaceUrl: true,
    });

    // If I want to implement actual search:
    // this.router.navigate(['/search'], { queryParams: { q: searchTerm } });
  }
}
