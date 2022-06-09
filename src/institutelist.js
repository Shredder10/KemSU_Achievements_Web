import Sidebar from "./sidebar.js";
import './App.css';
import './Main.css';
import icon from "./drawable/ic_institute.png";
import { useState, useEffect } from 'react';

import {GetInstitutions} from './fetch.js';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="Header">Институты</p>
        <InstitutesListView />
      </div>
    </div>
  )
}

function InstitutesListView() {
  const [Institute, setInstitutes] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await getInstitutions();
        setInstitutes(JSON);
    };
    await fetchData();
  }, []); 
  
  if(Institute===[]) {
    return <div />
  };
  
  return (
    <div>
      {Institute.map(Institute => (
        <div id={"jija"+Institute.instituteId} className="List-String">
          <button id={Institute.instituteId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(Institute.instituteId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(Institute.instituteId, 'white')}}>
            <a href={'http://localhost:3000/education/'+Institute.instituteId} style={{'display': 'flex', 'alignItems': 'center', 'textDecoration': 'none'}}>
              <img src={icon} alt=""/>
              {Institute.instituteFullName}
            </a>
          </button>
        </div>  
        ))}
    </div>
  );
}

async function getInstitutions() {
  let institutes=[];  
  let json=await GetInstitutions();
  
  for(let i=0; i<json.length; i++){
    institutes[i]=json[i];
  }
  return institutes;
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
}

export default App;