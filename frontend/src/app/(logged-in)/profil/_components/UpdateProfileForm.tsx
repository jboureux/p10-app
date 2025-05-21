import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui";

export default function UpdateProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // TODO: Update profile
    console.log(data);
  };

  // TODO: Get user info
  const userInfo = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@gmail.com",
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 lg:px-0">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold mb-1"
            >
              Prénom
            </label>
            <input
              id="firstName"
              type="text"
              defaultValue={userInfo.firstName}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
              {...register("firstName")}
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold mb-1"
            >
              Nom
            </label>
            <input
              id="lastName"
              type="text"
              defaultValue={userInfo.lastName}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
              {...register("lastName")}
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
            defaultValue={userInfo.email}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">Email est requis</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold mb-1"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            placeholder="•••••••••••"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
            {...register("password", { required: true })}
          />
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
            {...register("password", { required: true })}
          />
        </div>

        <div className="text-center">
          <Button type="submit" text="Mettre à jour" widthFull />
        </div>
      </form>
    </div>
  );
}
