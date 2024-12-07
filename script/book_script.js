document.getElementById("searchButton").addEventListener("click", function () {
  const bookInput = document.getElementById("bookInput").value.trim();
  if (!bookInput) {
    alert("Please enter a book name.");
    return;
  }

  const query = encodeURIComponent(bookInput);
  const searchUrl = `https://openlibrary.org/search.json?q=${query}`;

  fetch(searchUrl)
    .then((response) => response.json())
    .then((data) => {
      const firstBook = data.docs[0];
      if (!firstBook) {
        alert("No results found. Try another book.");
        return;
      }

      const bookTitle = firstBook.title || "Unknown Title";

      const isbn = firstBook.isbn ? firstBook.isbn[0] : null;

      if (!isbn) {
        alert("No cover image available for this book.");
        return;
      }

      // Store data in localStorage to access on the results page
      localStorage.setItem("bookTitle", bookTitle);
      localStorage.setItem("authorName", authorName);
      localStorage.setItem("isbn", isbn);

      // Redirect to the results page
      window.location.href = "results.html";
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("An error occurred while fetching data.");
    });
});
