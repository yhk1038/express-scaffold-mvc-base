const mixin = require('./mixin');
const [ sugar, mixin_model_stuffs ] = require('./mixin_stuff/model');

const factory = require('./model_factory');
const attr_builder = factory.attr_builder;

class BaseModel extends mixin(sugar).with(...mixin_model_stuffs) {
  constructor(props){
    if (!props) props = {};
    super();
    attr_builder(this, props);
  }

  hello() {
    console.log('world BaseModel!');
  }

  /**
   * Static methods Injecter
   * @description Inject all instance methods from overide class (inherit from BaseModel) to origin class (your ORM).
   *
   * @static
   * @param {baseModel} overide
   * @param {ormModel} origin
   * @returns {origin}
   */
  static injectAllStaticMethods (overide, origin) {
    let staticMethods = this.getAllStaticMethods(overide);
    staticMethods.forEach((method) => {
      eval(`origin.${method} = overide.${method}`)
    });
    return origin
  }
  static getAllStaticMethods (cls) {
    return Object.getOwnPropertyNames(cls).filter(prop => typeof cls[prop] === "function");
  }

  
  /**
   * Instance methods Injecter
   * @description Inject all instance methods from overide class (inherit from BaseModel) to origin class (your ORM).
   *
   * @static
   * @param {baseModel} overide
   * @param {ormModel} origin
   * @returns {origin}
   */
  static injectAllInstanceMethods (overide, origin) {
    let instanceMethods = this.getAllInstanceMethods(overide.prototype);
    instanceMethods.forEach((method) => {
      eval(`origin.prototype.${method} = overide.prototype.${method}`)
    });
    return origin
  }
  static getAllInstanceMethods (cls) {
    return Object.getOwnPropertyNames(cls).filter(prop => typeof cls[prop] === 'function' && prop !== 'constructor');
  }
  
  /**
   * Sync
   * @description Sync overide(custom model) class with origin(ORM model) class
   *
   * @static
   * @param {baseModel} overide
   * @param {ormModel} origin
   * @returns {origin}
   */
  static Sync(overide, origin){
    return this.injectAllInstanceMethods(overide,
      this.injectAllStaticMethods(overide, origin));
  }



  get class() {
    return this.__proto__.constructor;
  }
}

module.exports = BaseModel