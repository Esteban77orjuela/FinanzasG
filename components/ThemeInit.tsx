'use client'

import { useServerInsertedHTML } from 'next/navigation'

const THEME_KEY = 'finanzag-theme'

const themeScript = `(function(){var k='${THEME_KEY}';var s,t;try{s=localStorage.getItem(k);}catch(e){}if(s==='light'||s==='dark'){t=s;}else{t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);})();`

export default function ThemeInit() {
  useServerInsertedHTML(() => (
    <script dangerouslySetInnerHTML={{ __html: themeScript }} />
  ))
  return null
}
