import { FaIndianRupeeSign } from 'react-icons/fa6';
import {  FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ServiceCommitment = () => {
  const features = [
    {
      icon: < FiRefreshCw className="w-4 h-4" />,
      label: "Easy Returns",
      color: "bg-rose-100 text-rose-600"
    },
    {
      icon: <FaIndianRupeeSign className="w-3.5 h-3.5" />,
      label: "COD",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: <FiHeadphones className="w-4 h-4" />,
      label: "24/7 Support",
      color: "bg-blue-100 text-blue-600"
    },
  ];

  return (
    <div className="w-full py-6 px-4">

      <h2 className="text-center text-sm text-black mb-4 mt-6 font-semibold ">
        OUR PROMISE
      </h2>

    
      <div className="flex justify-center gap-3 max-w-xs mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -3 }}
            className="w-full flex-1 flex-wrap flex"
          >
            <div className={`${feature.color} bg-opacity-40 p-3 rounded-xl flex flex-col items-center border border-transparent hover:border-${feature.color.split('-')[1]}-200 transition-colors flex-sh flex-1`}>
              <div className={`p-2 rounded-lg ${feature.color} bg-opacity-20 mb-2`}>
                {feature.icon}
              </div>
              <p className="text-xs font-medium text-gray-700">
                {feature.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCommitment;