// eslint-disable-next-line @typescript-eslint/naming-convention
export enum E_HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type TTokenForge = {
  access_token: string;
  expires_in: number;
};

export enum ETab {
  TASKS = 'Задачи',
  DIGITAL_ASSET = 'Цифровой актив',
  SPACE = 'Пространство',
  DOCUMENTS = 'Документы',
  UTILITIES = 'КУ',
  EXPLOITATION = 'Эксплуатация',
  NAVIGATION = 'Навигация',
}
