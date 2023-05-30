import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertyDto } from './dto/properties.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Controller('api/property')
export class PropertiesController {
  constructor(private readonly PropertiesService: PropertiesService) {}

  @Get('/:id')
  getProperty(@Param('id') id: string) {
    return this.PropertiesService.findPropertyById(id);
  }

  @Post('/')
  createProperty(@Body() property: PropertyDto) {
    return this.PropertiesService.createProperty(property);
  }

  @Put('/')
  updateProperty(@Body() body: UpdatePropertyDto) {
    return this.PropertiesService.updateProperty(
      body._id,
      body.update_property,
    );
  }

  @Delete('/:id')
  deleteProperty(@Param('id') id: string) {
    return this.PropertiesService.deleteProperty(id);
  }
}
