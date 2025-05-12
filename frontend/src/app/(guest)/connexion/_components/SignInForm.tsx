"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui";
import { AUTH_REDIRECT_PATH } from "@/config/auth";
import { useAuth } from "@/hooks/useAuth";
import { LogInRequest } from "@/types/auth";

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const auth = useAuth();
  const router = useRouter();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await auth.logIn(data as LogInRequest);
      router.push(AUTH_REDIRECT_PATH);
    } catch (e) {
      let message = "Unknown Error";
      if (e instanceof Error) message = e.message;
      console.log(message);
    }
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="exemple@mail.com"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">Email is required</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm mb-1">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">Password is required</p>
        )}
      </div>

      <Button type="submit" text="Se connecter" widthFull onClick={() => {}} />

      <p className="text-center text-sm mt-4">
        Pas encore inscrit ?{" "}
        <Link href="/inscription" className="text-[#C62828] font-semibold">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}

