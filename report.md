### Application Idea

This application is a web-based book search application that allows users to enter a book title and receive comprehensive details about the book and its author. The application integrates four different APIs to retrieve and display relevant data, providing a seamless and informative experience for users.

When a user enters a book title, the application performs the following steps:

1. **Open Library Book Search API**: This API is used to search for the book by its title. It returns the book's title, author name, and ISBN.
2. **Open Library Covers API**: The ISBN retrieved from the first API call is then used to fetch the book's cover image.
3. **Open Library Works API**: The book title is passed to this API to obtain book description.
4. **Wikipedia API**: The author’s name is sent to the Wikipedia API to retrieve biographical details and other relevant information about the author.

The combined data from these four APIs (book title, author bio, cover image, description/excerpts) is then displayed on the user interface, creating a comprehensive and dynamic view of the book and its author.

**APIs Used:**

- **Open Library Book Search**: [https://openlibrary.org/search.json?q=${query}](https://openlibrary.org/search.json?q=${query})
- **Open Library Covers API**: [https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg](https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg)
- **Wikipedia API**: [https://en.wikipedia.org/w/api.php](https://en.wikipedia.org/w/api.php)
- **Open Library Works API**: [https://openlibrary.org/search.json?q=${encodeURIComponent(bookTitle)}](<https://openlibrary.org/search.json?q=${encodeURIComponent(bookTitle)}>)

This application efficiently gathers and displays a wealth of information, making it an invaluable tool for book enthusiasts, researchers, and casual readers alike.

![alt text](<API Workflow.jpg>)

## Video Demonstration

[Click here to watch the video](https://drive.google.com/file/d/1tAVTRPBwp1rm-luSx0zDx4-YsS3_VXxT/view?usp=drive_link)

https://drive.google.com/file/d/1tAVTRPBwp1rm-luSx0zDx4-YsS3_VXxT/view?usp=sharing
