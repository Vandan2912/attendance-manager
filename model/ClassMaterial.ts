import mongoose, { Schema, Document, Model } from "mongoose";

interface IClassMaterial extends Document {
  classId: mongoose.Schema.Types.ObjectId;
  fileName: string;
  filePath: string;
  uploadedBy: mongoose.Schema.Types.ObjectId;
  uploadedAt: Date;
}

const classMaterialSchema: Schema<IClassMaterial> = new Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export const ClassMaterial: Model<IClassMaterial> =
  mongoose.models.ClassMaterial || mongoose.model<IClassMaterial>("ClassMaterial", classMaterialSchema);
