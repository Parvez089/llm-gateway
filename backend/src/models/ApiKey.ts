import mongoose, {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';

const ApiKeySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    keyHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    keyPrefix: {
      type: String,
      required: true,
    },
    rateLimit: {
      capacity: { type: Number, required: true, default: 60 },
      refillPerSec: { type: Number, required: true, default: 1 },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export type ApiKeyType = InferSchemaType<typeof ApiKeySchema>;
export type ApiKeyDoc = HydratedDocument<ApiKeyType>;

export const ApiKey: Model<ApiKeyType> =
  (mongoose.models.ApiKey as Model<ApiKeyType>) ||
  model<ApiKeyType>('ApiKey', ApiKeySchema);