const factory = require('../../model_factory');
const uniq = factory.uniq;
const getter_filter = factory.getter_filter;

const castStuffMixin = Base => class extends Base {
    to_data(opt) {
        const resource = this;
        const result = {};
        opt = opt || {};
    
        // 원래 테이블의 속성을 우선 가져온다.
        let keys = resource.attribute_names;


        // include 옵션이 있는 경우
        if (opt.include) {
            // 그 값은 배열이어야 하며, 기존 키 위에 추가한다.
            keys = uniq([...opt.include, ...keys]);
        }
        
        // 별다른 키 포함 옵션이 없다면
        else {
            // 클래스로 정의한 속성도 추가한다.
            keys = uniq([...getter_filter(resource), ...keys]);
        }

        // only 옵션이 있는 경우
        if (opt.only) {
            // 그 값은 배열이어야 하며, 그것을 키로 받는다.
            keys = opt.only;
        }
    
        // 속성들을 돌면서 오브젝트로 변환한다.
        keys.forEach(key => {
          let value = resource[key];
    
          if (opt.except && opt.except.includes(key)) {
            // except 옵션이 있고 그 배열에 키가 존재하면 스킵한다.
          } else {
            if (value instanceof Array) {
                result[key] = value.map(v => {
                    return typeof v['to_data'] === 'function' ? v.to_data() : v;
                });
            }
        
            else {
                result[key] = value && value['to_data'] === 'function' ? value.to_data() : value;
            }
          }
        });
    
        return result;
    }



    to_json() {
        const resource = this;
        return JSON.stringify(resource.to_data());
    }
};

module.exports = castStuffMixin;