declare module 'express' {
  interface Request {
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      role: Role;
      isConfirmed: boolean;
    };
  }
}