import { handleHealth } from './app';

export default function handler(req: any, res: any) {
  return handleHealth(req, res);
}
