# @github-docs/frontmatter

> Parse and validate YAML frontmatter

This is a frontmatter parser built on [`gray-matter`](https://ghub.io/gray-matter) that supports optional frontmatter validation using a [revalidator](https://ghub.io/revalidator) JSON schema.

## Installation

This is a [Node.js](https://nodejs.org/) module available through the 
[npm registry](https://www.npmjs.com/).

```sh
npm install @github-docs/frontmatter
```

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

This module exports a single function:

### `frontmatter(markdown, [options])`

- `markdown` String (required) - the contents of a markdown file that includes YAML frontmatter.
- `options` Object (optional)
  - `schema` Object - A [revalidator](https://ghub.io/revalidator) JSON schema.
  - `filepath` String - The name of the file being parsed. Useful for debugging when errors occur.
  - `validateKeyNames` Boolean - If `true`, checks that all keys are specified as schema properties. Defaults to `false`
  - `validateKeyOrder` Boolean - If `true`, checks that all keys are in the same order they appear in the schema. Defaults to `false`

## License

MIT
