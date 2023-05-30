import { ItemDto } from './item.dto';

export class UpdateItemDto {
  readonly _id: string;
  readonly update_item: ItemDto;
}
