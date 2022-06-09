import Sidebar from "./sidebar.js";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import ReactDOM from 'react-dom'
import './App.css';
import './Main.css';
import TextareaAutosize from 'react-textarea-autosize';
import {GetRewardsList} from "./fetch.js";
import {GetCategoriesList} from "./fetch.js";
import {GetAchievementStatusList} from "./fetch.js";
import {CreateAchievement} from "./fetch.js";

function App() {
  return(
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="Header">Создание достижения</p>
        <CreateAchievementPage />
      </div>
    </div>
  )
}

function CreateAchievementPage() {
  const [UploadError, setUploadError] = useState("Во время загрузки произошла ошибка. Попробуйте ещё раз.");
  let today = new Date();
  let Day=today.getDate();
  let Month=today.getMonth()+1;
  let Year=today.getFullYear();
  if (Month<10) Month="0"+Month;
  if (Day<10) Day="0"+Day;
  today=Year+"-"+Month+"-"+Day;
  return (
    <div>
      <div className="List-Element-Borderless">
        <p className="Name">Название</p>
        <input id="achieveName" className="Input" type="text" placeholder="Достижение" />
      </div>
      <p className="Name">
        Описание
        <TextareaAutosize id="achieveDescription" className="Input" placeholder="Описание" />
      </p>
      <p className="Name">
        Балл за выполнение
        <input id="achieveScore" className="Input" type="number" placeholder="Балл за выполнение" />
      </p>
      <p className="Name">
        Награда
        <RewardsListView />
      </p>
      <p className="Name">
        Категория
        <CategoriesListView />
      </p>
      <p className="Name">
        Статус
        <StatusesListView />
      </p>
      <div>
        <p className="Name">Дата, начиная с которой можно получить достижение</p>
        <input className="Button" id="achieveStartDate" type="date" defaultValue={today} />
      </div>
      <div>
        <p className="Name">Дата, до которой можно получить достижение</p>
        <input className="Button" id="achieveEndDate" type="date" />
        <div className="List-Element-Borderless">
          <input style={{'margin-left': '1.5vw'}} type="checkbox" id="noEndDate"/>
          <div className="Comment">Без ограничения</div>
        </div>
      </div>
      <div className="Name">
      <p>Иконка</p>
        <input className="Button" type="file" onChange={function(){FileChange()}} id='icon' /> 
        <br />
        <p hidden={true} className="Error-text" id="filetype_error">В качестве иконки должна использоваться картинка!</p>
      </div>
      <img src="" alt="" height="500vh" id="preview" />
      <p hidden={true} className="Error-text" id="empty">Необходимо заполнить все поля!</p>
      <p hidden={true} className="Error-text" id="upload_error">{UploadError}</p>
      <p><button className="Button" onClick={function(){Create(setUploadError)}}>Создать достижение</button></p>
    </div>  
  )
}

async function Create(setUploadError) {
    document.getElementById("empty").hidden=true;
    let tmp={};
    if(document.getElementById("achieveName").value==""){document.getElementById("empty").hidden=false; return;}
    tmp["achieveName"]=document.getElementById("achieveName").value;
    if(document.getElementById("achieveDescription").value==""){document.getElementById("empty").hidden=false; return;}
    tmp["achieveDescription"]=document.getElementById("achieveDescription").value;
    if(document.getElementById("achieveScore").value==""){document.getElementById("empty").hidden=false; return;}
    tmp["achieveScore"]=document.getElementById("achieveScore").value;
    tmp["rewardId"]=document.getElementById("rewardId").value;
    tmp["categoryId"]=document.getElementById("categoryId").value;
    tmp["statusActiveId"]=document.getElementById("statusActiveId").value;
    if(document.getElementById("noEndDate").checked) tmp["achieveEndDate"]="";
    else{    
      if(document.getElementById("achieveEndDate").value=="") {document.getElementById("empty").hidden=false; return;}         
      else tmp["achieveEndDate"]=document.getElementById("achieveEndDate").value;
    }
    tmp["achieveStartDate"]=document.getElementById("achieveStartDate").value;
    if(document.getElementById("icon").value==""){document.getElementById("empty").hidden=false; return;}
    let file=document.getElementById('icon');
    file=file.files[0];
    let format=file.type;
    format=format.split('/');
    format=format[1];
    tmp["format"]=format;
    let data=document.getElementById('preview').src;
    data=data.split(',');
    tmp["photo"]=btoa(data[1]);
    let request = await CreateAchievement(tmp);
    if(request.status==200) {window.location.assign("http://localhost:3000/achievements/")}
    else {
      setUploadError(request.message);  
      document.getElementById("upload_error").hidden=false;
    }
}

function FileChange() {
    let file=document.getElementById('icon');
    file=file.files[0];
    if(file=="") {document.getElementById('preview').src = ""; return;}
    let type=file.type;
    type=type.split('/');
    if(type[0]!="image"){
      document.getElementById("filetype_error").hidden=false;
      setTimeout('document.getElementById("filetype_error").hidden=true;', 6000);
    }
    let reader=new FileReader();
    reader.addEventListener("load", function() {
      let picture=reader.result;
      document.getElementById('preview').src = reader.result;
    }, false);
    reader.addEventListener("error", function() {
      document.getElementById("upload_error").hidden=false;
      setTimeout('document.getElementById("upload_error").hidden=true;', 6000);
    });

    if (file) {
      reader.readAsDataURL(file);
    }
    return;
}

function RewardsListView() {
  const [Rewards, setRewards] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await GetRewardsList();
        setRewards(JSON);
    };
    await fetchData();
  }, []); 
  
  if(Rewards===[]) {
    return <div />
  };

  return (
    <select id="rewardId" className="Select">
      {Rewards.map(Rewards => (
      <option id={Rewards.rewardId} key={Rewards.rewardId} value={Rewards.rewardId}>
        {Rewards.rewardName}
      </option>))}
    </select>
  );
}

function CategoriesListView() {
  const [Categories, setCategories] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await GetCategoriesList();
        setCategories(JSON);
    };
    await fetchData();
  }, []); 
  
  if(Categories===[]) {
    return <div />
  };

  return (
    <select id="categoryId" className="Select">
      {Categories.map(Categories => (
      <option id={Categories.categoryId} key={Categories.categoryId} value={Categories.categoryId}>
        {Categories.categoryName}
      </option>))}
    </select>
  );
}

function StatusesListView() {
  const [Statuses, setStatuses] = useState([]);
  useEffect(async () => {
        async function fetchData() {
        let JSON=await GetAchievementStatusList();
        setStatuses(JSON);
    };
    await fetchData();
  }, []); 
  
  if(Statuses===[]) {
    return <div />
  };

  return (
    <select id="statusActiveId" className="Select">
      {Statuses.map(Statuses => (
      <option id={Statuses.statusActiveId} key={Statuses.statusActiveId} value={Statuses.statusActiveId}>
        {Statuses.statusActiveName}
      </option>))}
    </select>
  );
}

export default App;