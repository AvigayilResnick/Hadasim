import { useNavigate } from 'react-router-dom';
import '../css/WelcomePage.css'

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <h1>Welcome! Please choose your position:</h1>
      <div className="welcome-buttons">
        <button onClick={() => navigate('/storeowner')} >
          Store Owner
        </button>
        <button onClick={() => navigate('/supplier')} >
          Supplier
        </button>
      </div>
    </div>
  );
}


export default WelcomePage;