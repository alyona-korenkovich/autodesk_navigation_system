import { HttpStatus, Injectable } from '@nestjs/common';
import {
  DerivativesApi,
  JobPayload,
  JobPayloadInput,
  JobPayloadOutput,
  JobSvfOutputPayload,
} from 'forge-apis';

import { formItems } from 'ModelDerivative/utils';
import { ModelDerivativeMetadataViews } from 'ModelDerivative/dto/Model-derivative.dto';

@Injectable()
export class ModelDerivativeService {
  constructor() {}

  async getObjectManifest(urn: string, oauth_token: string) {
    try {
      // Retrieves the manifest for the source design specified by the urn URI parameter.
      const manifest = await new DerivativesApi().getManifest(
        urn,
        {},
        null,
        oauth_token,
      );
      return { manifest: manifest };
    } catch (err) {
      return err;
    }
  }

  async translateJobs(
    objectName: string,
    oauth_client: string,
    oauth_token: string,
  ) {
    let job = new JobPayload();
    job.input = new JobPayloadInput();
    job.input.urn = objectName;
    job.output = new JobPayloadOutput([new JobSvfOutputPayload()]);
    job.output.formats[0].type = 'svf';
    job.output.formats[0].views = ['2d', '3d'];
    job.output.formats[0].advanced = { generateMasterViews: true };
    try {
      // Submit a translation job using [DerivativesApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/DerivativesApi.md#translate).
      await new DerivativesApi().translate(job, {}, oauth_client, oauth_token);
      return HttpStatus.OK;
    } catch (err) {
      return HttpStatus.BAD_REQUEST;
    }
  }

  async getMetadataViews(
    oauth_token: string,
    urn: string,
  ): Promise<ModelDerivativeMetadataViews> {
    const metadataViews = await new DerivativesApi().getMetadata(
      urn,
      {},
      null,
      oauth_token,
    );
    if (metadataViews?.body?.data) {
      return metadataViews?.body?.data;
    }
    return null;
  }

  async getMetadataObjects(oauth_token: string, urn: string, guid: string) {
    return await new DerivativesApi().getModelviewMetadata(
      urn,
      guid,
      {},
      null,
      oauth_token,
    );
  }

  async getManifestFromViews(
    token: string,
    urn: string,
    projectId: string,
  ): Promise<Object[]> {
    try {
      let manifestResult;
      do {
        manifestResult = await this.getObjectManifest(urn, token);
      } while (manifestResult?.manifest.body.status !== 'success');
      const { metadata } = await this.getMetadataViews(token, urn);
      const allItems = [];
      await Promise.all(
        metadata.map(async (view) => {
          const { guid } = view;
          let resultMetadataObject;
          do {
            resultMetadataObject = await this.getMetadataObjects(
              token,
              urn,
              guid,
            );
          } while (resultMetadataObject.body?.result === 'success');
          if (resultMetadataObject?.body?.data?.objects) {
            const arrayItems = formItems(
              resultMetadataObject.body.data.objects,
              projectId,
            );
            allItems.push(...arrayItems);
            return arrayItems;
          } else {
            return Promise.reject();
          }
        }),
      );
      return allItems;
    } catch (e) {
      await Promise.reject(e);
    }
  }
}
