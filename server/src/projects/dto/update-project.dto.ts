export class UpdateProjectDto {
  readonly _id: string;
  readonly update_project: {
    readonly name?: string;
    readonly urn?: string;
    readonly bucket_key?: string;
    readonly version?: number;
    readonly date?: Date;
  };
}
