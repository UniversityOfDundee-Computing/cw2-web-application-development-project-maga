document.addEventListener("DOMContentLoaded", function () {
  const bookTitle = localStorage.getItem("bookTitle");
  const authorName = localStorage.getItem("authorName");
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

  // If authorName is found, set the paramaters as follows
  if (authorName) {
    const wikiUrl = "https://en.wikipedia.org/w/api.php"
    document.querySelector(".authorName").innerHTML = authorName;
    const wikiParams = {
      action: "query",
      format: "json",
      origin: "*",
      prop: "extracts",
      exintro: true,  //Extract Intro
      titles: authorName,
  };

  const queryUrl = wikiUrl + "?" + new URLSearchParams(wikiParams).toString();
  fetch(queryUrl)
    .then((response) => response.json())
    .then((data) => {
      const pages = data.query?.pages || {};
      const firstPage = Object.values(pages)[0]; // Extract the first page
      if (firstPage && firstPage.extract) {
        // Display the first paragraph
        document.querySelector(".authorInfo").innerHTML = `
          <h3>About the Author: ${authorName}</h3>
          <p>${firstPage.extract}</p>
        `;
      } else {
        document.querySelector(".authorInfo").innerHTML = `
          <p>No detailed information found for ${authorName}.</p>
        `;
      }
    })
    .catch((error) => {
      console.error("Error fetching author details from Wikipedia:", error);
      document.querySelector(".authorInfo").innerHTML = `
        <p>Error fetching information about ${authorName}.</p>
      `;
    });
};
});
