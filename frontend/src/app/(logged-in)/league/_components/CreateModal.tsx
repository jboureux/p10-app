"use client";

import { Button } from "@/components/ui";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

interface CreateModalProps {
  setShowCreateModal: (show: boolean) => void;
}

export default function CreateModal({ setShowCreateModal }: CreateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [leagueType, setLeagueType] = useState<"privée" | "publique" | null>(
    null
  );

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // TODO: Create a new league
    console.log(data);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-md relative text-gray-800">
          <button
            onClick={() => setShowCreateModal(false)}
            className="absolute top-3 right-4 text-xl font-bold cursor-pointer"
          >
            X
          </button>
          <h3 className="text-xl font-bold mb-2">Créer une League</h3>
          <p className="mb-4 text-sm">
            Créez une League pour jouer avec vos amis
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Nom de la League</label>
              <input
                type="text"
                placeholder="Nom de la League"
                className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                  errors.name ? "mb-1" : "mb-4"
                } focus:outline-none`}
                {...register("name", { required: true })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  Nom de la League est requis
                </p>
              )}
            </div>

            <div
              className={`flex justify-around ${errors.type ? "mb-0" : "mb-8"}`}
            >
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="privée"
                  checked={leagueType === "privée"}
                  className="accent-[#C62828]"
                  {...register("type", {
                    required: true,
                    onChange: (e) => setLeagueType(e.target.value),
                  })}
                />
                Privée
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  className="accent-[#C62828]"
                  {...register("type", {
                    required: true,
                    onChange: (e) => setLeagueType(e.target.value),
                  })}
                />
                Publique
              </label>
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm">Type de League est requis</p>
            )}

            <Button type="submit" text="Créer une League" widthFull />
          </form>
        </div>
      </div>
    </>
  );
}
