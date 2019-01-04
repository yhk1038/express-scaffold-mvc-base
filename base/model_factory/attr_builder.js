module.exports = (self, data_object) => {
    if (!data_object) return false;

    for (let [k, v] of Object.entries(data_object)) {
        self[k] = v;
    }
}