import React from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from '../../services/firebase';
import FileModal from './FileModal';
import uuidv4 from 'uuid/dist/v4';
import ProgressBar from './ProgressBar';

class MessageForm extends React.Component {
  state = {
    storageRef: firebase.storage().ref(),
    uploadTask: null,
    uploadState: "",
    percentUploaded: 0,
    message: '',
    isLoading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    errors: [],
    modal: false
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: [event.target.value]
    })
  }
  createMessage = (fileUrl = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName
      }
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  };
  sendMessage = () => {
    const { getMessagesRef } = this.props;
    const { message, channel } = this.state;
    if (message) {
      this.setState({ isLoading: true });
      getMessagesRef()
      .child(channel.id)
      .push()
      .set(this.createMessage())
      .then(() => {
        this.setState({ isLoading: false, message: '', errors: []})
      }).catch(err => {
        this.setState({
          isLoading: false,
          errors: this.state.errors.concat(err)
        })
      })
    }
    else {
      this.setState({
        errors: this.state.errors.concat('Add a message')
      })
    }
  }

  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private-${this.state.channel.id}`;
    } else {
      return "chat/public";
    }
  };
  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.getMessagesRef();
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          snap => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          err => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadUrl => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch(err => {
                console.error(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          errors: this.state.errors.concat(err)
        });
      });
  };
  openModal = () => {
    this.setState({
      modal: true
    })
  }
  closeModal = () => {
    this.setState({
      modal: false
    })
  }
  render() {
    const { errors, message, isLoading, modal, uploadState, percentUploaded } = this.state;
    console.log(errors);
    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          value={message}
          placeholder="Write your message"
          className={
            errors.some(error => error.includes('message')) ?
            "error" : ''
          }
          onChange={this.handleChange}
        />
        <Button.Group icon widths="2">
          <Button
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            disabled={isLoading}
            onClick={this.sendMessage}
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
            disabled={uploadState === 'loading'}
            onClick={this.openModal}
          />
        </Button.Group>
        <FileModal 
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
          />
          <ProgressBar uploadState={uploadState} percentUploaded={percentUploaded}/>
      </Segment>
    );
  }
}

export default MessageForm;
