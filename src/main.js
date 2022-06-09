import Sidebar from "./sidebar.js";
import "./App.css"
import React, { useState, useEffect } from 'react';

import {GetRewardsList} from "./fetch.js";
import {GetStudents} from "./fetch.js";
import {GetAchievementsProofList} from "./fetch.js";
import {GetAchievementsList} from "./fetch.js";
import {GetErrorMessages} from "./fetch.js";

function App() {  
  let role=localStorage.getItem("userRole");
  const [ProofsNumber, setProofsNumber] = useState(0);
  const [ErrorsNumber, setErrorsNumber] = useState(0);
  const [CreatesNumber, setCreatesNumber] = useState(0);
  
  return (
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-top-part">
      {role=="Администратор" && //Достижения
        <div>
          <button className="Header-Main"><a href="http://localhost:3000/achievements" className="Header-Black">Достижения</a></button>
          <Achievements />
        </div>
      }
      {role=="Модератор" && //Получение достижений
        <div>
          <button className="Header-Main"><a href="http://localhost:3000/achievements/proof" className="Header-Black">Получение достижений ({ProofsNumber})</a></button>
          <Proofs setProofsNumber={setProofsNumber} />
        </div>
      }
      </div>
      <div className="App-main-square">
      {role=="Администратор" && //Награды
        <div className="App-main-square-content">
          <button className="Header-Main"><a href="http://localhost:3000/rewards" className="Header-Orange">Награды</a></button>
          <Rewards />
        </div>
      } 
      {role=="Модератор" && //Студенты
        <div className="App-main-square-content">
          <button className="Header-Main"><a href="http://localhost:3000/students" className="Header-Orange">Студенты</a></button>
          <Students />
        </div>
      } 
      </div>
      <div className="App-main-long">
      {role=="Администратор" && //Поддержка
        <div>
          <button className="Header-Main"><a href="http://localhost:3000/support" className="Header-Blue">Поддержка ({ErrorsNumber})</a></button>
          <Support setErrorsNumber={setErrorsNumber} />
        </div>
      }
      {role=="Модератор" && //Создание достижений
        <div>
          <button className="Header-Main"><a href="http://localhost:3000/achievements" className="Header-Blue">Создание достижений ({CreatesNumber})</a></button>
          <Creates setCreatesNumber={setCreatesNumber} />
        </div>
      }
      </div>
    </div>
  );
}

//Sells
function Rewards() {
  const [Rewards, setRewards] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await getRewards();
        setRewards(JSON);
    };
    await fetchData();
  }, []); 

  if(Rewards=="") {
    return <div />
  };
  
  return(
    <div>
      {Rewards.map(Rewards => (
        <button id={Rewards.rewardId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(Rewards.rewardId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(Rewards.rewardId, 'white')}}>
          <img src={"data:image/"+Rewards.format+";base64,"+atob(Rewards.data)} height="64px"/>
          {Rewards.rewardName}
        </button>
      ))}
    </div>
  );
}

function Students() {
  const [students, setStudents] = useState([]);
  useEffect(async () => {
    async function fetchData() {
    let JSON=await getStudents();
    setStudents(JSON);
  };
    await fetchData();
  }, []);
  
  if(students==""){
      return <div />
  }
  
  return(
    <div>
      {students.map(students => (
        <button id={students.studentId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(students.studentId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(students.studentId, 'white')}}>
          <a href={'http://localhost:3000/student/'+students.studentId} style={{'display': 'flex', 'alignItems': 'center', 'textDecoration': 'none'}}>
            <img src={"data:image/"+students.format+";base64,"+atob(students.data)} height="64px" alt="" style={{'alignItems': 'center', 'margin-right': '1vw', 'borderRadius': '32px'}}/>
            <div style={{'display': 'flex', 'flex-direction': 'column', 'flex-wrap': 'wrap'}}>
              <div>{students.firstName} {students.lastName}</div>
              <div>{students.groupName}</div>
            </div>
          </a>
        </button>
      ))}
    </div>
  );
}

function Proofs(props) {
  const [proofs, setProofs] = useState([]);
  useEffect(async () => {
    async function fetchData() {
    let JSON=await getAchievementProofs(props.setProofsNumber);
    setProofs(JSON);
  };
    await fetchData();
  }, []);
  
  if(proofs==""){
      return <div className="Name">Нет новых заявок</div>;
  }
  return(
    <div>
      {proofs.map(proofs => (
        <button id={proofs.proofId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(proofs.proofId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(proofs.proofId, 'white')}}>
          <a href={'http://localhost:3000/achievements/proof/'+proofs.proofId} style={{'display': 'flex', 'alignItems': 'center', 'textDecoration': 'none'}}>
            <div style={{'display': 'flex', 'flex-direction': 'row', 'flex-wrap': 'wrap'}}>  
              <img src={"data:image/"+proofs.achievement.format+";base64,"+atob(proofs.achievement.data)} height="100px" alt="Изображение достижения" style={{'alignItems': 'center', 'margin-right': '1vw', 'borderRadius': '32px'}}/>
            </div>
            <div style={{'display': 'flex', 'flex-direction': 'column', 'flex-wrap': 'wrap'}}>  
              <div style={{'display': 'flex', 'flex-direction': 'row', 'flex-wrap': 'wrap'}}>
                <div>{proofs.user.firstName} {proofs.user.lastName}</div>
                <div style={{'color': '#888888', "marginLeft": "2.5vw", 'fontSize': '2vh'}}>{proofs.dateProof}</div>
              </div>
              {proofs.achievement.achieveName}
            </div>  
          </a>
        </button>
      ))}
    </div>
  );
}

function Creates(props) {
  const [creates, setCreates] = useState([]);
  useEffect(async () => {
    async function fetchData() {
    let JSON=await getAchievementCreateRequests(props.setCreatesNumber);
    setCreates(JSON);
  };
    await fetchData();
  }, []);
  
  if(creates==""){
      return <div className="Name">Нет новых заявок</div>;
  }
  /*console.log(creates.length);
  console.log(creates);*/
  return(
    <div>
      {creates.map(creates => (
        <button id={creates.achieveId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(creates.achieveId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(creates.achieveId, 'white')}}>
          <a href={'http://localhost:3000/achievements/'+creates.achieveId} style={{'display': 'flex', 'alignItems': 'center', 'textDecoration': 'none'}}>
            <div style={{'display': 'flex', 'flex-direction': 'row', 'flex-wrap': 'wrap'}}>  
              <div style={{'display': 'flex', 'flex-direction': 'column', 'flex-wrap': 'wrap', 'marginLeft': '0.5vw'}}>
                <div style={{'display': 'flex', 'flex-direction': 'row', 'flex-wrap': 'wrap', 'justifyContent': 'center'}}>    
                  <img src={"data:image/"+creates.file.format+";base64,"+atob(creates.file.data)} height="100px" alt="Изображение достижения" style={{'alignItems': 'center', 'margin-right': '1vw', 'borderRadius': '32px'}}/>
                </div>
                <div style={{'color': '#888888', 'fontSize': '2vh', 'display': 'flex', 'flexWrap': 'wrap'}}>{creates.creator.firstName} {creates.creator.lastName}</div>
              </div>
              <div style={{'display': 'flex', 'flex-direction': 'column', 'flex-wrap': 'wrap'}}>
                <div style={{'display': 'flex', 'flexWrap': 'wrap'}}>{creates.achieveName}</div>
                <div style={{'fontSize': '2vh'}}>
                  <div style={{'color': '#ffa474', 'display': 'flex', 'flexWrap': 'wrap'}}>Описание</div>
                  <div style={{'display': 'flex', 'flexWrap': 'wrap'}}>{creates.description}</div>
                  <div style={{'color': '#819ae5', 'display': 'flex', 'flexWrap': 'wrap'}}>Награда</div>
                  <div style={{'display': 'flex', 'flexWrap': 'wrap'}}>{creates.reward.rewardName}</div>
                </div>
              </div>
            </div>  
          </a>
        </button>
      ))}
    </div>
  );
}

function Achievements() {
  const [Achieves, setAchieves] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await getAchievements();
        setAchieves(JSON);
    };
    await fetchData();
  }, []); 

  if(Achieves=="") {
    return <div />
  };
  
  return(
    <div>
      {Achieves.map(Achieves => (
        <button id={Achieves.achieveId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(Achieves.achieveId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(Achieves.achieveId, 'white')}}>
          <a href={'http://localhost:3000/achievements/'+Achieves.achieveId} style={{'display': 'flex', 'alignItems': 'center', 'textDecoration': 'none'}}>
            <div style={{'display': 'flex', 'flex-direction': 'row', 'flex-wrap': 'wrap'}}>  
              <img src={"data:image/"+Achieves.file.format+";base64,"+atob(Achieves.file.data)} height="100px" alt="Изображение достижения" style={{'alignItems': 'center', 'margin-right': '1vw', 'borderRadius': '32px'}}/>
              <div style={{'display': 'flex', 'flex-direction': 'column', 'flex-wrap': 'wrap'}}>
                <div style={{'display': 'flex', 'flexWrap': 'wrap'}}>{Achieves.achieveName}</div>
                <div style={{'fontSize': '2vh'}}>
                  <div style={{'color': '#ffa474', 'display': 'flex', 'flexWrap': 'wrap'}}>Описание</div>
                  <div style={{'display': 'flex', 'flexWrap': 'wrap'}}>{Achieves.description}</div>
                  <div style={{'color': '#819ae5', 'display': 'flex', 'flexWrap': 'wrap'}}>Награда</div>
                  <div style={{'display': 'flex', 'flexWrap': 'wrap'}}>{Achieves.reward.rewardName}</div>
                </div>
              </div>
            </div>  
          </a>
        </button>
      ))}
    </div>
  );
}

function Support(props) {
  const [errors, setErrors] = useState([]);
  useEffect(async () => {
    async function fetchData() {
    let JSON=await getErrorMessages(props.setErrorsNumber);
    setErrors(JSON);
  };
    await fetchData();
  }, []);
  
  if(errors==""){
      return <div className="Name">Нет новых сообщений об ошибках</div>;
  }
  
  return(
    <div>
      {errors.map(errors => (
      <button id={errors.errorId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(errors.errorId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(errors.errorId, 'white')}}>
        <a href={"http://localhost:3000/error-message/"+errors.errorId} style={{'textDecoration': 'none'}} key={errors.errorId}>  
          
          <div style={{'display': 'flex', 'flexDirection': 'column', 'flexWrap': 'wrap'}}>  
            <div style={{'display': 'flex', 'flexDirection': 'row', 'flexWrap': 'wrap'}}>
              <div>{errors.user.firstName} {errors.user.lastName}</div>
              <div style={{'color': '#888888', "marginLeft": "2.5vw", 'fontSize': '2vh'}}>{errors.messageErrorDate}</div>
            </div>
            <div style={{'display': 'flex', 'flexWrap': 'wrap'}}>{errors.theme}</div>
          </div>
        </a>  
      </button>
      ))}
    </div>
  );
}

//Get-functions
async function getRewards() {
  let rewards=[];  
  let json = await GetRewardsList();
  let j=0;
  for(let i=json.length-1; j<3; i--){
    rewards[j]=json[i];
    j++;
  }
  return rewards;
}

async function getStudents() {
  let students=[];  
  let json = await GetStudents();
  let j=0;
  for(let i=json.length-1; j<3; i--){
    students[j]=json[i];
    j++;
  }
  return students;
}

async function getAchievementProofs(setProofsNumber) {
  let achievements=[];  
  let json = await GetAchievementsProofList(4);
  if(json.length==0) return "";
  console.log(json);
  setProofsNumber(json.length);
  let j=0;
  if(json.length>3){
    for(let i=json.length-1; j<3; i--){
      achievements[j]=json[i];
      j++;
    }
  }
  else return json;
  return achievements;
}

async function getAchievementCreateRequests(setCreatesNumber) {
  let achievements=[];  
  let json = await GetAchievementsList(1);
  if(json.length==0) return "";
  setCreatesNumber(json.length);
  
  let j=0;
  if(json.length>3){
    for(let i=json.length-1; j<3; i--){
      achievements[j]=json[i];
      j++;
    }
  }
  else return json;
  return achievements;
}

async function getAchievements() {
  let achievements=[];  
  let json = await GetAchievementsList();
  
  let j=0;
  for(let i=json.length-1; j<3; i--){
    achievements[j]=json[i];
    j++;
  }
  return achievements;
}

async function getErrorMessages(setErrorsNumber) {
  let errors=[];  
  let json = await GetErrorMessages(4);
  if(json.length==0) return "";
  setErrorsNumber(json.length);
  
  let j=0;
  if(json.length>8){
    for(let i=json.length-1; j<8; i--){
      errors[j]=json[i];
      j++;
    }
  }
  else return json;
  return errors;
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
}

export default App;