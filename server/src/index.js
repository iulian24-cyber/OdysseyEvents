import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 10000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
