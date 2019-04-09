import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'
import { rhythm } from '../utils/typography'
import Layout from '../components/Layout'

export default function Post({
  data: { site, mdx },
  pageContext: { next, prev },
}) {
  const { source, title, readingTime, twitterEmbedVideo } = mdx.fields
  const { slug, date, banner } = mdx.frontmatter
  return (
    <Layout
      date={date}
      readingTime={readingTime}
      twitterEmbedVideo={twitterEmbedVideo}
      title={title}
      site={site}
      frontmatter={mdx.frontmatter}
    >
      <a
        style={{
          textDecoration: 'none',
          paddingTop: rhythm(0.5),
        }}
        href="/"
      >
        {`<- johnlindquist.com`}
      </a>
      <h1
        style={{
          textDecoration: 'none',
          paddingTop: rhythm(0.5),
        }}
      >
        {title}
      </h1>

      {banner && (
        <Img
          sizes={banner.childImageSharp.sizes}
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
        readingTime
        twitterEmbedVideo
      }
      code {
        body
      }
    }
  }
`
