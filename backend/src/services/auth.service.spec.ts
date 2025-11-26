import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from 'src/config/user.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from 'src/config/refresh-token.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const mocRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
};

const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn()
}

const mockConfigService = {
    get: jest.fn((key: string) => {
        switch (key) {
            case "JWT_EXPIRES_IN":
                return 'mock_key';
            default:
                break;
        }

        return null;
    })
}

describe('AppService', () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getRepositoryToken(User),
                    useValue: mocRepository,
                },
                {
                    provide: getRepositoryToken(RefreshToken),
                    useValue: mocRepository,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: ConfigService,
                    useValue: mockJwtService,
                }
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

});
