/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
export const a = 'hast export a'
export const b = 'hast export b'
import { useState } from 'react'
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
