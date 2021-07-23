export type UpdateAccountInput = {
  email?: string;
  newPassword?: string;
  password?: string;
};

export type CustomAppMetadata = {
  groups: string[];
  permissions: string[];
  roles: string[];
};
