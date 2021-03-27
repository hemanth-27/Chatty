import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import  firebase from '../../services/firebase';
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from './Message';

class Messages extends React.Component {
  state = {
    isPrivateChannel: this.props.isPrivateChannel,
    privateMessagesRef: firebase.database().ref('privateMessages'),
    messagesRef: firebase.database().ref('messages'),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    numUniqueUsers: ''
  }

  getMessagesRef = () => {
    const {messagesRef, privateMessagesRef, isPrivateChannel} = this.state;
    return isPrivateChannel ? privateMessagesRef : messagesRef;
  }

  componentDidMount() {
    const { channel, user } = this.state;
    if (channel, user) {
      this.addListeners(channel.id)
    }
  }
  addListeners = (channelId) => {
    this.addMessageListener(channelId);
  }
  addMessageListener = (channelId) => {
    const loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      })
      this.countUniqueUsers(loadedMessages);
    })
  }

  displayMessages = (messages) => (
    messages.length > 0 && messages.map(message => (
      <Message 
      key={message.timeStamp}
      message={message}
      user={this.state.user}
      />
    ))
  )

  countUniqueUsers = (messages) => {
    const uniqUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, [])
    const numUniqueUsers = `${uniqUsers.length} Users`;
    this.setState({numUniqueUsers});
  }

  displayChannelName = (channel) => {
    return channel ? `${this.state.isPrivateChannel ? '@' : '#'}${channel.name}` : '';
  }

  render() {
    const { messagesRef, channel, user , messages, numUniqueUsers, isPrivateChannel } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader 
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          isPrivateChannel={isPrivateChannel}
        />

        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(messages)}
            </Comment.Group>
        </Segment>

        <MessageForm messagesRef={messagesRef} currentChannel={channel} currentUser={user}
         isPrivateChannel={isPrivateChannel} getMessagesRef={this.getMessagesRef}
         />
      </React.Fragment>
    );
  }
}

export default Messages;
