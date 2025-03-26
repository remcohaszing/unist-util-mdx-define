;(async () => {
  /*@jsxRuntime automatic*/
  /*@jsxImportSource react*/
  'use strict'
  const a = 'original'
  const b = 'hast function-body export b'
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
