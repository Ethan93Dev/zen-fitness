export type authType = {
  username: string;
  email: string;
  password: string;
};

export type profileType = {
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  state: string;
  phone: number;
};

export type WorkoutPlanInput = {
  id: number;
  userId?: number;
  checkin?: Date | string;
  checkinBtn?: boolean;
  time?: Date | string;
  checkout: Date | string;
};
