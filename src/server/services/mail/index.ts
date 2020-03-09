class AuthEmailer implements IAuthNotify {
  async notifySignUp(activateLink: string): Promise<void> {
    console.log(activateLink);
  }
}

const authMailer = new AuthEmailer();

export default authMailer;
