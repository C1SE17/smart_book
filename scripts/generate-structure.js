#!/usr/bin/env node

/**
 * Script tự động tạo cấu trúc cây thư mục theo Clean Architecture
 * Sử dụng: node scripts/generate-structure.js
 */

const fs = require('fs');
const path = require('path');

// Màu sắc cho terminal
const colors = {
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

// Icons
const icons = {
  folder: '\uf07b',      
  file: '\uf15b',        
  check: '\uf00c',       
  todo: '\uf017',        
  important: '\uf023',   
};

// Cấu trúc thư mục với metadata
const structure = {
  'src/': {
    type: 'folder',
    layer: 'root',
    description: 'SOURCE CODE CHÍNH',
    children: {
      'domain/': {
        type: 'folder',
        layer: 'domain',
        color: 'yellow',
        description: 'LỚP 1: ENTERPRISE BUSINESS RULES (Entities)',
        children: {
          'entities/': {
            type: 'folder',
            status: 'completed',
            files: [
              'Book.js',
              'User.js',
              'Order.js',
              'Cart.js',
              'Category.js',
              'Review.js',
              'Author.js',
              'Publisher.js',
              'Warehouse.js',
            ],
          },
          'repositories/': {
            type: 'folder',
            status: 'completed',
            files: [
              'IBookRepository.js',
              'IUserRepository.js',
              'IOrderRepository.js',
              'ICartRepository.js',
              'ICategoryRepository.js',
              'IReviewRepository.js',
              'IAuthorRepository.js',
              'IPublisherRepository.js',
              'IWarehouseRepository.js',
            ],
          },
          'services/': {
            type: 'folder',
            status: 'todo',
            description: 'Dịch vụ Domain',
          },
          'exceptions/': {
            type: 'folder',
            status: 'todo',
            description: 'Ngoại lệ Domain',
          },
        },
      },
      'application/': {
        type: 'folder',
        layer: 'application',
        color: 'red',
        description: 'LỚP 2: APPLICATION BUSINESS RULES (Use Cases)',
        children: {
          'use-cases/': {
            type: 'folder',
            children: {
              'book/': {
                type: 'folder',
                status: 'completed',
                files: ['GetAllBooksUseCase.js', 'GetBookByIdUseCase.js'],
              },
              'user/': {
                type: 'folder',
                status: 'completed',
                files: ['RegisterUserUseCase.js', 'LoginUserUseCase.js'],
              },
              'order/': {
                type: 'folder',
                status: 'completed',
                files: ['CreateOrderUseCase.js'],
              },
              'cart/': {
                type: 'folder',
                status: 'completed',
                files: ['AddToCartUseCase.js'],
              },
              'translation/': {
                type: 'folder',
                status: 'completed',
                files: ['TranslateTextUseCase.js'],
              },
              'recommendation/': {
                type: 'folder',
                status: 'todo',
                important: true,
                description: 'Quan trọng - Recommender',
              },
            },
          },
          'dto/': {
            type: 'folder',
            status: 'todo',
          },
          'interfaces/': {
            type: 'folder',
            status: 'todo',
          },
          'services/': {
            type: 'folder',
            status: 'todo',
          },
        },
      },
      'presentation/': {
        type: 'folder',
        layer: 'presentation',
        color: 'green',
        description: 'LỚP 3: INTERFACE ADAPTERS',
        children: {
          'api/': {
            type: 'folder',
            children: {
              'controllers/': {
                type: 'folder',
                files: [
                  { name: 'BookController.js', status: 'completed' },
                  { name: 'TranslationController.js', status: 'completed' },
                  { name: 'RecommendationController.js', status: 'todo', important: true },
                ],
              },
              'routes/': {
                type: 'folder',
                files: [
                  { name: 'index.js', status: 'completed' },
                  { name: 'bookRoutes.js', status: 'completed' },
                  { name: 'translationRoutes.js', status: 'completed' },
                  { name: 'recommendationRoutes.js', status: 'todo', important: true },
                ],
              },
              'middleware/': {
                type: 'folder',
                files: [
                  { name: 'auth.js', status: 'completed' },
                  { name: 'errorHandler.js', status: 'completed' },
                ],
              },
              'app.js': {
                type: 'file',
                status: 'completed',
              },
            },
          },
          'web/': {
            type: 'folder',
            status: 'todo',
            description: 'Frontend (React) - Migrate từ frontend/',
          },
        },
      },
      'infrastructure/': {
        type: 'folder',
        layer: 'infrastructure',
        color: 'blue',
        description: 'LỚP 4: FRAMEWORKS & DRIVERS',
        children: {
          'database/': {
            type: 'folder',
            children: {
              'mysql/repositories/': {
                type: 'folder',
                files: [
                  { name: 'BookRepository.js', status: 'completed' },
                  { name: 'UserRepository.js', status: 'todo' },
                  { name: 'RecommendationRepository.js', status: 'todo', important: true },
                ],
              },
              'mongodb/repositories/': {
                type: 'folder',
                files: [
                  { name: 'RecommendationRepository.js', status: 'todo', important: true },
                ],
              },
            },
          },
          'ai/': {
            type: 'folder',
            children: {
              'services/': {
                type: 'folder',
                files: [
                  { name: 'TranslationService.js', status: 'completed' },
                  { name: 'RecommendationService.js', status: 'todo', important: true },
                ],
              },
              'adapters/': {
                type: 'folder',
                status: 'todo',
                description: 'Bộ chuyển đổi Dịch vụ Python',
              },
            },
          },
          'config/': {
            type: 'folder',
            files: [
              { name: 'database.js', status: 'completed' },
              { name: 'index.js', status: 'completed' },
            ],
          },
        },
      },
      'shared/': {
        type: 'folder',
        layer: 'shared',
        color: 'white',
        description: 'SHARED UTILITIES (Cross-cutting)',
        children: {
          'constants/': {
            type: 'folder',
            files: [{ name: 'index.js', status: 'completed' }],
          },
          'utils/': {
            type: 'folder',
            files: [
              { name: 'passwordHasher.js', status: 'completed' },
              { name: 'tokenGenerator.js', status: 'completed' },
            ],
          },
          'errors/': {
            type: 'folder',
            files: [
              { name: 'DomainError.js', status: 'completed' },
              { name: 'NotFoundError.js', status: 'completed' },
              { name: 'ValidationError.js', status: 'completed' },
              { name: 'UnauthorizedError.js', status: 'completed' },
              { name: 'ForbiddenError.js', status: 'completed' },
            ],
          },
        },
      },
    },
  },
  'backend/': {
    type: 'folder',
    layer: 'legacy',
    description: 'LEGACY BACKEND (Đang migration)',
    important: true,
    note: 'Giữ lại cho backward compatibility',
  },
  'frontend/': {
    type: 'folder',
    layer: 'legacy',
    description: 'LEGACY FRONTEND (Đang migration)',
    important: true,
    note: 'Giữ lại cho backward compatibility',
  },
  'ai/': {
    type: 'folder',
    layer: 'legacy',
    description: 'AI SERVICES (Python)',
    important: true,
    note: 'Giữ nguyên cấu trúc hiện tại',
    children: {
      'AIchatbox/': {
        type: 'folder',
        important: true,
        description: 'CHATBOX - QUAN TRỌNG',
        files: ['chatbox.js', 'index.html', 'style.css', 'README.md'],
      },
      'train_recommendations.py': {
        type: 'file',
        important: true,
        description: 'RECOMMENDER - QUAN TRỌNG',
      },
    },
  },
};

function getColorCode(color) {
  return colors[color] || colors.reset;
}

function getStatusIcon(status) {
  if (status === 'completed') return `${icons.check} `;
  if (status === 'todo') return `${icons.todo} `;
  return '';
}

function getImportantIcon(important) {
  return important ? `${icons.important} ` : '';
}

function printTree(node, prefix = '', isLast = true, depth = 0) {
  const maxDepth = 10; // Giới hạn độ sâu để tránh quá dài
  if (depth > maxDepth) return;

  const connector = isLast ? '└── ' : '├── ';
  const nextPrefix = isLast ? '    ' : '│   ';

  if (node.type === 'folder') {
    const icon = node.important ? icons.important : icons.folder;
    const color = node.color ? getColorCode(node.color) : '';
    const status = getStatusIcon(node.status);
    const important = getImportantIcon(node.important);
    const name = `${icon} ${node.name || ''}`;
    
    console.log(`${prefix}${connector}${color}${status}${important}${name}${colors.reset}`);
    
    if (node.description) {
      console.log(`${prefix}${nextPrefix}   ${colors.reset}${node.description}${colors.reset}`);
    }

    if (node.children) {
      const entries = Object.entries(node.children);
      entries.forEach(([key, child], index) => {
        child.name = key;
        printTree(child, prefix + nextPrefix, index === entries.length - 1, depth + 1);
      });
    }

    if (node.files) {
      node.files.forEach((file, index) => {
        const fileName = typeof file === 'string' ? file : file.name;
        const fileStatus = typeof file === 'object' ? file.status : 'completed';
        const fileImportant = typeof file === 'object' ? file.important : false;
        const isLastFile = index === node.files.length - 1;
        const fileConnector = isLastFile ? '└── ' : '├── ';
        const filePrefix = prefix + nextPrefix + (isLastFile ? '    ' : '│   ');
        const statusIcon = getStatusIcon(fileStatus);
        const importantIcon = getImportantIcon(fileImportant);
        
        console.log(`${filePrefix}${fileConnector}${statusIcon}${importantIcon}${icons.file} ${fileName}${colors.reset}`);
      });
    }
  } else if (node.type === 'file') {
    const status = getStatusIcon(node.status);
    const important = getImportantIcon(node.important);
    console.log(`${prefix}${connector}${status}${important}${icons.file} ${node.name}${colors.reset}`);
  }
}

function generateStructure() {
  ('\n' + colors.bold + 'SMART_BOOK - Cấu trúc Dự án theo Clean Architecture' + colors.reset);
  ('=' .repeat(80) + '\n');

  // In chú giải các lớp
  (colors.bold + 'Màu sắc và Ý nghĩa:' + colors.reset);
  (`  ${getColorCode('yellow')}Vàng${colors.reset}  = Domain Layer (Enterprise Business Rules)`);
  console.log(`  ${getColorCode('red')}Đỏ${colors.reset}    = Application Layer (Application Business Rules)`);
  console.log(`  ${getColorCode('green')}Xanh lá${colors.reset} = Presentation Layer (Interface Adapters)`);
  console.log(`  ${getColorCode('blue')}anh dương${colors.reset} = Infrastructure Layer (Frameworks & Drivers)`);
  console.log(`  ${getColorCode('white')}Trắng${colors.reset} = Shared Layer (Cross-cutting Concerns)\n`);

  console.log(colors.bold + 'Trạng thái:' + colors.reset);
  console.log(`  ${icons.check} = Hoàn thành`);
  console.log(`  ${icons.todo} = Cần làm`);
  console.log(`  ${icons.important} = Quan trọng (Không được xóa)\n`);

  console.log('=' .repeat(80) + '\n');

  // In cấu trúc
  Object.entries(structure).forEach(([key, node], index, array) => {
    node.name = key;
    printTree(node, '', index === array.length - 1);
  });

  console.log('\n' + '=' .repeat(80));
  console.log(colors.bold + '\nGhi chú:' + colors.reset);
  console.log('  - = Hoàn thành');
  console.log('  - = Cần làm');
  console.log('  - = Quan trọng (Không được xóa hoặc thay đổi)');
  console.log('\n');
}

// Chạy script
if (require.main === module) {
  generateStructure();
}

module.exports = { generateStructure, structure };

