# Grace-Shopper-No-Hooks

Built a Fullstack Academy e-commerce store integrated with stripe. On this site customers can order Fullstack Academy souvenirs and gear. 

## Running this code in development

1. Clone this repo
2. Run `npm install` from inside the cloned directory
3. `npm run client:dev` will make great things happen!

If you want to run the server and/or webpack separately, you can also `npm run server:dev` and `npm run client:dev`.

## Contribution guide

The contribution process is...

1. Make an issue (or multiple issues)
2. Make a PR that references that issue
3. Get it code reviewed by someone on the team, address any comments
4. Merge into master (with merge commit)

### Code style guide

- Trailing commas where possible
- Use `const` or `let` over `var`
- Use `require` and `module.exports` in `.js` files
- Use `import` and `export` in `.jsx` files, unless `require` makes for cleaner code
- Put import statements at top
- Put the default export at bottom
- Define container components and presentational components in separate files
- Use the ["ducks" pattern](https://github.com/erikras/ducks-modular-redux) for redux
- Define react components as pure functions (instead of classes) whenever possible
- No unused variables
- Always use `===` instead of `==`


### Commit message guide

[See here](https://seesparkbox.com/foundry/semantic_commit_messages)
