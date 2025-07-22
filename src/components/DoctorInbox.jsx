import React, { useEffect, useState } from "react";

const DoctorInbox = ({ onSelectPatient, onClose }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://127.0.0.1:8000/patientauth/");
        if (!res.ok) throw new Error("Failed to fetch patients");
        const data = await res.json();
        setPatients(data.filter((p) => p.is_verified));
      } catch (err) {
        setError(err.message || "Error fetching patients");
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close inbox"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Patient Inbox</h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading patients...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : patients.length === 0 ? (
          <div className="text-center text-gray-500">
            No verified patients found.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {patients.map((patient) => (
              <li
                key={patient.id}
                className="py-3 px-2 hover:bg-blue-50 cursor-pointer flex flex-col"
                onClick={() => onSelectPatient(patient)}
              >
                <span className="font-medium text-gray-800">
                  {patient.name}
                </span>
                <span className="text-sm text-gray-500">{patient.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DoctorInbox;
