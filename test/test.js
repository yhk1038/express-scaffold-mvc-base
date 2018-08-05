'use strict';

var expect = require('chai').expect;

var [BaseController, render, __] = require('../base.js').controller;
var base_controller = new BaseController(__filename);
var posts_controller = require('../example/controllers/posts');
base_controller = posts_controller
// console.log(base_controller)


describe('#Module', function() {
  it('should be import BaseController', function() {
    expect(base_controller.constructor.name !== undefined).to.equal(true);
    expect(typeof render).to.equal('function');
    expect(typeof __).to.equal('object');
  });
});

describe('#BaseController', function() {
  it('should load mixin methods', function() {
    console.log(base_controller.class_name)
    // base_controller.hello();
    let values = Object.getOwnPropertyNames(base_controller);
    // console.log(values)
    let methods = Object.getOwnPropertyNames(base_controller.__proto__);
    // console.log(methods);
    expect(typeof base_controller.to_object).to.equal('function');
  });
});

describe('#PostController', function() {
  

  it('should return action chain on the action', function() {
    // console.log(posts_controller.private_methods);
    console.log(posts_controller._actions());
    console.log(posts_controller.index);
  })
})
