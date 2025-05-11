## Description
This repository contains tests for the inint/gui project. Tests use "Vitest" framework.
For more information about Vitest, please refer to the [Vitest documentation](https://vitest.dev/).


This repo using local package with custom loader. 
This repository uses a custom version of Loader from the GUI repository. It also uses the JSDOm and Recoirace packages.
Some things that are used for loading in the GUI repositories, such as CSS styles or loading via link embedding, do not work here as usual. 
Instead, CSS is not loaded at all, and for everything else, it uses file reading via fs.

## Before you start
Make sure you placed this repo next to `gui` repo. The structure should look like this:
```
.
├── gui
│   ├── ...
│   └── ...
└── gui_tests
    ├── tests
    │   ├── ...
    │   └── ...
    ├── package.json
    └── vitest.config.ts
```

## Setup
```bash
# To setup the enviroment
npm install
```

## How to run tests
```bash
# To run the tests
npm run test
```

If you want to run some specific test you should use command like.
```bash
npm run test:applications
```
You can find more specific commands in package.json.
