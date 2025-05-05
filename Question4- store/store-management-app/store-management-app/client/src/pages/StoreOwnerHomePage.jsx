import { useEffect, useState } from 'react';
import OrderCard from '../components/OrderInfo';
import Modal from '../components/PopupModal';
import OrderForm from '../components/OrderForm';


function StoreOwnerHome() {
    const storeOwnerName = localStorage.getItem('storeOwnerName') || 'Store Owner';
    const storeOwnerId = localStorage.getItem('storeOwnerId');
    const [orders, setOrders] = useState([]);
    const [showOrders, setShowOrders] = useState(false);
    const [showModal, setShowModal] = useState(false);


    const fetchOrders = async () => {
        try {
            const res = await fetch(`http://localhost:5000/storeowners/${storeOwnerId}/orders`);
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        }
    };

    const handleComplete = async (orderId) => {
        try {
            const res = await fetch(`http://localhost:5000/storeowners/${storeOwnerId}/orders/${orderId}/complete`, {
                method: 'PATCH',
            });
            if (!res.ok) throw new Error('Failed to complete order');
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
                `Items in order ${orderId}:\n` +
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
        <div className="store-owner-home">
            <h1>Welcome, {storeOwnerName}!</h1>
            <div style={{ margin: '1rem 0' }}>
                <button
                    onClick={() => setShowOrders(prev => !prev)}
                    style={{ marginLeft: '1rem' }}
                >
                    {showOrders ? 'Hide My Orders' : 'View My Orders'}
                </button>

                <button onClick={() => setShowModal(true)}>Place An Order</button>
            </div>

            {showOrders && (
                <div>
                    <h2>My Orders</h2>

                    {orders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        <ul>
                            {orders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onComplete={handleComplete}
                                    onViewItems={fetchOrderItems}
                                    userType="storeOwner"
                                />
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <OrderForm
                        onOrderCreated={() => {
                            fetchOrders();
                            setShowModal(false);
                            setShowOrders(true);
                        }}
                    />
                </Modal>
            )}
        </div>
    );
}

export default StoreOwnerHome;