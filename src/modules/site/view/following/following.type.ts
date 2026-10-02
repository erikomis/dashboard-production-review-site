import { z } from "zod";
import { SchemaFollowingSearch } from "./following.schema";

export type FollowingSearch = z.infer<typeof SchemaFollowingSearch>;
