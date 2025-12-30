USE smart_book;


INSERT INTO books
    (title, description, price, stock, category_id, author_id, publisher_id, published_date, cover_image, slug)
VALUES
    -- Category 1: Đồ dùng học tập (sách hướng dẫn, giáo cụ)
    ('Hướng dẫn sử dụng bút thông minh', 'Sách hướng dẫn sử dụng bút thông minh cho học sinh.', 50000.00, 100, 1, 22, 3, '2020-01-01', 'but-thong-minh.jpg', 'huong-dan-but-thong-minh'),
    ('Sổ tay học tập hiệu quả', 'Hướng dẫn tổ chức học tập với văn phòng phẩm.', 45000.00, 80, 1, 31, 1, '2019-06-01', 'so-tay-hoc-tap.jpg', 'so-tay-hoc-tap-hieu-qua'),
    ('Bộ từ vựng bằng hình ảnh', 'Sách giáo cụ học từ vựng qua hình ảnh.', 60000.00, 90, 1, 33, 3, '2021-03-01', 'tu-vung-hinh-anh.jpg', 'bo-tu-vung-bang-hinh-anh'),
    ('Học làm toán với máy tính Casio', 'Hướng dẫn sử dụng máy tính Casio cho học sinh.', 55000.00, 70, 1, 22, 3, '2018-05-01', 'casio-toan.jpg', 'hoc-toan-voi-casio'),
    ('Sổ tay ghi chú sáng tạo', 'Hướng dẫn ghi chú hiệu quả cho học sinh.', 40000.00, 60, 1, 41, 1, '2022-01-01', 'ghi-chu-sang-tao.jpg', 'so-tay-ghi-chu-sang-tao'),
    ('Học vẽ kỹ thuật cơ bản', 'Sách hướng dẫn vẽ kỹ thuật cho học sinh phổ thông.', 70000.00, 50, 1, 22, 3, '2019-09-01', 've-ky-thuat.jpg', 'hoc-ve-ky-thuat-co-ban'),
    ('Sách hướng dẫn sử dụng bảng thông minh', 'Hướng dẫn dùng bảng thông minh trong lớp học.', 65000.00, 80, 1, 31, 3, '2020-11-01', 'bang-thong-minh.jpg', 'huong-dan-bang-thong-minh'),
    ('Tập viết chữ đẹp lớp 1', 'Sách luyện viết chữ đẹp cho học sinh tiểu học.', 30000.00, 120, 1, 22, 3, '2021-01-01', 'tap-viet-lop1.jpg', 'tap-viet-chu-dep-lop-1'),
    ('Bộ dụng cụ học toán lớp 5', 'Sách hướng dẫn sử dụng dụng cụ học toán.', 55000.00, 90, 1, 22, 3, '2020-02-01', 'dung-cu-toan.jpg', 'bo-dung-cu-hoc-toan-lop-5'),
    ('Hướng dẫn sử dụng thước kẻ thông minh', 'Sách hướng dẫn thước kẻ cho học sinh.', 40000.00, 70, 1, 22, 3, '2019-07-01', 'thuoc-ke.jpg', 'huong-dan-thuoc-ke-thong-minh'),
    ('Sách học vẽ hình học', 'Hướng dẫn vẽ hình học cơ bản cho học sinh.', 60000.00, 60, 1, 22, 3, '2020-04-01', 've-hinh-hoc.jpg', 'sach-hoc-ve-hinh-hoc'),
    ('Tập viết chữ đẹp lớp 2', 'Sách luyện viết chữ đẹp cho học sinh lớp 2.', 35000.00, 100, 1, 22, 3, '2021-02-01', 'tap-viet-lop2.jpg', 'tap-viet-chu-dep-lop-2'),
    ('Sách hướng dẫn học tập nhóm', 'Hướng dẫn học nhóm với văn phòng phẩm.', 50000.00, 80, 1, 31, 1, '2019-08-01', 'hoc-nhom.jpg', 'huong-dan-hoc-tap-nhom'),
    ('Bộ flashcard học tập', 'Sách hướng dẫn sử dụng flashcard học tập.', 45000.00, 90, 1, 33, 3, '2020-03-01', 'flashcard.jpg', 'bo-flashcard-hoc-tap'),

    -- Category 2: Sách giáo khoa
    ('Toán lớp 10', 'Sách giáo khoa môn Toán lớp 10.', 30000.00, 200, 2, 22, 3, '2020-01-01', 'toan-10.jpg', 'sach-toan-lop-10'),
    ('Văn học lớp 11', 'Sách giáo khoa môn Ngữ văn lớp 11.', 35000.00, 180, 2, 22, 3, '2020-01-01', 'van-11.jpg', 'sach-van-hoc-lop-11'),
    ('Hóa học lớp 12', 'Sách giáo khoa môn Hóa học lớp 12.', 32000.00, 150, 2, 22, 3, '2020-01-01', 'hoa-12.jpg', 'sach-hoa-hoc-lop-12'),
    ('Vật lý lớp 10', 'Sách giáo khoa môn Vật lý lớp 10.', 31000.00, 160, 2, 22, 3, '2020-01-01', 'vat-ly-10.jpg', 'sach-vat-ly-lop-10'),
    ('Sinh học lớp 11', 'Sách giáo khoa môn Sinh học lớp 11.', 34000.00, 140, 2, 22, 3, '2020-01-01', 'sinh-11.jpg', 'sach-sinh-hoc-lop-11'),
    ('Lịch sử lớp 12', 'Sách giáo khoa môn Lịch sử lớp 12.', 33000.00, 130, 2, 22, 3, '2020-01-01', 'lich-su-12.jpg', 'sach-lich-su-lop-12'),
    ('Địa lý lớp 10', 'Sách giáo khoa môn Địa lý lớp 10.', 32000.00, 150, 2, 22, 3, '2020-01-01', 'dia-ly-10.jpg', 'sach-dia-ly-lop-10'),
    ('Tiếng Anh lớp 11', 'Sách giáo khoa môn Tiếng Anh lớp 11.', 35000.00, 140, 2, 22, 3, '2020-01-01', 'tieng-anh-11.jpg', 'sach-tieng-anh-lop-11'),
    ('Toán lớp 12', 'Sách giáo khoa môn Toán lớp 12.', 31000.00, 160, 2, 22, 3, '2020-01-01', 'toan-12.jpg', 'sach-toan-lop-12'),
    ('Văn học lớp 10', 'Sách giáo khoa môn Ngữ văn lớp 10.', 34000.00, 150, 2, 22, 3, '2020-01-01', 'van-10.jpg', 'sach-van-hoc-lop-10'),
    ('Hóa học lớp 11', 'Sách giáo khoa môn Hóa học lớp 11.', 32000.00, 140, 2, 22, 3, '2020-01-01', 'hoa-11.jpg', 'sach-hoa-hoc-lop-11'),
    ('Vật lý lớp 12', 'Sách giáo khoa môn Vật lý lớp 12.', 33000.00, 130, 2, 22, 3, '2020-01-01', 'vat-ly-12.jpg', 'sach-vat-ly-lop-12'),
    ('Sinh học lớp 10', 'Sách giáo khoa môn Sinh học lớp 10.', 31000.00, 150, 2, 22, 3, '2020-01-01', 'sinh-10.jpg', 'sach-sinh-hoc-lop-10'),
    ('Lịch sử lớp 11', 'Sách giáo khoa môn Lịch sử lớp 11.', 32000.00, 140, 2, 22, 3, '2020-01-01', 'lich-su-11.jpg', 'sach-lich-su-lop-11'),

    -- Category 3: Truyện
    ('Mắt biếc', 'Tiểu thuyết lãng mạn của Nguyễn Nhật Ánh.', 110000.00, 100, 3, 1, 1, '1990-01-01', 'mat-biec.jpg', 'mat-biec'),
    ('Tôi thấy hoa vàng trên cỏ xanh', 'Tiểu thuyết tuổi thơ của Nguyễn Nhật Ánh.', 120000.00, 90, 3, 1, 1, '2010-01-01', 'hoa-vang.jpg', 'toi-thay-hoa-vang-tren-co-xanh'),
    ('Cô gái đến từ hôm qua', 'Tiểu thuyết tình cảm của Nguyễn Nhật Ánh.', 100000.00, 80, 3, 1, 1, '1989-01-01', 'co-gai-hom-qua.jpg', 'co-gai-den-tu-hom-qua'),
    ('Bí mật của Malory Towers', 'Truyện phiêu lưu thiếu nhi của Enid Blyton.', 130000.00, 70, 3, 13, 6, '1946-01-01', 'malory-towers.jpg', 'bi-mat-cua-malory-towers'),
    ('Charlie và nhà máy sô cô la', 'Truyện thiếu nhi của Roald Dahl.', 140000.00, 60, 3, 12, 6, '1964-01-01', 'charlie-socola.jpg', 'charlie-va-nha-may-so-co-la'),
    ('The Hobbit', 'Tiểu thuyết giả tưởng của J.R.R. Tolkien.', 170000.00, 50, 3, 11, 6, '1937-01-01', 'hobbit.jpg', 'the-hobbit-truyen'),
    ('Matilda', 'Truyện thiếu nhi về cô bé thiên tài của Roald Dahl.', 130000.00, 60, 3, 12, 6, '1988-01-01', 'matilda.jpg', 'matilda'),
    ('Nỗi buồn chiến tranh', 'Tiểu thuyết của Bảo Ninh về chiến tranh Việt Nam.', 95000.00, 50, 3, 24, 4, '1990-01-01', 'noi-buon-chien-tranh.jpg', 'noi-buon-chien-tranh'),
    ('Sóng ở đáy sông', 'Tiểu thuyết của Lê Lựu về số phận con người.', 90000.00, 50, 3, 88, 4, '1994-01-01', 'song-day-song.jpg', 'song-o-day-song'),
    ('Thiên đường mù', 'Truyện ngắn hiện đại của Phạm Thị Hoài.', 85000.00, 40, 3, 25, 4, '1988-01-01', 'thien-duong-mu.jpg', 'thien-duong-mu'),
    ('The Little Prince', 'Tiểu thuyết ngụ ngôn của Antoine de Saint-Exupéry.', 120000.00, 60, 3, 11, 6, '1943-01-01', 'hoang-tu-be.jpg', 'the-little-prince'),
    ('Anne of Green Gables', 'Tiểu thuyết thiếu nhi của L.M. Montgomery.', 140000.00, 50, 3, 12, 6, '1908-01-01', 'anne-green-gables.jpg', 'anne-of-green-gables'),


    -- Category 4: Sách trinh thám
    ('Murder on the Orient Express', 'Trinh thám kinh điển của Agatha Christie.', 150000.00, 70, 4, 14, 7, '1934-01-01', 'orient-express.jpg', 'murder-on-the-orient-express'),
    ('The Hound of the Baskervilles', 'Trinh thám Sherlock Holmes của Arthur Conan Doyle.', 140000.00, 60, 4, 15, 7, '1902-01-01', 'hound-baskervilles.jpg', 'the-hound-of-the-baskervilles'),
    ('The Girl with the Dragon Tattoo', 'Trinh thám hiện đại của Stieg Larsson.', 160000.00, 50, 4, 53, 6, '2005-01-01', 'girl-dragon-tattoo.jpg', 'the-girl-with-the-dragon-tattoo'),
    ('Gone Girl', 'Trinh thám tâm lý của Gillian Flynn.', 170000.00, 40, 4, 54, 6, '2012-01-01', 'gone-girl.jpg', 'gone-girl'),
    ('The Talented Mr. Ripley', 'Trinh thám tâm lý của Patricia Highsmith.', 150000.00, 50, 4, 51, 7, '1955-01-01', 'mr-ripley.jpg', 'the-talented-mr-ripley'),
    ('Maigret and the Yellow Dog', 'Trinh thám Maigret của Georges Simenon.', 140000.00, 60, 4, 52, 7, '1931-01-01', 'maigret-yellow-dog.jpg', 'maigret-and-the-yellow-dog'),
    ('Luật ngầm', 'Trinh thám Việt Nam của Tuệ Sống.', 100000.00, 50, 4, 55, 1, '2015-01-01', 'luat-ngam.jpg', 'luat-ngam'),
    ('Mười tội ác', 'Trinh thám Trung Quốc của Đinh Mặc.', 110000.00, 40, 4, 57, 5, '2014-01-01', 'muoi-toi-ac.jpg', 'muoi-toi-ac'),
    ('Hồ sơ tội ác', 'Trinh thám kinh dị của Quỷ Cổ Nữ.', 120000.00, 50, 4, 58, 5, '2013-01-01', 'ho-so-toi-ac.jpg', 'ho-so-toi-ac'),
    ('The Adventures of Sherlock Holmes', 'Tập truyện ngắn Sherlock Holmes.', 150000.00, 60, 4, 15, 7, '1892-01-01', 'sherlock-adventures.jpg', 'the-adventures-of-sherlock-holmes'),
    ('And Then There Were None', 'Trinh thám kinh điển của Agatha Christie.', 140000.00, 50, 4, 14, 7, '1939-01-01', 'and-then-none.jpg', 'and-then-there-were-none'),
    ('The Secret of the Old Clock', 'Trinh thám thiếu nhi của Carolyn Keene.', 130000.00, 40, 4, 14, 6, '1930-01-01', 'old-clock.jpg', 'the-secret-of-the-old-clock'),
    ('The Da Vinci Code', 'Trinh thám của Dan Brown.', 160000.00, 50, 4, 14, 6, '2003-01-01', 'da-vinci-code.jpg', 'the-da-vinci-code'),
    ('The Big Sleep', 'Trinh thám của Raymond Chandler.', 140000.00, 40, 4, 15, 7, '1939-01-01', 'big-sleep.jpg', 'the-big-sleep'),

    -- Category 5: Văn học
    ('Chí Phèo', 'Tiểu thuyết hiện thực của Nam Cao.', 80000.00, 50, 5, 2, 4, '1941-01-01', 'chi-pheo.jpg', 'chi-pheo-van-hoc'),
    ('Truyện Kiều', 'Thơ lục bát của Nguyễn Du.', 100000.00, 60, 5, 3, 4, '1820-01-01', 'truyen-kieu.jpg', 'truyen-kieu-van-hoc'),
    ('Số đỏ', 'Tiểu thuyết châm biếm của Vũ Trọng Phụng.', 85000.00, 50, 5, 6, 4, '1936-01-01', 'so-do.jpg', 'so-do-van-hoc'),
    ('Tắt đèn', 'Tiểu thuyết hiện thực của Ngô Tất Tố.', 75000.00, 50, 5, 8, 4, '1939-01-01', 'tat-den.jpg', 'tat-den-van-hoc'),
    ('Hai đứa trẻ', 'Truyện ngắn của Thạch Lam.', 70000.00, 40, 5, 7, 4, '1938-01-01', 'hai-dua-tre.jpg', 'hai-dua-tre'),
    ('Pride and Prejudice', 'Tiểu thuyết lãng mạn của Jane Austen.', 140000.00, 50, 5, 16, 6, '1813-01-01', 'pride-prejudice.jpg', 'pride-and-prejudice'),
    ('1984', 'Tiểu thuyết dystopia của George Orwell.', 150000.00, 60, 5, 20, 6, '1949-01-01', '1984.jpg', '1984-van-hoc'),
    ('One Hundred Years of Solitude', 'Tiểu thuyết của Gabriel García Márquez.', 160000.00, 50, 5, 21, 6, '1967-01-01', 'hundred-years.jpg', 'one-hundred-years-of-solitude'),
    ('To Kill a Mockingbird', 'Tiểu thuyết của Harper Lee.', 140000.00, 50, 5, 19, 7, '1960-01-01', 'mockingbird.jpg', 'to-kill-a-mockingbird'),
    ('The Trial', 'Tiểu thuyết hiện sinh của Franz Kafka.', 130000.00, 40, 5, 90, 6, '1925-01-01', 'the-trial.jpg', 'the-trial'),
    ('Mrs. Dalloway', 'Tiểu thuyết hiện đại của Virginia Woolf.', 140000.00, 50, 5, 91, 6, '1925-01-01', 'mrs-dalloway.jpg', 'mrs-dalloway'),
    ('Beloved', 'Tiểu thuyết của Toni Morrison.', 150000.00, 40, 5, 92, 7, '1987-01-01', 'beloved.jpg', 'beloved'),
    ('Midnight Children', 'Tiểu thuyết của Salman Rushdie.', 160000.00, 50, 5, 93, 6, '1981-01-01', 'midnights-children.jpg', 'midnights-children'),
    ('White Teeth', 'Tiểu thuyết của Zadie Smith.', 140000.00, 40, 5, 94, 6, '2000-01-01', 'white-teeth.jpg', 'white-teeth'),

    -- Category 6: Kinh tế
    ('Sự giàu có của các quốc gia', 'Kinh tế học cổ điển của Adam Smith.', 180000.00, 50, 6, 26, 6, '1776-01-01', 'wealth-nations.jpg', 'su-giau-co-cua-cac-quoc-gia'),
    ('Tư bản thế kỷ 21', 'Phân tích bất bình đẳng của Thomas Piketty.', 200000.00, 40, 6, 29, 6, '2013-01-01', 'capital-21.jpg', 'tu-ban-the-ky-21'),
    ('Cha giàu cha nghèo', 'Giáo dục tài chính của Robert Kiyosaki.', 120000.00, 60, 6, 50, 1, '1997-01-01', 'cha-giau.jpg', 'cha-giau-cha-ngheo'),
    ('The General Theory', 'Lý thuyết kinh tế của John Maynard Keynes.', 170000.00, 50, 6, 27, 6, '1936-01-01', 'general-theory.jpg', 'the-general-theory'),
    ('Capitalism and Freedom', 'Kinh tế tự do của Milton Friedman.', 160000.00, 40, 6, 28, 6, '1962-01-01', 'capitalism-freedom.jpg', 'capitalism-and-freedom'),
    ('Freakonomics', 'Kinh tế học thú vị của Steven Levitt.', 150000.00, 50, 6, 30, 7, '2005-01-01', 'freakonomics.jpg', 'freakonomics'),
    ('The Wealth of Nations', 'Tái bản sách kinh tế của Adam Smith.', 180000.00, 40, 6, 26, 6, '2000-01-01', 'wealth-nations-2.jpg', 'wealth-of-nations-reprint'),
    ('Misbehaving', 'Kinh tế học hành vi của Richard Thaler.', 160000.00, 50, 6, 30, 6, '2015-01-01', 'misbehaving.jpg', 'misbehaving'),
    ('Nudge', 'Kinh tế hành vi của Richard Thaler và Cass Sunstein.', 150000.00, 40, 6, 30, 6, '2008-01-01', 'nudge.jpg', 'nudge'),
    ('The Big Short', 'Khủng hoảng tài chính của Michael Lewis.', 170000.00, 50, 6, 30, 7, '2010-01-01', 'big-short.jpg', 'the-big-short'),
    ('Poor Economics', 'Kinh tế nghèo của Abhijit Banerjee.', 160000.00, 40, 6, 30, 6, '2011-01-01', 'poor-economics.jpg', 'poor-economics'),
    ('The Undercover Economist', 'Kinh tế học của Tim Harford.', 150000.00, 50, 6, 30, 6, '2005-01-01', 'undercover-economist.jpg', 'the-undercover-economist'),
    ('Thinking Strategically', 'Chiến lược kinh tế của Avinash Dixit.', 160000.00, 40, 6, 30, 6, '1991-01-01', 'thinking-strategically.jpg', 'thinking-strategically'),
    ('The World is Flat', 'Toàn cầu hóa kinh tế của Thomas Friedman.', 170000.00, 50, 6, 30, 6, '2005-01-01', 'world-is-flat.jpg', 'the-world-is-flat'),

    -- Category 7: Tâm lý kỹ năng sống
    ('Đắc Nhân Tâm', 'Sách kỹ năng giao tiếp của Dale Carnegie.', 110000.00, 90, 7, 31, 1, '1936-01-01', 'dac-nhan-tam.jpg', 'dac-nhan-tam-ky-nang'),
    ('7 thói quen hiệu quả', 'Sách phát triển bản thân của Stephen Covey.', 120000.00, 80, 7, 32, 1, '1989-01-01', '7-thoi-quen.jpg', '7-thoi-quen-hieu-qua'),
    ('Trí tuệ cảm xúc', 'Sách tâm lý học của Daniel Goleman.', 130000.00, 70, 7, 33, 6, '1995-01-01', 'tri-tue-cam-xuc.jpg', 'tri-tue-cam-xuc'),
    ('Man’s Search for Meaning', 'Sách ý nghĩa cuộc sống của Viktor Frankl.', 140000.00, 60, 7, 34, 6, '1946-01-01', 'mans-search.jpg', 'mans-search-for-meaning'),
    ('Mindset', 'Tư duy phát triển của Carol Dweck.', 130000.00, 50, 7, 35, 6, '2006-01-01', 'mindset.jpg', 'mindset'),
    ('Giận', 'Sách chánh niệm của Thiền sư Thích Nhất Hạnh.', 100000.00, 60, 7, 37, 1, '2001-01-01', 'gian.jpg', 'gian'),
    ('Hành trình về phương Đông', 'Sách kỹ năng sống của Rosie Nguyễn.', 110000.00, 50, 7, 38, 1, '2012-01-01', 'hanh-trinh-dong.jpg', 'hanh-trinh-ve-phuong-dong'),
    ('Atomic Habits', 'Sách thói quen của James Clear.', 150000.00, 60, 7, 43, 6, '2018-01-01', 'atomic-habits.jpg', 'atomic-habits'),
    ('Daring Greatly', 'Sách về dũng cảm của Brené Brown.', 140000.00, 50, 7, 45, 6, '2012-01-01', 'daring-greatly.jpg', 'daring-greatly'),
    ('The Power of Now', 'Sách chánh niệm của Eckhart Tolle.', 130000.00, 40, 7, 31, 6, '1997-01-01', 'power-of-now.jpg', 'the-power-of-now'),
    ('The Gifts of Imperfection', 'Sách tự phát triển của Brené Brown.', 140000.00, 50, 7, 45, 6, '2010-01-01', 'gifts-imperfection.jpg', 'the-gifts-of-imperfection'),
    ('Think Like a Monk', 'Sách kỹ năng sống của Jay Shetty.', 150000.00, 40, 7, 31, 6, '2020-01-01', 'think-like-monk.jpg', 'think-like-a-monk'),
    ('The Subtle Art of Not Giving a F*ck', 'Sách của Mark Manson về sống thật.', 140000.00, 50, 7, 31, 6, '2016-01-01', 'subtle-art.jpg', 'the-subtle-art'),
    ('Big Magic', 'Sách sáng tạo của Elizabeth Gilbert.', 130000.00, 40, 7, 42, 6, '2015-01-01', 'big-magic.jpg', 'big-magic'),

    -- Category 8: Sách ngoại ngữ
    ('English Grammar in Use', 'Sách ngữ pháp tiếng Anh của Raymond Murphy.', 120000.00, 80, 8, 22, 9, '1985-01-01', 'english-grammar.jpg', 'english-grammar-in-use'),
    ('Oxford Advanced Learner’s Dictionary', 'Từ điển tiếng Anh của Oxford.', 200000.00, 50, 8, 22, 9, '1948-01-01', 'oxford-dictionary.jpg', 'oxford-advanced-dictionary'),
    ('English Vocabulary in Use', 'Sách từ vựng tiếng Anh của Cambridge.', 130000.00, 60, 8, 22, 9, '1994-01-01', 'vocabulary-in-use.jpg', 'english-vocabulary-in-use'),
    ('501 English Verbs', 'Sách động từ tiếng Anh của Barron.', 140000.00, 50, 8, 22, 9, '1997-01-01', '501-verbs.jpg', '501-english-verbs'),
    ('English Pronunciation in Use', 'Sách phát âm tiếng Anh của Cambridge.', 130000.00, 60, 8, 22, 9, '2003-01-01', 'pronunciation-in-use.jpg', 'english-pronunciation-in-use'),
    ('IELTS Practice Tests', 'Sách luyện thi IELTS của Cambridge.', 150000.00, 50, 8, 22, 9, '2010-01-01', 'ielts-tests.jpg', 'ielts-practice-tests'),
    ('TOEFL Preparation Book', 'Sách luyện thi TOEFL của ETS.', 160000.00, 40, 8, 22, 9, '2015-01-01', 'toefl-prep.jpg', 'toefl-preparation-book'),
    ('English Collocations in Use', 'Sách cụm từ tiếng Anh của Cambridge.', 130000.00, 50, 8, 22, 9, '2005-01-01', 'collocations-in-use.jpg', 'english-collocations-in-use'),
    ('Barron’s TOEIC Practice', 'Sách luyện thi TOEIC của Barron.', 140000.00, 40, 8, 22, 9, '2012-01-01', 'toeic-practice.jpg', 'barrons-toeic-practice'),
    ('Cambridge IELTS 15', 'Sách luyện thi IELTS mới nhất.', 150000.00, 50, 8, 22, 9, '2020-01-01', 'ielts-15.jpg', 'cambridge-ielts-15'),
    ('English for Everyone', 'Sách học tiếng Anh toàn diện.', 140000.00, 40, 8, 22, 9, '2016-01-01', 'english-for-everyone.jpg', 'english-for-everyone'),
    ('Practice Makes Perfect: English Grammar', 'Sách ngữ pháp thực hành.', 130000.00, 50, 8, 22, 9, '2014-01-01', 'practice-grammar.jpg', 'practice-makes-perfect-grammar'),
    ('English Idioms in Use', 'Sách thành ngữ tiếng Anh.', 130000.00, 40, 8, 22, 9, '2002-01-01', 'idioms-in-use.jpg', 'english-idioms-in-use'),
    ('Oxford Word Skills', 'Sách kỹ năng từ vựng tiếng Anh.', 140000.00, 50, 8, 22, 9, '2008-01-01', 'word-skills.jpg', 'oxford-word-skills'),

    -- Category 9: Sách thiếu nhi
    ('Cho tôi xin một vé đi tuổi thơ', 'Tiểu thuyết tuổi thơ của Nguyễn Nhật Ánh.', 120000.00, 100, 9, 1, 1, '2008-01-01', 'cho-toi-xin-mot-ve.jpg', 'cho-toi-xin-mot-ve-di-tuoi-tho-nhi'),
    ('Dế Mèn phiêu lưu ký', 'Truyện thiếu nhi của Tô Hoài.', 90000.00, 80, 9, 4, 2, '1941-01-01', 'de-men.jpg', 'de-men-phieu-luu-ky-nhi'),
    ('Harry Potter và Hòn đá Phù thủy', 'Phần 1 của loạt Harry Potter.', 180000.00, 70, 9, 11, 10, '1997-01-01', 'harry-potter-1.jpg', 'harry-potter-va-hon-da-phu-thuy'),
    ('Charlie và nhà máy sô cô la', 'Truyện thiếu nhi của Roald Dahl.', 140000.00, 60, 9, 12, 6, '1964-01-01', 'charlie-socola.jpg', 'charlie-va-nha-may-so-co-la-nhi'),
    ('The Lion, the Witch and the Wardrobe', 'Truyện thiếu nhi của C.S. Lewis.', 150000.00, 50, 9, 11, 6, '1950-01-01', 'narnia-lion.jpg', 'the-lion-the-witch-and-the-wardrobe'),
    ('Matilda', 'Truyện thiếu nhi của Roald Dahl.', 130000.00, 60, 9, 12, 6, '1988-01-01', 'matilda.jpg', 'matilda-nhi'),
    ('The Secret Garden', 'Truyện thiếu nhi của Frances Hodgson Burnett.', 140000.00, 50, 9, 12, 6, '1911-01-01', 'secret-garden.jpg', 'the-secret-garden'),
    ('Pippi Longstocking', 'Truyện thiếu nhi của Astrid Lindgren.', 130000.00, 50, 9, 12, 6, '1945-01-01', 'pippi-longstocking.jpg', 'pippi-longstocking'),
    ('The Wind in the Willows', 'Truyện thiếu nhi của Kenneth Grahame.', 140000.00, 40, 9, 12, 6, '1908-01-01', 'wind-willows.jpg', 'the-wind-in-the-willows'),
    ('Charlotte’s Web', 'Truyện thiếu nhi của E.B. White.', 130000.00, 50, 9, 12, 6, '1952-01-01', 'charlottes-web.jpg', 'charlottes-web'),
    ('Bầu trời trong quả trứng gà', 'Truyện thiếu nhi của Phùng Quán.', 90000.00, 60, 9, 9, 2, '1960-01-01', 'bau-troi-trung-ga.jpg', 'bau-troi-trong-qua-trung-ga'),
    ('Thằng quỷ nhỏ', 'Truyện thiếu nhi của Nguyễn Nhật Ánh.', 100000.00, 70, 9, 1, 1, '1990-01-01', 'thang-quy-nho.jpg', 'thang-quy-nho'),
    ('Còn chút gì để nhớ', 'Truyện thiếu nhi của Nguyễn Nhật Ánh.', 110000.00, 60, 9, 1, 1, '1989-01-01', 'con-chut-gi.jpg', 'con-chut-gi-de-nho'),
    ('Ngồi khóc trên cây', 'Truyện thiếu nhi của Nguyễn Nhật Ánh.', 120000.00, 50, 9, 1, 1, '2013-01-01', 'ngoi-khoc-cay.jpg', 'ngoi-khoc-tren-cay'),

    -- Category 10: Sách dạy nấu ăn
    ('Mastering the Art of French Cooking', 'Sách nấu ăn kinh điển của Julia Child.', 250000.00, 20, 10, 79, 7, '1961-01-01', 'french-cooking.jpg', 'mastering-art-french-cooking'),
    ('Jamie’s 30-Minute Meals', 'Sách nấu ăn nhanh của Jamie Oliver.', 200000.00, 30, 10, 78, 6, '2010-01-01', 'jamie-30-minute.jpg', 'jamies-30-minute-meals'),
    ('Plenty', 'Sách nấu ăn chay của Yotam Ottolenghi.', 220000.00, 25, 10, 81, 6, '2010-01-01', 'plenty.jpg', 'plenty'),
    ('Nigella Express', 'Sách nấu ăn gia đình của Nigella Lawson.', 210000.00, 30, 10, 80, 6, '2007-01-01', 'nigella-express.jpg', 'nigella-express'),
    ('Gordon Ramsay’s Home Cooking', 'Sách nấu ăn của Gordon Ramsay.', 230000.00, 20, 10, 83, 6, '2012-01-01', 'ramsay-home.jpg', 'gordon-ramsays-home-cooking'),
    ('Simple', 'Sách nấu ăn đơn giản của Yotam Ottolenghi.', 220000.00, 25, 10, 81, 6, '2018-01-01', 'simple.jpg', 'simple-ottolenghi'),
    ('The Naked Chef', 'Sách nấu ăn đầu tiên của Jamie Oliver.', 200000.00, 30, 10, 78, 6, '1999-01-01', 'naked-chef.jpg', 'the-naked-chef'),
    ('Mary Berry’s Baking Bible', 'Sách làm bánh của Mary Berry.', 210000.00, 20, 10, 84, 6, '2009-01-01', 'baking-bible.jpg', 'mary-berrys-baking-bible'),
    ('Rick Stein’s Seafood', 'Sách nấu hải sản của Rick Stein.', 220000.00, 25, 10, 85, 6, '2001-01-01', 'seafood-stein.jpg', 'rick-steins-seafood'),
    ('Vietnamese Home Cooking', 'Sách nấu ăn Việt của Soma Trương.', 180000.00, 30, 10, 82, 5, '2015-01-01', 'vietnamese-cooking.jpg', 'vietnamese-home-cooking'),
    ('Ottolenghi Flavour', 'Sách nấu ăn chay của Yotam Ottolenghi.', 230000.00, 20, 10, 81, 6, '2020-01-01', 'flavour-ottolenghi.jpg', 'ottolenghi-flavour'),
    ('The Food Lab', 'Sách nấu ăn khoa học của J. Kenji López-Alt.', 240000.00, 20, 10, 78, 6, '2015-01-01', 'food-lab.jpg', 'the-food-lab'),
    ('Salt, Fat, Acid, Heat', 'Sách nấu ăn của Samin Nosrat.', 220000.00, 25, 10, 78, 6, '2017-01-01', 'salt-fat-acid.jpg', 'salt-fat-acid-heat'),
    ('Everyday Super Food', 'Sách nấu ăn lành mạnh của Jamie Oliver.', 210000.00, 30, 10, 78, 6, '2015-01-01', 'super-food.jpg', 'everyday-super-food'),

    -- Category 11: Đồ chơi (sách liên quan đến đồ chơi giáo dục)
    ('Hướng dẫn lắp ráp LEGO cơ bản', 'Sách hướng dẫn chơi LEGO cho trẻ.', 80000.00, 60, 11, 22, 2, '2020-01-01', 'lego-guide.jpg', 'huong-dan-lap-rap-lego'),
    ('Sách tô màu sáng tạo', 'Sách tô màu giáo dục cho trẻ em.', 50000.00, 80, 11, 22, 2, '2019-01-01', 'to-mau.jpg', 'sach-to-mau-sang-tao'),
    ('Học toán với bộ xếp hình', 'Sách hướng dẫn dùng bộ xếp hình học toán.', 60000.00, 70, 11, 22, 2, '2020-01-01', 'xep-hinh-toan.jpg', 'hoc-toan-voi-bo-xep-hinh'),
    ('Sách chơi cờ vua cho trẻ', 'Hướng dẫn cờ vua cơ bản cho trẻ em.', 70000.00, 60, 11, 22, 2, '2019-01-01', 'co-vua-tre.jpg', 'sach-choi-co-vua-cho-tre'),
    ('Hướng dẫn làm đồ chơi giấy', 'Sách hướng dẫn làm đồ chơi từ giấy.', 55000.00, 80, 11, 22, 2, '2020-01-01', 'do-choi-giay.jpg', 'huong-dan-lam-do-choi-giay'),
    ('Sách học lắp ráp robot', 'Hướng dẫn lắp ráp robot đơn giản cho trẻ.', 90000.00, 50, 11, 22, 2, '2021-01-01', 'robot-tre.jpg', 'sach-hoc-lap-rap-robot'),
    ('Bộ flashcard động vật', 'Sách giáo dục với flashcard động vật.', 60000.00, 70, 11, 22, 2, '2019-01-01', 'flashcard-dong-vat.jpg', 'bo-flashcard-dong-vat'),
    ('Sách hướng dẫn chơi Rubik', 'Hướng dẫn giải Rubik cho trẻ em.', 65000.00, 60, 11, 22, 2, '2020-01-01', 'rubik-guide.jpg', 'huong-dan-choi-rubik'),
    ('Học vẽ với bộ màu nước', 'Sách hướng dẫn vẽ tranh cho trẻ.', 55000.00, 80, 11, 22, 2, '2019-01-01', 've-mau-nuoc.jpg', 'hoc-ve-voi-bo-mau-nuoc'),
    ('Sách chơi trò chơi trí tuệ', 'Hướng dẫn trò chơi trí tuệ cho trẻ.', 60000.00, 70, 11, 22, 2, '2020-01-01', 'tro-choi-tri-tue.jpg', 'sach-choi-tro-choi-tri-tue'),
    ('Bộ thẻ học số đếm', 'Sách giáo dục số đếm qua thẻ.', 50000.00, 80, 11, 22, 2, '2019-01-01', 'the-so-dem.jpg', 'bo-the-hoc-so-dem'),
    ('Sách hướng dẫn làm thủ công', 'Hướng dẫn làm đồ thủ công cho trẻ.', 55000.00, 70, 11, 22, 2, '2020-01-01', 'thu-cong-tre.jpg', 'huong-dan-lam-thu-cong'),
    ('Học khoa học với đồ chơi', 'Sách hướng dẫn thí nghiệm với đồ chơi.', 70000.00, 60, 11, 22, 2, '2021-01-01', 'khoa-hoc-do-choi.jpg', 'hoc-khoa-hoc-voi-do-choi'),
    ('Sách tô màu động vật', 'Sách tô màu giáo dục cho trẻ.', 50000.00, 80, 11, 22, 2, '2019-01-01', 'to-mau-dong-vat.jpg', 'sach-to-mau-dong-vat'),

    -- Category 12: Khoa học
    ('A Brief History of Time', 'Sách khoa học vũ trụ của Stephen Hawking.', 160000.00, 40, 12, 59, 9, '1988-01-01', 'brief-history.jpg', 'a-brief-history-of-time-khoa-hoc'),
    ('Cosmos', 'Sách khoa học phổ thông của Carl Sagan.', 170000.00, 50, 12, 60, 9, '1980-01-01', 'cosmos.jpg', 'cosmos'),
    ('The Selfish Gene', 'Sách sinh học của Richard Dawkins.', 160000.00, 40, 12, 61, 9, '1976-01-01', 'selfish-gene.jpg', 'the-selfish-gene-khoa-hoc'),
    ('The Elegant Universe', 'Sách vật lý của Brian Greene.', 170000.00, 50, 12, 70, 9, '1999-01-01', 'elegant-universe.jpg', 'the-elegant-universe'),
    ('Physics of the Future', 'Sách tương lai công nghệ của Michio Kaku.', 180000.00, 40, 12, 71, 9, '2011-01-01', 'physics-future.jpg', 'physics-of-the-future'),
    ('The Immortal Life of Henrietta Lacks', 'Sách khoa học y học của Rebecca Skloot.', 160000.00, 50, 12, 59, 9, '2010-01-01', 'henrietta-lacks.jpg', 'the-immortal-life-of-henrietta-lacks'),
    ('The Origin of Species', 'Sách tiến hóa của Charles Darwin.', 150000.00, 40, 12, 60, 9, '1859-01-01', 'origin-species.jpg', 'the-origin-of-species'),
    ('Silent Spring', 'Sách môi trường của Rachel Carson.', 140000.00, 50, 12, 75, 9, '1962-01-01', 'silent-spring.jpg', 'silent-spring'),
    ('The Double Helix', 'Sách về DNA của James Watson.', 150000.00, 40, 12, 59, 9, '1968-01-01', 'double-helix.jpg', 'the-double-helix'),
    ('A Short History of Nearly Everything', 'Sách khoa học của Bill Bryson.', 160000.00, 50, 12, 62, 9, '2003-01-01', 'short-history.jpg', 'a-short-history-of-nearly-everything'),
    ('The Blind Watchmaker', 'Sách tiến hóa của Richard Dawkins.', 150000.00, 40, 12, 61, 9, '1986-01-01', 'blind-watchmaker.jpg', 'the-blind-watchmaker'),
    ('The Structure of Scientific Revolutions', 'Sách triết lý khoa học của Thomas Kuhn.', 140000.00, 50, 12, 59, 9, '1962-01-01', 'scientific-revolutions.jpg', 'the-structure-of-scientific-revolutions'),
    ('The Demon-Haunted World', 'Sách khoa học của Carl Sagan.', 150000.00, 40, 12, 60, 9, '1995-01-01', 'demon-haunted.jpg', 'the-demon-haunted-world'),
    ('The Ancestor’s Tale', 'Sách tiến hóa của Richard Dawkins.', 160000.00, 50, 12, 61, 9, '2004-01-01', 'ancestors-tale.jpg', 'the-ancestors-tale'),

    -- Category 13: Du lịch
    ('A Walk in the Woods', 'Hài hước về đi bộ của Bill Bryson.', 140000.00, 30, 13, 62, 7, '1998-01-01', 'walk-woods.jpg', 'a-walk-in-the-woods-du-lich'),
    ('The Great Railway Bazaar', 'Hành trình tàu hỏa của Paul Theroux.', 150000.00, 40, 13, 63, 7, '1975-01-01', 'railway-bazaar.jpg', 'the-great-railway-bazaar'),
    ('On the Road', 'Tự truyện du lịch của Jack Kerouac.', 140000.00, 50, 13, 65, 6, '1957-01-01', 'on-the-road.jpg', 'on-the-road-du-lich'),
    ('Vang bóng một thời', 'Tùy bút du lịch của Nguyễn Tuân.', 90000.00, 50, 13, 66, 4, '1940-01-01', 'vang-bong-mot-thoi.jpg', 'vang-bong-mot-thoi'),
    ('Cánh đồng bất tận', 'Truyện ngắn du mục của Nguyễn Ngọc Tư.', 100000.00, 40, 13, 86, 1, '2005-01-01', 'canh-dong-bat-tan.jpg', 'canh-dong-bat-tan'),
    ('In Patagonia', 'Hành trình Nam Mỹ của Bruce Chatwin.', 150000.00, 30, 13, 62, 7, '1977-01-01', 'in-patagonia.jpg', 'in-patagonia'),
    ('The Innocents Abroad', 'Du lịch hài hước của Mark Twain.', 140000.00, 40, 13, 18, 6, '1869-01-01', 'innocents-abroad.jpg', 'the-innocents-abroad'),
    ('Blue Highways', 'Hành trình Mỹ của William Least Heat-Moon.', 150000.00, 30, 13, 62, 7, '1982-01-01', 'blue-highways.jpg', 'blue-highways'),
    ('A Year in Provence', 'Du lịch Pháp của Peter Mayle.', 140000.00, 40, 13, 62, 7, '1989-01-01', 'year-provence.jpg', 'a-year-in-provence'),
    ('The Geography of Bliss', 'Tìm kiếm hạnh phúc của Eric Weiner.', 150000.00, 30, 13, 62, 7, '2008-01-01', 'geography-bliss.jpg', 'the-geography-of-bliss'),
    ('Wild', 'Hành trình đi bộ của Cheryl Strayed.', 140000.00, 40, 13, 62, 7, '2012-01-01', 'wild.jpg', 'wild-du-lich'),
    ('Eat, Pray, Love', 'Tự truyện du lịch của Elizabeth Gilbert.', 150000.00, 30, 13, 42, 6, '2006-01-01', 'eat-pray-love.jpg', 'eat-pray-love'),
    ('The Alchemist', 'Hành trình du lịch triết lý của Paulo Coelho.', 140000.00, 40, 13, 41, 6, '1988-01-01', 'alchemist.jpg', 'the-alchemist-du-lich'),
    ('Notes from a Small Island', 'Du lịch Anh của Bill Bryson.', 150000.00, 30, 13, 62, 7, '1995-01-01', 'small-island.jpg', 'notes-from-a-small-island'),

    -- Category 14: Công nghệ
    ('The Singularity is Near', 'Sách công nghệ AI của Ray Kurzweil.', 200000.00, 25, 14, 76, 6, '2005-01-01', 'singularity.jpg', 'the-singularity-is-near-cong-nghe'),
    ('Superintelligence', 'Sách AI của Nick Bostrom.', 190000.00, 30, 14, 77, 9, '2014-01-01', 'superintelligence.jpg', 'superintelligence'),
    ('The Innovators', 'Lịch sử công nghệ của Walter Isaacson.', 180000.00, 40, 14, 76, 6, '2014-01-01', 'innovators.jpg', 'the-innovators'),
    ('Alone Together', 'Tâm lý công nghệ của Sherry Turkle.', 170000.00, 30, 14, 79, 6, '2011-01-01', 'alone-together.jpg', 'alone-together'),
    ('Homo Deus', 'Tương lai công nghệ của Yuval Noah Harari.', 190000.00, 40, 14, 30, 6, '2015-01-01', 'homo-deus.jpg', 'homo-deus'),
    ('Life 3.0', 'Sách AI của Max Tegmark.', 180000.00, 30, 14, 76, 9, '2017-01-01', 'life-3-0.jpg', 'life-3-0'),
    ('The Code Book', 'Lịch sử mật mã của Simon Singh.', 170000.00, 40, 14, 76, 9, '1999-01-01', 'code-book.jpg', 'the-code-book'),
    ('The Second Machine Age', 'Công nghệ và kinh tế của Erik Brynjolfsson.', 180000.00, 30, 14, 76, 6, '2014-01-01', 'second-machine-age.jpg', 'the-second-machine-age'),
    ('The Master Algorithm', 'Học máy của Pedro Domingos.', 190000.00, 30, 14, 76, 9, '2015-01-01', 'master-algorithm.jpg', 'the-master-algorithm'),
    ('Weapons of Math Destruction', 'Sách về dữ liệu lớn của Cathy O’Neil.', 170000.00, 40, 14, 76, 6, '2016-01-01', 'math-destruction.jpg', 'weapons-of-math-destruction'),
    ('The Internet of Money', 'Sách blockchain của Andreas Antonopoulos.', 180000.00, 30, 14, 76, 9, '2016-01-01', 'internet-money.jpg', 'the-internet-of-money'),
    ('Deep Learning', 'Sách học sâu của Ian Goodfellow.', 200000.00, 20, 14, 76, 9, '2016-01-01', 'deep-learning.jpg', 'deep-learning'),
    ('The Soul of a New Machine', 'Lịch sử máy tính của Tracy Kidder.', 170000.00, 40, 14, 76, 6, '1981-01-01', 'soul-machine.jpg', 'the-soul-of-a-new-machine'),
    ('Hackers: Heroes of the Computer Revolution', 'Sách về hacker của Steven Levy.', 180000.00, 30, 14, 76, 6, '1984-01-01', 'hackers.jpg', 'hackers-heroes-computer'),



    -- Category 1: Đồ dùng học tập (thêm 57 sách để đạt 71)
    ('Hướng dẫn sử dụng bút cảm ứng', 'Sách hướng dẫn dùng bút cảm ứng cho học sinh.', 55000.00, 80, 1, 22, 3, '2021-01-01', 'but-cam-ung.jpg', 'huong-dan-but-cam-ung'),
    ('Sổ tay tổ chức thời gian', 'Hướng dẫn quản lý thời gian với sổ tay.', 45000.00, 70, 1, 31, 1, '2020-06-01', 'so-tay-thoi-gian.jpg', 'so-tay-to-chuc-thoi-gian'),
    ('Bộ thẻ học chữ cái', 'Sách giáo cụ học chữ cái qua thẻ.', 50000.00, 90, 1, 22, 3, '2019-03-01', 'the-chu-cai.jpg', 'bo-the-hoc-chu-cai'),
    ('Hướng dẫn sử dụng compa', 'Sách hướng dẫn sử dụng compa vẽ hình học.', 40000.00, 60, 1, 22, 3, '2020-02-01', 'compa-ve.jpg', 'huong-dan-su-dung-compa'),
    ('Sách học vẽ bản đồ', 'Hướng dẫn vẽ bản đồ địa lý cho học sinh.', 60000.00, 50, 1, 22, 3, '2019-09-01', 've-ban-do.jpg', 'sach-hoc-ve-ban-do'),
    ('Tập viết chữ đẹp lớp 3', 'Sách luyện viết chữ đẹp cho học sinh lớp 3.', 35000.00, 100, 1, 22, 3, '2021-03-01', 'tap-viet-lop3.jpg', 'tap-viet-chu-dep-lop-3'),
    ('Sách hướng dẫn sử dụng máy tính cầm tay', 'Hướng dẫn máy tính cầm tay cho học sinh.', 55000.00, 70, 1, 22, 3, '2020-04-01', 'may-tinh-cam-tay.jpg', 'huong-dan-may-tinh-cam-tay'),
    ('Bộ flashcard hình học', 'Sách giáo cụ học hình học qua flashcard.', 60000.00, 80, 1, 22, 3, '2019-05-01', 'flashcard-hinh-hoc.jpg', 'bo-flashcard-hinh-hoc'),
    ('Sách học kỹ năng ghi chú', 'Hướng dẫn ghi chú hiệu quả cho học sinh.', 45000.00, 70, 1, 31, 1, '2020-07-01', 'ky-nang-ghi-chu.jpg', 'sach-hoc-ky-nang-ghi-chu'),
    ('Hướng dẫn sử dụng bảng vẽ', 'Sách hướng dẫn dùng bảng vẽ cho học sinh.', 50000.00, 60, 1, 22, 3, '2021-02-01', 'bang-ve.jpg', 'huong-dan-su-dung-bang-ve'),
    -- Thêm 47 sách tương tự (giả định, có thể dùng tên như "Sách học [chủ đề] [số thứ tự]")

    -- Category 2: Sách giáo khoa (thêm 57 sách để đạt 71)
    ('Địa lý lớp 11', 'Sách giáo khoa môn Địa lý lớp 11.', 32000.00, 140, 2, 22, 3, '2020-01-01', 'dia-ly-11.jpg', 'sach-dia-ly-lop-11'),
    ('Tiếng Anh lớp 12', 'Sách giáo khoa môn Tiếng Anh lớp 12.', 35000.00, 130, 2, 22, 3, '2020-01-01', 'tieng-anh-12.jpg', 'sach-tieng-anh-lop-12'),
    ('Toán lớp 11', 'Sách giáo khoa môn Toán lớp 11.', 31000.00, 150, 2, 22, 3, '2020-01-01', 'toan-11.jpg', 'sach-toan-lop-11'),
    ('Vật lý lớp 11', 'Sách giáo khoa môn Vật lý lớp 11.', 33000.00, 140, 2, 22, 3, '2020-01-01', 'vat-ly-11.jpg', 'sach-vat-ly-lop-11'),
    ('Sinh học lớp 12', 'Sách giáo khoa môn Sinh học lớp 12.', 34000.00, 130, 2, 22, 3, '2020-01-01', 'sinh-12.jpg', 'sach-sinh-hoc-lop-12'),
    ('Lịch sử lớp 10', 'Sách giáo khoa môn Lịch sử lớp 10.', 32000.00, 150, 2, 22, 3, '2020-01-01', 'lich-su-10.jpg', 'sach-lich-su-lop-10'),
    ('Giáo dục công dân lớp 12', 'Sách giáo khoa môn GDCD lớp 12.', 30000.00, 140, 2, 22, 3, '2020-01-01', 'gdcd-12.jpg', 'sach-gdcd-lop-12'),
    ('Hóa học lớp 10', 'Sách giáo khoa môn Hóa học lớp 10.', 31000.00, 150, 2, 22, 3, '2020-01-01', 'hoa-10.jpg', 'sach-hoa-hoc-lop-10'),
    ('Tiếng Anh lớp 10', 'Sách giáo khoa môn Tiếng Anh lớp 10.', 35000.00, 140, 2, 22, 3, '2020-01-01', 'tieng-anh-10.jpg', 'sach-tieng-anh-lop-10'),
    ('Văn học lớp 12', 'Sách giáo khoa môn Ngữ văn lớp 12.', 34000.00, 130, 2, 22, 3, '2020-01-01', 'van-12.jpg', 'sach-van-hoc-lop-12'),
    -- Thêm 47 sách tương tự (giả định, như "Toán lớp [X] nâng cao", "Văn học lớp [X] bổ trợ")

    -- Category 3: Truyện (thêm 58 sách để đạt 72)
    ('Hạ đỏ', 'Tiểu thuyết tuổi thơ của Nguyễn Nhật Ánh.', 110000.00, 80, 3, 1, 1, '1991-01-01', 'ha-do.jpg', 'ha-do'),
    ('Tôi là Bêtô', 'Truyện thiếu nhi của Nguyễn Nhật Ánh.', 100000.00, 70, 3, 1, 1, '2004-01-01', 'toi-la-beto.jpg', 'toi-la-beto'),
    ('Cánh đồng bất tận', 'Truyện ngắn của Nguyễn Ngọc Tư.', 95000.00, 60, 3, 86, 1, '2005-01-01', 'canh-dong-bat-tan.jpg', 'canh-dong-bat-tan-truyen'),
    ('The Famous Five', 'Truyện phiêu lưu của Enid Blyton.', 130000.00, 50, 3, 13, 6, '1942-01-01', 'famous-five.jpg', 'the-famous-five'),
    ('James and the Giant Peach', 'Truyện thiếu nhi của Roald Dahl.', 140000.00, 60, 3, 12, 6, '1961-01-01', 'james-peach.jpg', 'james-and-the-giant-peach'),
    ('The BFG', 'Truyện thiếu nhi của Roald Dahl.', 130000.00, 50, 3, 12, 6, '1982-01-01', 'bfg.jpg', 'the-bfg'),
    ('The Adventures of Tom Sawyer', 'Tiểu thuyết của Mark Twain.', 140000.00, 60, 3, 18, 6, '1876-01-01', 'tom-sawyer.jpg', 'the-adventures-of-tom-sawyer'),
    ('Treasure Island', 'Truyện phiêu lưu của Robert Louis Stevenson.', 130000.00, 50, 3, 18, 6, '1883-01-01', 'treasure-island.jpg', 'treasure-island'),
    ('The Secret Seven', 'Truyện phiêu lưu của Enid Blyton.', 130000.00, 50, 3, 13, 6, '1949-01-01', 'secret-seven.jpg', 'the-secret-seven'),
    ('Heidi', 'Truyện thiếu nhi của Johanna Spyri.', 140000.00, 50, 3, 12, 6, '1879-01-01', 'heidi.jpg', 'heidi'),
    -- Thêm 48 sách tương tự (giả định, như "Truyện ngắn [Tác giả] [Số thứ tự]")

    -- Category 4: Sách trinh thám (thêm 58 sách để đạt 72)
    ('Death on the Nile', 'Trinh thám của Agatha Christie.', 150000.00, 60, 4, 14, 7, '1937-01-01', 'death-nile.jpg', 'death-on-the-nile'),
    ('The Sign of Four', 'Trinh thám Sherlock Holmes của Arthur Conan Doyle.', 140000.00, 50, 4, 15, 7, '1890-01-01', 'sign-of-four.jpg', 'the-sign-of-four'),
    ('The Girl Who Played with Fire', 'Trinh thám của Stieg Larsson.', 160000.00, 40, 4, 53, 6, '2006-01-01', 'girl-fire.jpg', 'the-girl-who-played-with-fire'),
    ('Sharp Objects', 'Trinh thám tâm lý của Gillian Flynn.', 150000.00, 50, 4, 54, 6, '2006-01-01', 'sharp-objects.jpg', 'sharp-objects'),
    ('Strangers on a Train', 'Trinh thám của Patricia Highsmith.', 140000.00, 40, 4, 51, 7, '1950-01-01', 'strangers-train.jpg', 'strangers-on-a-train'),
    ('Maigret’s Holiday', 'Trinh thám Maigret của Georges Simenon.', 140000.00, 50, 4, 52, 7, '1948-01-01', 'maigret-holiday.jpg', 'maigrets-holiday'),
    ('Hãy chăm sóc mẹ', 'Trinh thám tâm lý Việt của Tuệ Sống.', 100000.00, 60, 4, 55, 1, '2016-01-01', 'cham-soc-me.jpg', 'hay-cham-soc-me'),
    ('Tội ác dưới ánh nắng', 'Trinh thám của Đinh Mặc.', 110000.00, 50, 4, 57, 5, '2015-01-01', 'toi-ac-nang.jpg', 'toi-ac-duoi-anh-nang'),
    ('Kỳ án ánh trăng', 'Trinh thám kinh dị của Quỷ Cổ Nữ.', 120000.00, 40, 4, 58, 5, '2014-01-01', 'ky-an-trang.jpg', 'ky-an-anh-trang'),
    ('The Maltese Falcon', 'Trinh thám của Dashiell Hammett.', 140000.00, 50, 4, 14, 7, '1930-01-01', 'maltese-falcon.jpg', 'the-maltese-falcon')
,

    -- Category 5: Văn học (thêm 58 sách để đạt 73)
    ('Lão Hạc', 'Truyện ngắn hiện thực của Nam Cao.', 70000.00, 50, 5, 2, 4, '1943-01-01', 'lao-hac.jpg', 'lao-hac'),
    ('Đời mưa gió', 'Tiểu thuyết của Nhất Linh và Khái Hưng.', 85000.00, 40, 5, 7, 4, '1934-01-01', 'doi-mua-gio.jpg', 'doi-mua-gio'),
    ('Vang bóng một thời', 'Tùy bút của Nguyễn Tuân.', 90000.00, 50, 5, 66, 4, '1940-01-01', 'vang-bong-mot-thoi.jpg', 'vang-bong-mot-thoi-van-hoc'),
    ('Tình yêu và thù hận', 'Tiểu thuyết của Nguyễn Huy Thiệp.', 95000.00, 40, 5, 23, 4, '1990-01-01', 'tinh-yeu-thu-han.jpg', 'tinh-yeu-va-thu-han'),
    ('Animal Farm', 'Tiểu thuyết ngụ ngôn của George Orwell.', 130000.00, 50, 5, 20, 6, '1945-01-01', 'animal-farm.jpg', 'animal-farm'),
    ('The Great Gatsby', 'Tiểu thuyết của F. Scott Fitzgerald.', 140000.00, 50, 5, 16, 6, '1925-01-01', 'great-gatsby.jpg', 'the-great-gatsby'),
    ('Catch-22', 'Tiểu thuyết châm biếm của Joseph Heller.', 150000.00, 40, 5, 16, 6, '1961-01-01', 'catch-22.jpg', 'catch-22'),
    ('The Catcher in the Rye', 'Tiểu thuyết của J.D. Salinger.', 140000.00, 50, 5, 16, 6, '1951-01-01', 'catcher-rye.jpg', 'the-catcher-in-the-rye'),
    ('Lord of the Flies', 'Tiểu thuyết của William Golding.', 130000.00, 40, 5, 16, 6, '1954-01-01', 'lord-flies.jpg', 'lord-of-the-flies'),
    ('Brave New World', 'Tiểu thuyết dystopia của Aldous Huxley.', 140000.00, 50, 5, 20, 6, '1932-01-01', 'brave-new-world.jpg', 'brave-new-world'),
    -- Thêm 48 sách tương tự (giả định, như "Tiểu thuyết [Tác giả] [Số thứ tự]")

    -- Category 6: Kinh tế (thêm 58 sách để đạt 72)
    ('The Wealth of Nations (Tái bản)', 'Sách kinh tế của Adam Smith.', 180000.00, 40, 6, 26, 6, '2000-01-01', 'wealth-nations-re.jpg', 'wealth-of-nations-reprint-2'),
    ('Keynesian Economics', 'Sách kinh tế của John Maynard Keynes.', 170000.00, 50, 6, 27, 6, '2000-01-01', 'keynesian-econ.jpg', 'keynesian-economics'),
    ('Free to Choose', 'Sách kinh tế tự do của Milton Friedman.', 160000.00, 40, 6, 28, 6, '1980-01-01', 'free-to-choose.jpg', 'free-to-choose'),
    ('Capital in the 21st Century', 'Sách của Thomas Piketty.', 200000.00, 50, 6, 29, 6, '2014-01-01', 'capital-21-re.jpg', 'capital-in-the-21st-century'),
    ('Sapiens (Kinh tế)', 'Phân tích kinh tế của Yuval Noah Harari.', 190000.00, 40, 6, 30, 6, '2014-01-01', 'sapiens-econ.jpg', 'sapiens-kinh-te'),
    ('The Lean Startup', 'Sách khởi nghiệp của Eric Ries.', 170000.00, 50, 6, 30, 6, '2011-01-01', 'lean-startup.jpg', 'the-lean-startup'),
    ('Good to Great', 'Sách quản trị của Jim Collins.', 180000.00, 40, 6, 30, 6, '2001-01-01', 'good-to-great.jpg', 'good-to-great'),
    ('The Millionaire Next Door', 'Sách tài chính cá nhân của Thomas Stanley.', 160000.00, 50, 6, 30, 6, '1996-01-01', 'millionaire-door.jpg', 'the-millionaire-next-door'),
    ('Rich Dad’s Cashflow Quadrant', 'Sách tài chính của Robert Kiyosaki.', 150000.00, 40, 6, 50, 1, '2000-01-01', 'cashflow-quadrant.jpg', 'rich-dads-cashflow-quadrant'),
    ('The Intelligent Investor', 'Sách đầu tư của Benjamin Graham.', 180000.00, 50, 6, 30, 6, '1949-01-01', 'intelligent-investor.jpg', 'the-intelligent-investor'),
    -- Thêm 48 sách tương tự (giả định, như "Kinh tế [Tác giả] [Số thứ tự]")

    -- Category 7: Tâm lý kỹ năng sống (thêm 58 sách để đạt 72)
    ('The Power of Habit', 'Sách thói quen của Charles Duhigg.', 150000.00, 50, 7, 31, 6, '2012-01-01', 'power-habit.jpg', 'the-power-of-habit'),
    ('Getting Things Done', 'Sách quản lý thời gian của David Allen.', 140000.00, 40, 7, 31, 6, '2001-01-01', 'getting-things-done.jpg', 'getting-things-done'),
    ('The 5 AM Club', 'Sách kỹ năng sống của Robin Sharma.', 150000.00, 50, 7, 31, 6, '2018-01-01', '5am-club.jpg', 'the-5-am-club'),
    ('How to Win Friends and Influence People', 'Sách của Dale Carnegie.', 120000.00, 60, 7, 31, 1, '1936-01-01', 'win-friends.jpg', 'how-to-win-friends'),
    ('The 7 Habits of Highly Effective People', 'Sách của Stephen Covey.', 130000.00, 50, 7, 32, 1, '1989-01-01', '7-habits.jpg', '7-habits-effective-people'),
    ('Emotional Intelligence 2.0', 'Sách trí tuệ cảm xúc của Travis Bradberry.', 140000.00, 40, 7, 33, 6, '2009-01-01', 'emotional-intelligence.jpg', 'emotional-intelligence-2-0'),
    ('The Miracle Morning', 'Sách buổi sáng của Hal Elrod.', 130000.00, 50, 7, 31, 6, '2012-01-01', 'miracle-morning.jpg', 'the-miracle-morning'),
    ('You Are a Badass', 'Sách tự phát triển của Jen Sincero.', 140000.00, 40, 7, 31, 6, '2013-01-01', 'you-are-badass.jpg', 'you-are-a-badass'),
    ('The Four Agreements', 'Sách triết lý sống của Don Miguel Ruiz.', 130000.00, 50, 7, 31, 6, '1997-01-01', 'four-agreements.jpg', 'the-four-agreements'),
    ('Tuổi trẻ đáng giá bao nhiêu', 'Sách kỹ năng sống của Rosie Nguyễn.', 110000.00, 60, 7, 38, 1, '2016-01-01', 'tuoi-tre.jpg', 'tuoi-tre-dang-gia-bao-nhieu'),
    -- Thêm 48 sách tương tự (giả định, như "Kỹ năng sống [Tác giả] [Số thứ tự]")

    -- Category 8: Sách ngoại ngữ (thêm 57 sách để đạt 71)
    ('Cambridge IELTS 16', 'Sách luyện thi IELTS mới nhất.', 150000.00, 50, 8, 22, 9, '2021-01-01', 'ielts-16.jpg', 'cambridge-ielts-16'),
    ('English for Business Studies', 'Sách tiếng Anh thương mại của Cambridge.', 140000.00, 40, 8, 22, 9, '2002-01-01', 'business-studies.jpg', 'english-for-business-studies'),
    ('English Phrasal Verbs in Use', 'Sách cụm động từ tiếng Anh.', 130000.00, 50, 8, 22, 9, '2004-01-01', 'phrasal-verbs.jpg', 'english-phrasal-verbs-in-use'),
    ('Barron’s IELTS Practice', 'Sách luyện thi IELTS của Barron.', 150000.00, 40, 8, 22, 9, '2017-01-01', 'barrons-ielts.jpg', 'barrons-ielts-practice'),
    ('English Conversation Practice', 'Sách luyện giao tiếp tiếng Anh.', 130000.00, 50, 8, 22, 9, '2015-01-01', 'conversation-practice.jpg', 'english-conversation-practice'),
    ('Oxford English Grammar Course', 'Sách ngữ pháp tiếng Anh của Oxford.', 140000.00, 40, 8, 22, 9, '2011-01-01', 'oxford-grammar.jpg', 'oxford-english-grammar-course'),
    ('TOEIC Listening and Reading', 'Sách luyện thi TOEIC.', 150000.00, 50, 8, 22, 9, '2018-01-01', 'toeic-listening.jpg', 'toeic-listening-and-reading'),
    ('English for Academic Purposes', 'Sách tiếng Anh học thuật.', 140000.00, 40, 8, 22, 9, '2012-01-01', 'academic-english.jpg', 'english-for-academic-purposes'),
    ('Practice Makes Perfect: English Vocabulary', 'Sách từ vựng thực hành.', 130000.00, 50, 8, 22, 9, '2016-01-01', 'practice-vocabulary.jpg', 'practice-makes-perfect-vocabulary'),
    ('Cambridge Vocabulary for IELTS', 'Sách từ vựng IELTS.', 140000.00, 40, 8, 22, 9, '2008-01-01', 'ielts-vocabulary.jpg', 'cambridge-vocabulary-for-ielts')
,
    -- Batch 3: 200 sách (Danh mục 9-11)
    -- Category 9: Sách thiếu nhi (thêm 58 sách để đạt 72)
    ('Còn chút gì để nhớ', 'Truyện thiếu nhi của Nguyễn Nhật Ánh.', 110000.00, 60, 9, 1, 1, '1989-01-01', 'con-chut-gi.jpg', 'con-chut-gi-de-nho-nhi'),
    ('Ngồi khóc trên cây', 'Truyện thiếu nhi của Nguyễn Nhật Ánh.', 120000.00, 50, 9, 1, 1, '2013-01-01', 'ngoi-khoc-cay.jpg', 'ngoi-khoc-tren-cay-nhi'),
    ('Harry Potter và Phòng chứa bí mật', 'Phần 2 của Harry Potter.', 180000.00, 60, 9, 11, 10, '1998-01-01', 'harry-potter-2.jpg', 'harry-potter-va-phong-chua-bi-mat'),
    ('The Witches', 'Truyện thiếu nhi của Roald Dahl.', 140000.00, 50, 9, 12, 6, '1983-01-01', 'the-witches.jpg', 'the-witches'),
    ('The Chronicles of Narnia', 'Loạt truyện thiếu nhi của C.S. Lewis.', 150000.00, 40, 9, 11, 6, '1950-01-01', 'narnia-chronicles.jpg', 'the-chronicles-of-narnia'),
    ('Winnie-the-Pooh', 'Truyện thiếu nhi của A.A. Milne.', 130000.00, 50, 9, 12, 6, '1926-01-01', 'winnie-pooh.jpg', 'winnie-the-pooh'),
    ('Alice’s Adventures in Wonderland', 'Truyện thiếu nhi của Lewis Carroll.', 140000.00, 40, 9, 12, 6, '1865-01-01', 'alice-wonderland.jpg', 'alices-adventures-in-wonderland'),
    ('Peter Pan', 'Truyện thiếu nhi của J.M. Barrie.', 130000.00, 50, 9, 12, 6, '1911-01-01', 'peter-pan.jpg', 'peter-pan'),
    ('The Tale of Peter Rabbit', 'Truyện thiếu nhi của Beatrix Potter.', 120000.00, 60, 9, 12, 6, '1902-01-01', 'peter-rabbit.jpg', 'the-tale-of-peter-rabbit'),
    ('Bạch Tuyết và bảy chú lùn', 'Truyện cổ tích của anh em Grimm.', 110000.00, 50, 9, 12, 2, '1812-01-01', 'bach-tuyet.jpg', 'bach-tuyet-va-bay-chu-lun'),
    -- Thêm 48 sách tương tự (giả định, như "Truyện thiếu nhi [Tác giả] [Số thứ tự]")

    -- Category 10: Sách dạy nấu ăn (thêm 57 sách để đạt 71)
    ('5 Ingredients', 'Sách nấu ăn nhanh của Jamie Oliver.', 210000.00, 30, 10, 78, 6, '2017-01-01', '5-ingredients.jpg', '5-ingredients'),
    ('Jerusalem', 'Sách nấu ăn Israel của Yotam Ottolenghi.', 220000.00, 20, 10, 81, 6, '2012-01-01', 'jerusalem.jpg', 'jerusalem-cookbook'),
    ('Nigella Bites', 'Sách nấu ăn gia đình của Nigella Lawson.', 210000.00, 30, 10, 80, 6, '2001-01-01', 'nigella-bites.jpg', 'nigella-bites'),
    ('Gordon Ramsay’s Ultimate Cookery Course', 'Sách nấu ăn của Gordon Ramsay.', 230000.00, 20, 10, 83, 6, '2012-01-01', 'ramsay-ultimate.jpg', 'gordon-ramsays-ultimate-cookery'),
    ('Mary Berry’s Complete Cookbook', 'Sách nấu ăn của Mary Berry.', 220000.00, 20, 10, 84, 6, '1994-01-01', 'mary-berry-complete.jpg', 'mary-berrys-complete-cookbook'),
    ('Rick Stein’s India', 'Sách nấu ăn Ấn Độ của Rick Stein.', 210000.00, 30, 10, 85, 6, '2013-01-01', 'rick-stein-india.jpg', 'rick-steins-india'),
    ('Vietnamese Street Food', 'Sách nấu ăn đường phố Việt của Soma Trương.', 180000.00, 30, 10, 82, 5, '2016-01-01', 'viet-street-food.jpg', 'vietnamese-street-food'),
    ('The Complete Vegetarian Cookbook', 'Sách nấu ăn chay của America’s Test Kitchen.', 220000.00, 20, 10, 78, 6, '2015-01-01', 'vegetarian-cookbook.jpg', 'the-complete-vegetarian-cookbook'),
    ('The Joy of Cooking', 'Sách nấu ăn kinh điển của Irma Rombauer.', 230000.00, 20, 10, 78, 6, '1931-01-01', 'joy-cooking.jpg', 'the-joy-of-cooking'),
    ('Plenty More', 'Sách nấu ăn chay của Yotam Ottolenghi.', 220000.00, 20, 10, 81, 6, '2014-01-01', 'plenty-more.jpg', 'plenty-more'),
    -- Thêm 47 sách tương tự (giả định, như "Sách nấu ăn [Tác giả] [Số thứ tự]")

    -- Category 11: Đồ chơi (thêm 57 sách để đạt 71)
    ('Hướng dẫn làm mô hình giấy', 'Sách hướng dẫn làm mô hình giấy cho trẻ.', 60000.00, 70, 11, 22, 2, '2020-01-01', 'mo-hinh-giay.jpg', 'huong-dan-lam-mo-hinh-giay'),
    ('Sách học chơi cờ tướng', 'Hướng dẫn cờ tướng cho trẻ em.', 65000.00, 60, 11, 22, 2, '2019-01-01', 'co-tuong-tre.jpg', 'sach-hoc-choi-co-tuong'),
    ('Bộ thẻ học màu sắc', 'Sách giáo dục màu sắc qua thẻ.', 50000.00, 80, 11, 22, 2, '2020-01-01', 'the-mau-sac.jpg', 'bo-the-hoc-mau-sac'),
    ('Hướng dẫn làm đồ chơi gỗ', 'Sách hướng dẫn làm đồ chơi từ gỗ.', 70000.00, 50, 11, 22, 2, '2021-01-01', 'do-choi-go.jpg', 'huong-dan-lam-do-choi-go'),
    ('Sách học lắp ráp mô hình', 'Hướng dẫn lắp ráp mô hình cho trẻ.', 60000.00, 70, 11, 22, 2, '2020-01-01', 'lap-rap-mo-hinh.jpg', 'sach-hoc-lap-rap-mo-hinh'),
    ('Bộ flashcard chữ số', 'Sách giáo dục số đếm qua flashcard.', 55000.00, 80, 11, 22, 2, '2019-01-01', 'flashcard-chu-so.jpg', 'bo-flashcard-chu-so'),
    ('Sách hướng dẫn chơi trò chơi logic', 'Hướng dẫn trò chơi logic cho trẻ.', 60000.00, 70, 11, 22, 2, '2020-01-01', 'tro-choi-logic.jpg', 'sach-choi-tro-choi-logic'),
    ('Học vẽ với bộ màu sáp', 'Sách hướng dẫn vẽ tranh cho trẻ.', 55000.00, 80, 11, 22, 2, '2019-01-01', 'mau-sap.jpg', 'hoc-ve-voi-bo-mau-sap'),
    ('Sách hướng dẫn làm thủ công giấy', 'Hướng dẫn làm thủ công giấy cho trẻ.', 60000.00, 70, 11, 22, 2, '2020-01-01', 'thu-cong-giay.jpg', 'huong-dan-lam-thu-cong-giay'),
    ('Bộ thẻ học hình dạng', 'Sách giáo dục hình dạng qua thẻ.', 50000.00, 80, 11, 22, 2, '2019-01-01', 'the-hinh-dang.jpg', 'bo-the-hoc-hinh-dang')
,
    -- Batch 4: 200 sách (Danh mục 12-14)
    -- Category 12: Khoa học (thêm 57 sách để đạt 71)
    ('The God Delusion', 'Sách khoa học của Richard Dawkins.', 160000.00, 40, 12, 61, 9, '2006-01-01', 'god-delusion.jpg', 'the-god-delusion'),
    ('Pale Blue Dot', 'Sách khoa học vũ trụ của Carl Sagan.', 170000.00, 50, 12, 60, 9, '1994-01-01', 'pale-blue-dot.jpg', 'pale-blue-dot'),
    ('The Fabric of the Cosmos', 'Sách vật lý của Brian Greene.', 180000.00, 40, 12, 70, 9, '2004-01-01', 'fabric-cosmos.jpg', 'the-fabric-of-the-cosmos'),
    ('The Future of Humanity', 'Sách tương lai của Michio Kaku.', 190000.00, 30, 12, 71, 9, '2018-01-01', 'future-humanity.jpg', 'the-future-of-humanity'),
    ('Surely You’re Joking, Mr. Feynman!', 'Sách khoa học hài hước của Richard Feynman.', 160000.00, 50, 12, 72, 9, '1985-01-01', 'feynman-joking.jpg', 'surely-youre-joking-mr-feynman'),
    ('The Diversity of Life', 'Sách sinh học của E.O. Wilson.', 150000.00, 40, 12, 59, 9, '1992-01-01', 'diversity-life.jpg', 'the-diversity-of-life'),
    ('The Selfish Gene (Tái bản)', 'Sách sinh học của Richard Dawkins.', 160000.00, 40, 12, 61, 9, '2006-01-01', 'selfish-gene-re.jpg', 'the-selfish-gene-reprint'),
    ('A Short History of Nearly Everything', 'Sách khoa học của Bill Bryson.', 170000.00, 50, 12, 62, 9, '2003-01-01', 'short-history-re.jpg', 'a-short-history-reprint'),
    ('The Third Chimpanzee', 'Sách tiến hóa của Jared Diamond.', 160000.00, 40, 12, 59, 9, '1991-01-01', 'third-chimpanzee.jpg', 'the-third-chimpanzee'),
    ('The Gene', 'Sách về gen của Siddhartha Mukherjee.', 180000.00, 30, 12, 59, 9, '2016-01-01', 'the-gene.jpg', 'the-gene'),
    -- Thêm 47 sách tương tự (giả định, như "Sách khoa học [Tác giả] [Số thứ tự]")

    -- Category 13: Du lịch (thêm 57 sách để đạt 71)
    ('Neither Here nor There', 'Du lịch châu Âu của Bill Bryson.', 150000.00, 30, 13, 62, 7, '1991-01-01', 'neither-here.jpg', 'neither-here-nor-there'),
    ('The Old Patagonian Express', 'Hành trình Nam Mỹ của Paul Theroux.', 140000.00, 40, 13, 63, 7, '1979-01-01', 'patagonian-express.jpg', 'the-old-patagonian-express'),
    ('Hà Nội 36 phố phường', 'Tùy bút du lịch của Thạch Lam.', 90000.00, 50, 13, 7, 4, '1940-01-01', 'ha-noi-36.jpg', 'ha-noi-36-pho-phuong'),
    ('Sông nước miền Tây', 'Du lịch miền Tây của Nguyễn Ngọc Tư.', 100000.00, 40, 13, 86, 1, '2006-01-01', 'song-nuoc-mien-tay.jpg', 'song-nuoc-mien-tay'),
    ('Dark Star Safari', 'Hành trình châu Phi của Paul Theroux.', 150000.00, 30, 13, 63, 7, '2002-01-01', 'dark-star-safari.jpg', 'dark-star-safari'),
    ('A Time of Gifts', 'Du lịch châu Âu của Patrick Leigh Fermor.', 140000.00, 40, 13, 62, 7, '1977-01-01', 'time-of-gifts.jpg', 'a-time-of-gifts'),
    ('The Road to Oxiana', 'Du lịch Trung Đông của Robert Byron.', 150000.00, 30, 13, 62, 7, '1937-01-01', 'road-oxiana.jpg', 'the-road-to-oxiana'),
    ('The Motorcycle Diaries', 'Hành trình Nam Mỹ của Che Guevara.', 140000.00, 40, 13, 62, 7, '1993-01-01', 'motorcycle-diaries.jpg', 'the-motorcycle-diaries'),
    ('Into the Wild', 'Hành trình Alaska của Jon Krakauer.', 150000.00, 30, 13, 62, 7, '1996-01-01', 'into-the-wild.jpg', 'into-the-wild'),
    ('Việt Nam phong cảnh', 'Tùy bút du lịch của Nguyễn Tuân.', 90000.00, 50, 13, 66, 4, '1941-01-01', 'viet-nam-phong-canh.jpg', 'viet-nam-phong-canh'),
    -- Thêm 47 sách tương tự (giả định, như "Sách du lịch [Tác giả] [Số thứ tự]")

    -- Category 14: Công nghệ (thêm 57 sách để đạt 71)
    ('AI Superpowers', 'Sách AI của Kai-Fu Lee.', 190000.00, 30, 14, 76, 9, '2018-01-01', 'ai-superpowers.jpg', 'ai-superpowers'),
    ('The Age of Surveillance Capitalism', 'Sách công nghệ của Shoshana Zuboff.', 200000.00, 20, 14, 76, 6, '2019-01-01', 'surveillance-capitalism.jpg', 'the-age-of-surveillance-capitalism'),
    ('The Art of Computer Programming', 'Sách lập trình của Donald Knuth.', 220000.00, 20, 14, 76, 9, '1968-01-01', 'art-programming.jpg', 'the-art-of-computer-programming'),
    ('Clean Code', 'Sách lập trình của Robert C. Martin.', 180000.00, 30, 14, 76, 9, '2008-01-01', 'clean-code.jpg', 'clean-code'),
    ('You Don’t Know JS', 'Sách JavaScript của Kyle Simpson.', 170000.00, 40, 14, 76, 9, '2014-01-01', 'you-dont-know-js.jpg', 'you-dont-know-js'),
    ('The Pragmatic Programmer', 'Sách lập trình của Andrew Hunt.', 190000.00, 30, 14, 76, 9, '1999-01-01', 'pragmatic-programmer.jpg', 'the-pragmatic-programmer'),
    ('Design Patterns', 'Sách thiết kế phần mềm của Erich Gamma.', 200000.00, 20, 14, 76, 9, '1994-01-01', 'design-patterns.jpg', 'design-patterns'),
    ('Introduction to Algorithms', 'Sách thuật toán của Thomas Cormen.', 210000.00, 20, 14, 76, 9, '1989-01-01', 'intro-algorithms.jpg', 'introduction-to-algorithms'),
    ('Code Complete', 'Sách phát triển phần mềm của Steve McConnell.', 190000.00, 30, 14, 76, 9, '1993-01-01', 'code-complete.jpg', 'code-complete'),
    ('The Phoenix Project', 'Sách DevOps của Gene Kim.', 180000.00, 40, 14, 76, 9, '2013-01-01', 'phoenix-project.jpg', 'the-phoenix-project'),


    -- Category 1: Đồ dùng học tập (71 sách)
    ('Hướng dẫn sử dụng bút thông minh mới', 'Hướng dẫn bút thông minh thế hệ mới cho học sinh.', 55000.00, 90, 1, 22, 3, '2022-01-01', 'but-thong-minh-moi.jpg', 'huong-dan-but-thong-minh-moi-1'),
    ('Sổ tay học tập sáng tạo', 'Sổ tay hỗ trợ học tập hiệu quả cho học sinh.', 45000.00, 80, 1, 31, 1, '2021-06-01', 'so-tay-sang-tao.jpg', 'so-tay-hoc-tap-sang-tao-moi-1'),
    ('Bộ thẻ học bảng chữ cái mới', 'Sách giáo cụ học chữ cái qua thẻ mới.', 50000.00, 100, 1, 22, 3, '2022-03-01', 'the-chu-cai-moi.jpg', 'bo-the-hoc-chu-cai-moi-1'),
    ('Học vẽ kỹ thuật nâng cao', 'Hướng dẫn vẽ kỹ thuật cho học sinh phổ thông.', 60000.00, 70, 1, 22, 3, '2021-09-01', 've-ky-thuat-nang-cao.jpg', 'hoc-ve-ky-thuat-nang-cao-moi-1'),
    ('Sách hướng dẫn sử dụng bảng tương tác', 'Hướng dẫn dùng bảng tương tác trong lớp học.', 65000.00, 80, 1, 22, 3, '2022-02-01', 'bang-tuong-tac.jpg', 'huong-dan-bang-tuong-tac-moi-1'),
    ('Tập viết chữ đẹp lớp 4', 'Sách luyện viết chữ đẹp cho học sinh lớp 4.', 35000.00, 110, 1, 22, 3, '2022-01-01', 'tap-viet-lop4.jpg', 'tap-viet-chu-dep-lop-4-moi-1'),
    ('Hướng dẫn sử dụng máy tính học tập', 'Hướng dẫn máy tính học tập cho học sinh.', 55000.00, 90, 1, 22, 3, '2021-04-01', 'may-tinh-hoc-tap.jpg', 'huong-dan-may-tinh-hoc-tap-moi-1'),
    ('Bộ flashcard học toán mới', 'Sách giáo cụ học toán qua flashcard.', 60000.00, 80, 1, 22, 3, '2022-05-01', 'flashcard-toan-moi.jpg', 'bo-flashcard-toan-moi-1'),
    ('Sách học kỹ năng ghi chú mới', 'Hướng dẫn ghi chú sáng tạo cho học sinh.', 45000.00, 70, 1, 31, 1, '2021-07-01', 'ghi-chu-moi.jpg', 'sach-ky-nang-ghi-chu-moi-1'),
    ('Hướng dẫn sử dụng thước kẻ đa năng', 'Hướng dẫn thước kẻ đa năng cho học sinh.', 40000.00, 60, 1, 22, 3, '2022-03-01', 'thuoc-ke-da-nang.jpg', 'huong-dan-thuoc-ke-da-nang-moi-1'),
    -- Thêm 61 sách tương tự (ví dụ: "Sách học [chủ đề] mới [số thứ tự]")

    -- Category 2: Sách giáo khoa (71 sách)
    ('Toán lớp 6 mới', 'Sách giáo khoa Toán lớp 6 chương trình mới.', 30000.00, 150, 2, 22, 3, '2022-01-01', 'toan-6-moi.jpg', 'sach-toan-lop-6-moi-1'),
    ('Ngữ văn lớp 7 mới', 'Sách giáo khoa Ngữ văn lớp 7 chương trình mới.', 32000.00, 140, 2, 22, 3, '2022-01-01', 'van-7-moi.jpg', 'sach-van-lop-7-moi-1'),
    ('Khoa học tự nhiên lớp 8', 'Sách giáo khoa Khoa học tự nhiên lớp 8.', 31000.00, 130, 2, 22, 3, '2022-01-01', 'khoa-hoc-8.jpg', 'sach-khoa-hoc-tu-nhien-lop-8-moi-1'),
    ('Lịch sử và Địa lý lớp 6', 'Sách giáo khoa Lịch sử và Địa lý lớp 6.', 30000.00, 140, 2, 22, 3, '2022-01-01', 'lich-su-dia-ly-6.jpg', 'sach-lich-su-dia-ly-lop-6-moi-1'),
    ('Tiếng Anh lớp 7 mới', 'Sách giáo khoa Tiếng Anh lớp 7 chương trình mới.', 35000.00, 130, 2, 22, 3, '2022-01-01', 'tieng-anh-7-moi.jpg', 'sach-tieng-anh-lop-7-moi-1'),
    ('Giáo dục công dân lớp 8', 'Sách giáo khoa GDCD lớp 8 chương trình mới.', 30000.00, 140, 2, 22, 3, '2022-01-01', 'gdcd-8.jpg', 'sach-gdcd-lop-8-moi-1'),
    ('Khoa học tự nhiên lớp 7', 'Sách giáo khoa Khoa học tự nhiên lớp 7.', 31000.00, 130, 2, 22, 3, '2022-01-01', 'khoa-hoc-7.jpg', 'sach-khoa-hoc-tu-nhien-lop-7-moi-1'),
    ('Ngữ văn lớp 8 mới', 'Sách giáo khoa Ngữ văn lớp 8 chương trình mới.', 32000.00, 140, 2, 22, 3, '2022-01-01', 'van-8-moi.jpg', 'sach-van-lop-8-moi-1'),
    ('Toán lớp 7 mới', 'Sách giáo khoa Toán lớp 7 chương trình mới.', 31000.00, 130, 2, 22, 3, '2022-01-01', 'toan-7-moi.jpg', 'sach-toan-lop-7-moi-1'),
    ('Lịch sử lớp 7 mới', 'Sách giáo khoa Lịch sử lớp 7 chương trình mới.', 30000.00, 140, 2, 22, 3, '2022-01-01', 'lich-su-7-moi.jpg', 'sach-lich-su-lop-7-moi-1'),
    -- Thêm 61 sách tương tự (ví dụ: "Sách giáo khoa [Môn] lớp [X] mới [số thứ tự]")

    -- Category 3: Truyện (72 sách)
    ('Lá nằm trong lá', 'Tiểu thuyết tuổi thơ của Nguyễn Nhật Ánh.', 110000.00, 80, 3, 1, 1, '2012-01-01', 'la-nam-trong-la.jpg', 'la-nam-trong-la-moi-1'),
    ('Chuyện xứ Lang Biang', 'Truyện giả tưởng của Nguyễn Nhật Ánh.', 120000.00, 70, 3, 1, 1, '2006-01-01', 'xu-lang-biang.jpg', 'chuyen-xu-lang-biang-moi-1'),
    ('Sông', 'Truyện ngắn của Nguyễn Ngọc Tư.', 95000.00, 60, 3, 86, 1, '2008-01-01', 'song-nguyen-ngoc-tu.jpg', 'song-moi-1'),
    ('Five Go Adventuring Again', 'Truyện phiêu lưu của Enid Blyton.', 130000.00, 50, 3, 13, 6, '1943-01-01', 'five-adventuring.jpg', 'five-go-adventuring-again-moi-1'),
    ('Danny, the Champion of the World', 'Truyện thiếu nhi của Roald Dahl.', 140000.00, 60, 3, 12, 6, '1975-01-01', 'danny-champion.jpg', 'danny-champion-of-the-world-moi-1'),
    ('The Twits', 'Truyện thiếu nhi của Roald Dahl.', 130000.00, 50, 3, 12, 6, '1980-01-01', 'the-twits.jpg', 'the-twits-moi-1'),
    ('The Adventures of Huckleberry Finn', 'Tiểu thuyết của Mark Twain.', 140000.00, 60, 3, 18, 6, '1884-01-01', 'huckleberry-finn.jpg', 'adventures-of-huckleberry-finn-moi-1'),
    ('Kidnapped', 'Truyện phiêu lưu của Robert Louis Stevenson.', 130000.00, 50, 3, 18, 6, '1886-01-01', 'kidnapped.jpg', 'kidnapped-moi-1'),
    ('The Naughtiest Girl in the School', 'Truyện thiếu nhi của Enid Blyton.', 130000.00, 50, 3, 13, 6, '1940-01-01', 'naughtiest-girl.jpg', 'naughtiest-girl-in-school-moi-1'),
    ('Pollyanna', 'Truyện thiếu nhi của Eleanor H. Porter.', 140000.00, 50, 3, 12, 6, '1913-01-01', 'pollyanna.jpg', 'pollyanna-moi-1'),
    -- Thêm 62 sách tương tự (ví dụ: "Truyện [Tác giả] mới [số thứ tự]")

    -- Category 4: Sách trinh thám (72 sách)
    ('The ABC Murders', 'Trinh thám của Agatha Christie.', 150000.00, 60, 4, 14, 7, '1936-01-01', 'abc-murders.jpg', 'the-abc-murders-moi-1'),
    ('A Study in Scarlet', 'Trinh thám Sherlock Holmes của Arthur Conan Doyle.', 140000.00, 50, 4, 15, 7, '1887-01-01', 'study-in-scarlet.jpg', 'a-study-in-scarlet-moi-1'),
    ('The Girl Who Kicked the Hornet’s Nest', 'Trinh thám của Stieg Larsson.', 160000.00, 40, 4, 53, 6, '2007-01-01', 'girl-hornet.jpg', 'girl-who-kicked-hornets-nest-moi-1'),
    ('Dark Places', 'Trinh thám tâm lý của Gillian Flynn.', 150000.00, 50, 4, 54, 6, '2009-01-01', 'dark-places.jpg', 'dark-places-moi-1'),
    ('The Price of Salt', 'Trinh thám tâm lý của Patricia Highsmith.', 140000.00, 40, 4, 51, 7, '1952-01-01', 'price-of-salt.jpg', 'the-price-of-salt-moi-1'),
    ('Maigret and the Enigmatic Lett', 'Trinh thám Maigret của Georges Simenon.', 140000.00, 50, 4, 52, 7, '1931-01-01', 'maigret-lett.jpg', 'maigret-and-enigmatic-lett-moi-1'),
    ('Hành trình bóng đêm', 'Trinh thám Việt Nam của Tuệ Sống.', 100000.00, 60, 4, 55, 1, '2017-01-01', 'hanh-trinh-bong-dem.jpg', 'hanh-trinh-bong-dem-moi-1'),
    ('Mê cung trắng', 'Trinh thám của Đinh Mặc.', 110000.00, 50, 4, 57, 5, '2016-01-01', 'me-cung-trang.jpg', 'me-cung-trang-moi-1'),
    ('Ký sự pháp đình', 'Trinh thám kinh dị của Quỷ Cổ Nữ.', 120000.00, 40, 4, 58, 5, '2015-01-01', 'ky-su-phap-dinh.jpg', 'ky-su-phap-dinh-moi-1'),
    ('The Thin Man', 'Trinh thám của Dashiell Hammett.', 140000.00, 50, 4, 14, 7, '1934-01-01', 'thin-man.jpg', 'the-thin-man-moi-1'),
    -- Category 5: Văn học (73 sách)
    ('Gió lạnh đầu mùa', 'Truyện ngắn của Thạch Lam.', 80000.00, 50, 5, 7, 4, '1937-01-01', 'gio-lanh-dau-mua.jpg', 'gio-lanh-dau-mua-moi-1'),
    ('Hồn bướm mơ tiên', 'Tiểu thuyết của Khái Hưng.', 85000.00, 40, 5, 7, 4, '1933-01-01', 'hon-buom-mo-tien.jpg', 'hon-buom-mo-tien-moi-1'),
    ('Tướng về hưu', 'Truyện ngắn của Nguyễn Huy Thiệp.', 90000.00, 50, 5, 23, 4, '1988-01-01', 'tuong-ve-huu.jpg', 'tuong-ve-huu-moi-1'),
    ('Slaughterhouse-Five', 'Tiểu thuyết của Kurt Vonnegut.', 150000.00, 40, 5, 16, 6, '1969-01-01', 'slaughterhouse-five.jpg', 'slaughterhouse-five-moi-1'),
    ('Fahrenheit 451', 'Tiểu thuyết dystopia của Ray Bradbury.', 140000.00, 50, 5, 16, 6, '1953-01-01', 'fahrenheit-451.jpg', 'fahrenheit-451-moi-1'),
    ('The Bell Jar', 'Tiểu thuyết của Sylvia Plath.', 140000.00, 40, 5, 16, 6, '1963-01-01', 'bell-jar.jpg', 'the-bell-jar-moi-1'),
    ('Invisible Man', 'Tiểu thuyết của Ralph Ellison.', 150000.00, 50, 5, 16, 6, '1952-01-01', 'invisible-man.jpg', 'invisible-man-moi-1'),
    ('The Handmaid’s Tale', 'Tiểu thuyết dystopia của Margaret Atwood.', 140000.00, 40, 5, 16, 6, '1985-01-01', 'handmaids-tale.jpg', 'the-handmaids-tale-moi-1'),
    ('Their Eyes Were Watching God', 'Tiểu thuyết của Zora Neale Hurston.', 140000.00, 50, 5, 16, 6, '1937-01-01', 'their-eyes.jpg', 'their-eyes-were-watching-god-moi-1'),
    ('Ulysses', 'Tiểu thuyết của James Joyce.', 150000.00, 40, 5, 16, 6, '1922-01-01', 'ulysses.jpg', 'ulysses-moi-1'),
    -- Thêm 63 sách tương tự (ví dụ: "Tiểu thuyết [Tác giả] mới [số thứ tự]")

    -- Category 6: Kinh tế (72 sách)
    ('Economics in One Lesson', 'Sách kinh tế của Henry Hazlitt.', 160000.00, 40, 6, 30, 6, '1946-01-01', 'economics-one-lesson.jpg', 'economics-in-one-lesson-moi-1'),
    ('The Road to Serfdom', 'Sách kinh tế của Friedrich Hayek.', 170000.00, 50, 6, 30, 6, '1944-01-01', 'road-to-serfdom.jpg', 'the-road-to-serfdom-moi-1'),
    ('The Tipping Point', 'Sách kinh tế xã hội của Malcolm Gladwell.', 150000.00, 40, 6, 30, 6, '2000-01-01', 'tipping-point.jpg', 'the-tipping-point-moi-1'),
    ('Outliers', 'Sách thành công của Malcolm Gladwell.', 160000.00, 50, 6, 30, 6, '2008-01-01', 'outliers.jpg', 'outliers-moi-1'),
    ('Blink', 'Sách tư duy của Malcolm Gladwell.', 150000.00, 40, 6, 30, 6, '2005-01-01', 'blink.jpg', 'blink-moi-1'),
    ('The Black Swan', 'Sách kinh tế của Nassim Nicholas Taleb.', 170000.00, 50, 6, 30, 6, '2007-01-01', 'black-swan.jpg', 'the-black-swan-moi-1'),
    ('Antifragile', 'Sách kinh tế của Nassim Nicholas Taleb.', 180000.00, 40, 6, 30, 6, '2012-01-01', 'antifragile.jpg', 'antifragile-moi-1'),
    ('The E-Myth Revisited', 'Sách khởi nghiệp của Michael E. Gerber.', 160000.00, 50, 6, 30, 6, '1995-01-01', 'e-myth.jpg', 'the-e-myth-revisited-moi-1'),
    ('Zero to One', 'Sách khởi nghiệp của Peter Thiel.', 170000.00, 40, 6, 30, 6, '2014-01-01', 'zero-to-one.jpg', 'zero-to-one-moi-1'),
    ('Lean In', 'Sách lãnh đạo của Sheryl Sandberg.', 160000.00, 50, 6, 30, 6, '2013-01-01', 'lean-in.jpg', 'lean-in-moi-1'),
    -- Thêm 62 sách tương tự (ví dụ: "Kinh tế [Tác giả] mới [số thứ tự]")

    -- Category 7: Tâm lý kỹ năng sống (72 sách)
    ('Start with Why', 'Sách lãnh đạo của Simon Sinek.', 150000.00, 50, 7, 31, 6, '2009-01-01', 'start-with-why.jpg', 'start-with-why-moi-1'),
    ('Leaders Eat Last', 'Sách lãnh đạo của Simon Sinek.', 160000.00, 40, 7, 31, 6, '2014-01-01', 'leaders-eat-last.jpg', 'leaders-eat-last-moi-1'),
    ('The Happiness Project', 'Sách hạnh phúc của Gretchen Rubin.', 140000.00, 50, 7, 31, 6, '2009-01-01', 'happiness-project.jpg', 'the-happiness-project-moi-1'),
    ('The Art of Happiness', 'Sách hạnh phúc của Dalai Lama.', 150000.00, 40, 7, 31, 6, '1998-01-01', 'art-happiness.jpg', 'the-art-of-happiness-moi-1'),
    ('Man’s Search for Meaning (Tái bản)', 'Sách ý nghĩa sống của Viktor Frankl.', 140000.00, 50, 7, 34, 6, '2006-01-01', 'mans-search-re.jpg', 'mans-search-for-meaning-moi-1'),
    ('Grit', 'Sách kiên trì của Angela Duckworth.', 150000.00, 40, 7, 31, 6, '2016-01-01', 'grit.jpg', 'grit-moi-1'),
    ('The Chimp Paradox', 'Sách tâm lý của Steve Peters.', 140000.00, 50, 7, 31, 6, '2012-01-01', 'chimp-paradox.jpg', 'the-chimp-paradox-moi-1'),
    ('Hạnh phúc tại tâm', 'Sách chánh niệm của Thích Nhất Hạnh.', 110000.00, 60, 7, 37, 1, '2010-01-01', 'hanh-phuc-tai-tam.jpg', 'hanh-phuc-tai-tam-moi-1'),
    ('Từng bước chân thiền', 'Sách chánh niệm của Thích Nhất Hạnh.', 100000.00, 50, 7, 37, 1, '1995-01-01', 'tung-buoc-chan-thien.jpg', 'tung-buoc-chan-thien-moi-1'),
    ('Ikigai', 'Sách ý nghĩa sống của Héctor García.', 140000.00, 40, 7, 31, 6, '2016-01-01', 'ikigai.jpg', 'ikigai-moi-1'),
    -- Thêm 62 sách tương tự (ví dụ: "Kỹ năng sống [Tác giả] mới [số thứ tự]")

    -- Category 8: Sách ngoại ngữ (71 sách)
    ('Cambridge IELTS 17', 'Sách luyện thi IELTS mới nhất.', 150000.00, 50, 8, 22, 9, '2022-01-01', 'ielts-17.jpg', 'cambridge-ielts-17-moi-1'),
    ('English for Specific Purposes', 'Sách tiếng Anh chuyên ngành.', 140000.00, 40, 8, 22, 9, '2010-01-01', 'specific-purposes.jpg', 'english-for-specific-purposes-moi-1'),
    ('English Grammar Advanced', 'Sách ngữ pháp tiếng Anh nâng cao.', 130000.00, 50, 8, 22, 9, '2015-01-01', 'grammar-advanced.jpg', 'english-grammar-advanced-moi-1'),
    ('TOEIC Speaking and Writing', 'Sách luyện thi TOEIC kỹ năng nói và viết.', 150000.00, 40, 8, 22, 9, '2018-01-01', 'toeic-speaking.jpg', 'toeic-speaking-and-writing-moi-1'),
    ('English for Everyone: Business English', 'Sách tiếng Anh thương mại.', 140000.00, 50, 8, 22, 9, '2017-01-01', 'business-english.jpg', 'english-for-everyone-business-moi-1'),
    ('Oxford Word Skills Advanced', 'Sách từ vựng nâng cao của Oxford.', 140000.00, 40, 8, 22, 9, '2010-01-01', 'word-skills-advanced.jpg', 'oxford-word-skills-advanced-moi-1'),
    ('Barron’s TOEFL Practice', 'Sách luyện thi TOEFL của Barron.', 150000.00, 50, 8, 22, 9, '2019-01-01', 'barrons-toefl.jpg', 'barrons-toefl-practice-moi-1'),
    ('English Pronunciation Advanced', 'Sách phát âm tiếng Anh nâng cao.', 130000.00, 40, 8, 22, 9, '2016-01-01', 'pronunciation-advanced.jpg', 'english-pronunciation-advanced-moi-1'),
    ('Cambridge Vocabulary for TOEFL', 'Sách từ vựng TOEFL.', 140000.00, 50, 8, 22, 9, '2012-01-01', 'toefl-vocabulary.jpg', 'cambridge-vocabulary-for-toefl-moi-1'),
    ('English Idioms Advanced', 'Sách thành ngữ tiếng Anh nâng cao.', 130000.00, 40, 8, 22, 9, '2014-01-01', 'idioms-advanced.jpg', 'english-idioms-advanced-moi-1')
,
    -- Batch 3: 250 sách mới (Danh mục 9-11)

    -- Category 9: Sách thiếu nhi (72 sách)
    ('Tôi thấy hoa vàng trên cỏ xanh (Tái bản)', 'Truyện thiếu nhi của Nguyễn Nhật Ánh.', 120000.00, 70, 9, 1, 1, '2020-01-01', 'hoa-vang-tai-ban.jpg', 'toi-thay-hoa-vang-tren-co-xanh-moi-1'),
    ('Bong bóng lên trời', 'Truyện thiếu nhi của Nguyễn Nhật Ánh.', 110000.00, 60, 9, 1, 1, '1995-01-01', 'bong-bong-len-troi.jpg', 'bong-bong-len-troi-moi-1'),
    ('Harry Potter và Chiếc cốc lửa', 'Phần 4 của Harry Potter.', 180000.00, 60, 9, 11, 10, '2000-01-01', 'harry-potter-4.jpg', 'harry-potter-va-chiec-coc-lua-moi-1'),
    ('George’s Marvellous Medicine', 'Truyện thiếu nhi của Roald Dahl.', 140000.00, 50, 9, 12, 6, '1981-01-01', 'georges-medicine.jpg', 'georges-marvellous-medicine-moi-1'),
    ('The Magician’s Nephew', 'Truyện Narnia của C.S. Lewis.', 150000.00, 40, 9, 11, 6, '1955-01-01', 'magicians-nephew.jpg', 'the-magicians-nephew-moi-1'),
    ('The House at Pooh Corner', 'Truyện thiếu nhi của A.A. Milne.', 130000.00, 50, 9, 12, 6, '1928-01-01', 'pooh-corner.jpg', 'the-house-at-pooh-corner-moi-1'),
    ('Through the Looking-Glass', 'Truyện thiếu nhi của Lewis Carroll.', 140000.00, 40, 9, 12, 6, '1871-01-01', 'looking-glass.jpg', 'through-the-looking-glass-moi-1'),
    ('Peter and Wendy', 'Truyện thiếu nhi của J.M. Barrie.', 130000.00, 50, 9, 12, 6, '1911-01-01', 'peter-and-wendy.jpg', 'peter-and-wendy-moi-1'),
    ('The Velveteen Rabbit', 'Truyện thiếu nhi của Margery Williams.', 120000.00, 60, 9, 12, 6, '1922-01-01', 'velveteen-rabbit.jpg', 'the-velveteen-rabbit-moi-1'),
    ('Cô bé Lọ Lem', 'Truyện cổ tích của anh em Grimm.', 110000.00, 50, 9, 12, 2, '1812-01-01', 'lo-lem.jpg', 'co-be-lo-lem-moi-1'),
    -- Thêm 62 sách tương tự (ví dụ: "Truyện thiếu nhi [Tác giả] mới [số thứ tự]")

    -- Category 10: Sách dạy nấu ăn (71 sách)
    ('Together', 'Sách nấu ăn gia đình của Jamie Oliver.', 210000.00, 30, 10, 78, 6, '2021-01-01', 'together-jamie.jpg', 'together-jamie-oliver-moi-1'),
    ('Falastin', 'Sách nấu ăn Palestine của Sami Tamimi.', 220000.00, 20, 10, 81, 6, '2020-01-01', 'falastin.jpg', 'falastin-moi-1'),
    ('Nigella’s Cook, Eat, Repeat', 'Sách nấu ăn của Nigella Lawson.', 210000.00, 30, 10, 80, 6, '2020-01-01', 'cook-eat-repeat.jpg', 'nigellas-cook-eat-repeat-moi-1'),
    ('Gordon Ramsay’s Quick and Delicious', 'Sách nấu ăn nhanh của Gordon Ramsay.', 230000.00, 20, 10, 83, 6, '2019-01-01', 'ramsay-quick.jpg', 'gordon-ramsays-quick-delicious-moi-1'),
    ('Mary Berry’s Simple Comforts', 'Sách nấu ăn gia đình của Mary Berry.', 220000.00, 20, 10, 84, 6, '2020-01-01', 'simple-comforts.jpg', 'mary-berrys-simple-comforts-moi-1'),
    ('Rick Stein’s Far Eastern Odyssey', 'Sách nấu ăn châu Á của Rick Stein.', 210000.00, 30, 10, 85, 6, '2009-01-01', 'far-eastern-odyssey.jpg', 'rick-steins-far-eastern-odyssey-moi-1'),
    ('Vietnamese Food Any Day', 'Sách nấu ăn Việt của Andrea Nguyen.', 180000.00, 30, 10, 82, 5, '2019-01-01', 'vietnamese-any-day.jpg', 'vietnamese-food-any-day-moi-1'),
    ('The Complete Mediterranean Cookbook', 'Sách nấu ăn Địa Trung Hải.', 220000.00, 20, 10, 78, 6, '2016-01-01', 'mediterranean-cookbook.jpg', 'complete-mediterranean-cookbook-moi-1'),
    ('The Silver Spoon', 'Sách nấu ăn Ý kinh điển.', 230000.00, 20, 10, 78, 6, '1950-01-01', 'silver-spoon.jpg', 'the-silver-spoon-moi-1'),
    ('Ottolenghi Test Kitchen', 'Sách nấu ăn của Yotam Ottolenghi.', 220000.00, 20, 10, 81, 6, '2021-01-01', 'test-kitchen.jpg', 'ottolenghi-test-kitchen-moi-1'),
    -- Thêm 61 sách tương tự (ví dụ: "Sách nấu ăn [Tác giả] mới [số thứ tự]")

    -- Category 11: Đồ chơi (71 sách)
    ('Hướng dẫn làm mô hình giấy nâng cao', 'Sách hướng dẫn làm mô hình giấy cho trẻ.', 60000.00, 70, 11, 22, 2, '2022-01-01', 'mo-hinh-giay-nang-cao.jpg', 'huong-dan-mo-hinh-giay-nang-cao-moi-1'),
    ('Sách học chơi cờ vua nâng cao', 'Hướng dẫn cờ vua nâng cao cho trẻ.', 65000.00, 60, 11, 22, 2, '2022-01-01', 'co-vua-nang-cao.jpg', 'sach-hoc-co-vua-nang-cao-moi-1'),
    ('Bộ thẻ học số đếm mới', 'Sách giáo dục số đếm qua thẻ mới.', 50000.00, 80, 11, 22, 2, '2022-01-01', 'the-so-dem-moi.jpg', 'bo-the-hoc-so-dem-moi-1'),
    ('Hướng dẫn làm đồ chơi từ nhựa', 'Sách hướng dẫn làm đồ chơi từ nhựa.', 70000.00, 50, 11, 22, 2, '2022-01-01', 'do-choi-nhua.jpg', 'huong-dan-lam-do-choi-nhua-moi-1'),
    ('Sách học lắp ráp robot nâng cao', 'Hướng dẫn lắp ráp robot cho trẻ.', 90000.00, 50, 11, 22, 2, '2022-01-01', 'robot-nang-cao.jpg', 'sach-hoc-lap-rap-robot-nang-cao-moi-1'),
    ('Bộ flashcard động vật mới', 'Sách giáo dục động vật qua flashcard.', 60000.00, 70, 11, 22, 2, '2022-01-01', 'flashcard-dong-vat-moi.jpg', 'bo-flashcard-dong-vat-moi-1'),
    ('Sách hướng dẫn chơi Rubik nâng cao', 'Hướng dẫn giải Rubik nâng cao.', 65000.00, 60, 11, 22, 2, '2022-01-01', 'rubik-nang-cao.jpg', 'huong-dan-choi-rubik-nang-cao-moi-1'),
    ('Học vẽ với bộ màu chì', 'Sách hướng dẫn vẽ tranh cho trẻ.', 55000.00, 80, 11, 22, 2, '2022-01-01', 'mau-chi.jpg', 'hoc-ve-voi-bo-mau-chi-moi-1'),
    ('Sách hướng dẫn làm thủ công vải', 'Hướng dẫn làm đồ thủ công từ vải.', 60000.00, 70, 11, 22, 2, '2022-01-01', 'thu-cong-vai.jpg', 'huong-dan-lam-thu-cong-vai-moi-1'),
    ('Bộ thẻ học hình học mới', 'Sách giáo dục hình học qua thẻ.', 50000.00, 80, 11, 22, 2, '2022-01-01', 'the-hinh-hoc-moi.jpg', 'bo-the-hoc-hinh-hoc-moi-1')
,
    -- Thêm 61 sách tương tự (ví dụ: "Sách đồ chơi [Chủ đề] mới [số thứ tự]")
    -- Batch 4: 250 sách mới (Danh mục 12-14)-- Category 12: Khoa học (71 sách)
    ('The Greatest Show on Earth', 'Sách tiến hóa của Richard Dawkins.', 160000.00, 40, 12, 61, 9, '2009-01-01', 'greatest-show.jpg', 'the-greatest-show-on-earth-moi-1'),
    ('Contact', 'Sách khoa học viễn tưởng của Carl Sagan.', 170000.00, 50, 12, 60, 9, '1985-01-01', 'contact.jpg', 'contact-moi-1'),
    ('The Hidden Reality', 'Sách vật lý của Brian Greene.', 180000.00, 40, 12, 70, 9, '2011-01-01', 'hidden-reality.jpg', 'the-hidden-reality-moi-1'),
    ('Parallel Worlds', 'Sách vũ trụ của Michio Kaku.', 190000.00, 30, 12, 71, 9, '2004-01-01', 'parallel-worlds.jpg', 'parallel-worlds-moi-1'),
    ('The Pleasure of Finding Things Out', 'Sách khoa học của Richard Feynman.', 160000.00, 50, 12, 72, 9, '1999-01-01', 'pleasure-finding.jpg', 'pleasure-of-finding-things-out-moi-1'),
    ('The Social Conquest of Earth', 'Sách sinh học của E.O. Wilson.', 150000.00, 40, 12, 59, 9, '2012-01-01', 'social-conquest.jpg', 'the-social-conquest-of-earth-moi-1'),
    ('The Blind Watchmaker (Tái bản)', 'Sách tiến hóa của Richard Dawkins.', 160000.00, 40, 12, 61, 9, '2006-01-01', 'blind-watchmaker-re.jpg', 'the-blind-watchmaker-moi-1'),
    ('Guns, Germs, and Steel', 'Sách lịch sử khoa học của Jared Diamond.', 170000.00, 50, 12, 59, 9, '1997-01-01', 'guns-germs-steel.jpg', 'guns-germs-and-steel-moi-1'),
    ('The Emperor’s New Mind', 'Sách khoa học của Roger Penrose.', 180000.00, 40, 12, 59, 9, '1989-01-01', 'emperors-mind.jpg', 'the-emperors-new-mind-moi-1'),
    ('The Emperor of All Maladies', 'Sách về ung thư của Siddhartha Mukherjee.', 180000.00, 30, 12, 59, 9, '2010-01-01', 'emperor-maladies.jpg', 'the-emperor-of-all-maladies-moi-1'),
    -- Thêm 61 sách tương tự (ví dụ: "Sách khoa học [Tác giả] mới [số thứ tự]")

    -- Category 13: Du lịch (71 sách)
    ('The Sun Also Rises', 'Tiểu thuyết du lịch của Ernest Hemingway.', 150000.00, 30, 13, 62, 7, '1926-01-01', 'sun-rises.jpg', 'the-sun-also-rises-moi-1'),
    ('Ghost Train to the Eastern Star', 'Hành trình châu Á của Paul Theroux.', 140000.00, 40, 13, 63, 7, '2008-01-01', 'ghost-train.jpg', 'ghost-train-to-eastern-star-moi-1'),
    ('Sài Gòn thì mưa', 'Tùy bút du lịch của Nguyễn Ngọc Tư.', 100000.00, 50, 13, 86, 1, '2010-01-01', 'sai-gon-thi-mua.jpg', 'sai-gon-thi-mua-moi-1'),
    ('Đi tìm lẽ sống', 'Tùy bút du lịch của Nguyễn Tuân.', 90000.00, 40, 13, 66, 4, '1945-01-01', 'di-tim-le-song.jpg', 'di-tim-le-song-moi-1'),
    ('The Snow Leopard', 'Hành trình Himalaya của Peter Matthiessen.', 150000.00, 30, 13, 62, 7, '1978-01-01', 'snow-leopard.jpg', 'the-snow-leopard-moi-1'),
    ('Between the Woods and the Water', 'Du lịch châu Âu của Patrick Leigh Fermor.', 140000.00, 40, 13, 62, 7, '1986-01-01', 'woods-water.jpg', 'between-woods-and-water-moi-1'),
    ('Arabian Sands', 'Du lịch Trung Đông của Wilfred Thesiger.', 150000.00, 30, 13, 62, 7, '1959-01-01', 'arabian-sands.jpg', 'arabian-sands-moi-1'),
    ('Jupiter’s Travels', 'Hành trình xe máy của Ted Simon.', 140000.00, 40, 13, 62, 7, '1979-01-01', 'jupiters-travels.jpg', 'jupiters-travels-moi-1'),
    ('Tracks', 'Hành trình sa mạc của Robyn Davidson.', 150000.00, 30, 13, 62, 7, '1980-01-01', 'tracks.jpg', 'tracks-moi-1'),
    ('Hà Nội một thời', 'Tùy bút du lịch của Tô Hoài.', 90000.00, 50, 13, 4, 4, '1950-01-01', 'ha-noi-mot-thoi.jpg', 'ha-noi-mot-thoi-moi-1'),
    -- Thêm 61 sách tương tự (ví dụ: "Sách du lịch [Tác giả] mới [số thứ tự]")

    -- Category 14: Công nghệ (71 sách)
    ('The Mythical Man-Month', 'Sách phát triển phần mềm của Fred Brooks.', 190000.00, 30, 14, 76, 9, '1975-01-01', 'mythical-man-month.jpg', 'the-mythical-man-month-moi-1'),
    ('Refactoring', 'Sách cải tiến mã nguồn của Martin Fowler.', 200000.00, 20, 14, 76, 9, '1999-01-01', 'refactoring.jpg', 'refactoring-moi-1'),
    ('The Cathedral and the Bazaar', 'Sách mã nguồn mở của Eric S. Raymond.', 180000.00, 40, 14, 76, 9, '1999-01-01', 'cathedral-bazaar.jpg', 'the-cathedral-and-the-bazaar-moi-1'),
    ('Artificial Intelligence: A Guide', 'Sách AI của Melanie Mitchell.', 190000.00, 30, 14, 76, 9, '2019-01-01', 'ai-guide.jpg', 'artificial-intelligence-guide-moi-1'),
    ('The Data Science Handbook', 'Sách khoa học dữ liệu của Field Cady.', 200000.00, 20, 14, 76, 9, '2017-01-01', 'data-science-handbook.jpg', 'the-data-science-handbook-moi-1'),
    ('Python Crash Course', 'Sách lập trình Python của Eric Matthes.', 190000.00, 30, 14, 76, 9, '2015-01-01', 'python-crash-course.jpg', 'python-crash-course-moi-1'),
    ('The C Programming Language', 'Sách lập trình C của Brian Kernighan.', 180000.00, 40, 14, 76, 9, '1978-01-01', 'c-programming.jpg', 'the-c-programming-language-moi-1'),
    ('Algorithms to Live By', 'Sách thuật toán của Brian Christian.', 190000.00, 30, 14, 76, 9, '2016-01-01', 'algorithms-live.jpg', 'algorithms-to-live-by-moi-1'),
    ('The Innovator’s Dilemma', 'Sách công nghệ của Clayton Christensen.', 180000.00, 40, 14, 76, 6, '1997-01-01', 'innovators-dilemma.jpg', 'the-innovators-dilemma-moi-1'),
    ('The Machine That Changed the World', 'Sách công nghệ sản xuất của James Womack.', 190000.00, 30, 14, 76, 6, '1990-01-01', 'machine-changed.jpg', 'machine-that-changed-world-moi-1'),

--     SELECT book_id, title, description, price, stock, category_id, author_id, publisher_id, published_date, cover_image, slug, created_at, updated_at
-- FROM books
-- ORDER BY book_id

    -- Category 1: Đồ dùng học tập (71 sách)
    ('Hướng dẫn sử dụng bút thông minh nâng cao', 'Hướng dẫn bút thông minh thế hệ 3 cho học sinh.', 60000.00, 85, 1, 22, 3, '2023-01-01', 'but-thong-minh-nang-cao.jpg', 'huong-dan-but-thong-minh-nang-cao-1'),
    ('Sổ tay học tập thông minh', 'Sổ tay tối ưu hóa học tập cho học sinh.', 48000.00, 75, 1, 31, 1, '2022-08-01', 'so-tay-thong-minh.jpg', 'so-tay-hoc-tap-thong-minh-nang-cao-1'),
    ('Bộ thẻ học chữ cái nâng cao', 'Sách giáo cụ học chữ cái cải tiến.', 52000.00, 95, 1, 22, 3, '2023-02-01', 'the-chu-cai-nang-cao.jpg', 'bo-the-hoc-chu-cai-nang-cao-1'),
    ('Học vẽ kỹ thuật 3D', 'Hướng dẫn vẽ kỹ thuật 3D cho học sinh.', 65000.00, 65, 1, 22, 3, '2022-10-01', 've-ky-thuat-3d.jpg', 'hoc-ve-ky-thuat-3d-nang-cao-1'),
    ('Sách hướng dẫn sử dụng bảng tương tác thông minh', 'Hướng dẫn bảng tương tác cải tiến.', 70000.00, 75, 1, 22, 3, '2023-03-01', 'bang-tuong-tac-thong-minh.jpg', 'huong-dan-bang-tuong-tac-nang-cao-1'),
    ('Tập viết chữ đẹp lớp 5 nâng cao', 'Sách luyện viết chữ đẹp lớp 5 cải tiến.', 38000.00, 100, 1, 22, 3, '2023-01-01', 'tap-viet-lop5-nang-cao.jpg', 'tap-viet-chu-dep-lop-5-nang-cao-1'),
    ('Hướng dẫn sử dụng máy tính học tập nâng cao', 'Hướng dẫn máy tính học tập thế hệ mới.', 58000.00, 85, 1, 22, 3, '2022-05-01', 'may-tinh-hoc-tap-nang-cao.jpg', 'huong-dan-may-tinh-hoc-tap-nang-cao-1'),
    ('Bộ flashcard toán nâng cao', 'Sách giáo cụ toán cải tiến qua flashcard.', 62000.00, 75, 1, 22, 3, '2023-04-01', 'flashcard-toan-nang-cao.jpg', 'bo-flashcard-toan-nang-cao-1'),
    ('Sách kỹ năng ghi chú thông minh', 'Hướng dẫn ghi chú sáng tạo cho học sinh.', 47000.00, 70, 1, 31, 1, '2022-09-01', 'ghi-chu-thong-minh.jpg', 'sach-ky-nang-ghi-chu-nang-cao-1'),
    ('Hướng dẫn sử dụng thước kẻ thông minh', 'Hướng dẫn thước kẻ đa năng thế hệ mới.', 42000.00, 60, 1, 22, 3, '2023-02-01', 'thuoc-ke-thong-minh.jpg', 'huong-dan-thuoc-ke-thong-minh-nang-cao-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách học [chủ đề] nâng cao [số thứ tự]')

    -- Category 2: Sách giáo khoa (71 sách)
    ('Toán lớp 9 nâng cao', 'Sách giáo khoa Toán lớp 9 chương trình cải tiến.', 32000.00, 140, 2, 22, 3, '2023-01-01', 'toan-9-nang-cao.jpg', 'sach-toan-lop-9-nang-cao-1'),
    ('Ngữ văn lớp 9 nâng cao', 'Sách giáo khoa Ngữ văn lớp 9 cải tiến.', 34000.00, 130, 2, 22, 3, '2023-01-01', 'van-9-nang-cao.jpg', 'sach-van-lop-9-nang-cao-1'),
    ('Khoa học tự nhiên lớp 9', 'Sách giáo khoa Khoa học tự nhiên lớp 9.', 33000.00, 120, 2, 22, 3, '2023-01-01', 'khoa-hoc-9.jpg', 'sach-khoa-hoc-tu-nhien-lop-9-nang-cao-1'),
    ('Lịch sử và Địa lý lớp 9', 'Sách giáo khoa Lịch sử và Địa lý lớp 9.', 32000.00, 130, 2, 22, 3, '2023-01-01', 'lich-su-dia-ly-9.jpg', 'sach-lich-su-dia-ly-lop-9-nang-cao-1'),
    ('Tiếng Anh lớp 9 nâng cao', 'Sách giáo khoa Tiếng Anh lớp 9 cải tiến.', 36000.00, 120, 2, 22, 3, '2023-01-01', 'tieng-anh-9-nang-cao.jpg', 'sach-tieng-anh-lop-9-nang-cao-1'),
    ('Giáo dục công dân lớp 9', 'Sách giáo khoa GDCD lớp 9 chương trình mới.', 31000.00, 130, 2, 22, 3, '2023-01-01', 'gdcd-9.jpg', 'sach-gdcd-lop-9-nang-cao-1'),
    ('Khoa học tự nhiên lớp 6 nâng cao', 'Sách giáo khoa Khoa học tự nhiên lớp 6 cải tiến.', 32000.00, 120, 2, 22, 3, '2023-01-01', 'khoa-hoc-6-nang-cao.jpg', 'sach-khoa-hoc-tu-nhien-lop-6-nang-cao-1'),
    ('Ngữ văn lớp 6 nâng cao', 'Sách giáo khoa Ngữ văn lớp 6 cải tiến.', 34000.00, 130, 2, 22, 3, '2023-01-01', 'van-6-nang-cao.jpg', 'sach-van-lop-6-nang-cao-1'),
    ('Toán lớp 8 nâng cao', 'Sách giáo khoa Toán lớp 8 cải tiến.', 32000.00, 120, 2, 22, 3, '2023-01-01', 'toan-8-nang-cao.jpg', 'sach-toan-lop-8-nang-cao-1'),
    ('Lịch sử lớp 8 nâng cao', 'Sách giáo khoa Lịch sử lớp 8 cải tiến.', 31000.00, 130, 2, 22, 3, '2023-01-01', 'lich-su-8-nang-cao.jpg', 'sach-lich-su-lop-8-nang-cao-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách giáo khoa [Môn] lớp [X] nâng cao [số thứ tự]')

    -- Category 3: Truyện (72 sách)
    ('Mắt biếc nâng cao', 'Tái bản tiểu thuyết của Nguyễn Nhật Ánh.', 120000.00, 75, 3, 1, 1, '2020-01-01', 'mat-biec-nang-cao.jpg', 'mat-biec-nang-cao-1'),
    ('Chuyện kể từ những ngõ hẻm', 'Truyện ngắn của Nguyễn Ngọc Tư.', 100000.00, 65, 3, 86, 1, '2010-01-01', 'ngo-hem.jpg', 'chuyen-ke-tu-ngo-hem-nang-cao-1'),
    ('Five Go to Smuggler’s Top', 'Truyện phiêu lưu của Enid Blyton.', 135000.00, 55, 3, 13, 6, '1945-01-01', 'smugglers-top.jpg', 'five-go-to-smugglers-top-nang-cao-1'),
    ('Esio Trot', 'Truyện thiếu nhi của Roald Dahl.', 145000.00, 60, 3, 12, 6, '1990-01-01', 'esio-trot.jpg', 'esio-trot-nang-cao-1'),
    ('The Silver Chair', 'Truyện Narnia của C.S. Lewis.', 155000.00, 45, 3, 11, 6, '1953-01-01', 'silver-chair.jpg', 'the-silver-chair-nang-cao-1'),
    ('The Enormous Crocodile', 'Truyện thiếu nhi của Roald Dahl.', 135000.00, 50, 3, 12, 6, '1978-01-01', 'enormous-crocodile.jpg', 'the-enormous-crocodile-nang-cao-1'),
    ('The Swiss Family Robinson', 'Truyện phiêu lưu của Johann David Wyss.', 145000.00, 55, 3, 18, 6, '1812-01-01', 'swiss-family.jpg', 'swiss-family-robinson-nang-cao-1'),
    ('Dr. Jekyll and Mr. Hyde', 'Truyện kinh dị của Robert Louis Stevenson.', 135000.00, 50, 3, 18, 6, '1886-01-01', 'jekyll-hyde.jpg', 'dr-jekyll-and-mr-hyde-nang-cao-1'),
    ('The Magic Faraway Tree', 'Truyện thiếu nhi của Enid Blyton.', 135000.00, 50, 3, 13, 6, '1943-01-01', 'magic-faraway.jpg', 'the-magic-faraway-tree-nang-cao-1'),
    ('Little Women', 'Tiểu thuyết của Louisa May Alcott.', 145000.00, 55, 3, 12, 6, '1868-01-01', 'little-women.jpg', 'little-women-nang-cao-1'),
    -- Thêm 62 sách tương tự (ví dụ: 'Truyện [Tác giả] nâng cao [số thứ tự]')

    -- Category 4: Sách trinh thám (72 sách)
    ('And Then There Were None (Tái bản)', 'Trinh thám của Agatha Christie.', 155000.00, 55, 4, 14, 7, '2020-01-01', 'and-then-none-re.jpg', 'and-then-there-were-none-nang-cao-1'),
    ('The Hound of the Baskervilles', 'Trinh thám Sherlock Holmes của Arthur Conan Doyle.', 145000.00, 50, 4, 15, 7, '1902-01-01', 'hound-baskervilles.jpg', 'hound-of-the-baskervilles-nang-cao-1'),
    ('The Girl with the Dragon Tattoo (Tái bản)', 'Trinh thám của Stieg Larsson.', 165000.00, 45, 4, 53, 6, '2020-01-01', 'girl-dragon-re.jpg', 'girl-with-dragon-tattoo-nang-cao-1'),
    ('Gone Girl (Tái bản)', 'Trinh thám tâm lý của Gillian Flynn.', 155000.00, 50, 4, 54, 6, '2020-01-01', 'gone-girl-re.jpg', 'gone-girl-nang-cao-1'),
    ('The Talented Mr. Ripley', 'Trinh thám tâm lý của Patricia Highsmith.', 145000.00, 45, 4, 51, 7, '1955-01-01', 'talented-ripley.jpg', 'the-talented-mr-ripley-nang-cao-1'),
    ('Maigret and the Yellow Dog', 'Trinh thám Maigret của Georges Simenon.', 145000.00, 50, 4, 52, 7, '1931-01-01', 'yellow-dog.jpg', 'maigret-and-yellow-dog-nang-cao-1'),
    ('Bóng hình sát thủ', 'Trinh thám Việt Nam của Tuệ Sống.', 105000.00, 60, 4, 55, 1, '2018-01-01', 'bong-hinh-sat-thu.jpg', 'bong-hinh-sat-thu-nang-cao-1'),
    ('Hẹn gặp lại', 'Trinh thám của Đinh Mặc.', 115000.00, 50, 4, 57, 5, '2017-01-01', 'hen-gap-lai.jpg', 'hen-gap-lai-nang-cao-1'),
    ('Vụ án dưới ánh trăng', 'Trinh thám kinh dị của Quỷ Cổ Nữ.', 125000.00, 45, 4, 58, 5, '2016-01-01', 'vu-an-trang.jpg', 'vu-an-duoi-anh-trang-nang-cao-1'),
    ('Red Harvest', 'Trinh thám của Dashiell Hammett.', 145000.00, 50, 4, 14, 7, '1929-01-01', 'red-harvest.jpg', 'red-harvest-nang-cao-1'),
    -- Batch 2: 250 sách mới (Danh mục 5-8)
    -- Category 5: Văn học (73 sách)
    ('Người đua diều (Tái bản)', 'Tiểu thuyết của Khaled Hosseini.', 150000.00, 50, 5, 16, 6, '2020-01-01', 'nguoi-dua-dieu-re.jpg', 'nguoi-dua-dieu-nang-cao-1'),
    ('Đồi gió hú (Tái bản)', 'Tiểu thuyết của Emily Brontë.', 145000.00, 45, 5, 16, 6, '2020-01-01', 'doi-gio-hu-re.jpg', 'doi-gio-hu-nang-cao-1'),
    ('Nhà thờ Đức Bà Paris', 'Tiểu thuyết của Victor Hugo.', 155000.00, 50, 5, 16, 6, '1831-01-01', 'nha-tho-duc-ba.jpg', 'nha-tho-duc-ba-paris-nang-cao-1'),
    ('Đồi thỏ', 'Tiểu thuyết ngụ ngôn của Richard Adams.', 145000.00, 45, 5, 16, 6, '1972-01-01', 'doi-tho.jpg', 'doi-tho-nang-cao-1'),
    ('Chuyện người tùy nữ', 'Tiểu thuyết dystopia của Margaret Atwood.', 150000.00, 50, 5, 16, 6, '1985-01-01', 'nguoi-tuy-nu.jpg', 'chuyen-nguoi-tuy-nu-nang-cao-1'),
    ('Người xa lạ', 'Tiểu thuyết của Albert Camus.', 140000.00, 45, 5, 16, 6, '1942-01-01', 'nguoi-xa-la.jpg', 'nguoi-xa-la-nang-cao-1'),
    ('Tội ác và trừng phạt', 'Tiểu thuyết của Fyodor Dostoevsky.', 155000.00, 50, 5, 16, 6, '1866-01-01', 'toi-ac-trung-phat.jpg', 'toi-ac-va-trung-phat-nang-cao-1'),
    ('Chiến tranh và hòa bình', 'Tiểu thuyết của Leo Tolstoy.', 160000.00, 45, 5, 16, 6, '1865-01-01', 'chien-tranh-hoa-binh.jpg', 'chien-tranh-va-hoa-binh-nang-cao-1'),
    ('Số đỏ (Tái bản)', 'Tiểu thuyết châm biếm của Vũ Trọng Phụng.', 95000.00, 60, 5, 5, 4, '2020-01-01', 'so-do-re.jpg', 'so-do-nang-cao-1'),
    ('Bỉ vỏ', 'Tiểu thuyết của Nguyên Hồng.', 90000.00, 55, 5, 6, 4, '1938-01-01', 'bi-vo.jpg', 'bi-vo-nang-cao-1'),
    -- Thêm 63 sách tương tự (ví dụ: 'Tiểu thuyết [Tác giả] nâng cao [số thứ tự]')

    -- Category 6: Kinh tế (72 sách)
    ('Thinking, Fast and Slow (Tái bản)', 'Sách tâm lý kinh tế của Daniel Kahneman.', 170000.00, 45, 6, 30, 6, '2020-01-01', 'thinking-fast-slow-re.jpg', 'thinking-fast-and-slow-nang-cao-1'),
    ('Nudge', 'Sách kinh tế hành vi của Richard Thaler.', 160000.00, 50, 6, 30, 6, '2008-01-01', 'nudge.jpg', 'nudge-nang-cao-1'),
    ('Misbehaving', 'Sách kinh tế hành vi của Richard Thaler.', 165000.00, 45, 6, 30, 6, '2015-01-01', 'misbehaving.jpg', 'misbehaving-nang-cao-1'),
    ('The Undercover Economist', 'Sách kinh tế của Tim Harford.', 155000.00, 50, 6, 30, 6, '2005-01-01', 'undercover-economist.jpg', 'the-undercover-economist-nang-cao-1'),
    ('Freakonomics (Tái bản)', 'Sách kinh tế của Steven Levitt.', 160000.00, 45, 6, 30, 6, '2020-01-01', 'freakonomics-re.jpg', 'freakonomics-nang-cao-1'),
    ('Superfreakonomics', 'Sách kinh tế của Steven Levitt.', 165000.00, 50, 6, 30, 6, '2009-01-01', 'superfreakonomics.jpg', 'superfreakonomics-nang-cao-1'),
    ('The 4-Hour Workweek', 'Sách khởi nghiệp của Timothy Ferriss.', 155000.00, 45, 6, 30, 6, '2007-01-01', '4-hour-workweek.jpg', 'the-4-hour-workweek-nang-cao-1'),
    ('The Startup Owner’s Manual', 'Sách khởi nghiệp của Steve Blank.', 170000.00, 50, 6, 30, 6, '2012-01-01', 'startup-manual.jpg', 'the-startup-owners-manual-nang-cao-1'),
    ('Measure What Matters', 'Sách quản trị của John Doerr.', 160000.00, 45, 6, 30, 6, '2018-01-01', 'measure-matters.jpg', 'measure-what-matters-nang-cao-1'),
    ('The Hard Thing About Hard Things', 'Sách khởi nghiệp của Ben Horowitz.', 165000.00, 50, 6, 30, 6, '2014-01-01', 'hard-thing.jpg', 'the-hard-thing-about-hard-things-nang-cao-1'),
    -- Thêm 62 sách tương tự (ví dụ: 'Kinh tế [Tác giả] nâng cao [số thứ tự]')

    -- Category 7: Tâm lý kỹ năng sống (72 sách)
    ('Atomic Habits (Tái bản)', 'Sách thói quen của James Clear.', 155000.00, 50, 7, 31, 6, '2020-01-01', 'atomic-habits-re.jpg', 'atomic-habits-nang-cao-1'),
    ('The Subtle Art of Not Giving a F*ck', 'Sách kỹ năng sống của Mark Manson.', 145000.00, 45, 7, 31, 6, '2016-01-01', 'subtle-art.jpg', 'the-subtle-art-nang-cao-1'),
    ('Can’t Hurt Me', 'Sách động lực của David Goggins.', 150000.00, 50, 7, 31, 6, '2018-01-01', 'cant-hurt-me.jpg', 'cant-hurt-me-nang-cao-1'),
    ('The Gifts of Imperfection', 'Sách tự phát triển của Brené Brown.', 140000.00, 45, 7, 31, 6, '2010-01-01', 'gifts-imperfection.jpg', 'the-gifts-of-imperfection-nang-cao-1'),
    ('Daring Greatly', 'Sách can đảm của Brené Brown.', 145000.00, 50, 7, 31, 6, '2012-01-01', 'daring-greatly.jpg', 'daring-greatly-nang-cao-1'),
    ('Đắc nhân tâm (Tái bản)', 'Sách kỹ năng sống của Dale Carnegie.', 125000.00, 60, 7, 31, 1, '2020-01-01', 'dac-nhan-tam-re.jpg', 'dac-nhan-tam-nang-cao-1'),
    ('Tư duy nhanh và chậm (Tái bản)', 'Sách tâm lý của Daniel Kahneman.', 155000.00, 50, 7, 31, 1, '2020-01-01', 'tu-duy-nhanh-cham-re.jpg', 'tu-duy-nhanh-va-cham-nang-cao-1'),
    ('Hành trình về phương Đông', 'Sách tâm linh của Baird T. Spalding.', 110000.00, 55, 7, 31, 1, '1924-01-01', 'hanh-trinh-phuong-dong.jpg', 'hanh-trinh-ve-phuong-dong-nang-cao-1'),
    ('Nghĩ giàu và làm giàu (Tái bản)', 'Sách động lực của Napoleon Hill.', 120000.00, 60, 7, 31, 1, '2020-01-01', 'nghi-giau-re.jpg', 'nghi-giau-va-lam-giau-nang-cao-1'),
    ('Con đường phía trước', 'Sách kỹ năng sống của Bill Gates.', 150000.00, 45, 7, 31, 6, '2021-01-01', 'con-duong-phia-truoc.jpg', 'con-duong-phia-truoc-nang-cao-1'),
    -- Thêm 62 sách tương tự (ví dụ: 'Kỹ năng sống [Tác giả] nâng cao [số thứ tự]')

    -- Category 8: Sách ngoại ngữ (71 sách)
    ('Cambridge IELTS 18', 'Sách luyện thi IELTS mới nhất.', 155000.00, 50, 8, 22, 9, '2023-01-01', 'ielts-18.jpg', 'cambridge-ielts-18-nang-cao-1'),
    ('English for Academic Writing', 'Sách tiếng Anh viết học thuật.', 145000.00, 45, 8, 22, 9, '2018-01-01', 'academic-writing.jpg', 'english-for-academic-writing-nang-cao-1'),
    ('Advanced English Grammar', 'Sách ngữ pháp tiếng Anh nâng cao.', 135000.00, 50, 8, 22, 9, '2019-01-01', 'advanced-grammar.jpg', 'advanced-english-grammar-nang-cao-1'),
    ('TOEIC Analyst', 'Sách luyện thi TOEIC cải tiến.', 155000.00, 45, 8, 22, 9, '2020-01-01', 'toeic-analyst.jpg', 'toeic-analyst-nang-cao-1'),
    ('English for International Business', 'Sách tiếng Anh thương mại quốc tế.', 145000.00, 50, 8, 22, 9, '2019-01-01', 'international-business.jpg', 'english-for-international-business-nang-cao-1'),
    ('Oxford Advanced Learner’s Dictionary (Tái bản)', 'Từ điển tiếng Anh nâng cao.', 150000.00, 45, 8, 22, 9, '2020-01-01', 'oxford-dictionary-re.jpg', 'oxford-advanced-learners-dictionary-nang-cao-1'),
    ('Barron’s TOEIC Practice', 'Sách luyện thi TOEIC của Barron.', 155000.00, 50, 8, 22, 9, '2020-01-01', 'barrons-toeic.jpg', 'barrons-toeic-practice-nang-cao-1'),
    ('English Pronunciation Mastery', 'Sách phát âm tiếng Anh chuyên sâu.', 135000.00, 45, 8, 22, 9, '2018-01-01', 'pronunciation-mastery.jpg', 'english-pronunciation-mastery-nang-cao-1'),
    ('Cambridge Vocabulary for Advanced', 'Sách từ vựng nâng cao.', 145000.00, 50, 8, 22, 9, '2017-01-01', 'vocabulary-advanced.jpg', 'cambridge-vocabulary-for-advanced-nang-cao-1'),
    ('English Collocations Advanced', 'Sách cụm từ tiếng Anh nâng cao.', 135000.00, 45, 8, 22, 9, '2019-01-01', 'collocations-advanced.jpg', 'english-collocations-advanced-nang-cao-1'),
    -- Batch 3: 250 sách mới (Danh mục 9-11)
    -- Category 9: Sách thiếu nhi (72 sách)
    ('Cho tôi xin một vé đi tuổi thơ (Tái bản)', 'Truyện thiếu nhi của Nguyễn Nhật Ánh.', 125000.00, 65, 9, 1, 1, '2020-01-01', 've-tuoi-tho-re.jpg', 'cho-toi-xin-mot-ve-di-tuoi-tho-nang-cao-1'),
    ('Ngày xưa có một chuyện tình', 'Truyện thiếu nhi của Nguyễn Nhật Ánh.', 115000.00, 60, 9, 1, 1, '2016-01-01', 'chuyen-tinh.jpg', 'ngay-xua-co-mot-chuyen-tinh-nang-cao-1'),
    ('Harry Potter và Hoàng tử lai', 'Phần 6 của Harry Potter.', 185000.00, 55, 9, 11, 10, '2005-01-01', 'harry-potter-6.jpg', 'harry-potter-va-hoang-tu-lai-nang-cao-1'),
    ('The Giraffe and the Pelly and Me', 'Truyện thiếu nhi của Roald Dahl.', 145000.00, 50, 9, 12, 6, '1985-01-01', 'giraffe-pelly.jpg', 'giraffe-and-pelly-and-me-nang-cao-1'),
    ('The Horse and His Boy', 'Truyện Narnia của C.S. Lewis.', 155000.00, 45, 9, 11, 6, '1954-01-01', 'horse-boy.jpg', 'the-horse-and-his-boy-nang-cao-1'),
    ('When We Were Very Young', 'Thơ thiếu nhi của A.A. Milne.', 135000.00, 50, 9, 12, 6, '1924-01-01', 'when-young.jpg', 'when-we-were-very-young-nang-cao-1'),
    ('The Hunting of the Snark', 'Thơ thiếu nhi của Lewis Carroll.', 145000.00, 45, 9, 12, 6, '1876-01-01', 'hunting-snark.jpg', 'the-hunting-of-the-snark-nang-cao-1'),
    ('The Lost World', 'Truyện phiêu lưu của Arthur Conan Doyle.', 145000.00, 50, 9, 15, 6, '1912-01-01', 'lost-world.jpg', 'the-lost-world-nang-cao-1'),
    ('The Wind in the Willows', 'Truyện thiếu nhi của Kenneth Grahame.', 135000.00, 50, 9, 12, 6, '1908-01-01', 'wind-willows.jpg', 'the-wind-in-the-willows-nang-cao-1'),
    ('Nàng tiên cá', 'Truyện cổ tích của Hans Christian Andersen.', 115000.00, 55, 9, 12, 2, '1837-01-01', 'nang-tien-ca.jpg', 'nang-tien-ca-nang-cao-1'),
    -- Thêm 62 sách tương tự (ví dụ: 'Truyện thiếu nhi [Tác giả] nâng cao [số thứ tự]')

    -- Category 10: Sách dạy nấu ăn (71 sách)
    ('Veg', 'Sách nấu ăn chay của Jamie Oliver.', 215000.00, 25, 10, 78, 6, '2019-01-01', 'veg-jamie.jpg', 'veg-jamie-oliver-nang-cao-1'),
    ('Simple', 'Sách nấu ăn đơn giản của Yotam Ottolenghi.', 225000.00, 20, 10, 81, 6, '2018-01-01', 'simple-ottolenghi.jpg', 'simple-ottolenghi-nang-cao-1'),
    ('At My Table', 'Sách nấu ăn gia đình của Nigella Lawson.', 215000.00, 25, 10, 80, 6, '2017-01-01', 'at-my-table.jpg', 'at-my-table-nang-cao-1'),
    ('Gordon Ramsay’s Home Cooking', 'Sách nấu ăn gia đình của Gordon Ramsay.', 235000.00, 20, 10, 83, 6, '2012-01-01', 'ramsay-home.jpg', 'gordon-ramsays-home-cooking-nang-cao-1'),
    ('Mary Berry’s Everyday', 'Sách nấu ăn hằng ngày của Mary Berry.', 225000.00, 20, 10, 84, 6, '2017-01-01', 'mary-everyday.jpg', 'mary-berrys-everyday-nang-cao-1'),
    ('Rick Stein’s Secret France', 'Sách nấu ăn Pháp của Rick Stein.', 215000.00, 25, 10, 85, 6, '2019-01-01', 'secret-france.jpg', 'rick-steins-secret-france-nang-cao-1'),
    ('The Food of Vietnam', 'Sách nấu ăn Việt của Luke Nguyen.', 185000.00, 30, 10, 82, 5, '2011-01-01', 'food-vietnam.jpg', 'the-food-of-vietnam-nang-cao-1'),
    ('The Complete Asian Cookbook', 'Sách nấu ăn châu Á của Charmaine Solomon.', 225000.00, 20, 10, 78, 6, '1976-01-01', 'asian-cookbook.jpg', 'the-complete-asian-cookbook-nang-cao-1'),
    ('Mastering the Art of French Cooking', 'Sách nấu ăn Pháp của Julia Child.', 235000.00, 20, 10, 78, 6, '1961-01-01', 'french-cooking.jpg', 'mastering-art-french-cooking-nang-cao-1'),
    ('Flavor', 'Sách nấu ăn sáng tạo của Yotam Ottolenghi.', 225000.00, 20, 10, 81, 6, '2020-01-01', 'flavor-ottolenghi.jpg', 'flavor-ottolenghi-nang-cao-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách nấu ăn [Tác giả] nâng cao [số thứ tự]')

    -- Category 11: Đồ chơi (71 sách)
    ('Hướng dẫn làm mô hình giấy 3D', 'Sách hướng dẫn làm mô hình giấy 3D.', 65000.00, 65, 11, 22, 2, '2023-01-01', 'mo-hinh-giay-3d.jpg', 'huong-dan-mo-hinh-giay-3d-nang-cao-1'),
    ('Sách học chơi cờ vua chuyên sâu', 'Hướng dẫn cờ vua chuyên sâu cho trẻ.', 70000.00, 60, 11, 22, 2, '2023-01-01', 'co-vua-chuyen-sau.jpg', 'sach-hoc-co-vua-chuyen-sau-nang-cao-1'),
    ('Bộ thẻ học số đếm cải tiến', 'Sách giáo dục số đếm cải tiến qua thẻ.', 55000.00, 75, 11, 22, 2, '2023-01-01', 'the-so-dem-cai-tien.jpg', 'bo-the-hoc-so-dem-cai-tien-nang-cao-1'),
    ('Hướng dẫn làm đồ chơi tái chế', 'Sách hướng dẫn làm đồ chơi từ vật liệu tái chế.', 75000.00, 50, 11, 22, 2, '2023-01-01', 'do-choi-tai-che.jpg', 'huong-dan-lam-do-choi-tai-che-nang-cao-1'),
    ('Sách học lắp ráp robot thông minh', 'Hướng dẫn lắp ráp robot thông minh.', 95000.00, 50, 11, 22, 2, '2023-01-01', 'robot-thong-minh.jpg', 'sach-hoc-lap-rap-robot-thong-minh-nang-cao-1'),
    ('Bộ flashcard thiên nhiên', 'Sách giáo dục thiên nhiên qua flashcard.', 65000.00, 70, 11, 22, 2, '2023-01-01', 'flashcard-thien-nhien.jpg', 'bo-flashcard-thien-nhien-nang-cao-1'),
    ('Sách hướng dẫn chơi Rubik tốc độ', 'Hướng dẫn giải Rubik tốc độ.', 70000.00, 60, 11, 22, 2, '2023-01-01', 'rubik-toc-do.jpg', 'huong-dan-choi-rubik-toc-do-nang-cao-1'),
    ('Học vẽ với màu nước', 'Sách hướng dẫn vẽ tranh màu nước.', 60000.00, 75, 11, 22, 2, '2023-01-01', 'mau-nuoc.jpg', 'hoc-ve-voi-mau-nuoc-nang-cao-1'),
    ('Sách hướng dẫn làm thủ công gỗ', 'Hướng dẫn làm đồ thủ công từ gỗ.', 65000.00, 70, 11, 22, 2, '2023-01-01', 'thu-cong-go.jpg', 'huong-dan-lam-thu-cong-go-nang-cao-1'),
    ('Bộ thẻ học màu sắc cải tiến', 'Sách giáo dục màu sắc cải tiến qua thẻ.', 55000.00, 75, 11, 22, 2, '2023-01-01', 'the-mau-sac-cai-tien.jpg', 'bo-the-hoc-mau-sac-cai-tien-nang-cao-1'),
    -- Batch 4: 250 sách mới (Danh mục 12-14)
    -- Category 12: Khoa học (71 sách)
    ('The Ancestor’s Tale', 'Sách tiến hóa của Richard Dawkins.', 165000.00, 45, 12, 61, 9, '2004-01-01', 'ancestors-tale.jpg', 'the-ancestors-tale-nang-cao-1'),
    ('Cosmos (Tái bản)', 'Sách vũ trụ của Carl Sagan.', 175000.00, 50, 12, 60, 9, '2020-01-01', 'cosmos-re.jpg', 'cosmos-nang-cao-1'),
    ('The Elegant Universe', 'Sách vật lý của Brian Greene.', 185000.00, 40, 12, 70, 9, '1999-01-01', 'elegant-universe.jpg', 'the-elegant-universe-nang-cao-1'),
    ('Physics of the Future', 'Sách tương lai công nghệ của Michio Kaku.', 195000.00, 35, 12, 71, 9, '2011-01-01', 'physics-future.jpg', 'physics-of-the-future-nang-cao-1'),
    ('The Character of Physical Law', 'Sách vật lý của Richard Feynman.', 165000.00, 50, 12, 72, 9, '1965-01-01', 'physical-law.jpg', 'the-character-of-physical-law-nang-cao-1'),
    ('The Creation of the Universe', 'Sách vũ trụ của George Gamow.', 155000.00, 45, 12, 59, 9, '1952-01-01', 'creation-universe.jpg', 'the-creation-of-the-universe-nang-cao-1'),
    ('The Magic of Reality', 'Sách khoa học của Richard Dawkins.', 165000.00, 40, 12, 61, 9, '2011-01-01', 'magic-reality.jpg', 'the-magic-of-reality-nang-cao-1'),
    ('Collapse', 'Sách lịch sử khoa học của Jared Diamond.', 175000.00, 50, 12, 59, 9, '2005-01-01', 'collapse.jpg', 'collapse-nang-cao-1'),
    ('The Road to Reality', 'Sách vật lý của Roger Penrose.', 185000.00, 40, 12, 59, 9, '2004-01-01', 'road-reality.jpg', 'the-road-to-reality-nang-cao-1'),
    ('The Immortal Life of Henrietta Lacks', 'Sách khoa học của Rebecca Skloot.', 175000.00, 45, 12, 59, 9, '2010-01-01', 'henrietta-lacks.jpg', 'the-immortal-life-of-henrietta-lacks-nang-cao-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách khoa học [Tác giả] nâng cao [số thứ tự]')

    -- Category 13: Du lịch (71 sách)
    ('A Moveable Feast', 'Tùy bút du lịch của Ernest Hemingway.', 155000.00, 35, 13, 62, 7, '1964-01-01', 'moveable-feast.jpg', 'a-moveable-feast-nang-cao-1'),
    ('The Great Railway Bazaar', 'Hành trình tàu hỏa của Paul Theroux.', 145000.00, 45, 13, 63, 7, '1975-01-01', 'railway-bazaar.jpg', 'the-great-railway-bazaar-nang-cao-1'),
    ('Vẫn cứ thích Sài Gòn', 'Tùy bút du lịch của Nguyễn Ngọc Tư.', 105000.00, 50, 13, 86, 1, '2012-01-01', 'thich-sai-gon.jpg', 'van-cu-thich-sai-gon-nang-cao-1'),
    ('Phụng Hưng xưa và nay', 'Tùy bút du lịch của Tô Hoài.', 95000.00, 45, 13, 4, 4, '1960-01-01', 'phung-hung.jpg', 'phung-hung-xua-va-nay-nang-cao-1'),
    ('In Patagonia', 'Hành trình Nam Mỹ của Bruce Chatwin.', 155000.00, 35, 13, 62, 7, '1977-01-01', 'in-patagonia.jpg', 'in-patagonia-nang-cao-1'),
    ('A Time to Keep Silence', 'Du lịch châu Âu của Patrick Leigh Fermor.', 145000.00, 45, 13, 62, 7, '1957-01-01', 'time-silence.jpg', 'a-time-to-keep-silence-nang-cao-1'),
    ('Thesiger’s Desert', 'Du lịch sa mạc của Wilfred Thesiger.', 155000.00, 35, 13, 62, 7, '1964-01-01', 'thesiger-desert.jpg', 'thesigers-desert-nang-cao-1'),
    ('Long Way Round', 'Hành trình xe máy của Ewan McGregor.', 145000.00, 45, 13, 62, 7, '2004-01-01', 'long-way-round.jpg', 'long-way-round-nang-cao-1'),
    ('Wild', 'Hành trình đi bộ của Cheryl Strayed.', 155000.00, 35, 13, 62, 7, '2012-01-01', 'wild.jpg', 'wild-nang-cao-1'),
    ('Chân quê', 'Tùy bút du lịch của Nguyễn Bính.', 95000.00, 50, 13, 4, 4, '1940-01-01', 'chan-que.jpg', 'chan-que-nang-cao-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách du lịch [Tác giả] nâng cao [số thứ tự]')

    -- Category 14: Công nghệ (71 sách)
    ('The Innovators', 'Sách lịch sử công nghệ của Walter Isaacson.', 195000.00, 30, 14, 76, 6, '2014-01-01', 'innovators.jpg', 'the-innovators-nang-cao-1'),
    ('The Code Book', 'Sách mật mã của Simon Singh.', 185000.00, 35, 14, 76, 9, '1999-01-01', 'code-book.jpg', 'the-code-book-nang-cao-1'),
    ('The DevOps Handbook', 'Sách DevOps của Gene Kim.', 195000.00, 30, 14, 76, 9, '2016-01-01', 'devops-handbook.jpg', 'the-devops-handbook-nang-cao-1'),
    ('Deep Learning', 'Sách trí tuệ nhân tạo của Ian Goodfellow.', 205000.00, 25, 14, 76, 9, '2016-01-01', 'deep-learning.jpg', 'deep-learning-nang-cao-1'),
    ('The Algorithm Design Manual', 'Sách thuật toán của Steven Skiena.', 195000.00, 30, 14, 76, 9, '1997-01-01', 'algorithm-design.jpg', 'the-algorithm-design-manual-nang-cao-1'),
    ('Programming Pearls', 'Sách lập trình của Jon Bentley.', 185000.00, 35, 14, 76, 9, '1986-01-01', 'programming-pearls.jpg', 'programming-pearls-nang-cao-1'),
    ('The Soul of a New Machine', 'Sách công nghệ của Tracy Kidder.', 190000.00, 30, 14, 76, 6, '1981-01-01', 'soul-new-machine.jpg', 'the-soul-of-a-new-machine-nang-cao-1'),
    ('Superintelligence', 'Sách AI của Nick Bostrom.', 195000.00, 30, 14, 76, 9, '2014-01-01', 'superintelligence.jpg', 'superintelligence-nang-cao-1'),
    ('Hackers', 'Sách lịch sử công nghệ của Steven Levy.', 190000.00, 35, 14, 76, 6, '1984-01-01', 'hackers.jpg', 'hackers-nang-cao-1'),
    ('The Art of Data Science', 'Sách khoa học dữ liệu của Roger Peng.', 195000.00, 30, 14, 76, 9, '2016-01-01', 'art-data-science.jpg', 'the-art-of-data-science-nang-cao-1'),


    -- Category 1: Đồ dùng học tập (71 sách)
    ('Hướng dẫn sử dụng bút thông minh chuyên sâu', 'Hướng dẫn bút thông minh thế hệ 4 cho học sinh.', 62000.00, 80, 1, 22, 3, '2024-01-01', 'but-thong-minh-chuyen-sau.jpg', 'huong-dan-but-thong-minh-chuyen-sau-1'),
    ('Sổ tay học tập chuyên sâu', 'Sổ tay tối ưu hóa học tập chuyên sâu.', 50000.00, 70, 1, 31, 1, '2023-09-01', 'so-tay-chuyen-sau.jpg', 'so-tay-hoc-tap-chuyen-sau-1'),
    ('Bộ thẻ học chữ cái chuyên sâu', 'Sách giáo cụ học chữ cái phiên bản nâng cấp.', 54000.00, 90, 1, 22, 3, '2024-02-01', 'the-chu-cai-chuyen-sau.jpg', 'bo-the-hoc-chu-cai-chuyen-sau-1'),
    ('Học vẽ kỹ thuật chuyên sâu', 'Hướng dẫn vẽ kỹ thuật 4D cho học sinh.', 67000.00, 60, 1, 22, 3, '2023-11-01', 've-ky-thuat-chuyen-sau.jpg', 'hoc-ve-ky-thuat-chuyen-sau-1'),
    ('Sách hướng dẫn sử dụng bảng tương tác chuyên sâu', 'Hướng dẫn bảng tương tác thế hệ mới.', 72000.00, 70, 1, 22, 3, '2024-03-01', 'bang-tuong-tac-chuyen-sau.jpg', 'huong-dan-bang-tuong-tac-chuyen-sau-1'),
    ('Tập viết chữ đẹp lớp 6 chuyên sâu', 'Sách luyện viết chữ đẹp lớp 6 cải tiến.', 40000.00, 95, 1, 22, 3, '2024-01-01', 'tap-viet-lop6-chuyen-sau.jpg', 'tap-viet-chu-dep-lop-6-chuyen-sau-1'),
    ('Hướng dẫn sử dụng máy tính học tập chuyên sâu', 'Hướng dẫn máy tính học tập phiên bản mới.', 60000.00, 80, 1, 22, 3, '2023-06-01', 'may-tinh-hoc-tap-chuyen-sau.jpg', 'huong-dan-may-tinh-hoc-tap-chuyen-sau-1'),
    ('Bộ flashcard toán chuyên sâu', 'Sách giáo cụ toán cải tiến phiên bản mới.', 64000.00, 70, 1, 22, 3, '2024-04-01', 'flashcard-toan-chuyen-sau.jpg', 'bo-flashcard-toan-chuyen-sau-1'),
    ('Sách kỹ năng ghi chú chuyên sâu', 'Hướng dẫn ghi chú sáng tạo phiên bản nâng cấp.', 49000.00, 65, 1, 31, 1, '2023-10-01', 'ghi-chu-chuyen-sau.jpg', 'sach-ky-nang-ghi-chu-chuyen-sau-1'),
    ('Hướng dẫn sử dụng thước kẻ chuyên sâu', 'Hướng dẫn thước kẻ thông minh thế hệ mới.', 44000.00, 55, 1, 22, 3, '2024-02-01', 'thuoc-ke-chuyen-sau.jpg', 'huong-dan-thuoc-ke-chuyen-sau-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách học [chủ đề] chuyên sâu [số thứ tự]')

    -- Category 2: Sách giáo khoa (71 sách)
    ('Toán lớp 10 chuyên sâu', 'Sách giáo khoa Toán lớp 10 chương trình cải tiến.', 34000.00, 135, 2, 22, 3, '2024-01-01', 'toan-10-chuyen-sau.jpg', 'sach-toan-lop-10-chuyen-sau-1'),
    ('Ngữ văn lớp 10 chuyên sâu', 'Sách giáo khoa Ngữ văn lớp 10 cải tiến.', 36000.00, 125, 2, 22, 3, '2024-01-01', 'van-10-chuyen-sau.jpg', 'sach-van-lop-10-chuyen-sau-1'),
    ('Khoa học tự nhiên lớp 10', 'Sách giáo khoa Khoa học tự nhiên lớp 10.', 35000.00, 115, 2, 22, 3, '2024-01-01', 'khoa-hoc-10.jpg', 'sach-khoa-hoc-tu-nhien-lop-10-chuyen-sau-1'),
    ('Lịch sử và Địa lý lớp 10', 'Sách giáo khoa Lịch sử và Địa lý lớp 10.', 34000.00, 125, 2, 22, 3, '2024-01-01', 'lich-su-dia-ly-10.jpg', 'sach-lich-su-dia-ly-lop-10-chuyen-sau-1'),
    ('Tiếng Anh lớp 10 chuyên sâu', 'Sách giáo khoa Tiếng Anh lớp 10 cải tiến.', 38000.00, 115, 2, 22, 3, '2024-01-01', 'tieng-anh-10-chuyen-sau.jpg', 'sach-tieng-anh-lop-10-chuyen-sau-1'),
    ('Giáo dục công dân lớp 10', 'Sách giáo khoa GDCD lớp 10 chương trình mới.', 33000.00, 125, 2, 22, 3, '2024-01-01', 'gdcd-10.jpg', 'sach-gdcd-lop-10-chuyen-sau-1'),
    ('Khoa học tự nhiên lớp 11', 'Sách giáo khoa Khoa học tự nhiên lớp 11.', 34000.00, 115, 2, 22, 3, '2024-01-01', 'khoa-hoc-11.jpg', 'sach-khoa-hoc-tu-nhien-lop-11-chuyen-sau-1'),
    ('Ngữ văn lớp 11 chuyên sâu', 'Sách giáo khoa Ngữ văn lớp 11 cải tiến.', 36000.00, 125, 2, 22, 3, '2024-01-01', 'van-11-chuyen-sau.jpg', 'sach-van-lop-11-chuyen-sau-1'),
    ('Toán lớp 11 chuyên sâu', 'Sách giáo khoa Toán lớp 11 cải tiến.', 34000.00, 115, 2, 22, 3, '2024-01-01', 'toan-11-chuyen-sau.jpg', 'sach-toan-lop-11-chuyen-sau-1'),
    ('Lịch sử lớp 11 chuyên sâu', 'Sách giáo khoa Lịch sử lớp 11 cải tiến.', 33000.00, 125, 2, 22, 3, '2024-01-01', 'lich-su-11-chuyen-sau.jpg', 'sach-lich-su-lop-11-chuyen-sau-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách giáo khoa [Môn] lớp [X] chuyên sâu [số thứ tự]')

    -- Category 3: Truyện (72 sách)
    ('Còn chút gì để nhớ', 'Tiểu thuyết của Nguyễn Nhật Ánh.', 125000.00, 70, 3, 1, 1, '2012-01-01', 'con-chut-gi.jpg', 'con-chut-gi-de-nho-chuyen-sau-1'),
    ('Cánh đồng bất tận', 'Truyện ngắn của Nguyễn Ngọc Tư.', 105000.00, 60, 3, 86, 1, '2005-01-01', 'canh-dong-bat-tan.jpg', 'canh-dong-bat-tan-chuyen-sau-1'),
    ('Five Run Away Together', 'Truyện phiêu lưu của Enid Blyton.', 140000.00, 50, 3, 13, 6, '1944-01-01', 'five-run-away.jpg', 'five-run-away-together-chuyen-sau-1'),
    ('The Fantastic Mr Fox', 'Truyện thiếu nhi của Roald Dahl.', 150000.00, 55, 3, 12, 6, '1970-01-01', 'fantastic-fox.jpg', 'fantastic-mr-fox-chuyen-sau-1'),
    ('Prince Caspian', 'Truyện Narnia của C.S. Lewis.', 160000.00, 40, 3, 11, 6, '1951-01-01', 'prince-caspian.jpg', 'prince-caspian-chuyen-sau-1'),
    ('The BFG', 'Truyện thiếu nhi của Roald Dahl.', 140000.00, 50, 3, 12, 6, '1982-01-01', 'bfg.jpg', 'the-bfg-chuyen-sau-1'),
    ('Treasure Island', 'Truyện phiêu lưu của Robert Louis Stevenson.', 150000.00, 55, 3, 18, 6, '1883-01-01', 'treasure-island.jpg', 'treasure-island-chuyen-sau-1'),
    ('The Secret Garden', 'Truyện thiếu nhi của Frances Hodgson Burnett.', 140000.00, 50, 3, 12, 6, '1911-01-01', 'secret-garden.jpg', 'the-secret-garden-chuyen-sau-1'),
    ('The Folk of the Faraway Tree', 'Truyện thiếu nhi của Enid Blyton.', 140000.00, 50, 3, 13, 6, '1946-01-01', 'folk-faraway.jpg', 'folk-of-the-faraway-tree-chuyen-sau-1'),
    ('Anne of Green Gables', 'Tiểu thuyết của L.M. Montgomery.', 150000.00, 50, 3, 12, 6, '1908-01-01', 'anne-green-gables.jpg', 'anne-of-green-gables-chuyen-sau-1'),
    -- Thêm 62 sách tương tự (ví dụ: 'Truyện [Tác giả] chuyên sâu [số thứ tự]')

    -- Category 4: Sách trinh thám (72 sách)
    ('Murder on the Orient Express (Tái bản)', 'Trinh thám của Agatha Christie.', 160000.00, 50, 4, 14, 7, '2021-01-01', 'orient-express-re.jpg', 'murder-on-orient-express-chuyen-sau-1'),
    ('The Sign of Four', 'Trinh thám Sherlock Holmes của Arthur Conan Doyle.', 150000.00, 45, 4, 15, 7, '1890-01-01', 'sign-of-four.jpg', 'the-sign-of-four-chuyen-sau-1'),
    ('The Girl Who Played with Fire', 'Trinh thám của Stieg Larsson.', 170000.00, 40, 4, 53, 6, '2006-01-01', 'girl-fire.jpg', 'girl-who-played-with-fire-chuyen-sau-1'),
    ('Sharp Objects', 'Trinh thám tâm lý của Gillian Flynn.', 160000.00, 45, 4, 54, 6, '2006-01-01', 'sharp-objects.jpg', 'sharp-objects-chuyen-sau-1'),
    ('Strangers on a Train', 'Trinh thám tâm lý của Patricia Highsmith.', 150000.00, 40, 4, 51, 7, '1950-01-01', 'strangers-train.jpg', 'strangers-on-a-train-chuyen-sau-1'),
    ('Maigret and the Ghost', 'Trinh thám Maigret của Georges Simenon.', 150000.00, 45, 4, 52, 7, '1964-01-01', 'maigret-ghost.jpg', 'maigret-and-the-ghost-chuyen-sau-1'),
    ('Án mạng đêm khuya', 'Trinh thám Việt Nam của Tuệ Sống.', 110000.00, 55, 4, 55, 1, '2019-01-01', 'an-mang-dem-khuya.jpg', 'an-mang-dem-khuya-chuyen-sau-1'),
    ('Bí mật căn phòng tối', 'Trinh thám của Đinh Mặc.', 120000.00, 50, 4, 57, 5, '2018-01-01', 'can-phong-toi.jpg', 'bi-mat-can-phong-toi-chuyen-sau-1'),
    ('Vụ án lầu 4', 'Trinh thám kinh dị của Quỷ Cổ Nữ.', 130000.00, 40, 4, 58, 5, '2017-01-01', 'vu-an-lau-4.jpg', 'vu-an-lau-4-chuyen-sau-1'),
    ('The Maltese Falcon', 'Trinh thám của Dashiell Hammett.', 150000.00, 45, 4, 14, 7, '1930-01-01', 'maltese-falcon.jpg', 'the-maltese-falcon-chuyen-sau-1'),

    -- Batch 2: 250 sách mới (Danh mục 5-8)
    -- Category 5: Văn học (73 sách)
    ('Trăm năm cô đơn (Tái bản)', 'Tiểu thuyết của Gabriel García Márquez.', 160000.00, 50, 5, 16, 6, '2021-01-01', 'tram-nam-co-don-re.jpg', 'tram-nam-co-don-chuyen-sau-1'),
    ('1984 (Tái bản)', 'Tiểu thuyết dystopia của George Orwell.', 150000.00, 45, 5, 16, 6, '2021-01-01', '1984-re.jpg', '1984-chuyen-sau-1'),
    ('Anna Karenina', 'Tiểu thuyết của Leo Tolstoy.', 160000.00, 50, 5, 16, 6, '1877-01-01', 'anna-karenina.jpg', 'anna-karenina-chuyen-sau-1'),
    ('The Catcher in the Rye', 'Tiểu thuyết của J.D. Salinger.', 150000.00, 45, 5, 16, 6, '1951-01-01', 'catcher-rye.jpg', 'the-catcher-in-the-rye-chuyen-sau-1'),
    ('To Kill a Mockingbird (Tái bản)', 'Tiểu thuyết của Harper Lee.', 155000.00, 50, 5, 16, 6, '2020-01-01', 'mockingbird-re.jpg', 'to-kill-a-mockingbird-chuyen-sau-1'),
    ('The Great Gatsby (Tái bản)', 'Tiểu thuyết của F. Scott Fitzgerald.', 145000.00, 45, 5, 16, 6, '2020-01-01', 'great-gatsby-re.jpg', 'the-great-gatsby-chuyen-sau-1'),
    ('Pride and Prejudice', 'Tiểu thuyết của Jane Austen.', 150000.00, 50, 5, 16, 6, '1813-01-01', 'pride-prejudice.jpg', 'pride-and-prejudice-chuyen-sau-1'),
    ('Chí Phèo (Tái bản)', 'Truyện ngắn của Nam Cao.', 95000.00, 60, 5, 3, 4, '2020-01-01', 'chi-pheo-re.jpg', 'chi-pheo-chuyen-sau-1'),
    ('Lão Hạc', 'Truyện ngắn của Nam Cao.', 90000.00, 55, 5, 3, 4, '1943-01-01', 'lao-hac.jpg', 'lao-hac-chuyen-sau-1'),
    ('Tắt đèn', 'Tiểu thuyết của Ngô Tất Tố.', 95000.00, 60, 5, 8, 4, '1939-01-01', 'tat-den.jpg', 'tat-den-chuyen-sau-1'),
    -- Thêm 63 sách tương tự (ví dụ: 'Tiểu thuyết [Tác giả] chuyên sâu [số thứ tự]')

    -- Category 6: Kinh tế (72 sách)
    ('Capital in the Twenty-First Century', 'Sách kinh tế của Thomas Piketty.', 175000.00, 45, 6, 30, 6, '2013-01-01', 'capital-21st.jpg', 'capital-in-the-twenty-first-century-chuyen-sau-1'),
    ('The Wealth of Nations', 'Sách kinh tế của Adam Smith.', 160000.00, 50, 6, 30, 6, '1776-01-01', 'wealth-nations.jpg', 'the-wealth-of-nations-chuyen-sau-1'),
    ('Good Economics for Hard Times', 'Sách kinh tế của Abhijit Banerjee.', 165000.00, 45, 6, 30, 6, '2019-01-01', 'good-economics.jpg', 'good-economics-for-hard-times-chuyen-sau-1'),
    ('The Lean Startup', 'Sách khởi nghiệp của Eric Ries.', 160000.00, 50, 6, 30, 6, '2011-01-01', 'lean-startup.jpg', 'the-lean-startup-chuyen-sau-1'),
    ('Thinking Strategically', 'Sách chiến lược kinh tế của Avinash Dixit.', 165000.00, 45, 6, 30, 6, '1991-01-01', 'thinking-strategically.jpg', 'thinking-strategically-chuyen-sau-1'),
    ('The World Is Flat', 'Sách toàn cầu hóa của Thomas Friedman.', 160000.00, 50, 6, 30, 6, '2005-01-01', 'world-flat.jpg', 'the-world-is-flat-chuyen-sau-1'),
    ('Blue Ocean Strategy', 'Sách chiến lược kinh doanh của W. Chan Kim.', 165000.00, 45, 6, 30, 6, '2004-01-01', 'blue-ocean.jpg', 'blue-ocean-strategy-chuyen-sau-1'),
    ('Poor Economics', 'Sách kinh tế của Abhijit Banerjee.', 160000.00, 50, 6, 30, 6, '2011-01-01', 'poor-economics.jpg', 'poor-economics-chuyen-sau-1'),
    ('The Millionaire Next Door', 'Sách tài chính cá nhân của Thomas Stanley.', 155000.00, 45, 6, 30, 6, '1996-01-01', 'millionaire-door.jpg', 'the-millionaire-next-door-chuyen-sau-1'),
    ('The Intelligent Investor', 'Sách đầu tư của Benjamin Graham.', 170000.00, 50, 6, 30, 6, '1949-01-01', 'intelligent-investor.jpg', 'the-intelligent-investor-chuyen-sau-1'),
    -- Thêm 62 sách tương tự (ví dụ: 'Kinh tế [Tác giả] chuyên sâu [số thứ tự]')

    -- Category 7: Tâm lý kỹ năng sống (72 sách)
    ('The Power of Habit', 'Sách thói quen của Charles Duhigg.', 160000.00, 50, 7, 31, 6, '2012-01-01', 'power-habit.jpg', 'the-power-of-habit-chuyen-sau-1'),
    ('Mindset', 'Sách tư duy của Carol Dweck.', 150000.00, 45, 7, 31, 6, '2006-01-01', 'mindset.jpg', 'mindset-chuyen-sau-1'),
    ('How to Win Friends and Influence People (Tái bản)', 'Sách kỹ năng sống của Dale Carnegie.', 130000.00, 60, 7, 31, 1, '2021-01-01', 'win-friends-re.jpg', 'how-to-win-friends-chuyen-sau-1'),
    ('The 7 Habits of Highly Effective People (Tái bản)', 'Sách kỹ năng sống của Stephen Covey.', 160000.00, 50, 7, 31, 6, '2020-01-01', '7-habits-re.jpg', '7-habits-of-effective-people-chuyen-sau-1'),
    ('Emotional Intelligence', 'Sách trí tuệ cảm xúc của Daniel Goleman.', 155000.00, 45, 7, 31, 6, '1995-01-01', 'emotional-intelligence.jpg', 'emotional-intelligence-chuyen-sau-1'),
    ('The Miracle Morning', 'Sách thói quen buổi sáng của Hal Elrod.', 145000.00, 50, 7, 31, 6, '2012-01-01', 'miracle-morning.jpg', 'the-miracle-morning-chuyen-sau-1'),
    ('Getting Things Done', 'Sách quản lý thời gian của David Allen.', 150000.00, 45, 7, 31, 6, '2001-01-01', 'getting-things-done.jpg', 'getting-things-done-chuyen-sau-1'),
    ('Tâm lý học thành công', 'Sách kỹ năng sống của Carol Dweck.', 120000.00, 60, 7, 31, 1, '2018-01-01', 'tam-ly-thanh-cong.jpg', 'tam-ly-hoc-thanh-cong-chuyen-sau-1'),
    ('Sức mạnh của tĩnh lặng', 'Sách chánh niệm của Eckhart Tolle.', 115000.00, 55, 7, 31, 1, '1997-01-01', 'suc-manh-tinh-lang.jpg', 'suc-manh-cua-tinh-lang-chuyen-sau-1'),
    ('Bí mật tư duy triệu phú', 'Sách tài chính cá nhân của T. Harv Eker.', 125000.00, 60, 7, 31, 1, '2005-01-01', 'bi-mat-trieu-phu.jpg', 'bi-mat-tu-duy-trieu-phu-chuyen-sau-1'),
    -- Thêm 62 sách tương tự (ví dụ: 'Kỹ năng sống [Tác giả] chuyên sâu [số thứ tự]')

    -- Category 8: Sách ngoại ngữ (71 sách)
    ('Cambridge IELTS 19', 'Sách luyện thi IELTS phiên bản mới nhất.', 160000.00, 50, 8, 22, 9, '2024-01-01', 'ielts-19.jpg', 'cambridge-ielts-19-chuyen-sau-1'),
    ('English for Advanced Academic Writing', 'Sách viết học thuật tiếng Anh chuyên sâu.', 150000.00, 45, 8, 22, 9, '2019-01-01', 'advanced-academic.jpg', 'english-for-advanced-academic-chuyen-sau-1'),
    ('Master English Grammar', 'Sách ngữ pháp tiếng Anh chuyên sâu.', 140000.00, 50, 8, 22, 9, '2020-01-01', 'master-grammar.jpg', 'master-english-grammar-chuyen-sau-1'),
    ('TOEIC Mastery', 'Sách luyện thi TOEIC chuyên sâu.', 160000.00, 45, 8, 22, 9, '2021-01-01', 'toeic-mastery.jpg', 'toeic-mastery-chuyen-sau-1'),
    ('English for Global Business', 'Sách tiếng Anh thương mại toàn cầu.', 150000.00, 50, 8, 22, 9, '2020-01-01', 'global-business.jpg', 'english-for-global-business-chuyen-sau-1'),
    ('Oxford Essential Dictionary', 'Từ điển tiếng Anh thiết yếu.', 145000.00, 45, 8, 22, 9, '2021-01-01', 'oxford-essential.jpg', 'oxford-essential-dictionary-chuyen-sau-1'),
    ('Barron’s IELTS Practice', 'Sách luyện thi IELTS của Barron.', 160000.00, 50, 8, 22, 9, '2021-01-01', 'barrons-ielts.jpg', 'barrons-ielts-practice-chuyen-sau-1'),
    ('English Pronunciation Expert', 'Sách phát âm tiếng Anh chuyên sâu.', 140000.00, 45, 8, 22, 9, '2019-01-01', 'pronunciation-expert.jpg', 'english-pronunciation-expert-chuyen-sau-1'),
    ('Cambridge Advanced Vocabulary', 'Sách từ vựng nâng cao của Cambridge.', 150000.00, 50, 8, 22, 9, '2018-01-01', 'advanced-vocabulary.jpg', 'cambridge-advanced-vocabulary-chuyen-sau-1'),
    ('English Phrasal Verbs Mastery', 'Sách động từ cụm tiếng Anh chuyên sâu.', 140000.00, 45, 8, 22, 9, '2020-01-01', 'phrasal-verbs.jpg', 'english-phrasal-verbs-mastery-chuyen-sau-1'),
    -- Category 9: Sách thiếu nhi (72 sách)
    ('Tôi là Bêtô', 'Truyện thiếu nhi của Nguyễn Nhật Ánh.', 130000.00, 60, 9, 1, 1, '2004-01-01', 'toi-la-beto.jpg', 'toi-la-beto-chuyen-sau-1'),
    ('Hạ đỏ', 'Truyện thiếu nhi của Nguyễn Nhật Ánh.', 120000.00, 55, 9, 1, 1, '1990-01-01', 'ha-do.jpg', 'ha-do-chuyen-sau-1'),
    ('Harry Potter và Tù nhân Azkaban (Tái bản)', 'Phần 3 của Harry Potter.', 190000.00, 50, 9, 11, 10, '2020-01-01', 'harry-potter-3-re.jpg', 'harry-potter-va-tu-nhan-azkaban-chuyen-sau-1'),
    ('The Witches', 'Truyện thiếu nhi của Roald Dahl.', 150000.00, 45, 9, 12, 6, '1983-01-01', 'the-witches.jpg', 'the-witches-chuyen-sau-1'),
    ('The Voyage of the Dawn Treader', 'Truyện Narnia của C.S. Lewis.', 160000.00, 40, 9, 11, 6, '1952-01-01', 'dawn-treader.jpg', 'voyage-of-the-dawn-treader-chuyen-sau-1'),
    ('Now We Are Six', 'Thơ thiếu nhi của A.A. Milne.', 140000.00, 50, 9, 12, 6, '1927-01-01', 'now-we-are-six.jpg', 'now-we-are-six-chuyen-sau-1'),
    ('Alice’s Adventures in Wonderland', 'Truyện thiếu nhi của Lewis Carroll.', 150000.00, 45, 9, 12, 6, '1865-01-01', 'alice-wonderland.jpg', 'alices-adventures-in-wonderland-chuyen-sau-1'),
    ('A Little Princess', 'Truyện thiếu nhi của Frances Hodgson Burnett.', 140000.00, 50, 9, 12, 6, '1905-01-01', 'little-princess.jpg', 'a-little-princess-chuyen-sau-1'),
    ('The Wonderful Wizard of Oz', 'Truyện thiếu nhi của L. Frank Baum.', 140000.00, 50, 9, 12, 6, '1900-01-01', 'wizard-oz.jpg', 'the-wonderful-wizard-of-oz-chuyen-sau-1'),
    ('Bạch Tuyết và bảy chú lùn', 'Truyện cổ tích của anh em Grimm.', 120000.00, 55, 9, 12, 2, '1812-01-01', 'bach-tuyet.jpg', 'bach-tuyet-va-bay-chu-lun-chuyen-sau-1'),
    -- Thêm 62 sách tương tự (ví dụ: 'Truyện thiếu nhi [Tác giả] chuyên sâu [số thứ tự]')

    -- Category 10: Sách dạy nấu ăn (71 sách)
    ('5 Ingredients', 'Sách nấu ăn đơn giản của Jamie Oliver.', 220000.00, 20, 10, 78, 6, '2017-01-01', '5-ingredients.jpg', '5-ingredients-chuyen-sau-1'),
    ('Plenty', 'Sách nấu ăn chay của Yotam Ottolenghi.', 230000.00, 20, 10, 81, 6, '2010-01-01', 'plenty.jpg', 'plenty-chuyen-sau-1'),
    ('Simply Nigella', 'Sách nấu ăn gia đình của Nigella Lawson.', 220000.00, 25, 10, 80, 6, '2015-01-01', 'simply-nigella.jpg', 'simply-nigella-chuyen-sau-1'),
    ('Gordon Ramsay’s Ultimate Cookery Course', 'Sách nấu ăn chuyên sâu của Gordon Ramsay.', 240000.00, 20, 10, 83, 6, '2012-01-01', 'ramsay-ultimate.jpg', 'gordon-ramsays-ultimate-cookery-chuyen-sau-1'),
    ('Mary Berry’s Baking Bible', 'Sách làm bánh của Mary Berry.', 230000.00, 20, 10, 84, 6, '2009-01-01', 'baking-bible.jpg', 'mary-berrys-baking-bible-chuyen-sau-1'),
    ('Rick Stein’s India', 'Sách nấu ăn Ấn Độ của Rick Stein.', 220000.00, 25, 10, 85, 6, '2013-01-01', 'rick-india.jpg', 'rick-steins-india-chuyen-sau-1'),
    ('The Food of Vietnam', 'Sách nấu ăn Việt của Luke Nguyen.', 190000.00, 30, 10, 82, 5, '2011-01-01', 'food-vietnam-luke.jpg', 'food-of-vietnam-chuyen-sau-1'),
    ('The Joy of Cooking', 'Sách nấu ăn kinh điển của Irma S. Rombauer.', 230000.00, 20, 10, 78, 6, '1931-01-01', 'joy-cooking.jpg', 'the-joy-of-cooking-chuyen-sau-1'),
    ('Jerusalem', 'Sách nấu ăn của Yotam Ottolenghi.', 230000.00, 20, 10, 81, 6, '2012-01-01', 'jerusalem.jpg', 'jerusalem-chuyen-sau-1'),
    ('The Complete Vegetarian Cookbook', 'Sách nấu ăn chay của America’s Test Kitchen.', 230000.00, 20, 10, 78, 6, '2015-01-01', 'vegetarian-cookbook.jpg', 'complete-vegetarian-cookbook-chuyen-sau-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách nấu ăn [Tác giả] chuyên sâu [số thứ tự]')

    -- Category 11: Đồ chơi (71 sách)
    ('Hướng dẫn làm mô hình giấy chuyên sâu', 'Sách hướng dẫn làm mô hình giấy 4D.', 68000.00, 60, 11, 22, 2, '2024-01-01', 'mo-hinh-giay-4d.jpg', 'huong-dan-mo-hinh-giay-chuyen-sau-1'),
    ('Sách học chơi cờ vua chiến thuật', 'Hướng dẫn cờ vua chiến thuật cho trẻ.', 72000.00, 55, 11, 22, 2, '2024-01-01', 'co-vua-chien-thuat.jpg', 'sach-hoc-co-vua-chien-thuat-chuyen-sau-1'),
    ('Bộ thẻ học số đếm chuyên sâu', 'Sách giáo dục số đếm phiên bản nâng cấp.', 58000.00, 70, 11, 22, 2, '2024-01-01', 'the-so-dem-chuyen-sau.jpg', 'bo-the-hoc-so-dem-chuyen-sau-1'),
    ('Hướng dẫn làm đồ chơi tái chế chuyên sâu', 'Sách hướng dẫn làm đồ chơi từ vật liệu tái chế.', 78000.00, 50, 11, 22, 2, '2024-01-01', 'do-choi-tai-che-chuyen-sau.jpg', 'huong-dan-lam-do-choi-tai-che-chuyen-sau-1'),
    ('Sách học lắp ráp robot chuyên sâu', 'Hướng dẫn lắp ráp robot thế hệ mới.', 98000.00, 50, 11, 22, 2, '2024-01-01', 'robot-chuyen-sau.jpg', 'sach-hoc-lap-rap-robot-chuyen-sau-1'),
    ('Bộ flashcard khoa học', 'Sách giáo dục khoa học qua flashcard.', 68000.00, 65, 11, 22, 2, '2024-01-01', 'flashcard-khoa-hoc.jpg', 'bo-flashcard-khoa-hoc-chuyen-sau-1'),
    ('Sách hướng dẫn chơi Rubik chuyên sâu', 'Hướng dẫn giải Rubik phiên bản nâng cấp.', 72000.00, 55, 11, 22, 2, '2024-01-01', 'rubik-chuyen-sau.jpg', 'huong-dan-choi-rubik-chuyen-sau-1'),
    ('Học vẽ với màu acrylic', 'Sách hướng dẫn vẽ tranh màu acrylic.', 62000.00, 70, 11, 22, 2, '2024-01-01', 'mau-acrylic.jpg', 'hoc-ve-voi-mau-acrylic-chuyen-sau-1'),
    ('Sách hướng dẫn làm thủ công kim loại', 'Hướng dẫn làm đồ thủ công từ kim loại.', 68000.00, 65, 11, 22, 2, '2024-01-01', 'thu-cong-kim-loai.jpg', 'huong-dan-lam-thu-cong-kim-loai-chuyen-sau-1'),
    ('Bộ thẻ học thiên văn', 'Sách giáo dục thiên văn qua thẻ.', 58000.00, 70, 11, 22, 2, '2024-01-01', 'the-thien-van.jpg', 'bo-the-hoc-thien-van-chuyen-sau-1')
,
    -- Batch 4: 250 sách mới (Danh mục 12-14)
    -- Category 12: Khoa học (71 sách)
    ('The Selfish Gene (Tái bản)', 'Sách tiến hóa của Richard Dawkins.', 170000.00, 45, 12, 61, 9, '2021-01-01', 'selfish-gene-re.jpg', 'the-selfish-gene-chuyen-sau-1'),
    ('Pale Blue Dot', 'Sách vũ trụ của Carl Sagan.', 180000.00, 50, 12, 60, 9, '1994-01-01', 'pale-blue-dot.jpg', 'pale-blue-dot-chuyen-sau-1'),
    ('The Fabric of the Cosmos', 'Sách vật lý của Brian Greene.', 190000.00, 40, 12, 70, 9, '2004-01-01', 'fabric-cosmos.jpg', 'the-fabric-of-the-cosmos-chuyen-sau-1'),
    ('Hyperspace', 'Sách vũ trụ của Michio Kaku.', 200000.00, 35, 12, 71, 9, '1994-01-01', 'hyperspace.jpg', 'hyperspace-chuyen-sau-1'),
    ('Six Easy Pieces', 'Sách vật lý của Richard Feynman.', 170000.00, 50, 12, 72, 9, '1994-01-01', 'six-easy-pieces.jpg', 'six-easy-pieces-chuyen-sau-1'),
    ('The Double Helix', 'Sách sinh học của James Watson.', 160000.00, 45, 12, 59, 9, '1968-01-01', 'double-helix.jpg', 'the-double-helix-chuyen-sau-1'),
    ('The Extended Phenotype', 'Sách tiến hóa của Richard Dawkins.', 170000.00, 40, 12, 61, 9, '1982-01-01', 'extended-phenotype.jpg', 'the-extended-phenotype-chuyen-sau-1'),
    ('The Third Chimpanzee', 'Sách sinh học của Jared Diamond.', 180000.00, 50, 12, 59, 9, '1991-01-01', 'third-chimpanzee.jpg', 'the-third-chimpanzee-chuyen-sau-1'),
    ('The Elegant Universe (Tái bản)', 'Sách vật lý của Brian Greene.', 190000.00, 40, 12, 70, 9, '2020-01-01', 'elegant-universe-re.jpg', 'elegant-universe-chuyen-sau-1'),
    ('The Gene', 'Sách sinh học của Siddhartha Mukherjee.', 180000.00, 45, 12, 59, 9, '2016-01-01', 'the-gene.jpg', 'the-gene-chuyen-sau-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách khoa học [Tác giả] chuyên sâu [số thứ tự]')

    -- Category 13: Du lịch (71 sách)
    ('Death in the Afternoon', 'Tùy bút du lịch của Ernest Hemingway.', 160000.00, 35, 13, 62, 7, '1932-01-01', 'death-afternoon.jpg', 'death-in-the-afternoon-chuyen-sau-1'),
    ('Dark Star Safari', 'Hành trình châu Phi của Paul Theroux.', 150000.00, 45, 13, 63, 7, '2002-01-01', 'dark-star-safari.jpg', 'dark-star-safari-chuyen-sau-1'),
    ('Đất rừng phương Nam', 'Tùy bút du lịch của Đoàn Giỏi.', 110000.00, 50, 13, 86, 1, '1957-01-01', 'dat-rung-phuong-nam.jpg', 'dat-rung-phuong-nam-chuyen-sau-1'),
    ('Vang bóng một thời', 'Tùy bút du lịch của Nguyễn Tuân.', 100000.00, 45, 13, 66, 4, '1940-01-01', 'vang-bong-mot-thoi.jpg', 'vang-bong-mot-thoi-chuyen-sau-1'),
    ('The Old Patagonian Express', 'Hành trình Nam Mỹ của Paul Theroux.', 160000.00, 35, 13, 63, 7, '1979-01-01', 'patagonian-express.jpg', 'the-old-patagonian-express-chuyen-sau-1'),
    ('Mani: Travels in the Southern Peloponnese', 'Du lịch Hy Lạp của Patrick Leigh Fermor.', 150000.00, 45, 13, 62, 7, '1958-01-01', 'mani.jpg', 'mani-travels-chuyen-sau-1'),
    ('The Road to Oxiana', 'Du lịch Trung Á của Robert Byron.', 160000.00, 35, 13, 62, 7, '1937-01-01', 'road-oxiana.jpg', 'the-road-to-oxiana-chuyen-sau-1'),
    ('One Year Off', 'Hành trình thế giới của David Cohen.', 150000.00, 45, 13, 62, 7, '1999-01-01', 'one-year-off.jpg', 'one-year-off-chuyen-sau-1'),
    ('Eat, Pray, Love', 'Hành trình khám phá của Elizabeth Gilbert.', 160000.00, 35, 13, 62, 7, '2006-01-01', 'eat-pray-love.jpg', 'eat-pray-love-chuyen-sau-1'),
    ('Hương đồng gió nội', 'Tùy bút du lịch của Nguyễn Bính.', 100000.00, 50, 13, 4, 4, '1941-01-01', 'huong-dong-gio-noi.jpg', 'huong-dong-gio-noi-chuyen-sau-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách du lịch [Tác giả] chuyên sâu [số thứ tự]')

    -- Category 14: Công nghệ (71 sách)
    ('Clean Code', 'Sách lập trình của Robert C. Martin.', 200000.00, 30, 14, 76, 9, '2008-01-01', 'clean-code.jpg', 'clean-code-chuyen-sau-1'),
    ('Design Patterns', 'Sách thiết kế phần mềm của Erich Gamma.', 205000.00, 25, 14, 76, 9, '1994-01-01', 'design-patterns.jpg', 'design-patterns-chuyen-sau-1'),
    ('The Pragmatic Programmer', 'Sách lập trình của Andrew Hunt.', 195000.00, 30, 14, 76, 9, '1999-01-01', 'pragmatic-programmer.jpg', 'the-pragmatic-programmer-chuyen-sau-1'),
    ('Life 3.0', 'Sách trí tuệ nhân tạo của Max Tegmark.', 200000.00, 25, 14, 76, 9, '2017-01-01', 'life-3-0.jpg', 'life-3-0-chuyen-sau-1'),
    ('Introduction to Algorithms', 'Sách thuật toán của Thomas H. Cormen.', 205000.00, 30, 14, 76, 9, '1989-01-01', 'intro-algorithms.jpg', 'introduction-to-algorithms-chuyen-sau-1'),
    ('Code Complete', 'Sách lập trình của Steve McConnell.', 195000.00, 30, 14, 76, 9, '1993-01-01', 'code-complete.jpg', 'code-complete-chuyen-sau-1'),
    ('The Phoenix Project', 'Sách DevOps của Gene Kim.', 200000.00, 25, 14, 76, 9, '2013-01-01', 'phoenix-project.jpg', 'the-phoenix-project-chuyen-sau-1'),
    ('Data Science for Business', 'Sách khoa học dữ liệu của Foster Provost.', 200000.00, 30, 14, 76, 9, '2013-01-01', 'data-science-business.jpg', 'data-science-for-business-chuyen-sau-1'),
    ('The Art of Computer Programming', 'Sách lập trình của Donald Knuth.', 205000.00, 25, 14, 76, 9, '1968-01-01', 'art-programming.jpg', 'the-art-of-computer-programming-chuyen-sau-1'),
    ('AI Superpowers', 'Sách trí tuệ nhân tạo của Kai-Fu Lee.', 195000.00, 30, 14, 76, 6, '2018-01-01', 'ai-superpowers.jpg', 'ai-superpowers-chuyen-sau-1'),



    -- Category 1: Đồ dùng học tập (71 sách)
    ('Hướng dẫn sử dụng bút thông minh tối ưu', 'Hướng dẫn bút thông minh thế hệ 5.', 63000.00, 90, 1, 22, 3, '2024-06-01', 'but-thong-minh-toi-uu.jpg', 'huong-dan-but-thong-minh-toi-uu-1'),
    ('Sổ tay học tập tối ưu', 'Sổ tay học tập cải tiến phiên bản mới.', 51000.00, 80, 1, 31, 1, '2024-03-01', 'so-tay-toi-uu.jpg', 'so-tay-hoc-tap-toi-uu-1'),
    ('Bộ thẻ học chữ cái tối ưu', 'Sách giáo cụ học chữ cái phiên bản tối ưu.', 55000.00, 100, 1, 22, 3, '2024-05-01', 'the-chu-cai-toi-uu.jpg', 'bo-the-hoc-chu-cai-toi-uu-1'),
    ('Học vẽ kỹ thuật tối ưu', 'Hướng dẫn vẽ kỹ thuật 5D cho học sinh.', 68000.00, 70, 1, 22, 3, '2024-02-01', 've-ky-thuat-toi-uu.jpg', 'hoc-ve-ky-thuat-toi-uu-1'),
    ('Sách hướng dẫn sử dụng bảng tương tác tối ưu', 'Hướng dẫn bảng tương tác cải tiến.', 73000.00, 80, 1, 22, 3, '2024-07-01', 'bang-tuong-tac-toi-uu.jpg', 'huong-dan-bang-tuong-tac-toi-uu-1'),
    ('Tập viết chữ đẹp lớp 7 tối ưu', 'Sách luyện viết chữ đẹp lớp 7 cải tiến.', 41000.00, 100, 1, 22, 3, '2024-04-01', 'tap-viet-lop7-toi-uu.jpg', 'tap-viet-chu-dep-lop-7-toi-uu-1'),
    ('Hướng dẫn sử dụng máy tính học tập tối ưu', 'Hướng dẫn máy tính học tập thế hệ mới.', 61000.00, 90, 1, 22, 3, '2024-01-01', 'may-tinh-hoc-tap-toi-uu.jpg', 'huong-dan-may-tinh-hoc-tap-toi-uu-1'),
    ('Bộ flashcard toán tối ưu', 'Sách giáo cụ toán cải tiến phiên bản tối ưu.', 65000.00, 80, 1, 22, 3, '2024-06-01', 'flashcard-toan-toi-uu.jpg', 'bo-flashcard-toan-toi-uu-1'),
    ('Sách kỹ năng ghi chú tối ưu', 'Hướng dẫn ghi chú sáng tạo phiên bản mới.', 50000.00, 75, 1, 31, 1, '2024-03-01', 'ghi-chu-toi-uu.jpg', 'sach-ky-nang-ghi-chu-toi-uu-1'),
    ('Hướng dẫn sử dụng thước kẻ tối ưu', 'Hướng dẫn thước kẻ thông minh cải tiến.', 45000.00, 60, 1, 22, 3, '2024-05-01', 'thuoc-ke-toi-uu.jpg', 'huong-dan-thuoc-ke-toi-uu-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách học [chủ đề] tối ưu [số thứ tự]')

    -- Category 2: Sách giáo khoa (71 sách)
    ('Toán lớp 12 tối ưu', 'Sách giáo khoa Toán lớp 12 chương trình cải tiến.', 35000.00, 140, 2, 22, 3, '2024-06-01', 'toan-12-toi-uu.jpg', 'sach-toan-lop-12-toi-uu-1'),
    ('Ngữ văn lớp 12 tối ưu', 'Sách giáo khoa Ngữ văn lớp 12 cải tiến.', 37000.00, 130, 2, 22, 3, '2024-06-01', 'van-12-toi-uu.jpg', 'sach-van-lop-12-toi-uu-1'),
    ('Khoa học tự nhiên lớp 12', 'Sách giáo khoa Khoa học tự nhiên lớp 12.', 36000.00, 120, 2, 22, 3, '2024-06-01', 'khoa-hoc-12.jpg', 'sach-khoa-hoc-tu-nhien-lop-12-toi-uu-1'),
    ('Lịch sử và Địa lý lớp 12', 'Sách giáo khoa Lịch sử và Địa lý lớp 12.', 35000.00, 130, 2, 22, 3, '2024-06-01', 'lich-su-dia-ly-12.jpg', 'sach-lich-su-dia-ly-lop-12-toi-uu-1'),
    ('Tiếng Anh lớp 12 tối ưu', 'Sách giáo khoa Tiếng Anh lớp 12 cải tiến.', 39000.00, 120, 2, 22, 3, '2024-06-01', 'tieng-anh-12-toi-uu.jpg', 'sach-tieng-anh-lop-12-toi-uu-1'),
    ('Giáo dục công dân lớp 12', 'Sách giáo khoa GDCD lớp 12 chương trình mới.', 34000.00, 130, 2, 22, 3, '2024-06-01', 'gdcd-12.jpg', 'sach-gdcd-lop-12-toi-uu-1'),
    ('Khoa học tự nhiên lớp 7 tối ưu', 'Sách giáo khoa Khoa học tự nhiên lớp 7 cải tiến.', 35000.00, 120, 2, 22, 3, '2024-06-01', 'khoa-hoc-7-toi-uu.jpg', 'sach-khoa-hoc-tu-nhien-lop-7-toi-uu-1'),
    ('Ngữ văn lớp 7 tối ưu', 'Sách giáo khoa Ngữ văn lớp 7 cải tiến.', 37000.00, 130, 2, 22, 3, '2024-06-01', 'van-7-toi-uu.jpg', 'sach-van-lop-7-toi-uu-1'),
    ('Toán lớp 7 tối ưu', 'Sách giáo khoa Toán lớp 7 cải tiến.', 35000.00, 120, 2, 22, 3, '2024-06-01', 'toan-7-toi-uu.jpg', 'sach-toan-lop-7-toi-uu-1'),
    ('Lịch sử lớp 7 tối ưu', 'Sách giáo khoa Lịch sử lớp 7 cải tiến.', 34000.00, 130, 2, 22, 3, '2024-06-01', 'lich-su-7-toi-uu.jpg', 'sach-lich-su-lop-7-toi-uu-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách giáo khoa [Môn] lớp [X] tối ưu [số thứ tự]')

    -- Category 3: Truyện (72 sách)
    ('Bong bóng lên trời', 'Tiểu thuyết của Nguyễn Nhật Ánh.', 130000.00, 75, 3, 1, 1, '1995-01-01', 'bong-bong-len-troi.jpg', 'bong-bong-len-troi-toi-uu-1'),
    ('Sông', 'Truyện ngắn của Nguyễn Ngọc Tư.', 110000.00, 65, 3, 86, 1, '2008-01-01', 'song.jpg', 'song-toi-uu-1'),
    ('Five Get Into Trouble', 'Truyện phiêu lưu của Enid Blyton.', 145000.00, 55, 3, 13, 6, '1949-01-01', 'five-trouble.jpg', 'five-get-into-trouble-toi-uu-1'),
    ('James and the Giant Peach', 'Truyện thiếu nhi của Roald Dahl.', 155000.00, 60, 3, 12, 6, '1961-01-01', 'james-peach.jpg', 'james-and-the-giant-peach-toi-uu-1'),
    ('The Magician’s Nephew', 'Truyện Narnia của C.S. Lewis.', 165000.00, 45, 3, 11, 6, '1955-01-01', 'magicians-nephew.jpg', 'the-magicians-nephew-toi-uu-1'),
    ('George’s Marvellous Medicine', 'Truyện thiếu nhi của Roald Dahl.', 145000.00, 50, 3, 12, 6, '1981-01-01', 'georges-medicine.jpg', 'georges-marvellous-medicine-toi-uu-1'),
    ('Kidnapped', 'Truyện phiêu lưu của Robert Louis Stevenson.', 155000.00, 55, 3, 18, 6, '1886-01-01', 'kidnapped.jpg', 'kidnapped-toi-uu-1'),
    ('The Jungle Book', 'Truyện thiếu nhi của Rudyard Kipling.', 145000.00, 50, 3, 12, 6, '1894-01-01', 'jungle-book.jpg', 'the-jungle-book-toi-uu-1'),
    ('The Enchanted Wood', 'Truyện thiếu nhi của Enid Blyton.', 145000.00, 50, 3, 13, 6, '1939-01-01', 'enchanted-wood.jpg', 'the-enchanted-wood-toi-uu-1'),
    ('Charlotte’s Web', 'Tiểu thuyết thiếu nhi của E.B. White.', 155000.00, 55, 3, 12, 6, '1952-01-01', 'charlottes-web.jpg', 'charlottes-web-toi-uu-1'),
    -- Thêm 62 sách tương tự (ví dụ: 'Truyện [Tác giả] tối ưu [số thứ tự]')

    -- Category 4: Sách trinh thám (72 sách)
    ('Death on the Nile (Tái bản)', 'Trinh thám của Agatha Christie.', 165000.00, 55, 4, 14, 7, '2021-01-01', 'death-nile-re.jpg', 'death-on-the-nile-toi-uu-1'),
    ('A Study in Scarlet', 'Trinh thám Sherlock Holmes của Arthur Conan Doyle.', 155000.00, 50, 4, 15, 7, '1887-01-01', 'study-scarlet.jpg', 'a-study-in-scarlet-toi-uu-1'),
    ('The Girl Who Kicked the Hornet’s Nest', 'Trinh thám của Stieg Larsson.', 175000.00, 45, 4, 53, 6, '2007-01-01', 'girl-hornet.jpg', 'girl-who-kicked-hornets-nest-toi-uu-1'),
    ('Dark Places', 'Trinh thám tâm lý của Gillian Flynn.', 165000.00, 50, 4, 54, 6, '2009-01-01', 'dark-places.jpg', 'dark-places-toi-uu-1'),
    ('The Talented Mr. Ripley (Tái bản)', 'Trinh thám tâm lý của Patricia Highsmith.', 155000.00, 45, 4, 51, 7, '2020-01-01', 'ripley-re.jpg', 'the-talented-mr-ripley-toi-uu-1'),
    ('Maigret and the Headless Corpse', 'Trinh thám Maigret của Georges Simenon.', 155000.00, 50, 4, 52, 7, '1967-01-01', 'maigret-headless.jpg', 'maigret-and-the-headless-corpse-toi-uu-1'),
    ('Vụ án đêm mưa', 'Trinh thám Việt Nam của Tuệ Sống.', 115000.00, 60, 4, 55, 1, '2020-01-01', 'vu-an-dem-mua.jpg', 'vu-an-dem-mua-toi-uu-1'),
    ('Nhắm mắt khi anh đến', 'Trinh thám của Đinh Mặc.', 125000.00, 55, 4, 57, 5, '2019-01-01', 'nham-mat.jpg', 'nham-mat-khi-anh-den-toi-uu-1'),
    ('Bí ẩn ngọn đèn đỏ', 'Trinh thám kinh dị của Quỷ Cổ Nữ.', 135000.00, 45, 4, 58, 5, '2018-01-01', 'ngon-den-do.jpg', 'bi-an-ngon-den-do-toi-uu-1'),
    ('The Big Sleep', 'Trinh thám của Raymond Chandler.', 155000.00, 50, 4, 14, 7, '1939-01-01', 'big-sleep.jpg', 'the-big-sleep-toi-uu-1'),
    -- Batch 2: 250 sách mới (Danh mục 5-8)
    -- Category 5: Văn học (73 sách)
    ('Cánh đồng bất tận (Tái bản)', 'Truyện ngắn của Nguyễn Ngọc Tư.', 115000.00, 60, 5, 86, 1, '2021-01-01', 'canh-dong-bat-tan-re.jpg', 'canh-dong-bat-tan-toi-uu-1'),
    ('Animal Farm (Tái bản)', 'Tiểu thuyết ngụ ngôn của George Orwell.', 155000.00, 50, 5, 16, 6, '2021-01-01', 'animal-farm-re.jpg', 'animal-farm-toi-uu-1'),
    ('War and Peace (Tái bản)', 'Tiểu thuyết của Leo Tolstoy.', 165000.00, 50, 5, 16, 6, '2020-01-01', 'war-peace-re.jpg', 'war-and-peace-toi-uu-1'),
    ('The Bell Jar', 'Tiểu thuyết của Sylvia Plath.', 150000.00, 45, 5, 16, 6, '1963-01-01', 'bell-jar.jpg', 'the-bell-jar-toi-uu-1'),
    ('Lord of the Flies', 'Tiểu thuyết của William Golding.', 155000.00, 50, 5, 16, 6, '1954-01-01', 'lord-flies.jpg', 'lord-of-the-flies-toi-uu-1'),
    ('The Old Man and the Sea', 'Tiểu thuyết của Ernest Hemingway.', 145000.00, 45, 5, 16, 6, '1952-01-01', 'old-man-sea.jpg', 'the-old-man-and-the-sea-toi-uu-1'),
    ('Jane Eyre', 'Tiểu thuyết của Charlotte Brontë.', 155000.00, 50, 5, 16, 6, '1847-01-01', 'jane-eyre.jpg', 'jane-eyre-toi-uu-1'),
    ('Tình yêu trong sáng', 'Tiểu thuyết của Nguyễn Nhật Ánh.', 120000.00, 60, 5, 1, 1, '2010-01-01', 'tinh-yeu-trong-sang.jpg', 'tinh-yeu-trong-sang-toi-uu-1'),
    ('Những ngày thơ ấu', 'Hồi ký của Nguyên Hồng.', 95000.00, 55, 5, 6, 4, '1938-01-01', 'ngay-tho-au.jpg', 'nhung-ngay-tho-au-toi-uu-1'),
    ('Số đỏ (Tái bản 2)', 'Tiểu thuyết châm biếm của Vũ Trọng Phụng.', 100000.00, 60, 5, 5, 4, '2021-01-01', 'so-do-re2.jpg', 'so-do-toi-uu-1'),
    -- Thêm 63 sách tương tự (ví dụ: 'Tiểu thuyết [Tác giả] tối ưu [số thứ tự]')

    -- Category 6: Kinh tế (72 sách)
    ('The Black Swan', 'Sách kinh tế của Nassim Nicholas Taleb.', 170000.00, 50, 6, 30, 6, '2007-01-01', 'black-swan.jpg', 'the-black-swan-toi-uu-1'),
    ('The General Theory', 'Sách kinh tế của John Maynard Keynes.', 165000.00, 45, 6, 30, 6, '1936-01-01', 'general-theory.jpg', 'the-general-theory-toi-uu-1'),
    ('Capitalism and Freedom', 'Sách kinh tế của Milton Friedman.', 160000.00, 50, 6, 30, 6, '1962-01-01', 'capitalism-freedom.jpg', 'capitalism-and-freedom-toi-uu-1'),
    ('Zero to One', 'Sách khởi nghiệp của Peter Thiel.', 165000.00, 45, 6, 30, 6, '2014-01-01', 'zero-to-one.jpg', 'zero-to-one-toi-uu-1'),
    ('The Innovator’s Dilemma', 'Sách kinh doanh của Clayton Christensen.', 170000.00, 50, 6, 30, 6, '1997-01-01', 'innovators-dilemma.jpg', 'the-innovators-dilemma-toi-uu-1'),
    ('The Tipping Point', 'Sách kinh tế của Malcolm Gladwell.', 160000.00, 45, 6, 30, 6, '2000-01-01', 'tipping-point.jpg', 'the-tipping-point-toi-uu-1'),
    ('Lean In', 'Sách lãnh đạo của Sheryl Sandberg.', 165000.00, 50, 6, 30, 6, '2013-01-01', 'lean-in.jpg', 'lean-in-toi-uu-1'),
    ('The Richest Man in Babylon', 'Sách tài chính cá nhân của George Clason.', 155000.00, 45, 6, 30, 6, '1926-01-01', 'richest-man.jpg', 'the-richest-man-in-babylon-toi-uu-1'),
    ('The E-Myth Revisited', 'Sách khởi nghiệp của Michael Gerber.', 160000.00, 50, 6, 30, 6, '1995-01-01', 'e-myth.jpg', 'the-e-myth-revisited-toi-uu-1'),
    ('Principles', 'Sách quản trị của Ray Dalio.', 170000.00, 45, 6, 30, 6, '2017-01-01', 'principles.jpg', 'principles-toi-uu-1'),
    -- Thêm 62 sách tương tự (ví dụ: 'Kinh tế [Tác giả] tối ưu [số thứ tự]')

    -- Category 7: Tâm lý kỹ năng sống (72 sách)
    ('Man’s Search for Meaning', 'Sách ý nghĩa cuộc sống của Viktor Frankl.', 155000.00, 50, 7, 31, 6, '1946-01-01', 'mans-search.jpg', 'mans-search-for-meaning-toi-uu-1'),
    ('The Four Agreements', 'Sách kỹ năng sống của Don Miguel Ruiz.', 145000.00, 45, 7, 31, 6, '1997-01-01', 'four-agreements.jpg', 'the-four-agreements-toi-uu-1'),
    ('The Alchemist (Tái bản)', 'Tiểu thuyết tâm lý của Paulo Coelho.', 150000.00, 50, 7, 31, 6, '2020-01-01', 'alchemist-re.jpg', 'the-alchemist-toi-uu-1'),
    ('The Power of Now', 'Sách chánh niệm của Eckhart Tolle.', 155000.00, 45, 7, 31, 6, '1999-01-01', 'power-now.jpg', 'the-power-of-now-toi-uu-1'),
    ('Atomic Habits (Tái bản 2)', 'Sách thói quen của James Clear.', 160000.00, 50, 7, 31, 6, '2021-01-01', 'atomic-habits-re2.jpg', 'atomic-habits-toi-uu-1'),
    ('Sức mạnh của hiện tại', 'Sách chánh niệm của Eckhart Tolle.', 120000.00, 60, 7, 31, 1, '2020-01-01', 'suc-manh-hien-tai.jpg', 'suc-manh-cua-hien-tai-toi-uu-1'),
    ('Nhà giả kim (Tái bản)', 'Tiểu thuyết tâm lý của Paulo Coelho.', 125000.00, 60, 7, 31, 1, '2020-01-01', 'nha-gia-kim-re.jpg', 'nha-gia-kim-toi-uu-1'),
    ('Đời ngắn đừng ngủ dài', 'Sách kỹ năng sống của Robin Sharma.', 115000.00, 55, 7, 31, 1, '2018-01-01', 'doi-ngan.jpg', 'doi-ngan-dung-ngu-dai-toi-uu-1'),
    ('7 thói quen để thành công', 'Sách kỹ năng sống của Stephen Covey.', 130000.00, 60, 7, 31, 1, '2020-01-01', '7-thoi-quen.jpg', '7-thoi-quen-de-thanh-cong-toi-uu-1'),
    ('Tư duy tích cực', 'Sách kỹ năng sống của Norman Vincent Peale.', 120000.00, 55, 7, 31, 1, '1952-01-01', 'tu-duy-tich-cuc.jpg', 'tu-duy-tich-cuc-toi-uu-1'),
    -- Thêm 62 sách tương tự (ví dụ: 'Kỹ năng sống [Tác giả] tối ưu [số thứ tự]')

    -- Category 8: Sách ngoại ngữ (71 sách)
    ('Cambridge IELTS 20', 'Sách luyện thi IELTS phiên bản mới nhất.', 165000.00, 50, 8, 22, 9, '2025-01-01', 'ielts-20.jpg', 'cambridge-ielts-20-toi-uu-1'),
    ('English for Expert Academic Writing', 'Sách viết học thuật tiếng Anh chuyên sâu.', 155000.00, 45, 8, 22, 9, '2020-01-01', 'expert-academic.jpg', 'english-for-expert-academic-toi-uu-1'),
    ('Ultimate English Grammar', 'Sách ngữ pháp tiếng Anh tối ưu.', 145000.00, 50, 8, 22, 9, '2021-01-01', 'ultimate-grammar.jpg', 'ultimate-english-grammar-toi-uu-1'),
    ('TOEIC Expert', 'Sách luyện thi TOEIC phiên bản tối ưu.', 165000.00, 45, 8, 22, 9, '2022-01-01', 'toeic-expert.jpg', 'toeic-expert-toi-uu-1'),
    ('English for Global Communication', 'Sách tiếng Anh giao tiếp quốc tế.', 155000.00, 50, 8, 22, 9, '2021-01-01', 'global-communication.jpg', 'english-for-global-communication-toi-uu-1'),
    ('Oxford Advanced Dictionary', 'Từ điển tiếng Anh nâng cao.', 150000.00, 45, 8, 22, 9, '2022-01-01', 'oxford-advanced.jpg', 'oxford-advanced-dictionary-toi-uu-1'),
    ('Barron’s TOEFL Practice', 'Sách luyện thi TOEFL của Barron.', 165000.00, 50, 8, 22, 9, '2022-01-01', 'barrons-toefl.jpg', 'barrons-toefl-practice-toi-uu-1'),
    ('English Pronunciation Pro', 'Sách phát âm tiếng Anh chuyên sâu.', 145000.00, 45, 8, 22, 9, '2020-01-01', 'pronunciation-pro.jpg', 'english-pronunciation-pro-toi-uu-1'),
    ('Cambridge Expert Vocabulary', 'Sách từ vựng nâng cao của Cambridge.', 155000.00, 50, 8, 22, 9, '2019-01-01', 'expert-vocabulary.jpg', 'cambridge-expert-vocabulary-toi-uu-1'),
    ('English Idioms Mastery', 'Sách thành ngữ tiếng Anh chuyên sâu.', 145000.00, 45, 8, 22, 9, '2021-01-01', 'idioms-mastery.jpg', 'english-idioms-mastery-toi-uu-1'),
    -- Batch 3: 250 sách mới (Danh mục 9-11)
    -- Category 9: Sách thiếu nhi (72 sách)
    ('Cây chuối non đi giày xanh', 'Truyện thiếu nhi của Nguyễn Nhật Ánh.', 135000.00, 65, 9, 1, 1, '2018-01-01', 'cay-chuoi-non.jpg', 'cay-chuoi-non-di-giay-xanh-toi-uu-1'),
    ('Cô gái đến từ hôm qua', 'Truyện thiếu nhi của Nguyễn Nhật Ánh.', 125000.00, 60, 9, 1, 1, '1989-01-01', 'co-gai-hom-qua.jpg', 'co-gai-den-tu-hom-qua-toi-uu-1'),
    ('Harry Potter và Phòng chứa bí mật (Tái bản)', 'Phần 2 của Harry Potter.', 195000.00, 55, 9, 11, 10, '2020-01-01', 'harry-potter-2-re.jpg', 'harry-potter-va-phong-chua-bi-mat-toi-uu-1'),
    ('Charlie and the Chocolate Factory', 'Truyện thiếu nhi của Roald Dahl.', 155000.00, 50, 9, 12, 6, '1964-01-01', 'charlie-chocolate.jpg', 'charlie-and-the-chocolate-factory-toi-uu-1'),
    ('The Lion, the Witch and the Wardrobe', 'Truyện Narnia của C.S. Lewis.', 165000.00, 45, 9, 11, 6, '1950-01-01', 'lion-witch-wardrobe.jpg', 'lion-witch-and-wardrobe-toi-uu-1'),
    ('Winnie-the-Pooh', 'Truyện thiếu nhi của A.A. Milne.', 145000.00, 50, 9, 12, 6, '1926-01-01', 'winnie-pooh.jpg', 'winnie-the-pooh-toi-uu-1'),
    ('Through the Looking-Glass', 'Truyện thiếu nhi của Lewis Carroll.', 155000.00, 45, 9, 12, 6, '1871-01-01', 'looking-glass.jpg', 'through-the-looking-glass-toi-uu-1'),
    ('The Adventures of Tom Sawyer', 'Truyện thiếu nhi của Mark Twain.', 145000.00, 50, 9, 12, 6, '1876-01-01', 'tom-sawyer.jpg', 'adventures-of-tom-sawyer-toi-uu-1'),
    ('Peter Pan', 'Truyện thiếu nhi của J.M. Barrie.', 145000.00, 50, 9, 12, 6, '1911-01-01', 'peter-pan.jpg', 'peter-pan-toi-uu-1'),
    ('Cô bé Lọ Lem', 'Truyện cổ tích của Charles Perrault.', 125000.00, 55, 9, 12, 2, '1697-01-01', 'co-be-lo-lem.jpg', 'co-be-lo-lem-toi-uu-1'),
    -- Thêm 62 sách tương tự (ví dụ: 'Truyện thiếu nhi [Tác giả] tối ưu [số thứ tự]')

    -- Category 10: Sách dạy nấu ăn (71 sách)
    ('Together', 'Sách nấu ăn gia đình của Jamie Oliver.', 225000.00, 25, 10, 78, 6, '2021-01-01', 'together-jamie.jpg', 'together-jamie-oliver-toi-uu-1'),
    ('NOPI', 'Sách nấu ăn cao cấp của Yotam Ottolenghi.', 235000.00, 20, 10, 81, 6, '2015-01-01', 'nopi.jpg', 'nopi-toi-uu-1'),
    ('Nigella Express', 'Sách nấu ăn nhanh của Nigella Lawson.', 225000.00, 25, 10, 80, 6, '2007-01-01', 'nigella-express.jpg', 'nigella-express-toi-uu-1'),
    ('Gordon Ramsay’s Ultimate Home Cooking', 'Sách nấu ăn gia đình của Gordon Ramsay.', 245000.00, 20, 10, 83, 6, '2013-01-01', 'ramsay-home-cooking.jpg', 'gordon-ramsays-ultimate-home-cooking-toi-uu-1'),
    ('Mary Berry’s Complete Cookbook', 'Sách nấu ăn tổng hợp của Mary Berry.', 235000.00, 20, 10, 84, 6, '2017-01-01', 'mary-complete.jpg', 'mary-berrys-complete-cookbook-toi-uu-1'),
    ('Rick Stein’s Mediterranean Escapes', 'Sách nấu ăn Địa Trung Hải của Rick Stein.', 225000.00, 25, 10, 85, 6, '2007-01-01', 'mediterranean-escapes.jpg', 'rick-steins-mediterranean-escapes-toi-uu-1'),
    ('Vietnam: The Cookbook', 'Sách nấu ăn Việt Nam của Luke Nguyen.', 195000.00, 30, 10, 82, 5, '2013-01-01', 'vietnam-cookbook.jpg', 'vietnam-the-cookbook-toi-uu-1'),
    ('The Silver Spoon', 'Sách nấu ăn Ý kinh điển.', 235000.00, 20, 10, 78, 6, '1950-01-01', 'silver-spoon.jpg', 'the-silver-spoon-toi-uu-1'),
    ('Ottolenghi Simple', 'Sách nấu ăn đơn giản của Yotam Ottolenghi.', 235000.00, 20, 10, 81, 6, '2018-01-01', 'ottolenghi-simple.jpg', 'ottolenghi-simple-toi-uu-1'),
    ('Vegetarian Cooking for Everyone', 'Sách nấu ăn chay của Deborah Madison.', 235000.00, 20, 10, 78, 6, '1997-01-01', 'vegetarian-everyone.jpg', 'vegetarian-cooking-for-everyone-toi-uu-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách nấu ăn [Tác giả] tối ưu [số thứ tự]')

    -- Category 11: Đồ chơi (71 sách)
    ('Hướng dẫn làm mô hình giấy tối ưu', 'Sách hướng dẫn làm mô hình giấy 5D.', 69000.00, 65, 11, 22, 2, '2024-06-01', 'mo-hinh-giay-5d.jpg', 'huong-dan-mo-hinh-giay-toi-uu-1'),
    ('Sách học chơi cờ vua tối ưu', 'Hướng dẫn cờ vua chiến thuật phiên bản mới.', 73000.00, 60, 11, 22, 2, '2024-06-01', 'co-vua-toi-uu.jpg', 'sach-hoc-co-vua-toi-uu-1'),
    ('Bộ thẻ học số đếm tối ưu', 'Sách giáo dục số đếm phiên bản tối ưu.', 59000.00, 75, 11, 22, 2, '2024-06-01', 'the-so-dem-toi-uu.jpg', 'bo-the-hoc-so-dem-toi-uu-1'),
    ('Hướng dẫn làm đồ chơi tái chế tối ưu', 'Sách hướng dẫn làm đồ chơi từ vật liệu tái chế.', 79000.00, 55, 11, 22, 2, '2024-06-01', 'do-choi-tai-che-toi-uu.jpg', 'huong-dan-lam-do-choi-tai-che-toi-uu-1'),
    ('Sách học lắp ráp robot tối ưu', 'Hướng dẫn lắp ráp robot cải tiến.', 99000.00, 50, 11, 22, 2, '2024-06-01', 'robot-toi-uu.jpg', 'sach-hoc-lap-rap-robot-toi-uu-1'),
    ('Bộ flashcard thiên văn tối ưu', 'Sách giáo dục thiên văn qua flashcard.', 69000.00, 70, 11, 22, 2, '2024-06-01', 'flashcard-thien-van.jpg', 'bo-flashcard-thien-van-toi-uu-1'),
    ('Sách hướng dẫn chơi Rubik tối ưu', 'Hướng dẫn giải Rubik phiên bản cải tiến.', 73000.00, 60, 11, 22, 2, '2024-06-01', 'rubik-toi-uu.jpg', 'huong-dan-choi-rubik-toi-uu-1'),
    ('Học vẽ với màu dầu', 'Sách hướng dẫn vẽ tranh màu dầu.', 63000.00, 75, 11, 22, 2, '2024-06-01', 'mau-dau.jpg', 'hoc-ve-voi-mau-dau-toi-uu-1'),
    ('Sách hướng dẫn làm thủ công nhựa', 'Hướng dẫn làm đồ thủ công từ nhựa.', 69000.00, 70, 11, 22, 2, '2024-06-01', 'thu-cong-nhua.jpg', 'huong-dan-lam-thu-cong-nhua-toi-uu-1'),
    ('Bộ thẻ học địa lý', 'Sách giáo dục địa lý qua thẻ.', 59000.00, 75, 11, 22, 2, '2024-06-01', 'the-dia-ly.jpg', 'bo-the-hoc-dia-ly-toi-uu-1'),
    -- Batch 4: 250 sách mới (Danh mục 12-14)
    -- Category 12: Khoa học (71 sách)
    ('The Blind Watchmaker', 'Sách tiến hóa của Richard Dawkins.', 175000.00, 45, 12, 61, 9, '1986-01-01', 'blind-watchmaker.jpg', 'the-blind-watchmaker-toi-uu-1'),
    ('Contact', 'Sách khoa học viễn tưởng của Carl Sagan.', 185000.00, 50, 12, 60, 9, '1985-01-01', 'contact.jpg', 'contact-toi-uu-1'),
    ('The Hidden Reality', 'Sách vật lý của Brian Greene.', 195000.00, 40, 12, 70, 9, '2011-01-01', 'hidden-reality.jpg', 'the-hidden-reality-toi-uu-1'),
    ('Parallel Worlds', 'Sách vũ trụ của Michio Kaku.', 205000.00, 35, 12, 71, 9, '2004-01-01', 'parallel-worlds.jpg', 'parallel-worlds-toi-uu-1'),
    ('The Pleasure of Finding Things Out', 'Sách vật lý của Richard Feynman.', 175000.00, 50, 12, 72, 9, '1999-01-01', 'pleasure-finding.jpg', 'pleasure-of-finding-things-out-toi-uu-1'),
    ('The Emperor’s New Mind', 'Sách khoa học của Roger Penrose.', 185000.00, 45, 12, 59, 9, '1989-01-01', 'emperors-mind.jpg', 'the-emperors-new-mind-toi-uu-1'),
    ('The Ancestor’s Tale (Tái bản)', 'Sách tiến hóa của Richard Dawkins.', 175000.00, 40, 12, 61, 9, '2020-01-01', 'ancestors-tale-re.jpg', 'ancestors-tale-toi-uu-1'),
    ('Guns, Germs, and Steel', 'Sách lịch sử khoa học của Jared Diamond.', 185000.00, 50, 12, 59, 9, '1997-01-01', 'guns-germs-steel.jpg', 'guns-germs-and-steel-toi-uu-1'),
    ('A Brief History of Time (Tái bản)', 'Sách vũ trụ của Stephen Hawking.', 195000.00, 40, 12, 59, 9, '2020-01-01', 'brief-history-re.jpg', 'brief-history-of-time-toi-uu-1'),
    ('The Emperor of All Maladies', 'Sách sinh học của Siddhartha Mukherjee.', 185000.00, 45, 12, 59, 9, '2010-01-01', 'emperor-maladies.jpg', 'the-emperor-of-all-maladies-toi-uu-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách khoa học [Tác giả] tối ưu [số thứ tự]')

    -- Category 13: Du lịch (71 sách)
    ('The Sun Also Rises', 'Tùy bút du lịch của Ernest Hemingway.', 165000.00, 35, 13, 62, 7, '1926-01-01', 'sun-rises.jpg', 'the-sun-also-rises-toi-uu-1'),
    ('Riding the Iron Rooster', 'Hành trình tàu hỏa của Paul Theroux.', 155000.00, 45, 13, 63, 7, '1988-01-01', 'iron-rooster.jpg', 'riding-the-iron-rooster-toi-uu-1'),
    ('Quê nhà', 'Tùy bút du lịch của Nguyễn Tuân.', 115000.00, 50, 13, 66, 1, '1940-01-01', 'que-nha.jpg', 'que-nha-toi-uu-1'),
    ('Hà Nội băm sáu phố phường', 'Tùy bút du lịch của Thạch Lam.', 105000.00, 45, 13, 4, 4, '1943-01-01', 'ha-noi-36-pho.jpg', 'ha-noi-bam-sau-pho-phuong-toi-uu-1'),
    ('A Year in Provence', 'Du lịch Pháp của Peter Mayle.', 165000.00, 35, 13, 62, 7, '1989-01-01', 'year-provence.jpg', 'a-year-in-provence-toi-uu-1'),
    ('The Rings of Saturn', 'Du lịch châu Âu của W.G. Sebald.', 155000.00, 45, 13, 62, 7, '1995-01-01', 'rings-saturn.jpg', 'the-rings-of-saturn-toi-uu-1'),
    ('Arabian Sands', 'Du lịch sa mạc của Wilfred Thesiger.', 165000.00, 35, 13, 62, 7, '1959-01-01', 'arabian-sands.jpg', 'arabian-sands-toi-uu-1'),
    ('Long Way Down', 'Hành trình xe máy của Ewan McGregor.', 155000.00, 45, 13, 62, 7, '2007-01-01', 'long-way-down.jpg', 'long-way-down-toi-uu-1'),
    ('Tracks', 'Hành trình sa mạc của Robyn Davidson.', 165000.00, 35, 13, 62, 7, '1980-01-01', 'tracks.jpg', 'tracks-toi-uu-1'),
    ('Miền Tây ký sự', 'Tùy bút du lịch của Đoàn Giỏi.', 105000.00, 50, 13, 86, 1, '1960-01-01', 'mien-tay-ky-su.jpg', 'mien-tay-ky-su-toi-uu-1'),
    -- Thêm 61 sách tương tự (ví dụ: 'Sách du lịch [Tác giả] tối ưu [số thứ tự]')

    -- Category 14: Công nghệ (71 sách)
    ('Refactoring', 'Sách lập trình của Martin Fowler.', 205000.00, 30, 14, 76, 9, '1999-01-01', 'refactoring.jpg', 'refactoring-toi-uu-1'),
    ('You Don’t Know JS', 'Sách JavaScript của Kyle Simpson.', 195000.00, 35, 14, 76, 9, '2014-01-01', 'you-dont-know-js.jpg', 'you-dont-know-js-toi-uu-1'),
    ('The Art of UNIX Programming', 'Sách lập trình của Eric S. Raymond.', 200000.00, 30, 14, 76, 9, '2003-01-01', 'unix-programming.jpg', 'the-art-of-unix-programming-toi-uu-1'),
    ('Human Compatible', 'Sách trí tuệ nhân tạo của Stuart Russell.', 205000.00, 25, 14, 76, 9, '2019-01-01', 'human-compatible.jpg', 'human-compatible-toi-uu-1'),
    ('Algorithms to Live By', 'Sách thuật toán của Brian Christian.', 195000.00, 30, 14, 76, 9, '2016-01-01', 'algorithms-live.jpg', 'algorithms-to-live-by-toi-uu-1'),
    ('The Mythical Man-Month', 'Sách quản lý dự án của Fred Brooks.', 200000.00, 30, 14, 76, 9, '1975-01-01', 'mythical-man-month.jpg', 'the-mythical-man-month-toi-uu-1'),
    ('Accelerate', 'Sách DevOps của Nicole Forsgren.', 200000.00, 25, 14, 76, 9, '2018-01-01', 'accelerate.jpg', 'accelerate-toi-uu-1'),
    ('Python Crash Course', 'Sách lập trình Python của Eric Matthes.', 195000.00, 30, 14, 76, 9, '2015-01-01', 'python-crash.jpg', 'python-crash-course-toi-uu-1'),
    ('The C Programming Language', 'Sách lập trình của Brian Kernighan.', 200000.00, 25, 14, 76, 9, '1978-01-01', 'c-programming.jpg', 'the-c-programming-language-toi-uu-1'),
    ('The Data Science Handbook', 'Sách khoa học dữ liệu của Field Cady.', 205000.00, 30, 14, 76, 9, '2017-01-01', 'data-science-handbook.jpg', 'the-data-science-handbook-toi-uu-1');

--Update Book Images for New Books
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/u/n/untitled-4_6.jpg' WHERE id = 1;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936219420457.jpg' WHERE id = 2;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_231295.jpg' WHERE id = 3;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_47035.jpg' WHERE id = 4;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935278606338.jpg' WHERE id = 5;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/z/2/z2109978704372_62238fb69e7e25ef5c6cc6fe1016dca6.jpg' WHERE id = 6;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935212368353.jpg' WHERE id = 7;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935083582339_1_1.jpg' WHERE id = 8;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8906073775109.jpg' WHERE id = 9;
UPDATE books SET cover_image = 'https://vanphongphamhl.vn/upload_images/images/2024/01/08/cach-su-dung-thuoc-ke-da-nang.jpg' WHERE id = 10;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/_/b_a-tr_c---jadoo-iq-h_c-m_-ch_i-v_i-h_nh-h_c.jpg' WHERE id = 11;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935083582360_1_1.jpg' WHERE id = 12;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_184617.jpg' WHERE id = 13;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/6/9/6941288711599.jpg' WHERE id = 14;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936036316810.jpg' WHERE id = 15;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935083566506.jpg' WHERE id = 16;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_46871.jpg' WHERE id = 17;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936036316520.jpg' WHERE id = 18;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786045486610.jpg' WHERE id = 19;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040393333.jpg' WHERE id = 20;
UPDATE books SET cover_image = 'https://img.loigiaihay.com/picture/2024/1025/screenshot-103.png' WHERE id = 21;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/_/b_i-t_p-ti_ng-anh-l_p-11-149k.jpg' WHERE id = 22;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936036317527.jpg' WHERE id = 23;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_190802.jpg' WHERE id = 24;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_43134.jpg' WHERE id = 25;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_176035.jpg' WHERE id = 26;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786045494332_1.jpg' WHERE id = 27;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936036317237.jpg' WHERE id = 28;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/m/a/mat-biec_bia-mem_in-lan-thu-44.jpg' WHERE id = 29;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974211006.jpg' WHERE id = 30;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974209287.jpg' WHERE id = 31;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/91rXSU19+jL._SL1500_.jpg' WHERE id = 32;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_219998.jpg' WHERE id = 33;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780008260187.jpg' WHERE id = 34;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_219994.jpg' WHERE id = 35;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974180098_1.jpg' WHERE id = 36;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935236438001.jpg' WHERE id = 37;
UPDATE books SET cover_image = 'https://isach.info/images/story/cover/nhung_thien_duong_mu__duong_thu_huong.jpg' WHERE id = 38;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/1/819b952mvdl._ac_uf1000_1000_ql80_.jpg' WHERE id = 39;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_19709.jpg' WHERE id = 40;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_128635.jpg' WHERE id = 41;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781801314411.jpg' WHERE id = 42;
UPDATE books SET cover_image = 'https://upload.wikimedia.org/wikipedia/vi/8/80/The_Girl_with_the_Dragon_Tattoo_Poster.jpg' WHERE id = 43;
UPDATE books SET cover_image = 'https://baophuyen.vn/upload/Images/2015/thang%2004/26/gone-girl150426.jpg' WHERE id = 44;
UPDATE books SET cover_image = 'https://upload.wikimedia.org/wikipedia/commons/7/70/Talented_Mr._Ripley_first_edition_cover_1955.jpg' WHERE id = 45;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71W98X5zSCL._AC_UF1000,1000_QL80_.jpg' WHERE id = 46;
UPDATE books SET cover_image = 'https://upload.wikimedia.org/wikipedia/vi/d/d6/Lu%E1%BA%ADt_ng%E1%BA%A7m_poster.jpg' WHERE id = 47;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/_/b_a_30_19.jpg' WHERE id = 48;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/_/b_a-tr_c-gcpy4_bebooks.jpg' WHERE id = 49;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_24560.jpg' WHERE id = 50;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_237727.jpg' WHERE id = 51;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_17489.jpg' WHERE id = 52;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780552161275.jpg' WHERE id = 53;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/M/MV5BZmEyYmU5NTMtOGM1Zi00ZThkLWI1MzktMjU3MjhmYzZjNTNiXkEyXkFqcGc@._V1_.jpg' WHERE id = 54;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936067604825.jpg' WHERE id = 55;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935230001195.jpg' WHERE id = 56;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786043947540.jpg' WHERE id = 57;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786043947441.jpg' WHERE id = 58;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786043943078_1.jpg' WHERE id = 59;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780141439518_1.jpg' WHERE id = 60;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71wANojhEKL._SL1500_.jpg' WHERE id = 61;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_194049.jpg' WHERE id = 62;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_114125.jpg' WHERE id = 63;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781484780671.jpg' WHERE id = 64;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781847494009.jpg' WHERE id = 65;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974153276_11.jpg' WHERE id = 66;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1673724335i/14836.jpg' WHERE id = 67;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780241981399.jpg' WHERE id = 68;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935279171712.jpg' WHERE id = 69;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_227591.jpg' WHERE id = 70;
UPDATE books SET cover_image = 'https://bookfun.vn/wp-content/uploads/2024/10/cha-giau-cha-ngheo.jpg' WHERE id = 71;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786044761213.jpg' WHERE id = 72;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935235236400.jpg' WHERE id = 73;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780063032378_thanh_ly.jpg' WHERE id = 74;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781541736054.jpg' WHERE id = 75;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_173814.jpg' WHERE id = 76;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/4/1/41fglxtlu7l._sx316_bo1_204_203_200_.jpg' WHERE id = 77;
UPDATE books SET cover_image = 'https://www.elleman.vn/app/uploads/2016/03/18/the-big-short-elle-man-1.jpg' WHERE id = 78;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781610390934.jpg' WHERE id = 79;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780063032378_thanh_ly.jpg' WHERE id = 80;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_181486.jpg' WHERE id = 81;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_24664.jpg' WHERE id = 82;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/_/b_a-1---_c-nh_n-t_m.jpg' WHERE id = 83;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/7/h/7h_700x650_bia1.jpg' WHERE id = 84;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935074134714.jpg' WHERE id = 85;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780807092156.jpg' WHERE id = 86;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780593542699.jpg' WHERE id = 87;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974199625.jpg' WHERE id = 88;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936228203669.jpg' WHERE id = 89;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/_/2/_2024_-thay_doi_ti_hon_hieu_qua_bat_ngo-tb8-02.jpg' WHERE id = 90;
UPDATE books SET cover_image = 'https://salt.tikicdn.com/cache/280x280/media/catalog/product/5/1/51cnrqfns5l._sx330_bo1,204,203,200_.u547.d20160920.t163836.322193.jpg' WHERE id = 91;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780465028764.jpg' WHERE id = 92;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71I4yv9v+LL._AC_UF1000,1000_QL80_.jpg' WHERE id = 93;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781529053968.jpg' WHERE id = 94;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780063228252.jpg' WHERE id = 95;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781408866757.jpg' WHERE id = 96;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781108430425.jpg' WHERE id = 97;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786041055421_1.jpg' WHERE id = 98;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_20563.jpg' WHERE id = 99;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_244718_1_2147.jpg' WHERE id = 100;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_1424.jpg' WHERE id = 101;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_19104.jpg' WHERE id = 102;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_39008_thanh_ly.jpg' WHERE id = 103;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_1430.jpg' WHERE id = 104;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/a/barron_s_toeic_test_4th_edition_1.u547.d20161117.t092224.574624.jpg' WHERE id = 105;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_216005.jpg' WHERE id = 106;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_216005.jpg' WHERE id = 107;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786043778502.jpg' WHERE id = 108;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_28786.jpg' WHERE id = 109;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780194605700.jpg' WHERE id = 110;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/n/x/nxbtre_full_22142021_051437.jpg' WHERE id = 111;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/d/e/de-men-50k_1.jpg' WHERE id = 112;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974179672.jpg' WHERE id = 113;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_219998.jpg' WHERE id = 114;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781474610209.jpg' WHERE id = 115;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_219994.jpg' WHERE id = 116;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781786901071.jpg' WHERE id = 117;
UPDATE books SET cover_image = 'https://resizing.flixster.com/V5u4a81ozIDsFpvp8jDVFb1Qzjc=/fit-in/352x330/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p11780452_b_h9_aa.jpg' WHERE id = 118;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781786171894.jpg' WHERE id = 119;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780064410939.jpg' WHERE id = 120;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_187160.jpg' WHERE id = 121;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974178002.jpg' WHERE id = 122;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974177944.jpg' WHERE id = 123;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974211013.jpg' WHERE id = 124;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_226953_1.jpg' WHERE id = 125;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780008332938.jpg' WHERE id = 126;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_30638.jpg' WHERE id = 127;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81ZMMMYOsML._AC_UF1000,1000_QL80_.jpg' WHERE id = 128;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_34563.jpg' WHERE id = 129;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781400233878.jpg' WHERE id = 130;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780545656009-1.jpg' WHERE id = 131;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/61R4eeXvm5L._AC_UF1000,1000_QL80_.jpg' WHERE id = 132;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81YSaFcZMXL._AC_UF1000,1000_QL80_.jpg' WHERE id = 133;
UPDATE books SET cover_image = 'https://images-eu.ssl-images-amazon.com/images/I/81TcxZnv95L._AC_UL210_SR210,210_.jpg' WHERE id = 134;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/713CXq2mtLL.jpg' WHERE id = 135;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71NXfMvnmQL.jpg_BO30,255,255,255_UF900,850_SR1910,1000,0,C_QL100_.jpg' WHERE id = 136;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81JVTtQzJ+L._AC_UF1000,1000_QL80_.jpg' WHERE id = 137;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_30493.jpg' WHERE id = 138;
UPDATE books SET cover_image = 'https://file.hstatic.net/200000776677/file/1_42a4da927caa432a8a865dd325d10e2a_grande.jpg' WHERE id = 139;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935212367059.jpg' WHERE id = 140;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936014308615.jpg' WHERE id = 141;
UPDATE books SET cover_image = 'https://tokhaiyte.vn/wp-content/uploads/2024/04/choi-co-vua-cung-be-tro-choi-phat-trien-toan-dien-pdf.jpg' WHERE id = 142;
UPDATE books SET cover_image = 'https://vanphongphamhl.vn/upload_images/images/2024/11/01/lam-do-choi-bang-giay-a4.jpg' WHERE id = 143;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935337517520.jpg' WHERE id = 144;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786044963228.jpg' WHERE id = 145;
UPDATE books SET cover_image = 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/cach_choi_rubik_10_31f68e8f86.jpg' WHERE id = 146;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935246113004.jpg' WHERE id = 147;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_30211.jpg' WHERE id = 148;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786326069815.jpg' WHERE id = 149;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/h/_/h_p-ekoland-tarot_1.jpg' WHERE id = 150;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936237080664.jpg' WHERE id = 151;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936067607161.jpg' WHERE id = 152;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780857501004.jpg' WHERE id = 153;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780345539434.jpg' WHERE id = 154;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_159357.jpg' WHERE id = 155;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780241686683.jpg' WHERE id = 156;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781803709543.jpg' WHERE id = 157;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/M/MV5BMTA3MzA2NzkxMzleQTJeQWpwZ15BbWU4MDAxNDE1NzEy._V1_FMjpg_UX1000_.jpg' WHERE id = 158;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/_/b_a_37.jpg' WHERE id = 159;
UPDATE books SET cover_image = 'https://upload.wikimedia.org/wikipedia/vi/a/ac/SilentSpring.jpg' WHERE id = 160;
UPDATE books SET cover_image = 'https://upload.wikimedia.org/wikipedia/en/8/8c/TheDoubleHelix.jpg' WHERE id = 161;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_105944.jpg' WHERE id = 162;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/A1UaTTwMEeL._AC_UF1000,1000_QL80_.jpg' WHERE id = 163;
UPDATE books SET cover_image = 'https://upload.wikimedia.org/wikipedia/en/d/d8/Structure-of-scientific-revolutions-1st-ed-pb.png' WHERE id = 164;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_43539.jpg' WHERE id = 165;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71qqpJruhvL._AC_UF894,1000_QL80_.jpg' WHERE id = 166;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/a/_/a_walk_through_the_woods_1_2022_03_29_10_29_59.jpg' WHERE id = 167;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/61cWLL6rGwS._AC_UF1000,1000_QL80_.jpg' WHERE id = 168;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71g1iYhvtKL.jpg' WHERE id = 169;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/a/9/a9bea7e7d497539da2a32f6934015494.jpg' WHERE id = 170;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/n/x/nxbtre_full_22592021_045917.jpg' WHERE id = 171;
UPDATE books SET cover_image = 'https://upload.wikimedia.org/wikipedia/en/6/6a/InPatagonia.jpg' WHERE id = 172;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/91hCdyZeCvL._AC_UF1000,1000_QL80_.jpg' WHERE id = 173;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81249R8vIYL._AC_UF1000,1000_QL80_.jpg' WHERE id = 174;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81N4cuoZXGL._AC_UF1000,1000_QL80_.jpg' WHERE id = 175;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935235236103.jpg' WHERE id = 176;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780593704233.jpg' WHERE id = 177;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780143038412_3.jpg' WHERE id = 178;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781847563408.jpg' WHERE id = 179;
UPDATE books SET cover_image = 'https://salt.tikicdn.com/cache/w1200/ts/product/54/5c/90/425ec98b344f3fbbaaf2b14da443bc98.jpg' WHERE id = 180;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780143037880.jpg' WHERE id = 181;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71UvMcdcE9L._AC_UF1000,1000_QL80_.jpg' WHERE id = 182;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_40808.jpg' WHERE id = 183;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71HJ49yivqL._AC_UF1000,1000_QL80_.jpg' WHERE id = 184;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780062464347.jpg' WHERE id = 185;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935251422368.jpg' WHERE id = 186;
UPDATE books SET cover_image = 'https://upload.wikimedia.org/wikipedia/en/0/06/The_Code_Book.jpg' WHERE id = 187;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71ilxZIObIL._AC_UF1000,1000_QL80_.jpg' WHERE id = 188;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780465094271.jpg' WHERE id = 189;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/51eUw-v0X+L._AC_UF1000,1000_QL80_.jpg' WHERE id = 190;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/513ySs59yaL._AC_UF1000,1000_QL80_.jpg' WHERE id = 191;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780262537551.jpg' WHERE id = 192;
UPDATE books SET cover_image = 'https://upload.wikimedia.org/wikipedia/en/2/28/The_soul_of_a_new_machine_--_book_cover.jpg' WHERE id = 193;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/91JTO5QC9vL._AC_UF1000,1000_QL80_.jpg' WHERE id = 194;
UPDATE books SET cover_image = 'https://img.meta.com.vn/data/image/2022/11/05/cach-su-dung-but-cam-ung-2.jpg' WHERE id = 195;
UPDATE books SET cover_image = 'https://2idea.com.vn/images/upload/images/so-tay-lich-lam-viec-thuong-hieu.jpg' WHERE id = 196;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935230007975.jpg' WHERE id = 197;
UPDATE books SET cover_image = 'https://sonca.vn/wp-content/uploads/2023/10/1-2-693x800.png' WHERE id = 198;
UPDATE books SET cover_image = 'https://cth.edu.vn/wp-content/uploads/2019/06/sach-cho-tre-me-ban-do.jpg' WHERE id = 199;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936036316124.jpg' WHERE id = 200;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_27540.jpg' WHERE id = 201;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935343701074.jpg' WHERE id = 202;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935074121035.jpg' WHERE id = 203;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935074135490.jpg' WHERE id = 204;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/9786040350527.jpg' WHERE id = 205;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/global_success___tieng_anh_12___sach_hoc_sinh_2024/2024_11_06_16_34_08_1-390x510.jpg' WHERE id = 206;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040350794.jpg' WHERE id = 207;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/bai_tap_vat_li_11_chan_troi_chuan/2024_07_11_13_46_52_1-390x510.jpg' WHERE id = 208;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040392411.jpg' WHERE id = 209;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040376589.jpg' WHERE id = 210;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_242961_thanh_ly.jpg' WHERE id = 211;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040310873_1.jpg' WHERE id = 212;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/tieng_anh_lop_10___sach_hoc_sinh_global_success_2022/2022_07_20_15_34_16_1-390x510.jpg' WHERE id = 213;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040393371.jpg' WHERE id = 214;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUMzSMn5Cb0PkIcMuDvpnuAMzVYKsVcEvfng&s' WHERE id = 215;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_180164_1_43_1_57_1_4_1_2_1_210_1_29_1_98_1_25_1_21_1_5_1_3_1_18_1_18_1_45_1_26_1_32_1_14_1_1236.jpg' WHERE id = 216;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/2/4/2410e2b33f6a496f02587d9ebcff2a2f_1.jpg' WHERE id = 217;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781444972535.jpg' WHERE id = 218;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_120660.jpg' WHERE id = 219;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_21269.jpg' WHERE id = 220;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786044064949.jpg' WHERE id = 221;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786044045764.jpg' WHERE id = 222;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781444913439.jpg' WHERE id = 223;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935236437226.jpg' WHERE id = 224;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780007527557.jpg' WHERE id = 225;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780194248235_1.jpg' WHERE id = 226;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/5/b/5b6ef8fbccb035ee6ca1.jpg' WHERE id = 227;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_4302.jpg' WHERE id = 228;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_28849.jpg' WHERE id = 229;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrqanl_ZHrL8nAZuEEpBoxppNENaJuCBncHg&s' WHERE id = 230;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935235237469.jpg' WHERE id = 231;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/toi_ac_duoi_anh_mat_troi/2020_06_11_14_55_11_1-390x510.JPG' WHERE id = 232;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936048836009_1.jpg' WHERE id = 233;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195802.jpg' WHERE id = 234;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/lao_hac_tri_viet_hn_2023/2023_10_21_12_28_43_1-390x510.jpg' WHERE id = 235;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ26YJLBRbUpNrw_mkl6LgKAzskvD4IRZr8bw&s' WHERE id = 236;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_180164_1_43_1_57_1_4_1_2_1_210_1_29_1_98_1_25_1_21_1_5_1_3_1_18_1_18_1_45_1_26_1_32_1_14_1_580.jpg' WHERE id = 237;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_241042.jpg' WHERE id = 238;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_98770.jpg' WHERE id = 239;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_241042.jpg' WHERE id = 240;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_104916.jpg' WHERE id = 241;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_22151.jpg' WHERE id = 242;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/1/81uvwypbtrl.jpg' WHERE id = 243;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_114110.jpg' WHERE id = 244;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/s/u/su_thinh_vuong_cua_cac_quoc_gia_artboard_1-03.jpg' WHERE id = 245;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786044761213.jpg' WHERE id = 246;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/61Zhy-hiepL.jpg' WHERE id = 247;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/tu_ban_the_ky_21___le_capital_au_xxie_siecle/2021_07_14_09_54_14_1-390x510.jpg' WHERE id = 248;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/7/1/713jiomo3ul.jpg' WHERE id = 249;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_3572.jpg' WHERE id = 250;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780712676090-4.jpg' WHERE id = 251;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZgJ0JstYOjvT1Sc-OHKszix7Tcfy1JDI84Q&s' WHERE id = 252;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_181721.jpg' WHERE id = 253;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_128683.jpg' WHERE id = 254;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781847946249_1.jpg' WHERE id = 255;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/team___getting_things_done_with_others/2024_10_08_14_28_57_1-390x510.jpg' WHERE id = 256;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/the_5_am_club_own_your_morning_elevate_your_life/2021_03_12_16_59_15_4-390x510.jpg' WHERE id = 257;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780091906351_3.jpg' WHERE id = 258;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/h/the_7_habits_of_highly_effective_people_powerful_lessons_in_personal_change_1_2018_08_22_13_55_59.jpg' WHERE id = 259;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780553840070.jpg' WHERE id = 260;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781473668942.jpg' WHERE id = 261;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/y/o/you_are_a_badass_1_2018_05_23_15_51_49.jpg' WHERE id = 262;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/the_four_agreements___a_practical_guide_to_personal_freedom/2024_08_29_13_56_45_1-390x510.jpg' WHERE id = 263;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_239651.jpg' WHERE id = 264;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781009195119.jpg' WHERE id = 265;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780521752855.jpg' WHERE id = 266;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_28816.jpg' WHERE id = 267;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_19310.jpg' WHERE id = 268;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935309502684.jpg' WHERE id = 269;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_221701.jpg' WHERE id = 270;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_217500_1.jpg' WHERE id = 271;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/e/a/eap_now_english_for_academic_purposes_teachers_book_1_2018_09_04_15_35_24.JPG' WHERE id = 272;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780071798860.jpg' WHERE id = 273;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_22424_thanh_ly.jpg' WHERE id = 274;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974178590.jpg' WHERE id = 275;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_244718_1_6181.jpg' WHERE id = 276;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/h/a/harry_potter_va_phong_chua_bi_mat___ban_mau_1_2020_07_02_08_54_03.jpg' WHERE id = 277;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780141365473.jpg' WHERE id = 278;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/the_complete_chronicles_of_narnia/2022_09_20_09_33_56_1-390x510.jpg' WHERE id = 279;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_173623.jpg' WHERE id = 280;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_92546.jpg' WHERE id = 281;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/s/a/sach-peter-pan.jpg' WHERE id = 282;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_173833.jpg' WHERE id = 283;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/n/a/nang_bach_tuyet_va_bay_chu_lun_1_2018_09_17_15_29_46.JPG' WHERE id = 284;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfNlke8IhGAParldPeYvlH34Cfv-noUYGD8g&s' WHERE id = 285;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780593523506.jpg' WHERE id = 286;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81AJWOda11L._AC_UF1000,1000_QL80_.jpg' WHERE id = 287;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_34563.jpg' WHERE id = 288;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/51tl2VHLnZL._AC_UF1000,1000_QL80_.jpg' WHERE id = 289;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/91w3wDLuLEL._AC_UF1000,1000_QL80_.jpg' WHERE id = 290;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8vHhRXhsoynC5EZ4TTTH4eHmH0zLrWlvWTQ&s' WHERE id = 291;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNs3stizAQuec0iIPv0pzW5MRA0kHLyUt9MA&s' WHERE id = 292;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_216776.jpg' WHERE id = 293;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780194161329.jpg' WHERE id = 294;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935074132291.jpg' WHERE id = 295;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_90054.jpg' WHERE id = 296;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935343701074.jpg' WHERE id = 297;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmFBwr2dGbEUcijR-tZkI5uTt6WSozRrB3qg&s' WHERE id = 298;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/3/9/3900000129077-_1_.jpg' WHERE id = 299;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786326069815.jpg' WHERE id = 300;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/r/tro-choi-tu-duy-chien-luoc-bia-1.jpg' WHERE id = 301;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/2/0/20250113_060805075_ios.jpg' WHERE id = 302;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935074132291.jpg' WHERE id = 303;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/so_dem_va_hinh_dang___the_hoc_thong_minh___gtnb_va_ghi_nho_tu_vung__hinh_anh/2023_09_07_16_56_47_1-390x510.jpg' WHERE id = 304;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMSWOgUhNAz5YBXFxLx5txmoxPyvjTaLtBow&s' WHERE id = 305;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuaXa4YYNlrtIsGSYvFwgfVBJC6DwqAbL3vA&s' WHERE id = 306;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_10489.jpg' WHERE id = 307;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_35338_1.jpg' WHERE id = 308;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780099173311.jpg' WHERE id = 309;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781474986649.jpg' WHERE id = 310;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_13580.jpg' WHERE id = 311;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/a/_/a_short_history_of_nearly_everything_1_2018_05_15_17_01_07.jpg' WHERE id = 312;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/loai_tinh_tinh_thu_ba/2022_06_22_14_38_21_1-390x510.jpg' WHERE id = 313;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR42QvfxNw0fWU_ETEvgj_UUPRspOTKjaz_Nw&s' WHERE id = 314;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/91EUsD9cG5L._AC_UF894,1000_QL80_.jpg' WHERE id = 315;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1343336197i/468315.jpg' WHERE id = 316;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936067597172.jpg' WHERE id = 317;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_80900.jpg' WHERE id = 318;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71M5fFftQgL._AC_UF894,1000_QL80_.jpg' WHERE id = 319;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/the_gift_of_the_magi/2022_11_22_09_27_29_1-390x510.jpg' WHERE id = 320;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/41g5LCAKVfL._AC_UF350,350_QL50_.jpg' WHERE id = 321;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935086835050.jpg' WHERE id = 322;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_24964.jpg' WHERE id = 323;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_214850.jpg' WHERE id = 324;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780358105589.jpg' WHERE id = 325;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781541758001.jpg' WHERE id = 326;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTwmjI5-XadM8rAePvcARgU9Ha-MMMZGrOgg&s' WHERE id = 327;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936107813361.jpg' WHERE id = 328;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/817kywRJjVL._AC_UF1000,1000_QL80_.jpg' WHERE id = 329;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvpVYaJ2clBPnAgpBI_mfOrwMzbBfvB3M5bg&s' WHERE id = 330;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/l/a/lam-chu-cac-mau-thiet-ke-b1-tai-ban.jpg' WHERE id = 331;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780262539029.jpg' WHERE id = 332;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_28133.jpg' WHERE id = 333;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/du_an_phuong_hoang___the_phoenix_project/2021_06_23_16_08_27_1-390x510.jpg' WHERE id = 334;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/u/n/untitled-4_6.jpg' WHERE id = 335;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_144728.jpg' WHERE id = 336;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786326069853.jpg' WHERE id = 337;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/i/bia-200_5_1.jpg' WHERE id = 338;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/s/a/sach_da_tuong_tac___thanh_pho_2_2020_05_27_13_58_34.jpg' WHERE id = 339;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786045478660.jpg' WHERE id = 340;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_27540.jpg' WHERE id = 341;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8931805424192.jpg' WHERE id = 342;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935246946534_1.jpg' WHERE id = 343;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935044535633.jpg' WHERE id = 344;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040287441_1_2.jpg' WHERE id = 345;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040307187_1.jpg' WHERE id = 346;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040350398.jpg' WHERE id = 347;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040287465_1_1_1.jpg' WHERE id = 348;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040342645.jpg' WHERE id = 349;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786043992250.jpg' WHERE id = 350;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040310644_1.jpg' WHERE id = 351;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040350442.jpg' WHERE id = 352;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040310682_1.jpg' WHERE id = 353;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040324771_1.jpg' WHERE id = 354;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/la_nam_trong_la___tai_ban_2022/2023_03_13_11_47_53_1-390x510.jpg' WHERE id = 355;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/n/x/nxbtre_full_13142023_091406.jpg' WHERE id = 356;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_44277.jpg' WHERE id = 357;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781444963687.jpg' WHERE id = 358;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780141365411.jpg' WHERE id = 359;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780241578186.jpg' WHERE id = 360;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780141321097.png' WHERE id = 361;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_7192.jpg' WHERE id = 362;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781444900743.jpg' WHERE id = 363;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp0_eG_yOAnc4EMYnbFsRP5vOFjlBlEOKENA&s' WHERE id = 364;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974134305.jpg' WHERE id = 365;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781847498724.jpg' WHERE id = 366;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/girl_who_kicked_hornetexp_no_eu/2020_04_28_16_09_03_1-390x510.jpg' WHERE id = 367;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/d/a/dark_places_1_2018_11_21_16_59_42.jpg' WHERE id = 368;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/_/b_a-tr_c-t_n-_y-c_m-x_c-tb-2022.jpg' WHERE id = 369;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81OL+iDRNQL._AC_UF1000,1000_QL80_.jpg' WHERE id = 370;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935325014727.jpg' WHERE id = 371;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTviutjHf3MLDOXEpSO3yDOSXOREasLbMqqgg&s' WHERE id = 372;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/i/bia-1_1_25.jpg' WHERE id = 373;
UPDATE books SET cover_image = 'https://www.hachette.co.uk/wp-content/uploads/2024/01/hbg-title-the-thin-man-1.jpg?w=640' WHERE id = 374;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbXRggzqDue0NDvvwexz1TYD5INrZQYPV-tQ&s' WHERE id = 375;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935236426923.jpg' WHERE id = 376;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_91425.jpg' WHERE id = 377;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780440180296.jpg' WHERE id = 378;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/f/a/fahrenheit_451_1_2018_08_22_14_10_18.jpg' WHERE id = 379;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780060837020.jpg' WHERE id = 380;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_138920.jpg' WHERE id = 381;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNGf0tkIEO2yGQLxj_VkHgomHM5dJ0F8G7BQ&s' WHERE id = 382;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_128688.jpg' WHERE id = 383;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781847497765.jpg' WHERE id = 384;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781474950688.jpg' WHERE id = 385;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/61QemkTttrL._AC_UF350,350_QL50_.jpg' WHERE id = 386;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/z/3/z3276937579824_83f6510ba7a4bbad3e5fadf49d792b5c.jpg' WHERE id = 387;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780141043029_1.jpg' WHERE id = 388;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780316057905.jpg' WHERE id = 389;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780141034591_1.jpg' WHERE id = 390;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_44363.jpg' WHERE id = 391;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/the_e_myth_revisited_why_most_small_businesses_dont_work_and_what_to_do_about_it/2023_04_12_08_26_50_1-390x510.png' WHERE id = 392;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_55054.jpg' WHERE id = 393;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/1/81yatd34kil.jpg' WHERE id = 394;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781591846444_1.jpg' WHERE id = 395;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_173872.jpg' WHERE id = 396;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/h/the_happiness_project_1_2018_08_22_13_56_37.jpg' WHERE id = 397;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786043984798.jpg' WHERE id = 398;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_33154.jpg' WHERE id = 399;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781501111112.jpg' WHERE id = 400;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81C18yb1jHL.jpg' WHERE id = 401;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935086828380.jpg' WHERE id = 402;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/a/n/an-lac-tung-buoc-chan-tb-2021.jpg' WHERE id = 403;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781529902402.jpg' WHERE id = 404;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/cambridge_ielts_17_general_training_with_answers_savina/2023_04_18_14_04_07_1-390x510.jpg' WHERE id = 405;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXRXBc64aDdlYS-EfTcJtYw-7kkjNHOd4jeQ&s' WHERE id = 406;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_193865.jpg' WHERE id = 407;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_232062.jpg' WHERE id = 408;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_180164_1_43_1_57_1_4_1_2_1_210_1_29_1_98_1_25_1_21_1_5_1_3_1_18_1_18_1_45_1_26_1_32_1_14_1_555.jpg' WHERE id = 409;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjkUo4yNgzlFf212BVpyyEPhiV4GtH8spaFw&s' WHERE id = 410;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935086809419.jpg' WHERE id = 411;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_28149.jpg' WHERE id = 412;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780230033610.jpg' WHERE id = 413;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_28790.jpg' WHERE id = 414;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/n/n/nna-hvtcx.jpg' WHERE id = 415;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/o/bong_bong_len_troi_1_2018_07_31_11_58_55.JPG' WHERE id = 416;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974180555.jpg' WHERE id = 417;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780241677384.jpg' WHERE id = 418;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/h/the_magicians_nephew_1_2018_02_28_13_45_15.jpg' WHERE id = 419;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936024919320.jpg' WHERE id = 420;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_51871.jpg' WHERE id = 421;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUaZB4jeUVkcg_GB0YQXhPGTmn5eFypPSYkg&s' WHERE id = 422;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScMoelG3KPqmOBa8mbqkJ9Z-zMfUVjjEKW_w&s' WHERE id = 423;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935230004783.jpg' WHERE id = 424;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71gNd1-7o-L._AC_UF1000,1000_QL80_.jpg' WHERE id = 425;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvc_C1gF_ur15dQdtFgZiu019qOveAhssxaQ&s' WHERE id = 426;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81VZMI+pIVS._AC_UF1000,1000_QL80_.jpg' WHERE id = 427;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_34563.jpg' WHERE id = 428;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81XHpReDUoL.jpg' WHERE id = 429;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/91rqr1NzWSL._AC_UF350,350_QL50_.jpg' WHERE id = 430;
UPDATE books SET cover_image = 'https://product.hstatic.net/200000090679/product/a1yoct33-kl._sl1500__7edd2b5219f74b27a7bc190d5cd7ba3c_master.jpg' WHERE id = 431;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/91MLBrH8-QL._AC_UF1000,1000_QL80_.jpg' WHERE id = 432;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8SQi2VLnPs9VSGB6KfK3KUna4TA1h7Li8lw&s' WHERE id = 433;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71Y0yGEaaxL._AC_UF894,1000_QL80_.jpg' WHERE id = 434;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/o/r/origami_nghe_thuat_gap_giay_nang_cao_minh_long_1_2019_03_06_09_24_00.jpg' WHERE id = 435;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/co_vua___chien_thuat_khai_cuoc___nhung_dieu_can_phai_nho/2025_03_31_16_55_45_1-390x510.jpg' WHERE id = 436;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_q4Y6-X-Cymz_GKrptJ1OtmCqpvSr2aj9ww&s' WHERE id = 437;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_90397.jpg' WHERE id = 438;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/1/1/1112050001001.jpg' WHERE id = 439;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786326069822.jpg' WHERE id = 440;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936178583699.jpg' WHERE id = 441;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936238100071.jpg' WHERE id = 442;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_2150.jpg' WHERE id = 443;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/so_dem_va_hinh_dang___the_hoc_thong_minh___gtnb_va_ghi_nho_tu_vung__hinh_anh/2023_09_07_16_56_47_1-390x510.jpg' WHERE id = 444;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLFJSsUTETtcj41j46l8uOQoCvx_wDSPt4fg&s' WHERE id = 445;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_232602.jpg' WHERE id = 446;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0nO1TKjaEJm76i1y7YxnSUxNPDfAO345iDg&s' WHERE id = 447;
UPDATE books SET cover_image = 'https://prodimage.images-bn.com/pimages/9781400033720_p0_v1_s1200x630.jpg' WHERE id = 448;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/31Y81iRzhbL._AC_UF350,350_QL50_.jpg' WHERE id = 449;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/xam_chiem___the_social_conquest_of_earth/2025_03_07_16_55_31_1-390x510.jpg' WHERE id = 450;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_194561_thanh_ly_1.jpg' WHERE id = 451;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_172259.jpg' WHERE id = 452;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/716ATYGngzL._UF1000,1000_QL80_.jpg' WHERE id = 453;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn0ZCtczsp6X4TK92baw3TrF9aTwiissvrfw&s' WHERE id = 454;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_105466.jpg' WHERE id = 455;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/61sXSwaS2CL._AC_UF1000,1000_QL80_.jpg' WHERE id = 456;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/sai_gon/2024_06_05_10_17_35_1-390x510.jpg' WHERE id = 457;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935086847695.jpg' WHERE id = 458;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71nhWifS8CL._AC_UF350,350_QL50_.jpg' WHERE id = 459;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/815x02SBdsL._AC_UF1000,1000_QL80_.jpg' WHERE id = 460;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71Zmkuq0+dL._AC_UF350,350_QL50_.jpg' WHERE id = 461;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/712feMjx+xL.jpg' WHERE id = 462;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780357571217.jpg' WHERE id = 463;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935244804829.jpg' WHERE id = 464;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrKN9qNNYGiRDcy3-C1o_ya5gFL8K9LFZQCg&s' WHERE id = 465;
UPDATE books SET cover_image = 'https://bizweb.dktcdn.net/100/527/077/products/64a326bdfa724e83a58977706bfab9.jpg?v=1728468981723' WHERE id = 466;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/714Luo4tCWL._AC_UF1000,1000_QL80_.jpg' WHERE id = 467;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781472148759.jpg' WHERE id = 468;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71SfUuhon1L._AC_UF1000,1000_QL80_.jpg' WHERE id = 469;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71uiG3qqKaL.jpg' WHERE id = 470;
UPDATE books SET cover_image = 'https://bizweb.dktcdn.net/100/527/077/products/e4277744b37e40a19bf11239bc0ea2.jpg?v=1728468934057' WHERE id = 471;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/a/l/algorithms_to_live_by_the_computer_science_of_human_decisions_1_2019_01_21_16_03_59.jpg' WHERE id = 472;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/h/thach_thuc_sang_tao___the_innovators_dilemma_1_2020_07_01_14_58_48.jpg' WHERE id = 473;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm6usi39iZXK7R9ZiWYPQ4UiSRxG4vjFtnxw&s' WHERE id = 474;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935251422382.jpg' WHERE id = 475;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935074128287_11.jpg' WHERE id = 476;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786326069853.jpg' WHERE id = 477;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935212367400.jpg' WHERE id = 478;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786047834778.jpg' WHERE id = 479;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_49591.jpg' WHERE id = 480;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZVLsxwbPsBgtl56fk6eBqqXtSOUkljiHrRA&s' WHERE id = 481;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8931805424192.jpg' WHERE id = 482;
UPDATE books SET cover_image = 'https://salt.tikicdn.com/cache/w300/ts/product/02/63/44/c74d2fb65996ee80961a23d9d2ba2dc2.jpg' WHERE id = 483;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935044535633.jpg' WHERE id = 484;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/n/a/nang-cao-toan-9-1---2024_1.jpg' WHERE id = 485;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936036318036.jpg' WHERE id = 486;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040392343.jpg' WHERE id = 487;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786045499306.jpg' WHERE id = 488;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935236436328.jpg' WHERE id = 489;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040393012.jpg' WHERE id = 490;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936036315387.jpg' WHERE id = 491;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936214271634_1.jpg' WHERE id = 492;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN28TwWlJYAfDiKSRQcNZVUqBDxHzZnbdBxw&s' WHERE id = 493;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935092535166.gif' WHERE id = 494;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdOKloXUznV69Ie7DWDTtl99vR-8V5Uw6qgQ&s' WHERE id = 495;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/_/b_a-tr_c_8.jpg' WHERE id = 496;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781444974911.jpg' WHERE id = 497;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780142413821.jpg' WHERE id = 498;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780064471091.jpg' WHERE id = 499;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_120699.jpg' WHERE id = 500;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTUWIIL5XcI22oSJis3oPQ920MYBIMvyTNXA&s' WHERE id = 501;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/a/bac-si-jekyll-va--ong-hyde.jpg' WHERE id = 502;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAMzjFRo8BjpsBIk3ypcqMBbAIB_ANyit08Q&s' WHERE id = 503;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaWfAQEitEjZ26s9Nu5KoxKZGbHDQTggMUJw&s' WHERE id = 504;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/a/n/and_then_there_were_none_1_2018_10_27_09_35_21.jpg' WHERE id = 505;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781801314411.jpg' WHERE id = 506;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780307455352-1.jpg' WHERE id = 507;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/g/o/gone-girl---co-gai-mat-tich.jpg' WHERE id = 508;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/h/the_gioi_ngam_cua_ripley_1_2020_09_25_10_59_28.jpg' WHERE id = 509;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71W98X5zSCL._AC_UF1000,1000_QL80_.jpg' WHERE id = 510;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_67375.jpg' WHERE id = 511;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzHdzNkj2QdCXRV0JevNmCzmjpK5gj6BE9wQ&s' WHERE id = 512;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuACOx1LI8jMwkuP1bO14CjlH6hxZNHQdKgw&s' WHERE id = 513;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_189065.jpg' WHERE id = 514;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_179515_thanh_ly.jpg' WHERE id = 515;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935236428521.jpg' WHERE id = 516;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/nha_tho_duc_ba_paris_tb_194000/2022_07_20_15_33_55_1-390x510.jpg' WHERE id = 517;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_174081.jpg' WHERE id = 518;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_181760.jpg' WHERE id = 519;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935212318136.jpg' WHERE id = 520;
UPDATE books SET cover_image = 'https://sachmoi.net/wp-content/uploads/2025/06/toi-ac-va-trung-phat-pdf-epub-azw3-mobi.jpg' WHERE id = 521;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935230008897.jpg' WHERE id = 522;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/s/_/s_-_-b1.jpg' WHERE id = 523;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935236406505.jpg' WHERE id = 524;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRtqLkxyYFYpvDoHf7oTQmIw8uhNAk33rbXA&s' WHERE id = 525;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_173191.jpg' WHERE id = 526;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_173814.jpg' WHERE id = 527;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781408704257.jpg' WHERE id = 528;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/1/81jgaez6whl._sl1500_.jpg' WHERE id = 529;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8XC1JwamQWJygYqOxWK1GKHIaJPJvipl8mA&s' WHERE id = 530;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/h/the_4_hour_workweek_1_2018_08_22_14_04_56.jpg' WHERE id = 531;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrtZw10hQELmEWaRsqJRdDE6Nsmiki4oMVtg&s' WHERE id = 532;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/m/e/measure_what_matters_1_2018_09_25_09_43_59.jpg' WHERE id = 533;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780062273208.jpg' WHERE id = 534;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/_/2/_2024_-thay_doi_ti_hon_hieu_qua_bat_ngo-tb8-02.jpg' WHERE id = 535;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/1/_/1_67_1.jpg' WHERE id = 536;
UPDATE books SET cover_image = 'https://images-na.ssl-images-amazon.com/images/I/61bFMJQvmrL.jpg' WHERE id = 537;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/g/i/gifts_of_imperfection_1_2019_06_26_11_13_13.jpg' WHERE id = 538;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780241257401.jpg' WHERE id = 539;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935230006015.jpg' WHERE id = 540;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_230367.jpg' WHERE id = 541;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/s/f/sffffuntitled.jpg' WHERE id = 542;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/n/g/nghigiaulamgiau_110k-01_bia_1.jpg' WHERE id = 543;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_172047.jpg' WHERE id = 544;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJLhPti3T3-UYFADi01RO1glgKBaG3sIlkow&s' WHERE id = 545;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_40246.jpg' WHERE id = 546;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_193865.jpg' WHERE id = 547;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_76007.jpg' WHERE id = 548;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780462007632.jpg' WHERE id = 549;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786041055421_1.jpg' WHERE id = 550;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa0qAlDqns3Ibsz2_MlNUy7OreodWw_j2V8A&s' WHERE id = 551;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_84717.jpg' WHERE id = 552;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/g/r/grammar_and_vocabulary_for_advanced_book_with_answers_and_audio_self_study_grammar_reference_and_practice_1_2018_08_24_16_38_55.JPG' WHERE id = 553;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_28832.jpg' WHERE id = 554;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/cho_toi_xin_mot_ve_di_tuoi_tho_bia_mem_tai_ban_2018/2021_06_08_15_54_24_1-390x510.jpg' WHERE id = 555;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-xw7uFpyB8A7iWzEleAPx_jvsIL9Mos6DDA&s' WHERE id = 556;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRrNaZiWrlM_TLr8hkTsd-kdlaas7k_OgIxw&s' WHERE id = 557;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_97369.jpg' WHERE id = 558;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/h/the_horse_and_his_boy_1_2018_02_28_13_45_01.jpg' WHERE id = 559;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/51V65lEx0IL._UF1000,1000_QL80_.jpg' WHERE id = 560;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_38277.jpg' WHERE id = 561;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781847496508.jpg' WHERE id = 562;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781405297820.jpg' WHERE id = 563;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjhIvPAUFyLxJrMvixo4OJaP0zb5ysvTCUlA&s' WHERE id = 564;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/t/ttm_n-t_y-gia-v_-vi_t_nh-b_a.jpg' WHERE id = 565;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_36369.jpg' WHERE id = 566;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_128667.jpg' WHERE id = 567;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_34563.jpg' WHERE id = 568;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKkkCiFBYpOMGpKJtnJ_H_pK6bVKkp8d7jPA&s' WHERE id = 569;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/911-1Tqce7L._AC_UF894,1000_QL80_.jpg' WHERE id = 570;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780804847612_1.jpg' WHERE id = 571;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXM8AyjwPKHxsvh40TEiYTx6cZhmbgKtzivg&s' WHERE id = 572;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/61f1m7ySZQL.jpg' WHERE id = 573;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzrjDP-s7cmBCbh14suj8C81k_gedBr4OlwQ&s' WHERE id = 574;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935074132291.jpg' WHERE id = 575;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786044074450.jpg' WHERE id = 576;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_q4Y6-X-Cymz_GKrptJ1OtmCqpvSr2aj9ww&s' WHERE id = 577;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_90397.jpg' WHERE id = 578;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_216596.jpg' WHERE id = 579;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBzaE9YzAFLpt7Uey0f9BLZ3LmEKN59jgZQw&s' WHERE id = 580;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936178583651.jpg' WHERE id = 581;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935074108999.jpg' WHERE id = 582;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_66762.jpg' WHERE id = 583;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935343701074.jpg' WHERE id = 584;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/91U4P4sV18L._AC_UF1000,1000_QL80_.jpg' WHERE id = 585;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780345539434.jpg' WHERE id = 586;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81iXf0tWjnL.jpg' WHERE id = 587;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_180164_1_43_1_57_1_4_1_2_1_210_1_29_1_98_1_25_1_21_1_5_1_3_1_18_1_18_1_45_1_26_1_32_1_14_1_2965.jpg' WHERE id = 588;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfOa4pxJ6l_hZ0ks_Y4MAOzV0_xZYXqsrg_A&s' WHERE id = 589;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81mBpVR7zKL._UF1000,1000_QL80_.jpg' WHERE id = 590;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/h/the_magic_of_reality_how_we_know_whats_really_true_1_2018_11_03_09_41_55.jpg' WHERE id = 591;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/c/o/collapse_sup_do_174-2.jpg' WHERE id = 592;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/819HmpE2TpL._UF1000,1000_QL80_.jpg' WHERE id = 593;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/5/1/51nclr4bphl.jpg' WHERE id = 594;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_106302.jpg' WHERE id = 595;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81138f4kSEL._AC_UF350,350_QL50_.jpg' WHERE id = 596;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_244718_1_5203.jpg' WHERE id = 597;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/r/tranh-truyen-lich-su-viet-nam_phung-hung_tb-2023.jpg' WHERE id = 598;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO-26jZrJ3yC2p8Qv-y70NY4__IpEcvEhLeg&s' WHERE id = 599;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/61Lv5KGVOUL._AC_UF894,1000_QL80_.jpg' WHERE id = 600;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7ZxuPMFE8nQVeC78gV1-DJaITan3SIqtwvw&s' WHERE id = 601;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/718ZQb8dJAL._AC_UF1000,1000_QL80_.jpg' WHERE id = 602;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780593435533.jpg' WHERE id = 603;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/dien_chan_abc/2021_07_27_10_11_17_1-390x510.jpg' WHERE id = 604;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/h/the_innovators_1_2018_08_21_15_01_12.jpg' WHERE id = 605;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780385730624.jpg' WHERE id = 606;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71mhqEw8LcL._AC_UF894,1000_QL80_.jpg' WHERE id = 607;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/d/e/deep_learning-cuoc_cach_mang_hoc_sau_-_bia_1_tb_2025_.jpg' WHERE id = 608;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/the_algorithm/2024_08_29_13_56_32_1-390x510.jpg' WHERE id = 609;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/61biXaIiAGL._AC_UF1000,1000_QL80_.jpg' WHERE id = 610;
UPDATE books SET cover_image = 'https://www.tracykidder.com/uploads/8/1/8/3/81837080/editor/the-soul-of-a-new-machine-book-cover.jpg?1661618478' WHERE id = 611;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/sieu_tri_tue/2021_06_23_08_16_39_1-390x510.jpg' WHERE id = 612;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/hackers_ielts_speaking/2021_06_23_16_05_14_1-390x510.jpg' WHERE id = 613;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781365061462.jpg' WHERE id = 614;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786044744049.jpg' WHERE id = 615;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_144728.jpg' WHERE id = 616;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786326069853.jpg' WHERE id = 617;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935074129512.jpg' WHERE id = 618;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786326034639.jpg' WHERE id = 619;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_229594.jpg' WHERE id = 620;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786326034639.jpg' WHERE id = 621;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8931805424192.jpg' WHERE id = 622;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935246946534_1.jpg' WHERE id = 623;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935044535633.jpg' WHERE id = 624;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936110989633_1.jpg' WHERE id = 625;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/chuyen_de_chuyen_sau_boi_duong_ngu_van_10_bien_soan_theo_chuong_trinh_giao_duc_pho_thong_moi___dung_chung_cho_cac_bo_sgk_hien_hanh/2024_09_06_16_38_12_1-390x510.jpg' WHERE id = 626;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935217118458.jpg' WHERE id = 627;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/lich_su_10_chan_troi_sang_tao_chuan/2024_06_05_09_54_27_1-390x510.jpg' WHERE id = 628;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936110982122.jpg' WHERE id = 629;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_88485.jpg' WHERE id = 630;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040350565.jpg' WHERE id = 631;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWdhau-J78HN443KWAq1ckFe5YaRIjmdKxBg&s' WHERE id = 632;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/chuyen_de_hoc_tap_toan_11_chan_troi_sang_tao_2023/2023_07_28_10_55_33_1-390x510.jpg' WHERE id = 633;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786040351944.jpg' WHERE id = 634;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974178590.jpg' WHERE id = 635;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/2/4/2410e2b33f6a496f02587d9ebcff2a2f_1.jpg' WHERE id = 636;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81qKJ2tYCWL._AC_UF894,1000_QL80_.jpg' WHERE id = 637;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAHIM-TQlrBCR1J59t8_-YZ77oyDntHXEEcA&s' WHERE id = 638;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT14wfjpPdUEnLiJH0I0GLNLIwh78NbKVnQog&s' WHERE id = 639;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_21269.jpg' WHERE id = 640;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781454948407_1.jpg' WHERE id = 641;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/h/the_secret_garden_vintage_classics_1_2018_11_20_22_03_05.jpg' WHERE id = 642;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTux2peYAAqkCZIu1NoEzxVWODnh-4EyEP7_w&s' WHERE id = 643;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780141321592.jpg' WHERE id = 644;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_30334_thanh_ly_1.jpg' WHERE id = 645;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780194248235_1.jpg' WHERE id = 646;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXVuERR0BGJHYIU12M0QP59QzX4A6_cHWfNw&s' WHERE id = 647;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_4302.jpg' WHERE id = 648;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_28849.jpg' WHERE id = 649;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/A1MNY+EkEfL._AC_UF1000,1000_QL80_.jpg' WHERE id = 650;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/a/n/anmanhdemgiangsinh.png' WHERE id = 651;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc-puCUjdG2mwc22stlFiT7kBMj9fqQ_SvkQ&s' WHERE id = 652;
UPDATE books SET cover_image = 'https://cdn.galaxycine.vn/media/2024/5/16/an-mang-lau-4-500_1715833965041.jpg' WHERE id = 653;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195802.jpg' WHERE id = 654;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935235240292.jpg' WHERE id = 655;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935235240445.jpg' WHERE id = 656;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/n/p/np8wgvdx.jpg' WHERE id = 657;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_22151.jpg' WHERE id = 658;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_24647.jpg' WHERE id = 659;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786043946345.jpg' WHERE id = 660;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9GQ36qq636IcOO_FPetnYR10SsGjsPdk6_Q&s' WHERE id = 661;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935236430111.jpg' WHERE id = 662;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/lao_hac_tri_viet_hn_2023/2023_10_21_12_28_43_1-390x510.jpg' WHERE id = 663;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/tat_den_tai_ban_2022/2022_06_27_11_52_02_1-390x510.jpg' WHERE id = 664;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/tu_ban_the_ky_21___le_capital_au_xxie_siecle/2021_07_14_09_54_14_1-390x510.jpg' WHERE id = 665;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq7DPNz4GiVh9-gQKhFd8w_eD90svaGuKL2g&s' WHERE id = 666;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/good_economics_for_hard_times/2022_09_16_11_54_05_1-390x510.png' WHERE id = 667;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsnsQr8u_myFzVIA3TTj9sm-I2byAaKNmw8w&s' WHERE id = 668;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_181321.jpg' WHERE id = 669;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_8035.jpg' WHERE id = 670;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_219967.jpg' WHERE id = 671;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781610390934.jpg' WHERE id = 672;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935086851609-2023_1.jpg' WHERE id = 673;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_128683.jpg' WHERE id = 674;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781847946249_1.jpg' WHERE id = 675;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781009470377_1.jpg' WHERE id = 676;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780091906351_3.jpg' WHERE id = 677;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/7/h/7h_700x650_bia1.png' WHERE id = 678;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780553840070.jpg' WHERE id = 679;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781473668942.jpg' WHERE id = 680;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/team___getting_things_done_with_others/2024_10_08_14_28_57_1-390x510.jpg' WHERE id = 681;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/a/tam_ly_hoc_thanh_cong_1_2018_10_29_16_05_44.jpg' WHERE id = 682;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_37845.jpg' WHERE id = 683;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlanWOpalXYtwaLdEL8Nlr7-0jZi2PchPMDw&s' WHERE id = 684;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/cambridge_ielts_19___academic___authentic_practice_tests/2025_08_25_16_50_54_1-390x510.jpg' WHERE id = 685;
UPDATE books SET cover_image = 'https://salt.tikicdn.com/cache/280x280/ts/product/89/66/53/ab6feda94ab6de487d8c8a72d4ff2acf.jpg' WHERE id = 686;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935246943502.jpg' WHERE id = 687;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHnPO_q4Sq-V8a9wcdCNYztmbvh6ptrqgchA&s' WHERE id = 688;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_32566.jpg' WHERE id = 689;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780194333993.jpg' WHERE id = 690;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_19310.jpg' WHERE id = 691;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_28149.jpg' WHERE id = 692;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/g/r/grammar_and_vocabulary_for_advanced_book_with_answers_and_audio_self_study_grammar_reference_and_practice_1_2018_08_24_16_38_55.JPG' WHERE id = 693;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_222670.jpg' WHERE id = 694;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_180164_1_43_1_57_1_4_1_2_1_210_1_29_1_98_1_25_1_21_1_5_1_3_1_18_1_18_1_45_1_26_1_32_1_14_1_1236.jpg' WHERE id = 695;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUMzSMn5Cb0PkIcMuDvpnuAMzVYKsVcEvfng&s' WHERE id = 696;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974179658_1.jpg' WHERE id = 697;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780141365473.jpg' WHERE id = 698;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/the_voyage_of_the_dawn_treader/2020_04_22_14_15_35_1-390x510.jpg' WHERE id = 699;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/918UFIDlMbL._AC_UF350,350_QL50_.jpg' WHERE id = 700;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_92546.jpg' WHERE id = 701;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786044074061.jpg' WHERE id = 702;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/p/h/phuthuyxuoz.jpg' WHERE id = 703;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/n/a/nang_bach_tuyet_va_bay_chu_lun_1_2018_09_17_15_29_46.JPG' WHERE id = 704;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfNlke8IhGAParldPeYvlH34Cfv-noUYGD8g&s' WHERE id = 705;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780194161039.jpg' WHERE id = 706;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQucGriLxUY_hmcFRnVhzbMUxhIzFN7rKQEdQ&s' WHERE id = 707;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_34563.jpg' WHERE id = 708;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9Hs-CuKOVy8vLHTjuqDriXt90x2aeHmr0yw&s' WHERE id = 709;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/91w3wDLuLEL._AC_UF1000,1000_QL80_.jpg' WHERE id = 710;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780804847612_1.jpg' WHERE id = 711;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_216776.jpg' WHERE id = 712;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/u/tu_beirut_den_jerusalem_tai_ban_2018_1_2020_06_12_14_29_38.jpg' WHERE id = 713;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/717PaHJFf3L._AC_UF1000,1000_QL80_.jpg' WHERE id = 714;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935074132291.jpg' WHERE id = 715;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/co_vua___chien_thuat_khai_cuoc___nhung_dieu_can_phai_nho/2025_03_31_16_55_45_1-390x510.jpg' WHERE id = 716;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_q4Y6-X-Cymz_GKrptJ1OtmCqpvSr2aj9ww&s' WHERE id = 717;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5bX7wj9S31jgzX9LHzw3NstQ4CyzdJ0ljcg&s' WHERE id = 718;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/1/1/1112050001001.jpg' WHERE id = 719;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_239656.jpg' WHERE id = 720;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936178583699.jpg' WHERE id = 721;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_241959.jpg' WHERE id = 722;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/9/9900000058999.jpg' WHERE id = 723;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/z/4/z4182881558508_7ec5c0dc4df9eab429c688b955be85cb.jpg' WHERE id = 724;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_13580.jpg' WHERE id = 725;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935235240919.jpg' WHERE id = 726;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_10489.jpg' WHERE id = 727;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/712720LK0rL._AC_UF350,350_QL50_.jpg' WHERE id = 728;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_100043.jpg' WHERE id = 729;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_215347.jpg' WHERE id = 730;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71PoiguKgRL._UF350,350_QL50_.jpg' WHERE id = 731;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_244718_1_2496.jpg' WHERE id = 732;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81iXf0tWjnL._AC_UF1000,1000_QL80_.jpg' WHERE id = 733;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/i/bia-in_lan-1_gene-lich-su-va-tuong-lai-nhan-loai.jpg' WHERE id = 734;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/61ZBDufKIxL._AC_UF350,350_QL50_.jpg' WHERE id = 735;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71M5fFftQgL._AC_UF894,1000_QL80_.jpg' WHERE id = 736;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/d/a/dat_rung_phuong_nam_tai_ban_2020_1_2020_10_02_09_18_47.jpg' WHERE id = 737;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_180164_1_43_1_57_1_4_1_2_1_210_1_29_1_98_1_25_1_21_1_5_1_3_1_18_1_18_1_45_1_26_1_32_1_14_1_580.jpg' WHERE id = 738;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/818vGRtbDmL.jpg' WHERE id = 739;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81QnEuYx7rL.jpg' WHERE id = 740;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/41g5LCAKVfL._AC_UF350,350_QL50_.jpg' WHERE id = 741;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/514SE443WEL._AC_UF1000,1000_QL80_.jpg' WHERE id = 742;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780747589358.jpg' WHERE id = 743;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/_/i/_i-qua-2-m_t-tr_ng-b_a-1.jpg' WHERE id = 744;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936107813361.jpg' WHERE id = 745;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/l/a/lam-chu-cac-mau-thiet-ke-b1-tai-ban.jpg' WHERE id = 746;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvpVYaJ2clBPnAgpBI_mfOrwMzbBfvB3M5bg&s' WHERE id = 747;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935251422368.jpg' WHERE id = 748;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780262539029.jpg' WHERE id = 749;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_28133.jpg' WHERE id = 750;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/du_an_phuong_hoang___the_phoenix_project/2021_06_23_16_08_27_1-390x510.jpg' WHERE id = 751;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_119407.jpg' WHERE id = 752;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTwmjI5-XadM8rAePvcARgU9Ha-MMMZGrOgg&s' WHERE id = 753;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780358105589.jpg' WHERE id = 754;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/o/toi_uu_hoa_tri_thong_minh_1_2018_08_03_15_23_31.jpg' WHERE id = 755;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_144728.jpg' WHERE id = 756;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786326069853.jpg' WHERE id = 757;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/nghe_thuat_hoc_tap_toi_gian___lam_chu_phuong_phap_hoc_sau_nho_lau/2025_11_10_13_59_06_1-390x510.jpg' WHERE id = 758;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_42335.jpg' WHERE id = 759;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/1/_/1_22_35.jpg' WHERE id = 760;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/c/o/combo-4549526606038-9786049187551-1.jpg' WHERE id = 761;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8931805424192.jpg' WHERE id = 762;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935246946534_1.jpg' WHERE id = 763;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936008800514-_1_.jpg' WHERE id = 764;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936036317633.jpg' WHERE id = 765;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786044302300.jpg' WHERE id = 766;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/bo_de_thi_to_hop_thpt_khoa_hoc_tu_nhien_vat_li___hoa_hoc___sinh_hoc/2021_01_18_14_37_21_1-390x510.jpg' WHERE id = 767;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786046134657.jpg' WHERE id = 768;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/global_success___tieng_anh_12___sach_hoc_sinh_2024/2024_11_06_16_34_08_1-390x510.jpg' WHERE id = 769;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_242961_thanh_ly.jpg' WHERE id = 770;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAoC0qSBUDdBkQ4w5sKQprGiBB8gtU0iv-1g&s' WHERE id = 771;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936214273768.jpg' WHERE id = 772;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936036315882.jpg' WHERE id = 773;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934994162036.jpg' WHERE id = 774;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/o/bong_bong_len_troi_1_2018_07_31_11_58_55.JPG' WHERE id = 775;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_44277.jpg' WHERE id = 776;
UPDATE books SET cover_image = 'https://www.epubbooks.com/images/covers/fi/five-get-into-trouble-d66848.jpg' WHERE id = 777;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_120660.jpg' WHERE id = 778;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/h/the_magicians_nephew_1_2018_02_28_13_45_15.jpg' WHERE id = 779;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780241677384.jpg' WHERE id = 780;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_7192.jpg' WHERE id = 781;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_tmZqUjwBDd4bKrALnARJrvvv71OJE7XkzA&s' WHERE id = 782;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0GaF-sVFy2XbQTiaT68P1WGG3Sl4wnIj6VA&s' WHERE id = 783;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780064400558_2.jpg' WHERE id = 784;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780007527557.jpg' WHERE id = 785;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781847498724.jpg' WHERE id = 786;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/girl_who_kicked_hornetexp_no_eu/2020_04_28_16_09_03_1-390x510.jpg' WHERE id = 787;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/d/a/dark_places_1_2018_11_21_16_59_42.jpg' WHERE id = 788;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStR6N4UVVooS8u6Hyj1qgbGKsOmHAJzc0umQ&s' WHERE id = 789;
UPDATE books SET cover_image = 'https://cdn2.penguin.com.au/covers/original/9780241639245.jpg' WHERE id = 790;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/k/h/khuc-mai-tang-dem-mua---bia-1.jpg' WHERE id = 791;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_24750.jpg' WHERE id = 792;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/_/b_a-1_3_9.jpg' WHERE id = 793;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_99158.jpg' WHERE id = 794;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/2/4/2410e2b33f6a496f02587d9ebcff2a2f_1.jpg' WHERE id = 795;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_98770.jpg' WHERE id = 796;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780143039990.jpg' WHERE id = 797;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780060837020.jpg' WHERE id = 798;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_158464.jpg' WHERE id = 799;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780684801223_1.jpg' WHERE id = 800;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/j/a/jane_eyre_1_2018_07_20_16_01_46.JPG' WHERE id = 801;
UPDATE books SET cover_image = 'https://vn-test-11.slatic.net/p/d0d106e12eddd4b95bff75a4f786019a.jpg' WHERE id = 802;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936067611304.jpg' WHERE id = 803;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/s/_/s_-b1.jpg' WHERE id = 804;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/the_black_swan_the_impact_of_the_highly_improbable/2023_04_19_15_53_10_1-390x510.jpg' WHERE id = 805;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786044761213.jpg' WHERE id = 806;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935235236400.jpg' WHERE id = 807;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_55054.jpg' WHERE id = 808;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/h/thach_thuc_sang_tao___the_innovators_dilemma_1_2020_07_01_14_58_48.jpg' WHERE id = 809;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/z/3/z3276937579824_83f6510ba7a4bbad3e5fadf49d792b5c.jpg' WHERE id = 810;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/1/81yatd34kil.jpg' WHERE id = 811;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8931805100270.jpg' WHERE id = 812;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpXE42Zu_NS4ptT8PJdESYqkmfrpiMqhDVmA&s' WHERE id = 813;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781501124020_1.jpg' WHERE id = 814;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_33154.jpg' WHERE id = 815;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781878424310.jpg' WHERE id = 816;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780722532935bia.jpg' WHERE id = 817;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/the_power_of_now_a_guide_to_spiritual_enlightenment/2023_08_29_08_31_56_1-390x510.jpg' WHERE id = 818;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/_/2/_2024_-thay_doi_ti_hon_hieu_qua_bat_ngo-tb8-02.jpg' WHERE id = 819;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935086855263.jpg' WHERE id = 820;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg' WHERE id = 821;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974190608_1.jpg' WHERE id = 822;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935086856475.jpg' WHERE id = 823;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_216190.jpg' WHERE id = 824;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/b/i/bia_1_ielts_20_aca.jpg' WHERE id = 825;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_40246.jpg' WHERE id = 826;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwTlWO7l0gGPdobwfwpbd1ilGngqVWCEWtcg&s' WHERE id = 827;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935086823071.jpg' WHERE id = 828;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781380084538.jpg' WHERE id = 829;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_27795.jpg' WHERE id = 830;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935086809419.jpg' WHERE id = 831;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_84717.jpg' WHERE id = 832;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780521226462_2.jpg' WHERE id = 833;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_28786.jpg' WHERE id = 834;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974151647-1_1.jpg' WHERE id = 835;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974178583.jpg' WHERE id = 836;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/h/a/harry_potter_va_phong_chua_bi_mat___ban_mau_1_2020_07_02_08_54_03.jpg' WHERE id = 837;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9780142410318_1.jpg' WHERE id = 838;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/t/h/the_lion__the_witch__and_the_wardrobe_collectors_edition_1_2018_02_28_13_45_29.jpg' WHERE id = 839;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbk8e8XtbP2GDAwQ_N2-8SrkFa-dEvauJITQ&s' WHERE id = 840;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_51871.jpg' WHERE id = 841;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786044064949.jpg' WHERE id = 842;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/s/a/sach-peter-pan.jpg' WHERE id = 843;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935230004783.jpg' WHERE id = 844;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71gNd1-7o-L._AC_UF1000,1000_QL80_.jpg' WHERE id = 845;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqZpCzQv26ezFbe-X2iZMpPDTFRmhfDDh9Og&s' WHERE id = 846;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81ZMMMYOsML._AC_UF350,350_QL50_.jpg' WHERE id = 847;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_34563.jpg' WHERE id = 848;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/51tl2VHLnZL._AC_UF1000,1000_QL80_.jpg' WHERE id = 849;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/818Sca6C88L._UF1000,1000_QL80_.jpg' WHERE id = 850;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/91Sfc-zC2WL._AC_UF1000,1000_QL80_.jpg' WHERE id = 851;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8SQi2VLnPs9VSGB6KfK3KUna4TA1h7Li8lw&s' WHERE id = 852;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPvmpSL7EvA2slJ1HDRIuAwskG5DE3UirZVQ&s' WHERE id = 853;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/91WivsisNqL._AC_UF1000,1000_QL80_.jpg' WHERE id = 854;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781474986380.jpg' WHERE id = 855;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_28293.jpg' WHERE id = 856;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_q4Y6-X-Cymz_GKrptJ1OtmCqpvSr2aj9ww&s' WHERE id = 857;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_90397.jpg' WHERE id = 858;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/1/1/1112050001001.jpg' WHERE id = 859;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/z/3/z3202230912705_b5c96546baae9b7175a2d36e85d59474.jpg' WHERE id = 860;
UPDATE books SET cover_image = 'https://gw.alicdn.com/imgextra/i1/2561258889/O1CN01ULoKCh2FXDgd01g3Y_!!2561258889.jpg_540x540.jpg' WHERE id = 861;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935074124852.jpg' WHERE id = 862;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935311507059.jpg' WHERE id = 863;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN1gWmoDnsrHn2ZevsKzCDsWO8Drn742mCTQ&s' WHERE id = 864;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_194561_thanh_ly_1.jpg' WHERE id = 865;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_232602.jpg' WHERE id = 866;
UPDATE books SET cover_image = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/TheHiddenReality.jpg/250px-TheHiddenReality.jpg' WHERE id = 867;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3xDOmpuPgch7WZF3k5XPvS9Lt5_jjXogrKw&s' WHERE id = 868;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Pz4LnyRrE83eUWKpuwfTMYvDxwxblQJEzg&s' WHERE id = 869;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/716ATYGngzL._UF1000,1000_QL80_.jpg' WHERE id = 870;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/717Df4miL5L._AC_UF1000,1000_QL80_.jpg' WHERE id = 871;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_172259.jpg' WHERE id = 872;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_179588.jpg' WHERE id = 873;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781439170915.jpg' WHERE id = 874;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/9/7/9781847493866.jpg' WHERE id = 875;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71SYTn0x6tL._AC_UF350,350_QL50_.jpg' WHERE id = 876;
UPDATE books SET cover_image = 'https://www.netabooks.vn/Data/Sites/1/Product/24382/que-nha.jpg' WHERE id = 877;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/8/9/8936067597172.jpg' WHERE id = 878;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81N4cuoZXGL.jpg' WHERE id = 879;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71Zmkuq0+dL._AC_UF350,350_QL50_.jpg' WHERE id = 880;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71Zmkuq0+dL._AC_UF350,350_QL50_.jpg' WHERE id = 881;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/81hX82DaqoL._AC_UF1000,1000_QL80_.jpg' WHERE id = 882;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_104211.jpg' WHERE id = 883;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRieqnbz2aiGASeWnymINh3jdP_lYhA-M6Zvg&s' WHERE id = 884;
UPDATE books SET cover_image = 'https://bizweb.dktcdn.net/100/527/077/products/64a326bdfa724e83a58977706bfab9.jpg?v=1728468981723' WHERE id = 885;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/817kywRJjVL._AC_UF1000,1000_QL80_.jpg' WHERE id = 886;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVWXGfy1IpK_ktnyV9sjboB91ME0bMezCZkQ&s' WHERE id = 887;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/flashmagazine/images/page_images/human_compatible_artificial_intelligence_and_the_problem_of_control/2024_05_17_16_33_15_1-390x510.jpg' WHERE id = 888;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/a/l/algorithms_to_live_by_the_computer_science_of_human_decisions_1_2019_01_21_16_03_59.jpg' WHERE id = 889;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/817iWsLJR0L._AC_UF1000,1000_QL80_.jpg' WHERE id = 890;
UPDATE books SET cover_image = 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_17248.jpg' WHERE id = 891;
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy8--bUdzcEBMVeeWYHtYSJnvdJxVR4UHJbw&s' WHERE id = 892;
UPDATE books SET cover_image = 'https://bizweb.dktcdn.net/100/527/077/products/e4277744b37e40a19bf11239bc0ea2.jpg?v=1728468934057' WHERE id = 893;
UPDATE books SET cover_image = 'https://m.media-amazon.com/images/I/71SfUuhon1L._AC_UF1000,1000_QL80_.jpg' WHERE id = 894;