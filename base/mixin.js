class MixinBuilder {  
  constructor(superclass) {
      this.superclass = superclass;
  }

  with(...mixins) { 
      return mixins.reduce((c, mixin) => mixin(c), this.superclass);
      // 위의 한줄은 아래의 코딩과 같은 내용이다.
      // return mixins.reduce(function(c, mixin){
      //     return mixin(c); // c -> this.superclass를 의미한다.
      // }, this.superclass) 
  }
}

const mix = (superclass) => new MixinBuilder(superclass);

module.exports = mix