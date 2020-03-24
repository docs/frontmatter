# @github-docs/frontmatter

> Parse and validate YAML frontmatter

This is a frontmatter parser built on [`gray-matter`](https://ghub.io/gray-matter) that supports optional frontmatter validation using a [revalidator](https://ghub.io/revalidator) JSON schema.

## Installation

This is a [Node.js](https://nodejs.org/) module available through the 
[npm registry](https://www.npmjs.com/).

```sh
npm install @github-docs/frontmatter
```

## Features

- Make frontmatter entries required or optional
- Validate value type, length, pattern, etc. See the [revalidator#schema](https://github.com/flatiron/revalidator#schema).
- Validate urls, emails, IP addresses, dates, times, etc. See [revalidator#format](https://github.com/flatiron/revalidator#format).
- Set an explicit list of allowable values with [`enum`](https://github.com/flatiron/revalidator#enum).
- Enforce a specific order of frontmatter values with `validateKeyOrder`
- Disallow values that are not specified in the schema with `validateKeyNames`

## Usage

```js
const frontmatter = require('@github-docs/frontmatter')

const schema = {
  properties: {
    title: {
      type: 'string',
      required: true
    },
    meaning_of_life: {
      type: 'number',
      minimum: 40,
      maximum: 50
    }
  }
}

const markdown = `---
title: Hello, World
meaning_of_life: 42
---

I am content.
`

const { data, content, errors } = frontmatter(markdown)
```

## API

### `frontmatter(markdown, [options])`

Parses a string containing markdown and (optional) frontmatter.

- `markdown` String (required) - the contents of a markdown file that includes YAML frontmatter.
- `options` Object (optional)
  - `schema` Object - A [revalidator](https://ghub.io/revalidator) JSON schema.
  - `filepath` String - The name of the file being parsed. Useful for debugging when errors occur.
  - `validateKeyNames` Boolean - If `true`, checks that all keys are specified as schema properties. Defaults to `false`
  - `validateKeyOrder` Boolean - If `true`, checks that all keys are in the same order they appear in the schema. Defaults to `false`


### `frontmatter.stringify(markdown, [data], [opts])`

This is the same [`stringify`](https://github.com/jonschlinkert/gray-matter#stringify) method exported by the `gray-matter` module, which can be used to join a markdown string and a frontmatter object together as a single string.

- `file` StringObject - The content string to append to stringified front-matter, or a file object with file.content string.
- `data` Object - Front matter to stringify.
- `options` Object - Options to pass to gray-matter and js-yaml.
- `returns` String - Returns a string created by wrapping stringified yaml with delimiters, and appending that to the given string.

## License

MIT
