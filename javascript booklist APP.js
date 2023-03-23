//book class:represent a book
class Book {
    constructor(title, author, isbn){
        this.title=title;
        this.author=author;
        this.isbn=isbn;

    }
}


//ui class: handle ui tasks
class UI{
    static displayBooks(){
        const books=Store.getBooks();

        books.forEach((book) => UI.addBookTOList(book));
    }
    static addBookTOList(book){
        const list=document.querySelector('#book-list');
        const row=document.createElement('tr');

        row.innerHTML=`
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class="btn btn-danger btn-sm delete">x</a></td>
        `;
        list.appendChild(row);
    }
    //remove data when delete button is clicked
    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();

        }
    }
    //to show alert in the body when there is empty field
    static showAlert(message, className){
        const div=document.createElement('div');
        div.className=`alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container=document.querySelector('.container');
        const form =document.querySelector('#book-form');
        container.insertBefore(div, form);
        //vanish in 3 second
        setTimeout(()=>document.querySelector('.alert').remove(),2000);
    }

    //to remove value from input fields after add book button is clicked
    static clearFields() {
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';
    }
}
//store class:handle storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books=[];
        }else{
            books=JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        const books =Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books =Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn===isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books',JSON.stringify(books));
    }
}

//Events: display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//events: Add a book
document.querySelector('#book-form').addEventListener('submit',(e)=>
{
    //prevent actual submit
    e.preventDefault(); 

    //get form values
    const title=document.querySelector('#title').value;
    const author=document.querySelector('#author').value;
    const isbn=document.querySelector('#isbn').value;

    //validate
    if(title==='' || author==='' ||isbn===''){
        UI.showAlert('please fill all the fields','danger');
    }else{
      //instiate book
    const book=new Book(title, author, isbn);

    //add book to UI
    UI.addBookTOList(book);

    //add book to store
    Store.addBook(book);

    //show success message
    UI.showAlert('Book Added','success');


    //Clearfields
    //to remove value from input fields after add book button is clicked
    UI.clearFields();}

});
//Event :Remove a Book
//remove data when delete button is clicked
document.querySelector('#book-list').addEventListener('click',(e)=>{
    //remove book from UI
    UI.deleteBook(e.target);
    
    //remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show success message
    UI.showAlert('Book Removed','success');
});