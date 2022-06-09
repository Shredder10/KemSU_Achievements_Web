import Sidebar from "./sidebar.js";
import './App.css';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import icon from "./drawable/ic_group.png";
import {GetStreams} from './fetch.js';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <p className="App-main-welcome">Добро пожаловать в приложение Достижения студентов!</p>
      <p className="App-main-greet">Здравствуйте, {localStorage.getItem("userFirstName")}, рады видеть вас снова.</p>
      <div className="App-main-full">
        <p className="Header">Направления</p>
        <StreamsListView />
      </div>
    </div>
  )
}

function StreamsListView() {
  let { instituteId } = useParams();
  
  const [Stream, setStreams] = useState([]);
  useEffect(async () => {
        async function fetchData(instituteId) {
        let JSON=await getStreams(instituteId);
        setStreams(JSON);
    };
    await fetchData(instituteId);
  }, []); 
  
  
  if(Stream===[]) {
    return <div />
  };
  
  return (
    <div className="List-Column">
      {Stream.map(Stream => (
        <div id={"jija"+Stream.streamId} className="List-String">
          <button id={Stream.streamId} className="List-Element" onMouseOver={function(){ChangeBackgroundColor(Stream.streamId, '#d7eef9')}} onMouseOut={function(){ChangeBackgroundColor(Stream.streamId, 'white')}}>
            <a href={'http://localhost:3000/education/'+instituteId+"/"+Stream.streamId} style={{'display': 'flex', 'alignItems': 'center', 'textDecoration': 'none'}}>
              <img src={icon} alt=""/>
              {Stream.streamName}
            </a>
          </button>
        </div>  
        ))}
    </div>
  );
}

async function getStreams(Id) {
  let Streams=[];  
  let json=await GetStreams(Id);
  
  for(let i=0; i<json.length; i++){
    Streams[i]=json[i];
  }
  return Streams;
}

function ChangeBackgroundColor(id, color){
    document.getElementById(id).style.background=color;
}

export default App;