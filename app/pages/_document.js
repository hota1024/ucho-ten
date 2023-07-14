import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head />
                <body>
                <script src="/noflash.js" async />
                <Main />
                <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;