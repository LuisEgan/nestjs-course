import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

describe('User entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.salt = 'testSalt';
    user.password = 'testpassword';
    bcrypt.hash = jest.fn();
  });

  describe('validatePassword', () => {
    it('return true if pass is valid', async () => {
      bcrypt.hash.mockReturnValue('testpassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const res = await user.validatePassword('123');
      expect(bcrypt.hash).toBeCalledWith('123', 'testSalt');
      expect(res).toEqual(true);
    });

    it('return false if pass is invalid', async () => {
      bcrypt.hash.mockReturnValue('BADtestpassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const res = await user.validatePassword('123');
      expect(bcrypt.hash).toBeCalledWith('123', 'testSalt');
      expect(res).toEqual(false);
    });
  });
});
