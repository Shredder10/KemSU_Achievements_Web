import logo from './logo-kemsu.png';
import './Login.css';
import {LoginRequest}  from "./fetch.js";
import {GetUserData}  from "./fetch.js";

function Page() {
  return (
    <div className="Login">
      <div className="Login-header">
        <img src={logo} className="Login-logo" alt="1K" />
        <p className="Login-text1">Система достижений КемГУ</p>
        <p className="Login-text">Логин</p>
        <p className="Login-error-text" hidden={true} id="email_input">Введите логин!</p>
        <p className="Login-error-text" hidden={true} id="email_not_found">Пользователь с таким email не найден.</p>
        <input id="login1" type="text" placeholder="email" className="Login-input"/>
        <p className="Login-text">Пароль</p>
        <p className="Login-error-text" hidden={true} id="passwd_input">Введите пароль!</p>
        <p className="Login-error-text" hidden={true} id="passwd_wrong">Неверный пароль.</p>
        <input id="login2" type="password" placeholder="Password" className="Login-input"/>
        <br />
        <div className="Login-textbutton-row">
          <input type="radio" id="admin" name="role"/>
          <label for="admin" className="Login-text">Войти как администратор</label>
        </div>
        <div className="Login-textbutton-row">
          <input type="radio" id="moderator" name="role"/>
          <label for="moderator" className="Login-text">Войти как модератор</label>
        </div>
        <div className="Login-textbutton-row">
          <input type="radio" id="dekanat" name="role" hidden={true}/>
          <label for="dekanat" className="Login-text" hidden={true}>Войти как сотрудник деканата</label>
        </div>
        <p className="Login-error-text" hidden={true} id="no_role">Выберите роль!</p>
        <br />
        <div className="Login=buttons">
          <button onClick={enter} className="Login-button2">
            Войти
          </button>
          <button onClick={forgot} className="Login-button2">
            Забыли пароль?
          </button>
        </div>
      </div>
    </div>
  );
}

async function enter() {
    document.getElementById("email_input").hidden=true;
    document.getElementById("email_not_found").hidden=true;
    document.getElementById("no_role").hidden=true;
    document.getElementById("passwd_input").hidden=true;
    document.getElementById("passwd_wrong").hidden=true;
    
    let login=document.getElementById("login1").value;
	let passwd=document.getElementById("login2").value;
    if(login==="") {
        document.getElementById("email_input").hidden=false;
    }
    if(passwd==="") {
        document.getElementById("passwd_input").hidden=false;
    }
    else{
        let tmp={};
        tmp["email"]=login;
        tmp["password"]=passwd;
        let role;
        if(document.getElementById("admin").checked==true) role="admin"
        else if(document.getElementById("dekanat").checked==true) role="dekanat";
        else if(document.getElementById("moderator").checked==true) role="moder";
        else {document.getElementById("no_role").hidden=false; return;}
        let request = await LoginRequest(tmp, role);
        if(request===200)
        {
            let request = await GetUserData();
            window.location.assign('http://localhost:3000/main/');
        }
        else{
            if (request==="Пользователь с таким email не найден") {
                document.getElementById("email_not_found").hidden=false;
            }
            else if(request==="Неверный пароль") {
                document.getElementById("passwd_wrong").hidden=false;
            }
        }
    }
}

function forgot() {
    window.location.assign('http://localhost:3000/recovery/');
}

export default Page;