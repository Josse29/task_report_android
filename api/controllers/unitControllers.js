import TaskRs from "../models/taskModel.js";
import Unitrs from "../models/unitrsModel.js";
export const createUnitRS = async (req, res) => {
  try {
    // destructered all request
    const { kode, nama, alamat } = req.body;
    // receive request shouldn't empty
    if (!kode || !nama || !alamat) {
      return res.status(404).json({ error: "Please input the fields" });
    }
    // create newUnitRs
    const newUnitRs = new Unitrs({
      kode,
      nama: nama.toLowerCase(),
      alamat,
    });
    //save user
    const newUnit = await newUnitRs.save();
    // respond from server to client
    return res.status(200).json({
      message: `Unit ${newUnit.nama} has been created`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const readUnitRS = async (req, res) => {
  try {
    const keyword = req.query.search
      ? { nama: { $regex: req.query.search, $options: "i" } }
      : {};
    const data = await Unitrs.find(keyword).populate("taskrs");
    return res.status(200).json({
      data,
      totalUnitRs: data.length,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const readUnitRSById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Unitrs.findById(id).populate("taskrs");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const readUnitRSByIdTaskDone = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Unitrs.findById(id).populate({
      path: "taskrs",
      match: { isDone: true },
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const readUnitRSByIdTaskProcess = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Unitrs.findById(id).populate({
      path: "taskrs",
      match: { isDone: false },
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const updateUnitRS = async (req, res) => {
  const { id } = req.params;
  const { kode, nama, alamat } = req.body;
  try {
    const updatedRs = await Unitrs.findByIdAndUpdate(
      id,
      { kode, nama, alamat },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: `${updatedRs.nama} has been updated` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteAllUnitRS = async (req, res) => {
  try {
    await Unitrs.deleteMany({});
    await TaskRs.deleteMany({});
    return res.status(200).json({ message: "All unitrs has been deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteUnitRSById = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Unitrs.findByIdAndDelete(id);
    await TaskRs.find({ idunitrs: id }).deleteMany({});
    return res
      .status(200)
      .json({ message: `Unit ${response.nama} telah terhapus` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
