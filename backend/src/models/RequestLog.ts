import mongoose, {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';

const RequestLogSchema = new Schema(
  {
    requestId: {
      type: String,
      required: true,
      index: true,
    },
    apiKeyId: {
      type: Schema.Types.ObjectId,
      ref: 'ApiKey',
      required: true,
      index: true,
    },
    model: {
      type: String,
      required: true,
      index: true,
    },
    tier: {
      type: String,
      enum: ['cheap', 'quality'],
      required: true,
    },
    routingScore: {
      type: Number,
      required: true,
    },
    cacheHit: {
      type: Boolean,
      default: false,
    },
    fallbackUsed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
      required: true,
    },
    latencyMs: {
      type: Number,
      required: true,
    },
    inputTokens: {
      type: Number,
      default: 0,
    },
    outputTokens: {
      type: Number,
      default: 0,
    },
    costUsd: {
      type: Number,
      default: 0,
    },
    errorType: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      expires: 60 * 60 * 24 * 30, // 30 days TTL
    },
  },
  {
    timestamps: false,
  }
);

// Compound indexes for common queries
RequestLogSchema.index({ apiKeyId: 1, createdAt: -1 });
RequestLogSchema.index({ model: 1, createdAt: -1 });
RequestLogSchema.index({ status: 1, createdAt: -1 });

export type RequestLogType = InferSchemaType<typeof RequestLogSchema>;
export type RequestLogDoc = HydratedDocument<RequestLogType>;

export const RequestLog: Model<RequestLogType> =
  (mongoose.models.RequestLog as Model<RequestLogType>) ||
  model<RequestLogType>('RequestLog', RequestLogSchema);