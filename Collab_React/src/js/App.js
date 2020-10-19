import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './../css/App.css';
import './../bootstrap/css/bootstrap.min.css';
import FilesCollab from './../js/FilesCollab.js';

window.httpURL = "http://localhost:8080";
function App() {
  return (
    <Router>
      <Route path="/" basename="/FilesCollab" exact component={FilesCollab} />
    </Router>
  );
}

export default App;
