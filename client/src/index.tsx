import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { render } from 'react-dom';

import './styles/app.css';
import './assets/fonts/Montserrat-Medium.ttf';
import './assets/fonts/Montserrat-Regular.ttf';
import './assets/fonts/Montserrat-SemiBold.ttf';
import './assets/fonts/PTSans-Regular.ttf';

import CreateProject from './views/createProject';
import { EPath } from './const/routes';
import Landing from './views/landing';
import Login from './views/login';
import Navigation from './views/navigation';
import Project from './views/project';
import Register from './views/register/Register';
import store from './store/store';

render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path={EPath.Main} element={<Landing />} />
        <Route path={EPath.Register} element={<Register />} />
        <Route path={EPath.CreateProject} element={<CreateProject />} />
        <Route path={EPath.Login} element={<Login />} />
        <Route path={`${EPath.Project}/:id`} element={<Project />} />
        <Route path={`${EPath.Navigation}/:id/:mode/:pointA/:pointB?`} element={<Navigation />} />
      </Routes>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'),
);
