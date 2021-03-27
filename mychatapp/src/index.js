import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
// import registerServiceWorker from "./registerServiceWorker";

import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom";
import { auth } from './services/firebase';
import 'semantic-ui-css/semantic.min.css';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import rootReducer from './reducers/rootReducer';
import { setUser, clearUser } from './actions/actions';

const store = createStore(rootReducer);

class Root extends React.Component {
  componentDidMount() {
    auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
        this.props.history.push("/");
      }
    })
  }
  render() {
    return (
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
    )
  }
}
const mapStateFromProps = state => ({
  isLoading: state.user.isLoading
})
const RootWithAuth = withRouter(
  connect
  (
    mapStateFromProps, 
  {setUser, clearUser}
  )(Root));

ReactDOM.render(
  <Provider store={store}>
  <Router>
    <RootWithAuth/>
  </Router>
  </Provider>, document.getElementById("root"));
// registerServiceWorker();
