import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui";
import { User } from "@/types/users";
import { updateProfile } from "../_actions/update-profile.action";

export default function UpdateProfileForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      // Préparer les données à envoyer
      const updateData: Partial<{
        firstname: string;
        lastname: string;
        email: string;
        newPassword: string;
        currentPassword: string;
      }> = {};

      // Ajouter seulement les champs modifiés
      if (data.firstname && data.firstname !== user.firstname) {
        updateData.firstname = data.firstname;
      }
      if (data.lastname && data.lastname !== user.lastname) {
        updateData.lastname = data.lastname;
      }
      if (data.email && data.email !== user.email) {
        updateData.email = data.email;
      }
      if (data.newPassword && data.newPassword.trim() !== "") {
        updateData.newPassword = data.newPassword;
        updateData.currentPassword = data.currentPassword;
      }

      const result = await updateProfile(updateData);

      if (result?.data) {
        console.log("Profil mis à jour avec succès !");
        // Réinitialiser le champ mot de passe
        reset({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          currentPassword: "",
          newPassword: "",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      console.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 lg:px-0">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-semibold mb-1"
            >
              Prénom
            </label>
            <input
              id="firstname"
              type="text"
              defaultValue={user.firstname}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
              {...register("firstname")}
            />
          </div>

          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-semibold mb-1"
            >
              Nom
            </label>
            <input
              id="lastname"
              type="text"
              defaultValue={user.lastname}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
              {...register("lastname")}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            defaultValue={user.email}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">Email est requis</p>
          )}
        </div>

        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-semibold mb-1"
          >
            Mot de passe actuel
          </label>
          <input
            id="currentPassword"
            type="password"
            placeholder="•••••••••••"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
            {...register("currentPassword")}
          />
          <p className="text-gray-500 text-xs mt-1">
            Laissez vide si vous ne souhaitez pas changer votre mot de passe
          </p>
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-semibold mb-1"
          >
            Nouveau mot de passe
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="•••••••••••"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
            {...register("newPassword", {
              minLength: {
                value: 6,
                message: "Le mot de passe doit contenir au moins 6 caractères",
              },
            })}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message as string}
            </p>
          )}
        </div>

        <div className="text-center">
          <Button
            type="submit"
            text={isLoading ? "Mise à jour..." : "Mettre à jour"}
            widthFull
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
}
