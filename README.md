## Grants Eligiblity Form React app
>This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).


Ensure all required modules are installed:
```sh
npm install
```


To run the app in a node server, featuring SASS watching and recompiling:
```sh
npm start
```


Build a static version of the form page in the /build folder:
```sh
npm run build
```

### Tests

We use cypress.io for running end-to-end tests.

To run and build new tests, run `cypress` in interactive mode. Cypress will open in a new window and you need to select the test spec file you'd like to run. You can experiment with new browsers, replay tests, and continue testing the app after tests have ran.

```sh
yarn cy:open
```

Make sure you are also running the app using `yarn start`.


To run the test suite as CI would run it, use

```sh
yarn test
```

This will run both the app and the tests at the same time.
