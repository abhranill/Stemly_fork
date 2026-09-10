import { handleGenerateVisual } from './app';

export default async function handler(req: any, res: any) {
  return handleGenerateVisual(req, res);
}
