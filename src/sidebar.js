import './sidebar.css';
import Medal from "./drawable/ic_usersaward.png";
import Requests from "./drawable/ic_edit.png";
import Mail from "./drawable/ic_email.png";
import Education from "./drawable/ic_graduate.png";
import Users from "./drawable/ic_group.png";
import MessageIcon from "./drawable/ic_message.png";
import TrophyIcon from "./drawable/ic_trophy.png";
import ExitIcon from "./drawable/ic_exit.png";

import Avatar from "./avatar.png";

function Sidebar() {
  let role = localStorage.getItem("userRole");
  let userName = localStorage.getItem("userFirstName") + " " + localStorage.getItem("userLastName");
  let profileUrl = 'http://localhost:3000/profile/' + localStorage.getItem("userId");
  return (
    <div className="Sidebar">
      <div className="Sidebar-header">
        <a href="http://localhost:3000/main" style={{'textDecoration': 'none'}}>
          <button className="Sidebar-home-button">
            <p className="Achievements">
              <img src={Medal} style={{height: '6vh'}} alt="" />
              <div style={{'textDecoration': 'none'}}>Достижения</div>
            </p>
          </button>
        </a>
        <button onClick={Profile} className="User">
          <a href={profileUrl} className="Sidebar-list-button">
            <img src={Avatar} className="Sidebar-avatar" alt="" />
            <p className="User-name">{userName}</p>
            <p className="User-role">{role}</p>
          </a>
        </button>
      </div>
      <div>
        <ul className="Sidebar-list-active">
          <li>
          <div style={{'alignItems': 'center', 'display': 'flex'}}>
            <img src={Requests} style={{height: '3vh'}} alt="" />
            <button className="Sidebar-list-button" onClick={function(){Make_Visible("requests")}}>Заявки</button>
          </div>  
            <ul className="Sidebar-list-inactive" id="Sidebar_requests">
                <li>
                  <div style={{'alignItems': 'center', 'display': 'flex'}}>
                    <img src={TrophyIcon} style={{height: '3vh'}} alt="" />
                    <button className="Sidebar-list-button" onClick={function(){Make_Visible("achievements")}}>Достижения</button>
                  </div>
                </li>
                  <ul className="Sidebar-list-inactive" id="Sidebar_achievements">
                    <li>
                      <a href="http://localhost:3000/achievements">
                        <button className="Sidebar-list-button">Список достижений</button>
                      </a>
                    </li>
                    {localStorage.getItem("userRole")=='Администратор' &&
                    <li>
                      <a href="http://localhost:3000/achievement-create">
                        <button className="Sidebar-list-button">Создать достижение</button>
                      </a>  
                    </li>}
                    {localStorage.getItem("userRole")=='Модератор' &&
                    <li>
                      <a href="http://localhost:3000/achievements/proof">
                        <button className="Sidebar-list-button">Подтверждение достижений</button>
                      </a>
                    </li>}
                    <li>
                      <a href="http://localhost:3000/categories">
                        <button className="Sidebar-list-button">Категории</button>
                      </a>  
                    </li>
                  </ul>
                <li>
                  <div style={{'alignItems': 'center', 'display': 'flex'}}>
                    <img src={Medal} style={{height: '3vh'}} alt="" />
                    <a href="http://localhost:3000/rewards">
                      <button className="Sidebar-list-button">Награды</button>
                    </a>
                  </div>
                </li>
                {localStorage.getItem("userRole")=='Администратор' &&
                <li>
                  <div style={{'alignItems': 'center', 'display': 'flex'}}>
                    <img src={Mail} style={{height: '3vh'}} alt="" />
                    <a href="http://localhost:3000/support">
                      <button className="Sidebar-list-button">Поддержка</button>
                    </a>
                  </div>
                </li>}
                <li>
                  <div style={{'alignItems': 'center', 'display': 'flex'}}>
                    <img src={Education} style={{height: '3vh'}} alt="" />
                    <a href="http://localhost:3000/education">
                      <button className="Sidebar-list-button">Образование</button>
                    </a>
                  </div>
                </li>
                <li>
                  <div style={{'alignItems': 'center', 'display': 'flex'}}>
                    <img src={MessageIcon} style={{height: '3vh'}} alt="" />
                    <a href="http://localhost:3000/log">
                      <button className="Sidebar-list-button">Просмотр лога</button>
                    </a>
                  </div>
                </li>
              </ul>
          </li>
          <li>
            {localStorage.getItem("userRole")=='Администратор' && 
              <div style={{'alignItems': 'center', 'display': 'flex'}}>
                <img src={Users} style={{height: '3vh'}} alt="" />
                <button className="Sidebar-list-button" onClick={function(){Make_Visible("users")}}>Пользователи</button>
              </div>}
                <ul className="Sidebar-list-inactive" id="Sidebar_users">
                  <li>
                    <a href="http://localhost:3000/users">
                      <button className="Sidebar-list-button">Пользователи</button>
                    </a>
                  </li>
                  <li>
                    <a href="http://localhost:3000/students">
                      <button className="Sidebar-list-button">Студенты</button>
                    </a>
                  </li>
                  <li>
                    <a href="http://localhost:3000/register">
                      <button className="Sidebar-list-button">Создать пользователя</button>
                    </a>
                  </li>
                </ul>
              {localStorage.getItem("userRole")=='Модератор' &&
              <div style={{'alignItems': 'center', 'display': 'flex'}}>
                <img src={Users} style={{height: '3vh'}} alt="" />
                <a href="http://localhost:3000/students">
                  <button className="Sidebar-list-button">Студенты</button>
                </a>
              </div>}
          </li>
        </ul>
      </div>
      <div className="Sidebar-footer">
        <button onClick={Exit} className="Sidebar-exit-button" id="ExitButton" onMouseOver={function(){Mouse("ExitButton", "over")}} onMouseOut={function(){Mouse("ExitButton", "out")}}>
          <p className="Sidebar-Exit">
            <img src={ExitIcon} className="Sidebar-exit-icon" alt="" />
            &nbsp;Выход
          </p>
        </button>
      </div>
    </div>
  );
}

function Exit() {
    localStorage.clear();
    window.location.assign('http://localhost:3000/');
}

function Home() {
    window.location.assign('http://localhost:3000/main');
}

function Profile() {
    let userId = localStorage.getItem("userId");
    let url = 'http://localhost:3000/profile/' + userId;
    window.location.assign(url);
}

function Make_Visible(what) {
    if (what==="requests") {
        document.getElementById("Sidebar_requests").className="Sidebar-list-active";
        document.getElementById("Sidebar_users").className="Sidebar-list-inactive";
    }
    else if (what==="achievements") {
        document.getElementById("Sidebar_achievements").className="Sidebar-list-active";
    }
    else {
        document.getElementById("Sidebar_achievements").className="Sidebar-list-inactive";
        document.getElementById("Sidebar_requests").className="Sidebar-list-inactive";
        document.getElementById("Sidebar_users").className="Sidebar-list-active";
    }
}

function Mouse(what, condition) {
  if(condition==="over"){
    document.getElementById(what).className="Sidebar-exit-button-mouse"
  }
  else{
    document.getElementById(what).className="Sidebar-exit-button"
  }
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
}

export default Sidebar;