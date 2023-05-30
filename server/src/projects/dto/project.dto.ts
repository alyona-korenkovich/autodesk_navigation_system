export class ProjectDto {
  readonly _id?: string;
  readonly name: string;
  readonly urn: string;
  readonly bucket_key: string;
  readonly version?: number;
  readonly date?: Date;
  readonly image?: File;
}
