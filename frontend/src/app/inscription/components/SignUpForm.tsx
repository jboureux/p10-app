"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    // TODO: Inscription request
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm mb-1">Prénom</label>
        <input
          type="text"
          placeholder="Ton prénom"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
          {...register("firstname")}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Nom</label>
        <input
          type="text"
          placeholder="Ton nom"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
          {...register("lastname")}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          placeholder="exemple@mail.com"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">Email est requis</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Mot de passe</label>
        <input
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
