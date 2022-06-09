import Sidebar from "./sidebar.js";
import './App.css';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import icon from "./drawable/ic_group.png";
import {GetGroups} from './fetch.js';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="Header">Группы</p>
        <GroupsListView />
      </div>
    </div>
  )
}

function GroupsListView() {
  let { streamId } = useParams();
  
  const [Group, setGroups] = useState([]);
  useEffect(async () => {
        async function fetchData(streamId) {
        let JSON=await getGroups(streamId);
        setGroups(JSON);
    };
    await fetchData(streamId);
  }, []); 
  
  if(Group===[]) {
    return <div />
  };
  
  return (
    <div className="List-Column">
      {Group.map(Group => (
        <div id={"jija"+Group.groupId} className="List-String">
          <button id={Group.groupId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(Group.groupId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(Group.groupId, 'white')}}>
            <a href="#" onClick={function(){OpenGroupStudents(Group.groupId)}} style={{'display': 'flex', 'alignItems': 'center', 'textDecoration': 'none'}}>
              <img src={icon} alt=""/>
              {Group.groupName}
            </a>
          </button>
        </div>  
        ))}
    </div>
  );
}

async function getGroups(Id){
  let Groups=[];  
  let json=await GetGroups(Id);
  
  for(let i=0; i<json.length; i++){
    Groups[i]=json[i];
  }
  return Groups;
}

function OpenGroupStudents(groupId) {
    localStorage.setItem("filterId", groupId);
    localStorage.setItem("filterName", "Группа");
    document.location.href = 'http://localhost:3000/students';
    return false;
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
}

export default App;