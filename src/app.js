import express from "express";
import songsRoutes from "./routes/songs.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use('/api',songsRoutes);
app.use('/api',authRoutes);

app.use((req, res, next) => {
    res.status(404).json(
        {
            message: "Not found endpoint"
        }
    )
});

export default app;