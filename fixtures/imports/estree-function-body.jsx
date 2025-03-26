;(async () => {
  /*@jsxRuntime automatic*/
  /*@jsxImportSource react*/
  'use strict'
  const _importMetaUrl = arguments[0].baseUrl
  if (!_importMetaUrl)
    throw new Error(
      'Unexpected missing `options.baseUrl` needed to support `export … from`, `import`, or `import.meta.url` when generating `function-body`'
    )
  const { useState } = await import(_resolveDynamicMdxSpecifier('react'))
  const a = 'estree function-body export a'
  const b = 'estree function-body export b'
  function _createMdxContent(props) {
    return <></>
  }
  function MDXContent(props = {}) {
    const { wrapper: MDXLayout } = props.components || {}
    return MDXLayout ? (
      <MDXLayout {...props}>
        <_createMdxContent {...props} />
      </MDXLayout>
    ) : (
      _createMdxContent(props)
    )
  }
  return {
    a,
    b,
    default: MDXContent
  }
  function _resolveDynamicMdxSpecifier(d) {
    if (typeof d !== 'string') return d
    try {
      new URL(d)
      return d
    } catch {}
    if (d.startsWith('/') || d.startsWith('./') || d.startsWith('../'))
      return new URL(d, _importMetaUrl).href
    return d
  }
})()
