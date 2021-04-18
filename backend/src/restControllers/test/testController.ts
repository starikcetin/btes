import { Body, Controller, Delete, Get, Post, Put, Res, Route } from 'tsoa';
import { TestModel } from '../../database/TestModel';
import { hasValue } from '../../common/utils/hasValue';
import { TestData, TestDataRaw } from '../../common/database/TestData';
import { SuccessResponse, TsoaResponse } from '@tsoa/runtime';

@Route('test')
export class TestController extends Controller {
  /**
   * Returns all Tests.
   */
  @Get()
  public async getAllTests(): Promise<TestData[]> {
    return TestModel.find();
  }

  /**
   * Returns a Test.
   */
  @Get('{id}')
  public async getTest(
    id: string,
    @Res() notFoundResponse: TsoaResponse<404, { reason: string }>
  ): Promise<TestData> {
    const result = await TestModel.findById(id);

    if (!hasValue(result)) {
      return notFoundResponse(404, {
        reason: `No Test found with id ${id}`,
      });
    }

    return result;
  }

  /**
   * Creates a new Test.
   * Returns the created Test.
   */
  @SuccessResponse(201, 'Created')
  @Post()
  public async createTest(@Body() data: TestDataRaw): Promise<TestData> {
    const created = TestModel.create(data);

    this.setStatus(201);
    return created;
  }

  /**
   * Updates an existing Test.
   * Returns the updated version of the Test.
   * The body has to be complete, pass in non-updated fields as-is.
   */
  @Put('{id}')
  public async updateTest(
    id: string,
    @Body() data: TestDataRaw,
    @Res() notFoundResponse: TsoaResponse<404, { reason: string }>
  ): Promise<TestData> {
    const updated = await TestModel.findByIdAndUpdate(id, data, {
      new: true,
      omitUndefined: true,
    });

    if (!hasValue(updated)) {
      return notFoundResponse(404, {
        reason: `No Test found with id ${id}`,
      });
    }

    return updated;
  }

  /**
   * Deletes a Test.
   */
  @SuccessResponse(204, 'Deleted')
  @Delete('{id}')
  public async deleteTest(
    id: string,
    @Res() notFoundResponse: TsoaResponse<404, { reason: string }>
  ): Promise<void> {
    const result = await TestModel.findByIdAndDelete(id);

    if (!hasValue(result)) {
      return notFoundResponse(404, {
        reason: `No Test found with id ${id}`,
      });
    }

    this.setStatus(204);
  }
}
