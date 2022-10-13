import { useState, Fragment } from "react";
import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import Profile from "../components/Profile/Profile";
import AccountSecurity from "../components/Profile/AccountSecurity";

export default function ProfilePage() {
  const { data: session } = useSession();

  const [indexes, setIndexes] = useState(0);

  const items = ["Profile", "Account Security"];

  return (
    <Layout title="Profile" container={true}>
      <div className="grid md:grid-cols-6 md:gap-x-5">
        <div className="px-1 md:col-[1/3]">
          <center>
            <h2 className="primaryHeading pb-3 border-b border-b-blue-500">
              Your Account
            </h2>
            <h2 className="text-base font-medium">{session?.user.email}</h2>
          </center>
          <ul className="py-2">
            {items.map((item, index) => (
              <Fragment key={item}>
                <li
                  onClick={() => setIndexes(index)}
                  className={
                    index === indexes
                      ? "pl-3 p-[.2rem] bg-gray-500 text-white cursor-pointer"
                      : "pl-3 p-[.2rem]  cursor-pointer"
                  }
                >
                  {item}
                </li>
              </Fragment>
            ))}
          </ul>
        </div>
        {indexes === 0 ? (
          <Profile session={session} />
        ) : (
          <AccountSecurity session={session} />
        )}
      </div>
    </Layout>
  );
}

ProfilePage.auth = true;
