import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class UserT {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    age: number | null

    @Column('jsonb', { name: "address", nullable: true })
    address: string | null;

    @Column('jsonb', { name: "additional_info", nullable: true })
    additional_info: string | null;

}
