import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtStragety } from './jwt.stragety';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JwtStrategy', () => {
  let jwtStragety: JwtStragety;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStragety,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    jwtStragety = module.get<JwtStragety>(JwtStragety);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('returns user based on JWT payload', async () => {
      const user = new User();
      user.username = 'testUser';

      userRepository.findOne.mockResolvedValue(user);
      const res = await jwtStragety.validate({ username: 'pn' });
      expect(userRepository.findOne).toBeCalledWith({
        username: 'pn',
      });
      expect(res).toEqual(user);
    });

    it('throws error if user was not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(jwtStragety.validate({ username: 'ayye' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
