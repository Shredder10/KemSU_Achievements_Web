//Any Role Goes
//Auth-controller
async function UpdateToken(){
    let response = await fetch("http://localhost:8010/proxy/newToken", {
    method: 'GET',
    headers: {
      'Refresh': localStorage.getItem('refreshToken'),
      'Content-Type': 'Application/json',
    }
    }); 
    let json = await response.json();    
    let accessToken="Bearer "+json.accessToken;
    localStorage.setItem('accessToken', accessToken);
}

async function LoginRequest(data, role){
    let url;
    if(role=="admin") url='http://localhost:8010/proxy/auth?filterName=Администратор'
    else {if(role=="moder") {url='http://localhost:8010/proxy/auth?filterName=Модератор';}
    else url='http://localhost:8010/proxy/auth?filterName=Деканат';}
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify(data)
    });
    let json = await response.json();
    if (response.ok) {
        let accessToken="Bearer "+json.accessToken;
        let refreshToken="Refresh "+json.refreshToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return 200;
    }
    return json.message;
}

async function SendUpdateMail(data, role){
    console.log(role);
    let URL="http://localhost:8010/proxy/code/sendEmail/"+data+"/"+role+"/password";
    console.log(URL);
    let response = await fetch(URL, {method: 'POST'});
    return response.status;
}

async function SecurityCodeCheck(code, email, role){
    let URL="http://localhost:8010/proxy/code/reset/"+code+"/"+email+"/"+role;
    let response = await fetch(URL, {method: 'PUT'});
    return response.status;
}

async function WriteNewPassword(data, role){
  let URL="http://localhost:8010/proxy/code/password/"+role;
  let response = await fetch(URL, {method: 'PUT', 
    headers: {'Content-Type': 'Application/json',
    },
    body: JSON.stringify(data),
  });
  return response.status;
}

async function GetUserData(){
    let response=await fetch('http://localhost:8010/proxy/userData', {
    method: 'GET',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
    let json = await response.json();
    localStorage.setItem('userFirstName', json.userFirstName);
    localStorage.setItem('userLastName', json.userLastName);
    localStorage.setItem('userId', json.userId);
    localStorage.setItem('userRole', json.userRole);
    return json;
}

async function ChangeProfileMail(email){
    let URL='http://localhost:8010/proxy/change/email/'+email;
    let response=await fetch(URL, {
    method: 'PUT',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await ChangeProfileMail(email);
        return request;
    }
    return json;
}

//Education-controller
async function GetInstitutions(){
    if(localStorage.getItem("userRole")=="Модератор"){
      let response=await fetch('http://localhost:8010/proxy/moderator/getAvailableInstitutes', {
        method: 'GET',
        headers: {
          'AUTHORIZATION': localStorage.getItem("accessToken"),
        },
      });
      let json = await response.json();
      return json;
    }
    
    let response=await fetch('http://localhost:8010/proxy/education/institutions', {
      method: 'GET'
    });
    let json = await response.json();
    return json;
}

async function GetStreams(id){
    let response=await fetch('http://localhost:8010/proxy/education/stream/'+id, {
      method: 'GET'
    });
    let json = await response.json();
    return json;
}

async function GetGroups(id){
    let response=await fetch('http://localhost:8010/proxy/education/group/'+id, {
      method: 'GET'
    });
    let json = await response.json();
    return json;
}


//Reward-controller
async function GetRewardsList(){
    let response=await fetch('http://localhost:8010/proxy/rewards/', {
      method: 'GET'
    });
    let json = await response.json();
    return json;
}

async function GetReward(Id){
  let response=await fetch('http://localhost:8010/proxy/rewards/'+Id, {
    method: 'GET',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
  if(json.message==="Используется неверный или истекший токен") {
      await UpdateToken();
      let request = await GetReward(Id);
      return request;
  }
  return json;  
}


//Achievement-controller (Categories)
async function GetCategoriesList(){
    let response=await fetch('http://localhost:8010/proxy/categories/', {
      method: 'GET'
    });
    let json = await response.json();
    return json;
}

async function GetCategory(Id){
  let response=await fetch('http://localhost:8010/proxy/categories/'+Id, {
    method: 'GET',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
  if(json.message==="Используется неверный или истекший токен") {
      await UpdateToken();
      let request = await GetCategory(Id);
      return request;
  }
  return json;  
}

//Admin Goes
//User-controller
async function GetUserList(currSubStr, currentRole, currentStatus){
  let URL='http://localhost:8010/proxy/admin/getUsers';
  if(currSubStr!=="" && currSubStr!=undefined)
    {URL=URL+"?substring="+currSubStr;
      if(currentRole!=="" && currentRole!=undefined) URL=URL+"&roleId="+currentRole;
      if(currentStatus!=="" && currentStatus!=undefined) URL=URL+"&statusId="+currentStatus;
    }
  else {
      if(currentRole!=="" && currentRole!=undefined) {
        URL=URL+"?roleId="+currentRole;
        if(currentStatus!=="" && currentStatus!=undefined) URL=URL+"&statusId="+currentStatus;
      }
      else
        if(currentStatus!=="" && currentStatus!=undefined) URL=URL+"?statusId="+currentStatus;
  }  
  console.log(URL);
  let response=await fetch(URL, {
    method: 'GET',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
    });
  let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await GetUserList(currSubStr, currentRole, currentStatus);
        return request;
    }
  return json;
}

async function GetUserProfile(user){
    let URL='http://localhost:8010/proxy/admin/getUser/'+user;
    let response=await fetch(URL, {
    method: 'GET',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await GetUserProfile(user);
        return request;
    }
    return json;
}

async function RegisterUser(data, institutesList, role){
    let URL;
    if(role=="admin") URL="http://localhost:8010/proxy/admin/registerAdmin"
    else {if(role=="dekanat") {URL="http://localhost:8010/proxy/admin/registerDekanat?instituteId="+institutesList;}
    else URL="http://localhost:8010/proxy/admin/registerModer/?listOfInstitutesId="+institutesList;}
    let response=await fetch(URL, {
    method: 'POST',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
      'Content-Type': 'Application/json',
    },
    body: JSON.stringify(data),
  });
  let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await RegisterUser(data, institutesList, role);
        return request;
    }
    return json;
}

async function DeleteUser(id){
    let response = await fetch("http://localhost:8010/proxy/admin/deleteUser/"+id, {
        method: 'PUT',
        headers: {
            'AUTHORIZATION': localStorage.getItem("accessToken"),
        },
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await DeleteUser(id);
        return request;
    }
    console.log(json);
    return json;
}

async function GetModerInstitutions(user){
    let URL='http://localhost:8010/proxy/admin/getModeratorInstitutes/'+user;
    let response=await fetch(URL, {
    method: 'GET',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await GetModerInstitutions(user);
        return request;
    }
    return json;
}

async function UpdateModerInstitutes(userId, data){
    let response=await fetch("http://localhost:8010/proxy/admin/addInstitutesForModerator/"+userId+"?listOfInstitutesId="+data, {
    method: 'PUT',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await UpdateModerInstitutes(userId, data);
        return request;
    }
    return json;
}


//Reward-controller
async function CreateReward(data){
    let response = await fetch("http://localhost:8010/proxy/admin/createReward", {
        method: 'POST',
        headers: {
            'AUTHORIZATION': localStorage.getItem("accessToken"),
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify(data)
    });
    let json = await response.json();
    console.log(json);
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await CreateReward(data);
        return request;
    }
    return response;
}

async function EditReward(id, data){
    let response = await fetch("http://localhost:8010/proxy/admin/changeReward/"+id, {
        method: 'PUT',
        headers: {
            'AUTHORIZATION': localStorage.getItem("accessToken"),
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify(data)
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await EditReward(id, data);
        return request;
    }
    console.log(json);
    return json;  
}

async function DeleteReward(id){
    let response = await fetch("http://localhost:8010/proxy/admin/deleteReward/"+id, {
        method: 'DELETE',
        headers: {
            'AUTHORIZATION': localStorage.getItem("accessToken"),
        },
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await DeleteReward(id);
        return request;
    }
    console.log(json);
    return json;
}

//Achievement-controller
async function CreateAchievement(data){
    let response = await fetch("http://localhost:8010/proxy/admin/newAchieve", {
        method: 'POST',
        headers: {
            'AUTHORIZATION': localStorage.getItem("accessToken"),
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify(data)
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await CreateAchievement(data);
        return request;
    }
    return json;  
}

async function DeleteCategory(id){
    let response = await fetch("http://localhost:8010/proxy/admin/deleteCategory/"+id, {
        method: 'DELETE',
        headers: {
            'AUTHORIZATION': localStorage.getItem("accessToken"),
        },
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await DeleteCategory(id);
        return request;
    }
    console.log(json);
    return json;
}

async function CreateCategory(data){
    let response = await fetch("http://localhost:8010/proxy/admin/createCategory", {
        method: 'POST',
        headers: {
            'AUTHORIZATION': localStorage.getItem("accessToken"),
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify(data)
    });
    let json = await response.json();
    console.log(json);
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await CreateCategory(data);
        return request;
    }
    return response;
}

async function EditCategory(id, data){
    let response = await fetch("http://localhost:8010/proxy/admin/changeCategory/"+id, {
        method: 'PUT',
        headers: {
            'AUTHORIZATION': localStorage.getItem("accessToken"),
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify(data)
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await EditCategory(id, data);
        return request;
    }
    return json;  
}

async function EditAchievement(id, data){
    let response = await fetch("http://localhost:8010/proxy/admin/changeAchieve/"+id, {
        method: 'PUT',
        headers: {
            'AUTHORIZATION': localStorage.getItem("accessToken"),
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify(data)
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await EditAchievement(id, data);
        return request;
    }
    return json;  
}

//Error-message-controller
async function ChangeStatusError(messageId, statusId){
  let URL='http://localhost:8010/proxy/admin/changeStatusMessageError/'+messageId+"/"+statusId;
  let response=await fetch(URL, {
    method: 'PUT',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  
  let json = await response.json();
  if(json.message==="Используется неверный или истекший токен") {
    await UpdateToken();
    let request = await ChangeStatusError(messageId, statusId);
    return request;
  }
  console.log(json);
  return json;  
}

async function ChangeCommentMessageError(data){
  let response=await fetch('http://localhost:8010/proxy/admin/changeCommentMessageError', {
    method: 'PUT',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
      'Content-Type': 'Application/json',
    },
    body: JSON.stringify(data)
  });
  
  let json = await response.json();
  if(json.message==="Используется неверный или истекший токен") {
    await UpdateToken();
    let request = await ChangeCommentMessageError(data);
    return request;
  }
  console.log(json);
  return json;  
}

async function GetErrorMessages(data){
  console.log(data);
  let URL='http://localhost:8010/proxy/admin/messageError';
  if(data!="" && data!=undefined){URL=URL+"?statusId="+data};
  
  let response=await fetch(URL, {
    method: 'GET',
    headers: {
    'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
  if(json.message==="Используется неверный или истекший токен") {
      await UpdateToken();
      let request = await GetErrorMessages(data);
      return request;
  }
  return json;  
}

async function GetErrorMessage(Id){
  let response=await fetch('http://localhost:8010/proxy/admin/messageError/'+Id, {
    method: 'GET',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
  if(json.message==="Используется неверный или истекший токен") {
      await UpdateToken();
      let request = await GetErrorMessage(Id);
      return request;
  }
  return json;  
}

async function GetErrorMessageStatuses(){
  let URL='http://localhost:8010/proxy/admin/statusMessageError';
  let response=await fetch(URL, {
    method: 'GET',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
  if(json.message==="Используется неверный или истекший токен") {
    await UpdateToken();
    let request = await GetErrorMessageStatuses();
    return request;
  }
  return json;  
}

//Log-controller
async function GetOperationTypes(){
  let URL='http://localhost:8010/proxy/admin/getTypeOperation';
  let response=await fetch(URL, {
    method: 'GET',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
  if(json.message==="Используется неверный или истекший токен") {
    await UpdateToken();
    let request = await GetOperationTypes();
    return request;
  }
  return json;  
}

async function GetRoles(){
  let URL='http://localhost:8010/proxy/admin/getRoles';
  let response=await fetch(URL, {
    method: 'GET',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
  if(json.message==="Используется неверный или истекший токен") {
    await UpdateToken();
    let request = await GetRoles();
    return request;
  }
  return json;  
}


//Upr Goes
async function GetAchievement(id){
    let URL='http://localhost:8010/proxy/upr/achievements/'+id;
    let response=await fetch(URL, {
    method: 'GET',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await GetAchievement(id);
        return request;
    }
    return json;
}

async function GetAchievementsList(curStatus, category){
    let url='http://localhost:8010/proxy/upr/achievements';
    if(curStatus!=="" && curStatus!=undefined) 
      {url=url+"?statusId="+curStatus;
        if(category!=="" && category!=undefined) url=url+"&categoryId="+category;
      }
    else {if(category!=="" && category!=undefined) url=url+"?categoryId="+category;}
    console.log(url);
    let response=await fetch(url, {
      method: 'GET',
      headers: {
        'AUTHORIZATION': localStorage.getItem("accessToken"),
      },
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await GetAchievementsList(curStatus, category);
        return request;
    }
    return json;
}

async function GetStudents(currSubStr, currentFiltId, currentFiltName, currentStatus){
    let data='';
    if(currSubStr!=="" && currSubStr!=undefined) 
      {data=data+"?substring="+currSubStr;
        if(currentFiltId!=="" && currentFiltId!=undefined) data=data+"&filterId="+currentFiltId+"&filterName="+currentFiltName;
        if(currentStatus!=="" && currentStatus!=undefined) data=data+"&statusId="+currentStatus;
      }
    else {
      if(currentFiltId!=="" && currentFiltId!=undefined) {
        data=data+"?filterId="+currentFiltId+"&filterName="+currentFiltName;
        if(currentStatus!=="" && currentStatus!=undefined) data=data+"&statusId="+currentStatus;
      }
      else
        if(currentStatus!=="" && currentStatus!=undefined) data=data+"?statusId="+currentStatus;  
    } 

    let url;
    if(localStorage.getItem("userRole")=='Администратор') url='http://localhost:8010/proxy/admin/students';
    else url='http://localhost:8010/proxy/moderator/students';
    url=url+data;
    console.log(url);
    
    let response=await fetch(url, {
      method: 'GET',
      headers: {
        'AUTHORIZATION': localStorage.getItem("accessToken"),
      },
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await GetStudents(currSubStr, currentFiltId, currentFiltName, currentStatus);
        return request;
    }
    console.log(json);
    return json;
}

async function GetStudent(id){
    let response=await fetch('http://localhost:8010/proxy/upr/students/'+id, {
      method: 'GET',
      headers: {
        'AUTHORIZATION': localStorage.getItem("accessToken"),
      },
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await GetStudent(id);
        return request;
    }
    return json;
}

async function ChangeStatusAchieve(Id, statusId){
    let URL='http://localhost:8010/proxy/upr/changeStatusAchieve/'+Id+"/"+statusId;
    let response=await fetch(URL, {
    method: 'PUT',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await ChangeStatusAchieve(Id, statusId);
        return request;
    }
    return json;
}

async function GetUserStatusesList(){
    let response=await fetch('http://localhost:8010/proxy/upr/getUserStatusActives', {
      method: 'GET',
      headers: {
        'AUTHORIZATION': localStorage.getItem("accessToken"),
      },
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await GetUserStatusesList();
        return request;
    }
    return json;
}


//Log-controller
async function GetLogList(operation, role){
    let url;
    if(localStorage.getItem("userRole")=='Модератор') url='http://localhost:8010/proxy/moderator/getLogs';
    else {url='http://localhost:8010/proxy/admin/getLogs';
      if(operation!=="" && operation!=undefined) 
        {url=url+"?operationId="+operation;
          if(role!=="" && role!=undefined) url=url+"&roleId="+role;
        }
      else {if(role!=="" && role!=undefined) url=url+"?roleId="+role;}  
    }
    let response=await fetch(url, {
      method: 'GET',
      headers: {
        'AUTHORIZATION': localStorage.getItem("accessToken"),
      },
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await GetLogList(operation, role);
        return request;
    }
    return json;
}

async function GetLog(id){
    let response=await fetch('http://localhost:8010/proxy/upr/getLog/'+id, {
      method: 'GET',
      headers: {
        'AUTHORIZATION': localStorage.getItem("accessToken"),
      },
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await GetLog();
        return request;
    }
    return json;
}

async function GetAchievementStatusList(){
    let URL;
    if(localStorage.getItem("userRole")=="Модератор") URL='http://localhost:8010/proxy/moderator/getStatusAchieve';
    else URL='http://localhost:8010/proxy/admin/getStatusAchieve';
    let response=await fetch(URL, {
      method: 'GET',
      headers: {
        'AUTHORIZATION': localStorage.getItem("accessToken"),
      },
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await GetAchievementStatusList();
        return request;
    }
    return json;
}



//Moderator Goes
//Proof-controller
async function GetAchievementsProofList(data){
    let URL='http://localhost:8010/proxy/moderator/proof';
    if(data!="" && data!=undefined){URL=URL+"?statusId="+data};
    let response=await fetch(URL, {
      method: 'GET',
      headers: {
        'AUTHORIZATION': localStorage.getItem("accessToken"),
      },
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await GetAchievementsProofList(data);
        return request;
    }
    return json;
}

async function GetAchievementProof(id){
    let URL='http://localhost:8010/proxy/moderator/proof/'+id;
    let response=await fetch(URL, {
    method: 'GET',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
   if(json.message==="Используется неверный или истекший токен") {
       await UpdateToken();
       let request = await GetAchievement(id);
       return request;
   }
   return json;
}

async function GetProofFiles(id){
    let URL='http://localhost:8010/proxy/student/listFile/'+id;
    let response=await fetch(URL, {
    method: 'GET',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await GetAchievement(id);
        return request;
    }
    return json;
}

async function SetProofStatus(id, statusId){
  let response=await fetch('http://localhost:8010/proxy/moderator/proof/'+id+"/"+statusId, {
    method: 'PUT',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
  let json = await response.json();
  if(json.message==="Используется неверный или истекший токен") {
    await UpdateToken();
    let request = await SetProofStatus(id, statusId);
    return request;
  }
  return json;
}

async function SetProofComment(data){
  let response=await fetch('http://localhost:8010/proxy/moderator/changeCommentProof', {
    method: 'PUT',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
      'Content-Type': 'Application/json',
    },
    body: JSON.stringify(data)
  });
  
  let json = await response.json();
  
  if(json.message==="Используется неверный или истекший токен") {
    await UpdateToken();
    let request = await SetProofComment(data);
    return request;
  }
  return json;
}

async function GetAchievementProofStatusList(){
    let response=await fetch('http://localhost:8010/proxy/moderator/statusRequest', {
    method: 'GET',
    headers: {
      'AUTHORIZATION': localStorage.getItem("accessToken"),
    },
  });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await GetAchievementProofStatusList();
        return request;
    }
    return json;
}

async function DeleteStudent(id){
    let response = await fetch("http://localhost:8010/proxy/moderator/deleteStudent/"+id, {
        method: 'PUT',
        headers: {
            'AUTHORIZATION': localStorage.getItem("accessToken"),
        },
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await DeleteStudent(id);
        return request;
    }
    return json;
}

async function BanStudent(data){
    let response = await fetch("http://localhost:8010/proxy/moderator/bannedUser", {
        method: 'PUT',
        headers: {
            'AUTHORIZATION': localStorage.getItem("accessToken"),
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify(data)
    });
    let json = await response.json();
    if(json.message==="Используется неверный или истекший токен") {
        await UpdateToken();
        let request = await BanStudent(data);
        return request;
    }
    return json;
}


//Auth
export {LoginRequest};
export {SendUpdateMail};
export {SecurityCodeCheck};
export {WriteNewPassword};
export {GetUserData};
export {RegisterUser};

//Achievements
export {GetAchievement};
export {GetAchievementsList};
export {CreateAchievement};
export {ChangeStatusAchieve};
export {EditAchievement};
//Proof
export {GetAchievementsProofList};
export {GetAchievementProof};
export {GetProofFiles};
export {GetAchievementStatusList};
export {GetAchievementProofStatusList};
export {SetProofStatus};
export {SetProofComment};
//Categories
export {GetCategoriesList};
export {GetCategory};
export {CreateCategory};
export {EditCategory};
export {DeleteCategory};

//Education
export {GetInstitutions};
export {GetStreams};
export {GetGroups};

//User
export {GetUserList};
export {GetUserProfile};
export {GetRoles};
export {GetModerInstitutions};
export {UpdateModerInstitutes};
export {DeleteUser};
export {ChangeProfileMail};
export {GetUserStatusesList};
//Students
export {GetStudents};
export {GetStudent};
export {BanStudent};
export {DeleteStudent};

//Log
export {GetLogList};
export {GetLog};
export {GetOperationTypes};

//Error-message
export {GetErrorMessages};
export {GetErrorMessageStatuses};
export {GetErrorMessage};
export {ChangeCommentMessageError};
export {ChangeStatusError};

//Reward
export {GetRewardsList};
export {GetReward};
export {CreateReward};
export {EditReward};
export {DeleteReward};

//import {LoginRequest} from "./fetch.js";