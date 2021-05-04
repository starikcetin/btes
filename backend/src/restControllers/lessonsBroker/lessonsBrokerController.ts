import { Controller, Get, Route, Tags, Request, Security } from 'tsoa';

import { AuthenticatedExpressRequest } from '../../auth/AuthenticatedExpressRequest';
import { UserModel } from '../../database/UserModel';
import { hasValue } from '../../common/utils/hasValue';
import { UserLessonData } from '../../common/database/UserLessonData';

@Tags('Lessons Broker')
@Route('lessonsBroker')
export class LessonsBrokerController extends Controller {
  /** Returns the data of user regarding the lessons. Progression is in this data. */
  @Get('userLessonData')
  @Security('jwt')
  public async getUserLessonData(
    @Request() req: AuthenticatedExpressRequest
  ): Promise<UserLessonData> {
    const { username } = req.user;
    const user = await UserModel.findOne({ username });

    if (!hasValue(user)) {
      throw new Error(
        `User is authenticated, but user data is not found! Username: ${username}`
      );
    }

    return user.lessonData;
  }
}
