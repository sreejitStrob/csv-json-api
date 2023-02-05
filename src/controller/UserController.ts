import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { UserT } from "../entity/User"
let csvToJson = require('convert-csv-to-json');
const fs = require("fs");
const csvParser = require("csv-parser");
import * as dotenv from 'dotenv'
dotenv.config()

export class UserController {

    private userRepository = AppDataSource.getRepository(UserT)

    async all(request: Request, response: Response, next: NextFunction) {
        const result = [];
        let responseData = []
        fs.createReadStream(process.env.CSV_FILE)
            .pipe(csvParser())
            .on("data", async (data) => {
          
                let innerObj:any = {}
                for (let path of Object.keys(data)) {
                    innerObj = await this.addProps(innerObj, path, data[path])
                    console.log(innerObj)
                }

                // mandatory field
                let userObj = {
                    name : innerObj?.name?.firstName +" "+innerObj?.name?.lastName,
                    age : innerObj?.age,
                    address : innerObj?.address,
                    additional_info : innerObj?.additional_info,
                }

                await AppDataSource.manager.save(
                    AppDataSource.manager.create(UserT, userObj)
                )
        
                result.push(innerObj)
            })
            .on("end", async () => {
            
                const rawData = await AppDataSource.manager.query(`select 
                CASE WHEN (age) < 20  THEN ' < 20'
                 WHEN (age) >= 20 and (age) <= 40 THEN '20-40'
                 WHEN (age) > 40 and (age) <= 60 THEN '40-60'
                 WHEN (age) > 60 THEN '> 60' 
                 END as age_group,COUNT('age_group') as age_count, (select  COUNT(*) from user_t) as total,(COUNT('age_group') * 100) / (select  COUNT(*) from user_t) as distribution
                from user_t group by age_group  HAVING COUNT('age_group') > 0;`);
                console.table(rawData)
                response.send(result);
            });

    }

    async addProps(obj, arr, val) {

        if (typeof arr == 'string')
            arr = arr.split(".");

        obj[arr[0]] = obj[arr[0]] || {};

        var tmpObj = obj[arr[0]];

        if (arr.length > 1) {
            arr.shift();
            this.addProps(tmpObj, arr, val);
        }
        else
            obj[arr[0]] = val;

        return obj;

    }
    
}