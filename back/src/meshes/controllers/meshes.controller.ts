import {
  Controller,
  Get,
  Res,
  Param,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { MeshesService } from '../services/meshes.service';
import { multerOptions } from '../../common/utils/multer-options';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { ReadOnlyMeshDto } from '../dtos/readonly-mesh.dto';
import { Throttle } from '@nestjs/throttler';
import { ErrorHandlerService } from '../../common/services/error-handler.service';

@Controller('meshes')
@UseFilters(HttpExceptionFilter)
export class MeshesController {
  constructor(
    private readonly meshesService: MeshesService,
    private readonly errorHandler: ErrorHandlerService,
  ) {}

  @Post('upload')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseInterceptors(FileInterceptor('mesh', multerOptions('temp')))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ReadOnlyMeshDto> {
    try {
      return await this.meshesService.uploadFile(file);
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  @Get('list')
  @Throttle({ default: { limit: 6, ttl: 20000 } })
  async getMeshList(): Promise<ReadOnlyMeshDto[]> {
    try {
      return await this.meshesService.getMeshList();
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  @Throttle({ default: { limit: 20, ttl: 20000 } })
  @Get('get/:id')
  async getMesh(@Param('id') meshId: string, @Res() res: Response) {
    try {
      const { fileStream, mimeType } = await this.meshesService.getMesh(meshId);
      res.setHeader('Content-Type', mimeType);
      fileStream.pipe(res);
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }
}
