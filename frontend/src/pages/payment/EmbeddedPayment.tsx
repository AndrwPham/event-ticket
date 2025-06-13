import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePayOS, PayOSConfig } from "@payos/payos-checkout";
import { IPayOSEvent } from "../../types";

const EmbeddedPayment = () => {
    const navigate = useNavigate();
    const [isCreatingLink, setIsCreatingLink] = useState(false);

    const [payOSConfig, setPayOSConfig] = useState<PayOSConfig>({
        CHECKOUT_URL: "",
        RETURN_URL: `http://localhost:5173/payment/success`,
        ELEMENT_ID: "embedded-payment-container",
        embedded: true,
        onSuccess: (event: IPayOSEvent) => {
            if (event.orderCode) {
                navigate(
                    `/payment/success?orderCode=${String(event.orderCode)}`,
                );
            } else {
                navigate(`/payment/success?error=OrderCodeNotFound`);
            }
        },
        onCancel: () => {
            alert("Payment has been canceled.");
            window.location.reload();
        },
        onExit: () => {},
    });

    const { open, exit } = usePayOS(payOSConfig);

    useEffect(() => {
        if (payOSConfig.CHECKOUT_URL) {
            open();
        }
    }, [payOSConfig.CHECKOUT_URL, open]);

    const handleGetPaymentLink = async () => {
        setIsCreatingLink(true);
        exit();
        try {
            const response = await fetch(
                "http://localhost:5000/api/payment/create-payment-link",
                { method: "POST" },
            );

            if (!response.ok) throw new Error("Server did not respond.");

            interface ILinkResponse {
                checkoutUrl: string;
            }
            const result = (await response.json()) as ILinkResponse;

            setPayOSConfig((prevConfig) => ({
                ...prevConfig,
                CHECKOUT_URL: result.checkoutUrl,
            }));
        } catch (err) {
            console.error(err);
            alert("Could not create payment link. Please try again.");
            setIsCreatingLink(false);
        }
    };

    return (
        <div
            className="main-box"
            style={{
                fontFamily: "Arial, sans-serif",
                maxWidth: "450px",
                margin: "2rem auto",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
            }}
        >
            <div className="checkout">
                <div className="product" style={{ marginBottom: "1rem" }}>
                    <p>
                        <strong>Tên sản phẩm:</strong> Mì tôm Hảo Hảo ly
                    </p>
                    <p>
                        <strong>Giá tiền:</strong> 2000 VNĐ
                    </p>
                    <p>
                        <strong>Số lượng:</strong> 1
                    </p>
                </div>
                <button
                    id="create-payment-link-btn"
                    onClick={() => {
                        void handleGetPaymentLink();
                    }}
                    disabled={isCreatingLink}
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    {isCreatingLink ? "Đang tạo..." : "Thanh toán ngay"}
                </button>
                <div
                    id="embedded-payment-container"
                    style={{ minHeight: "400px", marginTop: "1rem" }}
                ></div>
            </div>
        </div>
    );
};

export default EmbeddedPayment;
