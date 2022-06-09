import Sidebar from "./sidebar.js";
import './App.css';
import './Main.css';
import { useState, useEffect } from 'react';

import {GetAchievementsProofList} from "./fetch.js";
import {GetAchievementProofStatusList} from "./fetch.js";

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
        let JSON=await getAchievements();
        setAchievements(JSON);
    };
    await fetchData();
  }, []); 
  
  const [Statuses, setStatuses] = useState([]);
  useEffect(async () => { //Statuses
        async function fetchData() {
        let JSON=await GetStatusList();
        setStatuses(JSON);
    };
    await fetchData();
  }, []);
  
  
  
  let ChangeFilter = async (event)=>{
    let FilterId = event.target.value;
    let JSON=await getAchievements(FilterId);
    setAchievements(JSON);  
  }

  if(Achievements===[]) {
    return <div />
  };
  if (Statuses.length===0) {
    return <div />
  };

  return (
    <div>
      <p className="Header">
        Получение достижений
      </p>
      <p className="Name">Статус:
        <select id="NewErrorStatus" className="Select" onChange={ChangeFilter}>
          <option key="0" value="">Любой</option>
          {Statuses.map(Statuses => (
            <option key={Statuses.statusRequestId} value={Statuses.statusRequestId}>{Statuses.statusRequestName}</option>
          ))}
        </select>
      </p>
      {Achievements.map(Achievements => (
        <button id={Achievements.proofId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(Achievements.proofId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(Achievements.proofId, 'white')}}>
          <a href={'http://localhost:3000/achievements/proof/'+Achievements.proofId} style={{'textDecoration': 'none'}}>
            {Achievements.user.firstName} {Achievements.user.lastName} - {Achievements.achievement.achieveName}
          </a>
        </button> 
      ))}
    </div>
  );
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
}

async function GetStatusList() {
  let statuses = await GetAchievementProofStatusList(); 
  return statuses;
}

async function getAchievements(FilterId) {
  let achievements=[];  
  let json = await GetAchievementsProofList(FilterId);
  console.log(json);
  for(let i=0; i<json.length; i++){
    achievements[i]=json[i];
  }
  return achievements;
}

export default App;