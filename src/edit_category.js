import Sidebar from "./sidebar.js";
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import ReactDOM from 'react-dom'
import './App.css';
import './Main.css';

import {EditCategory} from "./fetch.js";
import {GetCategory} from "./fetch.js";

function App() {
  let params = useParams();
  let Id=params.id;
  
  const [UploadError, setUploadError] = useState("Во время загрузки произошла ошибка. Попробуйте ещё раз.");
  const [Category, setCategory] = useState([]);
  useEffect(async () => {
        async function fetchData(Id) {
        let JSON=await GetCategory(Id);
        setCategory(JSON);
        };
    await fetchData(Id);
    }, []);
  
  let categoryIcon="";
  if(Category.length==0) categoryIcon="";
  else categoryIcon="data:image/"+Category.format+";base64,"+atob(Category.data);
  
  return(
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="Header">Изменение категории</p>
        <p className="Name">
          Категория
          <input className="Input" id="name" type="text" placeholder="Категория" defaultValue={Category.categoryName} />
          <p hidden={true} className="Error-text" id="no_name">Введите название категории!</p>
        </p>
        <div>
          <p className="Name">Загрузить иконку</p>
          <p className="Comment">(оптимальный размер - 64x64, тип файла - png)</p>
          <input className="Button" type="file" onChange={function(){FileChange(categoryIcon, setUploadError)}} id='icon' /> 
          <br />
          <img src={categoryIcon} height="64px" alt="" id="preview" />
          <p>
            <button className="Button" onClick={function(){Clear(Category.categoryName, categoryIcon)}}>
              Сбросить
            </button>
          </p>
          <p hidden={true} className="Error-text" id="upload_error">{UploadError}</p>
          <p hidden={true} className="Error-text" id="filetype_error">В качестве иконки должна использоваться картинка.</p>
          <p hidden={true} className="Error-text" id="no_file">Выберите иконку категории!</p>
        </div>
        <p><button hidden={false} id="edit_button" className="Button" onClick={function(){Edit(categoryIcon, Category.categoryName, Id, setUploadError)}}>Изменить категорию</button></p> 
      </div>
    </div>
  )
}

function Clear(name, src){
  document.getElementById("name").value=name;
  document.getElementById("preview").src=src;
  document.getElementById("icon").value=null;
}

async function Edit(icon, name, id, setUploadError) {
    document.getElementById("no_name").hidden=true;
    document.getElementById("no_file").hidden=true;
    document.getElementById("filetype_error").hidden=true;
    document.getElementById("upload_error").hidden=true;

    let tmp = {};
    if(document.getElementById("name").value=="") {document.getElementById("no_name").hidden=false; return;}
    if(document.getElementById("name").value!=name) tmp["categoryName"]=document.getElementById("name").value;
    let file=document.getElementById('icon');
    file=file.files[0];
    if(file) {let format=file.type;
      format=format.split('/');
      format=format[1];
      
      let data=document.getElementById('preview').src;
      if(data!=icon){
        data=data.split(',');
        tmp["format"]=format;
        tmp["data"]=btoa(data[1]);
      }
    }
    else if(document.getElementById('preview').src="") {document.getElementById("no_file").hidden=false; return;}
    if(tmp == {}) window.location.assign("http://localhost:3000/categories/");
     
    let request = await EditCategory(id, tmp);
    if(request.status=200) {
      window.location.assign("http://localhost:3000/categories/");
    }
    else {
      setUploadError(request.message);  
      document.getElementById("upload_error").hidden=false;
    }
}

function FileChange(src, setUploadError) {
    let file=document.getElementById('icon');
    file=file.files[0];
    let type=file.type;
    type=type.split('/');
    if(type[0]!="image"){
      document.getElementById("filetype_error").hidden=false;
      document.getElementById('icon').value="";
      document.getElementById("preview").src="";
      setTimeout('document.getElementById("filetype_error").hidden=true;', 6000);
    }
    let reader=new FileReader();
    
    
    reader.addEventListener("load", function() {
      let picture=reader.result;
      if(type[0]=="image") document.getElementById('preview').src = reader.result;
    }, false);
  
    reader.addEventListener("error", function() {
      setUploadError("Во время загрузки произошла ошибка. Попробуйте ещё раз.");
      document.getElementById("upload_error").hidden=false;
      setTimeout('document.getElementById("upload_error").hidden=true;', 6000);
    });

    if (file) {
      reader.readAsDataURL(file);
    }
}

export default App;