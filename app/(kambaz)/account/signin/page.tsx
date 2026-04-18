"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import * as client from "../client";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const router = useRouter();
  const signin = async () => {
    const user = await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    router.push("/dashboard");
  };
  return (
    <div>
      <div id="wd-signin-screen">
        <h1>Sign in</h1>
        <FormControl
          defaultValue={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          className="mb-2"
          placeholder="username"
          id="wd-username"
        />
        <FormControl
          defaultValue={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          className="mb-2"
          placeholder="password"
          type="password"
          id="wd-password"
        />
        <Button onClick={signin} id="wd-signin-btn" className="w-100">
          {" "}
          Sign in{" "}
        </Button>
        <Link id="wd-signup-link" href="/account/signup">
          {" "}
          Sign up{" "}
        </Link>
      </div>
      <br />
      <h1>Project info</h1>
      <br />
      <h3>Team members:</h3>
      <p className="pl-4">David Busnel</p>
      <p className="pl-4">Sophia Allen</p>
      <p className="pl-4">Sophia Boyajian</p>
      <h3>Project repos:</h3>
      <div className="flex flex-column">
        <a
          className="pl-4"
          href="https://github.com/dbusnel/4550-kanbaz/tree/pazza"
        >
          Kanbaz Frontend (Pazza branch)
        </a>
        <a
          className="pl-4"
          href="https://github.com/dbusnel/kambaz-node-server-app"
        >
          Kanbaz Backend
        </a>
      </div>
    </div>
  );
}
