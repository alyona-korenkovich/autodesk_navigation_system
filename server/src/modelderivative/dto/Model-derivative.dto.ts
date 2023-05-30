export class ModelDerivativeDto {
  objectName: string;
}

class MetadataViews {
  name: string;
  role: string;
  guid: string;
}

export class ModelDerivativeMetadataViews {
  type: string;
  metadata: Array<MetadataViews>;
}
