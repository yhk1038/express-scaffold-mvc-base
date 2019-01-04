module.exports = (resource) => {
    const props = Object.getOwnPropertyNames(resource.__proto__);

    return props.filter(prop => {
        return resource.__lookupGetter__(prop);
    });
}