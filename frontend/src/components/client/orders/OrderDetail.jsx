import React from 'react';

const OrderDetail = ({ orderId, onBackToProfile }) => {
  // Mock order detail data
  const orderDetails = {
    1: {
      id: 1,
      date: '2024-01-15',
      status: 'Delivered',
      statusText: 'Đã giao',
      total: '1,250,000 VNĐ',
      items: [
        { id: 1, name: 'Sách lập trình React', price: '450,000 VNĐ', quantity: 1 },
        { id: 2, name: 'Sách JavaScript ES6', price: '380,000 VNĐ', quantity: 1 },
        { id: 3, name: 'Sách Node.js', price: '420,000 VNĐ', quantity: 1 }
      ],
      shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
      paymentMethod: 'Thanh toán khi nhận hàng'
    },
    2: {
      id: 2,
      date: '2024-01-10',
      status: 'Processing',
      statusText: 'Đang xử lý',
      total: '890,000 VNĐ',
      items: [
        { id: 4, name: 'Sách Python', price: '350,000 VNĐ', quantity: 1 },
        { id: 5, name: 'Sách Machine Learning', price: '540,000 VNĐ', quantity: 1 }
      ],
      shippingAddress: '456 Đường XYZ, Quận 2, TP.HCM',
      paymentMethod: 'Chuyển khoản ngân hàng'
    },
    3: {
      id: 3,
      date: '2024-01-05',
      status: 'Shipped',
      statusText: 'Đã gửi',
      total: '780,000 VNĐ',
      items: [
        { id: 6, name: 'Sách Vue.js', price: '780,000 VNĐ', quantity: 1 }
      ],
      shippingAddress: '789 Đường DEF, Quận 3, TP.HCM',
      paymentMethod: 'Ví điện tử'
    }
  };

  const order = orderDetails[orderId] || orderDetails[1];

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="container py-4">
        {/* Back Navigation */}
        <div className="mb-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <button
                  className="btn btn-link text-dark p-0 no-hover"
                  onClick={onBackToProfile}
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: '16px',
                    textDecoration: 'none',
                    boxShadow: 'none'
                  }}
                >
                  <i className="fas fa-home me-1"></i>
                  Trang chủ
                </button>
              </li>
              <li className="breadcrumb-item">
                <button
                  className="btn btn-link text-dark p-0 no-hover"
                  onClick={() => {
                    window.history.pushState({}, '', '/profile/orders');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: '16px',
                    textDecoration: 'none',
                    boxShadow: 'none'
                  }}
                >
                  Đơn hàng
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Chi tiết đơn hàng #{order.id}
              </li>
            </ol>
          </nav>
        </div>

        {/* Order Detail Card */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  <i className="fas fa-receipt me-2"></i>
                  Chi tiết đơn hàng #{order.id}
                </h4>
              </div>
              <div className="card-body p-4">
                {/* Order Status */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="text-muted">Trạng thái đơn hàng</h6>
                    <span className={`badge fs-6 ${order.status === 'Delivered' ? 'bg-success' :
                      order.status === 'Shipped' ? 'bg-info' :
                        order.status === 'Processing' ? 'bg-warning' : 'bg-secondary'
                      }`}>
                      {order.statusText}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted">Ngày đặt hàng</h6>
                    <p className="mb-0">{order.date}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h6 className="text-muted mb-3">Sản phẩm đã đặt</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Giá</th>
                          <th>Số lượng</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="table-light">
                          <td colSpan="3" className="text-end fw-bold">Tổng cộng:</td>
                          <td className="fw-bold">{order.total}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">Địa chỉ giao hàng</h6>
                    <p className="mb-0">{order.shippingAddress}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">Phương thức thanh toán</h6>
                    <p className="mb-0">{order.paymentMethod}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => {
                        window.history.pushState({}, '', '/profile/orders');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }}
                    >
                      <i className="fas fa-arrow-left me-1"></i>
                      Quay lại danh sách
                    </button>
                    {order.status === 'Delivered' && (
                      <button className="btn btn-outline-secondary">
                        <i className="fas fa-redo me-1"></i>
                        Đặt lại
                      </button>
                    )}
                    <button className="btn btn-outline-info">
                      <i className="fas fa-download me-1"></i>
                      Tải hóa đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
