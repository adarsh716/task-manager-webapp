import { NextResponse } from "next/server";
import Task from "@/lib/models/Task";
import { connectDB } from "@/lib/mongodb";

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("id");

    if (!taskId) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const { title, description, dueDate, isComplete, priority } = await req.json();

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, description, dueDate, isComplete, priority },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task updated successfully", task: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("id");
    
    if (!taskId) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }
    
    const task = await Task.findById(taskId);
    console.log("GET request received");
    console.log(task)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

