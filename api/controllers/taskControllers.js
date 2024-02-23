import TaskRs from "../models/taskModel.js";
import UnitRs from "../models/unitrsModel.js";
import User from "../models/userModel.js";
export const getTaskRs = async (req, res) => {
  try {
    const data = await TaskRs.find()
      .populate("idpengaju", "fullname email profilePicture")
      .populate("idunitrs", "nama")
      .populate("idsupport", "fullname email profilePicture");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getTaskRsId = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await TaskRs.findById(id)
      .populate("idpengaju", "fullname profilePicture")
      .populate("idunitrs", "nama")
      .populate("idsupport", "fullname profilePicture");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getTaskRsIdSupport = async (req, res) => {
  const { idsupport } = req.query;
  try {
    const data = await TaskRs.find({ idsupport })
      .populate("idpengaju", "fullname profilePicture")
      .populate("idunitrs", "nama")
      .populate("idsupport", "fullname profilePicture");
    const totalTaskDone = await TaskRs.find({ idsupport }).find({
      isDone: true,
    });
    const totalTaskProgress = await TaskRs.find({ idsupport }).find({
      isDone: false,
    });
    return res.status(200).json({
      data,
      totalTask: data.length,
      totalTaskDone: totalTaskDone.length,
      totalTaskProgress: totalTaskProgress.length,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getTaskDoneRsIdSupport = async (req, res) => {
  const { idsupport } = req.query;
  try {
    const taskDone = await TaskRs.find({ idsupport })
      .find({
        isDone: true,
      })
      .populate("idunitrs", "nama");
    return res.status(200).json({
      taskDone,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getTaskDoneByRsId = async (req, res) => {
  const { idunitrs } = req.query;
  try {
    const taskDone = await TaskRs.find({ idunitrs }).find({
      isDone: true,
    });
    return res.status(200).json({
      taskDone,
      totalTaskDone: taskDone.length,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getTaskProcessRsIdSupport = async (req, res) => {
  const { idsupport } = req.query;
  try {
    const taskProcess = await TaskRs.find({ idsupport })
      .find({
        isDone: false,
      })
      .populate("idunitrs", "nama");
    return res.status(200).json({
      taskProcess,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getTaskProcessByRsId = async (req, res) => {
  const { idunitrs } = req.query;
  try {
    const taskProcess = await TaskRs.find({ idunitrs }).find({
      isDone: false,
    });
    return res.status(200).json({
      taskProcess,
      totalTaskProcess: taskProcess.length,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getTaskDone = async (req, res) => {
  try {
    const data = await TaskRs.find({
      isDone: true,
    })
      .populate("idpengaju", "fullname profilePicture")
      .populate("idunitrs", "nama")
      .populate("idsupport", "fullname profilePicture");
    return res.status(200).json({
      data,
      totalTaskDone: data.length,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getTaskProcess = async (req, res) => {
  try {
    const data = await TaskRs.find({
      isDone: false,
    })
      .populate("idpengaju", "fullname profilePicture")
      .populate("idunitrs", "nama")
      .populate("idsupport", "fullname profilePicture");
    return res.status(200).json({
      data,
      totalTaskProcess: data.length,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const createTaskRs = async (req, res) => {
  // destructured all request  body into variable
  const {
    idpengaju,
    nomorwa,
    judulTask,
    tanggalPengajuan,
    idunitrs,
    idsupport,
    deskripsimasalah,
    pesan,
  } = req.body;
  try {
    if (
      !tanggalPengajuan ||
      !idpengaju ||
      !judulTask ||
      !idsupport ||
      !nomorwa ||
      !idunitrs ||
      !deskripsimasalah ||
      !pesan
    ) {
      return res.status(404).json({ error: "mohon isi semua field" });
    }
    const newTaskRs = new TaskRs({
      idpengaju,
      nomorwa,
      judulTask: judulTask.toLowerCase(),
      tanggalPengajuan: new Date(),
      idunitrs,
      idsupport,
      deskripsimasalah,
    });
    const saveTaskRs = await newTaskRs.save();
    const detailSender = await User.findById(idpengaju).select(
      "fullname email profilePicture"
    );
    const comment = {
      id: saveTaskRs.comments.length + 1,
      date: new Date(),
      sender: detailSender,
      content: pesan,
    };
    // leave comment
    await TaskRs.findByIdAndUpdate(
      saveTaskRs._id,
      { $push: { comments: comment } },
      { new: true }
    );
    // push taskrs to unitrs
    await UnitRs.findByIdAndUpdate(
      idunitrs,
      {
        $push: {
          taskrs: saveTaskRs._id,
        },
      },
      {
        new: true,
      }
    );
    const getTaskDone = await UnitRs.findById(idunitrs).populate({
      path: "taskrs",
      match: { isDone: true },
    });
    const getTaskProcess = await UnitRs.findById(idunitrs).populate({
      path: "taskrs",
      match: { isDone: false },
    });
    await UnitRs.findByIdAndUpdate(
      idunitrs,
      {
        $set: {
          isDone: getTaskDone.taskrs.length,
          isProcess: getTaskProcess.taskrs.length,
        },
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json({ message: `Task ${newTaskRs.judulTask} berhasil ditambahkan` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const createTaskAlreadyDone = async (req, res) => {
  const { id } = req.params;
  const { idpengaju, idunitrs, pesan } = req.body;
  try {
    // set tanggal penyelesiaan
    const response = await TaskRs.findByIdAndUpdate(
      id,
      {
        $set: {
          isDone: true,
          tanggalPenyelesaian: new Date(),
        },
      },
      {
        new: true,
      }
    );
    // Start logic change lamaPengerjaan
    const getTaskRs = await TaskRs.findById(id);
    const tanggalPengajuants = new Date(getTaskRs.tanggalPengajuan).getTime();
    const tanggalPenyelesaiants = new Date(
      getTaskRs.tanggalPenyelesaian
    ).getTime();
    const timeDifference = Math.abs(tanggalPenyelesaiants - tanggalPengajuants);
    const selisihHari = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const selisihJam = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const selisihMenit = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const selisihDetik = Math.floor((timeDifference % (1000 * 60)) / 1000);
    let formattedDifference = "";
    if (selisihHari > 0) {
      formattedDifference =
        selisihHari +
        " hari " +
        selisihJam +
        " jam " +
        selisihMenit +
        " menit " +
        selisihDetik +
        " detik";
    } else if (selisihJam > 0) {
      formattedDifference =
        selisihJam +
        " jam " +
        selisihMenit +
        " menit " +
        selisihDetik +
        " detik";
    } else if (selisihMenit > 0) {
      formattedDifference = selisihMenit + " menit " + selisihDetik + " detik";
    } else {
      formattedDifference = selisihDetik + " detik";
    }
    // end logic change lamaPengerjaan
    // set lama pengerjaan
    await TaskRs.findByIdAndUpdate(
      id,
      {
        $set: {
          lamaPengerjaan: formattedDifference,
        },
      },
      {
        new: true,
      }
    );
    // leave comment
    const detailSender = await User.findById(idpengaju).select(
      "fullname email profilePicture"
    );
    const comment = {
      id: getTaskRs.comments.length + 1,
      date: new Date(),
      sender: detailSender,
      content: pesan,
    };
    await TaskRs.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    );
    // set value length process and done
    const getTaskDone = await UnitRs.findById(idunitrs).populate({
      path: "taskrs",
      match: { isDone: true },
    });
    const getTaskProcess = await UnitRs.findById(idunitrs).populate({
      path: "taskrs",
      match: { isDone: false },
    });
    await UnitRs.findByIdAndUpdate(
      idunitrs,
      {
        $set: {
          isDone: getTaskDone.taskrs.length,
          isProcess: getTaskProcess.taskrs.length,
        },
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json({ message: `Task ${response.judulTask} telah selesai ` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const replyComment = async (req, res) => {
  const { id } = req.params;
  const { pesan, idpengaju } = req.body;
  try {
    const detailSender = await User.findById(idpengaju).select(
      "fullname email profilePicture"
    );
    const getTaskRsId = await TaskRs.findById(id);
    const comment = {
      id: getTaskRsId.comments.length + 1,
      date: new Date(),
      sender: detailSender,
      content: pesan,
    };
    await TaskRs.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    );
    return res.status(200).json({ message: "pesan sudah dikirim" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const editTaskRs = async (req, res) => {
  const { id } = req.params;
  const {
    idpengaju,
    judulTask,
    nomorwa,
    idsupport,
    deskripsimasalah,
    idunitrs,
  } = req.body;
  try {
    const response = await TaskRs.findByIdAndUpdate(
      id,
      {
        $set: {
          idpengaju,
          judulTask,
          nomorwa,
          idsupport,
          deskripsimasalah,
          idunitrs,
        },
      },
      {
        new: true,
      }
    );
    if (idunitrs) {
      const getTaskDone = await UnitRs.findById(idunitrs).populate({
        path: "taskrs",
        match: { isDone: true },
      });
      const getTaskProcess = await UnitRs.findById(idunitrs).populate({
        path: "taskrs",
        match: { isDone: false },
      });
      await UnitRs.findByIdAndUpdate(
        idunitrs,
        {
          $set: {
            isDone: getTaskDone.taskrs.length,
            isProcess: getTaskProcess.taskrs.length,
          },
        },
        {
          new: true,
        }
      );
    }
    return res
      .status(200)
      .json({ message: `Task ${response.judulTask} telah berhasil diubah` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const changeTaskToUnit = async (req, res) => {};
export const deleteIdTaskRs = async (req, res) => {
  const { id } = req.params;
  const { idunitrs } = req.body;
  try {
    await UnitRs.findByIdAndUpdate(
      idunitrs,
      {
        $pull: {
          taskrs: id,
        },
      },
      {
        new: true,
      }
    );
    const response = await TaskRs.findByIdAndDelete(id);
    const getTaskDone = await UnitRs.findById(idunitrs)
      .select("taskrs")
      .populate({
        path: "taskrs",
        match: { isDone: true },
      });
    const getTaskProcess = await UnitRs.findById(idunitrs)
      .select("taskrs")
      .populate({
        path: "taskrs",
        match: { isDone: false },
      });
    await UnitRs.findByIdAndUpdate(
      idunitrs,
      {
        $set: {
          isDone: getTaskDone.taskrs.length,
          isProcess: getTaskProcess.taskrs.length,
        },
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json({ message: ` Task ${response.judulTask} berhasil dihapus ` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const deleteAllTask = async (req, res) => {
  try {
    // edit value all field isDone and isProcess tobe zero
    await UnitRs.updateMany(
      {},
      {
        $set: {
          isDone: 0,
          isProcess: 0,
        },
      },
      {
        new: true,
      }
    );
    // reset value field all taskrs to be array empty
    await UnitRs.updateMany(
      {},
      {
        $set: {
          taskrs: [],
        },
      },
      {
        new: true,
      }
    );
    await TaskRs.deleteMany({});
    return res.status(200).json({ message: "success all reset taskrs" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
