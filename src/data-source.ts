import "reflect-metadata"
import { DataSource } from "typeorm"
import { UserT } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "kiko",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [UserT],
    migrations: [],
    subscribers: [],
})
