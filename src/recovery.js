import logo from './logo-kemsu.png';
import './Login.css';
import './App.css';
import {SendUpdateMail} from './fetch.js';

function Page() {
  return (
    <div className="Login">
      <header className="Login-header">
        <button onClick={function (){window.location.assign('http://localhost:3000/');}} className="Login-backbutton">
          Назад
        </button>
        <img src={logo} className="Login-logo" alt="1K" />
        <p className="Login-text1">Восстановление доступа к аккаунту</p>
        <p className="Login-text">Укажите email, к которому привязан Ваш аккаунт</p>
        <p className="Login-error-text" hidden={true} id="email_input">Необходимо указать адрес почты!</p>
        <p className="Login-error-text" hidden={true} id="email_wrong">Укажите корректный адрес электронной почты!</p>
        <p className="Login-error-text" hidden={true} id="email_not_found">К указанному Вами адресу не привязано аккаунтов.</p>
        <input id="email" type="text" placeholder="student@kemsu.ru" className="Login-input"/>
        <br />
        <p className="Login-text">Укажите роль аккаунта, который хотите восстановить</p>
        <div className="Login-textbutton-row">
          <input type="radio" name="newUserRole" id="admin" /> <p className="Login-text">Администратор</p>
          <input type="radio" name="newUserRole" id="moder" /> <p className="Login-text">Модератор</p>
        </div>
        <p className="Login-error-text" hidden={true} id="no_role">Укажите роль восстанавливаемого аккаунта!</p>
        <br />
        <button onClick={update} className="Login-button2">
          Сбросить пароль
        </button>
        <br />
        <button onClick={no_email} className="Login-button2">
          Нет доступа к почте?
        </button>
      </header>
    </div>
  );
}

async function update() {
    let email=document.getElementById("email").value;
    document.getElementById("email_input").hidden=true;
    document.getElementById("email_wrong").hidden=true;
    document.getElementById("email_not_found").hidden=true;
    document.getElementById("no_role").hidden=true;
    
    
    let role="";
    if(document.getElementById("admin").checked) role="Admin";
    else if(document.getElementById("moder").checked) role="Moderator";
    else {document.getElementById("no_role").hidden=false; return;}
    
    if(email==="") {document.getElementById("email_input").hidden=false;}
    else{
        let request = await SendUpdateMail(email, role);
        if (request===200) {
            localStorage.setItem('email', email);
            localStorage.setItem('recoveringRole', role);
            window.location.assign('http://localhost:3000/update/');
        }
        else {
            if (request===400) {
                document.getElementById("email_wrong").hidden=false;
            }
            else if (request===404) {
                document.getElementById("email_not_found").hidden=false;
            }
        }
    }
}

function no_email() {
    window.location.assign('http://localhost:3000/noemail/');
}

export default Page;