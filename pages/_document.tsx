import Document, { Head, Html, Main, NextScript } from 'next/document';
import { getTheme } from '@components/ui/DarkMode/DarkMode';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script dangerouslySetInnerHTML={{ __html: getTheme }} />
          <link rel="preload" href="https://fonts.googleapis.com" />
          <link rel="preload" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link rel="preload" href="/loader-dark-mode.webm" as="video" type="video/webm" />
          <link rel="preload" href="/loader-light-mode.webm" as="video" type="video/webm" />
          <script
            id="gorgias-chat-widget-install-v3"
            src="https://config.gorgias.chat/bundle-loader/01HRAD3WX0M4BTPHD30B6N6E39"
          ></script>
          {/* TODO: Check if we actually need BreadPayments */}
          {/* <script src="https://connect-preview.breadpayments.com/sdk.js"></script> */}
          {/* TODO: Check what is this font */}
          {/* <link
            rel="preload"
            href="/static/media/FakeReceipt-Regular.08298548.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          ></link> */}
        </Head>
        <body className="loading" id="body">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
