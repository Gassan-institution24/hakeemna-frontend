/* eslint-disable react/button-has-type */
// frontend/src/components/Invoice.js
import React, { useState } from 'react';

function Invoice() {
  const [xmlResponse, setXmlResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const invoiceData = {
    ActivityNumber: '6462502',
    ClientId: '56bc7b8c-8d22-45c9-b44b-607f2bc93cfa',
    SecretKey: 'Gj5nS9wyYHRadaVffz5VKB4v4wlVWyPhcJvrTD4NHtOs0pElnsDYV+JednsAG84A+0ui1oiaB8hG/WQtbxSCxnhGVjsppKssaynrO9FDu9kjlWsYmKI3plFLp0SGskbRUf5Dwy63uevN5l2vGwsZPZ83EhibfFTbg5RJG5iAoSLbPoixAZgwzA6ILm5bQdEktpfi25qZ7NgGy2Wrvj+lBO8heNlzGL2y2IukJ886V4pptD28Rp/HYihqPWOKrFLi0gTRN17aF/TIshcWyejyKA==',
    invoiceId: 'INV12345',
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    issueDate: '2025-05-24',
    invoiceTypeCode: '011', // فاتورة دخل نقدية
    note: 'Test invoice with value 1 JOD',
    companyId: '12345678',
    registrationName: 'My Company Ltd.',
    customerId: '9988776655',
    customerPostalZone: '12345',
    customerName: 'Ahmad Mohammad',
    sellerSequence: '9932895',
    totalDiscount: '0.00',
    totalTax: '0.00',
    totalBeforeDiscount: '0.85',
    totalPayable: '1.00',
    itemDetails: {
      id: '1',
      quantity: '1.00',
      total: '0.85',
      name: 'Sample Item',
      unitPrice: '0.85',
      discount: '0.00',
    },
  };

  const handleGenerateInvoice = async () => {
    setLoading(true);
    setXmlResponse('');
    try {
      const response = await fetch('http://localhost:3000/api/invoice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate invoice: ${errorText}`);
      }

      const text = await response.text();
      setXmlResponse(text);
    } catch (err) {
      setXmlResponse(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <button onClick={handleGenerateInvoice} disabled={loading} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
        {loading ? 'Generating...' : 'Generate Invoice'}
      </button>

      {xmlResponse && (
        <pre style={{ whiteSpace: 'pre-wrap', background: '#eee', padding: '1rem', marginTop: '1rem', borderRadius: '5px', maxHeight: '400px', overflowY: 'auto' }}>
          {xmlResponse}
        </pre>
      )}
    </div>
  );
}

export default Invoice;
