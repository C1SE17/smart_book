import React, { useState, useEffect } from 'react';
import { bookApi, categoryApi, authorApi, publisherApi } from '../../services/bookApi';

const DatabaseTest = () => {
    const [testResults, setTestResults] = useState({});
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);

    const testDatabaseConnection = async () => {
        setLoading(true);
        try {
            console.log('🔍 Testing database connection...');

            // First test basic API connection
            console.log('🌐 Testing basic API connection...');
            const testResponse = await fetch('http://localhost:3306/api/test');
            const testData = await testResponse.json();
            console.log('✅ Basic API test:', testData);

            // Test each API endpoint
            console.log('📚 Testing books API...');
            const booksRes = await bookApi.getAllBooks({ limit: 10 });
            console.log('📚 Books API result:', booksRes);

            console.log('📂 Testing categories API...');
            const categoriesRes = await categoryApi.getAllCategories();
            console.log('📂 Categories API result:', categoriesRes);

            console.log('👤 Testing authors API...');
            const authorsRes = await authorApi.getAllAuthors();
            console.log('👤 Authors API result:', authorsRes);

            console.log('🏢 Testing publishers API...');
            const publishersRes = await publisherApi.getAllPublishers();
            console.log('🏢 Publishers API result:', publishersRes);

            setBooks(booksRes.data || []);
            setCategories(categoriesRes.data || []);
            setAuthors(authorsRes.data || []);
            setPublishers(publishersRes.data || []);

            setTestResults({
                success: true,
                books: booksRes,
                categories: categoriesRes,
                authors: authorsRes,
                publishers: publishersRes,
                message: 'Database connection successful!'
            });

        } catch (error) {
            console.error('❌ Database connection failed:', error);
            setTestResults({
                success: false,
                error: error.message,
                message: 'Database connection failed!'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        testDatabaseConnection();
    }, []);

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="mb-0">
                    <i className="fas fa-database me-2"></i>
                    Database Connection Test
                </h5>
            </div>
            <div className="card-body">
                <div className="d-flex gap-2 mb-3">
                    <button
                        className="btn btn-primary"
                        onClick={testDatabaseConnection}
                        disabled={loading}
                    >
                        {loading ? 'Testing...' : 'Test Database'}
                    </button>
                </div>

                {testResults.success && (
                    <div className="alert alert-success">
                        <h6>✅ Database Connection Successful!</h6>

                        <div className="row mt-3">
                            <div className="col-md-3">
                                <div className="text-center">
                                    <h4 className="text-primary">{books.length}</h4>
                                    <small className="text-muted">Books</small>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="text-center">
                                    <h4 className="text-success">{categories.length}</h4>
                                    <small className="text-muted">Categories</small>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="text-center">
                                    <h4 className="text-info">{authors.length}</h4>
                                    <small className="text-muted">Authors</small>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="text-center">
                                    <h4 className="text-warning">{publishers.length}</h4>
                                    <small className="text-muted">Publishers</small>
                                </div>
                            </div>
                        </div>

                        {books.length > 0 && (
                            <div className="mt-4">
                                <h6>📚 Books from Database:</h6>
                                <div className="table-responsive">
                                    <table className="table table-sm table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Title</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                <th>Category ID</th>
                                                <th>Author ID</th>
                                                <th>Publisher ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {books.slice(0, 5).map(book => (
                                                <tr key={book.book_id}>
                                                    <td>{book.book_id}</td>
                                                    <td>{book.title}</td>
                                                    <td>{book.price ? book.price.toLocaleString('vi-VN') + ' VND' : 'N/A'}</td>
                                                    <td>{book.stock || 'N/A'}</td>
                                                    <td>{book.category_id || 'N/A'}</td>
                                                    <td>{book.author_id || 'N/A'}</td>
                                                    <td>{book.publisher_id || 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {books.length > 5 && (
                                    <p className="text-muted small">... and {books.length - 5} more books</p>
                                )}
                            </div>
                        )}

                        {books.length === 0 && (
                            <div className="mt-4">
                                <div className="alert alert-warning">
                                    <h6>⚠️ No Books Found</h6>
                                    <p>The database is empty or the books table doesn't exist.</p>
                                    <p><strong>Possible solutions:</strong></p>
                                    <ul>
                                        <li>Check if backend server is running on port 3306</li>
                                        <li>Verify database connection in backend</li>
                                        <li>Check if books table exists in database</li>
                                        <li>Insert some sample data into books table</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!testResults.success && testResults.error && (
                    <div className="alert alert-danger">
                        <h6>❌ Database Connection Failed</h6>
                        <p><strong>Error:</strong> {testResults.error}</p>
                        <p><strong>Possible causes:</strong></p>
                        <ul>
                            <li>Backend server is not running (check port 3306)</li>
                            <li>Database connection failed</li>
                            <li>API endpoints not available</li>
                            <li>Network connection issues</li>
                            <li>CORS issues</li>
                        </ul>
                        <p><strong>Steps to fix:</strong></p>
                        <ol>
                            <li>Start backend server: <code>cd backend && npm start</code></li>
                            <li>Check database connection in backend</li>
                            <li>Verify API endpoints are working</li>
                            <li>Check browser console for more details</li>
                        </ol>
                    </div>
                )}

                {loading && (
                    <div className="text-center py-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Testing database connection...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DatabaseTest;
