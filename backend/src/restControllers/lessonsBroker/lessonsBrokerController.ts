import { Controller, Get, Route, Tags, Request, Security, Post } from 'tsoa';

import { AuthenticatedExpressRequest } from '../../auth/AuthenticatedExpressRequest';
import { UserModel } from '../../database/UserModel';
import { hasValue } from '../../common/utils/hasValue';
import { UserLessonData } from '../../common/database/UserLessonData';
import { simulationManager } from '../../core/simulationManager';
import { socketManager } from '../../socketManager';
import { simulationUidGenerator } from '../../utils/uidGenerators';
import { BlockchainConfig } from '../../common/blockchain/BlockchainConfig';

@Tags('Lessons Broker')
@Route('lessonsBroker')
export class LessonsBrokerController extends Controller {
  constructor() {
    super();
  }
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

  /** Creates a lesson simulation. Returns the `simulationUid`. */
  @Get('create/{lessonUid}')
  public async create(lessonUid: string): Promise<string> {
    const uidStr = simulationUidGenerator.next().toString();

    if (simulationManager.checkSimulationExists(uidStr)) {
      throw new Error(
        `A simulation with ID ${uidStr} already exists! Refusing to create.`
      );
    }
    const config: BlockchainConfig = {
      blockCreationFee: 100,
      coinbaseMaturity: 5,
      targetLeadingZeroCount: 3,
    };
    const ns = socketManager.getOrCreateNamespace(uidStr);
    simulationManager.createSimulation(uidStr, ns, config);

    console.log(`Created ${lessonUid} lesson with simulationUid: ${uidStr}`);

    return uidStr;
  }

  /** Marks a lesson as completed for the user. */
  @Post('complete/{lessonUid}')
  @Security('jwt')
  public async complete(
    @Request() req: AuthenticatedExpressRequest,
    lessonUid: string
  ): Promise<void> {
    const { username } = req.user;

    await UserModel.findOneAndUpdate(
      { username },
      {
        [`lessonData.lessonCompletionDatas.${lessonUid}`]: {
          timestamp: Date.now(),
        },
      }
    );
  }
}
