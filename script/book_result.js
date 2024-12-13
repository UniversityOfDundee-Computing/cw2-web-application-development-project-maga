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

  fetchAuthorInfo(authorName);
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
});
