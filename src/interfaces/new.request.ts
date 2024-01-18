import { Request } from 'express';

export interface NewRequest extends Request {
  auth: {
    id: string;
  };
}
