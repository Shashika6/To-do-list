import mongoose from 'mongoose';

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum Recurrence {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  TEN_SECONDS = '10_seconds'
}

interface ITodo {
  title: string;
  status: boolean;
  priority: Priority;
  recurrence: Recurrence;
  nextOccurrence: Date;
  dependencies: ITodo[];
  createdAt: Date;
  updatedAt: Date;
  canComplete?: boolean;
}

const todoSchema = new mongoose.Schema<ITodo>({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [1, 'Task title must be at least 1 character long'],
    maxlength: [500, 'Task title cannot exceed 500 characters']
  },
  status: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: Object.values(Priority),
    default: Priority.MEDIUM
  },
  recurrence: {
    type: String,
    enum: Object.values(Recurrence),
    default: Recurrence.NONE
  },
  nextOccurrence: {
    type: Date,
    default: Date.now
  },
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// A check that is done to see if the task can be completed
todoSchema.virtual('canComplete').get(function(this: mongoose.Document & ITodo) {
  if (!this.dependencies || this.dependencies.length === 0) return true;
  return this.dependencies.every((dep: any) => dep.status === true);
});

export const Todo = mongoose.model<ITodo>('Todo', todoSchema); 