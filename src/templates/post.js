import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import { rhythm } from '../utils/typography'
import Layout from '../components/Layout'
import { format } from 'date-fns'

let iframeStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  border: '0',
}

export default function Post({
  data: { site, mdx },
  pageContext: { next, prev },
}) {
  const { source, title } = mdx.fields
  const { slug, date, banner } = mdx.frontmatter
  return (
    <Layout title={title} site={site} frontmatter={mdx.frontmatter}>
      <a
        style={{
          textDecoration: 'none',
        }}
        href="/"
      >
        johnlindquist.com
      </a>
      {console.log(mdx.code.body)}
      <h1 style={{ paddingTop: rhythm(0.5) }}>
        {title}
      </h1>
      <h2>{format(date, 'MMMM Do, YYYY')}</h2>

      {banner && (
        <Img
          sizes={banner.childImageSharp.sizes}
          alt={site.siteMetadata.keywords.join(', ')}
        />
      )}

      {source === 'egghead' ? (
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            paddingTop: '56.25%',
          }}
        >
          <iframe
            style={iframeStyle}
            title={title}
            src={`https://egghead.io/lessons/${slug}/embed`}
            frameBorder="0"
          />
        </div>
      ) : null}

      <MDXRenderer>{mdx.code.body}</MDXRenderer>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($id: String!) {
    site {
      ...site
    }
    mdx(fields: { id: { eq: $id } }) {
      frontmatter {
        title
        date
        banner {
          childImageSharp {
            sizes(maxWidth: 900) {
              ...GatsbyImageSharpSizes
            }
          }
        }
        slug
        keywords
      }
      fields {
        title
        source
      }
      code {
        body
      }
    }
  }
`
