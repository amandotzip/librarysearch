import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { NgFor } from '@angular/common'; // Import NgFor directive
import { HttpParams } from '@angular/common/http';

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
  searchBooksServiceUrl: string = 'https://librarysearch.onrender.com/search';
  localTestingServiceUrl: string = 'http://localhost:4000/search';
  serviceUrl: string = '';
  currentPage: number = 1;

  constructor(private http: HttpClient) { }

  onBookClick(book: any) {
    console.log(book);
    window.open(this.generateLink(book), '_blank');
  }

  process_strings_for_url(str1: string, str2: string) {
      console.log(str1);
      // console.log(str1.replaceAll(' ', '+'));
      console.log(str2);
  
      return str1.replaceAll(' ', '+') + '+' + str2.replaceAll(' ', '+');
  }
  //makes a goodreads search link
  private generateLink(book: any) {
    this.goodReadsBaseUrl = 'https://www.goodreads.com/search?q=';
    this.goodReadsArgs = this.process_strings_for_url(book.title, book.author);
    console.log(this.goodReadsArgs);
    this.goodReadsResultUrl = this.goodReadsBaseUrl + this.goodReadsArgs;
    console.log(this.goodReadsResultUrl);
    return `<a href="${this.goodReadsResultUrl}">Open in Goodreads</a>`;
    // return this.goodReadsResultUrl;
  }
  searchBooksEndpoint(page: number = 1) {
    console.debug('Searching books');
    //use local testing url when debugging
    if (this.localTesting){
      this.serviceUrl = this.localTestingServiceUrl;
    } else {
      this.serviceUrl = this.searchBooksServiceUrl;
    }
    let params = new HttpParams();
    params = params.append('page', page.toString());
    console.log(this.serviceUrl);
    this.http.get(this.serviceUrl , { params: params })
      .subscribe(response => {
        console.log(response);
        this.searchResults = (response as any);
        console.log('search results');
        console.log(this.searchResults);
      });
  }


  loadMoreResults(){
    this.currentPage++;
    this.searchBooksEndpoint(this.currentPage);
  }
}
