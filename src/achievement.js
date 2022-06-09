import Sidebar from "./sidebar.js";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './App.css';

import {GetAchievement} from "./fetch.js";
import {GetAchievementStatusList} from "./fetch.js";
import {ChangeStatusAchieve} from "./fetch.js";


function App() {
  let params = useParams();
  let Id=params.id;
  return(
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="Header">Достижение</p>
        <Achievement id={Id} />
      </div>
    </div>
  )
}

function Achievement(props) {
  const [Achievement, setAchievement] = useState({achieveId: "", achieveName: "", category: {Id: "", Name: "", file: {format: "", data: ""}}, creator: {id: "", firstName: "", lastName: "",  statusUser: ""}, description: "", endDate: "", file: {format: "", data: ""}, reward: {file: {format: "", data: ""}, id: "", Name: ""}, startDate: "", statusActive: ""});
  const [UploadError, setUploadError] = useState("Во время загрузки произошла ошибка. Попробуйте ещё раз.");
  
  let Id=props.id;
  
  useEffect(async () => {
      async function fetchData(Id) {
        let JSON=await GetAchievement(Id);
        console.log(JSON);
        setAchievement(JSON);
        console.log(Achievement);
        };
    await fetchData(Id);
    }, []);
    
  return (
    <div className="List-Column">
      <div className="List-String">
        <div className="List-Column">
          <p className="Name">{Achievement.achieveName}</p>
          <img src={"data:image/"+Achievement.file.format+";base64,"+atob(Achievement.file.data)} height="500vh" alt="Изображение достижения"/>
        </div>
        <div className="List-Column">
          <p className="Name" style={{'fontSize': '2.5vh'}}>Категория: <img src={"data:image/"+Achievement.category.file.format+";base64,"+atob(Achievement.category.file.data)} height="64px" width={String(64*Achievement.category.file.data.width/Achievement.category.file.data.height)+"px"} alt=""/> {Achievement.category.categoryName}</p>
          <p className="Name" style={{'fontSize': '2.5vh'}}>Описание: {Achievement.description}</p>
          <p className="Name" style={{'fontSize': '2.5vh'}}>Срок действия: {Achievement.startDate} - {Achievement.endDate}</p>
          <p className="Name" style={{'fontSize': '2.5vh'}}>Награда: <img src={"data:image/"+Achievement.reward.file.format+";base64,"+atob(Achievement.reward.file.data)} height="64px" width={String(64*Achievement.reward.file.data.width/Achievement.reward.file.data.height)+"px"} alt=""/>{Achievement.reward.rewardName}</p>
          <p className="Name" style={{'fontSize': '2.5vh'}}>Автор: <a href={"http://localhost:3000/profile/"+Achievement.creator.id}>{Achievement.creator.firstName} {Achievement.creator.lastName}</a></p>
        </div>
      </div>
      <p className="Name" style={{'fontSize': '2.5vh'}}>
        Статус: {Achievement.statusActive}
        <StatusList id={Id} setUploadError={setUploadError} />
      </p>
      <p hidden={true} className="Error-text" id="upload_error">{UploadError}</p>
    </div> 
  )
}

function StatusList(props) {
  const [Statuses, setStatuses] = useState([]);
  let Id=props.id;

  if (Statuses.length===0) {
    return <button className="Button" onClick={ChangeStatus}>Изменить статус</button>
  };

  async function ChangeStatus() {
    async function fetchData() {
        let JSON=await GetStatusList();
        console.log(JSON);
        setStatuses(JSON);
      };
    await fetchData();
  }

  return (
  <div>
    <button className="Button" onClick={ChangeStatus}>Изменить статус</button>
    <select className="Select" id="NewAchieveStatus">
      {Statuses.map(Statuses => (
        <option key={Statuses.statusActiveId}>
          {Statuses.statusActiveName}
        </option>
      ))}
    </select>
    <button className="Button" onClick={function () {UpdateStatus(Id, props.setUploadError)}} id="UpdateStatus">Обновить статус</button>
  </div>
  );
}

async function GetStatusList (){
  let json = await GetAchievementStatusList();
  //console.log(json);
  //json.splice(3, 1);
  //console.log(json);
  return json;
}

async function UpdateStatus(Id, setUploadError) {
  document.getElementById("upload_error").hidden = true;
  let statusId = document.getElementById("NewAchieveStatus").value;
  
  switch(statusId) {
      case "Не подтверждено": statusId=1; break;
      case "Не активно": statusId=2; break;
      case "Активно": statusId=3; break;
      case "Устарело": statusId=4; break;
      case "Одобрено": statusId=5; break;
      case "Отклонено": statusId=6; break;
  }
  
  
  let request = await ChangeStatusAchieve(Id, statusId);
  if(request.status==200) {
    window.location.assign("http://localhost:3000/achievements/");;
  }
  else {
    setUploadError(request.message);  
    document.getElementById("upload_error").hidden=false;
  }
}

export default App;