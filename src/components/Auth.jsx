import React from 'react';
import {NavLink} from 'react-router-dom';

class Auth extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className='auth-wrapper'>
              {this.props.invite ? 
                  <div>Enter the chat #{this.props.id}</div>
                  :
                  <input 
                      type='text' 
                      readOnly={this.props.invite} 
                      placeholder='ID' 
                      value={this.props.id} 
                      ref={(inputRef)=>this.inputRef = inputRef}
                      onChange={(e)=>this.props.handler.id(e, this.inputRef)}/>   
              }
              <input type='text' placeholder='Name' value={this.props.name} onChange={this.props.handler.name}/>
              <button onClick={this.props.handler.join}>Join</button>
              {this.props.invite ? 
                  <React.Fragment>
                      <NavLink 
                          onClick={this.props.handler.link}
                          to="/"
                          exact
                          className='new-room'
                      >New Room</NavLink>
                  </React.Fragment>
                  : null
              }
              {this.props.error ? 
                  <span className='error'>Server is not available</span>
                  : null
              }
            </div>
        );
    }
  }
  
  export default Auth;