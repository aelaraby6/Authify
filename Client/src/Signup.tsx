import { useState } from "react";
import { AuthController } from "@/core/controllers/AuthController";

const controller = new AuthController();

export function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await controller.handleRegister(name, email, password);
    if (res) setMessage("Registration successful");
    else setMessage(controller.getError() || "Registration failed");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto mt-10">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="border p-2 rounded"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 rounded"
      />
      <button
        disabled={controller.getLoading()}
        type="submit"
        className="bg-blue-500 text-white p-2 rounded"
      >
        {controller.getLoading() ? "Loading..." : "Sign Up"}
      </button>
      <p className="text-center text-sm text-gray-600">{message}</p>
    </form>
  );
}
