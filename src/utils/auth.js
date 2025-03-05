const api = import.meta.env.VITE_API_URL;

export const signup = async (userData) => {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${api}signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Token ${token}` }), // Include token only if it exists
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Signup failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Signup Error:", error.message);
    return { error: error.message };
  }
};

export const login = async (credentials) => {
  try {
    const response = await fetch(`${api}login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("authToken", data.token);
      return { success: true, token: data.token };
    } else {
      return { success: false, error: data.error || "Invalid credentials" };
    }
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, error: "Network error. Try again." };
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token; // Returns true if token exists, otherwise false
};

export const logout = () => {
  localStorage.removeItem("authToken");
};
