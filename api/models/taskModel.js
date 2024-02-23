import mongoose from "mongoose";
const TaskRsSchema = mongoose.Schema(
  {
    idpengaju: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    nomorwa: {
      type: String,
    },
    judulTask: {
      type: String,
    },
    tanggalPengajuan: {
      type: Date,
    },
    tanggalPenyelesaian: {
      type: Date,
    },
    lamaPengerjaan: {
      type: String,
    },
    idunitrs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UnitRs",
    },
    idsupport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deskripsimasalah: {
      type: String,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    comments: { type: Array },
  },
  { timestamps: true }
);
const TaskRs = mongoose.model("TaskRs", TaskRsSchema);
export default TaskRs;
