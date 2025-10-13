/**
 * Author Controller - Xử lý các API liên quan đến tác giả
 */

const Author = require('../models/Author');

// Lấy tất cả tác giả
const getAllAuthors = async (req, res) => {
  try {
    console.log('🔍 [AuthorController] ===========================================');
    console.log('📋 [AuthorController] Bắt đầu lấy danh sách tác giả...');
    console.log('⏰ [AuthorController] Thời gian:', new Date().toISOString());
    console.log('🌐 [AuthorController] Request từ:', req.ip);
    console.log('📡 [AuthorController] User-Agent:', req.get('User-Agent'));
    
    const authors = await Author.getAll();
    
    console.log('✅ [AuthorController] Lấy được', authors.length, 'tác giả');
    console.log('📊 [AuthorController] Danh sách tác giả:');
    authors.forEach((author, index) => {
      console.log(`   ${index + 1}. ID: ${author.author_id} - Tên: ${author.name}`);
    });
    console.log('🔍 [AuthorController] ===========================================');
    
    res.json({ success: true, data: authors });
  } catch (error) {
    console.error('💥 [AuthorController] Lỗi khi lấy danh sách tác giả:', error);
    console.error('📋 [AuthorController] Error details:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi máy chủ khi lấy danh sách tác giả',
      error: error.message 
    });
  }
};

// Lấy thông tin chi tiết tác giả
const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔍 [AuthorController] ===========================================');
    console.log('📋 [AuthorController] Lấy thông tin tác giả ID:', id);
    console.log('⏰ [AuthorController] Thời gian:', new Date().toISOString());
    console.log('🌐 [AuthorController] Request từ:', req.ip);
    console.log('📡 [AuthorController] User-Agent:', req.get('User-Agent'));
    
    const author = await Author.getById(id);
    
    if (!author) {
      console.log('❌ [AuthorController] Không tìm thấy tác giả với ID:', id);
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy tác giả' 
      });
    }
    
    console.log('✅ [AuthorController] Tìm thấy tác giả:', author.name);
    console.log('📖 [AuthorController] Bắt đầu lấy danh sách sách...');
    
    // Lấy danh sách sách của tác giả
    const books = await Author.getBooksByAuthorId(id);
    author.books = books;
    
    console.log('📚 [AuthorController] Lấy được', books.length, 'cuốn sách của tác giả');
    console.log('📊 [AuthorController] Danh sách sách:');
    books.forEach((book, index) => {
      console.log(`   ${index + 1}. ID: ${book.book_id} - Tên: ${book.title} - Giá: ${book.price}đ`);
    });
    console.log('🔍 [AuthorController] ===========================================');
    
    res.json({ 
      success: true, 
      data: author 
    });
  } catch (error) {
    console.error('💥 [AuthorController] Lỗi khi lấy thông tin tác giả:', error);
    console.error('📋 [AuthorController] Error details:', {
      message: error.message,
      stack: error.stack,
      authorId: req.params.id,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi máy chủ khi lấy thông tin tác giả' 
    });
  }
};

module.exports = {
  getAllAuthors,
  getAuthorById
};
