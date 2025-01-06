import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { log } from "node:console";

const Login = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/login", { username, role });
      if (response.status === 200) {
        router.push("/user-queue");
      }
    } catch (err: any) {
      setError("ورود ناموفق بود، لطفا دوباره تلاش کنید.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-8 rounded-lg shadow-lg m-3 py-20">
        <h2 className="text-center text-2xl font-semibold mb-10">
          ورود به حساب
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="username" className="block text-gray-700">
              نام کاربری
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-10">
            <label htmlFor="role" className="block text-gray-700">
              نقش
            </label>
            <select
              id="role"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">کاربر</option>
              <option value="operator">اپراتور</option>
            </select>
          </div>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <button
            type="submit"
            className={`w-full py-2 px-4 text-white bg-blue-500 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
};

Login.useLayout = true;

export default Login;
