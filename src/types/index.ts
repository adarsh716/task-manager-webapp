export type LoginFormInputs = {
  email: string;
  password: string;
};

export type SignUpFormInputs = {
  fullName: string;
  email: string;
  password: string;
};

export type TaskType = {
 _id?:string;
  title: string;
  description?: string;
  priority: string;
  dueDate: Date;
  isComplete?:boolean;
};
