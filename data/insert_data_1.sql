use smart_book;
INSERT INTO users (name, email, password_hash, phone, address, role)
VALUES
('Admin', 'admin@example.com',
'$2b$10$kCakq3I2hDkMKdJ6qvDHPu0nC0VqUwSYGfHG6uD0mlvSX7Q6tF/3K', -- password: admin123
'0909000111', 'Hà Nội', 'admin'),

('Nguyen Van A', 'user@example.com',
'$2b$10$2UeWIgVt3SbFqZRx4YFGLeLE2Gjz/fEsnz5W2xHCLVqTkW.0N9A7C', -- password: user123
'0912000222', 'TP.HCM', 'customer');