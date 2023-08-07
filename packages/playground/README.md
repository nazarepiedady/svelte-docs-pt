You may use this package to experiment with your changes to Svelte.

To prevent any changes you make in this directory from being accidentally committed, run `git update-index --skip-worktree ./**/*.*` in this directory.

If you would actually like to make some changes to the files here for everyone then run `git update-index --no-skip-worktree ./**/*.*` before committing.

If you're using VS Code, you can use the "Playground: Full" launch configuration to run the playground and attach the debugger to both the compiler and the browser. This will SSR the component and then also hydrate it on the client side using rollup to bundle any other imports.

You can also just compile the `App.svelte` file by running `node compile.js` if you'd like to check some compiler behaviour in isolation.
