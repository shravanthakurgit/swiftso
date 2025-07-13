import { useEffect, useState } from "react";
import { backendUrl } from "../../utils/backendUrl";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ReviewForm = ({ productId }) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);


  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const ratings = [
    { r: 1, label: "Very Poor" },
    { r: 2, label: "Poor" },
    { r: 3, label: "Average" },
    { r: 4, label: "Good" },
    { r: 5, label: "Excellent" },
  ];

  useEffect(() => {
    if (comment === "" && rating) {
      const matched = ratings.find((item) => item.r === rating);
      if (matched) {
        setComment(matched.label);
        console.log(comment);
      }
    }
  }, [rating,comment]);

  useEffect(() => {
    setComment(comment);
  }, [comment]);

  const submitReview = async (e) => {
    e.preventDefault();

    if (rating === null) {
      setMessage({ type: "error", text: "Please select a rating." });

      return;
    }

    setLoading(true);

    try {
      const finalComment =
        comment || ratings.find((item) => item.r === rating)?.label || "";

      const response = await axiosInstance.post(
        `${backendUrl}/api/product/add-review`,
        {
          productId,
          rating,
          comment: finalComment,
        },
        {
          withCredentials: true,
        }
      );

      setMessage({ type: "success", text: response.data.message });
      setShowForm(false);
      setRating(0);
      setComment("");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit review";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  useEffect(() => {
    if (message) {
      setMessage(null);
    }
  }, [rating]);

  return (
    <div className="w-[100%] mx-auto mt-6">
      {message && (
        <div
          className={`mt-4 p-3 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={submitReview}
          className="mt-4 w-full bg-white px-6 py-3 rounded-md space-y-4 border mb-4"
        >
          <div>
            <label className="flex flex-col mb-1 font-medium monst">
              Rate This Product <span className="text-[6px] text-red-600">For testing purpose only ! later review will be done after purchasing</span>
            </label>

            <div className="w-full flex flex-wrap  items-start justify-center monst font-semibold">
              {ratings.map(({ r, label }) => (
                <label
                  key={r}
                  htmlFor={`rating-${r}`}
                  className="flex-1 flex flex-col  px-2 text-[8px] flex-shrink-0 gap-2 my-2 justify-start"
                >
                  <input
                    id={`rating-${r}`}
                    type="button"
                    value={r}
                    onClick={() => setRating(r)}
                    className={`py-2 px-3 border-[1.5px] text-xs rounded-md ${
                      rating === r
                        ? "bg-[var(--primary)] text-[var(--secondary)] border-[var(--secondary)]"
                        : ""
                    }`}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium monst text-left ml-1 mt-6 ">
              Comment:
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full bg-gray-100 border rounded-md text-sm px-3 py-2 resize-none poppins outline-none text-gray-700"
              placeholder="Write your review here..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[var(--primary)] text-[var(secondary)] rounded-sm hover:bg-yellow-400 hover:text-yellow-900 transition disabled:opacity-50 w-[100%] monst text-sm font-semibold"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      <button
        onClick={() => {
          if (isAuthenticated) {
            setShowForm(!showForm);
          } else {
            navigate("/login");
          }
        }}
        className={`${
          showForm
            ? "px-4 py-2 border border-red-600 bg-red-200 text-red-600 rounded-md transition monst w-[95%]"
            : "px-4 py-2 border border-[var(--primary)] bg-yellow-50 text-yellow-600 rounded-md transition w-full monst"
        }`}
      >
        {showForm ? "Cancel" : "Add Review"}
      </button>
    </div>
  );
};

export default ReviewForm;
