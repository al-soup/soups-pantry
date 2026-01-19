import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common/interfaces';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let mockArgumentsHost: ArgumentsHost;
  let loggerErrorSpy: jest.SpyInstance;
  let loggerWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();

    mockRequest = {
      method: 'GET',
      url: '/test',
    };

    mockResponse = {
      status: jest.fn().mockReturnThis() as unknown as number,
      json: jest.fn().mockReturnThis(),
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException with 404 status', () => {
    const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 404,
      timestamp: expect.any(String) as string,
      path: '/test',
      method: 'GET',
      message: 'Not found',
    });
    expect(loggerWarnSpy).toHaveBeenCalledWith('GET /test - 404 - Not found');
  });

  it('should handle HttpException with 500 status', () => {
    const exception = new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      timestamp: expect.any(String) as string,
      path: '/test',
      method: 'GET',
      message: 'Internal server error',
    });
    expect(loggerErrorSpy).toHaveBeenCalled();
  });

  it('should handle generic Error', () => {
    const exception = new Error('Something went wrong');

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      timestamp: expect.any(String) as string,
      path: '/test',
      method: 'GET',
      message: 'Something went wrong',
    });
    expect(loggerErrorSpy).toHaveBeenCalled();
  });

  it('should handle unknown exception', () => {
    const exception = 'Unknown error';

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      timestamp: expect.any(String) as string,
      path: '/test',
      method: 'GET',
      message: 'Internal server error',
    });
    expect(loggerErrorSpy).toHaveBeenCalled();
  });

  it('should handle HttpException with object response', () => {
    const exception = new HttpException(
      { message: ['Error 1', 'Error 2'] },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      timestamp: expect.any(String) as string,
      path: '/test',
      method: 'GET',
      message: ['Error 1', 'Error 2'],
    });
    expect(loggerWarnSpy).toHaveBeenCalledWith(
      'GET /test - 400 - Error 1, Error 2',
    );
  });
});
