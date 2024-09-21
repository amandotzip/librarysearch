from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import requests
import re
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

def process_strings_for_url(str1, str2):
    return str1.replace(' ', '+') + '+' + str2.replace(' ', '+')

def open_library_search(search_term):
    url = f"https://openlibrary.org/search.json?q={search_term}"
    response = requests.get(url)
    data = response.json()
    return data

@app.route('/goodreadssearch', methods=['GET'])
def goodreads_search():
    book_title = request.args.get('title')
    book_author = request.args.get('author')
    if not book_title:
        return jsonify({"error": "Book title is required"}), 400
    baseUrl = 'https://www.goodreads.com/search?q='
    args = process_strings_for_url(book_title, book_author)
    url = baseUrl + args

    print(url)
    response = requests.get(url)
    flask_response = make_response(response.content)
    flask_response.headers['Access-Control-Allow-Origin'] = '*'
    return flask_response

    # if response.status_code == 200:
    #     print('goodreads success')
    #     # soup = BeautifulSoup(response.content, 'html.parser')
    #     # results = soup.find_all('a', {'class': 'bookTitle'})
    # return response

def reverse_author_name(author_name):
    names = author_name.split(', ')
    return ' '.join(reversed(names))

@app.route('/search', methods=['GET'])
def search_books():
    # book_title = request.args.get('title')
    # if not book_title:
    #     return jsonify({"error": "Book title is required"}), 400
    
    root_url = 'https://mcpl.aspendiscovery.org/Search/Results?join=AND&bool0%5B%5D=OR'
    favorite_authors = ['Stephen King','Ray Bradbury']
    search_arguments = ''
    for author in favorite_authors:
        cleaned_author = author.lower().replace(' ', '+')

        search_arguments += f'&lookfor0%5B%5D={cleaned_author}&type0%5B%5D=Author'
    books_only_argument = '&filter%5B%5D=format_category%3A%22Books%22'
    location = '&filter[]=available_at:%22Wheaton%22'

    result_url = root_url + search_arguments + books_only_argument + location
    print(result_url)
    # search_url = f"https://mcpl.aspendiscovery.org/Union/Search?view=list&lookfor={book_title}&filter[]=format_category%3A\"Books\""
    response = requests.get(result_url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Parse the book details
    books = []
    book_items = soup.find_all(class_=re.compile(r'result\s+(?:alt\s+)?record\d+')) #use regex for record numbers in website
    for book in book_items:
        # title = book.find('h2', class_='title').text
        # title = soup.find('a', class_='result-title notranslate')
        title = book.find('a', class_='result-title notranslate').text
        # title = soup.find('a', class_='result-title notranslate').text
        # print(title)  # Output: The_hobbit__or__There_and_back_again
        
        author_soup = book.find('div', class_='result-value').find('a')
        author = ''
        if author_soup is not None: #some books don't have a single main author (collections)
            author = author_soup.text
        # print(author)  # Output: The_hobbit__or__There_and_back_again

        # open_library_search_results = open_library_search(title)
        # print(open_library_search_results)
        # author = open_library_search_results['docs'][00]['author_name']
        # availability = book.find('span', class_='availability').text
        author = reverse_author_name(author)
        title = title.removesuffix(': a novel') #mcpl adds this but it isnt anywhere else like goodreads

        books.append({"title": title, "author": author})
        # print(books)
    
    return jsonify(books)




if __name__ == '__main__':
    app.run(debug=True)