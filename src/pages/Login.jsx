import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const rutaPorRol = {
  admin: "/admin/dashboard",
  manager: "/admin/dashboard",
  empleado: "/empleado/stock",
  cliente: "/catalogo",
};

// Página de login, único punto de entrada público de la app
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultado = await login(email, password);
    if (resultado.ok) {
      navigate(rutaPorRol[resultado.usuario.rol]);
    } else {
      setError(resultado.error);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 gap-4">
      <div className="w-full max-w-sm bg-gradient-to-b from-white to-background rounded-3xl shadow-xl p-8 flex flex-col items-center border border-accent/20">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-6 shadow-lg">
          <LogIn className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800">
          Ingresá a Vivero Takumi
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Accedé al catálogo, tu carrito y tus pedidos.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-b from-accent to-primary text-white font-medium py-2.5 rounded-xl shadow hover:brightness-105 transition mt-2"
          >
            Ingresar
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-5">
          ¿No tenés cuenta?{" "}
          <Link to="/registro" className="text-primary font-medium hover:underline">
            Registrate
          </Link>
        </p>
      </div>

      <Link
        to="/"
        className="text-sm text-gray-500 hover:text-primary flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al inicio
      </Link>
    </div>
  );
}
