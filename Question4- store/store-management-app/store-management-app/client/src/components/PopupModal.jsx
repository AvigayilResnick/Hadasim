function Modal({ children, onClose }) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <button onClick={onClose} style={styles.close}>✖</button>
          {children}
        </div>
      </div>
    );
  }
  
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modal: {
      background: 'white',
      padding: '2rem',
      borderRadius: '10px',
      position: 'relative',
      minWidth: '400px',
      maxHeight: '80vh',
      overflowY: 'auto'
    },
    close: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      background: 'none',
      border: 'none',
      fontSize: '1.2rem',
      cursor: 'pointer'
    }
  };
  
  export default Modal;