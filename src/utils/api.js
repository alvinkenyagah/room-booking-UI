export const api = async (endpoint, method = 'GET', body = null, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
  
    const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
  };
  