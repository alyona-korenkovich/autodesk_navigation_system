import { AuthClientTwoLegged } from 'forge-apis';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SCOPES } from 'Const/config';

@Injectable()
export class AuthAutodeskService {
  cache = {};
  constructor(private config: ConfigService) {}

  getClient(scopes?: string): any {
    return new AuthClientTwoLegged(
      this.config.get('CLIENT_ID'),
      this.config.get('CLIENT_SECRET'),
      scopes || SCOPES.internal,
    );
  }

  async getToken(scopes) {
    const key = scopes.join('+');
    if (this.cache[key]) {
      return this.cache[key];
    }
    const client = this.getClient(scopes);
    let credentials = await client.authenticate();
    this.cache[key] = credentials;
    setTimeout(() => {
      delete this.cache[key];
    }, credentials.expires_in * 1000);
    return credentials;
  }

  /**
   * Retrieves a 2-legged authentication token for preconfigured public scopes.
   * @returns Token object: { "access_token": "...", "expires_at": "...", "expires_in": "...", "token_type": "..." }.
   */
  async getPublicToken() {
    return this.getToken(SCOPES.public);
  }

  /**
   * Retrieves a 2-legged authentication token for preconfigured internal scopes.
   * @returns Token object: { "access_token": "...", "expires_at": "...", "expires_in": "...", "token_type": "..." }.
   */
  async getInternalToken() {
    return this.getToken(SCOPES.internal);
  }
}
