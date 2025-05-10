export const throwIfNotRunOnClient = () => {
  const isServer = typeof window === "undefined";

  if (isServer)
    throw new Error(
      "When passing a token, this hook must be used in a client component"
    );
};
