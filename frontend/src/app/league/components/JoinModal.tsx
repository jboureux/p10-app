"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui";

interface JoinModalProps {
  setShowJoinModal: (show: boolean) => void;
}

export default function JoinModal({ setShowJoinModal }: JoinModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    // TODO: Join league with code
    console.log(data);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4 text-gray-800">
        <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
          <button
            onClick={() => setShowJoinModal(false)}
            className="absolute top-3 right-4 text-xl font-bold cursor-pointer"
          >
            X
          </button>
          <h3 className="text-xl font-bold mb-2">Rejoindre une League</h3>
          <p className="mb-4 text-sm">
            Indiquez le code pour rejoindre la League
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Code</label>
              <input
                type="text"
                placeholder="0000"
                className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${
                  errors.code ? "mb-1" : "mb-6"
                } text-center tracking-widest focus:outline-none`}
                {...register("code", { required: true })}
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">Code est requis</p>
              )}
            </div>

            <Button type="submit" text="Rejoindre" widthFull />
          </form>
        </div>
      </div>
    </>
  );
}
