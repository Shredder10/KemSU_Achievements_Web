import Sidebar from "./sidebar.js";
import './App.css';
import './Main.css';
import { useState, useEffect } from 'react';
import AddIcon from "./drawable/ic_plus.png";
import EditIcon from "./drawable/ic_edit.png";

import {GetAchievementsList} from "./fetch.js";
import {GetAchievementStatusList} from "./fetch.js";
import {GetCategoriesList} from "./fetch.js";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <AchievementsListView />
      </div>
    </div>
  )
}

function AchievementsListView() {
  const [Achievements, setAchievements] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await GetAchievementsList();
        setAchievements(JSON);
    };
    await fetchData();
  }, []); 
  
  const [Categories, setCategories] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await GetCategoriesList();
        setCategories(JSON);
    };
    await fetchData();
  }, []); 
  
  const [Statuses, setStatuses] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await GetAchievementStatusList();
        setStatuses(JSON);
    };
    await fetchData();
  }, []); 
  
  let currentStatus="";
  let currentCategory="";
  let ChangeFilter = async (event)=>{
    let FilterId = event.target.value;
    if(FilterId[0]=="s") currentStatus=FilterId.substring(6);
    else currentCategory=FilterId.substring(8);
    let JSON=await GetAchievementsList(currentStatus, currentCategory);
    setAchievements(JSON);  
  }
  
  if (Categories.length===0) {
    return <div />
  };
  if (Statuses.length===0) {
    return <div />
  };
  if(Achievements===[]) {
    return <div />
  };
  
  return (
  <div>
    <p className="List-Element-Borderless">
      <p className="Header">Достижения</p>
      {localStorage.getItem("userRole")=="Администратор" &&
        <button id="addAchievementButton" className="List-Element" onClick={function(){window.location.assign('http://localhost:3000/achievement-create/');}} onMouseOver={function(){ChangeBackgroundColor("addAchievementButton", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("addAchievementButton", 'white')}}>
          <img src={AddIcon} alt="Добавить достижение" />
        </button>
      }
      </p>
    <p className="Name">Статус:
      <select id="NewStatus" className="Select" onChange={ChangeFilter}>
        <option key="0" value="status">Любой</option>
        {Statuses.map(Statuses => (
          <option key={Statuses.statusActiveId} value={"status"+Statuses.statusActiveId}>{Statuses.statusActiveName}</option>
        ))}
      </select>
    </p>
    <p className="Name">Категория:
      <select id="NewCategory" className="Select" onChange={ChangeFilter}>
        <option key="0" value="category">Любая</option>
        {Categories.map(Categories => (
          <option key={Categories.categoryId} value={"category"+Categories.categoryId}>{Categories.categoryName}</option>
        ))}
      </select>
    </p>

    {Achievements.map(Achievements => (
      <div className="List-String">
        <button id={Achievements.achieveId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(Achievements.achieveId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(Achievements.achieveId, 'white')}}>
          <a href={'http://localhost:3000/achievements/'+Achievements.achieveId} style={{'display': 'flex', 'alignItems': 'center', 'textDecoration': 'none'}}>
            <div style={{'display': 'flex', 'flexDirection': 'row', 'flexWrap': 'wrap'}}>  
              <img src={"data:image/"+Achievements.file.format+";base64,"+atob(Achievements.file.data)} height="64px" alt="Изображение достижения" style={{'alignItems': 'center', 'margin-right': '1vw', 'borderRadius': '32px'}}/>
              <div style={{'display': 'flex', 'flexDirection': 'column', 'flexWrap': 'wrap'}}>
                <div style={{'display': 'flex', 'flexWrap': 'wrap'}}>{Achievements.achieveName}</div>
                <div style={{'display': 'flex', 'flexWrap': 'wrap', 'fontSize': '2vh'}}>{Achievements.description}</div>
              </div>
            </div>  
          </a>
        </button>
        <button id={"edit"+Achievements.achieveId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor("edit"+Achievements.achieveId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("edit"+Achievements.achieveId, 'white')}}>
          <a href={"http://localhost:3000/achievement-edit/"+Achievements.achieveId}>
            <img src={EditIcon} alt="Изменить достижение" />
          </a>
        </button>
      </div>  
    ))}
  </div>  
  );
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
}

export default App;