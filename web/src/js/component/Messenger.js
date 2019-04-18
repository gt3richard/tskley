import React, { Component } from 'react';
import {observer} from "mobx-react"
import '../../assets/App.scss';
import '../../assets/Tasks.scss';

const user_icons = [
  "fas fa-square",
  "fas fa-circle"
]

const user_icon_color = [
  "red", "orange", "blue", "green"
]

const messages = [
  { user_id: '1', date: '2/4/2019 10:00:00', text: 'Can you give me a status update?' },
  { user_id: '2', date: '2/4/2019 11:00:00', text: 'I\'ve filled out the form but am waiting to get it authorized.' },
  { user_id: '2', date: '2/6/2019 11:00:00', text: 'Task is Blocked' },
  { user_id: '2', date: '2/6/2019 12:00:00', text: 'The person is out on vacation so I can get it done next week.' },
  { user_id: '1', date: '2/6/2019 13:00:00', text: 'Send it over to me and I can authorize it.' },
  { user_id: '2', date: '2/7/2019 11:00:00', text: 'Task is Completed' }
]

export default class Messenger extends Component {

  render() {
    var messageMap = {}
    messages.map((message) => {
      var date = message.date.split(' ')[0]

      if(messageMap[date] === undefined) {
        messageMap[date] = [ message ]
      } else {
        messageMap[date].push(message)
      }
    })

    const messageList = Object.keys(messageMap).map((key, idx) => {

      const msgs = messageMap[key].map((msg, idx) => {
        return <div className="text" key={idx}>
          <div className={user_icons[0] + " " + user_icon_color[msg.user_id] + " icon"}></div>
          {msg.text}
          </div>
      })

      return [
        <div className="message" key={idx}>
          <div className="date">{key}</div>
          {msgs}
        </div>
      ]
    })

    return (
      <div className="col messenger">
          <div className="row">
            <div className="col">
                <div className="title">Fill out form</div>
                <div className="description">You need to fill out the
                authorization form and send it over to the team
                by next week.
                </div>
                <div className="bar"></div>
            </div>
          </div>
          <div className="row">
            <div className="col pre-scrollable messageList">
                {messageList}
            </div>
          </div>
          <div className="row">
            <div className="col">
                <div className="input-group mb-3">
                  <input type="text" className="form-control messageBox" placeholder="Enter message ..." aria-describedby="inputGroup-sizing-default" />
                </div>
            </div>
          </div>
      </div>
    )
  }
}

Messenger = observer(Messenger)