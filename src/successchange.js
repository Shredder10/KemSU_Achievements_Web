import logo from './logo-kemsu.png';
import './Login.css';
import './App.css';

function Login() {
  return (
    <div className="Login">
      <header className="Login-header1">
        <button onClick={function (){window.location.assign('http://localhost:3000/');}} className="Login-backbutton">
          Выйти
        </button>
        <img src={logo} className="Login-logo" alt="1K" />
        <p className="Login-text">
          Данные обновлены успешно!
        </p>
      </header>
    </div>
  );
}

export default Login;