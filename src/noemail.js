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
          Если Вы не помните адрес электронной почты, которая привязана к Вашему аккаунту, или у Вас больше нет к ней доступа и Вам нужно привязать новую почту, обратитесь к администраторам. Сбросить её самостоятельно нельзя.
        </p>
      </header>
    </div>
  );
}

export default Login;