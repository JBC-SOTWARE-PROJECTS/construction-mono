import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {

  render() {
    return (
      <Html lang="en" data-direction="rtl">
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="stylesheet" href="/vendors/gaxon/styles.css" />
          <link rel="stylesheet" href="/vendors/flag/sprite-flags-24x24.css" />
          <link rel="stylesheet" href="/vendors/noir-pro/styles.css" />
          <script src="/vendors/amcharts/amcharts.js"></script>
          <script src="/vendors/amcharts/serial.js"></script>
          <script src="/vendors/amcharts/xy.js"></script>
          <script src="/vendors/amcharts/pie.js"></script>
          <script src="/vendors/amcharts/funnel.js"></script>
          <script src="/vendors/amcharts/gauge.js"></script>
          <script src="/vendors/amcharts/ammap.js"></script>
          <script src="/vendors/amcharts/usaLow.js"></script>
          <script src="/vendors/amcharts/worldLow.js"></script>
          <script src="/vendors/amcharts/worldHigh.js"></script>
          <script src="/vendors/amcharts/continentsLow.js"></script>
          <script src="/vendors/amcharts/export.min.js"></script>
          <script src="/vendors/amcharts/light.js"></script>
          <script src="/vendors/amcharts/none.js"></script>
          <link rel="stylesheet" href="/vendors/amcharts/export.css" type="text/css"
            media="all" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
