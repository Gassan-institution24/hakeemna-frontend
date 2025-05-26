/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

export default function InvoiceForm() {
  const [payableAmount, setPayableAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [clientName, setClientName] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      payableAmount,
      discount,
      clientName,
    };

    try {
      const res = await fetch('http://localhost:3000/api/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(`✅ Success! Invoice ID: ${data.invoiceId}`);
      } else {
        setStatus(`❌ Error: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      setStatus(`❌ Submission failed: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Send Invoice</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Payable Amount (JOD):
          <input
            type="number"
            step="0.01"
            value={payableAmount}
            onChange={(e) => setPayableAmount(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Discount (JOD):
          <input
            type="number"
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </label>
        <br />
        <label>
          Client Name:
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Send Invoice</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
