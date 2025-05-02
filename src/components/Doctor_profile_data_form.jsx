import React, { useState } from 'react';

const Doctor_profile_data_form = () => {
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    experience: '',
    gender: 'male',
    rating: '',
    available_time: '',
    fees: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    try {
      // First: Create doctor profile
      const profileRes = await fetch('http://127.0.0.1:8000/doctors/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          experience: parseInt(formData.experience),
          rating: parseInt(formData.rating),
          fees: parseInt(formData.fees),
        }),
      });

      if (!profileRes.ok) throw new Error('Failed to create doctor profile');

      const doctorData = await profileRes.json();

      // Second: Upload profile image (if any)
      if (imageFile) {
        const imgForm = new FormData();
        imgForm.append('file', imageFile);

        const imgRes = await fetch(`http://127.0.0.1:8000/images/upload/${doctorData.id}`, {
          method: 'POST',
          body: imgForm,
        });

        if (!imgRes.ok) throw new Error('Profile created, but image upload failed');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        profession: '',
        experience: '',
        gender: 'male',
        rating: '',
        available_time: '',
        fees: '',
      });
      setImageFile(null);
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-8 mt-12 rounded">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Doctor Profile Registration</h2>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input name="name" value={formData.name} onChange={handleChange} required
          placeholder="Full Name" className="w-full p-2 border rounded" />

        <input name="profession" value={formData.profession} onChange={handleChange} required
          placeholder="Profession (e.g. Eye Specialist)" className="w-full p-2 border rounded" />

        <input type="number" name="experience" value={formData.experience} onChange={handleChange} required
          placeholder="Years of Experience" className="w-full p-2 border rounded" />

        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input type="number" name="rating" value={formData.rating} onChange={handleChange} required min="1" max="5"
          placeholder="Rating (1-5)" className="w-full p-2 border rounded" />

        <input name="available_time" value={formData.available_time} onChange={handleChange} required
          placeholder="Available Time (e.g. 10:00 AM - 2:00 PM)" className="w-full p-2 border rounded" />

        <input type="number" name="fees" value={formData.fees} onChange={handleChange} required
          placeholder="Fees (e.g. 1500)" className="w-full p-2 border rounded" />

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
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
    {imageFile && <span className="text-gray-700 text-sm truncate">{imageFile.name}</span>}
  </div>
</div>

        <button type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">
          Submit Profile
        </button>

        {submitted && <p className="text-green-600 text-center mt-2">Profile submitted successfully!</p>}
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Doctor_profile_data_form;
