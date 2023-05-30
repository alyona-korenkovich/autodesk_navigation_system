import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Properties, PropertiesDocument } from './shemas/properties.schema';
import { PropertyDto } from './dto/properties.dto';
import {
  ERROR_CREATE_PROPERTY,
  ERROR_DELETE_PROPERTY,
  ERROR_NOT_FOUND_PROPERTY,
  ERROR_UPDATE_PROPERTY,
} from 'Const/errorMessages';
import { ServerException } from '../exceptions/internal.exception';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Properties.name)
    private propertyModel: Model<PropertiesDocument>,
  ) {}

  async findPropertyById(id) {
    try {
      const property = await this.propertyModel.findOne({
        _id: id,
      });
      if (!property) {
        throw new ServerException(ERROR_NOT_FOUND_PROPERTY);
      }
      return property;
    } catch (e) {
      throw new ServerException(ERROR_NOT_FOUND_PROPERTY);
    }
  }

  createProperty(property: PropertyDto) {
    try {
      const newProperty = new this.propertyModel(property);
      return newProperty.save();
    } catch (e) {
      throw new ServerException(ERROR_CREATE_PROPERTY);
    }
  }

  async updateProperty(id, updateProperty: Object) {
    try {
      if (!id || !updateProperty) {
        throw new ServerException(ERROR_UPDATE_PROPERTY);
      }
      await this.propertyModel.findOneAndUpdate({ _id: id }, updateProperty);
      return HttpStatus.CREATED;
    } catch (e) {
      throw new ServerException(ERROR_UPDATE_PROPERTY);
    }
  }

  async deleteProperty(id) {
    try {
      return await this.propertyModel.deleteOne({ _id: id });
    } catch (e) {
      throw new ServerException(ERROR_DELETE_PROPERTY);
    }
  }
}
