import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SigninPage from './Pages/SigninPage';
import SignupPage from './Pages/SignupPage';
import TaskTracker from './Pages/TaskTracker';
import TaskCalendar from './Pages/TaskCalendar';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={TaskTracker} />
        <Route exact path="/TaskTracker" component={TaskTracker} />
        <Route exact path="/TaskTrackerCalendar" component={TaskCalendar} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/login" component={SigninPage} />
      </Switch>
    </Router>
  );
}

export default App;
