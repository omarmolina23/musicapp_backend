import express from "express";
import fileUpload from "express-fileupload";
import songsRoutes from "./routes/songs.routes.js";
import authRoutes from "./routes/auth.routes.js";
import googleRoutes from "./routes/google.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}  
));

app.use('/api',songsRoutes);
app.use('/api',authRoutes);
app.use('/api',googleRoutes);



app.use((req, res, next) => {
    res.status(404).json(
        {
            message: "Not found endpoint"
        }
    )
});

export default app;