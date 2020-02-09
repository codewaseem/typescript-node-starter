export class FakeUser implements User {
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}

export class LoginValidatorMock implements LoginInputValidator {
  isValidEmail(email: string): boolean {
    return !email.includes("bad");
  }
  isValidPassword(password: string): boolean {
    return !password.includes("bad");
  }
}

export class UserGateWayMockThatWorks implements UserDBGateway {
  private db: { [key: string]: string } = {};
  getUserByEmailAndPassword(email: string, password: string): Promise<User> {
    if (this.db[email] && this.db[email] == password) {
      return Promise.resolve(new FakeUser(`${email}-${password}`));
    } else throw new Error("wrong password");
  }
  async addUser(email: string, password: string): Promise<User> {
    this.db[email] = password;
    return new FakeUser(`${email}-${password}`);
  }
}

export class BrokenUserGateWayMock implements UserDBGateway {
  addUser(email: string, password: string): Promise<User> {
    throw new Error(`${email}-${password}`);
  }

  getUserByEmailAndPassword(email: string, password: string): Promise<User> {
    throw new Error(`${email}-${password}`);
  }
}
