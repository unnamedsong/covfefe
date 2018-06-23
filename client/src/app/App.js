import React, {Component} from 'react';
import './App.css';
import {Route, Switch, withRouter} from 'react-router-dom';

import {getCurrentUser} from '../util/APIUtils';
import {ACCESS_TOKEN} from '../constants';

import Search from '../book/Search';
import BookmarkList from '../book/Bookmark';
import SearchHistory from '../book/SearchHistory';
import Greetings from '../home/Greetings';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';

import {Layout, notification} from 'antd';

const {Content} = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false
        });
      }).catch(error => {
      this.setState({
        isLoading: false
      });
    });
  }

  componentWillMount() {
    this.loadCurrentUser();
  }

  handleLogout(redirectTo = "/", notificationType = "success", description = "You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: 'Covfefe',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'Covfefe',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator/>
    }
    return (
      <Layout className="app-container">
        <AppHeader isAuthenticated={this.state.isAuthenticated}
                   currentUser={this.state.currentUser}
                   onLogout={this.handleLogout}/>

        <Content className="app-content">
          <div className="container">
            <Switch>
              <Route exact path="/"
                     render={(props) => <Greetings isAuthenticated={this.state.isAuthenticated}
                                                   currentUser={this.state.currentUser}
                                                   handleLogout={this.handleLogout} {...props} />}>
              </Route>
              <PrivateRoute authenticated={this.state.isAuthenticated} currentUser={this.state.currentUser}
                            path="/search" component={Search} handleLogout={this.handleLogout}/>
              <PrivateRoute authenticated={this.state.isAuthenticated} currentUser={this.state.currentUser}
                            path="/bookmark" component={BookmarkList} handleLogout={this.handleLogout}/>
              <PrivateRoute authenticated={this.state.isAuthenticated} currentUser={this.state.currentUser}
                            path="/history" component={SearchHistory} handleLogout={this.handleLogout}/>
              <Route path="/login" render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
              <Route path="/signup" component={Signup}/>
              <Route path="/users/:username"
                     render={(props) => <Profile isAuthenticated={this.state.isAuthenticated}
                                                 currentUser={this.state.currentUser} {...props}  />}>
              </Route>
              <Route component={NotFound}/>
            </Switch>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default withRouter(App);
