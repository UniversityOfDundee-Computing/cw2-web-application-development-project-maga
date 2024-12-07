document.addEventListener("DOMContentLoaded", function () {
  const bookTitle = localStorage.getItem("bookTitle");
  const isbn = localStorage.getItem("isbn");

  if (bookTitle && isbn) {
    // Update the book title
    document.querySelector(".BookTitle").innerText = bookTitle;

    // Update the book cover image using the ISBN
    const coverImageUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    document.getElementById("bookCover").src = coverImageUrl;
  } else {
    document.querySelector(".BookTitle").innerText = "No data found.";
    document.getElementById("bookCover").style.display = "none";
  }
});
