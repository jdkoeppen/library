/** LIBRARY CHALLENGE:
 
 * We will be building a simple app to track books in a library.
 
 * To practice working with related data sets, we will have a one data structure for our catalog of books, and a second data structure for tracking our inventory
 
 * We will have functions to add and remove books from the catalog, and check in and check books in and out.
 
 * ISBN numbers will be our unique IDs for our books, and we will pass around ISBNs instead of entire book objects when appropriate.
 
 * Read the instruction comments for each step and write the code for that step under the comments.
 
 * See `index.html` for notes on the overall features of the app rather than the specific implementation details listed here.
 
**/

/* 
  1. Make a global constant called CATALOG which is an array of book objects.
  
  Each book object should have keys for 'title', 'author', 'year', and 'ISBN' (the ISBN number is a unique identifier for a book). You should use strings to represent ISBN numbers because they can contain dashes.
  
  Populate it with a few books (at least three) to create a starting library.
*/
const CATALOG = [{
  Title: "Goodnight Moon",
  AuthorLastName: "Brown",
  AuthorFirstName: "Margaret Wise",
  Year: 1947,
  ISBN: "9780060775858",
}, {
  Title: "Where the Wild Things Are",
  AuthorLastName: "Sendak",
  AuthorFirstName: "Maurice",
  Year: 1963,
  ISBN: "9780099408390",
}, {
  Title: "If You Give a Mouse a Cookie",
  AuthorLastName: "Numeroff",
  AuthorFirstName: "Laura Joffe",
  Year: 1985,
  ISBN: "9780060245863",
}];

/*
  2. Make a global constant called INVENTORY which is an object whose keys are the ISBN numbers of the books in the CATALOG array.
  
  The value of each key in the INVENTORY object will be another object, which we will call the "numbers object", because it will contain the number of copies the library owns, as well as the number of copies which are checked out. 
  
  For instance, if I only had one book in my CATALOG, and its ISBN was '978-1847671943', my INVENTORY might look like this: 
  
    const INVENTORY = {
      '978-1847671943': { numberOfCopies: 3, numberCheckedOut: 0 }
    }
  
  Notice that I have to put my ISBN number in quotes because of the dash. This would also be true if I wanted to reference an INVENTORY numbers object directly like INVENTORY['978-1847671943']
*/

const INVENTORY = {
  "9780060775858": {
    numberOfCopies: 10,
    numberCheckedOut: 4
  },
  "9780099408390": {
    numberOfCopies: 15,
    numberCheckedOut: 12
  },
  "9780060245863": {
    numberOfCopies: 7,
    numberCheckedOut: 3
  },
}

/*
  3. Make a "describeBook" function which accepts a book object as its only argument and returns the HTML which represents that book in your list. 
  
  Your HTML should be semantic, and I would suggest an <li> with well formatted data inside. It will be up to you how to lay out each row for a book in the list: whether or not to separate the book data from th  e inventory numbers and the check in/out buttons.
  
  Keep in mind that you will have to display not only the data from the book you are passed, but also find the numbers object associated with its ISBN in the INVENTORY, in order to display the values for total copies and number checked out.
*/

function describeBook(book) {
  let stock = INVENTORY[book.ISBN];
  return `<tr><td><input type="checkbox" value= "${book.ISBN}"></td>
  <td>${book.ISBN}</td>
  <td class="title">${book.Title}</td>
  <td class="author">${book.AuthorLastName}, ${book.AuthorFirstName}</td>
  <td>${book.Year}</td>
  <td><strong>${stock.numberOfCopies - stock.numberCheckedOut}</td>
  <td>${stock.numberOfCopies}</strong></td></tr>`;
  console.log("describeBook ran");

}

/*
  4. Make a "renderBooks" function which draws your list of books to the page.
  
  Create a container in `index.html` to find with jQuery and populate with your list of books.
  
  Pass each book to your "describeBook" function and use its output as the HTML to add to the page.
*/

function renderBooks() {
  let bookItems = CATALOG.map(describeBook);
  $(".renderList").html(bookItems.join(''));
  console.log("renderBook ran")

}

/* 
  5. Make a function which runs in response to the document ready event.
  
  In this function, call renderBooks() to display the list of books.
  You may want to make this function at the end of your file, and use it to call more code which needs to run on document ready, such as the code to set up the event handlers you will later write.

*/

/* 
  6. Once you verify that your book list is displaying, now go to your `index.html` and build a form to add a new book. Make sure you add fields for all the relevant book data.
*/

/*
  7. Make a function called "addBook", which takes two arguments:
    1: a book object to add to the LIBRARY array
    2: the number of copies to add to the INVENTORY's numbers object for that book (the checked out number should default to 0)

  If the number of books is not specified, you should default to 1.
*/

function addBook(bookObject, number) {
  CATALOG.push(bookObject);
  let stock = {
    numberOfCopies: number,
    numberCheckedOut: 0,
  };
  INVENTORY[bookObject.ISBN] = stock;
  renderBooks();
};

/*
  8. Write code which gets called on document ready, setting up a handler for the form's submit event.
  
  On form submit, the form data should be read and put into a new object, which is passed to "addBook".
*/

function watchSubmit() {
  $("form").submit(function (event) {
    event.preventDefault();
    let num = $(this).find("#inputISBN").val();
    if (INVENTORY[num]) {
      alert("This book has already been added.");
    } else {
      addBook({
        Title: $(this).find("#inputTitle").val().trim(),
        Year: parseInt($(this).find("#inputYear").val(), 10),
        AuthorLastName: $(this).find("#inputAuthorLast").val().trim(),
        AuthorFirstName: $(this).find("#inputAuthorFirst").val().trim(),
        ISBN: $(this).find("#inputISBN").val().trim()
      }, $(this).find("#inputQty").val().trim());
      $(".inputBook form input").val("").blur();
    }
  });
}

/*
  9. Make a function called "removeBook", which takes one argument: the ISBN of the book to remove.
  
  It should find both the CATALOG array entry and the INVENTORY numbers object for the specified book, then delete them both.
  
  It should return true if the book was found and deleted, and false otherwise.
*/

function removeBook(ISBN) {
  let found = CATALOG.findIndex(book => book.ISBN === ISBN);
  if (found !== -1) CATALOG.splice(found, 1);
  delete INVENTORY[ISBN];
  return (found >= 0);
};

/*
  10. Write code to set up a click handler for the link or button which removes a book from the library. 
  
  Remember that you will need to use event delegation to allow deletion of objects which weren't there when the page loaded.
  
  You may put your event handler functions inline with the jQuery call like:
    $('.library').on('click', '.removeButton', function(event){ ... });
    
  Or define them separately like:
    function handleClick(event){ ... }
    $('.library').on('click', '.removeButton', handleClick);
    
  Just make sure the click event handlers are set up on document ready, as with the form submit handler.
*/

function watchChecks() {
  $("input:checkbox").click(function (event) {
    console.log("check");
    return $("span button").prop('disabled', $('input:checkbox:checked').length == 0);
  })
}

function clickDelete() {
  $("#delete").click(function (event) {
    event.preventDefault();
    $("input:checkbox:checked").each(function () {
      removeBook($(this).val());
      renderBooks();
    });
  });
}

/*
  11. Make functions called "checkOut" and "checkIn" which accept the ISBN as their only argument.
  
  They should increase or decrease the number of checked out copies in the INVENTORY numbers object for the specified book ISBN.
  
  You can also, optionally, add a second argument of the number of copies to check out or in at once if you want to be able to process more than one book at a time.
  
  Also add the proper event handlers to call these functions when users click on whatever links or buttons you choose to make for checking in and out books.
*/
function clickCheckOut() {
  $("#checkOut").click(function (event) {
    event.preventDefault();
    $("input:checkbox:checked").each(function () {
      checkOut($(this).val());
      renderBooks();
    });
  });
}

function clickCheckIn() {
  $("#checkIn").click(function (event) {
    event.preventDefault();
    $("input:checkbox:checked").each(function () {
      checkIn($(this).val());
      renderBooks();
    });
  });
}

function checkOut(ISBN) {
  let found = CATALOG.findIndex(book => book.ISBN === ISBN);
    if(found !== -1) INVENTORY[ISBN].numberCheckedOut++;
      renderBooks();  
}

function checkIn(ISBN) {
  let found = CATALOG.findIndex(book => book.ISBN === ISBN);
  if (found !== -1) INVENTORY[ISBN].numberCheckedOut--;
    renderBooks();
}

/* 
  12. Add similar functions "addCopy" and "removeCopy" which accept an ISBN and increase or decrease the number of that book in the INVENTORY. 

  If a book's inventory is reduced to 0, then it should not be available for check out, but it should also not be deleted completely by removeBook().
*/



/* 
  13. STRETCH GOAL (good prep for the fundamentals exam "data merge" challenge)
  
  Write a function called "generateReport" which will combine the data from both CATALOG and INVENTORY such that every book in the CATALOG also has the keys from the INVENTORY numbers object corresponding to that book's ISBN number.
  
  "generateReport" should return an array of objects, which each have all the following keys: 'title', 'author', 'year', 'ISBN', 'numberOfCopies', and 'numberCheckedOut'
*/

/* ALL DONE! 

  If you'd like to see my solution for this challenge, click here, but only after you've tried for a while: 
    https://repl.it/@victorb/Library-Solution

*/

function renderLibrary() {
  watchSubmit();
  renderBooks();
  watchChecks();
  clickDelete();
  clickCheckOut();
  clickCheckIn();
}

$(renderLibrary);