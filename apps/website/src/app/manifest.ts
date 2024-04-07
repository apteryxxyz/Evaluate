export default function Manifest() {
  return {
    name: 'Evaluate',
    short_name: 'Evaluate',
    theme_color: '#2fc186',
    background_color: '#ffffff',
    description:
      'Explore a diverse range of programming languages and tools with our comprehensive online platform. Evaluate is the ultimate code evaluation tool, quickly evaluate code snippets in any programming language, with optional input and command-line arguments. Try it now!',
    display: 'standalone',
    lang: 'en',
    scope: '/',
    start_url: '/',
    icons: [
      { src: '/images/icon/192.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/icon/512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
