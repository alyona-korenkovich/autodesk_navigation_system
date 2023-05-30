import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ModelDerivativeService } from 'ModelDerivative/model-derivative.service';

import { Items, ItemsDocument } from './shemas/items.schema';
import {
  ERROR_CREATE_ITEM,
  ERROR_DELETE_ITEM,
  ERROR_NOT_FOUND_ITEM,
  ERROR_UPDATE_ITEM,
} from 'Const/errorMessages';
import { ItemDto } from './dto/item.dto';
import { ServerException } from '../exceptions/internal.exception';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Items.name) private itemsModel: Model<ItemsDocument>,
    private modelDerivativeService: ModelDerivativeService,
  ) {}

  async findById(id) {
    try {
      const item = await this.itemsModel.findOne({
        _id: id,
      });
      if (!item) {
        throw new ServerException(ERROR_NOT_FOUND_ITEM);
      }
      return item;
    } catch (e) {
      throw new ServerException(ERROR_NOT_FOUND_ITEM);
    }
  }

  async findByIdInProject(projectId: string, idInProject: string) {
    try {
      return this.itemsModel.findOne({
        project_id: projectId,
        id_in_project: idInProject,
      });
    } catch (e) {
      throw new ServerException(ERROR_NOT_FOUND_ITEM);
    }
  }

  async findAllItemsByProject(projectId) {
    try {
      const items = await this.itemsModel.find({ project_id: projectId });
      if (!items) {
        throw new ServerException(ERROR_NOT_FOUND_ITEM);
      }
      return items;
    } catch (e) {
      throw new ServerException(ERROR_NOT_FOUND_ITEM);
    }
  }

  async createItem(itemInput: ItemDto | ItemDto[]) {
    try {
      const items = Array.isArray(itemInput) ? itemInput : [itemInput];
      items.map(async (item) => {
        const existItem = await this.findByIdInProject(
          item.project_id,
          item.id_in_project,
        );
        if (!existItem) {
          const newItem = new this.itemsModel(item);
          await newItem.save();
        }
      });
    } catch (e) {
      throw new ServerException(ERROR_CREATE_ITEM);
    }
  }

  async updateItem(id, updateItem) {
    try {
      await this.itemsModel.findOneAndUpdate({ _id: id }, updateItem);
      return HttpStatus.CREATED;
    } catch (e) {
      throw new ServerException(ERROR_UPDATE_ITEM);
    }
  }

  async deleteItem(id) {
    try {
      return await this.itemsModel.deleteOne({ _id: id });
    } catch (e) {
      throw new ServerException(ERROR_DELETE_ITEM);
    }
  }

  async initItems(token, urn, projectId) {
    try {
      const items = await this.modelDerivativeService.getManifestFromViews(
        token,
        urn,
        projectId,
      );
      const filteredItems = items.reduce((acc: ItemDto[], value: ItemDto) => {
        const isEqualItems = acc.find(
          (item) =>
            item.id_in_project === value?.id_in_project &&
            item.name === value?.name,
        );
        if (!isEqualItems) {
          acc.push(value);
        }
        return acc;
      }, []);
      if (items.length >= 1) {
        await this.createItem(filteredItems as ItemDto[]);
      }
      return HttpStatus.CREATED;
    } catch (e) {
      throw new ServerException(ERROR_CREATE_ITEM);
    }
  }
}
