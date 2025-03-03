;(() => {
  /*@jsxRuntime automatic*/
  /*@jsxImportSource react*/
  'use strict'
  const a = 'hast function-body export a'
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
    default: MDXContent
  }
})()
