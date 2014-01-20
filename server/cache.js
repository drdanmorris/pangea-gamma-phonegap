var _ = require('underscore'),
	util = require('util'),
    common = require('./common'),
    events = require('events').EventEmitter,
    CLOCKSPEED = 1000
	;

/*
==============================================================================================================
    Helper functions.
    Not in the global scope per-se, as node.js will create a closure for this Module.
==============================================================================================================
*/

// var regexForDoubleExpression = /(\d+)\:(\d+)(?:\{([\+\-]+)\})?(?:>(\d+)\:(\d+)(?:\{([\+\-]+)\})?)?/,
//     regexForIntExpression = /(\d+)(?:-(\d+))?(?:>(\d+)(?:-(\d+))?)?/;


var NumberInfo = function(sign) {
    this.negative = false;
    this.negativeOnly = false;
    this.increment = null;
    if(sign === '-') this.negativeOnly = true;
    else if(sign === '+-' || sign === '-+' ) this.negative = true;
};
var DoubleInfo = function(scale, precision, sign) {
    NumberInfo.call(this, sign);
    this.scale = parseInt(scale);
    this.precision = parseInt(precision);
};
common.extend(DoubleInfo, NumberInfo);

var IntInfo = function(from, to, sign) {
    NumberInfo.call(this, sign);
    this.from = parseInt(from);
    this.to = parseInt(to);
};
common.extend(IntInfo, NumberInfo);


// parse the definition of an Item Property to yeild a PropertySchema object for the Property.
function parsePropertyDefinition(propname, propval, schemaFn) {
    var propertySchema = new PropertySchema(propname, propval);

    if (propval.match(/^[$\[]/)) {

        if (!propval.match(/^\$?\[(?:string|int|double)\([^\)]+\)/)) {
            propval.val = 'invalid expression';
            return propertySchema;
        }
        
        var defn = propval.match(/\[([^\]]+)\]/)[1];
        var type = propertySchema.type = defn.match(/^[a-z]+/)[0];
        var expression = defn.match(/\(([^\)]+)\)/)[1];
        propertySchema.template = expression;

        var match;
        if(match = expression.match(/=(.+)/)) {
            // calculation with reference prop
            propertySchema.template = match[1];
            propertySchema.updateFn = buildAdHocExpression(propertySchema);
            if(type === 'double') {
                var refProp;
                var refPropMatch = propertySchema.template.match(/^([^\+\-\*\/]+)/);
                if(refPropMatch) {
                    propertySchema.numberInfo = getNumericTypeFromRefProp(schemaFn, refPropMatch[1]);
                    if(!propertySchema.numberInfo) {
                        propval.val = 'invalid expression';
                        return propertySchema;
                    }
                }
            }
        }
        else if(match = expression.match(/\^(.+)/)) {
            // Change in reference prop
            propertySchema.template = match[1];
            propertySchema.updateFn = getChangeForCacheProp;
            propertySchema.reportMode = '*';
            if(type === 'double') {
                propertySchema.numberInfo = getNumericTypeFromRefProp(schemaFn, propertySchema.template);
                if(!propertySchema.numberInfo) {
                    propval.val = 'invalid expression';
                    return propertySchema;
                }
            }
        }
        else {
            if(propertySchema.type === 'string') {
                propertySchema.updateFn = getStringForCacheProp;
            }
            else {
                // Numeric prop

                if(propertySchema.type === 'int') {
                    propertySchema.updateFn = getIntForCacheProp;
                    var numericTypeMatch = expression.match(/(\d+)(?:-(\d+))?(?:\{([\+\-]+)\})?(?:>(\d+)(?:-(\d+))?(?:\{([\+\-]+)\})?)?/);
                    propertySchema.numberInfo = new IntInfo(numericTypeMatch[1], numericTypeMatch[2], numericTypeMatch[3]);
                    if(numericTypeMatch[4]) {
                        propertySchema.numberInfo.increment = new IntInfo(numericTypeMatch[4], numericTypeMatch[5], numericTypeMatch[6]);
                    }
                }
                else if(propertySchema.type === 'double') {
                    propertySchema.updateFn = getDoubleForCacheProp;
                    var numericTypeMatch = expression.match(/(\d+)\:(\d+)(?:\{([\+\-]+)\})?(?:>(\d+)\:(\d+)(?:\{([\+\-]+)\})?)?/);
                    propertySchema.numberInfo = new DoubleInfo(numericTypeMatch[1], numericTypeMatch[2], numericTypeMatch[3]);
                    if(numericTypeMatch[4]) {
                        propertySchema.numberInfo.increment = new DoubleInfo(numericTypeMatch[4], numericTypeMatch[5], numericTypeMatch[6]);
                    }
                }
            }
        }
    }
        
    if (propval.match(/^\$/))
        propertySchema.isVolatile = false;

    if (match = propval.match(/([^\]]+)$/))
        propertySchema.reportMode = match[1];

        
    return propertySchema;
}
function getNumericTypeFromRefProp(schemaFn, refPropName) {
    if(refPropName) {
        var refProp = schemaFn.prototype['__' + refPropName];
        if(refProp) return refProp.numberInfo;
    }
    return null;
}
function buildAdHocExpression(propertySchema) {
    var fn = '(function getExpressionForCacheProp(cacheprop){ var val; with(cacheprop.item){ val = ' + propertySchema.template + ' } return val; })';
    fn = eval(fn);
    return fn;
}
function getChangeForCacheProp(cacheprop) {
    var template = cacheprop.schema.template;
    var res = cacheprop.item['_' + template].change;
    return res;
}
function camelCase(string) {
    return string[0].toUpperCase() + string.substring(1);
}
function getStringForCacheProp(cacheprop) {
    var template = cacheprop.schema.template;
    var src = 'abcdefghijklmnopqrstuvwxyz';
    var res = template.replace(/{[^}]+}/g, function (match, number) {
        //console.log('match=' + match);
        var matchdetails = /(\d+)(?:\:(\w))/.exec(match);
        //console.log('matchdetails=' + matchdetails);
        var length, modifier;
        length = parseInt(matchdetails[1]);
        if (matchdetails.length == 3) {
            modifier = matchdetails[2];
        }

        var start = Math.floor((Math.random() * (src.length - length)) + 1);
        //console.log('match=' + match + ', start=' + start + ', length=' + length);
        var s = src.substring(start, start + length);

        if (modifier === 'U') {
            s = s.toUpperCase();
        }
        else if (modifier === 'C') {
            s = camelCase(s);
        }

        return s;
    });

    return res;
}
function getNumberForCacheProp(cacheprop, fnGet) {
    
    // call cached update fn if we have already been here.  Note that this is a per-instance cached fn
    // and is different to the schema.updateFn (which is actually *this* function).
    if(cacheprop.updateFn) 
        return cacheprop.updateFn();

    // check if we are using a 'first>then' strategy
    if(cacheprop.schema.numberInfo.increment) {

        // create cached update function for the subsequent calls which use the '>then' strategy
        cacheprop.updateFn = function() {
            var num = fnGet(cacheprop.schema.numberInfo.increment);
            return cacheprop.val + num;
        };

    }
    else {
        // only a 'first' strategy defined;  cache a simple function to return random number.
        cacheprop.updateFn = function() { return fnGet(cacheprop.schema.numberInfo); };
    }

    var num = fnGet(cacheprop.schema.numberInfo);
    return num;
}
function getDoubleForCacheProp(cacheprop) {
    return getNumberForCacheProp(cacheprop, getDouble);
}
function getIntForCacheProp(cacheprop) {
    return getNumberForCacheProp(cacheprop, getInt);
}
function getInt() {
    var from, to, numberInfo;
    if(arguments.length == 1) {
        numberInfo = arguments[0];
        from = numberInfo.from;
        to = numberInfo.to;
    }
    else
    {
        from = arguments[0];
        to = arguments[1];
    }

    var num = Math.floor((Math.random() * to) + from);

    if(numberInfo) {
        if(numberInfo.negativeOnly) num *= -1;
        else if(numberInfo.negative && getInt(1,10) % 2) {
            num *= -1;
        }
    }

    return num;
}
function getDouble(numberInfo) {
    var num = Math.random();
    while(num < 0.1) num *= 10;
    num =  (num * Math.pow(10, numberInfo.scale-numberInfo.precision));
    if(numberInfo.negativeOnly) num *= -1;
    else if(numberInfo.negative && getInt(1,10) % 2) {
        num *= -1;
    }
    return parseFloat(num.toFixed(numberInfo.precision));
}

var PropertySchema = function(propname, propval) {
    this.name = propname;
    this.type = null;
    this.numberInfo = null;
    this.val = propval;
    this.isVolatile = true;
    this.template = null;
    this.updateFn = null;
    this.reportMode = null;
};
PropertySchema.prototype.isNumeric = function() {
    return 'int,double'.indexOf(this.type) > -1;
};


function isNumeric(val) {
    return ('' + val).match(/^[\d\.]+$/);
}

/*
==============================================================================================================
    CacheProperty:  an instance of an Item property.  
    An Item instance will comprise one or more CacheProperties.
==============================================================================================================
*/
var CacheProperty = function(item, schema) {
    this.item = item;  // parent
    this.schema = schema;  // definition from __proto__
    this.val = schema.val;
    this.updateCount = 0;
    this.change = 0;
    this.initialUpdate = true;
    this.init();
};
CacheProperty.prototype.update =  function (iteration) {
    if (this.schema.isVolatile) {
        return this.updateProperty();
    }
    return false;
};
CacheProperty.prototype.applyChange =  function (change) {
    this.change = change;
    this.val += change;
};
CacheProperty.prototype.init =  function () {
    this.updateProperty();
    this.isNumeric = this.schema.isNumeric();
};
CacheProperty.prototype.updateProperty =  function () {
    if (this.schema.updateFn) {
        var newval = this.schema.updateFn(this);
        if(this.isNumeric) {
            this.change = newval - this.val;
        }
        var propname = this.schema.name;
        this.val = this.item[propname] = newval;
        this.updateCount++;
        //console.log(this.item.id + '::' + propname + ' set to ' + this.val);
        return true;
    }
    return false;
};




/*
==============================================================================================================
    asSchemaFn:  a mixin function to all common behaviour to schema functions.
    A schemaFn is a constuctor function which creates a new Item based on the registered schema definition
    for a prefix.
==============================================================================================================
*/
var asSchemaFn = function () {
    this.proplist = [];
    this.enabled = true;
    this.iteratePropNames = function (cb) {
        var my = this;
        var i = 0;
        _.each(this.proplist, function (prop) {
            cb(prop, i++);
        });
    }
    this.iterateCacheProperties = function (cb) {
        var my = this;
        var i = 0;
        _.each(this.proplist, function (prop) {
            cb(my['_' + prop], i++);
        });
    }
    this.update = function (iteration) {
        if(!this.enabled) return;
        var updatedProps = 0;
        if(iteration % this.volatility == 0) {
            this.iterateCacheProperties(function(prop, propnum){
                if(prop.update(iteration)) {
                    var propmask = (1 << propnum);
                    updatedProps |= propmask;
                }
            });
        }
        return updatedProps;
    }
    this.init = function () {
        //console.log('schemaFn init');
        var my = this;
        this.iteratePropNames(function(prop){
            var cachePropName = '_' + prop;
            var schemaPropName = '__' + prop;
            my[cachePropName] = new CacheProperty(my, my[schemaPropName]);
        })

        //console.log('initialised: ' + util.inspect(my));
    }
    this.report = function (initial, updatedProps, cbReport) {
        var my = this;
        var report = { isInitial: initial };
        var my = this;
        this.iterateCacheProperties(function(prop, propnum){
            var propname = prop.schema.name;
            if(prop.schema.reportMode === '*' || my.reportPropYN(initial, updatedProps, propnum)) {
                var val = my[propname]; 
                if(prop.schema.type === 'double') {
                    val = val.toFixed(prop.schema.numberInfo.precision);
                }
                report[propname] = '' + val;  
            }
        })
        cbReport(report);
    }
    this.reportPropYN = function (initial, updatedProps, propnum) {
        if(initial) return true;
        if(updatedProps) {
            var propmask = (1 << propnum);
            return (propmask & updatedProps) == propmask;
        }
        return false;
    }
    this.applyOverrides = function(options, my) {
        if (options.overrides) {
            for (prop in options.overrides) {
                if (options.overrides.hasOwnProperty(prop)) {
                    var propval = options.overrides[prop];
                    var myprop = '_' + prop;
                    if (my[myprop]) {
                        my[myprop].val = propval;
                        my[prop] = propval;
                    }
                }
            }
        }
    }
    return this;
};





/*
==============================================================================================================
    Cache:  the master repository where Items are created.  
    There is one Cache per connection.  Each Cache contains:
        - a Schema dictionary containing Item ctor functions for each registered prefix.
        - an array (collection) of instantiated Items.
        - an index of (collectionIdex) to instantiated Items, keyed by Id.

    Schemas must first be Registered (by prefix - the leading characters of an id, e.g. 'si100' has a prefix
    of 'si') before Items can be created via the Subscribe method.  

    e.g.,   (i) Register prefix of 'si' for a given schema.
            (ii) Subscribe 'si100', 'si101' and 'si102'
==============================================================================================================
*/
var Cache = function (id) {
    this.id = id;
    this.reset();
};
util.inherits(Cache, events);
Cache.prototype.reset = function () {
    this.schema = {};
    this.collection = [];
    this.collectionIndex = {};
    this.started = false;
    this.iteration = 0;
};
Cache.prototype.register = function (prefix, schema) {
    if(!this.schema[prefix]) {
        this.log('register', prefix + ' ' + util.inspect(schema));
        var itemSchema = this.parseSchema(schema);
        this.schema[prefix] = itemSchema;
    }
};
Cache.prototype.subscribe = function (id, requestId, options) {
    options = _.extend({volatility:null, overrides: null}, options);
    var item = this.collectionIndex[id];
    if(item) {
        item.enabled = true;
    }
    else
    {
        this.log('subscribe', id + ' - creating new subscription');
        var prefix = id.match(/^\D+/)[0];
        //console.log('prefix=' + prefix);
        var schema = this.schema[prefix];
        if(schema) {
            item = new schema(id, options);
            this.collection.push(item);
            this.collectionIndex[id] = item;
        }
    }
    this.reportItem(item, true, null, requestId);
    this.start();
};
Cache.prototype.unSubscribe = function (id, requestId) {
    var item = this.collectionIndex[id];
    if(item) {
        item.enabled = false;
    }
};
Cache.prototype.unsubscribeAll = function (id, requestId) {
     _.each(this.collection, function(item){
        item.enabled = false;
    });
};
Cache.prototype.updateCache = function () {
    var my = this;
    var iteration = this.iteration++;
    _.each(this.collection, function(item){
        if(item.enabled){
            var updatedprops = item.update(iteration);
            if(updatedprops) {
                my.reportItem(item, false, updatedprops);
            }
        }
    });
};
Cache.prototype.reportItem = function(item, initial, updatedprops, requestId) {
    var my = this;
    item.report(initial, updatedprops, function(report){
        my.emit('update', {update: report, requestId: requestId || 0});    
    });
};
Cache.prototype.start = function () {
    if(this.started) return;
    this.log('starting cache');
    this.interval = setInterval(this.updateCache.bind(this), CLOCKSPEED);
    this.started = true;
};
Cache.prototype.stop = function () {
    this.log('stopping cache');
    clearInterval(this.interval);
    this.reset();
};
Cache.prototype.destroy = function () {
    this.stop();
    this.removeAllListeners();
};
Cache.prototype.log = function (type, detail) {
    console.log('(Cache ' + this.id + ') ' + type.toUpperCase() + ' - ' + (detail || ''));
};
Cache.prototype.parseSchema = function (schema) {

    // create unique ctor function for creating Items which conform to this schema
    var schemaFn = function (id, options) {
        this.id = id;
        this.init();
        this.applyOverrides(options, this); // schema properties can be overriden at construction-time
        this.volatility = options.volatility || getInt(1,10);
    }
    // mixin some common schema function behaviour to the prototype of the unique schemaFn
    asSchemaFn.call(schemaFn.prototype);
    

    var propCount = 0;

    for (prop in schema) {
        if (schema.hasOwnProperty(prop)) {
            var propval = schema[prop];
            var propSchema = parsePropertyDefinition(prop, propval, schemaFn);
            var protoSchemaProp = '__' + prop;
            schemaFn.prototype[protoSchemaProp] = propSchema;
            schemaFn.prototype.proplist.push(prop);
            propCount += 1;

            if(propCount > 32)
                throw new Exception('Maximum limit of 32 Properties per Item exceded');
        }
    }

    //this.log('schemaFn.prototype', util.inspect(schemaFn.prototype));

    return schemaFn;
};



module.exports = Cache;


