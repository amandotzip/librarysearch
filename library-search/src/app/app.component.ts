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

  constructor(private http: HttpClient) { }

  stringifyJson(obj: any): string {
    return JSON.stringify(obj);
  }

onBookClick(book: any) {
  console.log(book);
  

}

  searchBooksEndpoint() {
    console.debug('Searching books');

    this.http.get('http://localhost:5000/search')
      .subscribe(response => {
        console.log(response);
        this.searchResults = (response as any);
        console.log('search results');
        console.log(this.searchResults);
        // const bookButtons = document.getElementById('book-buttons');
        // if(bookButtons){
          
        //   bookButtons.innerHTML = '';
          
        //   (response as any).data.forEach(book => {
        //     const button = document.createElement('button');
        //     button.textContent = book.title;
        //     bookButtons.appendChild(button);
        //   });
        // }

      });
  }
}
