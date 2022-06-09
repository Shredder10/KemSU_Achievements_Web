import Sidebar from "./sidebar.js";
import './App.css';
import './Main.css';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import icon from "./drawable/ic_user.png";

import {GetInstitutions} from './fetch.js';
import {GetStreams} from './fetch.js';
import {GetGroups} from './fetch.js';
import {GetUserStatusesList} from './fetch.js';
import {GetStudents} from './fetch.js';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="Header">Студенты</p>
        <StudentsListView />
      </div>
    </div>
  )
}

function StudentsListView() {
  const [Students, setStudents] = useState([]);
  const [Active, setActive] = useState(true);
  const [Institute, setInstitute] = useState([]);
  const [Stream, setStreams] = useState([]);
  const [Group, setGroups] = useState([]);
  const [Status, setStatuses] = useState([]);
  
  const [currSubStr, setcurrSubStr] = useState('');
  const [currentRole, setcurrentRole] = useState('');
  const [currentStatus, setcurrentStatus] = useState('');
  const [currentFilt, setcurrentFilt] = useState('');
  const [currInstId, setcurrInstId] = useState('');
  const [currStreamId, setcurrStreamId] = useState('');

  useEffect(async () => {//institutes
        async function fetchData() {
        let JSON=await GetInstitutions();
        setInstitute(JSON);
    };
    await fetchData();
  }, []); 

  useEffect(async () => {//students
        async function fetchData() {
        let JSON=await GetStudents();
        setStudents(JSON);
    };
    await fetchData();
  }, []); 
  
  useEffect(async () => {//active-statuses
        async function fetchData() {
        let JSON=await GetUserStatusesList();
        setStatuses(JSON);
    };
    await fetchData();
  }, []); 
  
  
  let ChangeInstitute = async (event)=>{
    let InstitutionId = event.target.value;
    if(InstitutionId=="I") {setStreams([]);}
    else {let JSON=await GetStreams(InstitutionId.substring(1));
      setcurrInstId(InstitutionId);
      setStreams(JSON);}
    setGroups([]);
    ChangeFilter(event);
  }
  
  let ChangeStream = async (event)=>{
    let StreamId = event.target.value;
    if(StreamId=="S") {setGroups([]);}
    else {let JSON=await GetGroups(StreamId.substring(1));
      setcurrStreamId(StreamId);
      setGroups(JSON);
    }
    ChangeFilter(event);
  }
  
  let ChangeFilter = async (event)=>{
    let FilterId = event.target.value;
    switch(FilterId[0]){
      case "t": {
        if(FilterId[1]!=="") {setcurrentStatus(FilterId.substring(1)); break;}
      }
      case "I": {setcurrentFilt(FilterId.substring(1)+"_Институт"); break;}
      case "S": {
        if(FilterId[1]!=="") {setcurrentFilt(FilterId.substring(1)+"_Направление"); break;}
        else {setcurrentFilt(currInstId+"_Институт"); break;}
      }
      case "G": {
        if(FilterId[1]!=="") {setcurrentFilt(FilterId.substring(1)+"_Группа"); break;}
        else {setcurrentFilt(currStreamId+"_Направление"); break;}
      }
      default: 
        setcurrSubStr(FilterId);
    } 
  }
  
  useEffect(async () => {
        async function fetchData() {
        let div = currentFilt.indexOf("_");
        let JSON=await GetStudents(currSubStr, currentFilt.slice(0, div), currentFilt.substring(div+1), currentStatus);
        setStudents(JSON);
    };
    await fetchData();
  }, [currSubStr, currentFilt, currentStatus]);
  
  
  
  if(Students==[]) {
    return <div />
  };
  
  return (
      <div>
        <div className="List-Column">
          <button className="Button" onClick={function(){Active ? setActive(false) : setActive(true);}}>Фильтры</button>
            <div id="filters" hidden={Active} style={{'border': '1px solid blue', 'borderRadius': '20px'}}>
                <div className="List-String">
                  <select className="Select" id="Institute" onChange={ChangeInstitute}>
                    <option selected="selected" value="I">Институт...</option>
                    {Institute!=[] && Institute.map(Institute => (
                      <option key={"Institute"+Institute.instituteId} value={"I"+Institute.instituteId}>
                        {Institute.instituteFullName}
                      </option>
                    ))}
                  </select>
                  <select className="Select" id="Stream" onChange={ChangeStream}>
                    <option selected="selected" value="S">Направление...</option>
                    {Stream!=[] && Stream.map(Stream => (
                      <option key={"Stream"+Stream.streamId} value={"S"+Stream.streamId}>
                        {Stream.streamName}
                      </option>
                    ))}
                  </select>
                  <select className="Select" id="Group" onChange={ChangeFilter}>
                    <option key="0" selected="selected" value="G">Группа...</option>
                    {Group!=[] && Group.map(Group => (
                      <option key={"Group"+Group.groupId} value={"G"+Group.groupId}>
                        {Group.groupName}
                      </option>
                    ))}
                  </select>
                </div>
                <select className="Select" id="Status" onChange={ChangeFilter}>
                  <option key="0" selected="selected" value="t">Статус...</option>
                  {Status!=[] && Status.map(Status => (
                    <option key={"Status"+Status.statusActiveUserId} value={"t"+Status.statusActiveUserId}>
                      {Status.statusActiveUserName}
                    </option>
                  ))}
                </select>
                <input type="text" className="Input" id="lastName" placeholder="Фамилия" onBlur={ChangeFilter} />
              </div>
        </div>      
        <br />
        
        
          {Students.map(Students => (
            <div id={"jija"+Students.studentId} className="List-String">
              <button id={Students.studentId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(Students.studentId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(Students.studentId, 'white')}}>
                <a href={'http://localhost:3000/student/'+Students.studentId} style={{'display': 'flex', 'alignItems': 'center', 'textDecoration': 'none'}}>
                  <img src={"data:image/"+Students.format+";base64,"+atob(Students.data)} height="64px" alt="" style={{'alignItems': 'center', 'margin-right': '1vw', 'borderRadius': '32px'}}/>
                  {Students.firstName} {Students.lastName}
                </a>
              </button>
            </div>  
            ))}
    </div>
    );
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
    //event.target.style.background
}

export default App;