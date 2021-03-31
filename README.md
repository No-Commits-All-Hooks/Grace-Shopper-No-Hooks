# Grace-Shopper-No-Hooks
Capstone FullStack Web Developer Project

Running this code in development
npm run start-dev will make great things happen!

If you want to run the server and/or webpack separately, you can also npm run start-server and npm run build-client.

Contribution guide

The contribution process is...

Make an issue (or multiple issues)

Make a PR that references that issue

Get it code reviewed by someone on the team, address any comments

Merge into master (with merge commit)

Code style guide

Pay attention to the linter!

Don't use semicolons

Two spaces -- for indentation

Trailing commas where possible

Use const or let over var

Use require and module.exports in .js files

Use import and export in .jsx files, unless require makes for cleaner code

Put import statements at top

Put the default export at bottom

Consider splitting up any file larger than 50 lines

Define container components and presentational components in separate files

Use the "ducks" pattern for redux

Name files using lowercase-and-dashes instead of camelCase or PascalCase, except for when the default export is a class, then use PascalCase

Define react components as pure functions (instead of classes) whenever possible

Single quotes for strings – except to avoid escaping

No unused variables

Space after keywords if (condition) { ... }

Space after function name function name (arg) { ... }

Always use === instead of ==

Linter Guide

npm install -g eslint

In the root of your project, eslint --init

You will then be prompted to choose how you want to configure ESLint - follow the style guide above

Commit message guide
