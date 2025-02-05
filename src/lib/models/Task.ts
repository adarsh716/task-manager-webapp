import mongoose from "mongoose"; 
import { Schema, model, models } from "mongoose";

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  priority:{type: String, required:true},
  isComplete: { type: Boolean, default: false },
});

const Task = models.Task || model("Task", taskSchema);

export default Task;
