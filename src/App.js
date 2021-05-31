import React from 'react';
import {Redirect} from 'react-router-dom';
import socket from './socket';
import axios from 'axios';
import Auth from './components/Auth';
import Chatroom from './components/Chatroom'

class App extends React.Component {
  constructor(props) {
    super(props);
    const path = window.location.pathname;
    const regexp = /^\/room\/(\d+)$/;
    let result = path.match(regexp);
    this.state = {
      error: false,
      auth: false,
      username: '',
      roomId: result ? result[1] : '',
      users: [],
      messages: [],
      invite: !!result,
      text: ''
    }
  }

  onSendMessage() {
    if(!this.state.text) return;
    const data = {
      time: new Date().toLocaleTimeString().slice(0, -3),
      user: this.state.username,
      text: this.state.text,
      id: this.state.roomId
    }
    socket.emit('send', data);
    this.setState(function(state){
      return {messages: [...state.messages, data], text: ''}
    });
  }
  onEditMessage(e) {
    this.setState({text: e.target.value});
  }

  componentDidMount() {
    const path = window.location.pathname;
    if(path !=='/'){
      const regexp = /^\/room\/(\d+)$/;
      let result = path.match(regexp);
      if(result){
        this.setState({roomId: result[1], invite: true})
      };
    }
  }

  changeRoomId(e, ref) {
    if( !(/^[0-9]+$/.test(e.target.value)) ) {
      ref.classList.add('warning');
      setTimeout(()=>ref.classList.remove('warning'), 500);
      return;
    };
    this.setState({roomId: e.target.value});
  }

  changeName(e) {
    this.setState({username: e.target.value});
  }

  onJoin(){
    var that = this;
    if(!this.state.roomId || !this.state.username) {
      alert('Enter value');
      return;
    }
    axios.post('/auth', {
      username: this.state.username,
      roomid: this.state.roomId
    })
    .then(()=>{
      this.setState({auth: true, error: false});
      const data = {
        id: this.state.roomId,
        username: this.state.username
      };
      socket.emit('join', data);
      socket.on('joined', function(users) {
        that.setState({users: users});
      });
      socket.on('leave', function(users) {
        that.setState({users: users});
      });
      socket.on('send_msg', function(messages) {
        that.setState({messages: messages});
      });
      
      axios.get('/data/' + that.state.roomId)
      .then(function(r){
        that.setState({users: r.data.users, messages: r.data.messages});
      })
    })
    .catch(()=>{
      that.setState({error: true});
    });
  }

  onLink() {
    this.setState({
      invite: false,
      roomId: ''
    });
  }

  render() {
    return(
      <React.Fragment>
        {
          this.state.auth ?  
          <React.Fragment>
            <Chatroom 
              {...this.state} 
              handler={{
                btn: this.onSendMessage.bind(this),
                txt: this.onEditMessage.bind(this) }}
            />
            <Redirect from="/" to={"/room/" + this.state.roomId} />
          </React.Fragment>
          : 
          <Auth 
            name={this.state.username}
            id={this.state.roomId}
            invite={this.state.invite}
            error={this.state.error}
            handler={{
              name: this.changeName.bind(this), 
              id: this.changeRoomId.bind(this),
              join: this.onJoin.bind(this),
              link: this.onLink.bind(this),
            }}
          />
        }
      </React.Fragment>             
    );
  }
}

export default App;
