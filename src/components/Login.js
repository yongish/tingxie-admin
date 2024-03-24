import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { getHost } from "./utils/env";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        user
          .getIdToken(true)
          .then((token) => {
            console.log("token", token);

            fetch(`${getHost()}tokens`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                token,
              }),
            }).then(() => navigate("/", { state: { token } }));
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);

        // todo: Display invalid credentials.
      });
  };

  return (
    <DivMargin>
      <p>听写 Admin</p>
      <form>
        <DivMarginBottom>
          <LabelMarginRight htmlFor="email-address">
            Email address
          </LabelMarginRight>
          <input
            id="email-address"
            name="email"
            type="email"
            required
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </DivMarginBottom>
        <DivMarginBottom>
          <LabelMarginRight htmlFor="password">Password</LabelMarginRight>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </DivMarginBottom>
        <div>
          <button onClick={onLogin}>Login</button>
        </div>
      </form>
    </DivMargin>
  );
};

export default Login;

const DivMargin = styled.div`
  margin: 10px;
`;
const DivMarginBottom = styled.div`
  margin-bottom: 10px;
`;
const LabelMarginRight = styled.label`
  margin-right: 5px;
`;
