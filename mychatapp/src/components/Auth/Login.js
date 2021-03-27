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

class Login extends React.Component {
  state = {
      username: '',
      email: '',
      password: ''
  };

  handleChange = (event) => {
      this.setState({
          [event.target.name]: event.target.value
      })
  };

  handleSubmit = (event) => {
    event.preventDefault();
    firebase.auth()
    .signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(signedInUser => {
        console.log(signedInUser)
    })
    .catch(err => {
        console.log(err);
    })
  }

  render() {
    const {email, password } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Login for Chatty
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
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

              <Button color="violet" fluid size="large" >
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Don't have account? <Link to="/register">Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
