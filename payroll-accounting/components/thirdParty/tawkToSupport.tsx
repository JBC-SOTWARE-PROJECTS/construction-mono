// components/TawkToChat.tsx

import { ReactElement } from 'react';
import Head from 'next/head';

const TawkToChat = (): ReactElement => (
  <Head>
    <script
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API = Tawk_API || {};
          var Tawk_LoadStart = new Date();
          (function () {
            var s1 = document.createElement("script"),
              s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/6567baf568f6b67c37db5ad2/1hgej4kbl';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
          })();
        `,
      }}
    />
  </Head>
);

export default TawkToChat;
