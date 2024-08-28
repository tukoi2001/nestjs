declare namespace Auth {
  import('src/enums/app');
  import('src/modules/users/models/user.model');

  import type { StatusCode } from 'src/enums/app';
  import type { UserDocument } from 'src/modules/users/models/user.model';

  type SignUpResponse = App.BaseResponse & {
    userInfo: Partial<UserDocument>;
  };

  type SignInResponse = TokenResponse & {
    statusCode: StatusCode;
    userInfo: Partial<UserDocument>;
  };

  type TokenResponse = {
    accessToken: string;
    refreshToken: string;
  };
}
