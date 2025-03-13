import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { Mesh } from '../meshes.schema';
import { CreateMeshDto } from '../dtos/create-mesh.dto';
import { ReadOnlyMeshDto } from '../dtos/readonly-mesh.dto';

@Injectable()
export class MeshesMongoDBRepository {
  constructor(@InjectModel(Mesh.name) private meshModel: Model<Mesh>) {}

  async uploadMeshData(
    meshData: CreateMeshDto,
    session?: ClientSession,
  ): Promise<ReadOnlyMeshDto> {
    const mesh = new this.meshModel(meshData);
    await mesh.save({ session });
    return mesh.readOnlyData;
  }

  async existsByHash(contentHash: string): Promise<boolean> {
    const result = await this.meshModel.exists({ contentHash });
    return Boolean(result);
  }

  async getMeshList(): Promise<ReadOnlyMeshDto[]> {
    const meshList = await this.meshModel.find().sort({ createdAt: -1 }).exec();
    const meshListReadOnlyData = meshList.map((mesh) => mesh.readOnlyData);
    return meshListReadOnlyData;
  }

  async getMeshObjectKey(meshId: string) {
    const mesh = await this.meshModel.findById(meshId).exec();
    return {
      objectKey: mesh.objectKey,
      fileType: mesh.fileType,
    };
  }

  async deleteMeshById(meshId: string, session?: ClientSession): Promise<void> {
    await this.meshModel.findByIdAndDelete(meshId).session(session);
  }
}
