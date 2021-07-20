const accounts = [
  {
    id: "1",
    email: "devchirps@mandiwise.com",
  },
];

export const resolvers = {
  Account: {
    __resolveReference(reference: { id: string }, context: any, info: any) {
      return accounts.find((account) => account.id === reference.id);
    },
  },
  Query: {
    viewer: (_: undefined, args: Record<string, any>, { user }: { user: Record<string, any> }, info: any) => {
      console.log({ user });
      return accounts[0];
    },
  },
};
