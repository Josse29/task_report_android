import mongoose from "mongoose";
const UnitRsSchema = mongoose.Schema(
  {
    kode: {
      type: String,
    },
    nama: {
      type: String,
    },
    alamat: {
      type: String,
    },
    taskrs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TaskRs",
      },
    ],
    isDone: {
      type: Number,
      default: 0,
    },
    isProcess: {
      type: Number,
      default: 0,
    },
    
  },
  { timestamps: true }
);
const UnitRs = mongoose.model("UnitRs", UnitRsSchema);
export default UnitRs;
