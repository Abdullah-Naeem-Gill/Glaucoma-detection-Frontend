import React, { useState } from "react";

const Doctor_profile_data_form = ({ onProfileAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    experience: "",
    gender: "male",
    rating: "",
    available_time: "",
    fees: "",
    email: localStorage.getItem("doctor_email") || "", // Get email from localStorage
  });

  const [imageFile, setImageFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.profession.trim())
      errors.profession = "Profession is required.";
    if (
      !formData.experience ||
      isNaN(formData.experience) ||
      formData.experience <= 0
    )
      errors.experience = "Experience must be a positive number.";
    if (
      !formData.rating ||
      isNaN(formData.rating) ||
      formData.rating < 1 ||
      formData.rating > 5
    )
      errors.rating = "Rating must be between 1 and 5.";
    if (!formData.available_time.trim())
      errors.available_time = "Available time is required.";
    if (!formData.fees || isNaN(formData.fees) || formData.fees <= 0)
      errors.fees = "Fees must be a positive number.";
    if (!formData.email.trim()) errors.email = "Email is required.";
    if (!imageFile) errors.imageFile = "Profile picture is required.";

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setFormErrors((prev) => ({ ...prev, imageFile: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const token = localStorage.getItem("doctor_token");
    if (!token) {
      setError("Unauthorized: Please login first.");
      return;
    }

    try {
      const profileRes = await fetch("http://127.0.0.1:8000/doctors/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          experience: parseInt(formData.experience),
          rating: parseInt(formData.rating),
          fees: parseInt(formData.fees),
          email: formData.email, // Include email in the request
        }),
      });

      if (!profileRes.ok) throw new Error("Failed to create doctor profile");

      const doctorData = await profileRes.json();

      if (imageFile) {
        const imgForm = new FormData();
        imgForm.append("file", imageFile);

        const imgRes = await fetch(
          `http://127.0.0.1:8000/images/upload/${doctorData.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: imgForm,
          }
        );

        if (!imgRes.ok)
          throw new Error("Profile created, but image upload failed");
      }

      setSubmitted(true);
      setFormData({
        name: "",
        profession: "",
        experience: "",
        gender: "male",
        rating: "",
        available_time: "",
        fees: "",
        email: localStorage.getItem("doctor_email") || "",
      });
      setImageFile(null);
      setFormErrors({});

      // Call the callback to refresh doctors list
      if (onProfileAdded) {
        onProfileAdded();
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-8 mt-12 rounded">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Doctor Profile Registration
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <div>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Full Name"
            className="w-full p-2 border rounded"
          />
          {formErrors.name && (
            <p className="text-red-600 text-sm">{formErrors.name}</p>
          )}
        </div>

        <div>
          <input
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            required
            placeholder="Profession (e.g. Eye Specialist)"
            className="w-full p-2 border rounded"
          />
          {formErrors.profession && (
            <p className="text-red-600 text-sm">{formErrors.profession}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            min="1"
            placeholder="Years of Experience"
            className="w-full p-2 border rounded"
          />
          {formErrors.experience && (
            <p className="text-red-600 text-sm">{formErrors.experience}</p>
          )}
        </div>

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <div>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            min="1"
            max="5"
            placeholder="Rating (1-5)"
            className="w-full p-2 border rounded"
          />
          {formErrors.rating && (
            <p className="text-red-600 text-sm">{formErrors.rating}</p>
          )}
        </div>

        <div>
          <input
            name="available_time"
            value={formData.available_time}
            onChange={handleChange}
            required
            placeholder="Available Time (e.g. 10:00 AM - 2:00 PM)"
            className="w-full p-2 border rounded"
          />
          {formErrors.available_time && (
            <p className="text-red-600 text-sm">{formErrors.available_time}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            name="fees"
            value={formData.fees}
            onChange={handleChange}
            required
            min="1"
            placeholder="Fees (e.g. 1500)"
            className="w-full p-2 border rounded"
          />
          {formErrors.fees && (
            <p className="text-red-600 text-sm">{formErrors.fees}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email Address"
            className="w-full p-2 border rounded"
          />
          {formErrors.email && (
            <p className="text-red-600 text-sm">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture
          </label>
          <div className="flex items-center space-x-4">
            <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imageFile && (
              <span className="text-gray-700 text-sm truncate">
                {imageFile.name}
              </span>
            )}
          </div>
          {formErrors.imageFile && (
            <p className="text-red-600 text-sm mt-1">{formErrors.imageFile}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Submit Profile
        </button>

        {submitted && (
          <p className="text-green-600 text-center mt-2">
            Profile submitted successfully!
          </p>
        )}
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Doctor_profile_data_form;
