module.exports = {
    "extends": "airbnb-base",
    "env": {
        "browser": true,
    },
    "rules": {
        "comma-dangle": ["error", "never"],
        "prefer-destructuring": ["error", {"object": true, "array": false}]
    }
};