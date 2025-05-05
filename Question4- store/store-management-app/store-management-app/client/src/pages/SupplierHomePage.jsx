import { useEffect, useState } from 'react';
import OrderCard from '../components/OrderInfo';

function SupplierHome() {
  const supplierName = localStorage.getItem('supplierName') || 'Supplier';
  const supplierId = localStorage.getItem('supplierId');
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:5000/suppliers/${supplierId}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/suppliers/${supplierId}/orders/${orderId}/approve`, {
        method: 'PATCH'
      });
      if (!res.ok) throw new Error('Failed to approve order');
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrderItems = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/orders/${orderId}/items`);
      const items = await res.json();
      alert(
        `Items in order ${orderId}:
` +
        items.map(item => `${item.product_name} - ${item.quantity}`).join('\n')
      );
    } catch (err) {
      alert('Failed to fetch items');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="supplier-home">
      <h1>Welcome, {supplierName}!</h1>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onApprove={handleApprove}
              onViewItems={fetchOrderItems}
              userType="supplier"
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default SupplierHome;