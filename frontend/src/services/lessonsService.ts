import axios from 'axios';

import axiosAuth from '../helpers/axiosAuth';
import { UserLessonData } from '../common/database/UserLessonData';

class LessonsService {
  public async getUserLessonData(): Promise<UserLessonData> {
    const response = await axiosAuth().get<UserLessonData>(
      '/api/rest/lessonsBroker/userLessonData'
    );
    return response.data;
  }

  public async create(lessonUid: string): Promise<string> {
    const response = await axios.get<string>(
      `/api/rest/lessonsBroker/create/${lessonUid}`
    );
    return response.data;
  }

  public async complete(lessonUid: string): Promise<void> {
    await axiosAuth().post<void>(
      `/api/rest/lessonsBroker/complete/${lessonUid}`
    );
  }
}

export const lessonsService = new LessonsService();
