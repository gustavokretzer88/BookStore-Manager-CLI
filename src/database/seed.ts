import { aplicaSQL } from "./connection";

aplicaSQL("reset.sql");
aplicaSQL("seed.sql");