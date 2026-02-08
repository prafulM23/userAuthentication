import React, { useState, useRef } from "react";

const OtpInput = ({ length = 4, otp, setOtp }) => {
    const inputRefs = useRef([]);

    console.log(otp, "TESTed")

    // Handle input change
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return; // Only numbers allowed

        const newOtp = [...otp];
        console.log(newOtp, "New ")
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Move to next input automatically
        if (element.value && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }

        // Submit when all inputs are filled
        if (newOtp.join("").length === length) {
            onOtpSubmit(newOtp.join(""));
        }
    };

    // Handle Backspace
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            {otp.map((data, index) => (
                <input
                    key={index}

                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    style={{
                        width: "50px",
                        height: "50px",
                        fontSize: "20px",
                        textAlign: "center",
                        border: "2px solid cyan",
                        borderRadius: "8px",
                        outline: "none",
                        background: "transparent"
                    }}
                />
            ))}
        </div>
    );
};

export default OtpInput;
