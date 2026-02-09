import Link from "next/link";
export default function AccountNavigation() {
  return (
    <div id="wd-account-navigation" className="pt-5 pr-5">
      <Link href="signin" className="font-bold list-group-item active border-0">
        | Signin
      </Link>{" "}
      <br />
      <Link href="signup" className="list-group-item text-danger border-0">
        {" "}
        Signup{" "}
      </Link>{" "}
      <br />
      <Link href="profile" className="list-group-item text-danger border-0">
        {" "}
        Profile{" "}
      </Link>{" "}
      <br />
    </div>
  );
}
