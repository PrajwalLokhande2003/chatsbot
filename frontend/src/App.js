import React from 'react';
import {Route,Routes,BrowserRouter} from 'react-router-dom'
import './App.css';
import Nav from './component/Nav';
import SignUp from './component/SignUp';
import LogIn from './component/LogIn';
import Home from './component/Home';
import PrivateComponent from './component/PrivateComponent';
import CreateGroup from './component/CreateGroup';

function App() {
  return (
    <>
    <BrowserRouter>
    <Nav/>
    <Routes>
      <Route element={<PrivateComponent/>}>
      {/* <Route path='/profile' element={<h1>profile</h1>}/> */}
      <Route path='/' element={<Home/>}/>
      <Route path='/create-group' element={<CreateGroup/>}/>
      </Route>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/login' element={<LogIn/>}/>
    </Routes>
    </BrowserRouter>
    

    </>
  );
}

export default App;
