
module.exports = (array) => {
    return array.reduce((a,b) => {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
    }, []);
}