import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function EventExpectations({ eventId, darkMode }) {
  const [expectations, setExpectations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!eventId) return;
    fetchEventExpectations();
  }, [eventId]);

  const fetchEventExpectations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${api}expectations?event_id=${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setExpectations(data);
      }
    } catch (error) {
      console.error("Error", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} p-8 min-h-screen`}>
      <h1 className="text-3xl font-bold text-center mb-4">Attendee Expectations</h1>
      <p className="text-center text-lg text-gray-500">
        Anonymous insights from attendees about the event
      </p>

      {isLoading ? (
        <EventExpectationsLoadingSkeleton darkMode={darkMode} />
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {expectations.length > 0 ? (
            expectations.map((item, index) => (
              <div
                key={index}
                className={`p-4 shadow-md rounded-lg border-l-4 ${darkMode ? "bg-gray-800 border-indigo-400 text-gray-200" : "bg-white border-indigo-500 text-gray-700"}`}
              >
                <p className="italic">"{item}"</p>
                <p className="text-sm text-gray-400 mt-2">— Anonymous</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No expectations submitted yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function EventExpectationsLoadingSkeleton({ darkMode }) {
  return (
    <SkeletonTheme baseColor={darkMode ? "#1F2937" : "#E0E0E0"} highlightColor={darkMode ? "#4B5563" : "#F5F5F5"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {[...Array(18)].map((_, index) => (
          <div key={index} className="p-4 rounded-lg shadow-md border-l-4">
            <Skeleton height={60} className="rounded-md" />
            <Skeleton width={100} height={20} className="mt-2" />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

