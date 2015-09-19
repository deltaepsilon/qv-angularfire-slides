(function () {
    var env = {
        "firebaseRoot": "https://qv-angularfire-slide.firebaseio.com/"
    };

    if (window) {
        window.env = env;
    } else if (module && module.exports) {
        module.exports = env;
    }
})();