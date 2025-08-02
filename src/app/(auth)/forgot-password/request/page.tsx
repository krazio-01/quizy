"use client";
import { useRef, useState } from "react";
import axios from "axios";
import { MdLockReset } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import "../../auth.scss";

const Page = () => {
    const [loading, setLoading] = useState(false);

    const emailRef = useRef<HTMLInputElement>(null);
    const refs = [emailRef];

    const formFields = [
        { name: "email", label: "Email", type: "email", icon: <MdEmail /> },
    ];

    const handleChangeRequest = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                "/api/auth/forgot-password/request",
                {
                    email: emailRef?.current?.value,
                }
            );
            return data.message;
        } catch (error: any) {
            throw error.response.data.message;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="form-container login">
                <div className="auth-form-header">
                    <MdLockReset />
                    <h2>Reset your password</h2>
                    <p
                        style={{
                            fontSize: "var(--fz-sm)",
                            textAlign: "center",
                        }}
                    >
                        Enter your email address and we will send you
                        instructions to reset your password.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Page;
