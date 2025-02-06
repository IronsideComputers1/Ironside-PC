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
  const header = await builder.get('header').toPromise()
  const page =
    (await builder
      .get('page', {
        userAttributes: {
          urlPath: '/' + (params?.page?.join('/') || ''),
        },
      })
      .toPromise()) || null

  if (!page) {
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
}

export async function getStaticPaths() {
  const pages = await builder.getAll('page', {
    options: { noTargeting: true },
    omit: 'data.blocks',
  })

  // FIXME: Investigate why /abd-test-2 is failling
  const paths = pages.map((page) => {
    if(page.data?.url === "/abd-test-2") return null;
    return page.data?.url;
  }).filter(Boolean);

  return {
    paths,
    fallback: true,
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
