document.addEventListener("DOMContentLoaded", function () {
  const bookTitle = localStorage.getItem("bookTitle");
  const authorName = localStorage.getItem("authorName");
  const isbn = localStorage.getItem("isbn");

  fetchBookData(bookTitle, isbn);
  fetchAuthorInfo(authorName);
  fetchBookDescription(bookTitle);

  async function fetchBookData(bookTitle, isbn) {
    const spinner = document.getElementById("spinner");
    const bookCoverElement = document.getElementById("bookCover");
    const placeholderImageUrl = "https://via.placeholder.com/150";

    try {
      // Simulate an API call delay
      const coverImageUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
      const bookTitleElement = document.querySelector(".BookTitle");

      // Update book title
      bookTitleElement.innerText = bookTitle || "Fetching book details...";

      // Set a temporary loading state for the book cover
      bookCoverElement.src = placeholderImageUrl;

      // Fetch and validate the image asynchronously
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

  // If authorName is found, set the parameters as follows
  async function fetchAuthorInfo(authorName) {
    if (!authorName) return;

    const wikiUrl = "https://en.wikipedia.org/w/api.php";
    const wikiParams = {
      action: "query",
      format: "json",
      origin: "*",
      prop: "extracts|pageimages", // Added "pageimages" to fetch images
      exintro: true, // Extract Intro
      piprop: "original", // Get the original image URL
      titles: authorName,
    };

    const queryUrl = `${wikiUrl}?${new URLSearchParams(wikiParams).toString()}`;
    const authorInfoElement = document.querySelector(".authorInfo");

    try {
      // Fetch the author information
      const response = await fetch(queryUrl);
      const data = await response.json();

      const pages = data.query?.pages || {};
      const firstPage = Object.values(pages)[0]; // Extract the first page
      const authorWikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
        authorName
      )}`; // Build the Wikipedia URL

      if (firstPage) {
        const authorImageUrl = firstPage.original?.source; // Check for the author's image URL

        // Display the author information and image
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
        authorInfoElement.innerHTML = `
              <p>No detailed information found for ${authorName}.</p>
            `;
      }
    } catch (error) {
      console.error("Error fetching author details from Wikipedia:", error);
      authorInfoElement.innerHTML = `
          <p>Error fetching information about ${authorName}.</p>
        `;
    }
  }
  async function fetchBookDescription(bookTitle) {
    if (!bookTitle) return;

    const worksUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      bookTitle
    )}`;
    const descriptionContainer = document.querySelector(".bookSummary");

    try {
      // Fetch the works data
      const worksResponse = await fetch(worksUrl);
      const worksData = await worksResponse.json();

      const firstBook = worksData.docs[0];
      if (!firstBook || !firstBook.key) {
        throw new Error("No works found for this book.");
      }

      const workKey = firstBook.key; // Extract the work key
      const workDetailsUrl = `https://openlibrary.org${workKey}.json`;

      // Fetch the work details
      const workDetailsResponse = await fetch(workDetailsUrl);
      const workData = await workDetailsResponse.json();

      // Handle description
      if (workData.description) {
        let descriptionText;

        if (typeof workData.description === "string") {
          // If description is a text string
          descriptionText = workData.description;
        } else if (
          typeof workData.description === "object" &&
          workData.description.value
        ) {
          // If description is an object with a "value" key
          descriptionText = workData.description.value;
        } else {
          // Default fallback if no description is available
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
