import { useEffect, useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';

import { BsCart3 } from "react-icons/bs";
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { CiCircleRemove } from "react-icons/ci";

const DELIVERY_FEE = parseFloat(process.env.REACT_APP_DELIVERY_FEE || 0);
const DELIVERY_FEE_THRESHOLD = parseFloat(process.env.REACT_APP_DELIVERY_FEE_THRESHOLD || 0);
// const PLATFORM_FEE = 0;


const CartPage = () => {
  const { cart, updateCartItem,removeFromCart,updateCartLoading,removeFromCartLoading} = useCart();
  // const { getTotalQuantity } = useCart();
  // const cartQuantity = getTotalQuantity();

  const navigate = useNavigate();

  const [discountValue, setDiscountValue] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [cartTotal, setCartTotal] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isValid, setIsValid] = useState(false);


  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const getSubtotal = () => {
    return cart?.reduce((acc, item) => acc + item.totalAmount, 0);
  };

  const subtotal = getSubtotal();
  const deliveryFee = subtotal < DELIVERY_FEE_THRESHOLD ? DELIVERY_FEE : 0;
  const totalBeforeDiscount = subtotal + deliveryFee;

  useEffect(() => {
    if (!isValid) {
      setFinalTotal(totalBeforeDiscount);
    }
  }, [totalBeforeDiscount, isValid]);

  useEffect(() => {
    setCartTotal(totalBeforeDiscount);
  }, [totalBeforeDiscount]);

  const [totalCartQuantity, setTotlCartQuantity]= useState(0)

  useEffect(()=>{
    setTotlCartQuantity(cart.reduce((sum, item) => sum + item.quantity, 0));
  },[cart])

  
useEffect (()=>{

},[cart])


  const validateCoupon = async () => {
    if (!couponCode || couponCode.trim() === '' || totalCartQuantity === 0) return;

const items = cart.map(item => ({
  id: item.productId,
  price: item.totalAmount,
  quantity: item.quantity
}));


    try {
      const res = await axios.post(`${backendUrl}/api/coupons/apply`, {
        code: couponCode,
        items,
        userId: null
      });

      if (res.data.valid) {
        setCouponMessage(res.data.message || '');
        setIsValid(true);
        setIsInvalid(false);
        setFinalTotal(res.data.finalPrice);
        setDiscountValue(res.data.discountAmount || 0);
      } else {
        resetCoupon();
      }
    } catch (err) {
      setCouponMessage(err.response?.data?.message || 'Failed to apply coupon');
      setDiscountValue(0);
      setFinalTotal(totalBeforeDiscount);
      setIsValid(false);
      setIsInvalid(true);
    }
  };

  const applyCoupon = async (e) => {
    e.preventDefault();
    await validateCoupon();
  };

  useEffect(() => {
    if (couponCode) {
      validateCoupon();
    } else {
      setFinalTotal(totalBeforeDiscount);
    }
  }, [cartTotal, totalCartQuantity,totalBeforeDiscount]);

  const removeCoupon = () => {
    resetCoupon();
  };

  const resetCoupon = () => {
    setCouponCode('');
    setCouponMessage('');
    setDiscountValue(0);
    setIsValid(false);
    setIsInvalid(false);
    setFinalTotal(totalBeforeDiscount);
  };

  useEffect(() => {
    if (couponCode.trim() === '') {
      resetCoupon();
    }
  }, [couponCode]);


  


  return (
    
    <div className="p-4 mx-auto w-full">

       {updateCartLoading &&(
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-xs p-5 ">
      <div className=" max-w-sm bg-white monst p-2 shadow-lg overflow-hidden border border-gray-100 flex items-center gap-6 justify-center w-fit px-4 font-semibold text-sm rounded text-gray-600">
<p>Updating items...</p> <div className="animate-spin rounded-full h-4 w-4 border-t border-b border-black mt-1 "></div>
        
      </div>
    </div>
      )}


       {removeFromCartLoading &&(
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-xs p-5 ">
      <div className=" max-w-sm bg-white monst p-2 shadow-lg overflow-hidden border border-gray-100 flex items-center gap-6 justify-center w-fit px-4 font-semibold text-sm rounded text-gray-600">
<p>Removing item...</p> <div className="animate-spin rounded-full h-4 w-4 border-t border-b border-black mt-1 "></div>
        
      </div>
    </div>
      )}

      <div className="flex flex-row justify-start bg-white border-b items-center p-4 top-[100px] fixed z-10 w-full left-0 gap-3">
        <p><BsCart3 /></p>
        <p className='text-sm font-semibold'>CART</p>
      </div>


     

      {cart?.length === 0 ? (
        <p className="text-gray-500 mt-20 monst">Your cart is empty.</p>
      ) : (
        <div className="space-y-6 flex justify-center gap-4 flex-col md:flex-row w-full items-start p-2 mt-6">
          <div className='flex gap-2 flex-col flex-1 max-h-[350px] overflow-scroll p-2 w-full'>
            {cart.map((item, index) => (
              <div key={index} className="flex flex-wrap md:grid grid-cols-2 my-1 items-center rounded bg-white border p-2 relative">
                <div className='w-full'>
                  <div className="flex items-center gap-4 text-left">
                    <Link to={`/shop/product-details/${item.category}/${item.subCategory}/?id=${item.productId}`}>
                      <img src={item.image} alt={item.name} className="border object-contain rounded md:max-h-[120px] max-h-[80px]" />
                    </Link>
                    <div className='flex flex-col gap-1 text-[12px]'>
                      <p className="font-semibold max-w-[120px] truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Size: <span className='font-semibold'>{item.size}</span></p>
                      <p className="text-xs">Price: ₹ {item.quantity * item.price}</p>
                    </div>
                  </div>

                  <button onClick={() => removeFromCart(item.productId, item.size)} className="ml-4 absolute top-1 right-1 bg-gray-200 p-1 rounded-full text-gray-500 sm:text-[16px] text-[14px]">
                    <CiCircleRemove />
                  </button>
                </div>

                <div className="absolute top-[43.5%] right-1 flex flex-wrap px-2 text-[7px] sm:text-[10px] ">
              
<button
  onClick={() =>
    updateCartItem(item.productId, item.size, item.quantity - 1)
  }
  disabled={item.quantity <= 1}
  className={`p-1 px-3  bg-gray-200 monst rounded ${item.quantity<=1 ? 'cursor-not-allowed bg-opacity-50 text-gray-300':''}`}
>
  <FaMinus />
</button>

<span className="px-2 monst text-xs">{item.quantity}</span>

<button
  onClick={() =>
    updateCartItem(item.productId, item.size, item.quantity + 1)
  }
  disabled={item.quantity >= 10}
  className={`p-1 px-3  bg-gray-200 monst rounded text-gray-600 ${item.quantity>=10 ? 'cursor-not-allowed bg-opacity-50 text-gray-300':''}`}
>
  <FaPlus />
</button>


               
                </div>
              </div>
            ))}
          </div>

          <div className='flex-1 sm:!-mt-[30px] w-full'>
            

            <form onSubmit={applyCoupon} className="mt-10 space-y-4">
  <div className="relative">

    <h3 className='mb-4 monst font-semibold text-gray-400'>Have a coupon code ?</h3>
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none top-10">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-200" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
      </svg>
    </div>
    <input
      required
      type="text"
      placeholder="Enter coupon code"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
      className={`block w-full pl-10 pr-4 py-3 text-sm rounded-lg border outline-none ${
        isValid 
          ? 'border-green-300 bg-green-50 text-green-700' 
          : 'focus:ring-1'
      } transition-all duration-200`}
      disabled={isValid}
    />
  </div>

  <div className="flex space-x-3">
    <button
      type="submit"
      disabled={isValid}
      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium ${
        isValid
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md'
      } transition-all duration-200`}
    >
      {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg> */}
      <span>Apply Coupon</span>
    </button>

    {isValid && (
      <button
        onClick={removeCoupon}
        type="button"
        className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium bg-gradient-to-r from-red-100 to-red-50 text-red-600 border border-red-200 hover:from-red-50 hover:to-red-100 shadow-sm transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>Remove</span>
      </button>
    )}
  </div>

  {isValid && (
    <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg border border-green-200">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="text-sm font-medium text-green-700">{couponMessage}</span>
    </div>
  )}

  {isInvalid && (
    <div className="flex items-center justify-center p-3 bg-red-50 rounded-lg border border-red-200">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <span className="text-sm font-medium text-red-700">{couponMessage}</span>
    </div>
  )}
</form>

            <div className="mt-6 border-t pt-4 text-right space-y-4 flex flex-col items-end w-full px-4 font-semibold monst text-xs">
              <p className='text-blue-600 flex w-full justify-between'><span>Subtotal:</span><span>₹ {subtotal}</span></p>
              <p className='flex w-full justify-between'><span>Delivery Fee:</span><span>₹ {deliveryFee}</span></p>
              {/* <p className='flex w-full justify-between'><span>Platform Fee:</span><span>₹ {PLATFORM_FEE}</span></p> */}
              {discountValue !== 0 && <p className='flex w-full justify-between text-green-600'><span>Discount:</span><span>₹ {discountValue}</span></p>}

              <p className="text-[15px] font-bold flex w-full justify-between">
                <span>Total:</span>
                <span>
                  {isValid && <span className="line-through text-gray-500 text-sm mr-2">₹{totalBeforeDiscount}</span>}
                  <span className={`${isValid ? 'text-green-600' : ''}`}>₹{finalTotal}</span>
                </span>
              </p>
            </div>

           <button
  onClick={() => navigate('/checkout', {
    state: {
      total: finalTotal,
      discount: discountValue,
      hasCoupon: isValid,
      itemCount: totalCartQuantity,
      cartList : cart,
      delivery : deliveryFee,
      coupon: couponCode,
    }
  })}
  className="bg-blue-600 w-full p-2 text-white text-center cursor-pointer font-semibold mt-6 rounded monst border-[1.5px] border-white shadow-lg"
>
  Checkout
</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
