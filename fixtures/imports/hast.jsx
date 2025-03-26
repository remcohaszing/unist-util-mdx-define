/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
import { useState } from 'react'
export const a = 'hast export a'
export const b = 'hast export b'
function _createMdxContent(props) {
  return <></>
}
export default function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {}
  return MDXLayout ? (
    <MDXLayout {...props}>
      <_createMdxContent {...props} />
    </MDXLayout>
  ) : (
    _createMdxContent(props)
  )
}
