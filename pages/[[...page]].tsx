import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react'
// loading widgets dynamically to reduce bundle size, will only be included in bundle when is used in the content
import '@builder.io/widgets/dist/lib/builder-widgets-async'
import { Layout } from '@components/common'
import ErrorPage from './404'

builder.init('f6d91abf288f4e5fb3b6f1e8b846274b')

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ page: string[] }>) {
  try {
    const header = await builder.get('header').toPromise()
    const urlPath = '/' + (params?.page?.join('/') || '')

    console.log(`Attempting to fetch Builder.io page for path: ${urlPath}`)

    const page = await builder
      .get('page', {
        userAttributes: {
          urlPath: urlPath,
        },
        // options: {
        //   noTargeting: true
        // }
      })
      .toPromise()

      console.log({page});
      console.log(page.query);
      console.log(page.data.blocks);
      console.log(page.data.state);

    if (!page) {
      console.log(`No page found for path: ${urlPath}`)
      return {
        notFound: true,
      }
    }

    return {
      props: {
        page,
        header,
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 5 seconds
      revalidate: 15,
    }
  } catch (error) {
    console.error('Error fetching Builder.io page:', error)
    return {
      notFound: true,
    }
  }
}

export async function getStaticPaths() {
  try {
    const pages = await builder.getAll('page')
    // const pages = await builder.getAll('page', {
    //   options: { noTargeting: true },
    // })

    const paths = pages
      .map((page) => {
        if (!page.data?.url || page.published !== "published") return null
        // Skip problematic pages
        // if (page.data.url === "/abd-test-2" || page.data.url === "/en-US/new-tokyodream-7") return null
        return `${page.data?.url}`
      })
      .filter(Boolean)
      console.log({paths});

    console.log(`Generated ${paths.length} static paths`)

    return {
      paths,
      fallback: 'blocking',
    }
  } catch (error) {
    console.error('Error in getStaticPaths:', error)
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

export default function Page({
  page,
  header,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const isPreviewingInBuilder = useIsPreviewing()
  const show404 = !page && !isPreviewingInBuilder

  if (router.isFallback) {
    return (
      <div className="fallback-loader">
        <span className="loader"></span>
      </div>
    )
  }
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {!page && <meta name="robots" content="noindex" />}
      </Head>
      {show404 ? (
        <ErrorPage header={header}/>
      ) : (
        <BuilderComponent model="page" content={page} />
      )}
    </>
  )
}

Page.Layout = Layout
