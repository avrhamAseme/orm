import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';


@Table({
    tableName: 'environments',
    timestamps: false,
})
export class Environment extends Model<Environment> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.STRING)
    declare name: string;

    @Column(DataType.STRING)
    declare url: string;

    @Column(DataType.STRING)
    declare username: string;

    @Column(DataType.STRING)
    declare password: string;
}