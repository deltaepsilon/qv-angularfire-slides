(function () {
    var env = {
        "firebaseRoot": "https://qv-angularfire-slide.firebaseio.com/"
    };

    if (typeof window === 'object') {
        window.env = env;
    } else if (module && module.exports) {
        module.exports = env;
    }
})();