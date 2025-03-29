;(async () => {
  /*@jsxRuntime automatic*/
  /*@jsxImportSource react*/
  'use strict'
  const b = 'mdast function-body export b'
  const a = 'original'
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
    b,
    a,
    default: MDXContent
  }
})()
