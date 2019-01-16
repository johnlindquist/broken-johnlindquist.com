import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import { scale, rhythm } from '../utils/typography'
import Layout from '../components/Layout'

export default function Post({
  data: { site, mdx },
  pageContext: { next, prev },
}) {
  return (
    <Layout
      title={mdx.frontmatter.title}
      site={site}
      frontmatter={mdx.frontmatter}
    >
      <a
        style={{
          textDecoration: 'none',
        }}
        href="/"
      >
        johnlindquist.com
      </a>
      <h1 style={{ paddingTop: rhythm(0.5) }}>{mdx.frontmatter.title}</h1>
      <h2>{mdx.frontmatter.date}</h2>

      {mdx.frontmatter.banner && (
        <Img
          sizes={mdx.frontmatter.banner.childImageSharp.sizes}
          alt={site.siteMetadata.keywords.join(', ')}
        />
      )}

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
        date(formatString: "MMMM DD, YYYY")
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
      code {
        body
      }
    }
  }
`
