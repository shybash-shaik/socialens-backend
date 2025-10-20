export class RefreshTokenRepository {
  async create(_data) {
    throw new Error('Not implemented');
  }

  async findValidByHash(_tokenHash) {
    throw new Error('Not implemented');
  }

  async revokeById(_id) {
    throw new Error('Not implemented');
  }

  async revokeAllForUser(_userId) {
    throw new Error('Not implemented');
  }
}
