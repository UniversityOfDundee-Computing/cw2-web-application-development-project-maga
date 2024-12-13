document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("searchButton");

  if (searchButton) {
    searchButton.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent form submission

      const bookInput = document.getElementById("bookInput").value.trim();
      if (!bookInput) {
        alert("Please enter a book name.");
        return;
      }
      fetchBookDetails(bookInput);
    });
  }

  const bookTitle = localStorage.getItem("bookTitle");
  const authorName = localStorage.getItem("authorName");
  const isbn = localStorage.getItem("isbn");

  if (bookTitle && isbn) fetchBookData(bookTitle, isbn);
  if (authorName) fetchAuthorInfo(authorName);
  if (bookTitle) fetchBookDescription(bookTitle);

  function fetchBookDetails(bookInput) {
    const query = bookInput.replace(/\s+/g, "+"); // Replace spaces with '+'
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
        const authorName = firstBook.author_name
          ? firstBook.author_name[0]
          : "Unknown Author";
        const isbn = firstBook.isbn ? firstBook.isbn[0] : null;

        if (!isbn) {
          alert("No cover image available for this book.");
          return;
        }

        localStorage.setItem("bookTitle", bookTitle);
        localStorage.setItem("authorName", authorName);
        localStorage.setItem("isbn", isbn);

        window.location.href = "results.html";
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching data.");
      });
  }

  async function fetchBookData(bookTitle, isbn) {
    const spinner = document.getElementById("spinner");
    const bookCoverElement = document.getElementById("bookCover");
    const placeholderImageUrl = "https://via.placeholder.com/150";

    try {
      const coverImageUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
      const bookTitleElement = document.querySelector(".BookTitle");

      bookTitleElement.innerText = bookTitle || "Fetching book details...";
      bookCoverElement.src = placeholderImageUrl;

      await new Promise((resolve) => {
        const tempImage = new Image();
        tempImage.src = coverImageUrl;
        tempImage.onload = () => {
          if (tempImage.naturalWidth < 100 || tempImage.naturalHeight < 150) {
            bookCoverElement.src = placeholderImageUrl;
          } else {
            bookCoverElement.src = coverImageUrl;
          }
          resolve();
        };
        tempImage.onerror = () => {
          bookCoverElement.src = placeholderImageUrl;
          resolve();
        };
      });
    } catch (error) {
      console.error("Error fetching book data:", error);
      document.querySelector(".BookTitle").innerText = "No data found.";
      bookCoverElement.src = placeholderImageUrl;
    }
  }

  async function fetchAuthorInfo(authorName) {
    const wikiUrl = "https://en.wikipedia.org/w/api.php";
    const wikiParams = {
      action: "query",
      format: "json",
      origin: "*",
      prop: "extracts|pageimages",
      exintro: true,
      piprop: "original",
      titles: authorName,
    };

    const queryUrl = `${wikiUrl}?${new URLSearchParams(wikiParams).toString()}`;
    const authorInfoElement = document.querySelector(".authorInfo");

    try {
      const response = await fetch(queryUrl);
      const data = await response.json();

      const pages = data.query?.pages || {};
      const firstPage = Object.values(pages)[0];
      const authorWikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
        authorName
      )}`;

      if (firstPage) {
        const authorImageUrl = firstPage.original?.source;

        authorInfoElement.innerHTML = `
          <div style="text-align: center;">
          ${
            authorImageUrl
              ? `<img src="${authorImageUrl}" alt="${authorName}'s photo" style="max-width: 200px; border-radius: 10px;">`
              : `<p>No image available for ${authorName}.</p>`
          }
          </div>
          <h3>About the Author: ${authorName}</h3>
          ${firstPage.extract ? `<p>${firstPage.extract}</p>` : ""}
          <p><a href="${authorWikiUrl}" target="_blank">Learn more on Wikipedia</a></p>
        `;
      } else {
        authorInfoElement.innerHTML = `<p>No detailed information found for ${authorName}.</p>`;
      }
    } catch (error) {
      console.error("Error fetching author details from Wikipedia:", error);
      authorInfoElement.innerHTML = `<p>Error fetching information about ${authorName}.</p>`;
    }
  }

  async function fetchBookDescription(bookTitle) {
    const worksUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      bookTitle
    )}`;
    const descriptionContainer = document.querySelector(".bookDescription");

    try {
      const worksResponse = await fetch(worksUrl);
      const worksData = await worksResponse.json();

      const firstBook = worksData.docs[0];
      if (!firstBook || !firstBook.key) {
        throw new Error("No works found for this book.");
      }

      const workKey = firstBook.key;
      const workDetailsUrl = `https://openlibrary.org${workKey}.json`;

      const workDetailsResponse = await fetch(workDetailsUrl);
      const workData = await workDetailsResponse.json();

      if (workData.description) {
        let descriptionText;

        if (typeof workData.description === "string") {
          descriptionText = workData.description;
        } else if (
          typeof workData.description === "object" &&
          workData.description.value
        ) {
          descriptionText = workData.description.value;
        } else {
          descriptionText = "No description available for this book.";
        }

        descriptionContainer.innerHTML = `<h3>Book Excerpt</h3><p>${descriptionText}</p>`;
      } else {
        descriptionContainer.innerHTML =
          "<p>No description available for this book.</p>";
      }
    } catch (error) {
      console.error("Error fetching description:", error);
      descriptionContainer.innerHTML =
        "<p>Error fetching description for this book.</p>";
    }
  }
});
