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
    const wikiUrl = "https://en.wikipedia.org/w/api.php";
    const wikiParams = {
      action: "query",
      format: "json",
      origin: "*",
      prop: "extracts",
      exintro: true, //Extract Intro
      titles: authorName,
    };

    const queryUrl = wikiUrl + "?" + new URLSearchParams(wikiParams).toString();
    fetch(queryUrl)
      .then((response) => response.json())
      .then((data) => {
        const pages = data.query?.pages || {};
        const firstPage = Object.values(pages)[0]; // Extract the first page
        const authorWikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
          authorName
        )}`; // Extract the URL to display
        if (firstPage && firstPage.extract) {
          // Display the first paragraph
          document.querySelector(".authorInfo").innerHTML = `
          <h3>About the Author: ${authorName}</h3>
          <p>${firstPage.extract}</p>
          <p><a href="${authorWikiUrl}" target="_blank">Learn more on Wikipedia</a></p>
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
  }
  async function fetchBookDescription(bookTitle) {
    if (!bookTitle) return;

    const worksUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      bookTitle
    )}`;
    const descriptionContainer = document.querySelector(".bookDescription");

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
