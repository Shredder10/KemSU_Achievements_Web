import Sidebar from "./sidebar.js";
import './Main.css';
import { useState, useEffect, React } from 'react';
import AddIcon from "./drawable/ic_plus.png";
import EditIcon from "./drawable/ic_edit.png";
import DeleteIcon from "./drawable/ic_drop.png";

import {GetCategoriesList} from "./fetch.js";
import {DeleteCategory} from "./fetch.js";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="List-Element-Borderless">
          <p className="Header">Категории</p>
          <a href="http://localhost:3000/category-create/">
            {localStorage.getItem("userRole")=='Администратор' &&
            <button id="addCategoryButton" className="List-Element" onMouseOver={function(){ChangeBackgroundColor("addCategoryButton", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("addCategoryButton", 'white')}}>
              <img src={AddIcon} alt="Добавить награду" />
            </button>}
          </a>
        </p>
        <CategoriesListView />
      </div>
    </div>
  )
}

function CategoriesListView() {
    
  const [ModalActive, setModalActive] = useState(false);
  const [DeletingCategoryId, setDeletingCategoryId] = useState(0);
  const [DeletingCategoryName, setDeletingCategoryName] = useState(0);
  
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
      <div>
        <div className="List-Column">
          {Categories.map(Categories => (
            <div id={"jija"+Categories.categoryId} className="List-String">
              <button id={Categories.categoryId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(Categories.categoryId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(Categories.categoryId, 'white')}}>
                <img src={"data:image/"+Categories.format+";base64,"+atob(Categories.data)} height="64px"/>
                {Categories.categoryName}
              </button>
              {localStorage.getItem("userRole")=='Администратор' &&
              <div className="List-String">
                <button id={"edit"+Categories.categoryId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor("edit"+Categories.categoryId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("edit"+Categories.categoryId, 'white')}}>
                  <a href={"http://localhost:3000/category-edit/"+Categories.categoryId}>
                    <img src={EditIcon} alt="Изменить категорию" />
                  </a>
                </button>
                <button id={"delete"+Categories.categoryId} className="List-Element" onClick={function(){setDeletingCategoryId(Categories.categoryId); setDeletingCategoryName(Categories.categoryName); setModalActive(true);}} onMouseOver={function(){ChangeBackgroundColor("delete"+Categories.categoryId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("delete"+Categories.categoryId, 'white')}}>
                  <img src={DeleteIcon} alt="Удалить категорию" />
                </button>
              </div>}
              
            </div>
          ))}
        </div>
        <Modal Active={ModalActive} setActive={setModalActive} categoryId={DeletingCategoryId} categoryName={DeletingCategoryName}/>
      </div>
  );
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
}

const Modal = ({Active, setActive, categoryId, categoryName}) => {
  const [ModalErrorHidden, setModalErrorHidden] = useState(true);
  const [ModalErrorMessage, setModalErrorMessage] = useState("");
  
  
  let del = async (event)=>{    
    setModalErrorMessage("");
    setModalErrorHidden(true);
    
    let JSON=await DeleteCategory(categoryId); 
    if(JSON.message.startsWith("Невозможно удалить категорию, которая используется в достижениях:")) {
        setModalErrorMessage(JSON.message);
        setModalErrorHidden(false);
    }
    else{
        if (JSON.status==200) {window.location.reload();}
        else {
            setModalErrorMessage(JSON.message);
            setModalErrorHidden(false);
        }
    }
  }
    
  return(
    <div className={Active ? "Modal Active" : "Modal"} onClick={() => {setActive(false); setModalErrorMessage(""); setModalErrorHidden(true);}}>
      <div className={ModalErrorMessage=="" ? "ModalContent Small" : "ModalContent Big"} onClick={e => e.stopPropagation()}>
        <p>Вы действительно хотите удалить категорию "{categoryName}"? Это действие нельзя отменить!</p>
        <p hidden={ModalErrorHidden}>{ModalErrorMessage}</p>
        <div className="List-String">
          <button id={"deleteYes"} className="Button" onClick={() => del()} onMouseOver={function(){ChangeBackgroundColor("deleteYes", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("deleteYes", 'white')}}>
            Удалить
          </button>
          <button id={"deleteNo"} className="Button" onClick={() => {setActive(false); setModalErrorMessage(""); setModalErrorHidden(true);}} onMouseOver={function(){ChangeBackgroundColor("deleteNo", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("deleteNo", 'white')}}>
            Вернуться
          </button>
       </div>
      </div>
    </div>
  )
}

export default App;