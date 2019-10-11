import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Link from '../components/Link'
import Img from 'gatsby-image'

import { compareDesc, format } from 'date-fns'
import { rhythm } from '../utils/typography'

export default all => {
  const { data } = all
  const { site } = data

  const posts = data.allMdx.edges
    .filter(
      ({ node }) =>
        process.env.NODE_ENV === 'development' || node.fields.published,
    )
    .sort((prev, next) => {
      return compareDesc(prev.node.fields.date, next.node.fields.date)
    })

  return (
    <Layout title={site.siteMetadata.title} site={site}>
      <h1>johnlindquist.com</h1>
      {posts.map(({ node: post }) => (
        <div key={post.id} style={{ paddingBottom: rhythm(2) }}>
          {post.frontmatter.banner && (
            <Img sizes={post.frontmatter.banner.childImageSharp.sizes} />
          )}

          <h2>
            <Link to={post.fields.path}>{post.fields.title}</Link>
          </h2>

          <small>{format(post.frontmatter.date, 'MMMM Do, YYYY')}</small>

          <p>{post.excerpt}</p>

          <Link to={post.fields.path}>Continue reading...</Link>
        </div>
      ))}
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      ...site
    }
    allMdx(filter: { fields: { source: { eq: "demo" } } }) {
      edges {
        node {
          excerpt(pruneLength: 300)
          id
          fields {
            title
            slug
            date
            published
            path
          }
          frontmatter {
            title
            date
            banner {
              childImageSharp {
                sizes(maxWidth: 720) {
                  ...GatsbyImageSharpSizes
                }
              }
            }
            slug
            keywords
          }
        }
      }
    }
  }
`