"use server";

import { callAPI } from "@/lib/api-client";
import { retrieveToken } from "@/lib/auth-server";
import { actionClient } from "@/lib/safe-action";
import { GqlError } from "@/types/errors";
import { User } from "@/types/users";
import { z } from "zod";

const schema = z
  .object({
    email: z.string().email("Email invalide").optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères")
      .optional(),
  })
  .refine(
    (data) => {
      // Si un nouveau mot de passe est fourni, le mot de passe actuel est requis
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message:
        "Le mot de passe actuel est requis pour modifier le mot de passe",
      path: ["currentPassword"],
    }
  );

interface UpdateProfileResponse {
  data: {
    updateProfile: User;
  };
}

export const updateProfile = actionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const query = `
    mutation UpdateProfile($updateProfileInput: UpdateProfileInput!) {
      updateProfile(updateProfileInput: $updateProfileInput) {
        id
        email
        firstname
        lastname
        role
      }
    }
    `;

    const variables = {
      updateProfileInput: parsedInput,
    };

    const result: UpdateProfileResponse & GqlError =
      await callAPI<UpdateProfileResponse>({
        query: query,
        variables: variables,
        token: await retrieveToken(),
      });

    if (result.errors) {
      throw new Error(
        result.errors[0]?.message || "Erreur lors de la mise à jour du profil"
      );
    }

    return result;
  });
