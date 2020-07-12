import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './components/Home';
import "./materialize/materialize.min";
import "./fontawesome/fontawesome.min";
import "!style-loader!css-loader!../css/materialize/materialize.min.css";
import "!style-loader!css-loader!../css/style/global.css";
import "!style-loader!css-loader!../css/material-icons.css";
import '!style-loader!css-loader!react-notifications/lib/notifications.css';
import "!style-loader!css-loader!../css/frontawesome/fontawesome.css";
import "!style-loader!css-loader!../css/style/Acceuil.css";

ReactDOM.render(<Router><Home /></Router>, document.getElementById('root'));
