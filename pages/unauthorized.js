import { useRouter } from "next/router";
import { ErrorValidate } from "../components/ErrorValidate";
import Layout from "../components/Layout";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { message } = router.query;

  return (
    <Layout title="Unauthorized Page">
      <center>
        <h1 className="primaryHeading">Access Denied</h1>
        <ErrorValidate>{message && message}</ErrorValidate>
      </center>
    </Layout>
  );
}
