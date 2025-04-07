import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import todoRoutes from './routes/todoRoutes';
import { startRecurringTasks } from './services/recurringTasksService';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

connectDB();

startRecurringTasks();

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('/api/todos', todoRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 