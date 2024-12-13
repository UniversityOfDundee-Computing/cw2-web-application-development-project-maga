document
  .getElementById("searchButton")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission

    const bookInput = document.getElementById("bookInput").value.trim();
    if (!bookInput) {
      alert("Please enter a book name.");
      return;
    }

    const query = bookInput.replace(/\s+/g, "+"); // Replace spaces with '+'
    const searchUrl = `https://openlibrary.org/search.json?q=${query}`;

    // Fetch data from the search URL
    fetch(searchUrl)
      .then((response) => {
        // Convert the response to JSON format
        return response.json();
      })
      .then((data) => {
        // Get the first book from the search results
        const firstBook = data.docs[0];

        // If no book is found, display an alert and stop further execution
        if (!firstBook) {
          alert("No results found. Try another book.");
          return;
        }

        // Extract the book title or use a default value if not available
        const bookTitle = firstBook.title || "Unknown Title";

        // Extract the author's name or use a default value if not available
        const authorName = firstBook.author_name
          ? firstBook.author_name[0]
          : "Unknown Author";
        console.log(authorName);

        // Extract the first ISBN or set to null if not available
        const isbn = firstBook.isbn ? firstBook.isbn[0] : null;

        // If ISBN is not available, alert the user and stop execution
        if (!isbn) {
          alert("No cover image available for this book.");
          return;
        }

        // Save the extracted data in localStorage for use on the results page
        localStorage.setItem("bookTitle", bookTitle);
        localStorage.setItem("authorName", authorName);
        localStorage.setItem("isbn", isbn);

        // Redirect to the results page
        window.location.href = "results.html";
      })
      .catch((error) => {
        // Handle any errors that occur during the fetch operation
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching data.");
      });
  });
