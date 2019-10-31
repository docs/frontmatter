const matter = require('gray-matter')
const revalidator = require('revalidator')
const { difference, intersection } = require('lodash')

module.exports = function frontmatter (markdown, opts = { validateKeyNames: false, validateKeyOrder: false }) {
  const schema = opts.schema || { properties: {} }
  const filepath = opts.filepath || null
  const { content, data } = matter(markdown)
  const allowedKeys = Object.keys(schema.properties)
  const existingKeys = Object.keys(data)
  const expectedKeys = intersection(allowedKeys, existingKeys)

  let { errors } = revalidator.validate(data, schema)

  // add filepath property to each error object
  if (errors.length && filepath) {
    errors = errors.map(error => Object.assign(error, { filepath }))
  }

  // validate key names
  if (opts.validateKeyNames) {
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

  // validate key order
  if (opts.validateKeyOrder && existingKeys.join('') !== expectedKeys.join('')) {
    const error = {
      property: 'keys',
      message: `keys must be in order. Current: ${existingKeys.join(',')}; Expected: ${expectedKeys.join(',')}`
    }
    if (filepath) error.filepath = filepath
    errors.push(error)
  }

  return { content, data, errors }
}
