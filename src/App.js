import React from "react";
import { BrowserRouter as Router, Route, useRouteMatch, Switch } from "react-router-dom";

//АВТОРИЗАЦИЯ
//логин
import LoginPage from "./login.js";
//сбросить пароль
import RecoveryPage from"./recovery.js";
//новый пароль
import UpdatePage from "./update.js";
//пароль изменён
import SuccessChangePage from "./successchange.js";
//забыли почту
import NoEmailPage from "./noemail.js";

//ГЛАВНАЯ
import MainPage from "./main.js";

//ОБРАЗОВАНИЕ, ЛОГ, ПОДДЕРЖКА
//институты
import InstituteListPage from "./institutelist.js";
//направления
import StreamListPage from "./streamlist.js";
//группы
import GroupListPage from "./grouplist.js";
//лог - список
import LogPage from "./log.js";
//конкретный лог
import LogMessagePage from "./logmessage.js";
//сообщения об ошибках - список
import SupportPage from "./support.js";
//конкретное сообщение об ошибке
import ErrorMessagePage from "./errormessage.js";

//ПОЛЬЗОВАТЕЛИ
//профиль пользователя
import ProfilePage from "./profile.js";
//список пользователей
import UserListPage from "./userlist.js";
//студенты - список (с фильтрами)
import StudentsPage from "./students.js";
//профиль студента
import StudentPage from "./student.js";
//регистрация модератора или администратора
import RegisterPage from "./register_user.js";

//ДОСТИЖЕНИЯ, НАГРАДЫ, КАТЕГОРИИ
//список достижений
import AchievementsListPage from "./achievements_list.js";
//создать достижение
import CreateAchievementPage from "./create_achievement.js";
//изменить награду
import EditAchievementPage from "./edit_achievement.js";
//конкретное достижение
import AchievementPage from "./achievement.js";
//заявки на подтверждение достижения
import ProofListPage from "./achievements_proof_list.js";
//конкретная заявка на подтверждение достижения
import ProofPage from "./achievement_proof.js";
//список наград
import RewardsListPage from "./rewardlist.js";
//создать награду
import CreateRewardPage from "./create_reward.js";
//изменить награду
import EditRewardPage from "./edit_reward.js";
//список категорий
import CategoriesListPage from "./categorieslist.js";
//создать категорию
import CreateCategoryPage from "./create_category.js";
//изменить категорию
import EditCategoryPage from "./edit_category.js";



function App (){
  return(
    <Router>
      <div className="App">
        <div id="auth">
          <Route path="/" exact component={LoginPage}/>
          <Route path="/recovery" exact component={RecoveryPage}/>
          <Route path="/update" exact component={UpdatePage}/>
          <Route path="/successchange" exact component={SuccessChangePage}/>
          <Route path="/noemail" exact component={NoEmailPage}/>
          <Route path="/register" exact component={RegisterPage}/>
        </div>  
        <Route path="/main" exact component={MainPage}/>
        <div id="education">  
          <Route path="/education">
            <Education />
          </Route>
          <Route path="/students" exact component={StudentsPage}/>
          <Route path="/student/:id" exact component={StudentPage}/>
        </div>  
        <div id="achievements">  
          <Route path="/achievements">
            <AchievementsList />
          </Route>
          <Route path="/achievement-create" exact component={CreateAchievementPage}/>
          <Route path="/achievement-edit/:id" exact component={EditAchievementPage}/>
          <Route path="/categories" exact component={CategoriesListPage}/>
          <Route path="/category-create" exact component={CreateCategoryPage}/>
          <Route path="/category-edit/:id" exact component={EditCategoryPage}/>
        </div>
        <div id="rewards"> 
          <Route path="/rewards" exact component={RewardsListPage}/>
          <Route path="/reward-create" exact component={CreateRewardPage}/>
          <Route path="/reward-edit/:id" exact component={EditRewardPage}/>
        </div>
        <div id="log">
          <Route path="/log" exact component={LogPage}/>
          <Route path="/logmessage/:id" exact component={LogMessagePage}/>
        </div>
        <div id="error-messages"> 
          <Route path="/support" exact component={SupportPage}/>
          <Route path="/error-message/:id" exact component={ErrorMessagePage}/>
        </div>
        <div id="users">
          <Route path="/profile/:id" exact component={ProfilePage}/>
          <Route path="/users" exact component={UserListPage}/>
        </div>
      </div>
    </Router>
  )
}


function AchievementsList() {
  let { path } = useRouteMatch();
  return (
    <Switch>
        <Route exact path={path}>
          <AchievementsListPage />
        </Route>
        <Route path={`${path}/proof`}>
          <Switch>
            <Route exact path={`${path}/proof`}>
              <ProofListPage />
            </Route>
            <Route path={`${path}/proof/:id`}>
              <ProofPage />
            </Route>
          </Switch>
        </Route>
        <Route path={`${path}/:id`}>
          <AchievementPage />
        </Route>
    </Switch>
  )
}

function Education() {
  let { path } = useRouteMatch();
  return (
    <Switch>
        <Route exact path={path}>
          <InstituteListPage />
        </Route>
        <Route path={`${path}/:instituteId`}>
          <Institute />
        </Route>
    </Switch>
  )
}

function Institute() {
  let { path } = useRouteMatch();
  return (
    <Switch>
        <Route exact path={path}>
          <StreamListPage />
        </Route>
        <Route path={`${path}/:streamId`}>
          <GroupListPage />
        </Route>
    </Switch>
  )
}

export default App;