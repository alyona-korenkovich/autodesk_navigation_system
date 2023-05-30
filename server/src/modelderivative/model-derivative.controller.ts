import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';

import { TokenDto } from 'Dto/token.dto';

import { ModelDerivativeService } from './model-derivative.service';
import { ModelDerivativeDto } from './dto/Model-derivative.dto';

@Controller('api/forge/modelderivative')
export class ModelDerivativeController {
  constructor(private readonly modelDerivative: ModelDerivativeService) {}

  @Get('/manifest/:urn')
  getObjectManifest(@Req() req: TokenDto, @Param('urn') urn: string) {
    return this.modelDerivative.getObjectManifest(urn, req.oauth_token);
  }

  @Post('/jobs')
  jobs(
    @Req() req: TokenDto,
    @Body() object: ModelDerivativeDto,
  ): Promise<Object> {
    return this.modelDerivative.translateJobs(
      object.objectName,
      req.oauth_client,
      req.oauth_token,
    );
  }

  @Get('/metadata/views/:urn')
  getMetadataViews(
    @Req() req: TokenDto,
    @Param('urn') urn: string,
  ): Promise<Object> {
    return this.modelDerivative.getMetadataViews(req.oauth_token, urn);
  }

  @Get('/metadata/:urn/:guid')
  getMetadataObjects(
    @Req() req: TokenDto,
    @Param('urn') urn: string,
    @Param('guid') guid: string,
  ): Promise<Object> {
    return this.modelDerivative.getMetadataObjects(req.oauth_token, urn, guid);
  }
}
