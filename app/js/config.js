Object.prototype.extend = function extend(b){
    for(var key in b) {
        if (b.hasOwnProperty(key)) {
            this[key] = b[key];
        }
    }
    return this;
}
