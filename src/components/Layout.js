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

  h3,
  h4 {
    margin-top: 20px;
    margin-bottom: 20px;
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

export default ({
  site,
  title,
  date,
  readingTime,
  twitterEmbedVideo,
  frontmatter = {},
  children,
}) => {
  const {
    description: siteDescription,
    keywords: siteKeywords,
    twitter,
  } = site.siteMetadata

  const {
    keywords: frontmatterKeywords,
    description: frontmatterDescription,
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
            content: description,
          },
          { name: 'twitter:label1', value: 'Reading time' },
          { name: 'twitter:data1', value: readingTime },
          { name: 'article:published_time', content: date },
          ...((twitterEmbedVideo || '').length
            ? [
                {
                  name: 'twitter:player',
                  value: twitterEmbedVideo,
                },
                {
                  name: 'twitter:player:width',
                  value: 1280,
                },
                {
                  name: 'twitter:player:height',
                  value: 720,
                },

                {
                  name: 'twitter:image',
                  value:
                    'https://s3.amazonaws.com/johnlindquist-images/eggo-1280x720.jpg',
                },

                {
                  name: 'twitter:card',
                  value: 'player',
                },
                {
                  name: 'twitter:site',
                  value: twitter,
                },
              ]
            : []),
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
              maxWidth: rhythm(30),
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
