import express from "express"
import mainRouter from "./routes/mainRouter"

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/v1', mainRouter);


app.listen(PORT, ()=>{
    console.log(`Your app is running at port ${PORT}`);
})
