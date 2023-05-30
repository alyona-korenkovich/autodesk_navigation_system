import { ServerException } from '../exceptions/internal.exception';

const { BucketsApi, ObjectsApi, PostBucketsPayload } = require('forge-apis');

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ERROR_DOWNLOAD_PROJECT } from 'Const/errorMessages';
import { ModelDerivativeService } from 'ModelDerivative/model-derivative.service';

@Injectable()
export class OssService {
  constructor(
    private config: ConfigService,
    private modelDerivativeService: ModelDerivativeService,
  ) {}

  async getAllBuckets(oauth_client, oauth_token) {
    try {
      const buckets = await new BucketsApi().getBuckets(
        { limit: 100 },
        oauth_client,
        oauth_token,
      );
      return buckets.body.items.map((bucket) => {
        return {
          id: bucket.bucketKey,
          // Remove bucket key prefix that was added during bucket creation
          text: bucket.bucketKey.replace(
            this.config.get('CLIENT_ID').toLowerCase() + '-',
            '',
          ),
          type: 'bucket',
          children: true,
        };
      });
    } catch (err) {}
  }

  async getAllObjects(bucket_name, oauth_client, oauth_token) {
    try {
      const objects = await new ObjectsApi().getObjects(
        bucket_name,
        { limit: 100 },
        oauth_client,
        oauth_token,
      );
      return objects.body.items.map((object) => {
        return {
          id: Buffer.from(object.objectId).toString('base64'),
          text: object.objectKey,
          type: 'object',
          children: false,
        };
      });
    } catch (err) {}
  }

  async createOneBucket(oauth_client, oauth_token, bucketKey) {
    let payload = new PostBucketsPayload();
    payload.bucketKey =
      this.config.get('CLIENT_ID').toLowerCase() + '-' + bucketKey;
    payload.policyKey = 'transient'; // expires in 24h
    try {
      // Create a bucket using [BucketsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/BucketsApi.md#createBucket).
      const res = await new BucketsApi().createBucket(
        payload,
        {},
        oauth_client,
        oauth_token,
      );
      return { bucketKey: res.body.bucketKey };
    } catch (err) {
      throw new ServerException(
        ERROR_DOWNLOAD_PROJECT + `: ${err?.response?.data?.reason}`,
      );
    }
  }

  async uploadOneObject(bucketKey, oauth_client, oauth_token, file) {
    try {
      // Upload an object to bucket using [ObjectsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/ObjectsApi.md#uploadObject).
      const res = await new ObjectsApi().uploadObject(
        bucketKey,
        file.originalname,
        file.buffer.length,
        file.buffer,
        {},
        oauth_client,
        oauth_token,
      );
      const objectId = Buffer.from(res.body?.objectId).toString('base64');
      await this.modelDerivativeService.translateJobs(
        objectId,
        oauth_client,
        oauth_token,
      );
      return {
        urn: objectId,
      };
    } catch (err) {
      throw new ServerException(ERROR_DOWNLOAD_PROJECT);
    }
  }
}
