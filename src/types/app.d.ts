declare namespace App {
  import('src/enums/app');

  import type { StatusCode } from 'src/enums/app';

  type Any = any;

  type BaseResponse = {
    statusCode: StatusCode;
    message: string;
  };
}
