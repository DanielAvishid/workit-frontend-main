import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import "monday-ui-style/dist/index.min.css";
import "monday-ui-react-core/tokens";
import './assets/styles/main.scss'

import { Home } from './pages/Home'
import { BoardDetails } from './pages/BoardDetails'
import { TaskDetails } from './pages/TaskDetails'
import { AppIndex } from './pages/AppIndex'
import { store } from './store/store'
import { GroupList } from './cmps/GroupList';
import { BoardList } from './pages/BoardList';
import { BoardActivity } from './pages/BoardActivity';
import { Dashboard } from './cmps/dashboardCmps/Dashboard';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { TaskDetailsMobile } from './pages/TaskDetailsMobile';


export function App() {
  return (
    <Provider store={store}>
      <Router>
        <main>
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Signup />} path='/sign_up' />
            <Route element={<Login />} path='/login' />
            <Route element={<TaskDetailsMobile />} path="demo-task" />
            <Route element={<AppIndex />} path="/board">
              <Route element={<BoardList />} path='' />
              <Route element={<BoardDetails />} path=":boardId">
                <Route element={<GroupList />} path="">
                  <Route element={<TaskDetails />} path="task/:taskId" />
                  <Route element={<BoardActivity />} path="activity_log" />
                </Route>
                <Route element={<Dashboard />} path="views/dashboard" />
              </Route>
            </Route>
          </Routes>
        </main>
      </Router >
    </Provider>
  )
}

