import { Controller, Get, Route, Tags } from 'tsoa';

@Tags('Hello World')
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
