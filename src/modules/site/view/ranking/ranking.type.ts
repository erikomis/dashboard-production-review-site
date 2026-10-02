import { z } from "zod";
import { SchemaRankingSearch } from "./ranking.schema";

export type RankingSearch = z.infer<typeof SchemaRankingSearch>;
