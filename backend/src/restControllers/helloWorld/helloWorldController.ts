import { Controller, Get, Route } from 'tsoa';

@Route('helloWorld')
export class HelloWorldController extends Controller {
  /**
   * Returns "Hello, World!".
   */
  @Get()
  public async helloWorld(): Promise<string> {
    return 'Hello, World!';
  }
}
