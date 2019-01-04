const queryStuffMixin = Base => class extends Base {
    static all(datas) {
        const klass = this;
        klass.all_data = klass.all_data || [];

        if (datas && datas instanceof Array) {
            klass.all_data = datas.map(data => klass.one(data));
        }

        return klass.all_data;
    }


    static one(data) {
        const klass = this;
        return new klass(data);
    }


    static count() {
        const klass = this;
        return klass.all().length;
    }


    static find(id) {
        const klass = this;
        let result = undefined;

        if (id) {
            result = klass.all().filter(resource => resource.id === parseInt(id))[0];
        }

        return result;
    }


    static where(condition, datas) {
        const klass = this;

        let result = klass.all(datas);

        if (condition) {
            result = result.filter(condition)
        }

        return result;
    }

    static first(count) {
        const klass = this;

        count = count || 1;
        count = count > 0 ? count : 1;
        
        let result = klass.all().slice(0, count);

        if (count === 1) {
            result = result[0];
        }

        return result;
    }
};

module.exports = queryStuffMixin