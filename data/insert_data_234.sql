USE smart_book;
INSERT INTO categories (name, description, parent_category_id, slug) VALUES
-- Cấp 1
('Sách truyện', 'Tất cả sách truyện các thể loại', NULL, 'sach-truyen'),
('Sách ngoại văn', 'Sách tiếng Anh & ngoại văn', NULL, 'sach-ngoai-van'),
('Sách Sale theo chủ đề', 'Danh mục sách đang giảm giá', NULL, 'sach-sale-theo-chu-de'),
('Sách theo tác giả', 'Danh mục sách theo tác giả', NULL, 'sach-theo-tac-gia'),
('Sách theo nhà cung cấp', 'Danh mục sách theo nhà phát hành / NXB', NULL, 'sach-theo-nha-cung-cap'),
('Văn phòng phẩm', 'Dụng cụ văn phòng, học tập', NULL, 'van-phong-pham'),
('Quà tặng', 'Quà lưu niệm, thiệp, đồ handmade', NULL, 'qua-tang'),
('Đồ chơi', 'Đồ chơi trẻ em', NULL, 'do-choi'),

-- Cấp 2 của "Sách truyện"
('Sách Văn Học', 'Văn học trong và ngoài nước', 1, 'sach-van-hoc'),
('Truyện Ngắn - Tản Văn', 'Truyện ngắn, tản văn', 9, 'truyen-ngan-tan-van'),
('Tiểu thuyết', 'Tiểu thuyết các thể loại', 9, 'tieu-thuyet'),
('Tác phẩm kinh điển', 'Tác phẩm văn học kinh điển', 9, 'tac-pham-kinh-dien'),
('Truyện Ngôn Tình', 'Truyện ngôn tình lãng mạn', 9, 'truyen-ngon-tinh'),

('Sách Thường Thức - Đời Sống', 'Nấu ăn, sức khỏe, phong cách sống', 1, 'sach-thuong-thuc-doi-song'),
('Nấu ăn - Học làm bánh', 'Sách dạy nấu ăn, làm bánh', 14, 'nau-an-hoc-lam-banh'),
('Chăm Sóc Sức Khỏe', 'Sách về sức khỏe', 14, 'cham-soc-suc-khoe'),
('Phong Cách Sống - Làm Đẹp', 'Phong cách sống, làm đẹp', 14, 'phong-cach-song-lam-dep'),

('Sách Kinh Tế', 'Kinh tế, quản trị, kỹ năng', 1, 'sach-kinh-te'),
('Marketing - Bán Hàng', 'Marketing và bán hàng', 18, 'marketing-ban-hang'),
('Kỹ Năng Làm Việc', 'Kỹ năng mềm', 18, 'ky-nang-lam-viec'),
('Kinh tế - Kinh doanh', 'Kinh tế và khởi nghiệp', 18, 'kinh-te-kinh-doanh'),
('Quản Trị - Lãnh Đạo', 'Quản trị, lãnh đạo', 18, 'quan-tri-lanh-dao'),

('Sách Ôn Thi Đại Học', 'Sách tham khảo ôn thi', 1, 'sach-on-thi-dai-hoc'),
('Ngữ văn', 'Ôn thi môn Văn', 23, 'ngu-van'),
('Toán học', 'Ôn thi môn Toán', 23, 'toan-hoc'),
('Tiếng Anh', 'Ôn thi môn Tiếng Anh', 23, 'tieng-anh'),
('Vật lý', 'Ôn thi môn Vật Lý', 23, 'vat-ly'),

('Sách ngoại ngữ', 'Sách học ngoại ngữ', 1, 'sach-ngoai-ngu'),
('Truyện tranh - Manga', 'Manga, comic', 1, 'truyen-tranh-manga'),
('Sách kỹ năng - Sống đẹp', 'Kỹ năng sống, truyền cảm hứng', 1, 'sach-ky-nang-song-dep');
INSERT INTO authors (name, slug, bio) VALUES
('Nguyễn Nhật Ánh', 'nguyen-nhat-anh', 'Nhà văn Việt Nam nổi tiếng với các tác phẩm viết cho tuổi mới lớn.'),
('Vũ Trọng Phụng', 'vu-trong-phung', 'Nhà văn hiện thực phê phán Việt Nam.'),
('Nam Cao', 'nam-cao', 'Tác giả của Lão Hạc, Chí Phèo, hiện thực phê phán.'),
('Aoyama Gosho', 'aoyama-gosho', 'Tác giả manga Detective Conan.'),
('Akira Amano', 'akira-amano', 'Tác giả manga Reborn!.'),
('Akira Toriyama', 'akira-toriyama', 'Tác giả Dragon Ball.'),
('Eiichiro Oda', 'eiichiro-oda', 'Tác giả One Piece.'),
('Marc Levy', 'marc-levy', 'Nhà văn người Pháp, tác phẩm lãng mạn.'),
('Tony Hsieh', 'tony-hsieh', 'Doanh nhân, tác giả Delivering Happiness.'),
('Hiro Mashima', 'hiro-mashima', 'Tác giả Fairy Tail, Eden Zero.'),
('Etsumi Haruki', 'etsumi-haruki', 'Tác giả văn học Nhật Bản.'),
('J.K. Rowling', 'jk-rowling', 'Tác giả Harry Potter.'),
('Trang Hạ', 'trang-ha', 'Tác giả sách dành cho phụ nữ.'),
('Minh Nhật', 'minh-nhat', 'Nhà văn trẻ Việt Nam.'),
('Agatha Christie', 'agatha-christie', 'Nữ hoàng trinh thám, tác giả Hercule Poirot.');

INSERT INTO publishers (name, slug, address, contact_email) VALUES
('Alphabooks', 'alphabooks', 'Hà Nội, Việt Nam', 'contact@alphabooks.vn'),
('Kim Đồng', 'kim-dong', 'Hà Nội, Việt Nam', 'contact@nxbkimdong.com.vn'),
('Minh Long', 'minh-long', 'Hà Nội, Việt Nam', NULL),
('IPM', 'ipm', 'Hà Nội, Việt Nam', NULL),
('Nhã Nam', 'nha-nam', 'Hà Nội, Việt Nam', 'info@nhanam.vn'),
('Skybooks', 'skybooks', 'Hà Nội, Việt Nam', NULL),
('Người Trẻ Việt', 'nguoi-tre-viet', 'TP.HCM, Việt Nam', NULL),
('Đông A', 'dong-a', 'Hà Nội, Việt Nam', NULL),
('First News - Trí Việt', 'first-news-tri-viet', 'TP.HCM, Việt Nam', 'info@firstnews.com.vn'),
('Amun - Đinh Tị', 'amun-dinh-ti', 'Hà Nội, Việt Nam', NULL),
('Hoa Học Trò', 'hoa-hoc-tro', 'Hà Nội, Việt Nam', NULL),
('NXB Trẻ', 'nxb-tre', 'TP.HCM, Việt Nam', 'nxbtre@nxbt.vn'),
('NXB Phụ Nữ', 'nxb-phu-nu', 'Hà Nội, Việt Nam', NULL);

