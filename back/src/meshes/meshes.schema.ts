import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { SchemaOptions, Document } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Mesh extends Document {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  fileType: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  objectKey: string;

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty()
  fileSize: number;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  contentHash: string;

  @Prop()
  createdAt: Date;

  readonly readOnlyData: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: Date;
  };
}

export const MeshSchema = SchemaFactory.createForClass(Mesh);

MeshSchema.virtual('readOnlyData').get(function () {
  return {
    id: this._id,
    fileName: this.fileName,
    fileType: this.fileType,
    fileSize: this.fileSize,
    createdAt: this.createdAt,
  };
});

MeshSchema.index({ contentHash: 1 }); // 빠른 중복검사를 위함
MeshSchema.index({ createdAt: -1 }); // 내림차순 인덱스 추가
