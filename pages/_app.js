import "../styles/globals.css";
import Layout from "../components/layouts/Default";
import { UserProvider } from "../store/userContext";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}

export default MyApp;
