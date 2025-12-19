export interface JsonResponse<T = unknown> {
  status: string;
  message: string;
  data: T;
}
