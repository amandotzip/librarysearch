import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common'; // Import NgFor directive

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'library-search';
  searchResults: any[] = [];
  goodReadsBaseUrl: string = '';
  goodReadsArgs: string = '';
  goodReadsResultUrl: string = '';
  localTesting: boolean = false;
  searchBooksServiceUrl: string = '';
  localTestingServiceUrl: string = 'http://localhost:5000/search';

  constructor(private http: HttpClient) { }

  onBookClick(book: any) {
    console.log(book);
    window.open(this.generateLink(book), '_blank');
  }

  process_strings_for_url(str1: string, str2: string) {
      return str1.replace(' ', '+') + '+' + str2.replace(' ', '+');
  }
  //makes a goodreads search link
  private generateLink(book: any) {
    this.goodReadsBaseUrl = 'https://www.goodreads.com/search?q=';
    this.goodReadsArgs = this.process_strings_for_url(book.title, book.author);
    this.goodReadsResultUrl = this.goodReadsBaseUrl + this.goodReadsArgs;
    return this.goodReadsResultUrl;
  }
  searchBooksEndpoint() {
    console.debug('Searching books');

    this.localTesting = false;

    if (this.localTesting){

    }
    this.http.get('http://localhost:5000/search')
      .subscribe(response => {
        console.log(response);
        this.searchResults = (response as any);
        console.log('search results');
        console.log(this.searchResults);
      });
  }
}
