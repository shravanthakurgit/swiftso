import { useEffect, useState } from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';
import Title from '../Title';
import { BsCart3 } from "react-icons/bs";
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { CiCircleRemove } from "react-icons/ci";

const DELIVERY_FEE = parseFloat(process.env.REACT_APP_DELIVERY_FEE || 0);
const DELIVERY_FEE_THRESHOLD = parseFloat(process.env.REACT_APP_DELIVERY_FEE_THRESHOLD || 0);
const PLATFORM_FEE = parseFloat(process.env.REACT_APP_PLATFORM_FEE || 0);


const CartPage = () => {
  const { cart, updateCartItem,removeFromCart} = useCart();
  // const { getTotalQuantity } = useCart();
  // const cartQuantity = getTotalQuantity();

  const navigate = useNavigate();

  const [discountValue, setDiscountValue] = useState(0);
  const [isBuyAny, setIsBuyAny] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [cartTotal, setCartTotal] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [limitReachedItemId, setLimitReachedItemId] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const getSubtotal = () => {
    return cart?.reduce((acc, item) => acc + item.totalAmount, 0);
  };

  const subtotal = getSubtotal();
  const deliveryFee = subtotal < DELIVERY_FEE_THRESHOLD ? DELIVERY_FEE : 0;
  const totalBeforeDiscount = subtotal + deliveryFee + PLATFORM_FEE;

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
        setIsBuyAny(res.data.buyAny || false);
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
    console.log(cartTotal, totalCartQuantity)
  }, [cartTotal, totalCartQuantity]);

  const removeCoupon = () => {
    resetCoupon();
  };

  const resetCoupon = () => {
    setCouponCode('');
    setCouponMessage('');
    setDiscountValue(0);
    setIsBuyAny(false);
    setIsValid(false);
    setIsInvalid(false);
    setFinalTotal(totalBeforeDiscount);
  };

  useEffect(() => {
    if (couponCode.trim() === '') {
      resetCoupon();
    }
  }, [couponCode]);


  useEffect(() => {
  console.log("Cart updated:", cart);
}, [cart]);


  return (
    <div className="p-4 mx-auto relative w-full">
      <div className="flex flex-row justify-start bg-white border-b items-center p-4 top-[100px] fixed z-10 w-full left-0 gap-3">
        <p><BsCart3 /></p>
        <p className='text-sm font-semibold'>CART</p>
      </div>

      {cart?.length === 0 ? (
        <p className="text-gray-500 mt-20">Your cart is empty.</p>
      ) : (
        <div className="space-y-6 flex justify-center gap-4 flex-col md:flex-row w-full items-start p-2 mt-6">
          <div className='flex gap-2 flex-col flex-1 max-h-[350px] overflow-scroll p-2 w-full'>
            {cart.map((item, index) => (
              <div key={index} className="flex flex-wrap md:grid grid-cols-2 my-1 items-center rounded bg-white border p-2 relative">
                <div className='w-full'>
                  <div className="flex items-center gap-4 text-left">
                    <Link to={`/store/product-details/${item.category}/${item.subCategory}/?id=${item.productId}`}>
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
                  {/* <p onClick={() => decreaseQty(item.id, item.size)} className="p-2 flex justify-center items-center rounded bg-blue-100 text-blue-600 text-[5px]">
                    <FaMinus className='text-[5px]' />
                  </p> */}
              
                  {/* <button
                    onClick={() => {
                      if (item.quantity >= 10) {
                        setLimitReachedItemId(`${item.id}-${item.size}`);
  
                      } else {
                        setLimitReachedItemId(null);
                        increaseQty(item.id, item.size);
                      }
                    }}
                    disabled={item.quantity >= 10}
                    className={`p-2 flex justify-center items-center rounded px-3 text-sm ${
                      item.quantity >= 10 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    <FaPlus className='text-[5px]' />
                  </button> */}
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


                  {limitReachedItemId === `${item.id}-${item.size}` && (
                    <p className="text-red-500 text-[8px] mt-2 absolute bottom-2">Max Quantity Reached!</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className='flex-1 max-w-[550px] sm:!-mt-[30px] w-full'>
            <form onSubmit={applyCoupon} className='mt-6 py-4'>
              <p className='text-xs font-semibold text-orange-600 text-center pb-4'>Have a Coupon Code?</p>
              <div className="flex">
                <input
                  required
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className={`poppins text-xs p-[5px] border-blue-600 border-2 outline-none w-[70%] ${isValid ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={isValid}
                />
                <button type='submit' className="text-sm poppins w-[30%] bg-blue-600 text-white p-[7px] px-4">Apply</button>
              </div>
              {isValid && (
                <button onClick={removeCoupon} type="button" className="bg-red-200 text-red-700 border-2 p-[6px] w-full mt-2 border-red-400 poppins text-sm">
                  Remove Coupon
                </button>
              )}
            </form>

            {isValid && <p className="text-green-600 mt-5">{couponMessage} 🎉</p>}
            {isInvalid && <p className="text-red-500 mt-5">{couponMessage} 🙁</p>}

            <div className="mt-6 border-t pt-4 text-right space-y-4 flex flex-col items-end w-full px-4 font-semibold monst text-xs">
              <p className='text-blue-600 flex w-full justify-between'><span>Subtotal:</span><span>₹ {subtotal}</span></p>
              <p className='flex w-full justify-between'><span>Delivery Fee:</span><span>₹ {deliveryFee}</span></p>
              <p className='flex w-full justify-between'><span>Platform Fee:</span><span>₹ {PLATFORM_FEE}</span></p>
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
