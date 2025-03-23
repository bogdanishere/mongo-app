import "@/styles/globals.scss";
import "@/styles/utils.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Container, SSRProvider } from "react-bootstrap";
import styles from "@/styles/App.module.css";

import Head from "next/head";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import NextNProgress from "nextjs-progressbar";
import SignUpModal from "@/components/auth/SignUpModal";
import LoginModal from "@/components/auth/LoginModal";
import { User } from "@/models/user";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Flow Blog</title>
        <meta name="description" content="FullStack NextJS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SSRProvider>
        <NextNProgress color="#21fa90" />
        <div className={inter.className}>
          <NavBar />
          <main>
            <Container className={styles.pageContainer}>
              <Component {...pageProps} />
            </Container>
          </main>
          <Footer />
          {/* <LoginModal
            onDismiss={() => {}}
            onSignUpInsteadClicked={() => {}}
            onForgotPasswordClicked={() => {}}
          /> */}
        </div>
      </SSRProvider>
    </>
  );
}
