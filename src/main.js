import { logger } from "./application/logging.js";
import { web } from "./application/web.js";
import dotenv from "dotenv";

web.listen(3000, () => {
  logger.info("App Start");
});

dotenv.config();
