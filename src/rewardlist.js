import Sidebar from "./sidebar.js";
import './Main.css';
import { useState, useEffect, React } from 'react';
import AddIcon from "./drawable/ic_plus.png";
import EditIcon from "./drawable/ic_edit.png";
import DeleteIcon from "./drawable/ic_drop.png";

import {GetRewardsList} from "./fetch.js";
import {DeleteReward} from "./fetch.js";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="List-Element-Borderless">
          <p className="Header">Награды</p>
          <a href="http://localhost:3000/reward-create/">
            {localStorage.getItem("userRole")=='Администратор' &&
            <button id="addRewardButton" className="List-Element" onMouseOver={function(){ChangeBackgroundColor("addRewardButton", '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("addRewardButton", 'white')}}>
              <img src={AddIcon} alt="Добавить награду" />
            </button>}
          </a>
        </p>
        <RewardsListView />
      </div>
    </div>
  )
}

function RewardsListView() {
    
  const [ModalActive, setModalActive] = useState(false);
  const [DeleteingRewardId, setDeleteingRewardId] = useState(0);
  const [DeleteingRewardName, setDeleteingRewardName] = useState(0);
  
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
      <div>
        <div className="List-Column">
          {Rewards.map(Rewards => (
            <div id={"jija"+Rewards.rewardId} className="List-String">
              <button id={Rewards.rewardId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(Rewards.rewardId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(Rewards.rewardId, 'white')}}>
                <img src={"data:image/"+Rewards.format+";base64,"+atob(Rewards.data)} height="64px"/>
                {Rewards.rewardName}
              </button>
              {localStorage.getItem("userRole")=='Администратор' &&
              <div className="List-String">
                <button id={"edit"+Rewards.rewardId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor("edit"+Rewards.rewardId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("edit"+Rewards.rewardId, 'white')}}>
                  <a href={"http://localhost:3000/reward-edit/"+Rewards.rewardId}>
                    <img src={EditIcon} alt="Изменить награду" />
                  </a>
                </button>
                <button id={"delete"+Rewards.rewardId} className="List-Element" onClick={function(){setDeleteingRewardId(Rewards.rewardId); setDeleteingRewardName(Rewards.rewardName); setModalActive(true);}} onMouseOver={function(){ChangeBackgroundColor("delete"+Rewards.rewardId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor("delete"+Rewards.rewardId, 'white')}}>
                  <img src={DeleteIcon} alt="Удалить награду" />
                </button>
              </div>}
              
            </div>
          ))}
        </div>
        <Modal Active={ModalActive} setActive={setModalActive} rewardId={DeleteingRewardId} rewardName={DeleteingRewardName}/>
      </div>
  );
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
}

const Modal = ({Active, setActive, rewardId, rewardName}) => {
  const [ModalErrorHidden, setModalErrorHidden] = useState(true);
  const [ModalErrorMessage, setModalErrorMessage] = useState("");
  
  
  let del = async (event)=>{    
    setModalErrorMessage("");
    setModalErrorHidden(true);
    
    let JSON=await DeleteReward(rewardId); 
    if(JSON.message.startsWith("Невозможно удалить награду, которая используется в достижениях:")) {
        setModalErrorMessage(JSON.message);
        setModalErrorHidden(false);
    }
    else{
        if (JSON.status==200) {window.location.reload();}
        else {
            setModalErrorMessage("Произошла ошибка при удалении. Попробуйте снова.");
            setModalErrorHidden(false);
        }
    }
  }
    
  return(
    <div className={Active ? "Modal Active" : "Modal"} onClick={() => {setActive(false); setModalErrorMessage(""); setModalErrorHidden(true);}}>
      <div className={ModalErrorMessage=="" ? "ModalContent Small" : "ModalContent Big"} onClick={e => e.stopPropagation()}>
        <p>Вы действительно хотите удалить награду "{rewardName}"? Это действие нельзя отменить!</p>
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