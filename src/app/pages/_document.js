// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <html>
      <head>
        <script async src="https://docs.opencv.org/4.x/opencv.js" />
      </head>
      <body>
        <Main />
        <NextScript />
      </body>
    </html>
  );
}
