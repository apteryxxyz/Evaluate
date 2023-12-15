// import Script from 'next/script';

// export function GoogleAdSense() {
//   const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
//   if (!adSenseId || process.env.NODE_ENV !== 'production') return null;

//   return (
//     <>
//       <Script
//         strategy="afterInteractive"
//         src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
//         crossOrigin="anonymous"
//       />

//       <Script
//         id="google-adsense"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: `
//           (adsbygoogle = window.adsbygoogle || []).push({
//             google_ad_client: "${adSenseId}",
//             enable_page_level_ads: true
//           });
//           `,
//         }}
//       />
//     </>
//   );
// }
