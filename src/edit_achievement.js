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
import {GetAchievement} from "./fetch.js";
import {EditAchievement} from "./fetch.js";

function App() {
  let params = useParams();
  let Id=params.id;
  
  const [UploadError, setUploadError] = useState("Во время загрузки произошла ошибка. Попробуйте ещё раз.");
  const [Achievement, setAchievement] = useState([]);
  
  let achieveIcon="";
  if(Achievement.length==0) achieveIcon="";
  else achieveIcon="data:image/"+Achievement.file.format+";base64,"+atob(Achievement.file.data);
  
  useEffect(async () => {
      async function fetchData(Id) {
        let JSON=await GetAchievement(Id);
        console.log(JSON);
        setAchievement(JSON);
        //console.log(Achievement);
        };
    await fetchData(Id);
    }, []);
  
  return(
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="Header">Редактирование достижения</p>
        <div>
          <div className="List-Element-Borderless">
            <p className="Name">Название</p>
            <input id="achieveName" className="Input" type="text" placeholder="Достижение" defaultValue={Achievement.achieveName}/>
          </div>
          <p className="Name">
            Описание
            <TextareaAutosize id="achieveDescription" className="Input" placeholder="Описание" defaultValue={Achievement.description} />
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
            <input className="Button" id="achieveStartDate" type="date" defaultValue={Achievement.startDate} />
          </div>
          <div>
            <p className="Name">Дата, до которой можно получить достижение</p>
            <input className="Button" id="achieveEndDate" type="date" />
            <div className="List-Element-Borderless">
              <input style={{'margin-left': '1.5vw'}} type="checkbox" id="noEndDate" defaultValue={Achievement.endDate}/>
              <div className="Comment">Без ограничения</div>
            </div>
          </div>
          <div className="Name">
          <p>Иконка</p>
            <input className="Button" type="file" onChange={function(){FileChange()}} id='icon' /> 
            <br />
            <p hidden={true} className="Error-text" id="filetype_error">В качестве иконки должна использоваться картинка!</p>
          </div>
          <img src={achieveIcon} alt="" height="500vh" id="preview" />
          <p hidden={true} className="Error-text" id="empty">Необходимо заполнить все поля!</p>
          <p hidden={true} className="Error-text" id="upload_error">{UploadError}</p>
          <p><button className="Button" onClick={function(){Edit(setUploadError, Achievement, Id)}}>Изменить достижение</button></p>
        </div>
      </div>
    </div>
  )
}

async function Edit(setUploadError, oldData, Id) {
    document.getElementById("empty").hidden=true;
    let tmp={};
    if(document.getElementById("achieveName").value==""){document.getElementById("empty").hidden=false; return;}
    if(document.getElementById("achieveDescription").value==""){document.getElementById("empty").hidden=false; return;}
    if(document.getElementById("icon").value==""){document.getElementById("empty").hidden=false; return;}
    
    
    if(oldData.description!=document.getElementById("achieveDescription").value) tmp["achieveDescription"]=document.getElementById("achieveDescription").value;
    if(oldData.achieveName!=document.getElementById("achieveName").value) tmp["achieveName"]=document.getElementById("achieveName").value;
    if(oldData.description!=document.getElementById("rewardId").value) tmp["rewardId"]=document.getElementById("rewardId").value;
    if(oldData.category.categoryId!=document.getElementById("categoryId").value) tmp["categoryId"]=document.getElementById("categoryId").value;
    if(oldData.description!=document.getElementById("statusActiveId").value) tmp["statusActiveId"]=document.getElementById("statusActiveId").value;
    
    
    if(document.getElementById("noEndDate").checked) {if(oldData.endDate!=null) tmp["achieveEndDate"]="";}
    else{    
      if(document.getElementById("achieveEndDate").value=="") {if(oldData.endDate!=null) document.getElementById("empty").hidden=false; return;}         
      else tmp["achieveEndDate"]=document.getElementById("achieveEndDate").value;
    }
    tmp["achieveStartDate"]=document.getElementById("achieveStartDate").value; 
    let file=document.getElementById('icon');
    file=file.files[0];
    let format=file.type;
    format=format.split('/');
    format=format[1];
    tmp["format"]=format;
    let data=document.getElementById('preview').src;
    data=data.split(',');
    tmp["photo"]=btoa(data[1]);
    let request = await EditAchievement(Id, tmp);
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