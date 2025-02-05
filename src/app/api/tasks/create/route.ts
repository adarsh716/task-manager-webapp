import { NextResponse } from "next/server";
import Task from "@/lib/models/Task";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();
    // console.log(req.json())
    const { title, description, dueDate, isComplete, userId,priority } =
      await req.json();

    console.log({ title, description, dueDate, isComplete, userId,priority });
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const newTask = new Task({
      title,
      description,
      dueDate,
      isComplete,
      priority,
      userId,
    });
    await newTask.save();

    return NextResponse.json(
      { message: "Task created successfully", task: newTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
