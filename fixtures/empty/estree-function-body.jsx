;(async () => {
  /*@jsxRuntime automatic*/
  /*@jsxImportSource react*/
  'use strict'
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
})()
