module.exports = (list, idField = '_id') => {
    const map = {};

    for (let item of list) {
        map[item[idField]] = item;
    }

    return map;
};