import { FC } from 'react';
import { FullOrder } from '../types'; // We will define this type

const OrderReceipt: FC<{ order: FullOrder }> = ({ order }) => {
    const formattedDate = new Date(order.createdAt).toLocaleString('en-GB');
    const attendeeName = [order.attendee?.first_name, order.attendee?.last_name].filter(Boolean).join(' ');

    return (
        <div style={{ fontFamily: "'Alata', Arial, sans-serif", backgroundColor: '#fff', maxWidth: '520px', margin: '40px auto', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '32px 24px 24px 24px' }}>
            <div style={{ color: '#222' }}>
                <h1 style={{ fontSize: '26px', marginBottom: '12px', color: '#003f20' }}>Order Receipt</h1>
                <p style={{ fontSize: '18px' }}>Hi {attendeeName},</p>
                <p style={{ fontSize: '17px' }}>Thank you for your order! Here are your order details:</p>
                <div style={{ marginBottom: '24px' }}>
                    <p style={{ margin: '6px 0', fontSize: '16px' }}><strong>Order ID:</strong> {order.id}</p>
                    <p style={{ margin: '6px 0', fontSize: '16px' }}><strong>Date:</strong> {formattedDate}</p>
                    <p style={{ margin: '6px 0', fontSize: '16px' }}><strong>Payment Method:</strong> {order.method}</p>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                    <thead>
                    <tr>
                        <th style={{ border: '1px solid #eee', padding: '10px 8px', backgroundColor: '#f4f4f4', color: '#003f20', textAlign: 'left' }}>Item</th>
                    </tr>
                    </thead>
                    <tbody>
                    {order.ticketItems.map((item, index) => (
                        <tr key={index}><td style={{ border: '1px solid #eee', padding: '10px 8px' }}>{item}</td></tr>
                    ))}
                    <tr style={{ fontWeight: 'bold', color: '#10962f' }}>
                        <td style={{ border: '1px solid #eee', padding: '10px 8px', textAlign: 'right' }}>Total: {order.totalPrice.toLocaleString('vi-VN')}đ</td>
                    </tr>
                    </tbody>
                </table>
                <p style={{ fontSize: '16px' }}>We hope you enjoy your event!</p>
            </div>
        </div>
    );
};

export default OrderReceipt;