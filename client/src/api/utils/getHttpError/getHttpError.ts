export const getHttpError = async (response: Response) => {
  const { message } = await response.json();
  return message;
};
