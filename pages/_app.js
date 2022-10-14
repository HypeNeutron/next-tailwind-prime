import { SessionProvider, useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AppContextProvider } from "../context/context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Layout from "./../components/Layout";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <AppContextProvider>
          <PayPalScriptProvider deferLoading={true}>
            {Component.auth ? (
              <NextAuth>
                <Component {...pageProps} />
              </NextAuth>
            ) : (
              <Component {...pageProps} />
            )}
            <ToastContainer />
          </PayPalScriptProvider>
        </AppContextProvider>
      </SessionProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

function NextAuth({ children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=login required");
    },
  });

  status === "loading" && (
    <Layout>
      <center>Loading...</center>
    </Layout>
  );
  return children;
}

export default MyApp;
