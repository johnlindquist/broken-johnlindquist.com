import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import { MDXProvider } from '@mdx-js/tag'
import { css, Global } from '@emotion/core'
import { rhythm } from '../utils/typography'
import mdxComponents from './mdx'

const globalStyles = css`
  html,
  body {
    margin: 0;
    padding: 0;
  }

  ${() => {
    /* Override PrismJS Defaults */ return null
  }} pre {
    padding: 0.5rem;
  }

  .gatsby-highlight-code-line {
    background-color: #4f424c;
    display: block;
    margin-right: -1em;
    margin-left: -1em;
    padding-right: 1em;
    padding-left: 1em;
  }
`

export default ({ site, title, frontmatter = {}, children }) => {
  const {
    description: siteDescription,
    keywords: siteKeywords,
  } = site.siteMetadata

  const {
    keywords: frontmatterKeywords,
    description: frontmatterDescription,
    date,
  } = frontmatter

  const keywords = (frontmatterKeywords || siteKeywords).join(', ')
  const description = frontmatterDescription || siteDescription

  return (
    <Fragment>
      <Helmet
        title={title}
        meta={[
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0',
          },
          { name: 'description', content: description },
          { name: 'keywords', content: keywords },
          { name: 'twitter:title', content: title },
          {
            name: 'twitter:description',
            content: 'The best darn blog on the whole darn internet',
          },
          { name: 'twitter:label1', value: 'Reading time' },
          { name: 'twitter:data1', value: '5 min read' },
          { name: 'article:published_time', content: date },
        ]}
      >
        <html lang="en" />
      </Helmet>
      <Global styles={globalStyles} />
      <MDXProvider components={mdxComponents}>
        <Fragment>
          <div
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              maxWidth: rhythm(26),
              minWidth: rhythm(13),
              padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
            }}
          >
            {children}
          </div>
        </Fragment>
      </MDXProvider>
    </Fragment>
  )
}

export const pageQuery = graphql`
  fragment site on Site {
    siteMetadata {
      title
      description
      author
      keywords
    }
  }
`
