import { z } from "zod";
import { SchemaNotificationsSearch } from "./notifications.schema";

export type NotificationsSearch = z.infer<typeof SchemaNotificationsSearch>;
