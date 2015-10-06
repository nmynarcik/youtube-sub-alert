var Login = React.createClass({
  render: function() {
    return (
        <div className='loginForm'>
          <h2>YouTube Sub Alert</h2>
          <button onClick={this.props.authorizeUser}>Connect YouTube Account</button>
          <br/>
        </div>
    );
  }
});

var Loader = React.createClass({
  render: function() {
    return (
      <div className='loader'>
        <img src='img/ajax-loader.gif' />
      </div>
      );
  }
});

var NewSub = React.createClass({
  render: function() {
    var content;
    if(this.props.changed){
      content = <div className='subscriber'><PlaySound /><img src={this.props.subscriber.thumb} width='30' />{this.props.subscriber.name}</div>;
    }else{
      content = <div className='subscriber'><img src={this.props.subscriber.thumb} width='30' />{this.props.subscriber.name}</div>;
    }
    return (
      <span>
        {content}
      </span>
      );
  }
});

var PlaySound = React.createClass({
  render: function(){
    return(
      <div>
        <embed src="audio/airhorn.wav" autostart="true" loop="false"
          width="2" height="0">
        </embed>
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    var _that = this;
    $.getJSON('config.json',function(data){
      _that.setState({
        app: {
          client_id: data.web.client_id,
          apiKey: data.web.apikey,
          scope: data.web.scope
        }
      });
    });
    return ({
      subscriber: {
        name: null,
        thumb: null
      },
      loading: false,
      loggedin: false,
      app: {
        token: null,
        apiKey: null,
        client_id: null
      }
    });
  },
  authorizeUser: function() {
    var _this = this;
    var results,
      config = {
        'client_id': _this.state.app.client_id,
        'scope': _this.state.app.scope,
        // 'immediate': true
      };
    gapi.client.setApiKey(_this.state.app.apiKey);
    gapi.auth.authorize(config, function() {
      console.log('login complete');
      results = gapi.auth.getToken();
      console.log('results token',results);
      _this.setState({
        app: {
          token: results.access_token
        },
        loading: true,
        loggedin: true
      });
      _this.getData();
    });
  },
  getData: function() {
    var _this = this;
    var request;
    gapi.client.load('youtube', 'v3', function() {
      request = gapi.client.youtube.subscriptions.list({
        mySubscribers: true,
        part: 'subscriberSnippet',
        maxResults: 50,
        order: 'unread'
      });
      _this.refreshData(request);
    });
  },
  refreshData: function(request){
    var _this = this;
    request.execute(function(response) {
      console.log('response',response);
      if ('error' in response) {
        console.log('error', response.error.message);
      } else {
        // console.log('success!',response);
        if(_this.state.subscriber.name !== response.items[response.items.length-1].subscriberSnippet.title){
          _this.setState({
            subscriber: {
              name: response.items[response.items.length-1].subscriberSnippet.title,
              thumb: response.items[response.items.length-1].subscriberSnippet.thumbnails.default.url
            },
            changed: _this.state.subscriber.name !== null,
            loading: false
          });
        }else{
          _this.setState({
            changed: false,
            loading: false
          });
        }
        setTimeout(function(){
          _this.refreshData(request);
        },30000);
      }
    });
  },
  render: function() {
    var content;
    if(this.state.loggedin === false){
      content = <Login authorizeUser={this.authorizeUser}/>;
    }else{
      if(this.state.loading === true && this.state.subscriber.name === null){
        content = <Loader />;
      }else{
        content = <NewSub subscriber={this.state.subscriber} changed={this.state.changed} />;
      }
    }
    return (
      <div className="app">
        {content}
      </div>
    );
  }
});

React.render(
  <App />,
  document.getElementById('container')
);
