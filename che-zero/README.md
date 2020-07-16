# Che-Zero

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Coding Style and Guidelines

This project uses ESLint and Prettier to apply automatic code formatting.
If you are using VSCode, make sure to install the recommended extensions.
For VSCode to recognize settings and recommended extensions,
it might be necessary that the folder containing this README is the root folder of your workspace.

### const vs function

To define functions we use `const` and never `function`.
While there is no difference in most cases, we'd like to maintain a consistent code style.
This excludes class methods as they use neither.

### Naming patterns

- Folder names: kebap_case
- File names
  - PascalCase for files (mainly) containing a component or class
  - camelCase for the rest, e.g. files with utility functions or multiple type/interface definitions
- File content
  - PascalCase for components, classes, interfaces, types
  - camelCase for everything else, e.g. functions (except functional components), consts, variables, parameters, etc.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
