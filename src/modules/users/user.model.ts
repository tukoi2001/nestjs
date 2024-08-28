import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';
import { AuthRole } from 'src/enums/auth';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({
    match: /^(\+\d{1,3}[- ]?)?\d{10}$/,
    required: false,
  })
  phoneNumber: string;

  @Prop()
  address: string;

  @Prop({ default: AuthRole.USER })
  role: string;

  @Prop()
  @Exclude()
  refreshToken: string | null;

  @Prop()
  otp: string | null;

  @Prop()
  otpExpires: Date | null;

  @Prop({ default: false })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
