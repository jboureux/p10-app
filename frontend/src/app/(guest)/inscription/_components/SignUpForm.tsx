"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui";
import { AUTH_REDIRECT_PATH } from "@/config/auth";
import { useAuth } from "@/hooks/useAuth";
import { RegisterRequest } from "@/types/auth";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const auth = useAuth();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await auth.register(data as RegisterRequest);
      router.push(AUTH_REDIRECT_PATH);
    } catch (e) {
      let message = "Unknown Error";
      if (e instanceof Error) message = e.message;
      console.log(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="firstname" className="block text-sm mb-1">
          Prénom
        </label>
        <input
          id="firstname"
          type="text"
          placeholder="Ton prénom"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
          {...register("firstname")}
        />
      </div>

      <div>
        <label htmlFor="lastname" className="block text-sm mb-1">
          Nom
        </label>
        <input
          id="lastname"
          type="text"
          placeholder="Ton nom"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
          {...register("lastname")}
        />
      </div>

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
          <p className="text-red-500 text-sm mt-1">Email est requis</p>
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
          <p className="text-red-500 text-sm mt-1">Mot de passe est requis</p>
        )}
      </div>

      <Button type="submit" text="S'inscrire" widthFull onClick={() => {}} />
      <p className="text-center text-sm mt-4">
        Déjà inscrit ?{" "}
        <Link href="/signin" className="text-[#C62828] font-semibold">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
