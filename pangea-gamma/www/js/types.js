var Vref = function (raw, tabIndex, title) {
	var parts = /(?:([\d]+)\/)?([\w\d]+)\/([\w\d]+)\/([\w\d]+)/.exec(raw);
	this.raw = raw;
	this.tab = null;
	this.type = null;
	this.subtype = null;
	this.id = null;
	this.title = title;
	if (parts.length == 5) {
		this.tab = parts[1] || tabIndex;
		this.type = parts[2];
		this.subtype = parts[3];
		this.id = parts[4];
		this.raw = this.tab + '/' + this.type + '/' + this.subtype + '/' + this.id;
	}
};

var Version = function(raw) {
	this.type = 'Version';
	if(typeof raw === 'string') {
		var parts = raw.split('.');
		this.major = 0;
		this.minor = 0;
		this.build = 0;
		this.revision = 0;
		if(parts.length >= 1) this.major = parseInt(parts[0]);
		if(parts.length >= 2) this.minor = parseInt(parts[1]);
		if(parts.length >= 3) this.build = parseInt(parts[2]);
		if(parts.length >= 4) this.revision = parseInt(parts[3]);
	}
	else if(typeof raw === 'object' && raw.hasOwnProperty('type') && raw.type === 'Version') {
		this.major = raw.major;
		this.minor = raw.minor;
		this.build = raw.build;
		this.revision = raw.revision;
	}
};
Version.prototype.isLessThan = function(other) {
	other = new Version(other);

	if(this.major > other.major) return false;
	if(this.major < other.major) return true;
	// major same


	if(this.minor > other.minor) return false;
	if(this.minor < other.minor) return true;
	// minor same


	if(this.build > other.build) return false;
	if(this.build < other.build) return true;
	// build same


	if(this.revision > other.revision) return false;
	if(this.revision < other.revision) return true;
	// revision same

	return false;
};
Version.prototype.toString = function() {
	var chksum = this.major + this.minor + this.build + this.revision;
	return this.major + '.' +  
		this.minor +'.' +  
		this.build +'.' +  
		this.revision + 
		'[' + chksum + ']';
};


var Tab = function (options) {
		this.history = [];
		this.id = options.id;
		this.title = options.title;
		this.vref = new Vref(options.vref, this.id, this.title);
		this.icon = options.icon;
		this.notifyCount = options.notifyCount;
	};
	Tab.prototype.getVref = function() {
		if (this.history.length > 0) return this.history[this.history.length - 1];
		return this.vref;
	};
