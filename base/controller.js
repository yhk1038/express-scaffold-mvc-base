Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};

let fs = require('fs');
let path = require('path');

// var [mixin, Container] = require('./mixin');
// var useful_methods = require('./common_methods');

let [render, redirect, __] = require('./renderer');


class BaseController {
  constructor(filename){
    this.private_methods = [];
    this._actions = function() {
      return Object.getOwnPropertyNames(this.__proto__).diff(['constructor', 'private']).diff(this.private_methods);
    }

    this.class_name = this.constructor.name;
    this.controllers_name = this.constructor.name;
    this.resource_name = path.basename(filename).replace(/\..+$/, '');
    this.current_action;
    this.current_action_full;

    this.options = {
      expanded_log: false
    };

    this.before_action('accessor_footprint');
  }



  /*******************************
   *  Feature
   *******************************/

  
  /**
   * [Feature]
   * 'before_action'
   * @description define a pre-load method before main action execution
   * 
   * @param {function} method // a middleware
   * @param {Array of functions} actions // middlewares
   * @memberof BaseController
   */
  before_action(method, actions) {
    var klass = this;
    if (!actions || actions.length === 0) {
      actions = klass._actions();
    }
    
    if (!klass.before_actions_dictionary) {
      klass.before_actions_dictionary = {}
    }

    actions.forEach(function(action){
      if (!klass.before_actions_dictionary[action]) {
        klass.before_actions_dictionary[action] = []
      }
      klass.before_actions_dictionary[action].push(klass[method]);
    });
    this.before_actions_dictionary = klass.before_actions_dictionary
  }

  /**
   * [Feature]
   * @description define a private methods (prevent generate action bundle)
   *
   * @param {function(s)} methods // One or Many of functions
   * @memberof BaseController
   */
  private(...methods) {
    methods.forEach((method) => this.private_methods.push(method));
  }

  

  /*******************************
   *  Middleware
   *******************************/

  /**
   * [Middleware]
   * 'Access FootPrint' which is a simple-access-logger
   *
   * {{Middleware Stack Chain Functions's Parameter}}
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof BaseController
   */
  accessor_footprint(req, res, next) {
    console.log("\r\n",
      '#', req.method.toUpperCase(), [req.protocol, [req.hostname, req.url].join('')].join('://'), req.ip, "\r\n",
      '# Goto :', __.klass.current_action_full, "\r\n",
      '# Params :', req.params);
    next();
  }

  /**
   * [Middleware]
   * Hello ~
   *
   * {{Middleware Stack Chain Functions's Parameter}}
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof BaseController
   */
  hello(req, res, next) {
    console.log(`Hello ${__.klass.class_name}!`);
    next();
  }



  /*******************************
   *  Method
   *******************************/

  /**
   * [Method]
   * Cascade Instance to Object
   *
   * @returns <String> json object.
   * @memberof BaseController
   */
  to_object() {
    return JSON.parse(JSON.stringify(this))
  }
  
  /**
   * [Method]
   * Cascade Instance to Json Object
   *
   * @returns
   * @memberof BaseController
   */
  to_json() {
    return JSON.stringify(this)
  }


  /**
   * [Method]
   * Get request format
   * @param {req} req
   * @returns
   * @memberof BaseController
   */
  parse_format(req) {
    const default_format = 'html';
    let format = req.params.format;
    const permitted_formats = ['text', 'txt', 'html', 'json', 'jpg', 'jpeg', 'png', 'gif', 'mp3', 'mp4', 'avi'];

    if (!format) { return default_format }
    format = format.toLowerCase();
    if (!permitted_formats.includes(format)) { return default_format }
    return format
  }



  /*******************************
   *  Stuff
   *******************************/

  /**
   * [Stuff]
   * action_stacks (middleware chain register)
   * : getter, setter
   * : call by 'this.build_pipeline()'
   *
   * @param {Array of func} stack // middleware chain
   * @returns {Array of func} this.action_stack // middleware chain
   * @memberof BaseController
   */
  action_stacks(stack) {
    if (stack) __.klass.action_stack = stack
    console.log('Build Complete!');
    return __.klass.action_stack
  }

  /**
   * [Stuff]
   * build_pipeline (middleware chain builder)
   * : call by 'this.exports(__)'
   * 
   * options
   *    - expanded_log: true // activate additional log in log display
   *
   * @returns {Array of func} this.action_stack // middleware chain
   * @memberof BaseController
   */
  build_pipeline() {
    var klass = this; //__.klass;
    var pipe = {};
    
    klass._actions().forEach(function(action) {
      pipe[action] = [];
      pipe[action].push(function (req, res, next){
        klass.current_url = req.originalUrl;
        klass.current_action = action;
        klass.current_action_full = [klass.controllers_name, klass.current_action].join('#');
        klass.params = Object.assign(req.params, req.query);
        
        if (klass.options.expanded_log) {
          console.log("==================================================================")
          console.log('1. ENTERENCE CALLBACK');
          console.log('- controller :', klass.controllers_name);
          console.log('- action :', action);
          console.log('- params :', klass.params);
          console.log('- klass :', klass);
          // console.log('- req :', req)
          console.log("==================================================================")
        }
        __.klass = klass
        next();
      });
      pipe[action].push(...klass.before_actions_dictionary[action]);
      pipe[action].push(klass[action]);
    });
    
    // console.log('PROGRAM :', program, "\r\n")
    return klass.action_stacks(pipe);
  }

  /**
   * [Stuff]
   * Export method for being called from Router.
   *
   * @param {*} __
   * @returns <Object> call stack of action.
   * @memberof BaseController
   */
  exports(__) {
    console.log(this.constructor.name);
    __.title = this.resource_name;
    __.klass = this;
    return __.klass.build_pipeline();
  }
}

module.exports = [BaseController, {call: [render, redirect]}, __]