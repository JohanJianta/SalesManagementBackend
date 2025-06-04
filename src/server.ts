import app from "./app";
import "dotenv/config";

const port = parseInt(process.env.PORT || "3000", 10);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Swagger available at endpoint /api-docs`);
});
