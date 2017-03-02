Object.prototype.extend = function extend(obj){
    for(var key in obj) {
        if (obj.hasOwnProperty(key)) {
            this[key] = obj[key];
        }
    }

    return this;
};
