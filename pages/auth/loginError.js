import { getProviders } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const errors = {
  Signin: "Try signing with a different account.",
  OAuthSignin: "Try signing with a different account.",
  OAuthCallback: "Try signing with a different account.",
  OAuthCreateAccount: "Try signing with a different account.",
  EmailCreateAccount: "Try signing with a different account.",
  Callback: "Try signing with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "Check your email address.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  default: "Unable to sign in.",
};

const SignInError = ({ error }) => {
  const errorMessage = error && (errors[error] ?? errors.default);
  return (
    <>
      <div className="alert-error max-w-screen-sm">{errorMessage}</div>
      <div className=" text-2xl text-blue-600">
        You maybe already other account to signIn <br />
        Try signing with a different account
      </div>
    </>
  );
};

export default function SignIn({ providers }) {
  const { query, push } = useRouter();

  useEffect(() => {
    const login = setTimeout(() => push("/auth/login"), 5000);
    return () => clearTimeout(login);
  }, [push]);

  return (
    <div className="p-11">
      <center>
        <h1 className="font-medium text-2xl">SignIn</h1>
        {query.error && <SignInError error={query.error} />}
        <h2 className="text-xl mt-5 mb-2">Error SignIn in</h2>
        {providers &&
          Object.values(providers).map((provider) => (
            <div key={provider.name}>{provider.name}</div>
          ))}
      </center>
    </div>
  );
}

export async function getServerSideProps() {
  return { props: { providers: await getProviders() } };
}
