import Sidebar from "./sidebar.js";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import ReactDOM from 'react-dom'
import './App.css';

import {CreateReward} from "./fetch.js";


function App() {
  return(
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="Header">Создание награды</p>
        <CreateRewardPage />
      </div>
    </div>
  )
}

function CreateRewardPage() { 
  let rewardIcon="";
  return (
    <div>
      <p className="Name">
        Награда
        <input className="Input" id="name" type="text" placeholder="Награда" />
        <p hidden={true} className="Error-text" id="no_name">Введите название награды!</p>
      </p>
      <div>
      <p className="Name">Загрузить иконку</p>
      <p className="Comment">(оптимальный размер - 64x64, тип файла - png)</p>
      
      <input type="file" className="Button" onChange={function(){FileChange()}} id='icon' /> 
      <br />
      <img src={rewardIcon} height="64" alt="" id="preview" />
     
      <p hidden={true} className="Error-text" id="upload_error">Ошибка загрузки. Попробуйте ещё раз.</p>
      <p hidden={true} className="Error-text" id="filetype_error">В качестве иконки должна использоваться картинка.</p>
      <p hidden={true} className="Error-text" id="no_file">Выберите иконку награды!</p>
      </div>
      <p><button hidden={false} id="create_button" className="Button" onClick={function(){Create()}}>Создать награду</button></p>
    </div>  
  )
}

async function Create() {
    document.getElementById("no_name").hidden=true;
    document.getElementById("no_file").hidden=true;
    
    
    let tmp={};
    if(document.getElementById("name").value=="") {document.getElementById("no_name").hidden=false; return;}
    else tmp["rewardName"]=document.getElementById("name").value;
    let file=document.getElementById('icon');
    file=file.files[0];
    if(file) {let format=file.type;
      format=format.split('/');
      format=format[1];
      
      let data=document.getElementById('preview').src;
      data=data.split(',');
      tmp["format"]=format;
      tmp["data"]=btoa(data[1]);
    }
    else {document.getElementById("no_file").hidden=false; return;}
        
    let request = await CreateReward(tmp);
    if(request.ok) {
      window.location.assign("http://localhost:3000/rewards/");
    }
    else {
      document.getElementById("upload_error").hidden=false;
      setTimeout('document.getElementById("upload_error").hidden=true;', 6000);
    }
}

function FileChange() {
    document.getElementById("no_file").hidden=true;
    let file=document.getElementById('icon');
    file=file.files[0];
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
}

export default App;