import { useState } from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  RedditShareButton,
  FacebookIcon,
  WhatsappIcon,
  TelegramIcon,
  RedditIcon,
} from "react-share";
import { ClipboardCheck, Share2, X } from "lucide-react";
import { FiLink } from "react-icons/fi";

import { FaXTwitter } from "react-icons/fa6";
import { toast } from "react-toastify";



function ShareProductModal({ productName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const productUrl = window.location.href;
  const shareText = `Check out this product: ${productName}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: shareText,
          url: productUrl,
        });
      } catch (error) {
        toast.error("Sharing canceled or failed.");
      }
    } else {
      toast.warning("Not supported on this device.");
    }
  };

  return (
    <>
   
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2  text-gray-700 hover:text-black monst linkc bg-blue-100 p-1 rounded text-xs border border-blue-400 px-2"
      >
        <Share2 size={14} />  Share
      </button>

     
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md relative animate-fade-in">
            
          
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-black"
            >
              <X size={20} />
            </button>

          
            <h4 className="text-lg font-semibold mb-4">Share this product</h4>

            {/* Social Buttons */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <FacebookShareButton url={productUrl} quote={shareText}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>

              <button
                onClick={() => {
                  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    shareText
                  )}&url=${encodeURIComponent(productUrl)}`;
                  window.open(twitterUrl, "_blank", "noopener,noreferrer");
                }}
                className="w-[32px] h-[32px] rounded-full bg-black text-white flex items-center justify-center"
              >
                <FaXTwitter size={16} />
              </button>

              <WhatsappShareButton url={productUrl} title={shareText}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>

              <TelegramShareButton url={productUrl} title={shareText}>
                <TelegramIcon size={32} round />
              </TelegramShareButton>

              <RedditShareButton url={productUrl} title={shareText}>
                <RedditIcon size={32} round />
              </RedditShareButton>
            </div>

           
            <div className="flex gap-2 text-sm">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-gray-100"
              >
                {copied ? <ClipboardCheck size={16} /> : <FiLink size={16} />}
                {copied ? "Copied" : "Copy Link"}
              </button>

              <button
                onClick={shareNative}
                className="flex items-center gap-1 px-3 py-1 border rounded hover:bg-gray-100"
              >
                <Share2 size={16} />
                Share via Device
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShareProductModal;
