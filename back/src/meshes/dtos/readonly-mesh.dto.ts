import { PickType } from '@nestjs/swagger';
import { Mesh } from '../meshes.schema';

export class ReadOnlyMeshDto extends PickType(Mesh, [
  'id',
  'fileName',
  'fileType',
  'fileSize',
  'createdAt',
] as const) {}
