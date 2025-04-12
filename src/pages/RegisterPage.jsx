import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', dob: '', isAdmin: false });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('https://room-booking-server-j6su.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...form, 
        isAdmin: form.isAdmin === 'true'  // Convert string to boolean
      })
    });

    const data = await res.json();
    
    if (res.ok) {
      login(data);
      navigate('/');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="text" placeholder="Username" 
          value={form.username} 
          onChange={(e) => setForm({ ...form, username: e.target.value })} 
          className="p-2 border rounded" 
          required 
        />
        
        <input 
          type="email" placeholder="Email" 
          value={form.email} 
          onChange={(e) => setForm({ ...form, email: e.target.value })} 
          className="p-2 border rounded" 
          required 
        />
        
        <input 
          type="password" placeholder="Password" 
          value={form.password} 
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
          className="p-2 border rounded" 
          required 
        />

        <input 
          type="date" placeholder="Date of Birth" 
          value={form.dob} 
          onChange={(e) => setForm({ ...form, dob: e.target.value })} 
          className="p-2 border rounded" 
          required 
        />

        <select 
          value={form.isAdmin} 
          onChange={(e) => setForm({ ...form, isAdmin: e.target.value })} 
          className="p-2 border rounded"
        >
          <option value="false">User</option>
          <option value="true">Admin</option>
        </select>

        <button type="submit" className="bg-green-600 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
