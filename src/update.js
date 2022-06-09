import logo from './logo-kemsu.png';
import './Login.css';
import './App.css';

import {SecurityCodeCheck} from "./fetch.js";
import {WriteNewPassword} from "./fetch.js";

function Page() {
  return (
    <div className="Login">
      <header className="Login-header">
        <button onClick={function (){window.location.assign('http://localhost:3000/');}} className="Login-backbutton">
          Выйти
        </button>
        <img src={logo} className="Login-logo" alt="1K" />
        <p className="Login-text1">Восстановление доступа к аккаунту</p>
        <p className="Login-text">Введите новый пароль</p>
        <p className="Login-error-text" hidden={true} id="passwd_short">Пароль должен состоять минимум из 8 символов.</p>
        <input id="passwd1" type="password" placeholder="Password" className="Login-input"/>
        <p className="Login-text">Повторите новый пароль</p>
        <input id="passwd2" type="password" placeholder="Password" className="Login-input"/>
        <p className="Login-error-text" hidden={true} id="not_eq">Введённые пароли должны совпадать.</p>
        <p className="Login-text">Введите код доступа, присланный на указанный Вами почтовый адресс.</p>
        <p className="Login-error-text" hidden={true} id="code_input">Необходимо ввести код доступа!</p>
        <p className="Login-error-text" hidden={true} id="code_wrong">Неверный код доступа!</p>
        <input id="code" type="text" placeholder="" className="Login-input"/>
        <br />
        <p className="Login-error-text" hidden={true} id="error">Непредвиденная ошибка на сервере. Вернитесь назад и повторите попытку.</p>
        <button onClick={update} className="Login-button2">
          Обновить данные
        </button>
      </header>
    </div>
  );
}

async function update(){
  let code=document.getElementById("code").value;
  let passwd1=document.getElementById("passwd1").value;  
  let passwd2=document.getElementById("passwd2").value;
  document.getElementById("error").hidden=true;
  document.getElementById("code_input").hidden=true;
  document.getElementById("passwd_short").hidden=true;
  document.getElementById("code_wrong").hidden=true;
  document.getElementById("not_eq").hidden=true;
  
  let email=localStorage.getItem("email");
  let role=localStorage.getItem("recoveringRole");
  if(passwd1!==passwd2) document.getElementById("not_eq").hidden=false;
  else{
    if(passwd1.length<8) document.getElementById("passwd_short").hidden=false;
    else{
      if (code==="") document.getElementById("code_input").hidden=false;
      else{
        if (code.length!==8) document.getElementById("code_wrong").hidden=false;
        else{
          let response = await SecurityCodeCheck(code, email, role);
          if (response===200){
            let tmp={};
            tmp['email']=email;
            tmp['password']=passwd1;
            response = await WriteNewPassword(tmp, role);
            if (response===500) document.getElementById("error").hidden=false;
            else if (response===200) {
              localStorage.removeItem("email");
              localStorage.removeItem("recoveringRole");
              window.location.assign('http://localhost:3000/successchange/');
            }
          }
          else if (response===404) document.getElementById("code_wrong").hidden=false;
          else document.getElementById("error").hidden=false;
        }
      }
    }  
  }    
}

export default Page;