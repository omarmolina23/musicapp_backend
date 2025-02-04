import express from "express";
import fileUpload from "express-fileupload";
import songsRoutes from "./routes/songs.routes.js";
import authRoutes from "./routes/auth.routes.js";
import googleRoutes from "./routes/google.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const allowedOrigins = ['http://localhost:5173', 'https://musicapp-owrmza8lk-omarmolinas-projects.vercel.app'];
const app = express();

app.use(cookieParser());

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
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