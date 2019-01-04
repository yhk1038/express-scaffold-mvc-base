module.exports = (self, data_object) => {
    if (!data_object) return false;

    self.attribute_names = Object.keys(data_object);
    for (let [k, v] of Object.entries(data_object)) {
        self[k] = v;
    }
}