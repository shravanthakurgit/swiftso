import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const InvoiceButton = ({ orderId,productId }) => {
  const [loading, setLoading] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [error, setError] = useState("");

  const handleGenerateInvoice = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get(`/api/order/invoice/${orderId}/${productId}`,);
      if (response.data.success) {
        setInvoiceUrl(response.data.invoiceUrl);
        window.open(response.data.invoiceUrl, "_blank");
      } else {
        setError("Unable to generate invoice.");
      }
    } catch (err) {
      setError("Server error");
      
    }

    setLoading(false);
     setTimeout(()=>{
       setError("");
     },1500)
  };

  return (
    < >
      <button
        onClick={handleGenerateInvoice}
        disabled={loading}
        className="relative text-xs font-medium px-4 py-2 rounded-full group border border-gray-200 w-fit flex items-center gap-1"
      > <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
        {loading ? "Generating..." : "Invoice"}
      </button>


      {error && <p className="p-10 absolute inset-0 bg-black bg-opacity-45 text-sm mt-1 flex justify-center items-center"><span className='bg-white text-red-600 p-2 px-4 flex gap-2 rounded items-center justify-center'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" viewBox="0 0 24 24">
  <path d="M12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0zm5.657 16.243L16.243 17.657 12 13.414 7.757 17.657 6.343 16.243 10.586 12 6.343 7.757 7.757 6.343 12 10.586 16.243 6.343 17.657 7.757 13.414 12l4.243 4.243z"/>
</svg>
 {error}</span></p>}
    </>
  );
};

export default InvoiceButton;
