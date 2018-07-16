define([], function () {
    return {
        serializeObject(obj) {
            console.log(obj);
            var newObj = [];
            _.forEach(obj, function(value, key) {
                var tempVal = {};
                tempVal.name = key;
                tempVal.value = value;
                newObj.push(tempVal);
            });
            return newObj;
        }
    }
});