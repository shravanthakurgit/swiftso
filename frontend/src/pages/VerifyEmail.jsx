import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { backendUrl } from "../utils/backendUrl";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!code) {
          setMessage("Invalid or missing verification code.");
          return;
        }

        const res = await axios.post(`${backendUrl}/api/user/verify-email`, {
          code,
        });

        if (res.data.success) {
          setMessage(res.data.message);
        } else {
          setMessage(
            "Email verification failed. " + (res.data.message || "")
          );
        }
      } catch (error) {
        console.error("Verification error:", error);
        const serverMsg =
          error?.res?.data?.message ||
          "Something went wrong while verifying your email.";
        setMessage(`Error verifying email: ${serverMsg}`);
      }
    };

    verifyEmail();
  }, [code]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
