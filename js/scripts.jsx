var Login = React.createClass({
  render: function() {
    return (
        <div className='loginForm'>
          <h2> </h2>
		  <br/>
		  <br/>
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
        //<img src='img/ajax-loader.gif' />
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
     
        <embed src="audio/bikehorn.mp3" autostart="true" loop="false"
          width="2" height="0">
        </embed>
      
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
  getPagedData: function(nextPageToken){
	var _this = this;
	var furtherRequest = gapi.client.youtube.subscriptions.list({
				mySubscribers: true,
				part: 'subscriberSnippet',
				maxResults: 50,
				order: 'unread',
				pageToken: nextPageToken
			  });
	furtherRequest.execute(function(data) {			  
	  if (!data) {
		console.log('error', data);
		location.reload();
	  } else {
		console.log('success!',data);
		nextPageToken = data.nextPageToken;
		for(var j = 0; j < data.items.length; j++){
			var theSub = {
			  name: data.items[j].subscriberSnippet.title,
			  thumb: data.items[j].subscriberSnippet.thumbnails.default.url
			};
			this.initialSubs.push(theSub);
		}
		if(data.nextPageToken){
			_this.getPagedData(data.nextPageToken);
		}else{			
			 _this.setState({
            app: {
              init: true
            },
            subscribers: {
              old: this.initialSubs,
              new: this.initialSubs,
              difference: {}
            },
            loading: false
          });
		  console.log("initial load end - subs aufgezeichnet: "+ this.initialSubs.length);
		}
	  }
	});			  
  },
  getNewPagedData: function(nextPageToken){
	  var _this = this;
	var furtherRequest = gapi.client.youtube.subscriptions.list({
				mySubscribers: true,
				part: 'subscriberSnippet',
				maxResults: 50,
				order: 'unread',
				pageToken: nextPageToken
			  });
	furtherRequest.execute(function(data) {			  
	  if (!data) {
		console.log('error', data);
		location.reload();
	  } else {
		//console.log('success!',data);
		nextPageToken = data.nextPageToken;
		for(var j = 0; j < data.items.length; j++){
			 var newSub = {
              name: data.items[j].subscriberSnippet.title,
              thumb: data.items[j].subscriberSnippet.thumbnails.default.url
            };
            this.newSubs.push(newSub);
		}
		if(data.nextPageToken){
			_this.getNewPagedData(data.nextPageToken);
		}else{			
            console.log("loading new subs complete");
		 var oldSubs = _this.state.subscribers.new,
            theDiff = this.newSubs.diff(oldSubs),
            oldDiff = _this.state.subscribers.difference,			
            changed = this.newSubs.diff(oldSubs) != 'undefined';			
			
          _this.setState({
            subscribers: {
              old: oldSubs,
              new: this.newSubs,
              difference: (theDiff === undefined) ? oldDiff : theDiff,
              changed: (theDiff !== undefined)
            }
          });		
		 
		}
	  }
	});
  },
  refreshData: function(request){
    var _this = this;
	
    request.execute(function(response) {      
      if (!response) {
        console.log('error', response);
        location.reload();
      } else {
        //console.log('success!',response);
        if(!_this.state.app.init){
		this.initialSubs=[];
          console.log('initial load start');
          
		  for(var j = 0; j < response.items.length; j++){
				var theSub = {
				  name: response.items[j].subscriberSnippet.title,
				  thumb: response.items[j].subscriberSnippet.thumbnails.default.url
				};
				this.initialSubs.push(theSub);
		  }				
		if(response.nextPageToken){
			_this.getPagedData(response.nextPageToken); 
		}		           
        }else{
			console.log("loading new subs");
          this.newSubs = [];
          for(var i = 0; i < response.items.length; i++){
            var newSub = {
              name: response.items[i].subscriberSnippet.title,
              thumb: response.items[i].subscriberSnippet.thumbnails.default.url
            };
            this.newSubs.push(newSub);
          } 
         if(response.nextPageToken){
			_this.getNewPagedData(response.nextPageToken); 
		}		 
        }
        setTimeout(function(){
          _this.refreshData(request);
        },20000);
		//long timeout since getting and processing takes a while...
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
