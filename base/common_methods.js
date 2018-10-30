const usefulMethodMixin = Base => class extends Base {
  to_object() {
    return JSON.parse(JSON.stringify(this))
  }

  to_json() {
    return JSON.stringify(this)
  }

  hello() {
    console.log(`Hello ${this.class_name}!`)
  }
}

// class UsefulMethod {
//   constructor() {
//     this.class_name = this.constructor.name
//   }

//   to_object() {
//     return JSON.parse(JSON.stringify(this))
//   }

//   to_json() {
//     return JSON.stringify(this)
//   }

//   hello() {
//     console.log(`Hello ${this.class_name}!`)
//   }
// }
module.exports = usefulMethodMixin