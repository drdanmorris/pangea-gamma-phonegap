
var wsServer = require('./ws-server'),
	Cache = require('./cache'),
	util = require('util'),
    HOST = '127.0.0.1',
    PORT = 8081;

var argv = process.argv,
	sessions = [],
	sessionid = 1,
	server = new wsServer();


server.on('connection', function(connection) {
	sessions.push(new Session(connection));
});
server.on('close', function(connectionId) {
	for(var i = 0; i < sessions.length; i++) {
		if(sessions[i].connection.connectionId === connectionId) {
			sessions.splice[i,1];
		}
	}
});
server.start(argv[2] || PORT, argv[3] || HOST);


var ViewReference = function (raw) {
    var parts = raw.split('/');
    this.raw = raw;
    this.type = parts[0];
    this.subtype = parts[1];
    this.id = parts[2];
};
ViewReference.prototype.toString = function () {
    return this.raw;
};




var Session = function(connection) {
	this.sessionid = sessionid++;
	this.cache = new Cache(connection.connectionId);
	this.cache.on('update', this.onCacheUpdate.bind(this));
	this.connection = connection;
	connection.on('data', this.onConnectionData.bind(this));
	connection.on('close', this.onConnectionClose.bind(this));
	this.configureRequestProcessors();
};
Session.prototype.onCacheUpdate = function(data) {
	var res = {
		data: data.update,
		responseId: data.requestId,
		isInitial: data.update.isInitial
	};
	this.connection.send(res);
};
Session.prototype.configureRequestProcessors = function() {
	var my = this;
	this.requestProcessor = {
		subscribe: function(request) {
			impl.cancelPreviousView();
			var view = viewFactory.getView(request.vref);
			impl.sendView(view, request);
		}
		// registerSchema: function(dref) {
		// 	impl.registerSchema(dref);
		// }
	};

	var impl = {
		registeredPrefixes: {}
		,cancelPreviousView: function() {
			my.cache.unsubscribeAll();
		}
		,sendView: function(view, request) {
			var res = {
				view: view,
				isInitial: true,
				responseId: request.requestId
			};
			this.findDrefsForView(view);
			my.connection.send(res);
			this.sendDrefsForView(view, request.requestId);	
		}
		,registerSchema: function(dref) {
			console.log('registerSchema:' + dref);
			var prefix = dref.match(/^\D+/)[0];
			if(!impl.registeredPrefixes) impl.registeredPrefixes = {};
			if(!impl.registeredPrefixes[prefix]) {
				var schema = null;
				switch(prefix) {
					case 'si' :
						schema = {
				    		dref: '$[string(=id)]*',
				            title: '$[string(Spot, {3:U}/{3:U})]',  
				            sell: '[double(5:2{+}>1:1{+-})]',
				            buy: '[double(=sell+3)]',
				            chg: '[double(^sell)]',
				            cod: '$[double(2:2{+-})]',
				            codp: '$[double(=cod/sell*100)]'
				    	};
						break;

					case 'ss' :
						schema = {
				    		dref: '$[string(=id)]*',
				            title: '$[string({10} {10} {5})]'
				    	};
						break;

					case 'up' :
						schema = {
							dref: '$[string(=id)]*',
				    		balance: '[double(7:2{+}>2:0{+-})]',
				    		available: '[double(7:2{+}>2:0{+-})]',
				    		pnl: '[double(7:2{+}>2:0{+-})]',
				    		ntr: '[double(7:2{+}>2:0{+-})]'
				    	};
						break;
				}

				if(schema) {
					my.log('registerSchema', prefix);
					my.cache.register(prefix, schema);
					impl.registeredPrefixes[prefix] = schema;
				} 
			}
		}
		,findDrefsForView: function(view) {
			var drefs = [];
			this.findDrefs(view, drefs);
			if(drefs.length > 0) {
				view.drefs = drefs;
			}
		}
		,sendDrefsForView: function(view, requestId) {
			if(view.drefs) {
				for(var i = 0; i < view.drefs.length; i++) {
					var dref = view.drefs[i];
					this.subscribeToDref(dref, requestId);
				}
			}
		}
		,findDrefs: function(obj, drefs) {
			for(var prop in obj) {
				if(typeof obj[prop] === 'object') {
					this.findDrefs(obj[prop], drefs);
				}
				else if(prop === 'dref') drefs.push(obj[prop]);
			}
		}
		,subscribeToDref: function(dref, requestId, options) {
			this.registerSchema(dref);
			my.cache.subscribe(dref, requestId, options);
		}
	};

};

Session.prototype.onConnectionData = function(buffer){
	var json = buffer.toString('utf8'),
		request = JSON.parse(json);

	this.log('Request', util.inspect(request));
	this.requestProcessor[request.cmd](request);
};
Session.prototype.log = function(type, detail) {
    console.log('[Session ' + this.sessionid + '] ' + type.toUpperCase() + ' - ' + (detail || '') );
};
Session.prototype.end = function(data){
};
Session.prototype.onConnectionClose = function(){
	this.log('onConnectionClose', 'TODO - stop cache for this connection');
	this.cache.destroy();
};



var viewFactory = {

	getView: function(vref) {
		console.log('viewFactory::getView(' + vref + ')');
		vref = new ViewReference(vref);
		var factory = this[vref.type];
		var view;
		if(factory) view = factory(vref);
		if(view) view.vref = vref.raw;
		else view = {vref: vref.raw, title: 'Unknown Vref: ' + vref.raw, status: 'unknown'};
		return view;
	},

	user: function(vref) {
		if(vref.subtype === 'position') {
			return {
				item: { dref:vref.id }
			};
		}
	},

	price: function(vref) {
		if(vref.subtype === 'trade') {
			var icon1 = 'icon1', icon2 = 'icon2';
			
			switch(vref.id) {
				case 'si1001':
					icon1 = 'icon3';
					icon2 = 'icon4';
					break;
				case 'si1002':
					icon1 = 'icon2';
					icon2 = 'icon3';
					break;
			}

			return {
				item: { dref:vref.id },
				icon1: icon1,
				icon2: icon2
			};
		}
		else if(vref.subtype === 'info') {
			return {
				item: { dref:vref.id }
			};
		}
	},


	menu: function(vref) {
		if(vref.subtype === 'usr') {
			return {
				title : 'Watchlists',
				items: [
					{ title : "Popular Markets", navigateVref : "menupr/usr/wi100" },
					{ title : "Top Risers", navigateVref : "menupr/usr/wi101" },
					{ title : "Top Fallers", navigateVref : "menupr/usr/wi102" }
				]
			};
		}
		else if(vref.subtype === 'home') {
			return {
				title : 'Browse',
				items: [
					{ title : "Shares", navigateVref : "menu/shares/0" },
					{ title : "Indices", navigateVref : "menu/indices/0" },
				]
			};
		}
		else if(vref.subtype === 'sports') {
			if(vref.id === '0') {
				var items = [];
				for(var i = 1000; i < 1100; i++) {
					items.push({dref: 'ss' + i});
				}
				return {
					title : 'Browse',
					navigateVref: "menupr/sports/",
					items: items
				};
			}
			else {
				var items = [];
				for(var i = 1000; i < 1100; i++) {
					items.push({dref: 'si' + i});
				}
				return {
					title : vref.id,
					items: items
				};
			}
		}
	},

	menupr: function(vref) {
		if (vref.id == "wi100")
        {
        	return {
				title : 'Popular Markets',
				navigateVref: "price/trade/",
				items: [
					{ dref:"si1000" },
		            { dref:"si1001" },
		            { dref:"si1002" },
		            { dref:"si1003" },
		            { dref:"si1004" },
		            { dref:"si1005" },
		            { dref:"si1006" },
		            { dref:"si1007" },
		            { dref:"si1008" },
		            { dref:"si1009" },
		            { dref:"si1010" },
		            { dref:"si1011" }
				]
			};
		}
        else if (vref.id == 'wi101')
        {
        	return {
				title : 'Top Risers',
				navigateVref: "price/trade/",
				items: [
					{ dref:"si1100" },
		            { dref:"si1101" },
		            { dref:"si1102" }
				]
			};
		}
		else if (vref.subtype === 'sports')
        {
			var items = [];
			for(var i = 1000; i < 1100; i++) {
				items.push({dref: 'si' + i});
			}
			return {
				title : vref.id,
				items: items
			};
		}
        else
        {
        	return {
				title : 'Top Fallers',
				navigateVref: "price/trade/",
				items: [
					{ dref:"si1200" },
		            { dref:"si1201" },
		            { dref:"si1202" }
				]
			};
		}	
	}

};



