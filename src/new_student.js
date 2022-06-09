import "./App.css"
import React, { useState, useEffect } from 'react';

function New_Student(props) {
  const [state, setState] = useState({UserName: "", Study: "", DateR: "", Src: ""});
  const id=props.Id;
  
    useEffect(async () => {
        async function fetchData(id) {
        let JSON=await Get_information(id);
        let Username=JSON.firstName+" "+JSON.lastName;
        let study="ИФН, "+JSON.groupName;
        let data=atob(JSON.data);
        let src="data:image/"+JSON.format+";base64,"+data;
        let dateR=JSON.dateRegistration;

        setState(state => ({ ...state, UserName: Username, Study: study, DateR: dateR, Src: src }));
    };
    await fetchData(id);
  }, []);
  
  return (
    <button className="NewUserButton" onClick={function(){ShowProfile(id)}}>
    <img src={state.Src} alt="" className="NewUserAvatar"/>
    <div className="NewUserPersonalInformation">
      <p className="NewUserName">{state.UserName}</p>
      <p className="NewUserGroup">{state.Study}</p>
    </div>
    <p className="NewUserDate">{state.DateR}</p>
    </button>  
  )
}

async function Get_information(id) {
  let response = await fetch("http://localhost:8010/proxy/newToken", {
  method: 'GET',
  headers: {
    'Refresh': localStorage.getItem("refreshToken"),
    'Content-Type': 'Application/json',
  }
  });
  let json = await response.json();
  let accessToken="Bearer "+json.accessToken;
  localStorage.setItem("accessToken", accessToken);

  let URL='http://localhost:8010/proxy/upr/students/'+id;
  response=await fetch(URL, {
  method: 'GET',
  headers: {
    'AUTHORIZATION': localStorage.getItem("accessToken"),
  },
  });
  json = await response.json();
  
  return json;
}

function ShowProfile(Ident) {
  let URL = 'http://localhost:3000/profile/'+Ident;
  window.location.assign(URL);
}

export default New_Student;