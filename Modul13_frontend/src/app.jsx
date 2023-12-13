import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import CommentPage from "./CommentPage";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={DashboardPage} />
        <Route path="/comment/:id" component={CommentPage} />{" "}
      </Switch>
    </Router>
  );
}

export default App;