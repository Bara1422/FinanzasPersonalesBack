import "dotenv/config";
import app from "./app";
import { ENV } from "./config/env";

const PORT = ENV.PORT || 3000;
console.log(PORT)

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
