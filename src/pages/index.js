import React from 'react'
import { graphql } from 'gatsby'
import { css } from '@emotion/core'
import Layout from '../components/Layout'
import Link from '../components/Link'
import get from 'lodash/get'
import Img from 'gatsby-image'

import { compareDesc } from 'date-fns'
import { scale, rhythm } from '../utils/typography'

export default all => {
  const { data } = all
  const { site } = data

  const posts = data.allMdx.edges
    .filter(({ node }) => node.fields.published)
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
            <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
          </h2>

          <small>{post.frontmatter.date}</small>

          <p>{post.excerpt}</p>

          <Link to={post.fields.slug}>Continue reading...</Link>
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
    allMdx {
      edges {
        node {
          excerpt(pruneLength: 300)
          id
          fields {
            title
            slug
            date
            published
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
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
