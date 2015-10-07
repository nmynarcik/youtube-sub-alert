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
    if(this.props.changed && this.props.subscriber.name !== undefined){
      content = <div className='subscriber'><PlaySound /><img src={this.props.subscriber.thumb || 'http://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png'} width='30' />{this.props.subscriber.name || 'Private User'}</div>;
    }else if(this.props.subscriber.name !== undefined){
      content = <div className='subscriber'><img src={this.props.subscriber.thumb || 'http://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png'} width='30' />{this.props.subscriber.name || 'Private User'}</div>;
    }else{
      content = '...';
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
    console.log('initial state');
    return ({
      subscribers: {
        old: [],
        new: [],
        difference: {
          name: null,
          thumb: null
        }
      },
      loading: false,
      loggedin: false,
      app: {
        token: null,
        apiKey: null,
        client_id: null,
        init: false
      }
    });
  },
  componentDidMount: function(){
    console.log('did Mount');
    var _that = this;
    $.getJSON('../config.json',function(data){
      _that.setState({
        app: {
          client_id: data.web.client_id,
          apiKey: data.web.apikey,
          scope: data.web.scope
        }
      });
      _that.authorizeUser();
    });
  },
  authorizeUser: function() {
    var _this = this;
    var results;
    console.log('nate',_this.config);
    if(_this.config === undefined){
      this.config = {
        'client_id': this.state.app.client_id,
        'scope': this.state.app.scope,
        'immediate': true
      };
    }
    console.log('setting key',_this.state.app.apiKey);
    gapi.client.setApiKey(_this.state.app.apiKey);
    gapi.auth.authorize(_this.config, function() {
      console.log('login complete');
      results = gapi.auth.getToken();
      console.log('results token',results);
      _this.checkAuth(results);
    });
  },
  checkAuth: function(results){
    console.log(this);
    if(results === null){
      // we need to prompt user for auth
      this.config.immediate = false;
      this.getAuth();
    }else{
      this.setState({
        app: {
          token: results.access_token
        },
        loading: true,
        loggedin: true
      });
      this.getData();
    }
  },
  getAuth: function (){
    this.config.immediate = false;
    this.authorizeUser();
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
      if (!response) {
        console.log('error', response);
        location.reload();
      } else {
        console.log('success!',response);
        if(!_this.state.app.init){
          console.log('initial load');
          var initialSubs = [];
          for(var j = 0; j < response.items.length; j++){
            var theSub = {
              name: response.items[j].subscriberSnippet.title,
              thumb: response.items[j].subscriberSnippet.thumbnails.default.url
            };
            initialSubs.push(theSub);
          }
          _this.setState({
            app: {
              init: true
            },
            subscribers: {
              old: initialSubs,
              new: initialSubs,
              difference: {}
            },
            loading: false
          });
        }else{
          console.log('after load');
          var newSubs = [];
          for(var i = 0; i < response.items.length; i++){
            var newSub = {
              name: response.items[i].subscriberSnippet.title,
              thumb: response.items[i].subscriberSnippet.thumbnails.default.url
            };
            newSubs.push(newSub);
          }
          var oldSubs = _this.state.subscribers.new,
            theDiff = newSubs.diff(oldSubs),
            oldDiff = _this.state.subscribers.difference,
            changed = newSubs.diff(oldSubs) != 'undefined';
          _this.setState({
            subscribers: {
              old: oldSubs,
              new: newSubs,
              difference: (theDiff === undefined) ? oldDiff : theDiff,
              changed: (theDiff !== undefined)
            }
          });
        }
        setTimeout(function(){
          _this.refreshData(request);
        },5000);
      }
    });
  },
  render: function() {
    var content;
    if(this.state.loggedin === false){
      content = <Login authorizeUser={this.authorizeUser}/>;
    }else{
      if(this.state.loading === true){
        content = <Loader />;
      }else{
        content = <NewSub subscriber={this.state.subscribers.difference} changed={this.state.subscribers.changed} />;
      }
    }
    return (
      <div className="app">
        {content}
      </div>
    );
  }
});

React.render(<App />, document.getElementById('container'));
