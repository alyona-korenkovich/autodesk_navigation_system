import { PropertyDto } from './properties.dto';

export class UpdatePropertyDto {
  readonly _id: string;
  readonly update_property: PropertyDto;
}
