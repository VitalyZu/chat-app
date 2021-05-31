import React from 'react';

class Chatroom extends React.Component {
    constructor(props){
        super(props)
    }
    componentDidMount = function(){
        this.inputRef.scrollTop = this.inputRef.scrollHeight;
    }
    componentDidUpdate = function(){
        this.inputRef.scrollTop = this.inputRef.scrollHeight;
    }
    
    render() {
        let users = null;
        users = this.props.users.map((name, index) => {
            return (
                <div className='chat-user' key={index}>{name}</div>
            );
        });
        return (
            <div className='chat-wrapper'>
                <div className='chat-users'>
                    <div className='chat-total-users'>Users: {this.props.users.length}</div>
                    <div className='chat-list'>
                        {users}
                    </div>
                </div>
                <div className='chat-space'>
                    <div className='chat-messages' id='chat' ref={(inputRef)=>this.inputRef = inputRef}>
                            { this.props.messages.map(function(value, index){
                                return (
                                    <div className='chat-message-wrapper' key={index}>
                                        <div className='chat-message'>{value.text}</div>
                                        <div className='message-info'>
                                            <span className='time'>{value.time}</span>
                                            <span className='user'>{value.user}</span>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                    <div className='chat-input'>
                        <textarea 
                            onChange={this.props.handler.txt} 
                            onKeyUp={(e)=>{
                                if (e.key === 'Enter') {
                                    console.log(this)
                                    this.props.handler.btn();
                                } else if (e.keyIdentifier === 'Enter') {
                                    this.props.handler.btn();
                                } else if (e.keyCode === 13) {
                                    this.props.handler.btn();
                                }
                            }}
                            value={this.props.text} 
                            rows="10" cols="45" 
                            name="text">
                        </textarea>
                        <button onClick={this.props.handler.btn}>Send</button>
                    </div>
                </div>
            </div>
        );
    }
  }
  
  export default Chatroom;