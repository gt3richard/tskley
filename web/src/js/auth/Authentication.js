import React, { PureComponent } from "react";
import {observer} from "mobx-react"

import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Verify from "./Verify";
import Return from "./Return";
import Forgot from "./Forgot";
import ForgotVerify from "./ForgotVerify";

import { Auth } from "aws-amplify";

export default class Authentication extends PureComponent {
  state = {
    username: "",
    email: "",
    password: "",
    phone_number: "",
    code: "",
    user: null, // will contain our user data object when signed in
    status: "",
    errorMessage: ""
  };

  componentDidMount() {
    Auth.currentAuthenticatedUser({ bypassCache: true })
      .then(user => this.handleAuthentication(user))
      .catch(err => {
        console.log(err)
        this.switchComponent("SignIn")
      } );
  }

  handleAuthentication = user => {
    this.props.store.userId = user.username
    this.props.store.accessToken = user.signInUserSession.idToken.jwtToken
    this.setState({user:user}) 
    this.switchComponent("Authenticated")
    this.props.store.getUser()
  }

  handleLogout = event => {
    event.preventDefault();
    Auth.signOut(
    )
    .then(()=>this.switchComponent("SignIn"))
    .catch(err => {
      console.log(err)
    })
  }

  // Handle changes to form inputs on sign-up, verification and sign-in
  handleFormInput = event => {
    this.setState({
      [event.target.name]: event.target.value,
      'errorMessage': ''
    });
  };

  handleErrorMessage = errorMessage => {
    this.setState({ errorMessage });
  }

  handleEdit = event => {
    this.props.store.edit = !this.props.store.edit
  }

  handleTeam = event => {
    this.props.store.teamEdit = true
  }

  Navigation = () => {
    const editButton = <button className="btn btn-outline-dark my-2" onClick={this.handleEdit} type="button">Edit</button>
    const teamButton = <button className="btn btn-outline-dark my-2" onClick={this.handleTeam} type="button">Team</button>
    return (
      <nav className="navbar navbar-expand-lg navbar-light">
            <a className="navbar-brand" href="/">Tskley</a>
            {this.state.status === 'Authenticated' && teamButton}
            {this.props.store.taskId && editButton}
            <input
              hidden = {this.state.status !== 'Authenticated'}
              type="button" 
              className="btn btn-outline-dark my-2 my-sm-0" 
              onClick={this.handleLogout} 
              value="Logout"
            />
          </nav>
    );
  }

  AuthComponent = () => {
    switch (this.state.status) {
      case "SignUp":
        return (
          <SignUp
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            handleErrorMessage={this.handleErrorMessage}
            inputs={this.state}
          />
        );
        
      case "Verify":
        return (
          <Verify
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            inputs={this.state}
          />
        );

        case "Return":
        return (
          <Return
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            inputs={this.state}
          />
        );
        
      case "SignIn":
        return (
          <SignIn
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            handleErrorMessage={this.handleErrorMessage}
            handleAuthentication={this.handleAuthentication}
            inputs={this.state}
          />
        );

      case "Forgot":
        return (
          <Forgot
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            inputs={this.state}
          />
        );

      case "ForgotVerify":
        return (
          <ForgotVerify
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            handleErrorMessage={this.handleErrorMessage}
            inputs={this.state}
          />
        );
      default:
        return <div />;
    }
  };

  switchComponent = status => {
    this.props.store.isAuthenticated = (status === 'Authenticated')
    this.setState({ status, 'errorMessage': '' });
  };
  
  render() {
    if(this.state.status === 'Authenticated' || this.state.status === '') {
      return (
        <div>
          {this.Navigation()}
        </div>
      )
    }
    else {
      return (
        <div>
         {this.Navigation()}
          <div className="jumbotron">
            <div className="container" >
              {this.AuthComponent()}
            </div>
          </div>
        </div>
      ) 
    }
  }
}

Authentication = observer(Authentication)