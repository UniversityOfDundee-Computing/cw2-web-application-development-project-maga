# Bookify

### Who wrote this?

We will be creating a website that takes the name of a book and returns publication information from Open Library. The application will then pass this information to a Wikipedia API that will return information about the author. The book information will also be passed to get boo excerpt from open library :

[Wiki API Documentation](https://www.mediawiki.org/wiki/API:Main_page)  
[Open Library API Documentation](https://openlibrary.org/developers/api)  
[Book Description API](https://openlibrary.org/dev/docs/api/books)

## How the application works

![alt text](<API Workflow.jpg>)

1. User enters book title or words that contains book title -> Search Request to Open Library API
2. Open Library API returns book details (title, author, ISBN)
3. Author's name sent to Wikipedia API for bio and notable works
4. Book title sent to Open Library Work API for detailed excerpts
5. ISBN sent to Open Library Cover API for book cover image
6. All data is displayed on the web interface

## Video Demonstration

[Click here to watch the video](https://drive.google.com/file/d/1tAVTRPBwp1rm-luSx0zDx4-YsS3_VXxT/view?usp=drive_link)

https://drive.google.com/file/d/1tAVTRPBwp1rm-luSx0zDx4-YsS3_VXxT/view?usp=sharing
