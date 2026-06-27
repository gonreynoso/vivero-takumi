import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

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
  const [mostrarPassword, setMostrarPassword] = useState(false);
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
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center bg-background dark:bg-gray-950 px-4 gap-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm bg-gradient-to-b from-white to-background dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl dark:shadow-none p-8 flex flex-col items-center border border-accent/20 dark:border-gray-700">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-6 shadow-lg">
          <LogIn className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800 dark:text-gray-100">
          Ingresá a Vivero Takumi
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 text-center">
          Accedé al catálogo, tu carrito y tus pedidos.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400 text-sm"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={mostrarPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400 text-sm"
            />
            <button
              type="button"
              onClick={() => setMostrarPassword((v) => !v)}
              aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {mostrarPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-b from-accent to-primary text-white font-medium py-2.5 rounded-xl shadow hover:brightness-105 transition mt-2"
          >
            Ingresar
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-5">
          ¿No tenés cuenta?{" "}
          <Link to="/registro" className="text-primary dark:text-accent font-medium hover:underline">
            Registrate
          </Link>
        </p>
      </div>

      <Link
        to="/"
        className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-accent flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al inicio
      </Link>
    </div>
  );
}
