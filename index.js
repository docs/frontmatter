const matter = require('gray-matter')
const revalidator = require('revalidator')
const { difference } = require('lodash')

module.exports = function frontmatter (markdown, opts = { validateKeyNames: false, validateKeyOrder: false }) {
  const schema = opts.schema || { properties: {} }
  const filepath = opts.filepath || null
  const allowedKeys = Object.keys(schema.properties)
  const { content, data } = matter(markdown)

  let { errors } = revalidator.validate(data, schema)

  // add filepath property to each error object
  if (errors.length && filepath) {
    errors = errors.map(error => Object.assign(error, { filepath }))
  }

  // check for keys
  if (opts.validateKeyNames) {
    const existingKeys = Object.keys(data)
    const invalidKeys = difference(existingKeys, allowedKeys)
    invalidKeys.forEach(key => {
      const error = {
        property: key,
        message: `not allowed. Allowed properties are: ${allowedKeys.join(', ')}`
      }
      if (filepath) error.filepath = filepath
      errors.push(error)
    })
  }

  return { content, data, errors }
}
