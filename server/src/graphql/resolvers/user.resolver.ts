import pkg from '@prisma/client';

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

function toUserPublic(user: any) {
  const { password, ...rest } = user;
  return rest;
}

export const userResolvers = {
  Query: {
    getUsers: async () => {
      const users = await prisma.user.findMany();
      return users.map(toUserPublic);
    },
    getUserById: async (_: any, args: { id: number }) => {
      const user = await prisma.user.findUnique({ where: { id: args.id } });
      return user ? toUserPublic(user) : null;
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      args: {
        email: string;
        firstname: string;
        lastname: string;
        password: string;
        role: string;
      }
    ) => {
      
      const apiAvatarId = `avatar_${Math.floor(Math.random() * 10000)}`;

      const newUser = await prisma.user.create({
        data: {
          email: args.email,
          firstname: args.firstname,
          lastname: args.lastname,
          password: args.password, 
          role: args.role,
          apiAvatarId: apiAvatarId,
        },
      });

      return toUserPublic(newUser);
    },
  },
};