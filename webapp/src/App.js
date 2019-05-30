import React from 'react';
import './App.css';
import VideoRecorder from 'react-video-recorder'
import Websocket from 'react-websocket';

var linker;

class VideoGallery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        linker = this
        this.sendMessage.bind(this)
    }

    handleData(data) {
        let vdat = JSON.parse(data)
        console.log(vdat)
        this.setState({ data: vdat });
    }

    sendMessage(message) {
        this.refWebSocket.sendMessage(message);
    }

    render() {
        return (
            <div className="video-box">
                {
                this.state.data.map((VID, index) => (
                       
                       <div className="video-d" key={index} >
                         <h3>{VID.timestamp}</h3>
                         <video width="320" loop muted controls preload="yes" autoplay="true">
                            <source type="video/webm" src={"data:video/webm;base64,"+VID.data} defer/>
                            
                            <source type="video/quicktime" src={"data:video/quicktime;base64,"+VID.data} defer/>
                        </video>
                         </div>
                      
                  ))
                }

          <Websocket url={'ws://'+window.location.hostname+':8888/ws'}
              onOpen={() =>{
                  // super hacky way to fetch the videos after load
                  setTimeout(function(){
                      sendVideoToServer(null)
                  },500)
              }}
              onMessage={this.handleData.bind(this)}
              ref={Websocket => {
                  this.refWebSocket = Websocket;
                }}
          />
        </div>
        );
    }
}



function sendVideoToServer(data) {
    console.log(data)

    linker.sendMessage(data);
}

function clearAllVideos() {
    fetch("http://"+window.location.hostname+":8888/clear", {
            "method": "GET",
            "headers": {}
        })

   setTimeout(() => {linker.sendMessage(null)}, 500)
}

function App() {
    return (
        <div className="App">
        <div className="navbar">
          <span className="title-header">React Websocket Golang Videos</span>
        </div>
          
          <div className="video-recorder-pane" >
            <VideoRecorder

            timeLimit={10000}
            onRecordingComplete={sendVideoToServer} 
            />
        </div>
        <small className="clearbutton" onClick={clearAllVideos}>Clear All Videos</small>
        <VideoGallery />
      
    </div>
    );
}

export default App;