import React, { useEffect, useRef, useState } from 'react';
import { IoIosArrowDropright, IoIosArrowDropleft,IoMdCloseCircleOutline } from 'react-icons/io';

const ProductCarousel = ({ productData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);
  const isThrottled = useRef(false);

  const totalImages = productData.images.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };


  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? handleNext() : handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > 10) {
        e.preventDefault();
        if (!isThrottled.current) {
          isThrottled.current = true;
          e.deltaX > 0 ? handleNext() : handlePrev();
          setTimeout(() => (isThrottled.current = false), 500);
        }
      }
    };

    node.addEventListener('wheel', onWheel, { passive: false });

    return () => node.removeEventListener('wheel', onWheel);
  }, []);

  // Close modal on Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="relative max-w-[400px] h-[400px] overflow-hidden m-auto"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides */}
        <div
          className=" h-full flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {productData.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Product ${index}`}
              onClick={() => index === currentIndex && setIsModalOpen(true)}
              className={`min-w-full h-full object-contain select-none ${
                index === currentIndex ? 'cursor-zoom-in' : 'pointer-events-none'
              }`}


              
            />
          ))}


          
        </div>

        {/* Arrows */}
        <div
          onClick={handlePrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-20 p-2 rounded-full shadow-sm hover:bg-white flex justify-center items-center h-7 w-7"
        >
          <IoIosArrowDropleft />
        </div>
        <div
          onClick={handleNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-20 p-2 rounded-full shadow-sm hover:bg-white flex justify-center items-center h-7 w-7 cursor-pointer"
        >
          <IoIosArrowDropright className="opacity-50" />
        </div>


        
        {/* Dots */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-2 ">
         {productData.images.map((_, index) => (

    <div className={`rounded transition-all duration-150 ${
      index === currentIndex ? 'border p-[1px] opacity-100' : 'opacity-50'
    }`}>

   
  <img src={_}
    key={index}
    onClick={() => setCurrentIndex(index)}
    className={`w-full h-[32px] object-contain object-top rounded transition-all ${
      index === currentIndex ? '' : ''
    }`}
    aria-label={`Go to image ${index + 1}`}
  />

  
   </div>
))}

        </div>

      </div>

      {/* Full Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <img
            src={productData.images[currentIndex]}
            alt="Full View"
            className="max-w-full max-h-full object-contain cursor-zoom-out"
          />

          <div className='absolute top-7 right-8 text-white cursor-pointer text-lg' onClick={() => setIsModalOpen(false)}><IoMdCloseCircleOutline className='text-[32px]' /></div>
        </div>
      )}
    </>
  );
};

export default ProductCarousel;
