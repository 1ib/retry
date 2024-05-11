# <package_name>

<package_description>

```ts
  <package_demo>
```

## Install

### Node.js

Install using [npm][npm] or [yarn][yarn]:

```
npm install <package_author_name>/<package_name>

# or

yarn add <package_author_name>/<package_name>
```

Import into your Node.js project:

```js
// CommonJS
const { <package_name> } = require("<package_author_name>/<package_name>")

// ESM
import { <package_name> } from "<package_author_name>/<package_name>"
```

### Deno

Install using [JSR](https://jsr.io):

```shell
deno add <package_author_name>/<package_name>

#or

jsr add <package_author_name>/<package_name>
```

Then import into your Deno project:

```js
import { <package_name> } from "<package_author_name>/<package_name>"
```

### Bun

Install using this command:

```
bun add <package_author_name>/<package_name>
```

Import into your Bun project:

```js
import { <package_name> } from "<package_author_name>/<package_name>"
```

### Browser

It's recommended to import the minified version to save bandwidth:

```js
import { <package_name> } from "https://cdn.skypack.dev/<package_author_name>/<package_name>?min"
```

However, you can also import the unminified version for debugging purposes:

```js
import { <package_name> } from "https://cdn.skypack.dev/<package_author_name>/<package_name>"
```

## License

This project is licensed under the <package_license>.

## Author

[<package_author_name>](https://github.com/<package_author_name>)

---

Feel free to customize this template according to the needs of your package. If your package requires more complex setup, it's good to include detailed instructions on configuration, API references, and a changelog. Always ensure that the documentation is up to date with the latest code changes.
