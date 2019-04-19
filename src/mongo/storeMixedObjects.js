const setMongoMixedWithBadKeys = data =>
    Array.isArray(data)
        ? data.map(setMongoMixedWithBadKeys)
        : typeof data === 'object'
        ? Object.entries(data).reduce((a, [key,value])=>({...a, [key.replace('.','__').replace('$','___')]:setMongoMixedWithBadKeys(value)}), {})
        : data;

const getMongoMixedWithBadKeys = data =>
    Array.isArray(data)
        ? data.map(getMongoMixedWithBadKeys)
        : typeof data === 'object'
        ? Object.entries(data).reduce((a, [key, value])=> ({...a, [key.replace('__','.').replace('___','$')]:getMongoMixedWithBadKeys(value)}), {})
        : data;

module.exports = {
    setMongoMixedWithBadKeys,
    getMongoMixedWithBadKeys
};
