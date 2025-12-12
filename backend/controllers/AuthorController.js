/**
 * Author Controller - Xử lý các API liên quan đến tác giả
 * Sử dụng MVC pattern với Views để format responses
 */

const Author = require('../models/Author');
const { AuthorView, BookView } = require('../views');

// Lấy tất cả tác giả
const getAllAuthors = async (req, res) => {
  try {
    console.log(' ===========================================');
    console.log(' Bắt đầu lấy danh sách tác giả...');
    console.log(' Thời gian:', new Date().toISOString());
    console.log(' Request từ:', req.ip);
    console.log(' User-Agent:', req.get('User-Agent'));
    
    const authors = await Author.getAll();
    
    console.log(' Lấy được', authors.length, 'tác giả');
    console.log(' Danh sách tác giả:');
    authors.forEach((author, index) => {
      console.log(`   ${index + 1}. ID: ${author.author_id} - Tên: ${author.name}`);
    });
    console.log(' ===========================================');
    
    const response = AuthorView.list(authors);
    res.json(response);
  } catch (error) {
    console.error('[AuthorController] Lỗi khi lấy danh sách tác giả:', error);
    console.error('[AuthorController] Error details:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    const { response, statusCode } = AuthorView.error('Lỗi máy chủ khi lấy danh sách tác giả', 500, error.message);
    res.status(statusCode).json(response);
  }
};

// Lấy thông tin chi tiết tác giả
const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(' ===========================================');
    console.log(' Lấy thông tin tác giả ID:', id);
    console.log(' Thời gian:', new Date().toISOString());
    console.log(' Request từ:', req.ip);
    console.log(' User-Agent:', req.get('User-Agent'));
    
    const author = await Author.getById(id);
    
    if (!author) {
      console.log(' Không tìm thấy tác giả với ID:', id);
      const { response, statusCode } = AuthorView.notFound('Tác giả');
      return res.status(statusCode).json(response);
    }
    
    console.log(' Tìm thấy tác giả:', author.name);
    console.log(' Bắt đầu lấy danh sách sách...');
    
    // Lấy danh sách sách của tác giả
    const books = await Author.getBooksByAuthorId(id);
    const formattedAuthor = AuthorView.formatAuthor(author);
    formattedAuthor.books = BookView.formatBooks(books);
    
    console.log(' Lấy được', books.length, 'cuốn sách của tác giả');
    console.log(' Danh sách sách:');
    books.forEach((book, index) => {
      console.log(`   ${index + 1}. ID: ${book.book_id} - Tên: ${book.title} - Giá: ${book.price}đ`);
    });
    console.log('===========================================');
    
    const response = AuthorView.success(formattedAuthor);
    res.json(response);
  } catch (error) {
    console.error('[AuthorController] Lỗi khi lấy thông tin tác giả:', error);
    console.error('[AuthorController] Error details:', {
      message: error.message,
      stack: error.stack,
      authorId: req.params.id,
      timestamp: new Date().toISOString()
    });
    const { response, statusCode } = AuthorView.error('Lỗi máy chủ khi lấy thông tin tác giả', 500, error.message);
    res.status(statusCode).json(response);
  }
};

module.exports = {
  getAllAuthors,
  getAuthorById
};
