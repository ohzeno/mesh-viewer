import { Module } from '@nestjs/common';
import { MeshesController } from './controllers/meshes.controller';
import { MeshesService } from './services/meshes.service';
import { MeshesStorageRepository } from './repositories/meshes.storage.repository';
import { MeshesS3Repository } from './repositories/meshes.s3.repository';
import { MeshesMongoDBRepository } from './repositories/meshes.mongodb.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Mesh, MeshSchema } from './meshes.schema';
import { meshCacheManager } from 'src/common/utils/mesh-cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mesh.name, schema: MeshSchema }]),
  ],
  controllers: [MeshesController],
  providers: [
    MeshesService,
    MeshesStorageRepository,
    MeshesS3Repository,
    MeshesMongoDBRepository,
    {
      provide: 'MeshCacheManager',
      useValue: meshCacheManager,
    },
  ],
})
export class MeshesModule {}
