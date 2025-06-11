export type User = {
  id: number;
  name: string;
  points: number;
  age: number;
  address: string;
};

export type UserResponse = {
  data: User[];
};

export type UserPayload = {
  name: string;
  age: number;
  address: string;
};

export type CreatedUserResponse = {
  data: User;
};

export type UpdatedUserResponse = CreatedUserResponse;

export type UpdatePointPayload = {
  points: number;
};
