function OrderCard({ order, onApprove, onComplete, onViewItems, userType }) {
  return (
    <li style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p>
        <strong>{userType === 'supplier' ? 'Store Owner' : 'Supplier'}:</strong>{' '}
        {userType === 'supplier' ? order.store_owner_name : order.supplier_name}
      </p>
      <button onClick={() => onViewItems(order.id)}>View Items</button>{' '}

      {userType === 'supplier' && order.status === 'pending' && (
        <button onClick={() => onApprove(order.id)}>Approve Order</button>
      )}

      {userType === 'storeOwner' && order.status === 'in_process' && (
        <button onClick={() => onComplete(order.id)}>Mark as Received</button>
      )}
    </li>
  );
}

export default OrderCard;