import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { OssService } from './oss.service';
import { ObjectsDto } from './dto/oss.dto';

@Controller('api/forge/oss')
export class OssController {
  constructor(private readonly OssService: OssService) {}

  @Get('/buckets')
  getBucket(@Query() query) {
    const bucket_name = query.id;
    const { oauth_client, oauth_token } = query;
    if (!bucket_name || bucket_name === '#') {
      this.OssService.getAllBuckets(oauth_client, oauth_token);
    } else {
      this.OssService.getAllObjects(bucket_name, oauth_client, oauth_token);
    }
  }

  @Post('/buckets')
  createBucket(@Req() req, @Body() body: ObjectsDto) {
    const { oauth_client, oauth_token } = req;
    return this.OssService.createOneBucket(
      oauth_client,
      oauth_token,
      body.bucketKey,
    );
  }

  @Post('/objects')
  @UseInterceptors(FileInterceptor('fileToUpload'))
  uploadObject(
    @Body() body: ObjectsDto,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.OssService.uploadOneObject(
      body.bucketKey,
      req.oauth_client,
      req.oauth_token,
      file,
    );
  }
}
