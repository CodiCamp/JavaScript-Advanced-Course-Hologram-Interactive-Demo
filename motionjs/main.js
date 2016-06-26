
if (!localStorage._id) {
    localStorage._id = Date.now();
}

gyro.startTracking(function(o) {
    var b = document.getElementById('example'),
        f = document.getElementById('features');

    f.innerHTML = gyro.getFeatures();
    b.innerHTML = "<p> x = " + o.x.toFixed(2) + "</p>" +
        "<p> y = " + o.y + "</p>" +
        "<p> z = " + o.z + "</p>" +
        "<p> alpha = " + o.alpha + "</p>" +
        "<p> beta = " + o.beta + "</p>" +
        "<p> gamma = " + o.gamma + "</p>" +
        "<p> id = " + localStorage._id + "</p>";
});