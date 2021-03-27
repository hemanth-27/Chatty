import React from "react";
import firebase from '../../services/firebase';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";

class Register extends React.Component {
  state = {
      username: '',
      email: '',
      password: '',
      usersRef: firebase.database().ref('users')
  };

  handleChange = (event) => {
      this.setState({
          [event.target.name]: event.target.value
      })
  };

  handleSubmit = (event) => {
    event.preventDefault();
    firebase.auth()
    .createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(createdUser => {
        createdUser.user.updateProfile({
          displayName: this.state.username
        })
        .then(() => {
          this.saveUser(createdUser).then(() => {
            console.log('user saved')
          })
        })
    })
    .catch(err => {
        console.log(err);
    })
  }

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName
    });
  };

  render() {
    const { username, email, password } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for Chatty
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                value={username}
                onChange={this.handleChange}
                type="text"
              />

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                value={email}
                onChange={this.handleChange}
                type="email"
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
                type="password"
              />

              <Button color="orange" fluid size="large" >
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
