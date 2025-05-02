# gui_tests
Test for inint/gui.

## Description
This repository contains tests for the inint/gui project. Tests use "Vitest" framework.
For more information about Vitest, please refer to the [Vitest documentation](https://vitest.dev/).

## Before you start
Make sure file loader.js in GUI contain this code:
```javascript
try {
    if (module && module.exports) {
        module.exports = Loader;
    }
} catch (e) {
}
```

## Setup and run tests
```bash
# To setup the enviroment
npm install

# To run the tests
npm run test
```
