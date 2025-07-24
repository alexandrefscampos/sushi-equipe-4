import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrap } from './main';

jest.mock('@nestjs/core');

describe('bootstrap', () => {
  let mockApp: {
    enableCors: jest.Mock;
    listen: jest.Mock;
  };

  beforeEach(() => {
    mockApp = {
      enableCors: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the app with AppModule', async () => {
    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
  });

  it('should enable CORS with correct configuration', async () => {
    await bootstrap();

    expect(mockApp.enableCors).toHaveBeenCalledWith({
      origin: 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
  });

  it('should listen on default port 8080 if PORT is not set', async () => {
    delete process.env.PORT;

    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith(8080);
    expect(console.log).toHaveBeenCalledWith('Application is running on: http://localhost:8080');
  });

  it('should listen on custom port from environment variable', async () => {
    process.env.PORT = '3000';

    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith('3000');
    expect(console.log).toHaveBeenCalledWith('Application is running on: http://localhost:3000');
  });
});
