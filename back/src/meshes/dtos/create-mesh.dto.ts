import { PickType } from '@nestjs/swagger';
import { Mesh } from '../meshes.schema';

export class CreateMeshDto extends PickType(Mesh, [
  'fileName',
  'fileType',
  'objectKey',
  'fileSize',
  'contentHash',
] as const) {}
