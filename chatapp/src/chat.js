import React from "react";
import io from "socket.io-client";

class Chat extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            username: '',
            context: '',
            messages: []
        };

        this.socket = io('localhost:8080');

        this.socket.on('RECEIVE_MESSAGE', function(data){
            addMessage(data);
        });

        const addMessage = (data) => {
            console.log(data.context);
            this.setState({messages: [...this.state.messages, data]});
            console.log(this.state.messages);
        };

        this.sendMessage = (ev) => {
            ev.preventDefault();
            this.socket.emit('SEND_MESSAGE', {
                type: "text",
                author: this.state.username,
                context: this.state.context
            })
            this.setState({message: ''});
        }

        this.socket.on('SEND_BROADCAST', (data)=>{
            console.log('broadcast')
            console.log(data)
            addMessage(data)
        })
    }

    render(){
        let Message = (props)=>{
            return (
                <div>{props.author}: {props.context}</div>
            )
        }
        
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-title">Kata.ai Internship</div>
                                <hr/>
                                <div className="messages">
                                    {this.state.messages.map((message) => <Message key={message.id} {...message} />)}
                                </div>
                            </div>
                            <form onSubmit={this.sendMessage} className="card-footer">
                                <input type="text" value={this.state.username} onChange={(event)=> this.setState({username:event.target.value})}
                                placeholder="username" className="form-control"/>
                                <br/>
                                <input type="text" value={this.state.context} onChange={(event) => this.setState({context:event.target.value})}
                                placeholder="message" className="form-control"/>
                                <br/>
                                <button type="submit" className="btn btn-primary form-control">Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;